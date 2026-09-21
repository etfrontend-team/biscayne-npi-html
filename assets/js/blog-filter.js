const PAGE_SIZE = 6
const MIN_VISIBLE_PAGES = 4
const FADE_MS = 200

export default function initBlogFilter() {
  const grid = document.querySelector('[data-blog-grid]')
  const tabsGroup = document.querySelector('[data-filter-tabs]')
  const pagination = document.querySelector('[data-blog-pagination]')

  if (!grid || !tabsGroup || !pagination) return

  const cards = Array.from(grid.querySelectorAll('.blog-card'))
  const tabs = Array.from(tabsGroup.querySelectorAll('.filter-tabs__tab'))
  const emptyState = grid.querySelector('[data-blog-empty]')
  const prevBtn = pagination.querySelector('[data-page-prev]')
  const nextBtn = pagination.querySelector('[data-page-next]')
  const pageList = pagination.querySelector('[data-page-list]')

  if (!prevBtn || !nextBtn || !pageList) return

  let currentFilter = 'all'
  let currentPage = 1

  const scrollToGridTop = () => {
    const header = document.querySelector('.header')
    const headerOffset = header ? header.offsetHeight : 0
    const gridTop = grid.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: gridTop - headerOffset - 20, behavior: 'smooth' })
  }

  const getFilteredCards = () => cards.filter((card) => currentFilter === 'all' || card.dataset.category === currentFilter)

  const render = () => {
    const filtered = getFilteredCards()
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

    if (currentPage > totalPages) currentPage = totalPages

    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE

    cards.forEach((card) => {
      const matches = currentFilter === 'all' || card.dataset.category === currentFilter
      const index = filtered.indexOf(card)
      card.hidden = !matches || index < start || index >= end
    })

    if (emptyState) emptyState.hidden = filtered.length > 0

    const visiblePages = Math.max(MIN_VISIBLE_PAGES, totalPages)

    pageList.innerHTML = ''
    for (let page = 1; page <= visiblePages; page += 1) {
      const pageBtn = document.createElement('button')
      pageBtn.type = 'button'
      pageBtn.className = 'pagination__page'
      pageBtn.textContent = String(page)
      pageBtn.setAttribute('aria-label', `Page ${page}`)
      if (page === currentPage) {
        pageBtn.classList.add('is-active')
        pageBtn.setAttribute('aria-current', 'page')
      }
      if (page > totalPages) {
        pageBtn.disabled = true
      } else {
        pageBtn.addEventListener('click', () => goToPage(page))
      }
      pageList.appendChild(pageBtn)
    }

    prevBtn.disabled = currentPage <= 1
    nextBtn.disabled = currentPage >= totalPages
  }

  const swapContent = (applyChange, { scroll = false } = {}) => {
    grid.classList.add('is-fading')

    window.setTimeout(() => {
      applyChange()
      render()
      if (scroll) scrollToGridTop()
      grid.classList.remove('is-fading')
    }, FADE_MS)
  }

  const goToPage = (page) => {
    if (page === currentPage) return
    swapContent(
      () => {
        currentPage = page
      },
      { scroll: true },
    )
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('is-active')) return

      tabs.forEach((t) => {
        t.classList.remove('is-active')
        t.setAttribute('aria-selected', 'false')
      })
      tab.classList.add('is-active')
      tab.setAttribute('aria-selected', 'true')

      swapContent(() => {
        currentFilter = tab.dataset.filter
        currentPage = 1
      })
    })
  })

  prevBtn.addEventListener('click', () => {
    if (currentPage <= 1) return
    goToPage(currentPage - 1)
  })

  nextBtn.addEventListener('click', () => {
    goToPage(currentPage + 1)
  })

  render()
}
