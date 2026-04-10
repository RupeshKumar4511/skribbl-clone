import React, { useEffect, useRef } from 'react';

const FaceCanvas = ({ faces = [
  { color: '#ff1f1f', type: 'nerd' },
  { color: '#ff8c00', type: 'crowned' },
  { color: '#fff000', type: 'teeth' },
  { color: '#32ff00', type: 'dizzy' },
  { color: '#00ccff', type: 'cool' },
  { color: '#4b00ff', type: 'sad' },
  { color: '#b000ff', type: 'bearded' },
  { color: '#ff69b4', type: 'happy' }
]}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawCharacter = (x, y, face) => {
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#000000';
      ctx.fillStyle = face.color;

      // --- 1. COMBINED SILHOUETTE (Body + Head Attached) ---
      ctx.beginPath();
      // Start at bottom left of torso
      ctx.moveTo(x - 22, y + 40); 
      // Left shoulder curve leading into neck
      ctx.quadraticCurveTo(x - 18, y + 18, x - 15, y + 15); 
      // The Head (Circular top)
      ctx.arc(x, y, 18, Math.PI * 0.9, Math.PI * 0.1, false); 
      // Right shoulder curve
      ctx.quadraticCurveTo(x + 18, y + 18, x + 22, y + 40); 
      // Bottom of torso
      ctx.lineTo(x - 22, y + 40);
      
      ctx.fill();   // Fills the whole person as one unit
      ctx.stroke(); // Outlines the whole person as one unit

      // --- 2. SPECIAL ACCESSORIES ---
      if (face.type === 'crowned') {
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.moveTo(x - 12, y - 16);
        ctx.lineTo(x - 18, y - 28);
        ctx.lineTo(x - 8, y - 20);
        ctx.lineTo(x, y - 30);
        ctx.lineTo(x + 8, y - 20);
        ctx.lineTo(x + 18, y - 28);
        ctx.lineTo(x + 12, y - 16);
        ctx.fill(); ctx.stroke();
      }

      // --- 3. FACIAL FEATURES ---
      ctx.fillStyle = '#000000';
      
      if (face.type === 'cool') {
        // Sunglasses (Simple Rects)
        ctx.fillRect(x - 13, y - 6, 11, 7);
        ctx.fillRect(x + 2, y - 6, 11, 7);
        ctx.strokeRect(x - 13, y - 6, 11, 7);
        ctx.strokeRect(x + 2, y - 6, 11, 7);
      } else {
        // Standard Eyes
        ctx.beginPath();
        ctx.arc(x - 7, y - 4, 3, 0, Math.PI * 2);
        ctx.arc(x + 7, y - 4, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mouth variations
      ctx.beginPath();
      if (face.type === 'sad') {
        ctx.arc(x, y + 12, 6, Math.PI * 1.1, Math.PI * 1.9); // Frown
      } else {
        ctx.arc(x, y + 6, 6, 0.1 * Math.PI, 0.9 * Math.PI); // Smile
      }
      ctx.stroke();
    };

    faces.forEach((face, index) => {
      drawCharacter(40 + index * 65, 45, face);
    });
  }, [faces]);

  return (
    <canvas 
      ref={canvasRef} 
      width={faces.length * 70} 
      height={100} 
      style={{ display: 'block' }}
    />
  );
};

export default FaceCanvas;
