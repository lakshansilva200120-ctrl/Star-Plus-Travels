// js/i18n.js
/**
 * Star Plus Travel & Tourism LLC - Client-side i18n & Language Switcher
 * Persists language in localStorage ('site_lang', 'pref_lang', 'starplus_lang')
 * and coordinates with app.js localization controllers.
 */

function updateElementTranslation(el, val) {
  if (!el || val === undefined || val === null) return;

  // 1. Input or Textarea placeholders
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    el.placeholder = val;
    return;
  }

  // 2. Select option element
  if (el.tagName === 'OPTION') {
    el.textContent = val;
    return;
  }

  // 3. Custom dropdown target: if element is or contains .custom-select-label
  const customLabel = el.classList.contains('custom-select-label')
    ? el
    : el.querySelector('.custom-select-label');
  if (customLabel) {
    customLabel.textContent = val;
    return;
  }

  // 4. If element contains child elements (icons, badges, svgs)
  if (el.children && el.children.length > 0) {
    // If there is an explicit text span, update it directly
    const textSpan = el.querySelector('.wa-btn-text, .i18n-text, .btn-text, span:not([class*="fa-"]):not([class*="icon"]):not(.check-mark):not(.custom-select-label)');
    if (textSpan && !textSpan.hasAttribute('data-i18n') && !textSpan.hasAttribute('data-key')) {
      if (typeof val === 'string' && val.includes('<') && val.includes('>')) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = val;
        const innerSpan = tempDiv.querySelector('span');
        textSpan.textContent = innerSpan ? innerSpan.textContent : tempDiv.textContent.trim();
      } else if (typeof val === 'string' && /&[a-zA-Z0-9#]+;/.test(val)) {
        textSpan.innerHTML = val;
      } else {
        textSpan.textContent = val;
      }
      return;
    }

    // Locate primary text node
    let textNode = null;
    for (let i = 0; i < el.childNodes.length; i++) {
      const node = el.childNodes[i];
      if (node.nodeType === 3 && node.textContent.trim().length > 0) {
        textNode = node;
        break;
      }
    }
    if (textNode) {
      if (typeof val === 'string' && ((val.includes('<') && val.includes('>')) || /&[a-zA-Z0-9#]+;/.test(val))) {
        const span = document.createElement('span');
        span.innerHTML = val;
        el.replaceChild(span, textNode);
      } else {
        const leading = textNode.textContent.startsWith(' ') ? ' ' : '';
        const trailing = textNode.textContent.endsWith(' ') ? ' ' : '';
        textNode.textContent = leading + val.trim() + trailing;
      }
      return;
    }
  }

  // 5. Leaf element without complex children
  if (typeof val === 'string' && ((val.includes('<') && val.includes('>')) || /&[a-zA-Z0-9#]+;/.test(val))) {
    el.innerHTML = val;
  } else {
    el.textContent = val;
  }
}

if (typeof window !== 'undefined') {
  window.updateElementTranslation = updateElementTranslation;
}

function applyLanguage(lang) {
  if (lang !== 'en' && lang !== 'si') lang = 'en';

  try {
    localStorage.setItem('site_lang', lang);
    localStorage.setItem('pref_lang', lang);
    localStorage.setItem('starplus_lang', lang);
  } catch (e) {}

  if (document.documentElement) {
    document.documentElement.lang = lang;
    if (lang === 'si') {
      document.documentElement.classList.add('lang-si');
    } else {
      document.documentElement.classList.remove('lang-si');
    }
  }

  const dictSource = (typeof I18N_TRANSLATIONS !== 'undefined' && I18N_TRANSLATIONS)
    ? I18N_TRANSLATIONS
    : (typeof translations !== 'undefined' ? translations : (typeof window !== 'undefined' ? (window.I18N_TRANSLATIONS || window.translations) : null));

  const dict = dictSource ? (dictSource[lang] || dictSource.en) : null;

  if (dict) {
    // 1. Translate all static elements with data-i18n or data-key attributes
    document.querySelectorAll('[data-i18n], [data-key]').forEach((el) => {
      const key = el.getAttribute('data-i18n') || el.getAttribute('data-key');
      if (key && dict[key] !== undefined) {
        updateElementTranslation(el, dict[key]);
      }
    });

    // 2. Translate elements with data-i18n-placeholder or data-placeholder-key
    document.querySelectorAll('[data-i18n-placeholder], [data-placeholder-key]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder') || el.getAttribute('data-placeholder-key');
      if (key && dict[key] !== undefined) {
        el.placeholder = dict[key];
      }
    });
  }

  // 3. Update active toggle button style
  const enBtn = document.getElementById('lang-toggle-en');
  const siBtn = document.getElementById('lang-toggle-si');
  const sinhalaText = "\u0DC3\u0DD2\u0D82\u0DC4\u0DBD"; // සිංහල
  if (siBtn && (!siBtn.textContent.trim() || siBtn.textContent.includes('à'))) {
    siBtn.textContent = sinhalaText;
  }
  if (enBtn && siBtn) {
    if (lang === 'si') {
      siBtn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-sm', 'px-2.5', 'py-1');
      siBtn.classList.remove('text-slate-400', 'hover:text-white', 'font-semibold', 'text-white', 'px-2', 'py-0.5');
      enBtn.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-sm', 'text-white', 'px-2.5', 'py-1');
      enBtn.classList.add('text-slate-400', 'hover:text-white', 'font-semibold', 'px-2', 'py-0.5');
    } else {
      enBtn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-sm', 'px-2.5', 'py-1');
      enBtn.classList.remove('text-slate-400', 'hover:text-white', 'font-semibold', 'text-white', 'px-2', 'py-0.5');
      siBtn.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-sm', 'text-white', 'px-2.5', 'py-1');
      siBtn.classList.add('text-slate-400', 'hover:text-white', 'font-semibold', 'px-2', 'py-0.5');
    }
  }

  // 4. Synchronize with main application language handler if available
  if (typeof changeLanguage === 'function') {
    try {
      changeLanguage(lang, false);
    } catch (e) {}
  }

  // 5. Re-call custom dropdown and datepicker initializers after translation finishes
  if (typeof initCustomDropdowns === 'function') {
    try { initCustomDropdowns(); } catch (e) {}
  }
  if (typeof refreshCustomDropdowns === 'function') {
    try { refreshCustomDropdowns(); } catch (e) {}
  }
  if (typeof initDatePicker === 'function') {
    try { initDatePicker(); } catch (e) {}
  } else if (typeof initFlatpickr === 'function') {
    try { initFlatpickr(); } catch (e) {}
  }
  if (typeof updateDwellModalLanguage === 'function') {
    try { updateDwellModalLanguage(); } catch (e) {}
  }
  if (typeof applyDwellModalTranslation === 'function') {
    try { applyDwellModalTranslation(); } catch (e) {}
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
