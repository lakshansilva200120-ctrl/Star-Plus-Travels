// js/i18n.js
function applyLanguage(lang) {
  localStorage.setItem('site_lang', lang);
  document.documentElement.lang = lang;

  const dict = typeof translations !== 'undefined' ? translations : (typeof window !== 'undefined' ? window.translations : null);

  // 1. Translate all static elements with data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict && dict[lang] && dict[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[lang][key];
      } else {
        el.textContent = dict[lang][key];
      }
    }
  });

  // 2. Update active toggle button style
  const enBtn = document.getElementById('lang-toggle-en');
  const siBtn = document.getElementById('lang-toggle-si');
  if (enBtn && siBtn) {
    if (lang === 'si') {
      siBtn.classList.add('bg-amber-500', 'text-white');
      siBtn.classList.remove('text-slate-400');
      enBtn.classList.remove('bg-amber-500', 'text-white');
      enBtn.classList.add('text-slate-400');
    } else {
      enBtn.classList.add('bg-amber-500', 'text-white');
      enBtn.classList.remove('text-slate-400');
      siBtn.classList.remove('bg-amber-500', 'text-white');
      siBtn.classList.add('text-slate-400');
    }
  }

  // Synchronize with main application language handler if available
  if (typeof changeLanguage === 'function') {
    const activePref = localStorage.getItem('starplus_lang') || localStorage.getItem('pref_lang');
    if (activePref !== lang) {
      changeLanguage(lang, false);
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const currentLang = localStorage.getItem('site_lang') || 'en';
  applyLanguage(currentLang);

  document.getElementById('lang-toggle-en')?.addEventListener('click', () => applyLanguage('en'));
  document.getElementById('lang-toggle-si')?.addEventListener('click', () => applyLanguage('si'));
});

if (typeof window !== 'undefined') {
  window.applyLanguage = applyLanguage;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { applyLanguage };
}
