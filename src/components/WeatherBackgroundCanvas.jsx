import React, { useEffect, useRef } from 'react';

export default function WeatherBackgroundCanvas({ bgType = 'clouds' }) {
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
      initElements();
    };

    window.addEventListener('resize', handleResize);

    // Dynamic weather particle pools
    let raindrops = [];
    let ripples = [];
    let snowflakes = [];
    let sunMotes = [];
    let clouds = [];
    let lightningTimer = 0;
    let lightningBolt = null;

    function initElements() {
      // 1. Raindrops
      raindrops = Array.from({ length: 180 }, () => ({
        x: Math.random() * (width + 200) - 100,
        y: Math.random() * height,
        length: Math.random() * 25 + 15,
        speed: Math.random() * 18 + 12,
        opacity: Math.random() * 0.5 + 0.3,
      }));

      // 2. Snowflakes
      snowflakes = Array.from({ length: 140 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3.5 + 0.8,
        speedY: Math.random() * 1.8 + 0.6,
        speedX: Math.random() * 1.2 - 0.6,
        opacity: Math.random() * 0.75 + 0.25,
        swayPhase: Math.random() * Math.PI * 2,
      }));

      // 3. Sunny Solar Motes
      sunMotes = Array.from({ length: 45 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 4 + 1.5,
        speedY: Math.random() * 0.6 + 0.2,
        speedX: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      }));

      // 4. Clouds & Mist
      clouds = Array.from({ length: 20 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.8,
        radius: Math.random() * 320 + 160,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.1,
        alpha: Math.random() * 0.22 + 0.08,
        phase: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.003,
      }));
    }

    initElements();

    // Procedural Lightning Generator
    function generateLightning() {
      const startX = width * (0.2 + Math.random() * 0.6);
      let currX = startX;
      let currY = 0;
      const path = [{ x: currX, y: currY }];

      while (currY < height * 0.75) {
        currY += Math.random() * 35 + 15;
        currX += (Math.random() - 0.5) * 60;
        path.push({ x: currX, y: currY });
      }

      return { path, life: 12 };
    }

    let tick = 0;

    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 1. LIVE ATMOSPHERIC WALLPAPER GRADIENT BASE
      // -------------------------------------------------------------
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);

      if (bgType === 'clear') {
        // Vibrant Golden Solar Sunset/Dawn Horizon
        bgGrad.addColorStop(0, '#2e1c0c');
        bgGrad.addColorStop(0.35, '#1f1610');
        bgGrad.addColorStop(0.7, '#121620');
        bgGrad.addColorStop(1, '#070a12');
      } else if (bgType === 'rain') {
        // Deep Stormy Ocean Navy
        bgGrad.addColorStop(0, '#0d1527');
        bgGrad.addColorStop(0.5, '#0a0f1d');
        bgGrad.addColorStop(1, '#04070d');
      } else if (bgType === 'thunderstorm') {
        // Electric Midnight Purple Tempest
        bgGrad.addColorStop(0, '#1c102b');
        bgGrad.addColorStop(0.5, '#0f0a1c');
        bgGrad.addColorStop(1, '#06040b');
      } else if (bgType === 'snow') {
        // Frost Arctic Ice Blue
        bgGrad.addColorStop(0, '#122238');
        bgGrad.addColorStop(0.5, '#0e1828');
        bgGrad.addColorStop(1, '#060b13');
      } else {
        // Slate Fog / Overcast Mist
        bgGrad.addColorStop(0, '#1c222d');
        bgGrad.addColorStop(0.5, '#11151c');
        bgGrad.addColorStop(1, '#07090d');
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 2. SUNNY LIVE WALLPAPER: Solar Disc, Volumetric Rays & Motes
      // -------------------------------------------------------------
      if (bgType === 'clear') {
        const sunX = width * 0.75;
        const sunY = height * 0.2;

        // Pulsating Sun Core Glow
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 420);
        sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
        sunGlow.addColorStop(0.3, 'rgba(245, 158, 11, 0.22)');
        sunGlow.addColorStop(0.7, 'rgba(217, 119, 6, 0.08)');
        sunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 420, 0, Math.PI * 2);
        ctx.fill();

        // Rotating Volumetric Sunbeams
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.translate(sunX, sunY);
        const rayAngle = tick * 0.002;
        for (let i = 0; i < 8; i++) {
          ctx.rotate((Math.PI / 4) + rayAngle);
          const rayGrad = ctx.createLinearGradient(0, 0, 600, 0);
          rayGrad.addColorStop(0, 'rgba(254, 240, 138, 0.15)');
          rayGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(0, -25);
          ctx.lineTo(600, -120);
          ctx.lineTo(600, 120);
          ctx.lineTo(0, 25);
          ctx.fill();
        }
        ctx.restore();

        // Floating Solar Golden Motes
        ctx.fillStyle = 'rgba(253, 230, 138, 0.8)';
        sunMotes.forEach((m) => {
          m.y -= m.speedY;
          m.x += m.speedX + Math.sin(tick * 0.02 + m.pulse) * 0.3;
          if (m.y < -10) {
            m.y = height + 10;
            m.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // -------------------------------------------------------------
      // 3. ROLLING MIST / CLOUDS LAYER
      // -------------------------------------------------------------
      ctx.globalCompositeOperation = 'screen';
      clouds.forEach((c) => {
        c.x += c.vx;
        c.y += c.vy;
        c.phase += c.speed;

        if (c.x < -c.radius) c.x = width + c.radius;
        if (c.x > width + c.radius) c.x = -c.radius;
        if (c.y < -c.radius) c.y = height + c.radius;
        if (c.y > height + c.radius) c.y = -c.radius;

        const currentAlpha = c.alpha + Math.sin(c.phase) * 0.03;
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius);

        if (bgType === 'clear') {
          grad.addColorStop(0, `rgba(255, 220, 170, ${currentAlpha * 0.7})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (bgType === 'thunderstorm') {
          grad.addColorStop(0, `rgba(168, 130, 210, ${currentAlpha * 1.2})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          grad.addColorStop(0, `rgba(180, 205, 230, ${currentAlpha})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = 'source-over';

      // -------------------------------------------------------------
      // 4. RAIN & THUNDERSTORM LIVE WALLPAPER: Raindrops & Ripples
      // -------------------------------------------------------------
      if (bgType === 'rain' || bgType === 'thunderstorm') {
        ctx.strokeStyle = bgType === 'thunderstorm' ? 'rgba(216, 180, 254, 0.55)' : 'rgba(186, 230, 253, 0.45)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        raindrops.forEach((r) => {
          r.y += r.speed;
          r.x -= 3;
          if (r.y > height) {
            // Trigger splash ripple at screen bottom
            if (Math.random() < 0.3) {
              ripples.push({ x: r.x, y: height - 10, radius: 1, maxRadius: 18, alpha: 0.6 });
            }
            r.y = -20;
            r.x = Math.random() * (width + 200) - 100;
          }
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x - 5, r.y + r.length);
        });
        ctx.stroke();

        // Render Splash Ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rip = ripples[i];
          rip.radius += 0.8;
          rip.alpha -= 0.02;
          if (rip.alpha <= 0) {
            ripples.splice(i, 1);
            continue;
          }
          ctx.strokeStyle = `rgba(186, 230, 253, ${rip.alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(rip.x, rip.y, rip.radius, rip.radius * 0.4, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Thunderstorm Lightning Flash & Bolts
        if (bgType === 'thunderstorm') {
          lightningTimer++;
          if (lightningTimer > 150 && Math.random() < 0.04) {
            lightningBolt = generateLightning();
            lightningTimer = 0;
          }

          if (lightningBolt && lightningBolt.life > 0) {
            lightningBolt.life--;

            // Flash Screen Overlay
            ctx.fillStyle = `rgba(243, 232, 255, ${lightningBolt.life > 8 ? 0.25 : 0.1})`;
            ctx.fillRect(0, 0, width, height);

            // Draw Lightning Bolt
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#c084fc';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            lightningBolt.path.forEach((pt, idx) => {
              if (idx === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            });
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }

      // -------------------------------------------------------------
      // 5. SNOWY LIVE WALLPAPER: 3D Swirling Blizzard Snowflakes
      // -------------------------------------------------------------
      if (bgType === 'snow') {
        snowflakes.forEach((s) => {
          s.y += s.speedY;
          s.swayPhase += 0.02;
          s.x += s.speedX + Math.sin(s.swayPhase) * 0.7;

          if (s.y > height + 10) {
            s.y = -10;
            s.x = Math.random() * width;
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [bgType]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full transition-opacity duration-1000"
    />
  );
}
