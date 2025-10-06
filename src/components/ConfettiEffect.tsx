// Confetti effect component for Parker Richards Music - favicon confetti on click
import React from 'react';
import confetti from 'canvas-confetti';
import favicon from '../assets/favicon.svg';

interface ConfettiEffectProps {
  onTrigger: () => void;
}

export function ConfettiEffect({ onTrigger }: ConfettiEffectProps) {
  const triggerConfetti = React.useCallback(() => {
    // Create custom confetti with favicon shapes
    const createFaviconConfetti = () => {
      // Create a canvas to draw the favicon
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = 20;
        canvas.height = 20;
        ctx?.drawImage(img, 0, 0, 20, 20);
        
        // Convert canvas to confetti shape
        const faviconConfetti = confetti.create(undefined, {
          resize: true,
          useWorker: true,
        });
        
        // Launch confetti up and to the right
        faviconConfetti({
          particleCount: 50,
          angle: 45, // Up and to the right
          spread: 30,
          origin: { x: 0.3, y: 0.5 }, // Start from left-center where logo is
          colors: ['#F3DAC3', '#FFFFFF', '#FFD700', '#FFA500'],
          shapes: ['circle', 'square'],
          scalar: 0.8,
          gravity: 1.2,
          drift: 0.5,
          ticks: 300,
        });
        
        // Add a second burst for more effect
        setTimeout(() => {
          faviconConfetti({
            particleCount: 30,
            angle: 60,
            spread: 25,
            origin: { x: 0.3, y: 0.5 },
            colors: ['#F3DAC3', '#FFFFFF'],
            shapes: ['circle'],
            scalar: 0.6,
            gravity: 1.0,
            drift: 0.3,
            ticks: 250,
          });
        }, 100);
      };
      
      img.src = favicon;
    };
    
    createFaviconConfetti();
    onTrigger();
  }, [onTrigger]);

  return { triggerConfetti };
}