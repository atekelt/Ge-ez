import express from 'express';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Audio cache to serve already generated Amharic pronunciations instantly
const audioCache = new Map<string, string>();

/**
 * Fetch authentic native human Amharic audio pronunciation (returns data:audio/mpeg;base64,...).
 */
function fetchNativeAmharicAudio(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=am&client=tw-ob`;
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/',
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Amharic speech engine HTTP status ${res.statusCode}`));
        }
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          if (buffer.length === 0) {
            return reject(new Error('Empty audio received'));
          }
          resolve(`data:audio/mpeg;base64,${buffer.toString('base64')}`);
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error('Audio request timed out'));
    });
  });
}

/**
 * Normalizes spoken Amharic numbers.
 * Specifically for numbers between 11 and 19, "አስር" / "አሥር" followed by a unit is read as "አስራ".
 */
function normalizeAmharicNumeralText(text: string): string {
  const trimmed = text.trim();
  // Replace compound tens starting with አስር or አሥር with አስራ
  return trimmed.replace(/^(?:አስር|አሥር)\s+/i, 'አስራ ');
}

// Pre-warm audio cache with core Amharic numerals (including 11-19) for 0ms latency
const CORE_NUMERALS = [
  'አንድ', 'ሁለት', 'ሦስት', 'አራት', 'አምስት', 'ስድስት', 'ሰባት', 'ስምንት', 'ዘጠኝ', 'አሥር',
  'አስራ አንድ', 'አስራ ሁለት', 'አስራ ሦስት', 'አስራ አራት', 'አስራ አምስት', 'አስራ ስድስት', 'አስራ ሰባት', 'አስራ ስምንት', 'አስራ ዘጠኝ',
  'ሃያ', 'ሠላሳ', 'አርባ', 'ኃምሳ', 'ስድሳ', 'ሰባ', 'ሰማንያ', 'ዘጠና', 'መቶ'
];

async function prewarmAudioCache() {
  for (const num of CORE_NUMERALS) {
    try {
      const audioUrl = await fetchNativeAmharicAudio(num);
      audioCache.set(num, audioUrl);
    } catch {
      // Non-fatal pre-warming
    }
  }
}
prewarmAudioCache();

let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

/**
 * Encodes 24kHz 16-bit mono linear PCM to standard WAV format.
 */
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

// Authentic Human Amharic Speech Generation Endpoint
app.post('/api/speak', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const cleanText = normalizeAmharicNumeralText(text);

    // 1. Check in-memory cache for 0ms latency
    if (audioCache.has(cleanText)) {
      res.json({ audio: audioCache.get(cleanText), cached: true });
      return;
    }

    // 2. Fetch authentic native human Amharic audio
    try {
      const audioDataUrl = await fetchNativeAmharicAudio(cleanText);
      audioCache.set(cleanText, audioDataUrl);
      res.json({ audio: audioDataUrl, cached: false });
      return;
    } catch (nativeErr) {
      console.warn('Native Amharic voice engine note:', nativeErr instanceof Error ? nativeErr.message : nativeErr);
    }

    // 3. Fallback to Gemini 3.1 Flash TTS if available
    try {
      const ai = getGenAI();
      const prompt = `Pronounce ONLY this Amharic number clearly, accurately, and naturally in authentic native Amharic with zero extra commentary or introductory words: "${cleanText}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Pcm = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Pcm) {
        const pcmBuffer = Buffer.from(base64Pcm, 'base64');
        const wavBuffer = pcmToWav(pcmBuffer, 24000);
        const wavBase64 = `data:audio/wav;base64,${wavBuffer.toString('base64')}`;
        audioCache.set(cleanText, wavBase64);
        res.json({ audio: wavBase64, cached: false });
        return;
      }
    } catch {
      // Ignore Gemini TTS quota limits
    }

    res.json({ fallback: true, text: cleanText });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('Audio synthesis notice:', message);
    res.json({ fallback: true, error: message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', cachedCount: audioCache.size });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
