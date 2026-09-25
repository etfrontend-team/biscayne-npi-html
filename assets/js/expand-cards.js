const GAP = 10
const DEFAULT_INDEX = 1
const CORNERS = 'round 10px 0px 10px 0px'
// Matches the reference GSAP tween: 1s power2.inOut.
const CLIP_TRANSITION = 'clip-path 1s cubic-bezier(0.455, 0.03, 0.515, 0.955)'
const FADE_OUT_MS = 250
const SCROLL_MS = 600

// power2.inOut, same curve GSAP uses for the reference scroll tween.
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function getCollapsed() {
  return window.innerWidth < 769 ? 20 : 60
}

function initDragScroll(el, onDragStart) {
  let isDown = false
  let dragged = false
  let startX = 0
  let startScroll = 0

  el.addEventListener('mousedown', (event) => {
    if (window.innerWidth >= 1024) return
    isDown = true
    dragged = false
    startX = event.pageX
    startScroll = el.scrollLeft
    el.classList.add('is-dragging')
  })

  window.addEventListener('mousemove', (event) => {
    if (!isDown) return
    const delta = event.pageX - startX
    if (!dragged && Math.abs(delta) > 5) {
      dragged = true
      onDragStart()
    }
    if (!dragged) return
    el.scrollLeft = startScroll - delta
  })

  window.addEventListener('mouseup', () => {
    isDown = false
    el.classList.remove('is-dragging')
  })

  // A drag shouldn't also count as a click on the card underneath.
  el.addEventListener(
    'click',
    (event) => {
      if (!dragged) return
      event.stopPropagation()
      event.preventDefault()
    },
    true,
  )
}

export default function initExpandCards() {
  const root = document.querySelector('.expand-cards')
  if (!root) return

  const cards = Array.from(root.querySelectorAll('.expand-cards__card'))
  if (!cards.length) return

  initDragScroll(root, () => stopScroll())

  let activeIndex = DEFAULT_INDEX
  const leaveTimers = new Map()
  let scrollFrame = 0

  function clipPathFor(i, collapsed, expandedWidth) {
    const hidden = expandedWidth - collapsed
    if (i < activeIndex) return `inset(0px ${hidden}px 0px 0px ${CORNERS})`
    if (i > activeIndex) return `inset(0px 0px 0px ${hidden}px ${CORNERS})`
    return `inset(0px 0px 0px 0px ${CORNERS})`
  }

  function layout(instant) {
  const collapsed = getCollapsed()
  const slot = collapsed + GAP

  const expandedWidth =
    window.innerWidth <= 575
      ? Math.min(300, root.clientWidth - 2 * slot)
      : root.clientWidth - (cards.length - 1) * slot

  cards.forEach((card, i) => {
    const isActive = i === activeIndex

    card.style.transition = instant ? 'none' : CLIP_TRANSITION
    card.style.left = `${i * slot}px`
    card.style.width = `${expandedWidth}px`
    card.style.clipPath = clipPathFor(
      i,
      collapsed,
      expandedWidth
    )

    if (
      card.classList.contains('is-active') &&
      !isActive &&
      !instant
    ) {
      card.classList.add('is-leaving')

      clearTimeout(leaveTimers.get(card))

      leaveTimers.set(
        card,
        setTimeout(
          () => card.classList.remove('is-leaving'),
          FADE_OUT_MS
        )
      )
    }

    if (isActive) {
      card.classList.remove('is-leaving')
    }

    card.classList.toggle('is-active', isActive)
  })

  if (instant) {
    void root.offsetWidth

    cards.forEach(
      (card) => (card.style.transition = CLIP_TRANSITION)
    )
  }
}

  // function layout(instant) {
  //   const collapsed = getCollapsed()
  //   const slot = collapsed + GAP
  //   // Mobile: size the active card so one collapsed neighbour sliver shows on each side,
  //   // equal widths left and right (scrollToActive aligns to the previous card's slot).
  //   const expandedWidth = window.innerWidth <= 575 ? root.clientWidth - 2 * slot : root.clientWidth - (cards.length - 1) * slot

  //   cards.forEach((card, i) => {
  //     const isActive = i === activeIndex
  //     card.style.transition = instant ? 'none' : CLIP_TRANSITION
  //     card.style.left = `${i * slot}px`
  //     card.style.width = `${expandedWidth}px`
  //     card.style.clipPath = clipPathFor(i, collapsed, expandedWidth)

  //     if (card.classList.contains('is-active') && !isActive && !instant) {
  //       card.classList.add('is-leaving')
  //       clearTimeout(leaveTimers.get(card))
  //       leaveTimers.set(card, setTimeout(() => card.classList.remove('is-leaving'), FADE_OUT_MS))
  //     }
  //     if (isActive) card.classList.remove('is-leaving')
  //     card.classList.toggle('is-active', isActive)
  //   })

  //   if (instant) {
  //     void root.offsetWidth // flush styles so re-enabling the transition doesn't animate this change
  //     cards.forEach((card) => (card.style.transition = CLIP_TRANSITION))
  //   }
  // }

  function stopScroll() {
    cancelAnimationFrame(scrollFrame)
  }

  // When the row scrolls (below 1024), bring the active card into view aligned to the
  // PREVIOUS card's slot, so its predecessor's sliver stays fully visible. Clamping to
  // 0 / maxScroll keeps the first and last cards fully in view at either end.
  function scrollToActive(index, instant) {
    const slot = getCollapsed() + GAP
    const maxScroll = Math.max(root.scrollWidth - root.clientWidth, 0)
    const target = Math.min(Math.max((index - 1) * slot, 0), maxScroll)

    stopScroll()
    if (instant) {
      root.scrollLeft = target
      return
    }

    const start = root.scrollLeft
    const distance = target - start
    if (!distance) return
    const startTime = performance.now()

    function step(now) {
      const progress = Math.min((now - startTime) / SCROLL_MS, 1)
      root.scrollLeft = start + distance * easeInOutQuad(progress)
      if (progress < 1) scrollFrame = requestAnimationFrame(step)
    }
    scrollFrame = requestAnimationFrame(step)
  }

  function setActive(index) {
    if (index === activeIndex) return
    activeIndex = index
    layout(false)
    scrollToActive(index, false)
  }

  layout(true)
  scrollToActive(activeIndex, true)

  // A user drag, swipe or wheel takes over from an in-progress auto-scroll. Not
  // mousedown/touchstart: a tap fires those too (mousedown lands right after the
  // emulated mouseenter that starts the scroll) and would cancel it immediately.
  // Mouse drags cancel via initDragScroll's onDragStart once they pass 5px.
  ;['touchmove', 'wheel'].forEach((type) => root.addEventListener(type, stopScroll, { passive: true }))

  cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => setActive(index))
    card.addEventListener('click', () => setActive(index))
    card.addEventListener('focusin', () => setActive(index))
  })

  root.addEventListener('mouseleave', () => setActive(DEFAULT_INDEX))

  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      layout(true)
      scrollToActive(activeIndex, true)
    }, 150)
  })
}
