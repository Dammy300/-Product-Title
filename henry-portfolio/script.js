/**
 * Mr. Henry - Senior Portfolio Website JavaScript
 * Handles: Auto-looping Tech Video, Dynamic Tech Canvas Fallback,
 * Smooth Transitions, Responsive Mobile Drawer, and Project Details Modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  initVideoAndCanvas();
  initMobileNav();
  initProjectModals();
  initScrollSpy();
});

/* ==========================================================================
   1. AUTO-LOOPING TECH VIDEO & PARTICLE CANVAS FALLBACK
   ========================================================================== */
function initVideoAndCanvas() {
  const video = document.getElementById('heroTechVideo');
  const canvas = document.getElementById('techCanvas');
  
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Ensure Video plays on auto-loop with no sound
  if (video) {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    // Attempt autoplay; fallback or augment with canvas
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Autoplay started successfully
          console.log('Tech hero video is auto-looping.');
        })
        .catch((error) => {
          console.log('Video autoplay prevented or offline. Canvas particle fallback active:', error);
        });
    }
  }

  // --- Dynamic Tech Particle Network on Canvas ---
  let width, height;
  let particles = [];
  const particleCount = 45;
  const connectionDistance = 120;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2.2 + 1;
      this.alpha = Math.random() * 0.6 + 0.3;
      this.color = Math.random() > 0.3 ? '#38bdf8' : '#818cf8';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateTechCanvas() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting circuit/network lines
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / connectionDistance) * 0.25;
          ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateTechCanvas);
  }

  animateTechCanvas();
}

/* ==========================================================================
   2. RESPONSIVE MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const navLinks = drawer ? drawer.querySelectorAll('.mobile-nav-link') : [];

  if (!toggleBtn || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.classList.toggle('active', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
  }

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. INTERACTIVE PROJECT DETAILS MODAL
   ========================================================================== */
