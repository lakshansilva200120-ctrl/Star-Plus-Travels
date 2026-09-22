// js/i18n.js
/**
 * Star Plus Travel & Tourism LLC - Client-side i18n & Language Switcher
 * Persists language in localStorage ('site_lang', 'pref_lang', 'starplus_lang')
 * and coordinates with app.js localization controllers.
 */

function applyLanguage(lang) {
  if (lang !== 'en' && lang !== 'si') lang = 'en';

  try {
    localStorage.setItem('site_lang', lang);
    localStorage.setItem('pref_lang', lang);
    localStorage.setItem('starplus_lang', lang);
  } catch (e) {}

  document.documentElement.lang = lang;

  if (lang === 'si') {
    document.documentElement.classList.add('lang-si');
  } else {
    document.documentElement.classList.remove('lang-si');
  }

  const dict = typeof translations !== 'undefined' ? translations : (typeof window !== 'undefined' ? window.translations : null);

  // 1. Translate all static elements with data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict && dict[lang] && dict[lang][key] !== undefined) {
      const val = dict[lang][key];
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else if (typeof val === 'string' && ((val.includes('<') && val.includes('>')) || /&[a-zA-Z0-9#]+;/.test(val))) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }
  });

  // 2. Translate elements with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict && dict[lang] && dict[lang][key] !== undefined) {
      el.placeholder = dict[lang][key];
    }
  });

  // 3. Update active toggle button style
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

  // 4. Synchronize with main application language handler if available
  if (typeof changeLanguage === 'function') {
    changeLanguage(lang, false);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const currentLang = localStorage.getItem('site_lang') || localStorage.getItem('pref_lang') || localStorage.getItem('starplus_lang') || 'en';
  applyLanguage(currentLang);

  document.getElementById('lang-toggle-en')?.addEventListener('click', (e) => {
    e.preventDefault();
    applyLanguage('en');
  });
  document.getElementById('lang-toggle-si')?.addEventListener('click', (e) => {
    e.preventDefault();
    applyLanguage('si');
  });
});

if (typeof window !== 'undefined') {
  window.applyLanguage = applyLanguage;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { applyLanguage };
}
