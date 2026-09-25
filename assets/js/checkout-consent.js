// Checkout stays disabled until the payment-method radio in the same group is checked
export default function initCheckoutConsent() {
  const groups = document.querySelectorAll('[data-checkout-consent]')
  if (!groups.length) return

  groups.forEach((group) => {
    const input = group.querySelector('[data-consent-input]')
    const button = group.querySelector('[data-consent-button]')
    if (!input || !button) return

    const sync = () => {
      button.disabled = !input.checked
    }

    sync()
    input.addEventListener('change', sync)
  })
}
