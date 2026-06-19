/**
 * ====================================================
 * SISTEMA DE BOLHAS INTERATIVAS — Otimizado com Canvas
 * Performance: Renderização via Canvas para melhor fluidez
 * Interatividade: Clique para estourar bolhas
 * ====================================================
 */

class BubbleSystem {
  constructor(canvasId = 'bubble-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.bubbles = [];
    this.particles = [];
    this.animationId = null;
    this.isAnimating = false;

    // Configurações
    this.config = {
      maxBubbles: 8,
      bubbleMinRadius: 20,
      bubbleMaxRadius: 60,
      bubbleMinSpeed: 0.5,
      bubbleMaxSpeed: 2,
      colors: [
        'rgba(124, 58, 237, 0.5)',   // Roxo Neon
        'rgba(236, 72, 153, 0.5)',   // Rosa Neon
        'rgba(6, 182, 212, 0.5)',    // Ciano Neon
        'rgba(251, 191, 36, 0.5)',   // Amarelo Neon
        'rgba(16, 185, 129, 0.5)',   // Verde Neon
      ],
      particleColors: [
        'rgba(124, 58, 237, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(6, 182, 212, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(16, 185, 129, 1)',
      ],
    };

    this.setupCanvas();
    this.setupEventListeners();
    this.start();
  }

  /**
   * Configura o canvas para o tamanho da janela
   */
  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  /**
   * Redimensiona o canvas para cobrir toda a viewport
   */
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Configura event listeners para interação
   */
  setupEventListeners() {
    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
  }

  /**
   * Trata clique no canvas para estourar bolhas
   */
  handleCanvasClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Verifica se clicou em alguma bolha
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.bubbles[i];
      const distance = Math.hypot(bubble.x - clickX, bubble.y - clickY);

      if (distance < bubble.radius) {
        this.popBubble(bubble);
        this.bubbles.splice(i, 1);
        break;
      }
    }
  }

  /**
   * Trata movimento do mouse para mudar cursor
   */
  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let isOverBubble = false;

    for (const bubble of this.bubbles) {
      const distance = Math.hypot(bubble.x - mouseX, bubble.y - mouseY);
      if (distance < bubble.radius) {
        isOverBubble = true;
        break;
      }
    }

    this.canvas.style.cursor = isOverBubble ? 'pointer' : 'default';
  }

  /**
   * Cria efeito de bolha estourando
   */
  popBubble(bubble) {
    // Cria partículas ao estourar
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = 3 + Math.random() * 3;

      this.particles.push({
        x: bubble.x,
        y: bubble.y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        radius: Math.random() * 4 + 2,
        color: this.config.particleColors[Math.floor(Math.random() * this.config.particleColors.length)],
        life: 1,
        decay: 0.02 + Math.random() * 0.03,
      });
    }

    // Toca som (opcional - comentado por padrão)
    // this.playPopSound();
  }

  /**
   * Cria uma nova bolha
   */
  createBubble() {
    const radius = Math.random() * (this.config.bubbleMaxRadius - this.config.bubbleMinRadius) + this.config.bubbleMinRadius;
    const x = Math.random() * (this.canvas.width - radius * 2) + radius;
    const y = this.canvas.height + radius;
    const speed = Math.random() * (this.config.bubbleMaxSpeed - this.config.bubbleMinSpeed) + this.config.bubbleMinSpeed;
    const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
    const wobble = (Math.random() - 0.5) * 0.5;

    return {
      x,
      y,
      radius,
      speed,
      color,
      wobble,
      wobbleAmount: 0,
    };
  }

  /**
   * Atualiza estado das bolhas
   */
  updateBubbles() {
    // Remove bolhas que saíram da tela
    this.bubbles = this.bubbles.filter(bubble => {
      bubble.y -= bubble.speed;
      bubble.wobbleAmount += bubble.wobble;
      bubble.x += Math.sin(bubble.wobbleAmount) * 0.3;

      return bubble.y + bubble.radius > 0;
    });

    // Adiciona novas bolhas se houver espaço
    if (this.bubbles.length < this.config.maxBubbles && Math.random() < 0.02) {
      this.bubbles.push(this.createBubble());
    }
  }

  /**
   * Atualiza estado das partículas
   */
  updateParticles() {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // Gravidade
      particle.life -= particle.decay;

      return particle.life > 0;
    });
  }

  /**
   * Renderiza bolhas no canvas
   */
  renderBubbles() {
    for (const bubble of this.bubbles) {
      // Desenha borda brilhante com efeito neon
      this.ctx.strokeStyle = bubble.color.replace('0.5', '1');
      this.ctx.lineWidth = 3;
      this.ctx.shadowColor = bubble.color.replace('0.5', '0.8');
      this.ctx.shadowBlur = 15;
      this.ctx.beginPath();
      this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      this.ctx.stroke();

      // Desenha preenchimento com gradiente
      const gradient = this.ctx.createRadialGradient(
        bubble.x - bubble.radius / 3, bubble.y - bubble.radius / 3, 0,
        bubble.x, bubble.y, bubble.radius
      );
      gradient.addColorStop(0, bubble.color.replace('0.5', '0.7'));
      gradient.addColorStop(0.7, bubble.color.replace('0.5', '0.4'));
      gradient.addColorStop(1, bubble.color.replace('0.5', '0.1'));
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowColor = 'transparent';

      // Desenha brilho (highlight) intenso
      const highlightX = bubble.x - bubble.radius * 0.35;
      const highlightY = bubble.y - bubble.radius * 0.35;
      const highlightRadius = bubble.radius * 0.35;

      const highlightGradient = this.ctx.createRadialGradient(
        highlightX, highlightY, 0,
        highlightX, highlightY, highlightRadius
      );
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      this.ctx.fillStyle = highlightGradient;
      this.ctx.beginPath();
      this.ctx.arc(highlightX, highlightY, highlightRadius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Renderiza partículas no canvas
   */
  renderParticles() {
    for (const particle of this.particles) {
      this.ctx.fillStyle = particle.color.replace('0.8', particle.life.toString());
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Loop de animação principal
   */
  animate() {
    // Limpa canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Atualiza e renderiza
    this.updateBubbles();
    this.updateParticles();
    this.renderBubbles();
    this.renderParticles();

    // Continua animação
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Inicia o sistema de bolhas
   */
  start() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.animate();
  }

  /**
   * Para o sistema de bolhas
   */
  stop() {
    if (!this.isAnimating) return;
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  /**
   * Pausa/Resume o sistema
   */
  togglePause() {
    if (this.isAnimating) {
      this.stop();
    } else {
      this.start();
    }
  }
}

// ====================================================
// INICIALIZAÇÃO
// ====================================================
let bubbleSystem = null;

document.addEventListener('DOMContentLoaded', () => {
  bubbleSystem = new BubbleSystem('bubble-canvas');
});

// Pausa animação quando a aba fica invisível (economiza recursos)
document.addEventListener('visibilitychange', () => {
  if (!bubbleSystem) return;

  if (document.hidden) {
    bubbleSystem.stop();
  } else {
    bubbleSystem.start();
  }
});
