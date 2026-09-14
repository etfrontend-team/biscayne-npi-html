export function initSearchBar() {
  const group = document.querySelector('[data-dropdown-group]');
  if (!group) return;

  const dropdowns = group.querySelectorAll('[data-dropdown]');

  const closeDropdown = (dropdown) => {
    const trigger = dropdown.querySelector('[data-dropdown-trigger]');
    const panel = dropdown.querySelector('[data-dropdown-panel]');
    trigger.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  };

  const closeAll = () => dropdowns.forEach(closeDropdown);

  const openDropdown = (dropdown) => {
    closeAll();
    const trigger = dropdown.querySelector('[data-dropdown-trigger]');
    const panel = dropdown.querySelector('[data-dropdown-panel]');
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
  };

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('[data-dropdown-trigger]');
    const panel = dropdown.querySelector('[data-dropdown-panel]');
    const hint = dropdown.querySelector('[data-dropdown-hint]');
    const input = dropdown.querySelector('[data-dropdown-input]');
    const defaultHint = hint.textContent;
    dropdown.dataset.defaultHint = defaultHint;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeDropdown(dropdown) : openDropdown(dropdown);
    });

    if (panel.dataset.multi !== undefined) {
      const checkboxes = panel.querySelectorAll('[data-checkbox]');

      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('click', () => {
          const isChecked = checkbox.getAttribute('aria-checked') === 'true';
          checkbox.setAttribute('aria-checked', String(!isChecked));

          const selected = [...checkboxes].filter((c) => c.getAttribute('aria-checked') === 'true');
          hint.textContent = selected.length
            ? selected.map((c) => c.dataset.value).join(', ').replace(/-/g, ' ')
            : defaultHint;
          input.value = selected.map((c) => c.dataset.value).join(',');
        });
      });
      return;
    }

    const dateInput = panel.querySelector('[data-date-input]');
    if (dateInput) {
      dateInput.addEventListener('change', () => {
        if (!dateInput.value) {
          hint.textContent = defaultHint;
          return;
        }
        const [year, month] = dateInput.value.split('-');
        const label = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        hint.textContent = label;
        closeDropdown(dropdown);
      });
      return;
    }

    panel.addEventListener('click', (event) => {
      const option = event.target.closest('[role="option"]');
      if (!option) return;

      panel.querySelectorAll('[role="option"]').forEach((o) => o.removeAttribute('aria-selected'));
      option.setAttribute('aria-selected', 'true');

      hint.textContent = option.textContent;
      input.value = option.dataset.value || '';

      closeDropdown(dropdown);
      trigger.focus();
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-dropdown]')) closeAll();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
  });
}
