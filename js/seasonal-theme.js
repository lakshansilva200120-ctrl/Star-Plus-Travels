/**
 * Star Plus Travel & Tourism LLC - 5-Holiday Automatic Seasonal Theme Manager
 * 
 * Exclusively manages the 5 specified major holidays:
 * 1. New Year (Fixed Gregorian: Dec 31 - Jan 5)
 * 2. Valentine's Day (Fixed Gregorian: Feb 10 - Feb 16)
 * 3. Ramadan (Dynamic Islamic Hijri Month 9: Ramadan 1 - 30)
 * 4. Eid (Dynamic Islamic Hijri: Eid al-Fitr [Shawwal 1-4] & Eid al-Adha [Dhu al-Hijjah 9-13])
 * 5. Christmas (Fixed Gregorian: Dec 15 - Dec 28)
 * 
 * Features:
 * - Dynamic Hijri calendar calculation engine (Intl API with astronomical Umm al-Qura fallback)
 * - 60 FPS lightweight canvas particle engine for bespoke effects:
 *   * Snow for Christmas
 *   * Hearts/Rose Petals for Valentine's Day
 *   * Fireworks/Sparkles for New Year
 *   * Golden Lanterns & Crescents for Ramadan
 *   * Festive Emerald & Gold Radiant Crescents for Eid
 * - Auto-activation during holiday windows and zero-touch safe reversion to standard theme
 * - 100% Light Mode & Dark Mode compatibility
 * - URL testing hooks: ?season=ramadan, ?season=eid, ?season=christmas, ?season=newyear, ?season=valentine, ?season=off, ?date=YYYY-MM-DD
 */

