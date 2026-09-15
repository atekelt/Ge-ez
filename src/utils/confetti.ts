import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  // Ethiopian flag palette (Green, Gold, Red/Terracotta) + celebratory sparkle
  const colors = ['#2D6A2F', '#C8961E', '#B85C38', '#F4E4C1', '#52B788'];

  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.65 },
      colors,
      ticks: 200,
      gravity: 1.1,
      scalar: 1.1,
    });
  } catch {
    // fallback if canvas not available
  }
}

export function fireBigVictoryConfetti() {
  const colors = ['#2D6A2F', '#C8961E', '#B85C38', '#F4E4C1', '#FFD166'];
  const end = Date.now() + 1200;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}
