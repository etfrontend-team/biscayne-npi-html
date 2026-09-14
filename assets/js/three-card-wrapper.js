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
