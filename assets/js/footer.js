export function initFooterAccordion() {
  const triggers = document.querySelectorAll("[data-acc-indep-trigger]");

  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const acc = trigger.closest("[data-acc-indep]");
      const panel = acc.querySelector("[data-acc-indep-panel]");
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      trigger.setAttribute("aria-expanded", String(!isOpen));
      if (panel) panel.hidden = isOpen;
    });
  });
}
