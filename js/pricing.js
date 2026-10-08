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
        priceAED: 290,
        priceUSD: 80,
        available: true,
        processingTime: 'Daily Departures',
        notes: 'Roundtrip coach + hotel room stay included'
      },
      schengenConcierge: {
        id: 'schengen-concierge',
        name: 'Schengen Concierge & File Prep',
        priceAED: 650,
        priceUSD: 180,
        available: true,
        processingTime: 'Fast Slot Alerts',
        notes: 'VFS/TLS file prep, dummy tickets, travel insurance'
      },
      sriLankaEta: {
        id: 'sri-lanka-eta',
        name: 'Sri Lanka Electronic ETA',
        priceAED: 240,
        priceUSD: 68,
        available: true,
        processingTime: '6–24 Hours',
        notes: 'Double entry 30-day tourist approval'
      }
    },
    packages: {
      sriLankaWonders: {
        id: 'sri-lanka-wonders',
        title: 'Wonders of Sri Lanka Tour',
        destination: 'Sri Lanka (Sigiriya, Kandy, Ella, Bentota)',
        duration: '6 Days / 5 Nights',
        priceAED: 2150,
        priceUSD: 595,
        badge: 'Bestseller',
        available: true
      },
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
      bakuCaucasus: {
        id: 'baku-azerbaijan',
        title: 'Baku & Caucasus Wonders of Azerbaijan',
        destination: 'Baku & Gabala, Azerbaijan',
        duration: '5 Days / 4 Nights',
        priceAED: 2150,
        priceUSD: 595,
        badge: 'Popular',
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
      },
      maldivesEscape: {
        id: 'maldives-escape',
        title: 'Maldives Overwater Resort Luxury Escape',
        destination: 'Maldives',
        duration: '4 Days / 3 Nights',
        priceAED: 3850,
        priceUSD: 1055,
        badge: 'Island Luxury',
        available: true
      }
    },
    services: {
      ticketingMarkup: {
        id: 'ticketing-markup',
        name: 'Airline Ticket Issuance Service Fee',
        priceAED: 50,
        priceUSD: 14,
        description: 'Standard per-ticket issuance and route change management fee'
      },
      flightConsultation: {
        id: 'flight-consultation',
        name: 'VIP Flight Route & Complex Itinerary Consultation',
        priceAED: 100,
        priceUSD: 28,
        description: 'Multi-city route planning and group fare negotiation'
      },
      chauffeurHourly: {
        id: 'chauffeur-hourly',
        name: 'Private Luxury Chauffeur Base Daily Rate',
        priceAED: 450,
        priceUSD: 125,
        description: 'Executive sedan with fuel, toll fees, and bilingual chauffeur'
      },
      hotelBookingFee: {
        id: 'hotel-booking-fee',
        name: 'Direct Hotel & Resort Concierge Booking Service',
        priceAED: 75,
        priceUSD: 21,
        description: 'Exclusive corporate rate matching and room upgrades'
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
            this.cache = Object.assign({}, DEFAULT_PRICING, parsed);
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
     * Asynchronously loads pricing, fetching from serverless API if available.
     */
    async loadPricing() {
      if (typeof fetch === 'function') {
        try {
          const res = await fetch(API_ENDPOINT, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && data.pricing) {
              this.cache = Object.assign({}, DEFAULT_PRICING, data.pricing);
              this.saveLocal(this.cache);
              this.broadcast();
              return this.cache;
            }
          }
        } catch (e) {
          // Gracefully fallback to localStorage or memory
        }
      }
      return this.getPricing();
    }

    /**
     * Save updated pricing data (locally and via API).
     */
    async savePricing(updatedPricing, adminToken) {
      const dataToSave = Object.assign({}, this.getPricing(), updatedPricing, {
        lastUpdated: new Date().toISOString()
      });

      this.cache = dataToSave;
      this.saveLocal(dataToSave);
      this.broadcast();

      // Push to serverless API
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
            return { success: true, pricing: this.cache };
          }
        } catch (err) {
          console.warn('[StarplusPricing] Remote sync error, stored locally:', err);
        }
      }

      return { success: true, localOnly: true, pricing: this.cache };
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

        // 4. Update window.PACKAGES prices if present
        if (Array.isArray(window.PACKAGES)) {
          window.PACKAGES.forEach(pkg => {
            if (pkg.id === 'dubai-luxury' && data.packages.dubaiLuxury) {
              pkg.priceAED = data.packages.dubaiLuxury.priceAED;
            } else if (pkg.id === 'sri-lanka-wonders' && data.packages.sriLankaWonders) {
              pkg.priceAED = data.packages.sriLankaWonders.priceAED;
            } else if (pkg.id === 'baku-azerbaijan' && data.packages.bakuCaucasus) {
              pkg.priceAED = data.packages.bakuCaucasus.priceAED;
            } else if (pkg.id === 'georgia-kazbegi' && data.packages.georgiaKazbegi) {
              pkg.priceAED = data.packages.georgiaKazbegi.priceAED;
            } else if (pkg.id === 'maldives-escape' && data.packages.maldivesEscape) {
              pkg.priceAED = data.packages.maldivesEscape.priceAED;
            }
          });
        }
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
