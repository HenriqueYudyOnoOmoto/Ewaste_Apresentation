document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('slidesContainer');
  const slides = Array.from(document.querySelectorAll('.slide-section'));
  if (!container || !slides.length) return;

  let current = 0;

  function goTo(index) {
    current = Math.max(0, Math.min(index, slides.length - 1));
    slides[current].scrollIntoView({ behavior: 'smooth' });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) current = slides.indexOf(e.target);
      });
    },
    { root: container, threshold: 0.55 }
  );
  slides.forEach((s) => observer.observe(s));

  document.addEventListener('keydown', (e) => {
    const nextKeys = ['ArrowDown', 'ArrowRight', ' ', 'PageDown'];
    const prevKeys = ['ArrowUp', 'ArrowLeft', 'PageUp'];

    if (nextKeys.includes(e.key)) {
      e.preventDefault();
      goTo(current + 1);
    } else if (prevKeys.includes(e.key)) {
      e.preventDefault();
      goTo(current - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(slides.length - 1);
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen();
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (e.button !== 0 || e.target.closest('a, button, input, textarea, select')) return;
    const sel = window.getSelection();
    if (sel && sel.toString().trim()) return;
    goTo(current + 1);
  });

  function updateScaling() {
    const w = window.innerWidth, h = window.innerHeight;
    if (h <= 0) return;
    const ratio = w / h;
    let baseW = 1200, baseH = 675, mode = '16-9';

    if (ratio < 1.0) {
      baseW = 440; baseH = 780; mode = 'portrait';
    } else if (ratio < 1.5) {
      baseW = 1000; baseH = 750; mode = '4-3';
    }

    document.body.setAttribute('data-aspect', mode);
    const scale = Math.max(0.1, Math.min((w * 0.96) / baseW, (h * 0.96) / baseH));
    document.documentElement.style.setProperty('--scale', scale.toFixed(4));
    document.documentElement.style.setProperty('--base-w', baseW + 'px');
    document.documentElement.style.setProperty('--base-h', baseH + 'px');
  }

  let resizeTicking = false;
  const onResize = () => {
    if (!resizeTicking) {
      resizeTicking = true;
      requestAnimationFrame(() => {
        updateScaling();
        resizeTicking = false;
      });
    }
  };

  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  updateScaling();
});
