import { initHeader } from './header.js'
import { initFooterAccordion } from './footer.js'
import { initSwipers } from './swiper.js'
import { initSearchBar } from './search-bar.js'
import initToursFilter from './tours-filter.js'
import initBlogFilter from './blog-filter.js'

document.addEventListener('DOMContentLoaded', () => {
  initHeader()
  initFooterAccordion()
  initSwipers()
  initSearchBar()
  initToursFilter()
  initBlogFilter()
})
