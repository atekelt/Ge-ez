// Web Audio Synthesizer and Natural Human Amharic Voice Engine

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private speechEnabled: boolean = true;
  private audioCache = new Map<string, string>();
  private currentAudioElement: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;
  private listeners = new Set<(speaking: boolean) => void>();

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSpeechEnabled(enabled: boolean) {
    this.speechEnabled = enabled;
  }

  public isSpeechEnabled(): boolean {
    return this.speechEnabled;
  }

  public subscribeSpeaking(callback: (speaking: boolean) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifySpeaking(speaking: boolean) {
    this.isSpeaking = speaking;
    this.listeners.forEach((fn) => fn(speaking));
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public playTap() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  public playSuccess() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        const startTime = this.ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {
      // ignore
    }
  }

  public playCombineSound() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(587.33, this.ctx.currentTime + 0.15);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(330, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.45);
      osc2.stop(this.ctx.currentTime + 0.45);
    } catch {
      // ignore
    }
  }

  public playTryAgain() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // ignore
    }
  }

  public playFanfare() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [261.63, 392.00, 523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const start = this.ctx.currentTime + idx * 0.1;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.3, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Speaks the authentic native Amharic number audio pronunciation.
   */
  public async speakAmharic(amharicText: string): Promise<void> {
    if (!this.speechEnabled || !amharicText) return;

    // Normalize numbers between 11 and 19: "አስር" / "አሥር" followed by unit is read as "አስራ"
    const trimmed = amharicText.trim().replace(/^(?:አስር|አሥር)\s+/i, 'አስራ ');

    // Stop any existing audio playback
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }

    this.notifySpeaking(true);

    try {
      // 1. Check client-side memory cache
      let audioUri = this.audioCache.get(trimmed);

      if (!audioUri) {
        const response = await fetch('/api/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: trimmed }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.audio) {
            audioUri = data.audio;
            this.audioCache.set(trimmed, data.audio);
          }
        }
      }

      if (audioUri) {
        const audio = new Audio(audioUri);
        this.currentAudioElement = audio;

        audio.onended = () => {
          this.notifySpeaking(false);
          this.currentAudioElement = null;
        };

        audio.onerror = () => {
          this.notifySpeaking(false);
          this.fallbackSpeech(trimmed);
        };

        await audio.play();
        return;
      }
    } catch {
      // Audio service temporary issue
    }

    // Local device fallback (only if native Amharic voice is installed)
    this.fallbackSpeech(trimmed);
  }

  /**
   * Device speech fallback strictly using native Amharic voice if installed
   */
  private fallbackSpeech(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.notifySpeaking(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const voices = window.speechSynthesis.getVoices();
      const amVoice = voices.find(v => v.lang.startsWith('am') || v.lang.startsWith('gez'));

      if (!amVoice) {
        // Do not speak with English voice to prevent robotic / inaccurate pronunciation
        this.notifySpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = amVoice;
      utterance.rate = 0.85;

      utterance.onend = () => this.notifySpeaking(false);
      utterance.onerror = () => this.notifySpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      this.notifySpeaking(false);
    }
  }

  /**
   * General speak wrapper defaulting to authentic Amharic human voice
   */
  public speak(text: string, lang = 'am') {
    this.speakAmharic(text);
  }
}

export const soundManager = new SoundManager();
