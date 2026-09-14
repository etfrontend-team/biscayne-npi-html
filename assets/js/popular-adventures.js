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
