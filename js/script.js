document.documentElement.classList.remove('no-js');

/* ---------------- Header scroll state ---------------- */
const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------------- Mobile nav toggle ---------------- */
const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');
const navBackdrop = document.getElementById('navBackdrop');
const mainNav = document.getElementById('mainNav');

function openMenu() {
  mainNav.classList.add('is-open');
  navBackdrop.classList.add('is-open');
  navToggle.classList.add('is-active');
  header.classList.add('is-menu-open');
  navToggle.setAttribute('aria-expanded', true);
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mainNav.classList.remove('is-open');
  navBackdrop.classList.remove('is-open');
  navToggle.classList.remove('is-active');
  header.classList.remove('is-menu-open');
  navToggle.setAttribute('aria-expanded', false);
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  if (mainNav.classList.contains('is-open')) closeMenu(); else openMenu();
});
navClose.addEventListener('click', closeMenu);
navBackdrop.addEventListener('click', closeMenu);
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ---------------- Active nav link on scroll ---------------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.main-nav a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 140;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

/* ---------------- Hero slider ---------------- */
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
let heroIndex = 0;
let heroTimer;

function goToSlide(i) {
  heroSlides[heroIndex].classList.remove('is-active');
  heroDots[heroIndex].classList.remove('is-active');
  heroIndex = i;
  heroSlides[heroIndex].classList.add('is-active');
  heroDots[heroIndex].classList.add('is-active');
}

function nextSlide() {
  goToSlide((heroIndex + 1) % heroSlides.length);
}

function startHeroAutoplay() {
  clearInterval(heroTimer);
  heroTimer = setInterval(nextSlide, 6000);
}

heroDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    goToSlide(i);
    startHeroAutoplay();
  });
});

if (heroSlides.length > 1) startHeroAutoplay();

/* ---------------- Horizontal card-row arrow controls ---------------- */
document.querySelectorAll('[data-arrows-for]').forEach(group => {
  const target = document.getElementById(group.dataset.arrowsFor);
  if (!target) return;
  group.querySelectorAll('.arrow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = parseInt(btn.dataset.dir, 10);
      const cardWidth = target.firstElementChild.getBoundingClientRect().width + 32;
      target.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
    });
  });
});

/* ---------------- GSAP scroll animations ---------------- */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('[data-reveal]').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Staggered reveal for grids
  const staggerGroups = [
    '.objectives-grid .objective-item',
    '.news-grid .news-card',
    '.stats-row .stat',
    '.board-list li',
    '.charter-list .charter-row',
    '.roadmap .roadmap-step',
    '.staff-grid .staff-card',
    '.case-facts .case-fact',
    '.case-results .case-result'
  ];
  const staggerParents = '.objectives-grid, .news-grid, .stats-row, .board-list, .charter-list, .roadmap, .staff-grid, .case-facts, .case-results';
  staggerGroups.forEach(sel => {
    const items = document.querySelectorAll(sel);
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: 28 });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: items[0].closest(staggerParents),
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Hero entrance (plays immediately, not on scroll)
  gsap.to('.hero [data-reveal]', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.15,
    delay: 0.2
  });

  // Counter animation for stats
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const counter = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(counter.val); }
        });
      }
    });
  });
} else {
  // Fallback: ensure content is visible if GSAP fails to load
  document.querySelectorAll('[data-reveal]').forEach(el => {
    el.style.opacity = 1;
    el.style.transform = 'none';
  });
  document.querySelectorAll('.stat-num').forEach(el => {
    el.textContent = el.dataset.count;
  });
}
