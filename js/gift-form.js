(() => {
  'use strict';
  const form = document.getElementById('customGiftForm');
  if (!form || !window.fetch || !window.AbortController) return;
  const frame = document.getElementById('giftFormFrame');
  const fallback = document.querySelector('.gift-form-link');
  if (frame) frame.hidden = true;
  if (fallback) fallback.hidden = true;
  form.hidden = false;
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('giftStatus');
  let pending = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const body = new URLSearchParams(new FormData(form));
    if (!body.get('name').trim() || !body.get('gift').trim()) {
      status.textContent = 'Preencha o nome e o presente.';
      return;
    }
    pending = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'A enviar…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      const response = await fetch(form.dataset.endpoint, {
        method: 'POST', body, credentials: 'omit', signal: controller.signal
      });
      if (!response.ok) throw new Error('Unconfirmed response');
      const result = await response.json();
      if (result.ok !== true) {
        status.textContent = 'Não foi possível guardar. Verifique os campos e tente novamente.';
        return;
      }
      form.reset();
      status.textContent = 'Muito obrigado! A vossa resposta ficou registada.';
    } catch {
      status.textContent = 'Não foi possível confirmar o envio. Os dados continuam aqui. A resposta pode ter sido guardada; confirme com os noivos antes de voltar a enviar.';
    } finally {
      clearTimeout(timeout);
      pending = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
})();
