/**
 * Star Plus Travel & Tourism LLC - Supabase Backend Integration
 * Handles live rates synchronization, view analytics hit counter, and guest lead capture.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.StarplusBackend = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const SUPABASE_URL = 'https://wzxeuqoaafnchgeaibzn.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_E1oAdQukxCsZ97wXtq34-Q_UsiweL3W';

  // 11 Default Baseline Packages to seed if table is empty
  const DEFAULT_11_PACKAGES = [
    { package_id: 'UAE-30-DAY', aed: 380, usd: 105, duration: '24–48 Hours', promo_badge: 'Fast Track', is_available: true },
    { package_id: 'UAE-60-DAY', aed: 590, usd: 165, duration: '24–48 Hours', promo_badge: 'Popular', is_available: true },
    { package_id: 'UAE-30-EXT', aed: 790, usd: 220, duration: '24–48 Hours', promo_badge: 'Inside Country', is_available: true },
    { package_id: 'UAE-60-EXT', aed: 990, usd: 275, duration: '24–48 Hours', promo_badge: 'Extended Stay', is_available: true },
    { package_id: 'DESERT-SAFARI', aed: 180, usd: 50, duration: 'Daily Departure', promo_badge: 'Top Seller', is_available: true },
    { package_id: 'DUBAI-CITY', aed: 120, usd: 35, duration: 'Daily Morning', promo_badge: 'Must Do', is_available: true },
    { package_id: 'MARINA-DHOW', aed: 160, usd: 45, duration: 'Daily Evening', promo_badge: 'Dinner Cruise', is_available: true },
    { package_id: 'YACHT-CHARTER', aed: 490, usd: 135, duration: 'Hourly Charter', promo_badge: 'Luxury VIP', is_available: true },
    { package_id: 'AIR-TICKET', aed: 50, usd: 14, duration: 'Instant Issue', promo_badge: 'Best Fares', is_available: true },
    { package_id: 'OK-TO-BOARD', aed: 75, usd: 22, duration: '2–4 Hours', promo_badge: 'Express OTB', is_available: true },
    { package_id: 'AIRPORT-TRANSFER', aed: 150, usd: 42, duration: '24/7 Chauffeur', promo_badge: 'Private Car', is_available: true }
  ];

  // Initialize Supabase Client
  let supabase = null;
  function getClient() {
    if (supabase) return supabase;
    if (typeof window !== 'undefined') {
      if (window.supabaseClient) {
        supabase = window.supabaseClient;
        return supabase;
      }
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        window.supabaseLib = window.supabase;
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = supabase;
        window.supabase = supabase;
        return supabase;
      }
    }
    return null;
  }

  // Fallback REST fetch if JS client SDK is loading
  async function restQuery(endpoint, options = {}) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const headers = Object.assign({
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }, options.headers || {});
    return fetch(url, Object.assign({}, options, { headers }));
  }

  const StarplusBackend = {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    DEFAULT_11_PACKAGES,

    getClient,

    /**
     * Seed default 11 packages if site_pricing is empty
     */
    async seedDefaultsIfEmpty() {
      const client = getClient();
      try {
        if (client) {
          const { data, error } = await client.from('site_pricing').select('package_id');
          if (!error && (!data || data.length === 0)) {
            console.log('[StarplusBackend] Seeding default 11 packages into site_pricing...');
            await client.from('site_pricing').upsert(DEFAULT_11_PACKAGES);
          }
        } else {
          const res = await restQuery('site_pricing?select=package_id');
          if (res.ok) {
            const data = await res.json();
            if (!data || data.length === 0) {
              await restQuery('site_pricing', {
                method: 'POST',
                headers: { 'Prefer': 'resolution=merge-duplicates' },
                body: JSON.stringify(DEFAULT_11_PACKAGES)
              });
            }
          }
        }
      } catch (err) {
        console.warn('[StarplusBackend] Seed check error:', err);
      }
    },

    /**
     * Fetch all live pricing records from site_pricing
     */
    async fetchLivePricing() {
      const client = getClient();
      let rows = [];
      try {
        if (client) {
          const { data, error } = await client.from('site_pricing').select('*');
          if (!error && Array.isArray(data)) {
            rows = data;
          }
        } else {
          const res = await restQuery('site_pricing?select=*');
          if (res.ok) {
            rows = await res.json();
          }
        }
      } catch (err) {
        console.warn('[StarplusBackend] Error fetching live pricing:', err);
      }

      // If remote returned nothing, fallback to local defaults
      if (!rows || rows.length === 0) {
        rows = DEFAULT_11_PACKAGES;
      }

      // Map rows by normalized package_id for easy lookups
      const map = {};
      rows.forEach(r => {
        if (r.package_id) {
          map[r.package_id.toUpperCase()] = r;
          map[r.package_id.toLowerCase()] = r;
        }
      });

      return { rows, map };
    },

    /**
     * Upsert a package price row into site_pricing
     */
    async upsertPricingRow(row) {
      const client = getClient();
      const payload = {
        package_id: String(row.package_id).toUpperCase(),
        aed: Number(row.aed),
        usd: Number(row.usd),
        duration: row.duration || '24–48 Hours',
        promo_badge: row.promo_badge || null,
        is_available: row.is_available !== false,
        updated_at: new Date().toISOString()
      };

      try {
        if (client) {
          const { error } = await client.from('site_pricing').upsert(payload);
          if (error) throw error;
        } else {
          const res = await restQuery('site_pricing', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
        }
        return { success: true, payload };
      } catch (err) {
        console.warn('[StarplusBackend] Failed to upsert pricing row:', err);
        return { success: false, error: err };
      }
    },

    /**
     * Website Views Analytics: increment view count once per user session
     */
    async recordPageView() {
      if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;
      if (sessionStorage.getItem('sp_visited')) return;

      const client = getClient();
      try {
        let currentViews = 1420;
        if (client) {
          const { data, error } = await client.from('site_stats').select('views').eq('id', 'total_views').single();
          if (!error && data && typeof data.views === 'number') {
            currentViews = data.views;
          }
          const nextViews = currentViews + 1;
          await client.from('site_stats').upsert({ id: 'total_views', views: nextViews });
          sessionStorage.setItem('sp_visited', 'true');
        } else {
          const res = await restQuery('site_stats?id=eq.total_views&select=views');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data[0] && typeof data[0].views === 'number') {
              currentViews = data[0].views;
            }
          }
          const nextViews = currentViews + 1;
          await restQuery('site_stats', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates' },
            body: JSON.stringify({ id: 'total_views', views: nextViews })
          });
          sessionStorage.setItem('sp_visited', 'true');
        }
      } catch (err) {
        console.warn('[StarplusBackend] Analytics view recording error:', err);
        sessionStorage.setItem('sp_visited', 'true');
      }
    },

    /**
     * Get total view count for admin display (does not increment)
     */
    async getTotalViews() {
      const client = getClient();
      try {
        if (client) {
          const { data, error } = await client.from('site_stats').select('views').eq('id', 'total_views').single();
          if (!error && data && typeof data.views === 'number') {
            return data.views;
          }
        } else {
          const res = await restQuery('site_stats?id=eq.total_views&select=views');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data[0] && typeof data[0].views === 'number') {
              return data[0].views;
            }
          }
        }
      } catch (err) {
        console.warn('[StarplusBackend] Error fetching total views:', err);
      }
      return 1420;
    },

    /**
     * Frictionless Lead Capture: save lead into client_leads
     */
    async submitLead({ full_name, phone, service_interest }) {
      const client = getClient();
      const payload = {
        full_name: String(full_name || '').trim(),
        phone: String(phone || '').trim(),
        service_interest: String(service_interest || 'General Inquiry').trim(),
        status: 'New'
      };

      try {
        if (client) {
          const { data, error } = await client.from('client_leads').insert([payload]).select();
          if (error) throw error;
          return { success: true, lead: data && data[0] };
        } else {
          const res = await restQuery('client_leads', {
            method: 'POST',
            headers: { 'Prefer': 'return=representation' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          return { success: true, lead: data && data[0] };
        }
      } catch (err) {
        console.warn('[StarplusBackend] Error submitting lead:', err);
        return { success: false, error: err };
      }
    },

    /**
     * Fetch recent client leads for admin portal
     */
    async fetchLeads() {
      const client = getClient();
      try {
        if (client) {
          const { data, error } = await client
            .from('client_leads')
            .select('*')
            .order('created_at', { ascending: false });
          if (!error && Array.isArray(data)) {
            return data;
          }
        } else {
          const res = await restQuery('client_leads?select=*&order=created_at.desc');
          if (res.ok) {
            return await res.json();
          }
        }
      } catch (err) {
        console.warn('[StarplusBackend] Error fetching leads:', err);
      }
      return [];
    }
  };

  // Self-initialize on DOM ready
  if (typeof window !== 'undefined') {
    window.StarplusBackend = StarplusBackend;
    window.addEventListener('DOMContentLoaded', () => {
      StarplusBackend.getClient();
    });
  }

  return StarplusBackend;
});
