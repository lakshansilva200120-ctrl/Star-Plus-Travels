/**
 * Star Plus Travel & Tourism LLC - Live Pricing Service
 * Client and Node.js compatible singleton for live rates, tour package pricing,
 * service charges, and real-time site synchronization.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.StarplusPricing = factory();
    root.StarplusPricingSync = root.StarplusPricing;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'starplus_live_pricing_v1';
  const API_ENDPOINT = '/api/pricing';

  const DEFAULT_PRICING = {
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system',
    visas: {
      uae30Day: {
        id: 'uae-30-day',
        name: '30-Day Single Entry Tourist Visa',
        priceAED: 380,
        priceUSD: 105,
        available: true,
        processingTime: '24–48 Hours',
        notes: 'Includes mandatory medical insurance'
      },
      uae60Day: {
        id: 'uae-60-day',
        name: '60-Day Single Entry Tourist Visa',
        priceAED: 590,
        priceUSD: 165,
        available: true,
        processingTime: '24–48 Hours',
        notes: 'Includes mandatory medical insurance'
      },
      expressFee: {
        id: 'express-fee',
        name: 'VIP Express Same-Day Processing Surcharge',
        priceAED: 150,
        priceUSD: 42,
        available: true,
        processingTime: '6–12 Hours',
        notes: 'Priority immigration clearance queue'
      },
      omanBusChange: {
        id: 'oman-bus-change',
        name: 'Oman Visa Change by Luxury Coach',
        priceAED: 650,
        priceUSD: 180,
        available: true,
        processingTime: 'Same Day',
        notes: 'Roundtrip coach + hotel room stay included'
      },
      schengenConcierge: {
        id: 'schengen-concierge',
        name: 'Schengen Concierge & File Prep',
        priceAED: 450,
        priceUSD: 125,
        available: true,
        processingTime: 'Express',
        notes: 'VFS/TLS file prep, dummy tickets, travel insurance'
      },
      sriLankaEta: {
        id: 'sri-lanka-eta',
        name: 'Sri Lanka Electronic ETA',
        priceAED: 220,
        priceUSD: 60,
        available: true,
        processingTime: '24 Hours',
        notes: 'Double entry 30-day tourist approval'
      }
    },
    packages: {
      dubaiLuxury: {
        id: 'dubai-luxury',
        title: 'Ultimate Dubai & Desert Safari Extravaganza',
        destination: 'Dubai & Abu Dhabi, UAE',
        duration: '5 Days / 4 Nights',
        priceAED: 2450,
        priceUSD: 675,
        badge: 'Bestseller',
        available: true
      },
      sriLankaScenic: {
        id: 'sri-lanka-scenic',
        title: 'Scenic Sri Lanka: Tea Hills, Wildlife & Beaches',
        destination: 'Colombo, Kandy, Ella & Yala',
        duration: '6 Days / 5 Nights',
        priceAED: 1890,
        priceUSD: 515,
        badge: 'Trending',
        available: true
      },
      bakuAzerbaijan: {
        id: 'baku-azerbaijan',
        title: 'Baku & Caucasus Wonders of Azerbaijan',
        destination: 'Baku & Gabala, Azerbaijan',
        duration: '5 Days / 4 Nights',
        priceAED: 2150,
        priceUSD: 595,
        badge: 'Popular',
        available: true
      },
      maldivesParadise: {
        id: 'maldives-paradise',
        title: 'Maldives Overwater Villa Paradise Escape',
        destination: 'North Malé Atoll, Maldives',
        duration: '4 Days / 3 Nights',
        priceAED: 4650,
        priceUSD: 1265,
        badge: 'Luxury Romance',
        available: true
      },
      baliGetaway: {
        id: 'bali-getaway',
        title: 'Bali Heavenly Getaway: Ubud & Seminyak',
        destination: 'Bali, Indonesia',
        duration: '7 Days / 6 Nights',
        priceAED: 2850,
        priceUSD: 775,
        badge: 'Bestseller',
        available: true
      },
      turkeyBalloons: {
        id: 'turkey-balloons',
        title: 'Classic Turkey: Istanbul & Cappadocia Balloons',
        destination: 'Istanbul & Cappadocia, Turkey',
        duration: '6 Days / 5 Nights',
        priceAED: 3350,
        priceUSD: 915,
        badge: 'Bucket List',
        available: true
      },
      umrahPremium: {
        id: 'umrah-premium',
        title: 'Premium Umrah Spiritual Journey',
        destination: 'Makkah & Madinah, KSA',
        duration: '7 Days / 6 Nights',
        priceAED: 2990,
        priceUSD: 815,
        badge: 'Spiritual Peace',
        available: true
      },
      dubaiMice: {
        id: 'dubai-mice',
        title: 'Executive Dubai MICE, Gala & Corporate Summit',
        destination: 'Dubai & Abu Dhabi, UAE',
        duration: '4 Days / 3 Nights',
        priceAED: 3450,
        priceUSD: 940,
        badge: 'Corporate VIP',
        available: true
      },
      caucasusRetreat: {
        id: 'caucasus-retreat',
        title: 'Caucasus Executive Leadership & Team Incentive Retreat',
        destination: 'Baku & Shahdag, Azerbaijan',
        duration: '5 Days / 4 Nights',
        priceAED: 2650,
        priceUSD: 725,
        badge: 'Executive Retreat',
        available: true
      },
      uaeGoldenVisa: {
        id: 'uae-golden-visa',
        title: 'UAE 10-Year Golden Visa & Concierge Relocation Bundle',
        destination: 'Dubai, United Arab Emirates',
        duration: 'Express 5-7 Days',
        priceAED: 4950,
        priceUSD: 1350,
        badge: '10-Year Residency',
        available: true
      },
      georgiaKazbegi: {
        id: 'georgia-kazbegi',
        title: 'Magical Georgia: Tbilisi, Kazbegi & Gudauri',
        destination: 'Tbilisi & Caucasus, Georgia',
        duration: '6 Days / 5 Nights',
        priceAED: 2250,
        priceUSD: 620,
        badge: 'Winter Special',
        available: true
      }
    },
    services: {
      ticketingMarkup: {
        id: 'ticketing-markup',
        name: 'Airline Ticket Issuance Service Fee',
        priceAED: 50,
        priceUSD: 14,
        description: 'Standard per-ticket issuance and route change management fee',
        available: true
      },
      flightConsultation: {
        id: 'flight-consultation',
        name: 'VIP Flight Route & Complex Itinerary Consultation',
        priceAED: 100,
        priceUSD: 28,
        description: 'Multi-city route planning and group fare negotiation',
        available: true
      },
      chauffeurHourly: {
        id: 'chauffeur-hourly',
        name: 'Private Luxury Chauffeur Base Daily Rate',
        priceAED: 450,
        priceUSD: 125,
        description: 'Executive sedan with fuel, toll fees, and bilingual chauffeur',
        available: true
      },
      hotelBookingFee: {
        id: 'hotel-booking-fee',
        name: 'Direct Hotel & Resort Concierge Booking Service',
        priceAED: 75,
        priceUSD: 21,
        description: 'Exclusive corporate rate matching and room upgrades',
        available: true
      }
    }
  };

  class PricingService {
    constructor() {
      this.cache = null;
      this.listeners = [];
    }

    /**
     * Get active pricing data synchronously (from cache, local storage, or defaults).
     */
    getPricing() {
      if (this.cache) return this.cache;

      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const stored = window.localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            this.cache = {
              lastUpdated: parsed.lastUpdated || DEFAULT_PRICING.lastUpdated,
              updatedBy: parsed.updatedBy || DEFAULT_PRICING.updatedBy,
              visas: Object.assign({}, DEFAULT_PRICING.visas, parsed.visas || {}),
              packages: Object.assign({}, DEFAULT_PRICING.packages, parsed.packages || {}),
              services: Object.assign({}, DEFAULT_PRICING.services, parsed.services || {})
            };
            return this.cache;
          }
        } catch (e) {
          console.warn('[StarplusPricing] Could not read from localStorage:', e);
        }
      }

      this.cache = JSON.parse(JSON.stringify(DEFAULT_PRICING));
      return this.cache;
    }

    /**
     * Asynchronously loads pricing, fetching from serverless API or direct cloud store if available.
     */
    async loadPricing() {
      // 1. Try serverless endpoint first (/api/pricing)
      if (typeof fetch === 'function') {
        try {
          const res = await fetch(API_ENDPOINT, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && data.pricing) {
              this.cache = {
                lastUpdated: data.pricing.lastUpdated || DEFAULT_PRICING.lastUpdated,
                updatedBy: data.pricing.updatedBy || DEFAULT_PRICING.updatedBy,
                visas: Object.assign({}, DEFAULT_PRICING.visas, data.pricing.visas || {}),
                packages: Object.assign({}, DEFAULT_PRICING.packages, data.pricing.packages || {}),
                services: Object.assign({}, DEFAULT_PRICING.services, data.pricing.services || {})
              };
              this.saveLocal(this.cache);
              this.broadcast();
              return this.cache;
            }
          }
        } catch (e) {
          // Fall through to remote cloud store connector or local cache
        }

        // 2. Direct Cloud Store Connector (Supabase / Remote KV) if configured in window.STARPLUS_CONFIG
        try {
          const cfg = (typeof window !== 'undefined' && window.STARPLUS_CONFIG) || {};
          const supabaseUrl = cfg.supabaseUrl || (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('starplus_supabase_url'));
          const supabaseKey = cfg.supabaseKey || (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('starplus_supabase_key'));

          if (supabaseUrl && supabaseKey) {
            const res = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/site_pricing?id=eq.global&select=pricing`, {
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Accept': 'application/json'
              }
            });
            if (res.ok) {
              const rows = await res.json();
              if (Array.isArray(rows) && rows.length > 0 && rows[0].pricing) {
                this.cache = {
                  lastUpdated: rows[0].pricing.lastUpdated || DEFAULT_PRICING.lastUpdated,
                  updatedBy: rows[0].pricing.updatedBy || DEFAULT_PRICING.updatedBy,
                  visas: Object.assign({}, DEFAULT_PRICING.visas, rows[0].pricing.visas || {}),
                  packages: Object.assign({}, DEFAULT_PRICING.packages, rows[0].pricing.packages || {}),
                  services: Object.assign({}, DEFAULT_PRICING.services, rows[0].pricing.services || {})
                };
                this.saveLocal(this.cache);
                this.broadcast();
                return this.cache;
              }
            }
          }
        } catch (e) {
          // Gracefully fallback to localStorage or default pricing
        }
      }
      return this.getPricing();
    }

    /**
     * Save updated pricing data (locally and via API / remote cloud store).
     */
    async savePricing(updatedPricing, adminToken) {
      const dataToSave = Object.assign({}, this.getPricing(), updatedPricing, {
        lastUpdated: new Date().toISOString()
      });

      this.cache = dataToSave;
      this.saveLocal(dataToSave);
      this.broadcast();

      let remoteSaved = false;

      // 1. Push to serverless API
      if (typeof fetch === 'function') {
        try {
          const headers = { 'Content-Type': 'application/json' };
          if (adminToken) {
            headers['Authorization'] = `Bearer ${adminToken}`;
          }

          const res = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers,
            body: JSON.stringify(dataToSave)
          });

          if (res.ok) {
            const result = await res.json();
            if (result && result.pricing) {
              this.cache = result.pricing;
              this.saveLocal(this.cache);
              this.broadcast();
            }
            remoteSaved = true;
          }
        } catch (err) {
          console.warn('[StarplusPricing] API remote sync error:', err);
        }

        // 2. Direct Cloud Store Connector (Supabase / Remote KV) if configured in window.STARPLUS_CONFIG
        try {
          const cfg = (typeof window !== 'undefined' && window.STARPLUS_CONFIG) || {};
          const supabaseUrl = cfg.supabaseUrl || (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('starplus_supabase_url'));
          const supabaseKey = cfg.supabaseKey || (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('starplus_supabase_key'));

          if (supabaseUrl && supabaseKey) {
            const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/site_pricing`;
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
              },
              body: JSON.stringify({
                id: 'global',
                pricing: dataToSave,
                updated_at: new Date().toISOString()
              })
            });
            if (res.ok) {
              remoteSaved = true;
            }
          }
        } catch (err) {
          console.warn('[StarplusPricing] Direct Supabase sync error:', err);
        }
      }

      return { success: true, remoteSaved, localOnly: !remoteSaved, pricing: this.cache };
    }

    saveLocal(data) {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
      }
    }

    subscribe(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
      }
      return () => {
        this.listeners = this.listeners.filter(cb => cb !== callback);
      };
    }

    broadcast() {
      const data = this.getPricing();
      this.listeners.forEach(cb => {
        try { cb(data); } catch (e) {}
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('starplus:pricing-updated', { detail: data }));
      }
    }

    /**
     * Synchronize DOM price displays with current live pricing
     */
    syncDOM() {
      const data = this.getPricing();

      // 1. Update Visa elements if tagged with data-visa-id
      document.querySelectorAll('[data-visa-id]').forEach(el => {
        const visaId = el.getAttribute('data-visa-id');
        const visa = data.visas[visaId];
        if (!visa) return;

        if (el.hasAttribute('data-base-aed')) {
          el.setAttribute('data-base-aed', visa.priceAED);
        }
        const badge = el.querySelector('[data-visa-status]');
        if (badge) {
          badge.textContent = visa.available ? 'Available' : 'On Hold';
          badge.className = visa.available
            ? 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30';
        }
      });

      // 1b. Update all elements tagged with data-price-key (e.g. UAE-30-DAY-AED, UAE-30-DAY-USD, etc.)
      const keyMap = {
        'UAE-30-DAY': data.visas.uae30Day,
        'UAE-60-DAY': data.visas.uae60Day,
        'EXPRESS-FEE': data.visas.expressFee,
        'OMAN-BUS-CHANGE': data.visas.omanBusChange,
        'SCHENGEN-CONCIERGE': data.visas.schengenConcierge,
        'SRI-LANKA-ETA': data.visas.sriLankaEta
      };

      document.querySelectorAll('[data-price-key]').forEach(el => {
        const rawKey = (el.getAttribute('data-price-key') || '').trim();
        const upperKey = rawKey.toUpperCase();
        
        for (const [prefix, item] of Object.entries(keyMap)) {
          if (!item) continue;
          if (upperKey === `${prefix}-AED`) {
            const prefixTxt = el.getAttribute('data-prefix') || '';
            const suffixTxt = el.getAttribute('data-suffix') || '';
            el.textContent = `${prefixTxt}${item.priceAED} AED${suffixTxt}`;
            if (el.hasAttribute('data-base-aed')) el.setAttribute('data-base-aed', item.priceAED);
          } else if (upperKey === `${prefix}-USD`) {
            const prefixTxt = el.getAttribute('data-prefix') || '';
            const suffixTxt = el.getAttribute('data-suffix') || '';
            el.textContent = `${prefixTxt}$${item.priceUSD}${suffixTxt}`;
          } else if (upperKey === `${prefix}-TURNAROUND` || upperKey === `${prefix}-SPEED`) {
            el.textContent = item.processingTime;
          } else if (upperKey === `${prefix}-STATUS`) {
            el.textContent = item.available ? 'Available' : 'On Hold';
            if (el.classList) {
              if (item.available) {
                el.classList.add('text-emerald-400');
                el.classList.remove('text-rose-400');
              } else {
                el.classList.add('text-rose-400');
                el.classList.remove('text-emerald-400');
              }
            }
          }
        }
      });

      // 2. Update Package elements if tagged with data-pkg-id
      document.querySelectorAll('[data-pkg-id]').forEach(el => {
        const pkgId = el.getAttribute('data-pkg-id');
        const pkg = data.packages[pkgId];
        if (!pkg) return;

        if (el.hasAttribute('data-base-aed')) {
          el.setAttribute('data-base-aed', pkg.priceAED);
        }
      });

      // 3. Update window.VISA_DATA and window.VISA_DATA_SI if defined in global scope
      if (typeof window !== 'undefined') {
        if (window.VISA_DATA) {
          if (data.visas.uae30Day && window.VISA_DATA.uae) {
            window.VISA_DATA.uae.priceAED = data.visas.uae30Day.priceAED;
            window.VISA_DATA.uae.rateHeadline = `From ${data.visas.uae30Day.priceAED} AED | ${data.visas.uae30Day.processingTime}`;
          }
          if (data.visas.omanBusChange && window.VISA_DATA.oman_change) {
            window.VISA_DATA.oman_change.priceAED = data.visas.omanBusChange.priceAED;
            window.VISA_DATA.oman_change.rateHeadline = `From ${data.visas.omanBusChange.priceAED} AED (${data.visas.omanBusChange.processingTime})`;
          }
          if (data.visas.schengenConcierge && window.VISA_DATA.schengen) {
            window.VISA_DATA.schengen.priceAED = data.visas.schengenConcierge.priceAED;
            window.VISA_DATA.schengen.rateHeadline = `From ${data.visas.schengenConcierge.priceAED} AED (Appointment Booking, Flight/Hotel Vouchers, Insurance)`;
          }
          if (data.visas.sriLankaEta && window.VISA_DATA.srilanka) {
            window.VISA_DATA.srilanka.priceAED = data.visas.sriLankaEta.priceAED;
            window.VISA_DATA.srilanka.rateHeadline = `From ${data.visas.sriLankaEta.priceAED} AED | ${data.visas.sriLankaEta.processingTime}`;
          }
        }

        if (window.VISA_DATA_SI) {
          if (data.visas.uae30Day && window.VISA_DATA_SI.uae) {
            window.VISA_DATA_SI.uae.priceAED = data.visas.uae30Day.priceAED;
            window.VISA_DATA_SI.uae.rateHeadline = `AED ${data.visas.uae30Day.priceAED} සිට | පැය 24–48 කඩිනම් සේවාව`;
          }
          if (data.visas.omanBusChange && window.VISA_DATA_SI.oman_change) {
            window.VISA_DATA_SI.oman_change.priceAED = data.visas.omanBusChange.priceAED;
            window.VISA_DATA_SI.oman_change.rateHeadline = `AED ${data.visas.omanBusChange.priceAED} සිට (එදිනම බස් රථ ගමන සහ වීසා අලුත් කිරීම)`;
          }
          if (data.visas.schengenConcierge && window.VISA_DATA_SI.schengen) {
            window.VISA_DATA_SI.schengen.priceAED = data.visas.schengenConcierge.priceAED;
            window.VISA_DATA_SI.schengen.rateHeadline = `AED ${data.visas.schengenConcierge.priceAED} සිට (දිනයක් වෙන්කිරීම, හෝටල්/ගුවන් ටිකට් සහ රක්ෂණාවරණය)`;
          }
          if (data.visas.sriLankaEta && window.VISA_DATA_SI.srilanka) {
            window.VISA_DATA_SI.srilanka.priceAED = data.visas.sriLankaEta.priceAED;
            window.VISA_DATA_SI.srilanka.rateHeadline = `AED ${data.visas.sriLankaEta.priceAED} සිට | ${data.visas.sriLankaEta.processingTime}`;
          }
        }

        // 4. Update window.PACKAGES prices & availability if present
        if (Array.isArray(window.PACKAGES) && data.packages) {
          const packageMapping = [
            { key: 'dubaiLuxury', ids: ['dubai-luxury'] },
            { key: 'sriLankaScenic', ids: ['sri-lanka-scenic', 'sri-lanka-wildlife', 'sri-lanka-wonders'] },
            { key: 'bakuAzerbaijan', ids: ['baku-azerbaijan', 'baku-caucasus'] },
            { key: 'maldivesParadise', ids: ['maldives-paradise', 'maldives-all-inclusive', 'maldives-escape'] },
            { key: 'baliGetaway', ids: ['bali-getaway', 'bali-luxury-nature'] },
            { key: 'turkeyBalloons', ids: ['turkey-balloons', 'turkey-istanbul-cappadocia'] },
            { key: 'umrahPremium', ids: ['umrah-premium', 'umrah-spiritual-package'] },
            { key: 'dubaiMice', ids: ['dubai-mice', 'dubai-corporate-mice'] },
            { key: 'caucasusRetreat', ids: ['caucasus-retreat', 'baku-corporate-retreat'] },
            { key: 'uaeGoldenVisa', ids: ['uae-golden-visa', 'uae-golden-visa-bundle'] },
            { key: 'georgiaKazbegi', ids: ['georgia-kazbegi'] }
          ];

          packageMapping.forEach(({ key, ids }) => {
            const liveItem = data.packages[key];
            if (!liveItem) return;
            window.PACKAGES.forEach(pkg => {
              if (ids.includes(pkg.id) || (pkg.legacyId && ids.includes(pkg.legacyId)) || (pkg.adminId && ids.includes(pkg.adminId))) {
                pkg.priceAED = liveItem.priceAED;
                if (liveItem.priceUSD) pkg.priceUSD = liveItem.priceUSD;
                if (liveItem.duration) pkg.duration = liveItem.duration;
                if (liveItem.badge) pkg.badge = liveItem.badge;
                pkg.available = liveItem.available !== false;
              }
            });
          });
        }
      }

      // 4b. Synchronize live package cards in DOM (index.html)
      if (typeof document !== 'undefined' && data.packages) {
        const domPackageMapping = [
          { key: 'dubaiLuxury', ids: ['dubai-luxury'] },
          { key: 'sriLankaScenic', ids: ['sri-lanka-scenic', 'sri-lanka-wildlife', 'sri-lanka-wonders'] },
          { key: 'bakuAzerbaijan', ids: ['baku-azerbaijan', 'baku-caucasus'] },
          { key: 'maldivesParadise', ids: ['maldives-paradise', 'maldives-all-inclusive', 'maldives-escape'] },
          { key: 'baliGetaway', ids: ['bali-getaway', 'bali-luxury-nature'] },
          { key: 'turkeyBalloons', ids: ['turkey-balloons', 'turkey-istanbul-cappadocia'] },
          { key: 'umrahPremium', ids: ['umrah-premium', 'umrah-spiritual-package'] },
          { key: 'dubaiMice', ids: ['dubai-mice', 'dubai-corporate-mice'] },
          { key: 'caucasusRetreat', ids: ['caucasus-retreat', 'baku-corporate-retreat'] },
          { key: 'uaeGoldenVisa', ids: ['uae-golden-visa', 'uae-golden-visa-bundle'] },
          { key: 'georgiaKazbegi', ids: ['georgia-kazbegi'] }
        ];

        domPackageMapping.forEach(({ key, ids }) => {
          const liveItem = data.packages[key];
          if (!liveItem) return;

          const selector = ids.map(id => `[data-package-id="${id}"], [data-pkg-id="${id}"]`).join(', ');
          document.querySelectorAll(selector).forEach(card => {
            // Main bold price: AED [X,XXX]
            const priceEl = card.querySelector('.price-aed');
            if (priceEl) {
              priceEl.setAttribute('data-base-aed', liveItem.priceAED);
              priceEl.textContent = `AED ${Number(liveItem.priceAED).toLocaleString()}`;
            }

            // Tabby installment line: or 4x AED [Math.round(X / 4)]/mo with Tabby
            const tabbyAmount = Math.round(liveItem.priceAED / 4);
            const tabbyLine = card.querySelector('.tabby-installment, [data-tabby-line]');
            if (tabbyLine) {
              tabbyLine.textContent = `or 4x AED ${tabbyAmount}/mo with Tabby`;
            } else {
              card.querySelectorAll('span, div, p').forEach(el => {
                if (el.textContent && el.textContent.toLowerCase().includes('tabby')) {
                  el.textContent = `or 4x AED ${tabbyAmount}/mo with Tabby`;
                }
              });
            }

            // Availability: dim card or display "Inquire for Next Dates" badge
            const isAvail = liveItem.available !== false;
            let unavailBadge = card.querySelector('.unavailable-badge');

            if (!isAvail) {
              card.classList.add('opacity-70', 'grayscale-[30%]');
              if (!unavailBadge) {
                unavailBadge = document.createElement('div');
                unavailBadge.className = 'unavailable-badge absolute top-3 right-3 z-20 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-amber-400 border border-amber-500/40 shadow-lg flex items-center gap-1.5';
                unavailBadge.innerHTML = '<i class="fa-solid fa-clock text-[10px]"></i><span>Inquire for Next Dates</span>';
                const imgContainer = card.querySelector('.img-container') || card;
                imgContainer.appendChild(unavailBadge);
              } else {
                unavailBadge.classList.remove('hidden');
              }
            } else {
              card.classList.remove('opacity-70', 'grayscale-[30%]');
              if (unavailBadge) {
                unavailBadge.classList.add('hidden');
              }
            }
          });
        });
      }

      // 5. Trigger global app price recalculations & re-renders
      if (typeof window.updateAllPriceDisplays === 'function') {
        window.updateAllPriceDisplays();
      }
      if (typeof window.checkVisaRequirements === 'function' && document.getElementById('visaResultCard')) {
        window.checkVisaRequirements();
      }
      if (typeof window.renderPackages === 'function' && (document.getElementById('packages-grid') || document.getElementById('packagesGrid'))) {
        window.renderPackages();
      }
    }
  }

  const instance = new PricingService();

  // If in browser, sync immediately on load and listen to cross-tab changes
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        instance.cache = null;
        instance.broadcast();
        instance.syncDOM();
      }
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        instance.loadPricing().then(() => instance.syncDOM());
      });
    } else {
      instance.loadPricing().then(() => instance.syncDOM());
    }
  }

  return {
    DEFAULT_PRICING,
    service: instance,
    getPricing: () => instance.getPricing(),
    loadPricing: () => instance.loadPricing(),
    savePricing: (data, token) => instance.savePricing(data, token),
    subscribe: (cb) => instance.subscribe(cb),
    syncDOM: () => instance.syncDOM()
  };
});