const projectData = {
  1: {
    tag: 'FINTECH & REAL-TIME STREAMING',
    title: 'Project 1: Apex Trade Desk',
    desc: 'An ultra-low latency cryptocurrency and stock trading analytics terminal built for professional quantitative traders and asset managers.',
    highlights: [
      'Engineered real-time Order Book and Market Depth visualization rendering 5,000+ ticks/sec via WebSockets.',
      'Custom sub-millisecond calculation pipeline using WebAssembly (Rust) and typed arrays.',
      'Interactive financial charting powered by D3.js and HTML5 Canvas with indicators (MACD, RSI, Bollinger Bands).',
      'Automated trading bot integration with customizable risk management boundaries.'
    ],
    tech: ['React 18', 'TypeScript', 'WebSockets', 'Rust / Wasm', 'TailwindCSS', 'D3.js'],
    demoUrl: '#',
    githubUrl: 'https://github.com'
  },
  2: {
    tag: 'AI & MACHINE LEARNING',
    title: 'Project 2: Synthetix AI Copilot',
    desc: 'An AI-powered automated code review platform that inspects pull requests, detects architectural vulnerabilities, and drafts performance refactors.',
    highlights: [
      'AST-based multi-language semantic code parser supporting Python, Go, TypeScript, and Java.',
      'Integrated LLM embeddings pipeline for repository-wide contextual code comprehension.',
      'Reduced average code review cycle time by 42% across 1,200+ team repositories.',
      'Zero-trust security scanner identifying CVE exposures and secret leakages prior to deployment.'
    ],
    tech: ['Python', 'FastAPI', 'Next.js', 'OpenAI API', 'Vector DB', 'Docker'],
    demoUrl: '#',
    githubUrl: 'https://github.com'
  },
  3: {
    tag: 'DEVOPS & CLOUD ARCHITECTURE',
    title: 'Project 3: CloudPulse Engine',
    desc: 'A distributed cloud infrastructure orchestrator and observability control plane designed for large-scale microservice deployments.',
    highlights: [
      'Automated rolling blue/green and canary deployments across multi-region AWS and GCP Kubernetes clusters.',
      'Real-time health monitoring aggregating telemetry, logs, and distributed traces from 10,000+ pods.',
      'Predictive auto-scaler with custom ML thresholding to mitigate spike outages while cutting cloud spend by 28%.',
      'Unified single-pane-of-glass dashboard for Site Reliability Engineering (SRE) squads.'
    ],
    tech: ['Go (Golang)', 'Kubernetes', 'gRPC', 'Prometheus', 'Terraform', 'AWS'],
    demoUrl: '#',
    githubUrl: 'https://github.com'
  },
  4: {
    tag: 'REAL-TIME & COLLABORATIVE SYSTEMS',
    title: 'Project 4: Workspace Live',
    desc: 'A collaborative digital canvas combining infinite visual whiteboarding, low-latency markdown documentation, and integrated spatial voice channels.',
    highlights: [
      'Conflict-free Replicated Data Types (CRDTs via Yjs) ensuring zero data loss during multi-editor concurrency.',
      'Peer-to-peer WebRTC mesh network providing crystal clear spatial audio for active collaborators.',
      'Infinite vector canvas supporting thousands of simultaneous sticky notes, shapes, and media attachments.',
      'End-to-end encrypted room sessions with instant invite links and granular permission tiers.'
    ],
    tech: ['Node.js', 'WebRTC', 'Yjs CRDT', 'Canvas API', 'Redis', 'Socket.io'],
    demoUrl: '#',
    githubUrl: 'https://github.com'
  },
  5: {
    tag: 'UI ARCHITECTURE & ACCESSIBILITY',
    title: 'Project 5: Aurora UI Design System',
    desc: 'An enterprise-grade, accessible UI component library and design system adopted across 8 distinct web applications.',
    highlights: [
      '100% WCAG 2.1 AA compliant with rigorous keyboard navigation, ARIA semantics, and screen reader tests.',
      'Fully customizable token engine supporting dynamic dark/light theme switching with CSS variables.',
      'Comprehensive Storybook documentation suite featuring interactive prop playgrounds and regression snapshots.',
      'Ultra-lightweight bundle size (< 18KB gzip) with zero third-party runtime dependencies.'
    ],
    tech: ['TypeScript', 'Modern CSS3', 'Storybook', 'Vite', 'WCAG 2.1 AA', 'Jest'],
    demoUrl: '#',
    githubUrl: 'https://github.com'
  }
};

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const closeBtn = document.getElementById('modalCloseBtn');
  const projectBtns = document.querySelectorAll('.btn-view-project');
  const projectCards = document.querySelectorAll('.project-card');

  if (!modal || !modalContent) return;

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalContent.innerHTML = `
      <div class="modal-project-tag">${data.tag}</div>
      <h3 class="modal-project-title">${data.title}</h3>
      <p class="modal-project-desc">${data.desc}</p>
      
      <h4 class="modal-section-h4">Key Engineering Highlights</h4>
      <ul class="modal-highlights">
        ${data.highlights.map(item => `<li>${item}</li>`).join('')}
      </ul>

      <h4 class="modal-section-h4">Technologies Used</h4>
      <div class="tech-stack-badges" style="margin-bottom: 2rem;">
        ${data.tech.map(t => `<span>${t}</span>`).join('')}
      </div>

      <div class="modal-actions">
        <a href="${data.demoUrl}" class="btn-modal-demo" target="_blank" rel="noopener noreferrer">
          <span>Launch Live Demo</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
        <a href="${data.githubUrl}" class="btn-modal-github" target="_blank" rel="noopener noreferrer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span>View Source Code</span>
        </a>
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Trigger modal when clicking "View Project" buttons
  projectBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-project');
      openModal(id);
    });
  });

  // Also trigger modal when clicking anywhere on the card
  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-project-id');
      openModal(id);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close when clicking outside the dialog window
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   4. SCROLL SPY FOR ACTIVE NAVIGATION LINKS
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}
