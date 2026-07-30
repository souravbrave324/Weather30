import React, { useEffect, useRef } from 'react';

export default function CloudBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initClouds();
    };

    window.addEventListener('resize', handleResize);

    // Particle / Cloud Puff System
    let clouds = [];
    const cloudCount = 18;

    function initClouds() {
      clouds = [];
      for (let i = 0; i < cloudCount; i++) {
        clouds.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 250 + 150,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.25 + 0.1,
          phase: Math.random() * Math.PI * 2,
          speed: 0.005 + Math.random() * 0.005,
        });
      }
    }

    initClouds();

    // Subtle ambient mist particles
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.1,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let tick = 0;

    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      // Deep atmospheric background gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.3,
        height * 0.3,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#232830');
      bgGrad.addColorStop(0.4, '#13161c');
      bgGrad.addColorStop(1, '#06080b');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Soft Cloud Blobs with screen blending
      ctx.globalCompositeOperation = 'screen';

      clouds.forEach((cloud) => {
        cloud.x += cloud.vx;
        cloud.y += cloud.vy;
        cloud.phase += cloud.speed;

        // Wrap around screen boundaries
        if (cloud.x < -cloud.radius) cloud.x = width + cloud.radius;
        if (cloud.x > width + cloud.radius) cloud.x = -cloud.radius;
        if (cloud.y < -cloud.radius) cloud.y = height + cloud.radius;
        if (cloud.y > height + cloud.radius) cloud.y = -cloud.radius;

        const currentAlpha = cloud.alpha + Math.sin(cloud.phase) * 0.05;

        const grad = ctx.createRadialGradient(
          cloud.x,
          cloud.y,
          0,
          cloud.x,
          cloud.y,
          cloud.radius
        );

        grad.addColorStop(0, `rgba(180, 195, 210, ${currentAlpha})`);
        grad.addColorStop(0.5, `rgba(120, 135, 150, ${currentAlpha * 0.5})`);
        grad.addColorStop(1, 'rgba(10, 15, 22, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render floating light particles
      ctx.globalCompositeOperation = 'source-over';
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * (0.6 + Math.sin(tick * 0.03 + p.x) * 0.4)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
}
