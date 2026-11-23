(() => {
  'use strict';
  const form = document.getElementById('customGiftForm');
  const frame = document.getElementById('giftFormFrame');
  const note = document.getElementById('giftFallbackLanguage');
  const translate = window.siteLocale?.text;
  if (!form || !window.fetch || !window.AbortController || !translate?.('giftForm.pending')) {
    if (note) {
      const updateFallbackLanguage = () => {
        note.hidden = document.documentElement.lang !== 'en-GB';
      };
      updateFallbackLanguage();
      document.addEventListener('site-languagechange', updateFallbackLanguage);
    }
    return;
  }
  const fallback = document.querySelector('.gift-form-link');
  if (frame) frame.hidden = true;
  if (fallback) fallback.hidden = true;
  form.hidden = false;
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('giftStatus');
  let pending = false;
  let statusKey;
  function updateStatus() {
    if (statusKey) status.textContent = translate(statusKey);
  }
  function setStatus(key) {
    statusKey = key;
    updateStatus();
  }
  document.addEventListener('site-languagechange', updateStatus);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const body = new URLSearchParams(new FormData(form));
    if (!body.get('name').trim() || !body.get('gift').trim()) {
      setStatus('giftForm.required');
      return;
    }
    pending = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    setStatus('giftForm.pending');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      const response = await fetch(form.dataset.endpoint, {
        method: 'POST', body, credentials: 'omit', signal: controller.signal
      });
      if (!response.ok) throw new Error('Unconfirmed response');
      const result = await response.json();
      if (result.ok !== true) {
        setStatus('giftForm.rejected');
        return;
      }
      form.reset();
      setStatus('giftForm.success');
    } catch {
      setStatus('giftForm.unconfirmed');
    } finally {
      clearTimeout(timeout);
      pending = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
})();
