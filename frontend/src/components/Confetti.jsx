import React, { useEffect } from 'react';

export default function Confetti({ trigger }) {
  useEffect(() => {
    if (!trigger) return;
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    let confetti = [];
    for (let i = 0; i < 150; i++) {
      confetti.push({
        x: Math.random() * width,
        y: Math.random() * -height,
        r: Math.random() * 6 + 4,
        d: Math.random() * 150 + 50,
        color: `hsl(${Math.random()*360},90%,60%)`,
        tilt: Math.random() * 10 - 10,
        tiltAngle: 0
      });
    }
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (let c of confetti) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
        ctx.fillStyle = c.color;
        ctx.fill();
      }
      update();
      frame++;
      if (frame < 180) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, width, height);
    }
    function update() {
      for (let c of confetti) {
        c.y += Math.cos(frame/10) + 2 + c.d/100;
        c.x += Math.sin(frame/10) * 2;
        if (c.y > height) {
          c.y = Math.random() * -20;
          c.x = Math.random() * width;
        }
      }
    }
    draw();
    return () => ctx.clearRect(0, 0, width, height);
  }, [trigger]);

  return (
    <canvas id="confetti-canvas" className="fixed inset-0 pointer-events-none z-[1000]" style={{width:'100vw',height:'100vh'}} />
  );
}
