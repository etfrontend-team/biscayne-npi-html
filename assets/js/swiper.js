import Swiper from "swiper/bundle";

export function initHeaderNotice() {
  const announcementBar = document.querySelector(".topbar__notice");

  if (!announcementBar) return;

  new Swiper(announcementBar, {
    slidesPerView: 1,
    loop: true,
    speed: 600,
    allowTouchMove: false,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
  });
}

export function initPopularAdventures() {
  const swiperEl = document.querySelector('.popular-adventures-swiper');
  if (!swiperEl) return;

  new Swiper('.popular-adventures-swiper', {
    slidesPerView: 1.15,
    spaceBetween: 16,
    grabCursor: true,
    watchOverflow: false,
    observer: true,
    observeParents: true,
    scrollbar: {
      el: '.popular-adventures-scrollbar',
      draggable: true,
      hide: false,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 16,
      },
      576: {
        slidesPerView: 'auto',
        spaceBetween: 20,
      },
      1700: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });
}

export function initThreeCardWrapper() {
  const swiperEl = document.querySelector('.three-card-wrapper__cards');
  if (!swiperEl) return;

  new Swiper('.three-card-wrapper__cards', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    grabCursor: true,
    watchOverflow: false,
    observer: true,
    observeParents: true,
    scrollbar: {
      el: '.three-card-wrapper__scrollbar',
      draggable: true,
      hide: false,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 30,
        allowTouchMove: true,
      },

      639: {
        slidesPerView: 2,
        spaceBetween: 30,
        allowTouchMove: true,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
        allowTouchMove: false,
      },
      1199: {
        slidesPerView: 3,
        spaceBetween: 40,
        allowTouchMove: false,
      },
    },
  });
}

export function initHeroSlider() {
  const heroSliderEl = document.querySelector('.hero-slider');
  if (!heroSliderEl) return;

  new Swiper('.hero-slider', {
    slidesPerView: 1,
    loop: true,
    speed: 800,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    // autoplay: {
    //   delay: 4000,
    //   disableOnInteraction: false,
    // },
    pagination: {
      el: '.hero-slider .swiper-pagination',
      clickable: true,
    },
  });
}

export function initFeaturedStory() {
  const featuredStory = document.querySelector('.featured-story');
  const swiperEl = document.querySelector('.featured-story__swiper');
  if (!featuredStory || !swiperEl) return;

  const prevBtn = featuredStory.querySelector('[data-featured-prev]');
  const nextBtn = featuredStory.querySelector('[data-featured-next]');

  const alignArrowsToMedia = () => {
    const activeMedia = swiperEl.querySelector('.swiper-slide-active .featured-story__media');
    if (!activeMedia) return;

    const top = `${activeMedia.offsetHeight / 2}px`;

    if (prevBtn) prevBtn.style.top = top;
    if (nextBtn) nextBtn.style.top = top;
  };

  const swiper = new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 16,
    speed: 600,
    watchOverflow: false,
    autoHeight: true,
    observer: true,
    observeParents: true,
    navigation: {
      prevEl: '[data-featured-prev]',
      nextEl: '[data-featured-next]',
    },
    on: {
      slideChangeTransitionEnd: alignArrowsToMedia,
    },
  });

  const refresh = () => {
    swiper.updateAutoHeight(0);
    alignArrowsToMedia();
  };

  swiperEl.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', refresh, { once: true });
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh);
  }

  window.addEventListener('resize', alignArrowsToMedia, { passive: true });
  swiper.on('resize', alignArrowsToMedia);
  alignArrowsToMedia();
}

export function initSwipers() {
  initHeaderNotice();
  initHeroSlider();
  initPopularAdventures();
  initThreeCardWrapper();
  initFeaturedStory();
}
