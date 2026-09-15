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

export function initSwipers() {
  initHeaderNotice();
  initPopularAdventures();
  initThreeCardWrapper();
}
