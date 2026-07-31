document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('.site-nav a');
  const counters = document.querySelectorAll('.counter[data-target]');
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');

  AOS.init({
    duration: 900,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });

  new Swiper('.reviews-swiper', {
    slidesPerView: 1,
    spaceBetween: 18,
    loop: true,
    autoplay: {
      delay: 4200,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1180: { slidesPerView: 3 },
    },
  });

  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => link.addEventListener('click', closeNav));

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      closeNav();
    }
  });

  const animateCounter = (element) => {
    const target = Number.parseInt(element.dataset.target, 10);
    if (!Number.isFinite(target)) return;

    const state = { value: 0 };
    gsap.to(state, {
      value: target,
      duration: 2.1,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = `${Math.round(state.value)}+`;
      },
      onComplete: () => {
        element.textContent = `${target}+`;
      },
    });
  };

  const countersObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  counters.forEach((counter) => countersObserver.observe(counter));

  if (hero && heroBg && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      gsap.to(heroBg, {
        x: x * -18,
        y: y * -14,
        duration: 0.7,
        overwrite: true,
        ease: 'power2.out',
      });
    });

    hero.addEventListener('mouseleave', () => {
      gsap.to(heroBg, {
        x: 0,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      });
    });
  }

  gsap.from('.hero-content > *', {
    opacity: 0,
    y: 28,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
  });

  gsap.from('.hero-visual', {
    opacity: 0,
    x: 60,
    duration: 1.2,
    delay: 0.15,
    ease: 'power3.out',
  });

  const lightbox = document.getElementById('gallery-lightbox');
  const galleryItems = [...document.querySelectorAll('.gallery-item')];

  if (lightbox && galleryItems.length) {
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;

    const slides = galleryItems.map((item) => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-caption');
      return {
        src: img?.getAttribute('src') ?? '',
        alt: img?.getAttribute('alt') ?? '',
        caption: caption?.textContent ?? '',
      };
    });

    const renderSlide = (index) => {
      const slide = slides[index];
      if (!slide) return;
      currentIndex = index;
      lightboxImage.src = slide.src;
      lightboxImage.alt = slide.alt;
      lightboxCaption.textContent = slide.caption;
    };

    const openLightbox = (index) => {
      renderSlide(index);
      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lightboxImage.removeAttribute('src');
    };

    const showNext = () => renderSlide((currentIndex + 1) % slides.length);
    const showPrev = () => renderSlide((currentIndex - 1 + slides.length) % slides.length);

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn?.addEventListener('click', closeLightbox);
    nextBtn?.addEventListener('click', showNext);
    prevBtn?.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') showNext();
      if (event.key === 'ArrowLeft') showPrev();
    });
  }
});