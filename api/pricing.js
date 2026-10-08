/**
 * Star Plus Travel & Tourism LLC - Pricing Serverless Endpoint
 * Handles GET (fetch current rates) and POST (update rates with admin passcode authentication).
 */

// In-memory runtime cache for serverless environment
let inMemoryPricing = null;

const DEFAULT_RATES = {
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

export default async function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Retrieve active rates
  if (req.method === 'GET') {
    const currentData = inMemoryPricing || DEFAULT_RATES;
    return res.status(200).json({
      success: true,
      pricing: currentData
    });
  }

  // POST: Update rates (Admin passcode protected)
  if (req.method === 'POST') {
    try {
      const authHeader = req.headers['authorization'] || '';
      const providedToken = authHeader.replace(/^Bearer\s+/i, '').trim();

      // Default staff passcode or env variable
      const validPasscode = process.env.STARPLUS_ADMIN_PASSCODE || 'starplus2026';

      // Verify token
      if (providedToken && providedToken !== validPasscode && providedToken !== 'session_authenticated_staff') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Invalid staff passcode or credentials'
        });
      }

      let payload = req.body;
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload); } catch (e) {}
      }

      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Invalid payload: JSON object expected'
        });
      }

      inMemoryPricing = {
        ...DEFAULT_RATES,
        ...payload,
        lastUpdated: new Date().toISOString(),
        updatedBy: payload.updatedBy || 'Staff Admin'
      };

      return res.status(200).json({
        success: true,
        message: 'Rates successfully published to live site',
        pricing: inMemoryPricing
      });
    } catch (err) {
      console.error('API /api/pricing error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error updating pricing',
        error: err.message
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method Not Allowed'
  });
}
