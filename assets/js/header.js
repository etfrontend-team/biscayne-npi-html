export function initHeaderScroll() {
  const header = document.querySelector(".header");

  if (!header) return;

  const updateScrolledState = () => {
    header.classList.toggle("header--scrolled", window.scrollY > 0);
  };

  updateScrolledState();
  window.addEventListener("scroll", updateScrolledState, { passive: true });
}

export function initHeaderSearch() {
  const searchOpenBtn = document.querySelector("[data-search-open]");
  const searchForm = document.querySelector("[data-search-form]");
  const searchCloseBtn = document.querySelector("[data-search-close]");
  const searchInput = document.querySelector(".topbar__search-input");

  if (!searchOpenBtn || !searchForm || !searchCloseBtn) return;

  const openSearch = () => {
    searchForm.hidden = false;
    searchOpenBtn.hidden = true;
    searchOpenBtn.setAttribute("aria-expanded", "true");
    searchInput?.focus();
  };

  const closeSearch = () => {
    searchForm.hidden = true;
    searchOpenBtn.hidden = false;
    searchOpenBtn.setAttribute("aria-expanded", "false");
  };

  searchOpenBtn.addEventListener("click", openSearch);
  searchCloseBtn.addEventListener("click", closeSearch);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !searchForm.hidden) {
      closeSearch();
    }
  });

  document.addEventListener("click", (event) => {
    if (!searchForm.hidden && !searchForm.contains(event.target) && !searchOpenBtn.contains(event.target)) {
      closeSearch();
    }
  });
}

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

const DESKTOP_NAV_QUERY = "(min-width: 1200px)";

export function initHeaderMegaMenu() {
  const triggers = document.querySelectorAll("[data-nav-trigger]");

  if (!triggers.length) return;

  const isDesktop = () => window.matchMedia(DESKTOP_NAV_QUERY).matches;

  let closeTimer = null;

  const closeAll = () => {
    triggers.forEach((trigger) => trigger.querySelector("a")?.setAttribute("aria-expanded", "false"));
    document.querySelectorAll("[data-nav-dropdown]").forEach((panel) => panel.classList.remove("is-open"));
  };

  const open = (name) => {
    if (!isDesktop()) return;
    clearTimeout(closeTimer);
    closeAll();
    const trigger = document.querySelector(`[data-nav-trigger="${name}"]`);
    const panel = document.querySelector(`[data-nav-dropdown="${name}"]`);
    trigger?.querySelector("a")?.setAttribute("aria-expanded", "true");
    panel?.classList.add("is-open");
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(closeAll, 350);
  };

  triggers.forEach((trigger) => {
    const name = trigger.dataset.navTrigger;

    trigger.addEventListener("mouseenter", () => open(name));
    trigger.addEventListener("focus", () => open(name));
    trigger.addEventListener("mouseleave", scheduleClose);

    const panel = document.querySelector(`[data-nav-dropdown="${name}"]`);
    panel?.addEventListener("mouseenter", () => clearTimeout(closeTimer));
    panel?.addEventListener("mouseleave", scheduleClose);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });

  document.addEventListener("click", (event) => {
    const withinNav = event.target.closest("[data-nav-trigger], [data-nav-dropdown]");
    if (!withinNav) closeAll();
  });

  window.matchMedia(DESKTOP_NAV_QUERY).addEventListener("change", (event) => {
    if (!event.matches) closeAll();
  });
}

export function initExperiencesTabs() {
  const tabs = document.querySelectorAll("[data-exp-tab]");

  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.disabled) return;

      const name = tab.dataset.expTab;

      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));

      document.querySelectorAll("[data-exp-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.expPanel !== name;
      });

      document.querySelectorAll("[data-exp-cards]").forEach((cards) => {
        cards.hidden = cards.dataset.expCards !== name;
      });
    });
  });
}

export function initMobileMenu() {
  const header = document.querySelector(".header");
  const toggleBtn = document.querySelector("[data-mobile-menu-toggle]");
  const nav = document.querySelector("[data-mobile-nav]");

  if (!header || !toggleBtn || !nav) return;

  const closeAllAccordions = () => {
    nav.querySelectorAll("[data-acc-trigger]").forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
    nav.querySelectorAll("[data-acc-panel]").forEach((panel) => {
      panel.hidden = true;
    });
  };

  const openMenu = () => {
    header.classList.add("header--menu-open");
    nav.hidden = false;
    toggleBtn.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    header.classList.remove("header--menu-open");
    nav.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
    closeAllAccordions();
  };

  toggleBtn.addEventListener("click", () => {
    if (nav.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !nav.hidden) closeMenu();
  });

  window.matchMedia(DESKTOP_NAV_QUERY).addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

export function initMobileAccordion() {
  const nav = document.querySelector("[data-mobile-nav]");

  if (!nav) return;

  const triggers = nav.querySelectorAll("[data-acc-trigger]");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const accItem = trigger.closest("[data-acc]");
      const panel = accItem.querySelector(":scope > [data-acc-panel]");
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      const siblingGroup = accItem.parentElement;
      siblingGroup.querySelectorAll(":scope > [data-acc] > [data-acc-trigger]").forEach((siblingTrigger) => {
        if (siblingTrigger === trigger) return;
        siblingTrigger.setAttribute("aria-expanded", "false");
        const siblingAcc = siblingTrigger.closest("[data-acc]");
        const siblingPanel = siblingAcc.querySelector(":scope > [data-acc-panel]");
        if (siblingPanel) siblingPanel.hidden = true;
      });

      trigger.setAttribute("aria-expanded", String(!isOpen));
      if (panel) panel.hidden = isOpen;
    });
  });
}

export function initHeader() {
  initHeaderScroll();
  initHeaderSearch();
  initHeaderNotice();
  initHeaderMegaMenu();
  initExperiencesTabs();
  initMobileMenu();
  initMobileAccordion();
}
