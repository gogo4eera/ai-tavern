import React, { useEffect, useRef } from 'react';

interface NPCSpriteProps {
  name: string;
  age: number;
  role: string;
  mood: string;
  isThinking: boolean;
}

export const NPCSprite: React.FC<NPCSpriteProps> = ({ name, age, role, mood, isThinking }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frameCount = 0;

    // Drawing settings
    const scale = 4; // 24x24 grid scaled by 4x = 96x96 pixels

    // Setup pseudo-random generator based on seed
    let seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rand = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Deterministic colors based on seeds
    const skinColor = `hsl(${30 + rand() * 10}, ${50 + rand() * 20}%, ${50 + rand() * 20}%)`;

    // Hair color (desaturated if old)
    let hairColor: string;
    if (age > 60) {
      const grey = Math.floor(180 + rand() * 50);
      hairColor = `rgb(${grey}, ${grey}, ${grey})`;
    } else {
      const colors = ['#4a2f13', '#d19c38', '#b5441b', '#1f1f1f'];
      hairColor = colors[Math.floor(rand() * colors.length)];
    }

    // Outfit color based on role
    let outfitColor = '#777';
    if (role === 'wizard') outfitColor = '#592d8f';
    else if (role === 'warrior') outfitColor = '#6b7a82';
    else if (role === 'bartender') outfitColor = '#2b783c';
    else if (role === 'rogue') outfitColor = '#1f2421';

    // Helper function to draw a logical pixel block
    const drawPixel = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    };

    // Animation Loop (Breathing bounce)
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // Breathing bounce offset (shifts upper body down by 1px every 30 frames)
      // If thinking, speed up the breathing to simulate worry/action
      const period = isThinking ? 15 : 30;
      const bounceOffset = Math.floor((frameCount % (period * 2)) / period) === 0 ? 0 : 1;

      // Hunch offset for sad/old characters
      const headYOffset = age > 70 || mood === 'sad' ? 1 : 0;

      // 1. Draw Legs (Row 18-21, static)
      for (let y = 18; y < 22; y++) {
        drawPixel(10, y, '#222'); // Left leg
        drawPixel(12, y, '#222'); // Right leg
      }
      // Feet
      drawPixel(9, 21, '#111');
      drawPixel(13, 21, '#111');

      // 2. Draw Torso (Row 11-17, Cols 9-13) - responds to bounce offset
      const torsoStartY = 11 + bounceOffset;
      for (let y = torsoStartY; y < 18; y++) {
        for (let x = 9; x <= 13; x++) {
          drawPixel(x, y, outfitColor);
        }
      }

      // 3. Draw Head (Row 5-10, Cols 9-13) - responds to bounce + headYOffset
      const headStartY = 5 + headYOffset + bounceOffset;
      for (let y = headStartY; y < headStartY + 5; y++) {
        for (let x = 9; x <= 13; x++) {
          drawPixel(x, y, skinColor);
        }
      }

      // 4. Draw Face Details (relative to headStartY)
      const eyeY = headStartY + 2;
      const eyeColor = mood === 'angry' ? '#d93b3b' : '#333';
      drawPixel(10, eyeY, eyeColor);
      drawPixel(12, eyeY, eyeColor);

      // Eyebrows for angry mood
      if (mood === 'angry') {
        drawPixel(9, eyeY - 1, '#111');
        drawPixel(10, eyeY - 1, '#111');
        drawPixel(12, eyeY - 1, '#111');
        drawPixel(13, eyeY - 1, '#111');
      }

      // Mouth (relative to headStartY)
      const mouthY = headStartY + 4;
      if (mood === 'happy') {
        drawPixel(10, mouthY, '#8a2b2b');
        drawPixel(11, mouthY + 1, '#8a2b2b');
        drawPixel(12, mouthY, '#8a2b2b');
      } else if (mood === 'sad') {
        drawPixel(10, mouthY + 1, '#421f1f');
        drawPixel(11, mouthY, '#421f1f');
        drawPixel(12, mouthY + 1, '#421f1f');
      } else {
        // Calm / Neutral / Thinking
        drawPixel(10, mouthY, '#421f1f');
        drawPixel(11, mouthY, '#421f1f');
        drawPixel(12, mouthY, '#421f1f');
      }

      // 5. Draw Hair / Headwear
      if (role === 'wizard') {
        // Draw Wizard Hat (Purple cone)
        for (let x = 8; x <= 14; x++) drawPixel(x, headStartY, '#592d8f'); // brim
        for (let x = 9; x <= 13; x++) drawPixel(x, headStartY - 1, '#592d8f');
        for (let x = 10; x <= 12; x++) drawPixel(x, headStartY - 2, '#592d8f');
        drawPixel(11, headStartY - 3, '#d4af37'); // Gold star tip
      } else {
        // Draw Standard Hair
        for (let x = 9; x <= 13; x++) drawPixel(x, headStartY - 1, hairColor); // top hair
        drawPixel(8, headStartY, hairColor); // sideburns left
        drawPixel(14, headStartY, hairColor); // sideburns right
      }

      // 6. Role-Specific Items (Front hands) - responds to bounce offset
      if (role === 'wizard') {
        // Staff in left hand
        for (let y = 10 + bounceOffset; y < 21; y++) {
          drawPixel(7, y, '#6b4724'); // Staff body
        }
        drawPixel(7, 9 + bounceOffset, '#4287f5'); // Glowing blue orb
      } else if (role === 'bartender') {
        // White apron over torso
        for (let y = 13 + bounceOffset; y < 18; y++) {
          drawPixel(10, y, '#fcfcfc');
          drawPixel(11, y, '#fcfcfc');
          drawPixel(12, y, '#fcfcfc');
        }
        // Mug in hand
        drawPixel(8, 14 + bounceOffset, '#b88130');
        drawPixel(8, 15 + bounceOffset, '#b88130');
        drawPixel(7, 14 + bounceOffset, '#f5eedc'); // Foam
      } else if (role === 'warrior') {
        // Sword on back
        for (let y = 9 + bounceOffset; y < 14; y++) {
          drawPixel(7, y, '#9c9c9c'); // Blade
        }
        drawPixel(7, 14 + bounceOffset, '#e6b122'); // Hilt
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [name, age, role, mood, isThinking]);

  return (
    <div className="sprite-container" data-testid="npc-sprite">
      <canvas
        ref={canvasRef}
        width={96}
        height={96}
        className="npc-canvas pixel-art"
        data-testid="npc-canvas"
      />
    </div>
  );
};
