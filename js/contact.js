/* =====================
   聯絡表單驗證
   ===================== */
const form = document.getElementById('contactForm');
if (!form) throw new Error('contactForm not found');

const fields = {
  name:    { el: form.name,    msg: form.querySelector('[data-err="name"]'),    validate: v => v.trim().length >= 2 },
  contact: { el: form.contact, msg: form.querySelector('[data-err="contact"]'), validate: v => v.trim().length >= 4 },
  concern: { el: form.concern, msg: form.querySelector('[data-err="concern"]'), validate: v => v !== '' },
};

function validateField(key) {
  const { el, msg, validate } = fields[key];
  const ok = validate(el.value);
  el.classList.toggle('error', !ok);
  if (msg) msg.classList.toggle('show', !ok);
  return ok;
}

// 即時驗證（離焦後）
Object.keys(fields).forEach(key => {
  fields[key].el?.addEventListener('blur', () => validateField(key));
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const allValid = Object.keys(fields).map(k => validateField(k)).every(Boolean);
  if (!allValid) return;

  const btn = form.querySelector('[type="submit"]');
  btn.disabled = true;
  btn.textContent = '傳送中…';

  // 模擬非同步送出（實際串接 LINE Notify / Email API 時替換此段）
  setTimeout(() => {
    form.style.display = 'none';
    document.getElementById('formSuccess').classList.add('show');
  }, 1000);
});