(function() {
  'use strict';

  // =========================================================================
  // 1. Dynamic Islamic Calendar Calculation Engine
  // =========================================================================

  /**
   * Converts a Gregorian Date into Islamic Hijri (Day, Month, Year).
   * Primary: Native browser ECMA-402 Intl.DateTimeFormat (islamic-umalqura).
   * Fallback: Astronomical Julian Day Islamic algorithm (offline/all environments).
   */
  function getHijriDate(date) {
    // 1. Try Native Intl API
    try {
      if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
        const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        });
        const parts = formatter.formatToParts(date);
        let hDay = null, hMonth = null, hYear = null;
        for (const p of parts) {
          if (p.type === 'day') hDay = parseInt(p.value, 10);
          if (p.type === 'month') hMonth = parseInt(p.value, 10);
          if (p.type === 'year') hYear = parseInt(p.value, 10);
        }
        if (hDay && hMonth && hYear) {
          return { hDay, hMonth, hYear, source: 'intl' };
        }
      }
    } catch (e) {
      // Fall through to astronomical calculation
    }

    // 2. Astronomical Kuwaiti / Umm al-Qura Algorithm Fallback
    return getHijriDateAstronomical(date);
  }

  function getHijriDateAstronomical(date) {
    const day = date.getDate();
    const month = date.getMonth(); // 0-11
    const year = date.getFullYear();

    let m = month + 1;
    let y = year;
    if (m < 3) {
      y -= 1;
      m += 12;
    }

    const a = Math.floor(y / 100);
    let b = 2 - a + Math.floor(a / 4);
    if (y < 1583) b = 0;
    if (y === 1582) {
      if (m > 10) b = -10;
      if (m === 10) {
        b = 0;
        if (day > 4) b = -10;
      }
    }

    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
    let bjd = jd - 1948440 + 10632;
    const n = Math.floor((bjd - 1) / 10631);
    bjd = bjd - 10631 * n + 354;
    const j = (Math.floor((10985 - bjd) / 5316)) * (Math.floor((50 * bjd) / 17719)) + (Math.floor(bjd / 5670)) * (Math.floor((43 * bjd) / 15238));
    bjd = bjd - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
    const hMonth = Math.floor((24 * bjd) / 709);
    const hDay = bjd - Math.floor((709 * hMonth) / 24);
    const hYear = 30 * n + j - 30;

    return {
      hDay: Math.floor(hDay),
      hMonth: Math.floor(hMonth),
      hYear: Math.floor(hYear),
      source: 'astronomical'
    };
  }

  // =========================================================================
  // 2. Holiday Configurations & Date/Month Matching Rules
  // =========================================================================

  /**
   * Defines the 5 official holiday celebrations with explicit schedule parameters:
   * - scheduleType:
   *     'festival_month'           -> active for the specific festival month (e.g. Ramadan Hijri month 9)
   *     'exact_dates'              -> active on specific festival calendar date(s) (e.g. Eid)
   *     'exact_date_and_range'     -> active on exact festival day + concentrated holiday window (e.g. Valentine, New Year)
   *     'exact_date_or_month'      -> active on exact dates OR throughout the specific festival month (e.g. Christmas in Dec)
   * - exactDates: array of { month, day }
   * - dateRange: { startMonth, startDay, endMonth, endDay }
   * - festivalMonth: Gregorian calendar month (1-12)
   * - hijriFestivalMonth: Hijri calendar month (1-12)
   * - hijriExactRanges: array of { month, startDay, endDay, name }
   */
  const HOLIDAYS = {
    // 1. New Year (Exact Festival Dates: Dec 31 & Jan 1, with celebration window Dec 31 - Jan 5)
    NEW_YEAR: {
      id: 'newyear',
      name: 'New Year Celebrations',
      type: 'fixed',
      scheduleType: 'exact_date_and_range',
      exactDates: [{ month: 12, day: 31 }, { month: 1, day: 1 }],
      dateRange: { startMonth: 12, startDay: 31, endMonth: 1, endDay: 5 },
      badge: '✨ Happy New Year!',
      bannerText: 'Celebrate the New Year with unpublished airline rates & premium holiday packages!',
      accentClass: 'season-newyear',
      particleType: 'fireworks_sparkles',
      ctaUrl: '#packages'
    },

    // 2. Valentine's Day (Exact Festival Date: Feb 14, with celebration window Feb 10 - Feb 16)
    VALENTINE: {
      id: 'valentine',
      name: "Valentine's Day",
      type: 'fixed',
      scheduleType: 'exact_date_and_range',
      exactDates: [{ month: 2, day: 14 }],
      dateRange: { startMonth: 2, startDay: 10, endMonth: 2, endDay: 16 },
      badge: "🌹 Valentine's Romantic Escapes",
      bannerText: 'Romantic Couples Retreats: Maldives Overwater Pool Villas, Swiss Alps & Beach Getaways.',
      accentClass: 'season-valentine',
      particleType: 'hearts',
      ctaUrl: '#packages'
    },

    // 3. Ramadan (Specific Festival Month: Islamic Hijri Month 9: Ramadan 1 - 30)
    RAMADAN: {
      id: 'ramadan',
      name: 'Ramadan Kareem',
      type: 'islamic',
      scheduleType: 'festival_month',
      hijriFestivalMonth: 9, // Full Month 9 of the Islamic calendar
      badge: '🌙 Ramadan Kareem',
      bannerText: 'Experience the blessings of Ramadan with VIP Umrah packages & serene spiritual journeys.',
      accentClass: 'season-ramadan',
      particleType: 'lanterns_and_crescents',
      ctaUrl: '#packages'
    },

    // 4. Eid (Exact Festival Dates: Eid al-Fitr [Shawwal 1-4] & Eid al-Adha [Dhu al-Hijjah 9-13])
    EID: {
      id: 'eid',
      name: 'Eid Celebrations (Eid Mubarak)',
      type: 'islamic',
      scheduleType: 'exact_dates',
      hijriExactRanges: [
        { month: 10, startDay: 1, endDay: 4, name: 'Eid al-Fitr' },
        { month: 12, startDay: 9, endDay: 13, name: 'Eid al-Adha' }
      ],
      badge: '✨ Eid Mubarak!',
      bannerText: 'Eid Mubarak! Celebrate with exclusive holiday travel packages, luxury beach stays & family escapes.',
      accentClass: 'season-eid',
      particleType: 'eid_crescents',
      ctaUrl: '#packages'
    },

    // 5. Christmas (Specific Festival Month: December / Month 12, with exact dates Dec 24-26 and window Dec 15-28)
    CHRISTMAS: {
      id: 'christmas',
      name: 'Christmas & Winter Holiday',
      type: 'fixed',
      scheduleType: 'exact_date_or_month',
      festivalMonth: 12, // Specific Festival Month: December
      exactDates: [{ month: 12, day: 24 }, { month: 12, day: 25 }, { month: 12, day: 26 }],
      dateRange: { startMonth: 12, startDay: 15, endMonth: 12, endDay: 28 },
      badge: '🎄 Merry Christmas & Winter Deals',
      bannerText: 'Celebrate Christmas with magical winter wonderland & snow ski packages to Georgia & Baku!',
      accentClass: 'season-christmas',
      particleType: 'snow',
      ctaUrl: '#packages'
    }
  };

  /**
   * Universal Date & Month Schedule Evaluator.
   * Evaluates if a given date matches a holiday's schedule:
   * - Checks whether the date matches either the exact festival date OR the specific festival month (depending on holiday).
   */
  function isHolidayScheduleActive(holiday, date, hijri) {
    if (!holiday) return false;

    const m = date.getMonth() + 1; // 1-12
    const d = date.getDate();

    // 1. Specific Festival Month Check (Gregorian or Hijri)
    const isGregorianMonthMatch = Boolean(
      holiday.festivalMonth && m === holiday.festivalMonth
    );
    const isHijriMonthMatch = Boolean(
      hijri && holiday.hijriFestivalMonth && hijri.hMonth === holiday.hijriFestivalMonth
    );
    const isFestivalMonthMatch = isGregorianMonthMatch || isHijriMonthMatch;

    // 2. Exact Festival Date Check (Gregorian)
    const isExactDateMatch = Boolean(
      holiday.exactDates && holiday.exactDates.some(ed => ed.month === m && ed.day === d)
    );

    // 3. Date-Range Check (Gregorian)
    let isDateRangeMatch = false;
    if (holiday.dateRange) {
      const { startMonth, startDay, endMonth, endDay } = holiday.dateRange;
      if (startMonth === endMonth) {
        isDateRangeMatch = (m === startMonth && d >= startDay && d <= endDay);
      } else {
        // Cross-month range (e.g. Dec 31 to Jan 5)
        isDateRangeMatch = (m === startMonth && d >= startDay) ||
                           (m === endMonth && d <= endDay);
      }
    }

    // 4. Exact Festival Dates / Date-Range Check (Hijri)
    let isHijriExactMatch = false;
    if (hijri && holiday.hijriExactRanges) {
      isHijriExactMatch = holiday.hijriExactRanges.some(r => {
        return hijri.hMonth === r.month && hijri.hDay >= r.startDay && hijri.hDay <= r.endDay;
      });
    }

    const isExactOrRangeMatch = isExactDateMatch || isDateRangeMatch || isHijriExactMatch;

    // Evaluate according to the holiday's defined scheduleType:
    switch (holiday.scheduleType) {
      case 'festival_month':
        // Specific festival month (e.g. Ramadan Hijri month 9)
        return isFestivalMonthMatch;

      case 'exact_dates':
      case 'exact_date':
        // Exact festival date(s) only (e.g. Eid al-Fitr & Eid al-Adha)
        return isExactDateMatch || isHijriExactMatch;

      case 'date_range':
        // Specific festival date range
        return isDateRangeMatch || isHijriExactMatch;

      case 'exact_date_and_range':
        // Exact festival date or festival date range (e.g. Valentine Feb 14 / Feb 10-16, New Year Dec 31 - Jan 5)
        return isExactOrRangeMatch;

      case 'exact_date_or_month':
      case 'exact_or_month':
      default:
        // Matches either the exact festival date/range OR the specific festival month (e.g. Christmas)
        return isExactOrRangeMatch || isFestivalMonthMatch;
    }
  }

  // Helper to get effective date (supporting ?date=YYYY-MM-DD for simulator)
  function getEffectiveDate() {
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date();
  }

  // Detects which of the 5 holidays is currently active
  function detectActiveHoliday() {
    const urlParams = new URLSearchParams(window.location.search);
    const override = urlParams.get('season') || urlParams.get('holiday');

    // Explicit override for testing
    if (override) {
      const norm = override.toLowerCase().trim();
      if (norm === 'off' || norm === 'none' || norm === 'default' || norm === 'false') {
        return null;
      }
      for (const key of Object.keys(HOLIDAYS)) {
        if (HOLIDAYS[key].id === norm) {
          return HOLIDAYS[key];
        }
      }
    }

    const today = getEffectiveDate();
    const hijri = getHijriDate(today);

    // Evaluate in priority order: Eid > Ramadan > New Year > Christmas > Valentine
    const order = ['EID', 'RAMADAN', 'NEW_YEAR', 'CHRISTMAS', 'VALENTINE'];
    for (const key of order) {
      const holiday = HOLIDAYS[key];
      if (isHolidayScheduleActive(holiday, today, hijri)) {
        return holiday;
      }
    }

    // No holiday active -> standard default theme
    return null;
  }

  // =========================================================================
  // 3. 60 FPS Particle Canvas Engine (5 Custom Holiday Visuals)
  // =========================================================================

  let canvas = null;
  let ctx = null;
  let animId = null;
  let particles = [];
  let isRunning = false;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let onVisibilityChange = null;

  function initParticleEngine(holiday) {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const userPref = localStorage.getItem('starplus_holiday_fx');
    if (userPref === 'disabled') return;

    cleanupParticleEngine();

    canvas = document.createElement('canvas');
    canvas.id = 'holidayThemeCanvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '35';
    canvas.style.opacity = '0.92';
    canvas.style.transition = 'opacity 0.6s ease';

    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', onResize, { passive: true });

    createParticles(holiday);
    startAnimation(holiday);

    // Visibility-aware performance preservation
    if (onVisibilityChange) {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      onVisibilityChange = null;
    }
    onVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation(holiday);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
  }

  function onResize() {
    if (!canvas) return;
    resizeCanvas();
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  function createParticles(holiday) {
    particles = [];
    // Responsive count: fewer on mobile for silky smooth performance
    const count = width < 768 ? 24 : 38;
    for (let i = 0; i < count; i++) {
      particles.push(spawnParticle(holiday.particleType, true));
    }
  }

  function spawnParticle(type, randomY = false) {
    const isDark = document.documentElement.classList.contains('dark');
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -30,
      radius: Math.random() * 2.5 + 1.2,
      speedY: Math.random() * 1.1 + 0.5,
      speedX: (Math.random() - 0.5) * 0.7,
      driftAngle: Math.random() * Math.PI * 2,
      driftSpeed: Math.random() * 0.025 + 0.01,
      opacity: Math.random() * 0.5 + 0.35,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      size: Math.random() * 10 + 8,
      type: type,
      variant: Math.floor(Math.random() * 3),
      isDark: isDark
    };
  }

  // --- Particle Drawing Routines ---

  // 1. Snow for Christmas
  function drawSnow(p, isDark) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${p.opacity})` : `rgba(140, 175, 215, ${p.opacity * 0.85})`;
    ctx.shadowBlur = isDark ? 4 : 0;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 2. Hearts for Valentine's Day
  function drawHeart(p, isDark) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    const s = p.size * 0.45;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(-s, -s * 0.7, -s * 1.3, s * 0.4, 0, s * 1.2);
    ctx.bezierCurveTo(s * 1.3, s * 0.4, s, -s * 0.7, 0, s * 0.3);
    ctx.fillStyle = isDark ? `rgba(244, 114, 182, ${p.opacity * 0.8})` : `rgba(225, 29, 72, ${p.opacity * 0.7})`;
    ctx.shadowBlur = isDark ? 6 : 0;
    ctx.shadowColor = 'rgba(244, 114, 182, 0.4)';
    ctx.fill();
    ctx.restore();
  }

  // 3. Fireworks & Golden Sparkles for New Year
  function drawFireworksSparkle(p, isDark) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    const rad = p.radius * (1.2 + 0.4 * Math.sin(p.driftAngle));
    
    // 4-point star burst
    ctx.beginPath();
    ctx.moveTo(0, -rad * 2.4);
    ctx.lineTo(rad * 0.5, -rad * 0.5);
    ctx.lineTo(rad * 2.4, 0);
    ctx.lineTo(rad * 0.5, rad * 0.5);
    ctx.lineTo(0, rad * 2.4);
    ctx.lineTo(-rad * 0.5, rad * 0.5);
    ctx.lineTo(-rad * 2.4, 0);
    ctx.lineTo(-rad * 0.5, -rad * 0.5);
    ctx.closePath();

    ctx.fillStyle = isDark ? `rgba(251, 191, 36, ${p.opacity})` : `rgba(217, 119, 6, ${p.opacity * 0.85})`;
    ctx.shadowBlur = isDark ? 8 : 0;
    ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
    ctx.fill();
    ctx.restore();
  }

  // 4. Golden Lanterns & Crescents for Ramadan
  function drawLanternAndCrescent(p, isDark) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * 0.3);

    if (p.variant === 0) {
      // Golden Crescent Moon
      const rad = p.size * 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0.5 * Math.PI, 1.5 * Math.PI, true);
      ctx.bezierCurveTo(rad * 0.3, -rad * 0.8, rad * 0.3, rad * 0.8, 0, rad);
      ctx.fillStyle = isDark ? `rgba(251, 191, 36, ${p.opacity * 0.85})` : `rgba(217, 119, 6, ${p.opacity * 0.8})`;
      ctx.shadowBlur = isDark ? 8 : 0;
      ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';
      ctx.fill();
    } else {
      // Illuminated Traditional Fanoos Lantern
      const w = p.size * 0.4;
      const h = p.size * 0.7;
      
      // Lantern body
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.5);
      ctx.lineTo(w * 0.5, -h * 0.2);
      ctx.lineTo(w * 0.35, h * 0.3);
      ctx.lineTo(0, h * 0.5);
      ctx.lineTo(-w * 0.35, h * 0.3);
      ctx.lineTo(-w * 0.5, -h * 0.2);
      ctx.closePath();
      
      ctx.fillStyle = isDark ? `rgba(245, 158, 11, ${p.opacity * 0.8})` : `rgba(180, 83, 9, ${p.opacity * 0.75})`;
      ctx.shadowBlur = isDark ? 10 : 0;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
      ctx.fill();

      // Small hanging ring
      ctx.beginPath();
      ctx.arc(0, -h * 0.55, w * 0.15, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? `rgba(254, 240, 138, ${p.opacity})` : `rgba(217, 119, 6, ${p.opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }

  // 5. Festive Emerald & Gold Crescents & Stars for Eid
  function drawEidCrescent(p, isDark) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * 0.4);

    if (p.variant === 0) {
      // Radiant Eid Crescent
      const rad = p.size * 0.55;
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0.4 * Math.PI, 1.6 * Math.PI, true);
      ctx.bezierCurveTo(rad * 0.35, -rad * 0.8, rad * 0.35, rad * 0.8, 0, rad);
      ctx.fillStyle = isDark ? `rgba(251, 191, 36, ${p.opacity * 0.9})` : `rgba(217, 119, 6, ${p.opacity * 0.85})`;
      ctx.shadowBlur = isDark ? 8 : 0;
      ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
      ctx.fill();
    } else if (p.variant === 1) {
      // Emerald & Gold 8-Point Star
      const rad = p.size * 0.35;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = (i % 2 === 0) ? rad : rad * 0.45;
        const angle = (i * Math.PI) / 4;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = isDark ? `rgba(52, 211, 153, ${p.opacity * 0.85})` : `rgba(5, 150, 105, ${p.opacity * 0.8})`;
      ctx.shadowBlur = isDark ? 6 : 0;
      ctx.shadowColor = 'rgba(52, 211, 153, 0.5)';
      ctx.fill();
    } else {
      // Celebration Gold Sparkle
      const rad = p.radius * (1 + 0.3 * Math.sin(p.driftAngle));
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? `rgba(254, 240, 138, ${p.opacity})` : `rgba(245, 158, 11, ${p.opacity * 0.85})`;
      ctx.fill();
    }

    ctx.restore();
  }

  function updateParticles(holiday) {
    const isDark = document.documentElement.classList.contains('dark');
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.driftAngle += p.driftSpeed;
      p.x += p.speedX + Math.sin(p.driftAngle) * 0.6;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      if (holiday.particleType === 'snow') {
        drawSnow(p, isDark);
      } else if (holiday.particleType === 'hearts') {
        drawHeart(p, isDark);
      } else if (holiday.particleType === 'fireworks_sparkles') {
        drawFireworksSparkle(p, isDark);
      } else if (holiday.particleType === 'lanterns_and_crescents') {
        drawLanternAndCrescent(p, isDark);
      } else if (holiday.particleType === 'eid_crescents') {
        drawEidCrescent(p, isDark);
      }

      // Recycle off-screen particle
      if (p.y > height + 35 || p.x < -35 || p.x > width + 35) {
        particles[i] = spawnParticle(holiday.particleType, false);
      }
    }
  }

  function startAnimation(holiday) {
    if (isRunning) return;
    isRunning = true;

    function render() {
      if (!isRunning) return;
      updateParticles(holiday);
      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);
  }

  function stopAnimation() {
    isRunning = false;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  function cleanupParticleEngine() {
    stopAnimation();

    // 1. Thoroughly remove and clean any active or stale holiday canvases
    const canvases = document.querySelectorAll('#holidayThemeCanvas, #seasonalThemeCanvas, canvas[data-holiday]');
    canvases.forEach(el => {
      try {
        el.style.display = 'none';
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        el.style.pointerEvents = 'none';
        if (el.parentNode) el.parentNode.removeChild(el);
      } catch (e) {}
    });

    if (canvas && canvas.parentNode) {
      try {
        canvas.parentNode.removeChild(canvas);
      } catch (e) {}
    }

    canvas = null;
    ctx = null;
    particles = [];

    // 2. Remove performance event listeners
    window.removeEventListener('resize', onResize);
    if (onVisibilityChange) {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      onVisibilityChange = null;
    }
  }

  // =========================================================================
  // 4. UI Accent & Banner Management
  // =========================================================================

  function applyHolidayUI(holiday) {
    // Remove all previous holiday classes from both html and body
    const classesToRemove = [
      'season-active',
      'season-newyear',
      'season-valentine',
      'season-ramadan',
      'season-eid',
      'season-christmas'
    ];
    document.documentElement.classList.remove(...classesToRemove);
    if (document.body) {
      document.body.classList.remove(...classesToRemove);
    }

    // Fallback: When outside festival periods, ensure components remain safely hidden with 0 overhead
    if (!holiday) {
      cleanupParticleEngine();
      const existingBanner = document.getElementById('holidayBannerTrack');
      if (existingBanner) existingBanner.remove();

      if (window.StarPlusSeason) {
        window.StarPlusSeason.isActive = false;
        window.StarPlusSeason.currentHoliday = null;
      }
      return;
    }

    if (window.StarPlusSeason) {
      window.StarPlusSeason.isActive = true;
      window.StarPlusSeason.currentHoliday = holiday.id;
    }

    // Apply active holiday class
    document.documentElement.classList.add('season-active', holiday.accentClass);

    // Initialize particle effects
    initParticleEngine(holiday);

    // Inject top announcement banner
    injectHolidayBanner(holiday);
  }

  function injectHolidayBanner(holiday) {
    const topBar = document.querySelector('.bg-gradient-to-r.from-slate-900');
    if (!topBar) return;

    let banner = document.getElementById('holidayBannerTrack');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'holidayBannerTrack';
      banner.className = 'w-full py-1 px-4 bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-500/20 dark:from-amber-400/10 dark:via-amber-400/20 dark:to-amber-400/10 border-b border-amber-500/30 text-slate-900 dark:text-amber-200 text-[11px] sm:text-xs font-semibold flex items-center justify-between transition-colors shadow-inner';
      topBar.parentNode.insertBefore(banner, topBar.nextSibling);
    }

    const isFxEnabled = localStorage.getItem('starplus_holiday_fx') !== 'disabled';

    banner.innerHTML = `
      <div class="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 py-0.5">
        <div class="flex items-center space-x-2 text-center sm:text-left">
          <span class="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider shadow-sm shrink-0 animate-pulse">
            ${holiday.badge}
          </span>
          <span class="text-slate-800 dark:text-slate-200 font-medium">
            ${holiday.bannerText}
          </span>
        </div>
        <div class="flex items-center space-x-3 text-[11px] shrink-0">
          <a href="${holiday.ctaUrl}" class="font-bold text-amber-700 dark:text-amber-300 hover:underline flex items-center space-x-1">
            <span>Explore Holiday Deals</span>
            <i class="fa-solid fa-arrow-right text-[9px]"></i>
          </a>
          <span class="text-slate-400 dark:text-slate-600">|</span>
          <button type="button" onclick="window.StarPlusSeason.toggleEffects()" class="text-[10px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1" title="Toggle holiday animation effects">
            <i class="fa-solid ${isFxEnabled ? 'fa-wand-magic-sparkles text-amber-500' : 'fa-power-off'}"></i>
            <span>${isFxEnabled ? 'Holiday Effects: On' : 'Holiday Effects: Off'}</span>
          </button>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 5. Global Public API & Testing Suite
  // =========================================================================

  window.StarPlusSeason = {
    HOLIDAYS: HOLIDAYS,
    isActive: false,
    currentHoliday: null,
    getHijriDate: getHijriDate,
    getActiveHoliday: detectActiveHoliday,
    isFestivalActive: function() {
      return detectActiveHoliday() !== null;
    },
    isHolidayScheduleActive: isHolidayScheduleActive,
    getHolidaySchedule: function() {
      return Object.keys(HOLIDAYS).map(k => {
        const h = HOLIDAYS[k];
        return {
          id: h.id,
          name: h.name,
          scheduleType: h.scheduleType,
          exactDates: h.exactDates || null,
          dateRange: h.dateRange || null,
          festivalMonth: h.festivalMonth || null,
          hijriFestivalMonth: h.hijriFestivalMonth || null,
          hijriExactRanges: h.hijriExactRanges || null
        };
      });
    },
    testDate: function(dateStr) {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { error: 'Invalid date string. Format: YYYY-MM-DD' };
      const h = getHijriDate(d);
      const order = ['EID', 'RAMADAN', 'NEW_YEAR', 'CHRISTMAS', 'VALENTINE'];
      for (const key of order) {
        const holiday = HOLIDAYS[key];
        if (isHolidayScheduleActive(holiday, d, h)) {
          return { active: true, holiday: holiday.id, name: holiday.name, scheduleType: holiday.scheduleType, hijri: h };
        }
      }
      return { active: false, holiday: null, message: 'Standard default theme (no festival active outside schedule)', hijri: h };
    },
    refresh: function() {
      const active = detectActiveHoliday();
      applyHolidayUI(active);
    },
    setHolidayOverride: function(key) {
      if (key && HOLIDAYS[key.toUpperCase()]) {
        applyHolidayUI(HOLIDAYS[key.toUpperCase()]);
      } else if (!key || key === 'off' || key === 'none') {
        applyHolidayUI(null);
      }
    },
    toggleEffects: function() {
      const current = localStorage.getItem('starplus_holiday_fx');
      const active = detectActiveHoliday();
      if (current === 'disabled') {
        localStorage.setItem('starplus_holiday_fx', 'enabled');
        if (active) initParticleEngine(active);
      } else {
        localStorage.setItem('starplus_holiday_fx', 'disabled');
        cleanupParticleEngine();
      }
      if (active) injectHolidayBanner(active);
    }
  };

  // =========================================================================
  // 6. Auto-Initialization
  // =========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    const active = detectActiveHoliday();
    applyHolidayUI(active);
  });

})();
