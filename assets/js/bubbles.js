/**
 * bubbles.js — Bolhas interativas que estouram ao clicar
 * Portfólio da Bru
 */

(function () {
  'use strict';

  const canvas = document.getElementById('bubble-canvas');
  const ctx = canvas.getContext('2d');

  // Paleta de cores vibrantes para as bolhas
  const COLORS = [
    { r: 124, g: 58,  b: 237 },  // roxo
    { r: 236, g: 72,  b: 153 },  // rosa
    { r: 6,   g: 182, b: 212 },  // ciano
    { r: 245, g: 158, b: 11  },  // amarelo
    { r: 16,  g: 185, b: 129 },  // verde
    { r: 167, g: 139, b: 250 },  // lavanda
    { r: 249, g: 168, b: 212 },  // rosa claro
    { r: 103, g: 232, b: 249 },  // ciano claro
  ];

  let bubbles = [];
  let animFrameId;
  let W, H;

  /* ── Redimensionamento ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── Cria uma bolha ── */
  function createBubble(x, y) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:      x  ?? Math.random() * W,
      y:      y  ?? Math.random() * H + H,   // nasce abaixo da tela
      r:      12 + Math.random() * 38,        // raio 12–50 px
      vx:     (Math.random() - 0.5) * 0.6,
      vy:     -(0.4 + Math.random() * 0.9),  // sobe
      alpha:  0.15 + Math.random() * 0.35,
      color,
      popping: false,
      popProgress: 0,   // 0→1 durante o estouro
      popSpeed:   0.07 + Math.random() * 0.06,
      shimmer:    Math.random() * Math.PI * 2,
    };
  }

  /* ── Pool inicial ── */
  function init() {
    bubbles = [];
    const count = Math.min(28, Math.floor((W * H) / 28000));
    for (let i = 0; i < count; i++) {
      const b = createBubble();
      b.y = Math.random() * H;   // distribui pela tela inteira no início
      bubbles.push(b);
    }
  }

  /* ── Desenha uma bolha ── */
  function drawBubble(b) {
    const { x, y, r, alpha, color, popping, popProgress, shimmer } = b;
    const { r: cr, g: cg, b: cb } = color;

    ctx.save();

    if (popping) {
      // Estouro: expande + esmaece
      const scale  = 1 + popProgress * 1.2;
      const fade   = alpha * (1 - popProgress);
      ctx.globalAlpha = fade;
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.translate(-x, -y);

      // Partículas de estouro (pequenos círculos)
      const parts = 8;
      for (let i = 0; i < parts; i++) {
        const angle = (i / parts) * Math.PI * 2;
        const dist  = r * 1.4 * popProgress;
        const px    = x + Math.cos(angle) * dist;
        const py    = y + Math.sin(angle) * dist;
        const pr    = r * 0.18 * (1 - popProgress);
        ctx.beginPath();
        ctx.arc(px, py, Math.max(pr, 0), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${fade * 1.5})`;
        ctx.fill();
      }
    }

    ctx.globalAlpha = popping ? alpha * (1 - popProgress) : alpha;

    // Gradiente radial (efeito de vidro)
    const grad = ctx.createRadialGradient(
      x - r * 0.3, y - r * 0.3, r * 0.05,
      x, y, r
    );
    grad.addColorStop(0,   `rgba(255,255,255,0.55)`);
    grad.addColorStop(0.3, `rgba(${cr},${cg},${cb},0.25)`);
    grad.addColorStop(0.7, `rgba(${cr},${cg},${cb},0.18)`);
    grad.addColorStop(1,   `rgba(${cr},${cg},${cb},0.05)`);

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Borda brilhante
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.55)`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Reflexo interno (shimmer)
    const shimX = x - r * 0.28 + Math.cos(shimmer) * 2;
    const shimY = y - r * 0.28 + Math.sin(shimmer) * 2;
    const shimR = r * 0.22;
    const shimGrad = ctx.createRadialGradient(shimX, shimY, 0, shimX, shimY, shimR);
    shimGrad.addColorStop(0,   'rgba(255,255,255,0.7)');
    shimGrad.addColorStop(0.6, 'rgba(255,255,255,0.15)');
    shimGrad.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(shimX, shimY, shimR, 0, Math.PI * 2);
    ctx.fillStyle = shimGrad;
    ctx.fill();

    ctx.restore();
  }

  /* ── Loop de animação ── */
  function animate() {
    ctx.clearRect(0, 0, W, H);

    const maxBubbles = Math.min(32, Math.floor((W * H) / 25000));

    // Adiciona novas bolhas periodicamente
    if (bubbles.filter(b => !b.popping).length < maxBubbles && Math.random() < 0.025) {
      bubbles.push(createBubble());
    }

    bubbles = bubbles.filter(b => {
      // Remove bolhas que saíram da tela ou terminaram de estourar
      if (b.popping) {
        b.popProgress += b.popSpeed;
        return b.popProgress < 1;
      }
      return b.y + b.r > -50;
    });

    bubbles.forEach(b => {
      if (!b.popping) {
        b.x      += b.vx;
        b.y      += b.vy;
        b.shimmer += 0.02;
        // Leve oscilação horizontal
        b.vx += (Math.random() - 0.5) * 0.04;
        b.vx  = Math.max(-0.8, Math.min(0.8, b.vx));
      }
      drawBubble(b);
    });

    animFrameId = requestAnimationFrame(animate);
  }

  /* ── Detecção de clique / toque ── */
  function getHitBubble(cx, cy) {
    // Percorre de trás pra frente para pegar a bolha mais à frente
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      if (b.popping) continue;
      const dx = cx - b.x;
      const dy = cy - b.y;
      if (dx * dx + dy * dy <= b.r * b.r) return b;
    }
    return null;
  }

  function onPointerDown(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX ?? e.touches[0].clientX) - rect.left;
    const cy = (e.clientY ?? e.touches[0].clientY) - rect.top;

    const hit = getHitBubble(cx, cy);
    if (hit) {
      hit.popping = true;
      hit.popProgress = 0;
      // Cria 2 bolhas novas para substituir
      setTimeout(() => {
        bubbles.push(createBubble());
        bubbles.push(createBubble());
      }, 400);
    }
  }

  /* ── Habilita pointer-events apenas quando o mouse está sobre uma bolha ── */
  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const hit = getHitBubble(cx, cy);
    canvas.style.pointerEvents = hit ? 'auto' : 'none';
    canvas.style.cursor = hit ? 'pointer' : 'default';
  }

  /* ── Inicialização ── */
  window.addEventListener('resize', () => { resize(); init(); });
  canvas.addEventListener('mousedown',  onPointerDown);
  canvas.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('mousemove',  onMouseMove);

  resize();
  init();
  animate();

})();
