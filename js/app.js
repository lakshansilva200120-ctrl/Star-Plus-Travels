/**
 * Star Plus Travels - Interactive Application Logic & Video Hero Engine
 */

// Exchange Rates relative to AED (Base currency: AED)
const CURRENCIES = {
  AED: { symbol: 'AED ', rate: 1, name: 'UAE Dirham (AED)' },
  USD: { symbol: '$', rate: 0.272, name: 'US Dollar (USD)' },
  EUR: { symbol: '€', rate: 0.237, name: 'Euro (EUR)' },
  GBP: { symbol: '£', rate: 0.204, name: 'British Pound (GBP)' },
  LKR: { symbol: 'LKR ', rate: 82.5, name: 'Sri Lankan Rupee (LKR)' }
};

let currentCurrency = 'AED';
try {
  const savedCurrency = localStorage.getItem('starplus_pref_currency');
  if (savedCurrency && CURRENCIES[savedCurrency] && savedCurrency !== 'LKR') {
    currentCurrency = savedCurrency;
  } else if (savedCurrency === 'LKR') {
    currentCurrency = 'AED';
    localStorage.setItem('starplus_pref_currency', 'AED');
  }
} catch (e) {}

// ==========================================================================
// Real-Time Currency Conversion & Exchange Rate Engine
// Base Currency: AED (United Arab Emirates Dirham)
// Open Rate API: https://open.er-api.com/v6/latest/AED
// Caches live rates in localStorage ('starplus_fx_rates') for 24 hours.
// ==========================================================================
const FX_CONFIG = {
  endpoint: 'https://open.er-api.com/v6/latest/AED',
  cacheKey: 'starplus_fx_rates',
  prefKey: 'starplus_pref_currency',
  cacheTTL: 24 * 60 * 60 * 1000, // 24 hours in ms
  baselineRates: {
    AED: 1,
    USD: 0.272,
    EUR: 0.237,
    GBP: 0.204,
    LKR: 82.5
  }
};

/**
 * Format secondary price with luxury formatting.
 * LKR has been completely removed per client requirement.
 */
function formatSecondaryPrice(baseAED, targetCurrency) {
  const numAED = parseFloat(baseAED);
  if (isNaN(numAED) || numAED <= 0) return '';

  const target = targetCurrency || (currentCurrency === 'LKR' ? 'USD' : 'LKR');
  // LKR completely removed per client requirement - suppress residual secondary LKR subtext
  if (target === 'LKR' || currentCurrency === 'LKR') {
    return '';
  }
  const rate = (CURRENCIES[target] && CURRENCIES[target].rate) ? CURRENCIES[target].rate : (FX_CONFIG.baselineRates[target] || 1);

  if (target === 'USD') {
    const usdPrice = Math.round(numAED * rate);
    return `$${new Intl.NumberFormat('en-US').format(usdPrice)}`;
  } else if (target === 'EUR') {
    const eurPrice = Math.round(numAED * rate);
    return `€${new Intl.NumberFormat('en-DE').format(eurPrice)}`;
  } else if (target === 'GBP') {
    const gbpPrice = Math.round(numAED * rate);
    return `£${new Intl.NumberFormat('en-GB').format(gbpPrice)}`;
  } else {
    return `AED ${new Intl.NumberFormat('en-AE').format(numAED)}`;
  }
}
window.formatSecondaryPrice = formatSecondaryPrice;

/**
 * Update all elements across the DOM matching .price-aed / [data-base-aed]
 * and .price-secondary / [data-secondary-for]
 */
function updateAllPriceDisplays() {
  // 1. Update elements with [data-base-aed] or .price-aed
  document.querySelectorAll('.price-aed, [data-base-aed]').forEach(el => {
    const rawAED = el.getAttribute('data-base-aed');
    if (!rawAED) return;
    const baseAED = parseFloat(rawAED);
    if (isNaN(baseAED) || baseAED <= 0) return;

    const formatted = typeof formatPrice === 'function' ? formatPrice(baseAED) : `AED ${baseAED.toLocaleString()}`;
    if (el.hasAttribute('data-price-template')) {
      const tpl = el.getAttribute('data-price-template');
      el.textContent = tpl.replace('{price}', formatted);
    } else {
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      if (prefix || suffix) {
        el.textContent = `${prefix}${formatted}${suffix}`;
      } else {
        el.textContent = formatted;
      }
    }
  });

  // 2. Update elements with [data-secondary-for] or .price-secondary
  document.querySelectorAll('.price-secondary, [data-secondary-for]').forEach(el => {
    const rawFor = el.getAttribute('data-secondary-for');
    if (!rawFor) return;
    const baseAED = parseFloat(rawFor);
    if (isNaN(baseAED) || baseAED <= 0) return;

    const secFormatted = formatSecondaryPrice(baseAED);
    if (!secFormatted) {
      el.textContent = '';
      return;
    }

    if (el.hasAttribute('data-template')) {
      const tpl = el.getAttribute('data-template');
      el.textContent = tpl.replace('{secondary}', secFormatted);
    } else if (el.hasAttribute('data-with-slash')) {
      el.textContent = `/ person (${secFormatted})`;
    } else {
      el.textContent = `(${secFormatted})`;
    }
  });
}
window.updateAllPriceDisplays = updateAllPriceDisplays;

function applyExchangeRates(rates) {
  if (!rates) return;
  if (rates.LKR && CURRENCIES.LKR) CURRENCIES.LKR.rate = rates.LKR;
  if (rates.USD && CURRENCIES.USD) CURRENCIES.USD.rate = rates.USD;
  if (rates.EUR && CURRENCIES.EUR) CURRENCIES.EUR.rate = rates.EUR;
  if (rates.GBP && CURRENCIES.GBP) CURRENCIES.GBP.rate = rates.GBP;
}

/**
 * Real-Time Exchange Rate Fetcher & Cache
 */
async function fetchExchangeRates() {
  try {
    // Check cached rates in localStorage
    const cachedStr = localStorage.getItem(FX_CONFIG.cacheKey);
    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr);
        const age = Date.now() - (cached.timestamp || 0);
        if (age < FX_CONFIG.cacheTTL && cached.rates && typeof cached.rates === 'object') {
          applyExchangeRates(cached.rates);
          updateAllPriceDisplays();
          return;
        }
      } catch (err) {
        console.warn('FX cache parse error:', err);
      }
    }

    // Fetch from open endpoint: https://open.er-api.com/v6/latest/AED
    const res = await fetch(FX_CONFIG.endpoint, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data && data.result === 'success' && data.rates) {
      const freshRates = {
        AED: 1,
        LKR: data.rates.LKR || FX_CONFIG.baselineRates.LKR,
        USD: data.rates.USD || FX_CONFIG.baselineRates.USD,
        EUR: data.rates.EUR || FX_CONFIG.baselineRates.EUR,
        GBP: data.rates.GBP || FX_CONFIG.baselineRates.GBP
      };

      try {
        localStorage.setItem(FX_CONFIG.cacheKey, JSON.stringify({
          timestamp: Date.now(),
          rates: freshRates
        }));
      } catch (e) {}

      applyExchangeRates(freshRates);
      updateAllPriceDisplays();
    } else {
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.warn('Live FX rate fetch failed, using baseline fallback:', error.message);
    applyExchangeRates(FX_CONFIG.baselineRates);
    updateAllPriceDisplays();
  }
}
window.fetchExchangeRates = fetchExchangeRates;


// ==========================================================================
// Google Apps Script Web App Endpoint
// Saves submissions to Google Sheets and emails info@starplustraveluae.com
// ==========================================================================
const GOOGLE_APPS_SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz7vtBsDq--xmYbATR1Zszv2aO-aZeIIeJRvrj4OJgpYhPu9ZJjRTWDPu88y5_sW0DN/exec';

// ==========================================================================
// Formspree Integration Endpoint (Contact & Inquiry Forms)
// Replace YOUR_FORMSPREE_ID_HERE with your actual Formspree Form ID (e.g. 'xpzgkroe')
// ==========================================================================
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_ID_HERE';

// ==========================================================================
// Localization / Internationalization (i18n) Engine (English & Sinhala)
// ==========================================================================
const I18N_TRANSLATIONS = {
  en: {
    // Top Bar
    topAnnouncementText: "Star Plus Travel & Tourism LLC • Premier Travel & Visa Specialists",
    topLocation: "Deira, Dubai, UAE & Colombo, Sri Lanka",
    whatsappConcierge: "WhatsApp Concierge",
    themeLabel: "Theme",
    langLabel: "Language",

    // Navigation
    navHome: "Home",
    navClients: "Clients",
    navPackages: "Tour Packages",
    navDestinations: "Destinations",
    navActivitiesVisa: "Activities & Visas",
    navVisa: "Visa Services",
    navWhyUs: "Why Choose Us",
    navReviews: "Reviews",
    navExplore: "Explore",
    navCareers: "Careers",
    navTerms: "Terms & Conditions",
    navFaq: "FAQ",
    navContact: "Contact",
    navGetQuote: "Get Free Quote",
    navHiringBadge: "We're Hiring",

    // Modular & Global Keys (js/translations.js)
    nav_home: "Home",
    nav_destinations: "Destinations",
    nav_packages: "Packages",
    nav_contact: "Contact Us",
    hero_title: "Explore the World with Star Plus Travels",
    hero_subtitle: "Curated luxury tours, seamless visa solutions, and unforgettable journeys.",
    card_best_season: "Best Season:",
    card_recommended: "Recommended:",
    card_starting_from: "Starting from:",
    card_view_details: "View Details",
    footer_rights: "All rights reserved.",

    // Hero Section
    heroBadge: "STAR PLUS TRAVEL & TOURISM LLC • DUBAI & COLOMBO ★",
    heroTitleFull: '<span class="block">The Luxury Experience of a Trusted Journey,</span><span class="text-amber-400 block mt-1 sm:mt-1.5">Turn Your Global Travel Dream into Reality.</span>',
    heroTitleLead: "The Luxury Experience of a Trusted Journey,",
    heroTitleWorld: "Turn Your Global Travel Dream into Reality.",
    heroTitleMiddle: "",
    heroTitleLuxury: "Turn Your Global Travel Dream into Reality.",
    heroSubtitle: "Experience seamless global travel with Star Plus Travel & Tourism LLC. Handcrafted luxury holiday packages, competitive airline flights, and fast-track express visas from Dubai & Sri Lanka to 45+ worldwide destinations.",
    tabHolidays: "Tour Packages",
    tabFlights: "Flight Inquiries",
    tabVisas: "Fast-Track Visas",
    tabHotels: "Luxury Hotels",
    destinationLabel: "Destination",
    destinationPlaceholder: "e.g. Dubai, Sri Lanka, Baku",
    travelDateLabel: "Travel Date",
    travelersLabel: "Travelers",
    searchBtn: "Find Deals",
    trendingLabel: "Trending Now:",
    opt1Solo: "1 Solo Explorer",
    opt2Couple: "2 Adults (Couple)",
    opt3Travelers: "3 Travelers",
    opt4Family: "4+ Family / Group",

    // Trust Counters
    trustTravelers: "15,000+",
    trustTravelersLabel: "Happy Explorers Served",
    trustDestinations: "45+",
    trustDestinationsLabel: "Global Destinations",
    trustVisaRate: "99.2%",
    trustVisaRateLabel: "Visa Approval Rate",
    trustRatingLabel: "Google & Trustpilot Rating",

    // Clients
    clientsBadge: "Our Clients",
    clientsTitle: "Join Our Family of Happy Travelers & Partners",
    clientsSubtitle: "Trusted by leading corporate enterprises, luxury hospitality groups, and commercial organizations across the UAE, Sri Lanka, and worldwide.",

    // Why Choose Us
    whyUsBadge: "The Star Plus Difference",
    whyUsTitle: "Why Discerning Travelers Choose Us",
    whyUsSubtitle: "We combine local insider knowledge with world-class hospitality to ensure every moment of your trip is effortless and memorable.",
    whyUs1Title: "Best Price & Luxury Guarantee",
    whyUs1Desc: "Direct contracts with top luxury 4★ and 5★ resorts, airlines, and local tour operators giving you unmatched value.",
    whyUs1Tag: "Price Match Promise",
    whyUs2Title: "Express Visa Processing",
    whyUs2Desc: "In-house government registered visa documentation specialists for UAE 30/60 days, Schengen, UK, USA & Oman runs.",
    whyUs2Tag: "99.2% Success Rate",
    whyUs3Title: "Fly Now, Pay Later",
    whyUs3Desc: "Split your holiday payments into 4 interest-free monthly installments with Tabby and Tamara in the UAE.",
    whyUs3Tag: "0% Interest with Tabby",
    whyUs4Title: "24/7 Dedicated Concierge",
    whyUs4Desc: "Round-the-clock support in English, Arabic, Sinhala, and Tamil with dedicated personal trip advisors.",
    whyUs4Tag: "Instant WhatsApp Help",

    // Packages Section
    packagesBadge: "Hand-Picked Getaways",
    packagesTitle: "Featured Tour Packages",
    packagesCount: "Showing curated premium itineraries",
    catAll: "All Packages",
    catHoliday: "Holiday Packages",
    catCorporate: "Corporate & MICE",
    catVisaBundle: "Visa Bundles",
    catDubai: '<i class="fa-solid fa-city mr-1.5 text-amber-400"></i>Dubai &amp; UAE',
    catSriLanka: '<i class="fa-solid fa-gem mr-1.5 text-amber-400"></i>Sri Lanka',
    catCaucasus: '<i class="fa-solid fa-mountain-sun mr-1.5 text-amber-400"></i>Caucasus &amp; Europe',
    catTropical: '<i class="fa-solid fa-umbrella-beach mr-1.5 text-amber-400"></i>Tropical Islands',
    catSpiritual: '<i class="fa-solid fa-mosque mr-1.5 text-amber-400"></i>Umrah &amp; Spiritual',
    customTripBadge: "Tailor-Made Holidays",
    customTripTitle: "Don't see your dream destination?",
    customTripDesc: "Our luxury travel planners can customize any itinerary for families, honeymoons, solo trips, or corporate groups.",
    customTripBtn: "Request Custom Itinerary",

    // Visa Hub
    visaBadge: "Fast-Track Visa Processing",
    visaTitle: "Hassle-Free Visas for UAE & Worldwide Travel",
    visaSubtitle: "Avoid embassy queues and paperwork stress. Star Plus Travels is an accredited travel and visa consultancy in Dubai, providing express tourist visas, freelance visas, and European Schengen appointments.",
    visaFeature1: "UAE Tourist Visas: 30 Days & 60 Days Single/Multiple entry issued in 24 hours.",
    visaFeature2: "Oman Visa Change: Daily luxury air-conditioned bus departures from Deira.",
    visaFeature3: "Schengen, UK & USA: Full documentation, appointment booking & dummy tickets.",
    visaCheckerTitle: "Interactive Visa Checker",
    visaCheckerSubtitle: "Select a destination to check requirements and turnaround time",
    visaCategoryLabel: "Select Visa Category",

    // Season Promo
    promoBadge: "Exclusive Limited Offer",
    promoTitle: "Save up to 35% on Winter & Eid Holiday Bookings!",
    promoDesc: "Use promo code STARPLUS when requesting your custom travel itinerary before the end of the month.",
    promoBtn: "Claim Promo Discount",
    promoNote: "Terms & Conditions Apply • 0% Tabby Installments Available",

    // Testimonials
    testimonialsBadge: "Google Verified Reviews",
    testimonialsTitle: 'Rated <span class="text-amber-500 font-black">4.9 / 5.0</span> on Google Reviews',
    testimonialsSubtitle: "Authentic reviews from travelers who visited our Twin Towers, Deira office and booked custom holidays, visa services, and flights.",

    // FAQ
    faqBadge: "Got Questions?",
    faqTitle: "Frequently Asked Questions",
    faq1Q: "Can I customize the daily itinerary or hotel rating for my package?",
    faq1A: "Yes, absolutely! All our itineraries can be customized according to your exact preferences, travel dates, budget, or preferred hotel chains (e.g. 4-star boutique, 5-star luxury, private pool villas). Contact our concierge to tweak any schedule.",
    faq2Q: "How does the \"Fly Now, Pay Later\" (Tabby / Tamara) installment work?",
    faq2A: "UAE residents with a valid Emirates ID and debit/credit card can split their total tour or flight cost into 4 equal monthly installments with zero interest and zero hidden fees via Tabby or Tamara.",
    faq3Q: "How long does UAE tourist visa processing take?",
    faq3A: "Our standard UAE 30-day and 60-day tourist visas are typically approved within 24 to 48 hours. We also offer express rush processing within 12 hours for urgent travel requirements.",
    faq4Q: "What is included in the Oman visa change by luxury coach?",
    faq4A: "The Oman border bus package includes roundtrip transportation in comfortable luxury air-conditioned coaches departing from Deira Dubai, Oman border exit/entry handling, Oman transit visa, and issuance of your new UAE tourist visa.",

    // Contact
    contactBadge: "Get in Touch",
    contactTitle: "Let's Plan Your Next Adventure",
    contactSubtitle: "Fill out the inquiry form or contact our offices directly. Our travel specialists in Dubai and Colombo are ready to assist you.",
    contactUaeOffice: "Dubai Headquarters, UAE",
    contactUaeAddress: "Office 204, Al Rigga Business Center, Deira, Dubai",
    contactSlOffice: "Colombo Branch, Sri Lanka",
    contactSlAddress: "Galle Road, Colombo 03",
    whatsappBtnText: "Chat Directly on WhatsApp",
    socialTitle: "Connect On Official Channels",
    careersSpotlightTitle: "Looking for a Career in Travel?",
    careersSpotlightDesc: "We have 6 open positions across UAE & Sri Lanka.",
    careersSpotlightBtn: "View Jobs",
    formTitle: "Request a Free Travel Itinerary & Quote",
    formSubtitle: "We respond with comprehensive options and transparent pricing within 2 hours.",
    formFullName: "Your Full Name *",
    formEmail: "Email Address *",
    formPhone: "Phone / WhatsApp Number *",
    formInterest: "Primary Interest",
    formInterestPackage: "Holiday Tour Package",
    formInterestVisa: "Fast-Track Visa Processing",
    formInterestFlight: "Cheap Airline Tickets",
    formInterestCustom: "Custom Tailor-Made Itinerary",
    formDestination: "Preferred Destination",
    formTravelers: "Estimated Travelers",
    formNotes: "Trip Notes / Special Requests",
    formNotesPlaceholder: "Tell us about your preferred travel dates, hotel rating preference, or special requests...",
    formSubmitBtn: "Send Travel Request",
    formPaymentNoticeTitle: "Official Payment Protection Notice:",
    formPaymentNoticeText: "All payments must be made strictly to our official company bank account. We will never ask you to transfer funds to a personal account.",

    // Footer
    footerAbout: "Star Plus Travel & Tourism LLC is a government accredited travel management company based in Deira, Dubai with branch operations in Sri Lanka. Providing world-class bespoke holiday packages, airline bookings, and express visa solutions.",
    footerDesc: "Star Plus Travel & Tourism LLC is a premier licensed travel agency in the United Arab Emirates and Sri Lanka, delivering bespoke luxury vacations, corporate airline ticketing, and rapid express visa processing.",
    footerUaeInq: '<i class="fa-solid fa-building mr-1 text-amber-400"></i>UAE Inquiries:',
    footerSlInq: '<i class="fa-solid fa-landmark mr-1 text-amber-400"></i>Sri Lanka Inquiries:',
    footerQuickLinks: "Quick Links",
    footerTopPackages: "Top Packages",
    footerDestinations: "Key Hubs",
    footerLegal: "Accreditations",
    footerCopyright: "© 2026 Star Plus Travel & Tourism LLC. All rights reserved.",
    footerAttribution: "Redesigned & Developed by Lupo",
    footerCopyrightBar: "© 2026 Star Plus Travel & Tourism LLC. All rights reserved. • Redesigned & Developed by Lupo",

    // Careers Page
    topBarHiring: "We're Hiring! Join our growing teams in Dubai &amp; Sri Lanka",
    careersBadge: "Careers at Star Plus Travel &amp; Tourism LLC",
    careersHeroTitle: "Turn Travel Dreams Into Lifelong Careers",
    careersHeroSubtitle: "We are building the next generation of seamless international travel, luxury vacations, and visa solutions. Join our multi-cultural teams in Dubai, UAE and Colombo, Sri Lanka.",
    uaeBranchAppTitle: "UAE Branch Applications",
    uaeBranchAppSubtitle: "Head Office &bull; Deira, Dubai",
    uaeBranchAppDesc: "Direct HR contact for UAE work permits &amp; Dubai based vacancies.",
    slBranchAppTitle: "Sri Lanka Branch Applications",
    slBranchAppSubtitle: "Regional Branch &bull; Colombo",
    slBranchAppDesc: "Direct HR contact for Sri Lanka operations &amp; creative vacancies.",
    whyCareersBadge: "Why Star Plus?",
    whyCareersTitle: "Empowering Your Passion for Global Exploration",
    perk1Title: "Travel Perks &amp; FAM Trips",
    perk1Desc: "Exclusive employee airline rates, discounted holiday packages, and sponsored destination familiarization trips.",
    perk2Title: "Competitive Compensation",
    perk2Desc: "Attractive salary packages, performance-based booking commissions, and comprehensive health coverage.",
    perk3Title: "Dual Regional Reach",
    perk3Desc: "Cross-border collaboration between our vibrant UAE hub in Dubai and our Sri Lanka operations in Colombo.",
    perk4Title: "GDS &amp; Tourism Training",
    perk4Desc: "Continuous professional training on Amadeus, Sabre, visa policies, customer management, and digital marketing.",
    vacanciesBadge: "Open Vacancies",
    vacanciesTitle: "Current Career Opportunities",
    vacanciesSubtitle: "Select a position below to review requirements and submit your resume directly to our regional HR desks.",
    filterAllRoles: "All Roles (6)",
    filterUaeRoles: '<i class="fa-solid fa-building mr-1 text-amber-400"></i>Dubai, UAE (3)',
    filterSlRoles: '<i class="fa-solid fa-landmark mr-1 text-amber-400"></i>Sri Lanka (3)',
    spontaneousBadge: "Don't see your specific role?",
    spontaneousTitle: "Send Us a Spontaneous Application",
    spontaneousDesc: "We are always on the lookout for visionary travel planners, corporate sales leaders, and visa specialists. Email your CV and cover note to our regional HR desks anytime:",
    spontaneousUaeBtn: '<i class="fa-solid fa-envelope mr-1.5"></i>Email UAE HR Desk (info@starplustraveluae.com)',
    spontaneousSlBtn: '<i class="fa-solid fa-envelope mr-1.5 text-amber-500"></i>Email SL HR Desk (info@starplustravelsl.com)',
    footerBranches: "Our Branches",
    recruitmentDesks: "Recruitment Desks",
    recruitmentDesksSubtitle: "Submit CVs directly to our regional talent acquisition teams:",
    explorePositions: "Explore 6 Open Positions",
    viewRolesBtn: "View Open Roles",
    // Terms & Conditions Page
    termsBadge: "Legal Disclosures &amp; Policies",
    termsPageTitle: "Terms &amp; Conditions",
    termsPageSubtitle: "Clear, transparent booking policies, immigration regulatory disclaimers, installment terms, and consumer rights.",
    termsArt1Title: "Company Licensing &amp; Scope of Services",
    termsArt1Desc: "Star Plus Travel & Tourism LLC is a registered, licensed entity authorized by the Government of Dubai Department of Economy and Tourism (DET) in the United Arab Emirates, and affiliated with Star Plus Travel (PVT) LTD accredited under the Sri Lanka Tourism Development Authority (SLTDA). By booking holiday packages, international airline tickets, visa concierge services, or transportation through Star Plus Travels, the client acknowledges and enters into an agreement governed by the terms specified herein.",
    termsArt2Title: "Tour Package Quotations &amp; Confirmations",
    termsArt2Desc: "All published or quoted prices are subject to inventory availability and airline fare fluctuations until full payment or the agreed initial deposit has been secured. Star Plus Travels guarantees that once an official booking confirmation voucher has been issued, no supplementary fuel surcharges or unexpected taxes will be added unless mandated by sudden government statutory decree.",
    termsArt3Title: "Split Payments &amp; Installments (Tabby &amp; Tamara)",
    termsArt3Desc: "Customers utilizing split payment solutions (such as Tabby or Tamara) enter into an independent financing relationship with the respective payment provider. Approval of split installment eligibility is determined entirely by Tabby or Tamara algorithms based on UAE Emirates ID verification and credit scoring. Star Plus Travels does not charge any interest or financing fees for split installments. Any late penalty fees assessed for overdue payments are governed strictly by the provider's consumer terms.",
    termsArt4Title: "Official Company Bank Accounts &amp; Secure Payment Policy",
    termsArt4Desc: "All payments must be made strictly to our official company bank account. We will never ask you to transfer funds to a personal account.",
    termsArt4ClauseTitle: "Official Payment Protection Clause:",
    termsArt4ClauseDesc: "All monetary remittances—including holiday deposits, flight ticketing charges, visa processing fees, and hotel reservations—must be remitted exclusively to the verified corporate bank accounts of <strong>Star Plus Travel & Tourism LLC</strong> (in the UAE) or <strong>Star Plus Travel (PVT) LTD</strong> (in Sri Lanka), or completed via our authorized point-of-sale terminals or accredited installment gateways. Under no circumstances will any representative, employee, or agent of Star Plus Travels instruct a client to transfer funds into an individual or personal account.",
    termsArt5Title: "Visa Applications &amp; Immigration Disclaimers",
    termsArt5Desc: "Star Plus Travels provides visa application review, document compliance auditing, and authorized portal lodgment services. <strong>Crucial Notice:</strong> The final authority to grant, delay, or reject any tourist, transit, or entry visa rests exclusively with sovereign immigration bodies, including the UAE General Directorate of Residency and Foreigners Affairs (GDRFA), Federal Authority for Identity, Citizenship, Customs and Port Security (ICP), and relevant foreign embassies.",
    termsArt5FeesTitle: "Non-Refundable Government Fees:",
    termsArt5FeesDesc: "Government processing fees, consular stamp duties, and administrative filing costs are non-refundable under any circumstances once an application is lodged into official immigration databases, regardless of whether a visa is approved, delayed, or rejected.",
    termsArt6Title: "Cancellation, Amendments &amp; Refunds",
    termsArt6Desc: 'Cancellation requests must be submitted in writing to our official email address (<a href="mailto:info@starplustraveluae.com" class="text-amber-400 underline">info@starplustraveluae.com</a>). Refund entitlements are determined according to the following schedule:',
    termsArt6Tier1: "<strong>30+ Days Prior to Departure:</strong> 90% refund of land package costs (airline tickets subject to carrier tariff rules).",
    termsArt6Tier2: "<strong>15 to 29 Days Prior to Departure:</strong> 70% refund of land package costs.",
    termsArt6Tier3: "<strong>7 to 14 Days Prior to Departure:</strong> 50% refund of land package costs.",
    termsArt6Tier4: "<strong>Under 7 Days or No-Show:</strong> Non-refundable due to committed hotel and transportation locks.",
    termsArt7Title: "Passport Validity, Health &amp; Travel Insurance",
    termsArt7Desc: "It is the traveler's sole responsibility to ensure their passport possesses a minimum of six (6) months validity from the scheduled return date. Star Plus Travels strongly advises all travelers to hold comprehensive international travel medical and luggage insurance. For Schengen visas and select international destinations, proof of insurance meeting statutory minimum medical coverage (EUR 30,000) is mandatory.",
    termsArt8Title: "Governing Law &amp; Legal Jurisdiction",
    termsArt8Desc: "These terms and conditions, along with any dispute or claim arising out of or in connection with them, shall be governed by and construed in accordance with the federal laws of the United Arab Emirates and the Emirate of Dubai for UAE-booked contracts, and the laws of the Democratic Socialist Republic of Sri Lanka for contracts executed through our Colombo desk. The competent courts of Dubai or Colombo shall have exclusive jurisdiction.",
    termsInquiriesContact: 'For questions regarding our terms, cancellation notices, or corporate agreements, please contact our legal desk at <a href="mailto:info@starplustraveluae.com" class="text-amber-400 hover:underline font-semibold">info@starplustraveluae.com</a> or call <a href="tel:+971527582293" class="text-slate-200 hover:text-amber-400 font-semibold">+971 52 758 2293</a> / <a href="tel:+97145751321" class="text-slate-200 hover:text-amber-400 font-semibold">+971 4 575 1321</a>.',
    termsFooterVipDeals: "VIP Travel Deals",
    termsFooterVipDesc: "Subscribe for unpublished secret airline rates and discount flash sales.",
    termsFooterSubscribe: "Subscribe",
    termsFooterEmailPlaceholder: "Enter your email",
    termsFooterAcceptedPayment: "Accepted Payment:",

    // Reviews Page & Showcase
    reviewsHeroBadge: "Client Testimonials &amp; Trust",
    reviewsHeroTitle: "Verified Traveler &amp; Client Stories",
    reviewsHeroSubtitle: "Discover why international voyagers, expatriates, and multinational corporate clients choose Star Plus Travel &amp; Tourism LLC for bespoke vacations, corporate delegations, and expedited visa solutions.",
    reviewsAggregateScore: "★ 4.9 Rating based on Google Business Profile Reviews",
    reviewsAggregateSubtitle: "Verified reviews from international travelers &amp; corporate clients across Dubai &amp; Colombo",
    badgeDtcmLicensed: '<i class="fa-solid fa-shield-halved text-[#F59E0B]"></i> DTCM Licensed Travel Agency',
    badgeGoogleVerified: '<i class="fa-brands fa-google text-[#4285F4]"></i> Google Verified Reviews',
    badgeVisaGuaranteed: '<i class="fa-solid fa-circle-check text-[#10B981]"></i> 100% Guaranteed Visa Approvals',
    btnReadGoogleReviews: "Read all reviews on Google Maps",
    btnLeaveGoogleReview: "Leave a Google Review",
    btnLeaveReview: "Leave a Review",
    btnReadAllReviews: "Read All Customer Reviews",
    filterAllReviews: "All Reviews",
    filterHolidayPackages: "Holiday Packages",
    filterUaeVisas: "UAE Visas",
    filterCorporateMice: "Corporate &amp; MICE",
    filterFlightsHotels: "Flights &amp; Hotels",
    badgeGoogleVerifiedReview: "Google Verified Review",
    badgeVerifiedTraveler: "Verified Traveler",
    badgeVerifiedClient: "Verified Client",
    bookedServicePrefix: "Booked:",
    reviewsCtaTitle: "Ready to Plan Your Next Journey?",
    reviewsCtaDesc: "Whether you require express 24-hour visa processing, tailor-made luxury holiday packages, or VIP corporate travel management, our licensed consultants are at your service across Dubai and Colombo.",
    reviewsCtaSpecialistBtn: '<i class="fa-brands fa-whatsapp text-lg"></i><span>Chat with a Specialist</span>',
    reviewsCtaPlanBtn: '<i class="fa-solid fa-compass text-sm"></i><span>Plan Custom Itinerary</span>',
    reviewsCtaRecentlyBooked: "Recently booked with Star Plus Travels?",
    reviewsCtaLeaveReview: '<span>Leave a Google Review</span><i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>',

    // Form Standard Placeholders & Buttons
    placeholderEnterEmail: "Enter your email",
    placeholderFullName: "Your Full Name",
    placeholderPhone: "Phone / WhatsApp Number",
    placeholderTripNotes: "Trip Notes / Special Requests",
    btnConfirmAppRequest: "CONFIRM APPLICATION REQUEST",
    btnConfirmBookingRequest: "Confirm Booking Request",
    btnSubscribe: "SUBSCRIBE",
    btnInquireWhatsApp: "Inquire via WhatsApp",

    // Dynamic strings
    startingFrom: "Starting from",
    perPerson: "per person",
    installmentText: "or 4x {amount}/mo with Tabby",
    itineraryBtn: "Itinerary",
    bookNowBtn: "Book Now"
  },

  si: {
    // Top Bar
    topAnnouncementText: "Star Plus Travel & Tourism LLC • ඩුබායි සහ ශ්‍රී ලංකා ප්‍රමුඛතම සංචාරක සහ වීසා විශේෂඥයෝ",
    topLocation: "දෙයිරා, ඩුබායි සහ කොළඹ, ශ්‍රී ලංකාව",
    whatsappConcierge: "වට්ස්ඇප් සේවාව",
    themeLabel: "තේමාව",
    langLabel: "භාෂාව",

    // Navigation
    navHome: "මුල් පිටුව",
    navClients: "පාරිභෝගිකයින්",
    navPackages: "සංචාරක පැකේජ",
    navDestinations: "ගමනාන්ත",
    navActivitiesVisa: "ක්‍රියාකාරකම් සහ වීසා",
    navVisa: "වීසා සේවා",
    navWhyUs: "ඇයි Star Plus",
    navReviews: "ප්‍රසාද අදහස්",
    navExplore: "ගවේෂණය",
    navCareers: "රැකියා අවස්ථා",
    navTerms: "නියම සහ කොන්දේසි",
    navFaq: "නිතර අසන ප්‍රශ්න",
    navContact: "අප අමතන්න",
    navGetQuote: "මිල ගණන් ලබාගන්න",
    navHiringBadge: "බඳවා ගැනේ",

    // Modular & Global Keys (js/translations.js)
    nav_home: "මුල් පිටුව",
    nav_destinations: "ගමනාන්ත",
    nav_packages: "පැකේජ",
    nav_contact: "අප අමතන්න",
    hero_title: "Star Plus Travels සමඟ ලොව වටා සංචාරය කරන්න",
    hero_subtitle: "විශේෂිත සුඛෝපභෝගී සංචාර, වීසා සේවා සහ අමතක නොවන අත්දැකීම්.",
    card_best_season: "හොඳම කාලය:",
    card_recommended: "නිර්දේශිත කාලය:",
    card_starting_from: "ආරම්භක මිල:",
    card_view_details: "විස්තර බලන්න",
    footer_rights: "සියලු හිමිකම් ඇවිරිණි.",

    // Hero Section
    heroBadge: "STAR PLUS TRAVEL & TOURISM LLC • ඩුබායි සහ ශ්රී ලංකාව ★",
    heroTitleFull: '<span class="block">විශ්වාසනීය ගමනක සුඛෝපභෝගී අත්දැකීම —</span><span class="text-amber-400 block mt-1 sm:mt-1.5">ඔබේ ලෝක සංචාරක සිහිනය සැබෑ කරගන්න.</span>',
    heroTitleLead: "විශ්වාසනීය ගමනක සුඛෝපභෝගී අත්දැකීම —",
    heroTitleWorld: "ඔබේ ලෝක සංචාරක සිහිනය සැබෑ කරගන්න.",
    heroTitleMiddle: "",
    heroTitleLuxury: "ඔබේ ලෝක සංචාරක සිහිනය සැබෑ කරගන්න.",
    heroSubtitle: "Star Plus Travel & Tourism LLC වෙතින් ඩුබායි, ශ්‍රී ලංකාව සහ ලොව පුරා රටවල් 45+ කට සුඛෝපභෝගී නිවාඩු පැකේජ, අඩුම ගුවන් ටිකට්පත් සහ ක්ෂණික වීසා සේවා විශ්වාසනීයව ලබාගන්න.",
    tabHolidays: "සංචාරක පැකේජ",
    tabFlights: "ගුවන් ටිකට්පත්",
    tabVisas: "වීසා සේවා",
    tabHotels: "හෝටල් වෙන්කිරීම්",
    destinationLabel: "ගමනාන්තය",
    destinationPlaceholder: "උදා: ඩුබායි, ශ්‍රී ලංකාව, බාකු",
    travelDateLabel: "සංචාරක දිනය",
    travelersLabel: "සංචාරකයින්",
    searchBtn: "පැකේජ සොයන්න",
    trendingLabel: "ජනප්‍රියම ගමනාන්ත:",
    opt1Solo: "තනි සංචාරකයෙක්",
    opt2Couple: "වැඩිහිටියන් 2 (යුවළක්)",
    opt3Travelers: "සංචාරකයින් 3 දෙනෙක්",
    opt4Family: "4+ පවුල / කණ්ඩායම",

    // Trust Counters
    trustTravelers: "15,000+",
    trustTravelersLabel: "සතුටුදායක සංචාරකයින්",
    trustDestinations: "45+",
    trustDestinationsLabel: "ජාත්‍යන්තර ගමනාන්ත",
    trustVisaRate: "99.2%",
    trustVisaRateLabel: "වීසා අනුමැතියේ සාර්ථකත්වය",
    trustRatingLabel: "Google & Trustpilot ඉහළම ඇගයීම",

    // Clients
    clientsBadge: "අපගේ පාරිභෝගිකයින්",
    clientsTitle: "අපගේ සතුටුදායක පාරිභෝගික පවුලට ඔබත් එක්වන්න",
    clientsSubtitle: "එක්සත් අරාබි එමීර් රාජ්‍යය, ශ්‍රී ලංකාව සහ ලොව පුරා ප්‍රමුඛ සංගත ආයතන හා හවුල්කරුවන්ගේ අඛණ්ඩ විශ්වාසය.",

    // Why Choose Us
    whyUsBadge: "Star Plus සුවිශේෂත්වය",
    whyUsTitle: "සංචාරකයින් අපව තෝරාගන්නේ ඇයි?",
    whyUsSubtitle: "දේශීය අත්දැකීම් සහ ජාත්‍යන්තර ආගන්තුක සත්කාරය එක් කරමින් ඔබගේ සෑම සංචාරයක්ම අමතක නොවන මතකයක් බවට පත් කරමු.",
    whyUs1Title: "හොඳම මිල සහ සුඛෝපභෝගී සහතිකය",
    whyUs1Desc: "ලොව ප්‍රමුඛ තරු 4 සහ 5 සුඛෝපභෝගී හෝටල්, ගුවන් සේවා සහ දේශීය සංචාරක නියෝජිතයින් සමඟ ඍජු ගිවිසුම් හරහා අඩුම මිල සහතික කෙරේ.",
    whyUs1Tag: "හොඳම මිල පොරොන්දුව",
    whyUs2Title: "ක්ෂණික එක්ස්ප්‍රස් වීසා සේවාව",
    whyUs2Desc: "ඩුබායි දින 30/60, ෂෙන්ගන්, එක්සත් රාජධානිය, ඇමරිකාව සහ ඕමාන් වීසා සඳහා රජයේ ලියාපදිංචි අපගේ විශේෂඥයින්ගේ ක්ෂණික සහාය.",
    whyUs2Tag: "99.2% වීසා සාර්ථකත්වය",
    whyUs3Title: "පොලී රහිත පහසු වාරික ගෙවීම්",
    whyUs3Desc: "Tabby සහ Tamara හරහා කිසිදු අමතර ගාස්තුවකින් තොරව මාස 4 කින් ඔබගේ සංචාරක ගාස්තු පහසුවෙන් ගෙවන්න.",
    whyUs3Tag: "Tabby 0% පොලී රහිත ගෙවීම්",
    whyUs4Title: "24/7 පාරිභෝගික සේවාව",
    whyUs4Desc: "ඉංග්‍රීසි, අරාබි, සිංහල සහ දෙමළ භාෂාවලින් පැය 24 පුරාම ඔබට වෙන්වූ පුද්ගලික සංචාරක උපදේශක සහාය.",
    whyUs4Tag: "ක්ෂණික WhatsApp සහාය",

    // Packages Section
    packagesBadge: "සුවිශේෂී නිවාඩු චාරිකා",
    packagesTitle: "විශේෂ සංචාරක පැකේජ",
    packagesCount: "උසස් තත්ත්වයේ තෝරාගත් සංචාරක සැලසුම්",
    catAll: "සියලු පැකේජ",
    catHoliday: "නිවාඩු පැකේජ",
    catCorporate: "ආයතනික සහ MICE",
    catVisaBundle: "වීසා පැකේජ",
    catDubai: '<i class="fa-solid fa-city mr-1.5 text-amber-400"></i>ඩුබායි සහ එමීර් රාජ්‍යය',
    catSriLanka: '<i class="fa-solid fa-gem mr-1.5 text-amber-400"></i>ශ්‍රී ලංකාව',
    catCaucasus: '<i class="fa-solid fa-mountain-sun mr-1.5 text-amber-400"></i>කොකේසස් සහ යුරෝපය',
    catTropical: '<i class="fa-solid fa-umbrella-beach mr-1.5 text-amber-400"></i>නිවර්තන දූපත්',
    catSpiritual: '<i class="fa-solid fa-mosque mr-1.5 text-amber-400"></i>උම්රා සහ වන්දනා',
    customTripBadge: "ඔබට අවශ්‍ය පරිදි සැලසුම් කරන්න",
    customTripTitle: "ඔබගේ සිහින ගමනාන්තය මෙහි නැද්ද?",
    customTripDesc: "පවුලේ චාරිකා, මධුසමය, තනි සංචාර හෝ ආයතනික චාරිකා සඳහා ඔබ කැමති පරිදි විශේෂ පැකේජ සකස් කරගත හැක.",
    customTripBtn: "අභිරුචි පැකේජයක් ඉල්ලන්න",

    // Visa Hub
    visaBadge: "ක්ෂණික වීසා සේවා",
    visaTitle: "ඩුබායි සහ ලොව පුරා සංචාර සඳහා පහසු වීසා",
    visaSubtitle: "තානාපති කාර්යාල පෝලිම් සහ ලිපි ලේඛන කරදරවලින් තොරව, ඩුබායි සංචාරක වීසා, ෆ්‍රීලාන්ස් වීසා හෝ යුරෝපීය ෂෙන්ගන් වීසා සඳහා අපගේ උපදේශකවරුන් උපරිම වේගයෙන් සහාය වේ.",
    visaFeature1: "ඩුබායි සංචාරක වීසා: දින 30 සහ 60 තනි/බහු ප්‍රවේශ වීසා පැය 24 න් නිකුත් කෙරේ.",
    visaFeature2: "ඕමාන් වීසා මාරුව: දෙයිරා සිට දිනපතා පිටත්වන සුඛෝපභෝගී වායුසමනය කළ බස් රථ සේවාව.",
    visaFeature3: "ෂෙන්ගන්, UK සහ USA: සම්පූර්ණ ලියකියවිලි සකස් කිරීම සහ සම්මුඛ පරීක්ෂණ දිනයන් වෙන්කිරීම.",
    visaCheckerTitle: "ක්ෂණික වීසා සුදුසුකම් සහ ගාස්තු ගණකය",
    visaCheckerSubtitle: "ගාස්තු සහ අවශ්‍යතා ක්ෂණිකව බලාගැනීමට ඔබගේ ගමනාන්තය තෝරන්න:",
    visaCategoryLabel: "වීසා කාණ්ඩය තෝරන්න",

    // Season Promo
    promoBadge: "සුවිශේෂී සීමිත දීමනාව",
    promoTitle: "ශීත ඍතු සහ නිවාඩු පැකේජ සඳහා 35% දක්වා විශේෂ වට්ටම්!",
    promoDesc: "මෙම මස අවසන් වීමට පෙර ඔබගේ සංචාරක සැලසුම සඳහා STARPLUS ප්‍රවර්ධන කේතය භාවිතා කර වට්ටම් ලබාගන්න.",
    promoBtn: "වට්ටම ලබාගන්න",
    promoNote: "කොන්දේසි අදාළ වේ • Tabby 0% වාරික ගෙවීම් ලබාගත හැක",

    // Testimonials
    testimonialsBadge: "Google සත්‍යාපිත සමාලෝචන",
    testimonialsTitle: 'ගනුදෙනුකරුවන්ගෙන් <span class="text-amber-500 font-black">4.9 / 5.0</span> විශිෂ්ට ඇගයීමක්',
    testimonialsSubtitle: "Star Plus Travels සමඟ සංචාරය කළ අපගේ ගනුදෙනුකරුවන් Google හරහා ලබාදුන් සැබෑ අදහස් කියවන්න.",

    // FAQ
    faqBadge: "නිතර අසන ප්‍රශ්න",
    faqTitle: "නිතර අසන ප්‍රශ්න සහ පිළිතුරු",
    faq1Q: "පැකේජයේ දෛනික සැලැස්ම හෝ හෝටල් මට්ටම මට අවශ්‍ය පරිදි වෙනස් කළ හැකිද?",
    faq1A: "ඔව්, නියත වශයෙන්ම! ඔබගේ සංචාරක දිනයන්, අයවැය හෝ කැමති හෝටල් මට්ටම (තරු 4 හෝ 5) අනුව ඕනෑම පැකේජයක් වෙනස් කළ හැක. අපගේ උපදේශකවරුන් හා සම්බන්ධ වන්න.",
    faq2Q: "\"Fly Now, Pay Later\" (Tabby / Tamara) වාරික ක්‍රමය ක්‍රියාත්මක වන්නේ කෙසේද?",
    faq2A: "එක්සත් අරාබි එමීර් රාජ්‍යයේ වලංගු එමිරේට්ස් හැඳුනුම්පතක් (EID) ඇති පදිංචිකරුවන්ට කිසිදු පොලියක් හෝ සැඟවුණු ගාස්තුවක් නොමැතිව මාස 4 ක සමාන වාරික වලින් ගෙවිය හැක.",
    faq3Q: "ඩුබායි සංචාරක වීසා බලපත්‍රයක් ලබා ගැනීමට කොපමණ කාලයක් ගතවේද?",
    faq3A: "දින 30 සහ 60 සාමාන්‍ය ඩුබායි සංචාරක වීසා පැය 24 සිට 48 දක්වා කාලයක් තුළ අනුමත වේ. හදිසි අවශ්‍යතා සඳහා පැය 12 ක කඩිනම් සේවාවද ඇත.",
    faq4Q: "ඕමාන් සුඛෝපභෝගී බස් රථ වීසා මාරු පැකේජයට ඇතුළත් වන්නේ මොනවාද?",
    faq4A: "දෙයිරා ඩුබායි සිට පිටත්වන සුඛෝපභෝගී වායුසමනය කළ බස් රථ ප්‍රවාහනය, ඕමාන් දේශසීමා නිෂ්කාශනය, ඕමාන් සංක්‍රමණ වීසා සහ ඔබගේ නව ඩුබායි සංචාරක වීසාව ඊට ඇතුළත් වේ.",

    // Contact
    contactBadge: "අප හා සම්බන්ධ වන්න",
    contactTitle: "ඔබගේ ඊළඟ සංචාරය අදම සැලසුම් කරමු",
    contactSubtitle: "අභිරුචි සංචාරක සැලසුම්, ගුවන් ටිකට්පත් හෝ ක්ෂණික වීසා සේවා සඳහා ඩුබායි හෝ කොළඹ කාර්යාල හා සම්බන්ධ වන්න.",
    contactUaeOffice: "ඩුබායි ප්‍රධාන කාර්යාලය (UAE)",
    contactUaeAddress: "කාර්යාල අංක 204, අල් රිග්ගා බිස්නස් සෙන්ටර්, දෙයිරා, ඩුබායි",
    contactSlOffice: "කොළඹ ප්‍රාදේශීය ශාඛාව (ශ්‍රී ලංකාව)",
    contactSlAddress: "ගාලු පාර, කොළඹ 03",
    whatsappBtnText: "ඍජුවම WhatsApp හරහා සම්බන්ධ වන්න",
    socialTitle: "නිල සමාජ මාධ්‍ය ඔස්සේ සම්බන්ධ වන්න",
    careersSpotlightTitle: "සංචාරක ක්ෂේත්‍රයේ රැකියාවක් සොයනවාද?",
    careersSpotlightDesc: "ඩුබායි සහ ශ්‍රී ලංකාව සඳහා විවෘත පුරප්පාඩු 6 ක් ඇත.",
    careersSpotlightBtn: "රැකියා බලන්න",
    formTitle: "නොමිලේ සංචාරක සැලසුමක් සහ මිල ගණන් ලබාගන්න",
    formSubtitle: "පැය 2 ක් ඇතුළත සියලු විස්තර සහ පැහැදිලි මිල ගණන් සමඟ අප ඔබව අමතන්නෙමු.",
    formFullName: "සම්පූර්ණ නම *",
    formEmail: "විද්‍යුත් තැපෑල *",
    formPhone: "දුරකථන / WhatsApp අංකය *",
    formInterest: "ප්‍රධාන අවශ්‍යතාවය",
    formInterestPackage: "සංචාරක පැකේජ",
    formInterestVisa: "ක්ෂණික වීසා සේවා",
    formInterestFlight: "අඩුම ගුවන් ටිකට්පත්",
    formInterestCustom: "අභිරුචි සංචාරක සැලසුම්",
    formDestination: "කැමති ගමනාන්තය",
    formTravelers: "සංචාරක පිරිස",
    formNotes: "විශේෂ අවශ්‍යතා / සටහන්",
    formNotesPlaceholder: "ඔබගේ සංචාරක දිනයන්, හෝටල් මට්ටම හෝ වෙනත් විශේෂ ඉල්ලීම් සඳහන් කරන්න...",
    formSubmitBtn: "සංචාරක ඉල්ලීම යොමු කරන්න",
    formPaymentNoticeTitle: "නිල ගෙවීම් ආරක්ෂණ දැනුම්දීම:",
    formPaymentNoticeText: "සියලුම ගෙවීම් අපගේ නිල සමාගම් බැංකු ගිණුමට පමණක් සිදු කළ යුතුය. කිසිදු පුද්ගලික ගිණුමකට මුදල් බැර කරන ලෙස අප කිසිවිටෙකත් ඉල්ලා නොසිටිමු.",

    // Footer
    footerAbout: "Star Plus Travel & Tourism LLC යනු ඩුබායි දෙයිරා හි ප්‍රධාන කාර්යාලය සහ ශ්‍රී ලංකාවේ ශාඛා සහිත රජයේ අනුමත සංචාරක කළමනාකරණ සමාගමකි. උසස් තත්ත්වයේ නිවාඩු පැකේජ, ගුවන් ටිකට්පත් සහ ක්ෂණික වීසා සේවා සපයනු ලැබේ.",
    footerDesc: "Star Plus Travel & Tourism LLC යනු එක්සත් අරාබි එමීර් රාජ්‍යයේ සහ ශ්‍රී ලංකාවේ බලපත්‍රලාභී ප්‍රමුඛතම සංචාරක ආයතනයක් වන අතර, සුඛෝපභෝගී නිවාඩු චාරිකා, ආයතනික ගුවන් ටිකට්පත් සහ ක්ෂණික එක්ස්ප්‍රස් වීසා සේවා සපයයි.",
    footerUaeInq: '<i class="fa-solid fa-building mr-1 text-amber-400"></i>ඩුබායි විමසීම්:',
    footerSlInq: '<i class="fa-solid fa-landmark mr-1 text-amber-400"></i>ශ්‍රී ලංකා විමසීම්:',
    footerQuickLinks: "ක්ෂණික පිවිසුම්",
    footerTopPackages: "ප්‍රධාන පැකේජ",
    footerDestinations: "ප්‍රධාන මධ්‍යස්ථාන",
    footerLegal: "නීතිමය සහතික",
    footerCopyright: "© 2026 Star Plus Travel & Tourism LLC. සියලු හිමිකම් ඇවිරිණි.",
    footerAttribution: "නිර්මාණය Lupo විසිනි",
    footerCopyrightBar: "© 2026 Star Plus Travel & Tourism LLC. සියලු හිමිකම් ඇවිරිණි. • නිර්මාණය Lupo විසිනි",

    // Careers Page
    topBarHiring: "අප බඳවා ගනු ලැබේ! ඩුබායි සහ ශ්‍රී ලංකාවේ අපගේ කණ්ඩායම් වලට එක්වන්න",
    careersBadge: "Star Plus Travel &amp; Tourism LLC රැකියා අවස්ථා",
    careersHeroTitle: "සංචාරක සිහින ජීවිත කාලීන වෘත්තියක් බවට පත් කරගන්න",
    careersHeroSubtitle: "ජාත්‍යන්තර සංචාර, සුඛෝපභෝගී නිවාඩු සහ ක්ෂණික වීසා සේවා ක්ෂේත්‍රයේ නවමු අත්දැකීමක් ගොඩනැගීමට ඩුබායි සහ කොළඹ අපගේ කණ්ඩායම් හා එක්වන්න.",
    uaeBranchAppTitle: "එක්සත් අරාබි එමීර් රාජ්‍යයේ රැකියා අයදුම්පත්",
    uaeBranchAppSubtitle: "ප්‍රධාන කාර්යාලය &bull; දෙයිරා, ඩුබායි",
    uaeBranchAppDesc: "ඩුබායි රැකියා බලපත්‍ර සහ පුරප්පාඩු සඳහා ඍජු මානව සම්පත් සම්බන්ධතාවය.",
    slBranchAppTitle: "ශ්‍රී ලංකා ශාඛාවේ රැකියා අයදුම්පත්",
    slBranchAppSubtitle: "ප්‍රාදේශීය ශාඛාව &bull; කොළඹ",
    slBranchAppDesc: "ශ්‍රී ලංකා මෙහෙයුම් සහ නිර්මාණාත්මක පුරප්පාඩු සඳහා ඍජු මානව සම්පත් සම්බන්ධතාවය.",
    whyCareersBadge: "ඇයි Star Plus?",
    whyCareersTitle: "ගෝලීය සංචාරක අත්දැකීම් කෙරෙහි ඔබේ උනන්දුව බලගන්වන්න",
    perk1Title: "සංචාරක වරප්‍රසාද සහ FAM චාරිකා",
    perk1Desc: "සේවක ගුවන් ගමන් වට්ටම්, අඩු මිල නිවාඩු පැකේජ සහ අනුග්‍රාහක ගමනාන්ත අධ්‍යයන චාරිකා.",
    perk2Title: "ආකර්ෂණීය වැටුප් හා දීමනා",
    perk2Desc: "ආකර්ෂණීය වැටුප්, කාර්ය සාධන මත පදනම් වූ කොමිස් මුදල් සහ සෞඛ්‍ය ආවරණය.",
    perk3Title: "ද්විත්ව කලාපීය සම්බන්ධතාවය",
    perk3Desc: "ඩුබායි සහ කොළඹ අපගේ කාර්යාල අතර අන්තර් කලාපීය සහයෝගීතාවය සහ වෘත්තීය වර්ධනය.",
    perk4Title: "GDS සහ සංචාරක පුහුණුව",
    perk4Desc: "Amadeus, Sabre, වීසා නීති, පාරිභෝගික කළමනාකරණය සහ ඩිජිටල් අලෙවිකරණය පිළිබඳ අඛණ්ඩ පුහුණුව.",
    vacanciesBadge: "විවෘත පුරප්පාඩු",
    vacanciesTitle: "වත්මන් රැකියා අවස්ථා",
    vacanciesSubtitle: "අවශ්‍යතා පරීක්ෂා කර ඔබගේ ජීව දත්ත පත්‍රය අදාළ කලාපීය මානව සම්පත් අංශ වෙත යොමු කරන්න.",
    filterAllRoles: "සියලු අවස්ථා (6)",
    filterUaeRoles: '<i class="fa-solid fa-building mr-1 text-amber-400"></i>ඩුබායි, UAE (3)',
    filterSlRoles: '<i class="fa-solid fa-landmark mr-1 text-amber-400"></i>ශ්‍රී ලංකාව (3)',
    spontaneousBadge: "ඔබට ගැලපෙන තනතුරක් මෙහි නැද්ද?",
    spontaneousTitle: "ස්වයං අයදුම්පතක් යොමු කරන්න",
    spontaneousDesc: "දක්ෂ සංචාරක සැලසුම්කරුවන්, ආයතනික අලෙවි නියෝජිතයින් සහ වීසා විශේෂඥයින් අප නිරතුරුව සොයන්නෙමු. ඔබගේ CV පත්‍රය ඕනෑම වේලාවක අප වෙත එවන්න:",
    spontaneousUaeBtn: '<i class="fa-solid fa-envelope mr-1.5"></i>ඩුබායි HR වෙත Email කරන්න (info@starplustraveluae.com)',
    spontaneousSlBtn: '<i class="fa-solid fa-envelope mr-1.5 text-amber-500"></i>ශ්‍රී ලංකා HR වෙත Email කරන්න (info@starplustravelsl.com)',
    footerBranches: "අපගේ ශාඛා",
    recruitmentDesks: "බඳවා ගැනීමේ අංශ",
    recruitmentDesksSubtitle: "කලාපීය මානව සම්පත් කණ්ඩායම් වෙත සෘජුවම ජීව දත්ත පත්‍ර යොමු කරන්න:",
    explorePositions: "විවෘත පුරප්පාඩු 6 බලන්න",
    viewRolesBtn: "පුරප්පාඩු බලන්න",
    // Terms & Conditions Page (Sinhala)
    termsBadge: "නීතිමය ප්‍රකාශන සහ ප්‍රතිපත්ති",
    termsPageTitle: "නියම සහ කොන්දේසි",
    termsPageSubtitle: "විනිවිදභාවයෙන් යුතු වෙන්කිරීමේ ප්‍රතිපත්ති, ආගමන විගමන නීතිමය ප්‍රකාශන, වාරික ගෙවීම් නියම සහ පාරිභෝගික අයිතිවාසිකම්.",
    termsArt1Title: "සමාගම් බලපත්‍ර සහ සේවා විෂය පථය",
    termsArt1Desc: "Star Plus Travel & Tourism LLC යනු එක්සත් අරාබි එමීර් රාජ්‍යයේ ඩුබායි ආර්ථික හා සංචාරක දෙපාර්තමේන්තුව (DET) මඟින් බලපත්‍රලත් නීත්‍යානුකූල සමාගමක් වන අතර, ශ්‍රී ලංකා සංචාරක සංවර්ධන අධිකාරිය (SLTDA) යටතේ ලියාපදිංචි Star Plus Travel (PVT) LTD සමඟ අනුබද්ධිත වේ. Star Plus Travels හරහා නිවාඩු පැකේජ, ජාත්‍යන්තර ගුවන් ටිකට්පත්, වීසා සේවා හෝ ප්‍රවාහන සේවා වෙන්කරවා ගැනීමෙන්, සේවාදායකයා මෙහි සඳහන් නියමයන්ට එකඟතාව පළ කරනු ලබයි.",
    termsArt2Title: "සංචාරක පැකේජ මිල ගණන් සහ තහවුරු කිරීම්",
    termsArt2Desc: "සම්පූර්ණ ගෙවීම හෝ එකඟ වූ මූලික තැන්පතුව ගෙවන තුරු ප්‍රකාශිත හෝ ලබාදුන් සියලුම මිල ගණන් හෝටල් කාමර සහ ගුවන් ගාස්තු වෙනස්වීම් මත රඳා පවතී. නිල වෙන්කිරීම් තහවුරු කිරීමේ වවුචරයක් නිකුත් කළ පසු, හදිසි රජයේ බදු නියෝගයකින් හැර කිසිදු අමතර ඉන්ධන අධිභාරයක් හෝ අනපේක්ෂිත බද්දක් එකතු නොකරන බවට Star Plus Travels සහතික කරයි.",
    termsArt3Title: "පහසු වාරික ගෙවීම් (Tabby සහ Tamara)",
    termsArt3Desc: "Tabby හෝ Tamara වැනි පහසු වාරික ගෙවීම් ක්‍රම භාවිතා කරන පාරිභෝගිකයින් අදාළ ගෙවීම් සේවා සපයන්නා සමඟ ස්වාධීන මූල්‍ය ගිවිසුමකට එළඹේ. වාරික ගෙවීමේ සුදුසුකම් අනුමැතිය එක්සත් අරාබි එමීර් රාජ්‍යයේ හැඳුනුම්පත් (Emirates ID) සත්‍යාපනය සහ ණය ශ්‍රේණිගත කිරීම මත Tabby හෝ Tamara මඟින් තීරණය කරනු ලැබේ. Star Plus Travels වාරික ගෙවීම් සඳහා කිසිදු පොලියක් හෝ මූල්‍ය ගාස්තුවක් අය නොකරයි. ප්‍රමාද ගාස්තු අදාළ සේවා සපයන්නාගේ පාරිභෝගික නියමයන්ට යටත් වේ.",
    termsArt4Title: "නිල සමාගම් බැංකු ගිණුම් සහ ආරක්ෂිත ගෙවීම් ප්‍රතිපත්තිය",
    termsArt4Desc: "සියලුම ගෙවීම් අපගේ නිල සමාගම් බැංකු ගිණුමට පමණක් සිදු කළ යුතුය. පුද්ගලික ගිණුම්වලට මුදල් තැන්පත් කරන ලෙස අප කිසි විටෙකත් ඉල්ලා නොසිටිමු.",
    termsArt4ClauseTitle: "නිල ගෙවීම් ආරක්ෂණ වගන්තිය:",
    termsArt4ClauseDesc: "නිවාඩු තැන්පතු, ගුවන් ටිකට්පත් ගාස්තු, වීසා ගාස්තු සහ හෝටල් වෙන්කිරීම් ඇතුළු සියලුම මුදල් ගනුදෙනු <strong>Star Plus Travel & Tourism LLC</strong> (එක්සත් අරාබි එමීර් රාජ්‍යයේ) හෝ <strong>Star Plus Travel (PVT) LTD</strong> (ශ්‍රී ලංකාවේ) නිල සමාගම් බැංකු ගිණුම්වලට හෝ අපගේ බලයලත් ගෙවීම් පර්යන්ත/වාරික ගේට්වේ හරහා පමණක් සිදු කළ යුතුය. කිසිදු සේවකයෙකු හෝ නියෝජිතයෙකු පුද්ගලික ගිණුම්වලට මුදල් තැන්පත් කිරීමට උපදෙස් නොදෙනු ඇත.",
    termsArt5Title: "වීසා අයදුම්පත් සහ ආගමන විගමන වගකීම් ප්‍රකාශය",
    termsArt5Desc: "Star Plus Travels වීසා අයදුම්පත් සමාලෝචනය, ලියකියවිලි පරීක්ෂාව සහ නිල පද්ධති වෙත යොමු කිරීමේ සේවාව සපයයි. <strong>වැදගත් නිවේදනය:</strong> සංචාරක, සංක්‍රමණ හෝ ප්‍රවේශ වීසා අනුමත කිරීම, ප්‍රමාද කිරීම හෝ ප්‍රතික්ෂේප කිරීමේ පූර්ණ බලය එක්සත් අරාබි එමීර් රාජ්‍යයේ ආගමන විගමන අධිකාරීන් (GDRFA, ICP) සහ අදාළ විදේශ තානාපති කාර්යාල සතු වේ.",
    termsArt5FeesTitle: "ආපසු නොගෙවන රජයේ ගාස්තු:",
    termsArt5FeesDesc: "වීසා අයදුම්පතක් නිල ආගමන විගමන පද්ධතියට ඇතුළත් කළ පසු, වීසා අනුමත වීම, ප්‍රමාද වීම හෝ ප්‍රතික්ෂේප වීම නොසලකා රජයේ ගාස්තු, කොන්සියුලර් මුද්දර ගාස්තු සහ පරිපාලන ගාස්තු කිසිදු හේතුවක් මත ආපසු ගෙවනු නොලැබේ.",
    termsArt6Title: "අවලංගු කිරීම්, සංශෝධන සහ මුදල් ආපසු ගෙවීම්",
    termsArt6Desc: 'අවලංගු කිරීමේ ඉල්ලීම් අපගේ නිල විද්‍යුත් ලිපිනයට (<a href="mailto:info@starplustraveluae.com" class="text-amber-400 underline">info@starplustraveluae.com</a>) ලිඛිතව යොමු කළ යුතුය. මුදල් ආපසු ගෙවීම පහත කාලසටහන අනුව තීරණය වේ:',
    termsArt6Tier1: "<strong>සංචාරයට දින 30 කට පෙර:</strong> ගොඩබිම් පැකේජ පිරිවැයෙන් 90% ක් ආපසු ගෙවේ (ගුවන් ටිකට්පත් ගුවන් සේවා නීතිවලට යටත් වේ).",
    termsArt6Tier2: "<strong>සංචාරයට දින 15 සිට 29 දක්වා පෙර:</strong> ගොඩබිම් පැකේජ පිරිවැයෙන් 70% ක් ආපසු ගෙවේ.",
    termsArt6Tier3: "<strong>සංචාරයට දින 7 සිට 14 දක්වා පෙර:</strong> ගොඩබිම් පැකේජ පිරිවැයෙන් 50% ක් ආපසු ගෙවේ.",
    termsArt6Tier4: "<strong>දින 7 කට අඩු කාලයකදී හෝ නොපැමිණීම:</strong> හෝටල් සහ ප්‍රවාහන වෙන්කිරීම් හේතුවෙන් මුදල් ආපසු නොගෙවේ.",
    termsArt7Title: "විදේශ ගමන් බලපත්‍ර වලංගුභාවය, සෞඛ්‍යය සහ සංචාරක රක්ෂණය",
    termsArt7Desc: "සංචාරය අවසන් වී ආපසු පැමිණෙන දින සිට අවම වශයෙන් මාස හයක (6) වලංගු කාලයක් විදේශ ගමන් බලපත්‍රයට තිබීම සංචාරකයාගේ පූර්ණ වගකීමකි. සියලුම සංචාරකයින් සඳහා පූර්ණ ජාත්‍යන්තර සංචාරක වෛද්‍ය සහ ගමන් මලු රක්ෂණයක් ලබාගැනීමට Star Plus Travels තරයේ නිර්දේශ කරයි. ෂෙන්ගන් වීසා සහ තෝරාගත් ගමනාන්ත සඳහා අවම යුරෝ 30,000 ක වෛද්‍ය ආවරණයක් සහිත රක්ෂණයක් අනිවාර්ය වේ.",
    termsArt8Title: "පාලන නීතිය සහ නෛතික අධිකරණ බලය",
    termsArt8Desc: "මෙම නියම සහ කොන්දේසි එක්සත් අරාබි එමීර් රාජ්‍යයේ සහ ඩුබායි එමීර් රාජ්‍යයේ ෆෙඩරල් නීතිවලට යටත් වන අතර (ඩුබායි හරහා වෙන්කරන ලද ගිවිසුම් සඳහා), කොළඹ ශාඛාව හරහා සිදුකරන ගිවිසුම් සඳහා ශ්‍රී ලංකා ප්‍රජාතාන්ත්‍රික සමාජවාදී ජනරජයේ නීතිවලට යටත් වේ. ඕනෑම නීතිමය ආරවුලකදී ඩුබායි හෝ කොළඹ අධිකරණයට සුවිශේෂී බලය හිමිවේ.",
    termsInquiriesContact: 'අපගේ නියමයන්, අවලංගු කිරීමේ දැන්වීම් හෝ ආයතනික ගිවිසුම් පිළිබඳ විමසීම් සඳහා කරුණාකර අපගේ නීති අංශය අමතන්න: <a href="mailto:info@starplustraveluae.com" class="text-amber-400 hover:underline font-semibold">info@starplustraveluae.com</a> හෝ අමතන්න <a href="tel:+971527582293" class="text-slate-200 hover:text-amber-400 font-semibold">+971 52 758 2293</a> / <a href="tel:+97145751321" class="text-slate-200 hover:text-amber-400 font-semibold">+971 4 575 1321</a>.',
    termsFooterVipDeals: "VIP සංචාරක දීමනා",
    termsFooterVipDesc: "රහසිගත විශේෂ ගුවන් ගාස්තු සහ ක්ෂණික වට්ටම් දැනගැනීමට ලියාපදිංචි වන්න.",
    termsFooterSubscribe: "ලියාපදිංචි වන්න",
    termsFooterEmailPlaceholder: "ඔබගේ විද්‍යුත් ලිපිනය ඇතුළත් කරන්න",
    termsFooterAcceptedPayment: "ගෙවීම් ක්‍රම:",

    // Reviews Page & Showcase (Sinhala)
    reviewsHeroBadge: "පාරිභෝගික ඇගයීම් සහ විශ්වාසය",
    reviewsHeroTitle: "තහවුරු කළ සංචාරක හා පාරිභෝගික අත්දැකීම්",
    reviewsHeroSubtitle: "සුඛෝපභෝගී නිවාඩු, ආයතනික නියෝජිත චාරිකා සහ කඩිනම් වීසා සේවා සඳහා ජාත්‍යන්තර සංචාරකයින් සහ ආයතන Star Plus Travel තෝරාගන්නේ ඇයිදැයි දැනගන්න.",
    reviewsAggregateScore: "★ Google Business Profile ඇගයීම් මත පදනම් වූ 4.9 ශ්‍රේණිගත කිරීමක්",
    reviewsAggregateSubtitle: "ඩුබායි සහ කොළඹ ජාත්‍යන්තර සංචාරකයින් සහ ආයතනික සේවාදායකයින්ගේ තහවුරු කළ ඇගයීම්",
    badgeDtcmLicensed: '<i class="fa-solid fa-shield-halved text-[#F59E0B]"></i> DTCM බලපත්‍රලාභී සංචාරක ආයතනය',
    badgeGoogleVerified: '<i class="fa-brands fa-google text-[#4285F4]"></i> Google සත්‍යාපිත සමාලෝචන',
    badgeVisaGuaranteed: '<i class="fa-solid fa-circle-check text-[#10B981]"></i> 100% විශ්වාසනීය වීසා අනුමැතිය',
    btnReadGoogleReviews: "සියලුම Google ඇගයීම් බලන්න",
    btnLeaveGoogleReview: "ඔබේ අදහස පළ කරන්න",
    btnLeaveReview: "ඔබේ අදහස පළ කරන්න",
    btnReadAllReviews: "සියලුම පාරිභෝගික ඇගයීම් බලන්න",
    filterAllReviews: "සියලුම ඇගයීම්",
    filterHolidayPackages: "නිවාඩු පැකේජ",
    filterUaeVisas: "එක්සත් අරාබි එමීර් වීසා",
    filterCorporateMice: "ආයතනික සහ MICE",
    filterFlightsHotels: "ගුවන් සහ හෝටල්",
    badgeGoogleVerifiedReview: "Google මගින් තහවුරු කළ ඇගයීමක්",
    badgeVerifiedTraveler: "තහවුරු කළ සංචාරකයා",
    badgeVerifiedClient: "තහවුරු කළ සංචාරකයා",
    bookedServicePrefix: "වෙන්කළ සේවාව:",
    reviewsCtaTitle: "ඔබගේ මීළඟ සංචාරය සැලසුම් කිරීමට සූදානම්ද?",
    reviewsCtaDesc: "පැය 24 ක ක්ෂණික වීසා, සුඛෝපභෝගී නිවාඩු පැකේජ හෝ VIP ආයතනික සංචාරක කළමනාකරණය සඳහා ඩුබායි සහ කොළඹ අපගේ බලපත්‍රලාභී උපදේශකයින් සූදානම්.",
    reviewsCtaSpecialistBtn: '<i class="fa-brands fa-whatsapp text-lg"></i><span>විශේෂඥයෙකු සමඟ කතාබස් කරන්න</span>',
    reviewsCtaPlanBtn: '<i class="fa-solid fa-compass text-sm"></i><span>අභිරුචි සංචාරයක් සැලසුම් කරන්න</span>',
    reviewsCtaRecentlyBooked: "මෑතකදී Star Plus Travels සමඟ සංචාරය කළාද?",
    reviewsCtaLeaveReview: '<span>ඔබේ අදහස පළ කරන්න</span><i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>',

    // Form Standard Placeholders & Buttons (Sinhala)
    placeholderEnterEmail: "ඔබගේ විද්යුත් තැපෑල ඇතුළත් කරන්න",
    placeholderFullName: "ඔබගේ සම්පූර්ණ නම",
    placeholderPhone: "දුරකථන / WhatsApp අංකය",
    placeholderTripNotes: "සංචාරක සටහන් / විශේෂ ඉල්ලීම්",
    btnConfirmAppRequest: "අයදුම්පත තහවුරු කරන්න",
    btnConfirmBookingRequest: "වෙන්කිරීම තහවුරු කරන්න",
    btnSubscribe: "ලියාපදිංචි වන්න",
    btnInquireWhatsApp: "WhatsApp මගින් විමසන්න",

    // Dynamic strings
    startingFrom: "ආරම්භක මිල",
    perPerson: "පුද්ගලයෙකුට",
    installmentText: "හෝ Tabby මගින් මසකට 4x {amount}",
    itineraryBtn: "විස්තර",
    bookNowBtn: "වෙන්කරන්න"
  }
};

// Seamless merge with external modular translations dictionary (js/translations.js)
if (typeof translations !== 'undefined' && translations) {
  if (translations.en && I18N_TRANSLATIONS.en) Object.assign(I18N_TRANSLATIONS.en, translations.en);
  if (translations.si && I18N_TRANSLATIONS.si) Object.assign(I18N_TRANSLATIONS.si, translations.si);
}

const PACKAGES_I18N = {
  'dubai-luxury': {
    title: 'ඩුබායි සහ කාන්තාර සෆාරි සුඛෝපභෝගී චාරිකාව',
    destination: 'ඩුබායි, එක්සත් අරාබි එමීර් රාජ්‍යය',
    duration: 'දින 5 / රාත්‍රී 4',
    badge: 'වැඩිම ඉල්ලුමක් ඇති'
  },
  'sri-lanka-wildlife': {
    title: 'සුන්දර ශ්‍රී ලංකාව: තේ වතු, වනජීවී සෆාරි සහ වෙරළ',
    destination: 'කොළඹ, මහනුවර සහ බෙන්තොට',
    duration: 'දින 6 / රාත්‍රී 5',
    badge: 'ජනප්‍රියම'
  },
  'baku-azerbaijan': {
    title: 'බාකු සහ අසර්බයිජානයේ කොකේසස් ආශ්චර්යය',
    destination: 'බාකු සහ ගබාලා, අසර්බයිජානය',
    duration: 'දින 5 / රාත්‍රී 4',
    badge: 'ප්‍රමුඛ'
  },
  'georgia-kazbegi': {
    title: 'සුන්දර ජෝර්ජියාව: ටිබිලිසි, කස්බෙගි සහ ගුඩවුරි',
    destination: 'ටිබිලිසි සහ කොකේසස්, ජෝර්ජියාව',
    duration: 'දින 6 / රාත්‍රී 5',
    badge: 'ශීත ඍතු විශේෂ'
  },
  'maldives-all-inclusive': {
    title: 'මාලදිවයින දියමත විලා සුඛෝපභෝගී නිවාඩුව',
    destination: 'උතුරු මාලේ අතොළුව, මාලදිවයින',
    duration: 'දින 4 / රාත්‍රී 3',
    badge: 'රොමෑන්ටික් නිවාඩුවක්'
  },
  'bali-luxury-nature': {
    title: 'ස්වර්ගීය බාලි චාරිකාව: උබුඩ් සහ සෙමින්‍යක්',
    destination: 'බාලි, ඉන්දුනීසියාව',
    duration: 'දින 7 / රාත්‍රී 6',
    badge: 'වැඩිම ඉල්ලුමක් ඇති'
  },
  'turkey-istanbul-cappadocia': {
    title: 'සුන්දර තුර්කිය: ඉස්තාන්බුල් සහ කැපඩෝසියා බැලූන් චාරිකාව',
    destination: 'ඉස්තාන්බුල් සහ කැපඩෝසියා, තුර්කිය',
    duration: 'දින 6 / රාත්‍රී 5',
    badge: 'විශේෂ චාරිකාව'
  },
  'umrah-spiritual-package': {
    title: 'ප්‍රිමියම් උම්රා වන්දනා ගමන',
    destination: 'මක්කම සහ මදීනා, සෞදි අරාබිය',
    duration: 'දින 7 / රාත්‍රී 6',
    badge: 'සුවිශේෂී වන්දනාව'
  },
  'dubai-corporate-mice': {
    title: 'විධායක ඩුබායි MICE සහ ආයතනික සමුළු පැකේජය',
    destination: 'ඩුබායි සහ අබුඩාබි, එ.අ.එ.',
    duration: 'දින 4 / රාත්‍රී 3',
    badge: 'ආයතනික VIP'
  },
  'baku-corporate-retreat': {
    title: 'කොකේසස් විධායක නායකත්ව සහ කණ්ඩායම් සංචාරක පැකේජය',
    destination: 'බාකු සහ ෂාඩාග්, අසර්බයිජාන්',
    duration: 'දින 5 / රාත්‍රී 4',
    badge: 'විධායක සංචාරය'
  },
  'uae-golden-visa-bundle': {
    title: 'එ.අ.එ. වසර 10 ක ගෝල්ඩන් වීසා සහ පදිංචි වීමේ සේවා පැකේජය',
    destination: 'ඩුබායි, එක්සත් අරාබි එමීර් රාජ්‍යය',
    duration: 'දින 5-7 සීඝ්‍රගාමී',
    badge: 'ගෝල්ඩන් වීසා'
  },
  'schengen-visa-travel-bundle': {
    title: 'යුරෝපා ෂෙන්ගන් එක්ස්ප්‍රස් වීසා සහ ගුවන් ටිකට්පත් පැකේජය',
    destination: 'ප්‍රංශය, ස්විට්සර්ලන්තය සහ ඉතාලිය',
    duration: 'දින 10-15 සේවා කාලය',
    badge: 'සහතික කළ අවස්ථාව'
  }
};

// Comprehensive Tour Packages Data
const PACKAGES = [
  {
    id: 'dubai-luxury',
    title: 'Ultimate Dubai & Desert Safari Extravaganza',
    category: 'dubai',
    categoryTag: 'CITY BREAK & LUXURY',
    destination: 'Dubai & Abu Dhabi, UAE',
    tagline: 'GLAMOUR, ICONIC LANDMARKS & LUXURY DESERT',
    editorialSummary: 'Experience the pinnacle of Arabian glamour with luxury 5-star hotel stays, VIP red dune desert safaris with dune bashing and BBQ dinners, private marina yacht cruises, and priority Burj Khalifa observation deck entry.',
    highlightTags: ['🏜️ Desert Safari & BBQ', '🏙️ Burj Khalifa At The Top', '⛵ Marina Luxury Yacht'],
    flag: '<i class="fa-solid fa-city text-amber-400"></i>',
    duration: '5 Days / 4 Nights',
    rating: 4.9,
    reviews: 184,
    badge: 'Bestseller',
    badgeColor: 'from-amber-500 to-yellow-500',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Illuminated Dubai city skyline and Burj Khalifa at twilight',
    galleryImages: [
      { image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', title: 'Burj Khalifa & Downtown Dubai Skyline' },
      { image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=1200&q=80', title: 'Arabian Desert Safari Sunset Dunes' },
      { image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80', title: 'Dubai Marina & Luxury Yacht Harbor' },
      { image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80', title: 'Sheikh Zayed Grand Mosque, Abu Dhabi' }
    ],
    priceAED: 2450,
    originalPriceAED: 3100,
    priceLKR: 'LKR 215,000',
    perks: ['5★ Luxury Hotel Stay', 'VIP Desert Safari & BBQ', 'Burj Khalifa Top Deck', 'Luxury Marina Yacht Cruise', 'Private Airport Transfers'],
    itinerary: [
      { day: 1, title: 'Arrival & Marina Dhow Cruise Dinner', desc: 'VIP airport chauffeur greeting, 5-star marina dhow cruise with live entertainment.' },
      { day: 2, title: 'Modern Dubai City Tour & Burj Khalifa At The Top', desc: 'Ascend the 124th/125th floor of Burj Khalifa, explore Dubai Mall and fountain shows.' },
      { day: 3, title: 'VIP Desert Safari with Dune Bashing & BBQ Feast', desc: '4x4 red dune bashing in Lahbab, sandboarding, camel rides, and Arabic barbecue dinner under the stars.' },
      { day: 4, title: 'Miracle Garden & Museum of the Future Tour', desc: 'Admire millions of floral blooms and explore futuristic innovations.' },
      { day: 5, title: 'Luxury Shopping Leisure & Airport Departure', desc: 'Morning leisure in Gold & Spice souks, private chauffeur transfer to DXB Airport.' }
    ]
  },
  {
    id: 'sri-lanka-wildlife',
    title: 'Scenic Sri Lanka: Tea Hills, Wildlife & Beaches',
    category: 'srilanka',
    categoryTag: 'SAFARI & WILDLIFE',
    destination: 'Colombo, Kandy, Ella & Yala',
    tagline: 'TEA HILLS, WILD LEOPARDS & COASTAL ESCAPES',
    editorialSummary: 'Track wild leopards and elephant herds across Yala National Park, ride the world-famous scenic mountain railway through misty emerald tea plantations, and unwind on golden southern beaches.',
    highlightTags: ['🐆 Leopard Safari', '🚂 Scenic Train Journey', '🏖️ Coastal Escapes'],
    flag: '<i class="fa-solid fa-gem text-amber-400"></i>',
    duration: '6 Days / 5 Nights',
    rating: 5.0,
    reviews: 142,
    badge: 'Trending',
    badgeColor: 'from-emerald-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Sigiriya Rock Fortress and Emerald Landscapes, Sri Lanka',
    galleryImages: [
      { image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80', title: 'Sigiriya Lion Rock Fortress' },
      { image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', title: 'Ella Nine Arch Bridge & Tea Hills' },
      { image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80', title: 'Yala National Park Safari & Wild Elephants' },
      { image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', title: 'Galle Dutch Fort & Lighthouse' },
      { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', title: 'Mirissa Coastline / Whale Watching' }
    ],
    priceAED: 1890,
    originalPriceAED: 2400,
    perks: ['Scenic Train to Ella & Tea Estates', 'Sigiriya Rock Fortress Tour', 'Yala Safari Wildlife Encounter', 'Private English-Speaking Chauffeur', 'Daily Gourmet Breakfast'],
    itinerary: [
      { day: 1, title: 'Arrival in Colombo & Transfer to Kandy', desc: 'VIP meet and assist at CMB Airport, scenic highway drive to Kandy, evening lakeside stroll.' },
      { day: 2, title: 'Temple of the Tooth & Royal Botanical Gardens', desc: 'Visit the sacred relic temple and stroll 147-acre Peradeniya botanical grounds.' },
      { day: 3, title: 'Scenic Train Ride to Nuwara Eliya & Tea Estates', desc: 'Board the world-famous blue train through misty highlands and visit a tea factory.' },
      { day: 4, title: 'Ella Rock Trek & Yala National Park Safari', desc: 'Marvel at Nine Arch Bridge, descend to Yala for an open 4x4 sunset wildlife safari.' },
      { day: 5, title: 'Bentota Golden Beach Relaxation & Water Sports', desc: 'Relax at a 5-star beachfront resort, Madu River boat safari, and fresh seafood.' },
      { day: 6, title: 'Colombo City Tour & Airport Departure', desc: 'Explore historic Colombo Fort, Dutch Hospital precinct, and transfer for departure flight.' }
    ]
  },
  {
    id: 'baku-azerbaijan',
    title: 'Baku & Caucasus Wonders of Azerbaijan',
    category: 'caucasus',
    categoryTag: 'ALPINE & HERITAGE',
    destination: 'Baku & Gabala, Azerbaijan',
    tagline: 'LAND OF FIRE, CASPIAN BREEZES & FLAME TOWERS',
    editorialSummary: 'Discover the crossroads of Europe and Asia in Baku. Stroll the UNESCO Old City (Icherisheher), marvel at the architectural wonder of the Flame Towers, and take cable cars into the alpine grandeur of Gabala.',
    highlightTags: ['🔥 Flame Towers Baku', '🏔️ Gabala Cable Car', '🌋 Gobustan Mud Volcanoes'],
    flag: '<i class="fa-solid fa-mountain-sun text-amber-400"></i>',
    duration: '5 Days / 4 Nights',
    rating: 4.8,
    reviews: 96,
    badge: 'Popular',
    badgeColor: 'from-blue-600 to-cyan-500',
    image: 'assets/packages/baku-flame-towers.jpg',
    fallback: 'assets/packages/baku-flame-towers.jpg',
    alt: 'Baku Flame Towers and Caspian Sea Waterfront Skyline, Azerbaijan',
    galleryImages: [
      { image: 'assets/packages/baku-flame-towers.jpg', title: 'Baku Flame Towers & Caspian Waterfront' },
      { image: 'assets/packages/baku-flame-towers.jpg', title: 'Old City (Icherisheher) & Maiden Tower' },
      { image: 'https://images.unsplash.com/photo-1621539205985-64585141ef30?auto=format&fit=crop&w=1200&q=80', title: 'Gabala Mountains & Lake Nohur' },
      { image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80', title: 'Shahdag Winter Alpine Resort' }
    ],
    priceAED: 2150,
    originalPriceAED: 2750,
    priceLKR: 'LKR 190,000',
    perks: ['Return Flights Included', '4★ Central Baku Hotel', 'Gabala Cable Car & Lake Tour', 'Gobustan Rock Art & Mud Volcanoes', 'English Speaking Guide'],
    itinerary: [
      { day: 1, title: 'Arrival in Baku & Boulevard Evening Walk', desc: 'Meet and greet at GYD Airport, evening stroll along Baku Boulevard and Caspian waterfront.' },
      { day: 2, title: 'Old City (Icherisheher) & Flame Towers Tour', desc: 'Visit Maiden Tower, Palace of the Shirvanshahs, and illuminated Flame Towers.' },
      { day: 3, title: 'Full Day Gabala Mountains & Tufandag Resort', desc: 'Take scenic cable cars up Tufandag mountain, visit Nohur Lake and 7 Beauties waterfall.' },
      { day: 4, title: 'Gobustan Mud Volcanoes & Fire Temple (Ateshgah)', desc: 'Explore prehistoric petroglyphs, bubbling mud volcanoes, and eternal burning mountain Yanar Dag.' },
      { day: 5, title: 'Heydar Aliyev Center & Airport Transfer', desc: 'Photo stop at Zaha Hadid architectural icon and transfer to airport.' }
    ]
  },
  {
    id: 'georgia-kazbegi',
    title: 'Magical Georgia: Tbilisi, Kazbegi & Gudauri',
    category: 'caucasus',
    categoryTag: 'ALPINE & HERITAGE',
    destination: 'Tbilisi & Caucasus, Georgia',
    tagline: 'OLD TBILISI & CAUCASIAN SNOW CAPS',
    editorialSummary: 'Wander the cobblestone sulfur bath alleys of Old Tbilisi, drive the dramatic Georgian Military Highway past turquoise Jinvali Reservoir, and take a 4x4 up to the 14th-century Gergeti Trinity Church under Mount Kazbek.',
    highlightTags: ['⛪ Gergeti Trinity Church', '🏔️ Mount Kazbek 4x4', '🍷 Old Tbilisi Wine & Baths'],
    flag: '<i class="fa-solid fa-snowflake text-amber-400"></i>',
    duration: '6 Days / 5 Nights',
    rating: 4.9,
    reviews: 118,
    badge: 'Winter Special',
    badgeColor: 'from-indigo-500 to-purple-500',
    image: 'assets/packages/georgia-kazbegi.jpg',
    fallback: 'assets/packages/georgia-kazbegi.jpg',
    alt: 'Gergeti Trinity Church and Mount Kazbek Caucasus Mountains, Georgia',
    galleryImages: [
      { image: 'assets/packages/georgia-kazbegi.jpg', title: 'Gergeti Trinity Church & Mount Kazbek' },
      { image: 'assets/packages/georgia-kazbegi.jpg', title: 'Old Tbilisi Colorful Balconies & Narikala' },
      { image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80', title: 'Ananuri Fortress & Aragvi River' },
      { image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80', title: 'Gudauri Caucasus Ski Slopes' }
    ],
    priceAED: 2290,
    originalPriceAED: 2950,
    priceLKR: 'LKR 200,000',
    perks: ['Direct Flights Option', '4★ Boutique Hotel in Old Tbilisi', 'Kazbegi 4x4 Mountain Excursion', 'Traditional Georgian Feast & Wine', 'Roundtrip Transfers'],
    itinerary: [
      { day: 1, title: 'Welcome to Tbilisi & Narikala Fortress Cable Car', desc: 'Private airport greeting, ride the cable car over the old town, explore sulfur bath district.' },
      { day: 2, title: 'Mtskheta Ancient Capital & Jvari Monastery', desc: 'Visit UNESCO World Heritage sites at the confluence of Mtkvari and Aragvi rivers.' },
      { day: 3, title: 'Ananuri Fortress, Gudauri & Gergeti Trinity Church', desc: 'Drive the Military Highway, stop at Ananuri fortress, 4x4 trek to Gergeti church.' },
      { day: 4, title: 'Kakheti Wine Region & Bodbe Monastery', desc: 'Tour cradle of wine in Kakheti, taste Qvevri wines, visit Bodbe convent.' },
      { day: 5, title: 'Tbilisi Sulphur Baths & Shopping Leisure', desc: 'Relax in historic sulfur thermal baths and stroll Rustaveli Avenue.' },
      { day: 6, title: 'Departure Flight Transfer', desc: 'Leisurely breakfast and private chauffeur transfer to TBS Airport.' }
    ]
  },
  {
    id: 'maldives-all-inclusive',
    title: 'Maldives Overwater Villa Paradise Escape',
    category: 'tropical',
    categoryTag: 'TROPICAL ESCAPE',
    destination: 'North Malé Atoll, Maldives',
    tagline: 'TURQUOISE LAGOONS & OVERWATER LUXURY',
    editorialSummary: 'Escape to pristine coral atolls with overwater private pool villas, all-inclusive luxury dining and premium beverages, vibrant coral reef snorkeling, and romantic sunset dolphin cruises.',
    highlightTags: ['🏝️ Overwater Pool Villa', '🐬 Sunset Dolphin Cruise', '🍹 All-Inclusive Dine'],
    flag: '<i class="fa-solid fa-umbrella-beach text-amber-400"></i>',
    duration: '4 Days / 3 Nights',
    rating: 5.0,
    reviews: 210,
    badge: 'Luxury Romance',
    badgeColor: 'from-pink-500 to-rose-500',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    alt: 'Maldives Overwater Villas and Turquoise Lagoon',
    galleryImages: [
      { image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80', title: 'Luxury Overwater Bungalows & Turquoise Lagoon' },
      { image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80', title: 'Coral Reef Atoll & Aerial Ocean View' },
      { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', title: 'Mirissa Coastline / Whale Watching' }
    ],
    priceAED: 4650,
    originalPriceAED: 5900,
    priceLKR: 'LKR 410,000',
    perks: ['Overwater Pool Villa', 'All-Inclusive Dine & Drinks', 'Speedboat Airport Transfers', 'Sunset Dolphin Cruise', 'Complimentary Snorkeling Gear'],
    itinerary: [
      { day: 1, title: 'Speedboat Arrival & Overwater Villa Check-in', desc: 'Scenic speedboat arrival across crystalline waters, champagne check-in to overwater villa.' },
      { day: 2, title: 'Coral Reef Snorkeling & Sunset Dolphin Cruise', desc: 'Guided house reef snorkeling with sea turtles, late afternoon sunset dolphin cruise.' },
      { day: 3, title: 'Luxury Spa Treatment & Private Candlelight Beach Dinner', desc: 'Balinese massage at overwater spa, followed by 5-course beachfront dining under stars.' },
      { day: 4, title: 'Floating Lagoon Breakfast & Departure', desc: 'Enjoy floating breakfast in your private plunge pool before speedboat transfer to MLE Airport.' }
    ]
  },
  {
    id: 'bali-luxury-nature',
    title: 'Bali Heavenly Getaway: Ubud & Seminyak',
    category: 'tropical',
    categoryTag: 'TROPICAL ESCAPE',
    destination: 'Bali, Indonesia',
    tagline: 'EMERALD RICE TERRACES & PRIVATE POOL VILLAS',
    editorialSummary: 'Immerse in the spiritual serenity of Bali with private pool villas in Ubud, sunrise jeep treks across Mount Batur, island excursions to Nusa Penida Kelingking Beach, and sunset seafood at Jimbaran.',
    highlightTags: ['🌴 Ubud Private Pool Villa', '🌋 Mount Batur Sunrise', '🌊 Nusa Penida Island'],
    flag: '<i class="fa-solid fa-leaf text-amber-400"></i>',
    duration: '7 Days / 6 Nights',
    rating: 4.9,
    reviews: 165,
    badge: 'Bestseller',
    badgeColor: 'from-emerald-600 to-lime-600',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    alt: 'Bali Temple and Tropical Landscape',
    galleryImages: [
      { image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', title: 'Bali Temple & Jungle Flora' },
      { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', title: 'Kelingking Beach Nusa Penida' },
      { image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80', title: 'Jimbaran Bay Sunset' }
    ],
    priceAED: 2850,
    originalPriceAED: 3600,
    priceLKR: 'LKR 250,000',
    perks: ['Private Pool Villa in Ubud', 'Nusa Penida Island Tour', 'Floating Breakfast Experience', 'Mount Batur Sunrise Jeep Trek', 'Private Chauffeur Throughout'],
    itinerary: [
      { day: 1, title: 'Denpasar Arrival & Ubud Villa Check-in', desc: 'VIP meet at DPS Airport, transfer to luxury private pool villa nestled in Ubud jungle.' },
      { day: 2, title: 'Tegalalang Rice Terraces & Jungle Swing', desc: 'Explore lush tiered rice paddies, soar on iconic jungle swing, and taste Luwak coffee.' },
      { day: 3, title: 'Mount Batur Sunrise Adventure & Hot Springs', desc: 'Early morning 4x4 jeep safari up volcanic black lava fields, soak in natural hot springs.' },
      { day: 4, title: 'Nusa Penida Kelingking Beach Day Excursion', desc: 'Speedboat to Nusa Penida, witness T-Rex cliffs, Broken Beach, and Angel Billabong.' },
      { day: 5, title: 'Seminyak Beach Club & Sunset Seafood at Jimbaran', desc: 'Move to Seminyak beachfront, beach club afternoon, candlelight seafood feast on sand.' },
      { day: 6, title: 'Uluwatu Cliff Temple & Kecak Fire Dance', desc: 'Visit ancient clifftop temple 70m above crashing waves, witness hypnotic Kecak fire dance.' },
      { day: 7, title: 'Spa & Departure Airport Transfer', desc: 'Traditional Balinese reflexology spa session and private transfer to airport.' }
    ]
  },
  {
    id: 'turkey-istanbul-cappadocia',
    title: 'Classic Turkey: Istanbul & Cappadocia Balloons',
    category: 'caucasus',
    categoryTag: 'ALPINE & HERITAGE',
    destination: 'Istanbul & Cappadocia, Turkey',
    tagline: 'FAIRY CHIMNEYS & BOSPHORUS SUNSETS',
    editorialSummary: 'Experience the magic of Turkey with cave hotels in Cappadocia, sunrise hot air balloon flights over fairy chimneys, and private yacht sunset cruises along the Bosphorus strait in Istanbul.',
    highlightTags: ['🎈 Cappadocia Hot Air Balloon', '🏰 Cave Suite Experience', '⛵ Bosphorus Yacht Cruise'],
    flag: '<i class="fa-solid fa-landmark-dome text-amber-400"></i>',
    duration: '6 Days / 5 Nights',
    rating: 4.9,
    reviews: 138,
    badge: 'Bucket List',
    badgeColor: 'from-purple-600 to-pink-600',
    image: 'assets/packages/turkey-cappadocia-balloons.jpg',
    alt: 'Cappadocia colorful hot air balloons rising over fairy chimneys at sunrise, Turkey',
    galleryImages: [
      { image: 'assets/packages/turkey-cappadocia-balloons.jpg', title: 'Cappadocia Sunrise Balloons' },
      { image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', title: 'Bosphorus Waterfront Skyline' }
    ],
    priceAED: 3350,
    originalPriceAED: 4200,
    priceLKR: 'LKR 295,000',
    perks: ['Domestic Flights (Istanbul-Cappadocia)', 'Authentic Cave Hotel Stay', 'Bosphorus Sunset Yacht Cruise', 'Hagia Sophia & Grand Bazaar Tour', 'Hot Air Balloon Booking Assistance'],
    itinerary: [
      { day: 1, title: 'Arrival in Istanbul & Bosphorus Yacht Sunset Cruise', desc: 'VIP meet and transfer, sunset yacht cruise along Bosphorus between Europe and Asia.' },
      { day: 2, title: 'Hagia Sophia, Blue Mosque & Topkapi Palace', desc: 'Guided full-day heritage tour of Sultanahmet imperial monuments.' },
      { day: 3, title: 'Flight to Cappadocia & Cave Suite Check-in', desc: 'Domestic flight to Nevsehir/Kayseri, luxury cave hotel check-in.' },
      { day: 4, title: 'Sunrise Hot Air Balloon & Goreme Open-Air Museum', desc: 'Spectacular sunrise balloon flight, fairy chimney valleys and cave churches.' },
      { day: 5, title: 'Underground City & Pigeon Valley Exploration', desc: 'Explore multi-level subterranean cities and panoramic valleys.' },
      { day: 6, title: 'Return Flight to Istanbul & International Departure', desc: 'Return flight to Istanbul for your connecting departure flight.' }
    ]
  },
  {
    id: 'umrah-spiritual-package',
    title: 'Premium Umrah Spiritual Journey',
    category: 'spiritual',
    categoryTag: 'SPIRITUAL JOURNEY',
    duration: '7 Days / 6 Nights',
    destination: 'Makkah & Madinah, KSA',
    tagline: 'PEACE OF MIND IN MAKKAH & MADINAH',
    editorialSummary: 'A spiritually enriching pilgrimage featuring 5-star clock tower accommodations facing Masjid al-Haram, luxury Haramain high-speed train transit, and dedicated bilingual guides throughout.',
    highlightTags: ['🕋 5★ Clock Tower Front', '🚅 Haramain High-Speed Train', '🤲 Guided Ziyarat Tours'],
    flag: '<i class="fa-solid fa-mosque text-amber-400"></i>',
    rating: 5.0,
    reviews: 245,
    badge: 'Spiritual Peace',
    badgeColor: 'from-amber-600 to-yellow-600',
    image: 'assets/packages/umrah-grand-mosque.jpg',
    alt: 'Atmospheric evening view of the Kaaba and illuminated minarets at Masjid al-Haram with warm golden lighting',
    galleryImages: [
      { image: 'assets/packages/umrah-grand-mosque.jpg', title: 'Masjid al-Haram Makkah' },
      { image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80', title: 'Spiritual Heritage' }
    ],
    priceAED: 2990,
    originalPriceAED: 3800,
    priceLKR: 'LKR 265,000',
    perks: ['5★ Clock Tower Front Hotel', 'Direct Luxury High-Speed Train Haramain', 'Complete Umrah Visa Processing', 'Comprehensive Ziyarat Tours', '24/7 Dedicated Arabic/English Guide'],
    itinerary: [
      { day: 1, title: 'Arrival in Jeddah & VIP Transfer to Makkah', desc: 'Meet and assist at JED airport, private transfer to Makkah clock tower hotel.' },
      { day: 2, title: 'Performance of Umrah with Experienced Muallim', desc: 'Perform Umrah rituals with step-by-step scholar guidance.' },
      { day: 3, title: 'Makkah Historical Ziyarat (Jabal Al-Noor, Mina, Arafat)', desc: 'Guided visits to Cave of Hira, Mina tent city, Muzdalifah, and Mount Arafat.' },
      { day: 4, title: 'Haramain High-Speed Train to Madinah Munawwarah', desc: 'Luxury first-class train ride across the desert to Madinah.' },
      { day: 5, title: 'Masjid An-Nabawi & Rawdah Sharif Visits', desc: 'Prayers in the Prophet’s Mosque and organized Rawdah Sharif entry permits.' },
      { day: 6, title: 'Madinah Ziyarat (Masjid Quba, Mount Uhud)', desc: 'Historical ziyarat to the first mosque of Islam and Uhud battlefield.' },
      { day: 7, title: 'Final Prayers & Departure Transfer to Airport', desc: 'Farewell prayers and private transfer to MED airport.' }
    ]
  },
  {
    id: 'dubai-corporate-mice',
    title: 'Executive Dubai MICE, Gala & Corporate Summit',
    category: 'corporate',
    categoryTag: 'CORPORATE & MICE',
    tags: ['corporate', 'dubai', 'mice'],
    destination: 'Dubai & Abu Dhabi, UAE',
    tagline: 'PRESTIGIOUS SUMMITS & LUXURY TEAM INCENTIVES',
    editorialSummary: 'End-to-end corporate event logistics in Dubai and Abu Dhabi featuring state-of-the-art conference facilities, luxury executive fleet chauffeur transfers, and exclusive marina yacht gala dinners.',
    highlightTags: ['🏢 5★ Conference Venues', '🚗 Executive Chauffeur Fleet', '🛥️ Marina Gala Banquet'],
    flag: '<i class="fa-solid fa-briefcase text-amber-400"></i>',
    duration: '4 Days / 3 Nights',
    rating: 5.0,
    reviews: 88,
    badge: 'Corporate VIP',
    badgeColor: 'from-blue-600 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
    alt: 'Luxury corporate gala conference and executive summit in Dubai',
    galleryImages: [
      { image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85', title: 'Executive Summit & Keynote' },
      { image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', title: 'Dubai Marina Gala Reception' }
    ],
    priceAED: 3450,
    originalPriceAED: 4400,
    priceLKR: 'LKR 300,000',
    perks: ['5★ Luxury Business Hotel Stay', 'State-of-the-Art Conference Hall Setup', 'Private Executive Fleet Chauffeur', 'Exclusive Marina Yacht Gala Dinner', 'VIP Fast-Track Airport Protocols'],
    itinerary: [
      { day: 1, title: 'VIP Airport Arrival & Luxury Executive Check-in', desc: 'Fast-track airport meet, luxury fleet transfer, executive welcome cocktail.' },
      { day: 2, title: 'Corporate Keynote, Breakouts & Team Workshops', desc: 'Full-day conference facility with dedicated AV engineers and catering.' },
      { day: 3, title: 'Innovation Safari, Museum of the Future & Gala Dinner', desc: 'VIP access to tech landmarks, evening charter yacht gala banquet.' },
      { day: 4, title: 'Executive Debrief & Airport Escort', desc: 'Strategy wrap-up and private executive departures.' }
    ]
  },
  {
    id: 'baku-corporate-retreat',
    title: 'Caucasus Executive Leadership & Team Incentive Retreat',
    category: 'corporate',
    categoryTag: 'CORPORATE & RETREAT',
    tags: ['corporate', 'caucasus'],
    destination: 'Baku & Shahdag, Azerbaijan',
    tagline: 'LEADERSHIP EXCELLENCE IN THE CAUCASUS',
    editorialSummary: 'Combine high-level strategic alignment with alpine team-building in Shahdag Mountain Resort and formal banquets along the Caspian Sea waterfront.',
    highlightTags: ['🏔️ Shahdag Mountain Retreat', '🔥 Flame Towers Suites', '🍽️ Caspian Gala Banquet'],
    flag: '<i class="fa-solid fa-building-user text-amber-400"></i>',
    duration: '5 Days / 4 Nights',
    rating: 4.9,
    reviews: 64,
    badge: 'Executive Retreat',
    badgeColor: 'from-amber-600 to-orange-600',
    image: 'assets/packages/baku-flame-towers.jpg',
    alt: 'Baku Flame Towers and Caspian Sea Waterfront illuminated against the skyline in Azerbaijan',
    galleryImages: [
      { image: 'assets/packages/baku-flame-towers.jpg', title: 'Baku Flame Towers' },
      { image: 'https://images.unsplash.com/photo-1621539205985-64585141ef30?auto=format&fit=crop&w=1200&q=80', title: 'Gabala Alpine Mountain Range' }
    ],
    priceAED: 2650,
    originalPriceAED: 3300,
    priceLKR: 'LKR 235,000',
    perks: ['Direct Return Airline Bookings', 'Flame Towers 5★ Luxury Suites', 'Alpine Team Building in Shahdag Resort', 'Private Caspian Waterfront Gala Dinner', 'Dedicated 24/7 Corporate Account Lead'],
    itinerary: [
      { day: 1, title: 'Arrival in Baku & Boulevard Executive Reception', desc: 'Private VIP airport transfer to Flame Towers suites.' },
      { day: 2, title: 'Leadership Strategy Sessions & Old City Walk', desc: 'Morning boardroom strategy sessions, afternoon guided UNESCO city walk.' },
      { day: 3, title: 'Alpine Team Building & Mountain Activities in Shahdag', desc: 'Day trip into the Greater Caucasus for leadership challenges and alpine sports.' },
      { day: 4, title: 'Ateshgah Cultural Discovery & Formal Gala Banquet', desc: 'Visit ancient Fire Temple, evening private banquet on the Caspian.' },
      { day: 5, title: 'Executive Farewell & Airport Transfer', desc: 'Breakfast debrief and executive transfers to GYD airport.' }
    ]
  },
  {
    id: 'uae-golden-visa-bundle',
    title: 'UAE 10-Year Golden Visa & Concierge Relocation Bundle',
    category: 'visa-bundle',
    categoryTag: 'RESIDENCY & CONCIERGE',
    tags: ['visa-bundle', 'dubai'],
    destination: 'Dubai, United Arab Emirates',
    tagline: '10-YEAR SECURE UAE RESIDENCY FAST-TRACK',
    editorialSummary: 'White-glove 10-year UAE Golden Visa processing including government nomination, VIP medical fast-track, biometrics escort, Emirates ID issuance, and corporate banking concierge.',
    highlightTags: ['🛂 10-Year Golden Visa', '⚡ VIP Medical Fast-Track', '🏦 Corporate Banking Introductions'],
    flag: '<i class="fa-solid fa-passport text-amber-400"></i>',
    duration: 'Express 5-7 Days',
    rating: 5.0,
    reviews: 196,
    badge: '10-Year Residency',
    badgeColor: 'from-amber-500 to-yellow-500',
    image: 'assets/packages/museum-of-the-future-dubai.jpg',
    alt: 'Architectural marvel of the Museum of the Future and prestigious skyline in Dubai UAE',
    galleryImages: [
      { image: 'assets/packages/museum-of-the-future-dubai.jpg', title: 'Museum of the Future Dubai' },
      { image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', title: 'Dubai Marina Prestige' }
    ],
    priceAED: 4950,
    originalPriceAED: 6500,
    priceLKR: 'LKR 435,000',
    perks: ['Complete 10-Year Golden Visa Clearance', 'VIP Medical & Emirates ID Fast-Track', 'Corporate Bank Account Introductions', 'Luxury Chauffeur to Government Centers', '100% Legal & Regulatory Assurance'],
    itinerary: [
      { day: 1, title: 'Document Vetting & Initial Authority Nomination', desc: 'Lawyer review of degrees, property titles, or salary certificates; ICP nomination.' },
      { day: 2, title: 'VIP Medical Fitness & Biometrics Fast-Track', desc: 'Chauffeured VIP lounge medical testing (results in 2 hours) and biometrics.' },
      { day: 3, title: 'Emirates ID Issuance & Residency Stamping', desc: 'Final residency approval and digital Emirates ID delivery.' },
      { day: 4, title: 'Corporate Banking & Personal Relocation Handover', desc: 'Priority appointment with leading UAE banks for personal & business accounts.' }
    ]
  },
  {
    id: 'schengen-visa-travel-bundle',
    title: 'Schengen Europe Express Visa + Flight Booking Bundle',
    category: 'visa-bundle',
    categoryTag: 'VISA & TRAVEL BUNDLE',
    tags: ['visa-bundle', 'caucasus'],
    destination: 'France, Switzerland & Italy',
    tagline: 'EFFORTLESS EUROPEAN TRAVEL CLEARANCE',
    editorialSummary: 'Guaranteed embassy appointment slots, official flight and hotel booking certificates, personalized day-by-day itineraries, and comprehensive Schengen travel insurance.',
    highlightTags: ['🇪🇺 Guaranteed Embassy Slot', '📄 Verified Flight & Hotel Vouchers', '🛡️ Full Travel Insurance'],
    flag: '<i class="fa-solid fa-file-shield text-amber-400"></i>',
    duration: '10-15 Days Processing',
    rating: 4.9,
    reviews: 172,
    badge: 'Guaranteed Slot',
    badgeColor: 'from-emerald-600 to-teal-600',
    image: 'assets/packages/schengen-europe-express.jpg',
    alt: 'Iconic Eiffel Tower in Paris along the Seine river representing European Schengen journey across France, Switzerland and Italy',
    galleryImages: [
      { image: 'assets/packages/schengen-europe-express.jpg', title: 'Paris Eiffel Tower Europe' },
      { image: 'assets/packages/georgia-kazbegi.jpg', title: 'Alpine Landscapes' }
    ],
    priceAED: 1450,
    originalPriceAED: 1950,
    priceLKR: 'LKR 125,000',
    perks: ['Guaranteed Embassy Appointment Slot', 'Official Confirmed Flight & Hotel Vouchers', 'Custom Day-by-Day Travel Itinerary', 'Comprehensive Schengen Travel Insurance', 'Senior Immigration Specialist Review'],
    itinerary: [
      { day: 1, title: 'Profile Assessment & Required Checklist Formulation', desc: 'Case officer review of bank statements, NOC letter, and flight dates.' },
      { day: 2, title: 'Embassy Slot Confirmation & Application Submission', desc: 'Securing premium VFS/TLS/BLS appointment slot and online form submission.' },
      { day: 3, title: 'Flight & Hotel Reservation Certificate Issuance', desc: 'Issuance of verifiably confirmed PNR flight itineraries and hotel bookings.' },
      { day: 4, title: 'Biometrics Appointment Attendance Support', desc: 'Document pack handover and embassy interview briefing.' },
      { day: 5, title: 'Passport Retrieval with Valid Visa Stamping', desc: 'Tracking and delivery of stamped passport to client doorstep.' }
    ]
  }
];

// Testimonials Data (Authentic Google Business Profile Reviews - Star Plus Travel & Tourism LLC, Twin Towers, Deira, Dubai)
const TESTIMONIALS = [
  {
    name: 'Client Review (Express Visa)',
    nameSi: 'සේවාදායක ඇගයීම (ක්ෂණික වීසා)',
    initials: 'EV',
    role: 'Verified Google Reviewer',
    trip: 'Kuwait & UAE Visa Renewal',
    tripSi: 'කුවේට් සහ ඩුබායි වීසා අලුත් කිරීම',
    serviceTag: 'Kuwait & UAE Visa Renewal',
    serviceTagSi: 'කුවේට් සහ ඩුබායි වීසා අලුත් කිරීම',
    stars: 5,
    date: 'Verified on Google',
    comment: 'I traveled from Dubai to Kuwait to renew my visa, and had an outstanding experience thanks to Lakmal. Everything was arranged with impressive speed and professionalism. Even before I left the country, my new visa had already been processed and sent to me. Smooth, fast, and completely stress-free.',
    commentSi: 'මගේ වීසා බලපත්‍රය අලුත් කරගැනීමට මම ඩුබායි සිට කුවේට් බලා ගිය අතර, ලක්මාල් මහතාට පින්සිදුවන්නට එය ඉතා පහසු අත්දැකීමක් විය. සියල්ල ඉතා වේගවත්ව සහ වෘත්තීය මට්ටමින් සංවිධානය කර තිබුණි. මා මෙරටින් පිටවීමටත් පෙරම මගේ නව වීසාව සකසා මා වෙත එවා තිබුණි. ඉතා සුමට, වේගවත් සහ විශ්වාසනීය සේවාවක්.'
  },
  {
    name: 'Client Review (Georgia Holiday)',
    nameSi: 'සේවාදායක ඇගයීම (ජෝර්ජියා නිවාඩුව)',
    initials: 'SL',
    role: 'Verified Google Reviewer',
    trip: 'Georgia Tour, Hotels & Logistics',
    tripSi: 'ජෝර්ජියා සංචාරය, හෝටල් සහ ප්‍රවාහන සේවා',
    serviceTag: 'Georgia Tour, Hotels & Logistics',
    serviceTagSi: 'ජෝර්ජියා සංචාරය, හෝටල් සහ ප්‍රවාහන සේවා',
    stars: 5,
    date: 'Verified on Google',
    comment: 'We booked a trip to Georgia with Mr. Sasan Lakmal of Star Plus Travel and Tourism LLC—he was awesome. He handled our entire trip from flights to rental car and hotels. It was reassuring to pass that responsibility to someone so competent and timely. He was available throughout to assist with questions and logistics. Highly recommend!',
    commentSi: 'අපි Star Plus Travel සමාගමේ සසන් ලක්මාල් මහතා හරහා ජෝර්ජියා සංචාරයක් වෙන්කරවා ගත්තෙමු—ඔහුගේ සේවාව විශිෂ්ටයි. ගුවන් ටිකට්පත්, කුලී රථ සහ හෝටල් දක්වා අපගේ සම්පූර්ණ සංචාරයම ඔහු ඉතා කාර්යක්ෂමව සැලසුම් කළේය. ඕනෑම ප්‍රශ්නයකදී හෝ අවශ්‍යතාවකදී ඔහු නිරතුරුව සහාය විය. බෙහෙවින් නිර්දේශ කරමි!'
  },
  {
    name: 'Client Review (Dubai Package)',
    nameSi: 'සේවාදායක ඇගයීම (ඩුබායි පැකේජය)',
    initials: 'DP',
    role: 'Verified Google Reviewer',
    trip: '10-Day Dubai Tour & Visa',
    tripSi: 'දින 10 ක ඩුබායි සංචාරය සහ වීසා',
    serviceTag: '10-Day Dubai Tour & Visa',
    serviceTagSi: 'දින 10 ක ඩුබායි සංචාරය සහ වීසා',
    stars: 5,
    date: 'Verified on Google',
    comment: 'I recently booked a tour to Dubai with Star Plus Travels and the service they provided was next level. The visa process was smooth and hassle-free. The team was cooperative, prompt, and organized a comprehensive 10-day tour covering Dubai’s premier attractions.',
    commentSi: 'මම මෑතකදී Star Plus Travels හරහා ඩුබායි සංචාරයක් වෙන්කළ අතර ඔවුන් ලබාදුන් සේවාව ඉහළම මට්ටමක පැවතුණි. වීසා ක්‍රියාවලිය ඉතා පහසු සහ කරදරයකින් තොර විය. අපගේ කණ්ඩායම සඳහා ඩුබායි හි ප්‍රධාන ආකර්ෂණ ස්ථාන ආවරණය වන පරිදි දින 10 ක පුළුල් සංචාරයක් ඔවුන් ඉතා මැනවින් සංවිධානය කළේය.'
  },
  {
    name: 'Client Review (Dedicated Visa Processing)',
    nameSi: 'සේවාදායක ඇගයීම (ක්ෂණික වීසා සේවා)',
    initials: 'DT',
    role: 'Verified Google Reviewer',
    trip: 'UAE Visa Processing Assistance',
    tripSi: 'එක්සත් අරාබි එමීර් වීසා සහාය',
    serviceTag: 'UAE Visa Processing Assistance',
    serviceTagSi: 'එක්සත් අරාබි එමීර් වීසා සහාය',
    stars: 5,
    date: 'Verified on Google',
    comment: 'Outstanding, trustworthy service from start to finish. The team guided us through every step with clear updates and care. Special thanks to Dharshana Thilakerathne for the dedicated support and attention to detail that made the journey completely worry-free.',
    commentSi: 'ආරම්භයේ සිට අවසානය දක්වා විශිෂ්ට, විශ්වාසනීය සේවාවක්. සෑම පියවරකදීම පැහැදිලි තොරතුරු සමඟ අපව මඟපෙන්වූ අතර, විශේෂයෙන් දර්ශන තිලකරත්න මහතාගේ කැපවීම සහ කඩිනම් සහාය නිසා කිසිදු ප්‍රමාදයකින් තොරව අපගේ පවුලේ වීසා අනුමත විය.'
  },
  {
    name: 'Client Review (Corporate Delegation)',
    nameSi: 'සේවාදායක ඇගයීම (ආයතනික නියෝජිත)',
    initials: 'CD',
    role: 'Verified Google Reviewer',
    trip: 'Annual Leadership Summit Dubai (45 Pax)',
    tripSi: 'වාර්ෂික නායකත්ව සමුළුව ඩුබායි (පුද්ගලයින් 45)',
    serviceTag: 'Corporate & MICE Logistics',
    serviceTagSi: 'ආයතනික සහ MICE සේවා',
    stars: 5,
    date: 'Verified on Google',
    comment: 'Star Plus managed ground handling, executive Mercedes coach transfers, and private desert banquet logistics for our EMEA executive summit in Dubai. Flawless punctuality, discreet coordinators, and 24/7 dedicated liaison managers who anticipated every requirement.',
    commentSi: 'ඩුබායි හි පැවති අපගේ විධායක සමුළුව සඳහා සුඛෝපභෝගී මර්සිඩීස් බස් රථ, ගුවන් තොටුපළ ප්‍රවාහනය සහ කාන්තාර උත්සව කටයුතු Star Plus ආයතනය විසින් නියමිත වේලාවට හා ඉතා විශිෂ්ට ලෙස සංවිධානය කරන ලදී.'
  },
  {
    name: 'Client Review (VIP Ticketing & Luxury Stay)',
    nameSi: 'සේවාදායක ඇගයීම (VIP ගුවන් හා හෝටල්)',
    initials: 'VT',
    role: 'Verified Google Reviewer',
    trip: 'Emirates Business Class & Atlantis',
    tripSi: 'එමිරේට්ස් ව්‍යාපාරික පන්තිය සහ ඇට්ලැන්ටිස්',
    serviceTag: 'Luxury Flights & Resorts',
    serviceTagSi: 'සුඛෝපභෝගී ගුවන් හා හෝටල්',
    stars: 5,
    date: 'Verified on Google',
    comment: 'Star Plus secured exclusive unpublished business class fare cabins on Emirates alongside an exceptional luxury suite upgrade at Atlantis The Royal. Their VIP ticketing desk even arranged complimentary private chauffeur airport transfers on arrival in Dubai.',
    commentSi: 'එමිරේට්ස් ව්‍යාපාරික පන්තියේ විශේෂ වට්ටම් සහිත ගුවන් ටිකට්පත් සහ ඇට්ලැන්ටිස් ද රෝයල් හි සුඛෝපභෝගී කාමර Star Plus හරහා වෙන්කරවා ගත්තෙමු. ගුවන් තොටුපළ සිට හෝටලය දක්වා නොමිලේ VIP ප්‍රවාහන පහසුකම්ද සපයා තිබුණි.'
  },
  {
    name: 'Client Review (Airport Visa Change)',
    nameSi: 'සේවාදායක ඇගයීම (ගුවන් තොටුපළ වීසා මාරුව)',
    initials: 'AV',
    role: 'Verified Google Reviewer',
    trip: 'Airport-to-Airport Express Visa Change',
    tripSi: 'ගුවන් තොටුපළ හරහා ක්ෂණික වීසා මාරුව',
    serviceTag: 'Airport Visa Change Express',
    serviceTagSi: 'ක්ෂණික වීසා මාරුව',
    stars: 5,
    date: 'Verified on Google',
    comment: 'Needed an urgent same-day visa status change for my new employment transition. The Star Plus visa department arranged direct flydubai transit and issued my fresh entry visa before my return flight landed back at DXB Terminal 2. Exemplary efficiency.',
    commentSi: 'මගේ නව රැකියා වීසාව සඳහා කඩිනම් තත්ත්ව වෙනසක් අවශ්‍ය වූ අතර, Star Plus වීසා අංශය මගින් flydubai සංක්‍රමණ පහසුකම් සලසා මගේ නව වීසාව මා නැවත පැමිණීමටත් පෙරම නිකුත් කර දෙන ලදී. විශිෂ්ට කාර්යක්ෂමතාවයකි.'
  },
  {
    name: 'Client Review (Bespoke Island Getaway)',
    nameSi: 'සේවාදායක ඇගයීම (මාලදිවයින දූපත් නිවාඩුව)',
    initials: 'BG',
    role: 'Verified Google Reviewer',
    trip: 'Maldives Overwater Villa Retreat',
    tripSi: 'මාලදිවයින සුඛෝපභෝගී දූපත් නිවාඩුව',
    serviceTag: 'Maldives Overwater Villa',
    serviceTagSi: 'මාලදිවයින දූපත් නිවාඩුව',
    stars: 5,
    date: 'Verified on Google',
    comment: 'An unforgettable private lagoon holiday at Sun Siyam Iru Veli. Star Plus managed our seaplane charter connections and negotiated all-inclusive gourmet dining inclusions directly with the resort. Seamless coordination from both their Dubai and Colombo desks.',
    commentSi: 'Sun Siyam Iru Veli හි ගතකළ අමතක නොවන දූපත් නිවාඩුවක්. සීප්ලේන් ගුවන් ප්‍රවාහනය සහ සියලු පහසුකම් සහිත ආහාර වේල් Star Plus හරහා සකසා තිබුණි. ඩුබායි සහ කොළඹ කාර්යාල දෙකෙන්ම අඛණ්ඩ සහාය හිමිවිය.'
  }
];

// Full 12-Card Localization Mapping for /reviews page
const REVIEWS_DATA_I18N = [
  {
    authorEn: 'Client Review (Georgia Holiday)',
    authorSi: 'සේවාදායක ඇගයීම (ජෝර්ජියා නිවාඩුව)',
    serviceEn: 'Georgia Tour, Hotels & Logistics',
    serviceSi: 'ජෝර්ජියා සංචාරය, හෝටල් සහ ප්‍රවාහන සේවා',
    commentEn: 'We booked a trip to Georgia with Mr. Sasan Lakmal of Star Plus Travel and Tourism LLC—he was awesome. He handled our entire trip from flights to rental car and hotels. It was reassuring to pass that responsibility to someone so competent and timely. He was available throughout to assist with questions and logistics. Highly recommend!',
    commentSi: 'අපි Star Plus Travel සමාගමේ සසන් ලක්මාල් මහතා හරහා ජෝර්ජියා සංචාරයක් වෙන්කරවා ගත්තෙමු—ඔහුගේ සේවාව විශිෂ්ටයි. ගුවන් ටිකට්පත්, කුලී රථ සහ හෝටල් දක්වා අපගේ සම්පූර්ණ සංචාරයම ඔහු ඉතා කාර්යක්ෂමව සැලසුම් කළේය. ඕනෑම ප්‍රශ්නයකදී හෝ අවශ්‍යතාවකදී ඔහු නිරතුරුව සහාය විය. බෙහෙවින් නිර්දේශ කරමි!',
    dateEn: 'Travelled August 2026',
    dateSi: 'සංචාරය කළ දිනය: 2026 අගෝස්තු',
    branchEn: 'Twin Towers, Deira Office',
    branchSi: 'දෙයිරා නිවුන් කුළුණු කාර්යාලය'
  },
  {
    authorEn: 'Client Review (Express Visa)',
    authorSi: 'සේවාදායක ඇගයීම (ක්ෂණික වීසා)',
    serviceEn: 'Kuwait & UAE Visa Renewal',
    serviceSi: 'කුවේට් සහ ඩුබායි වීසා අලුත් කිරීම',
    commentEn: 'I traveled from Dubai to Kuwait to renew my visa, and had an outstanding experience thanks to Lakmal. Everything was arranged with impressive speed and professionalism. Even before I left the country, my new visa had already been processed and sent to me. Smooth, fast, and completely stress-free.',
    commentSi: 'මගේ වීසා බලපත්‍රය අලුත් කරගැනීමට මම ඩුබායි සිට කුවේට් බලා ගිය අතර, ලක්මාල් මහතාට පින්සිදුවන්නට එය ඉතා පහසු අත්දැකීමක් විය. සියල්ල ඉතා වේගවත්ව සහ වෘත්තීය මට්ටමින් සංවිධානය කර තිබුණි. මා මෙරටින් පිටවීමටත් පෙරම මගේ නව වීසාව සකසා මා වෙත එවා තිබුණි. ඉතා සුමට, වේගවත් සහ විශ්වාසනීය සේවාවක්.',
    dateEn: 'Travelled September 2026',
    dateSi: 'සංචාරය කළ දිනය: 2026 සැප්තැම්බර්',
    branchEn: 'Visa Operations Desk',
    branchSi: 'වීසා මෙහෙයුම් අංශය'
  },
  {
    authorEn: 'Client Review (Dubai Package)',
    authorSi: 'සේවාදායක ඇගයීම (ඩුබායි පැකේජය)',
    serviceEn: '10-Day Dubai Tour & Visa',
    serviceSi: 'දින 10 ක ඩුබායි සංචාරය සහ වීසා',
    commentEn: 'I recently booked a tour to Dubai with Star Plus Travels and the service they provided was next level. The visa process was smooth and hassle-free. The team was cooperative, prompt, and organized a comprehensive 10-day tour covering Dubai’s premier attractions.',
    commentSi: 'මම මෑතකදී Star Plus Travels හරහා ඩුබායි සංචාරයක් වෙන්කළ අතර ඔවුන් ලබාදුන් සේවාව ඉහළම මට්ටමක පැවතුණි. වීසා ක්‍රියාවලිය ඉතා පහසු සහ කරදරයකින් තොර විය. අපගේ කණ්ඩායම සඳහා ඩුබායි හි ප්‍රධාන ආකර්ෂණ ස්ථාන ආවරණය වන පරිදි දින 10 ක පුළුල් සංචාරයක් ඔවුන් ඉතා මැනවින් සංවිධානය කළේය.',
    dateEn: 'Travelled August 2026',
    dateSi: 'සංචාරය කළ දිනය: 2026 අගෝස්තු',
    branchEn: 'Dubai Inbound Division',
    branchSi: 'ඩුබායි සංචාරක මෙහෙයුම් අංශය'
  },
  {
    authorEn: 'Client Review (Dedicated Visa Processing)',
    authorSi: 'සේවාදායක ඇගයීම (ක්ෂණික වීසා සේවා)',
    serviceEn: 'UAE Visa Processing Assistance',
    serviceSi: 'එක්සත් අරාබි එමීර් වීසා සහාය',
    commentEn: 'Outstanding, trustworthy service from start to finish. The team guided us through every step with clear updates and care. Special thanks to Dharshana Thilakerathne for the dedicated support and attention to detail that made the journey completely worry-free.',
    commentSi: 'ආරම්භයේ සිට අවසානය දක්වා විශිෂ්ට, විශ්වාසනීය සේවාවක්. සෑම පියවරකදීම පැහැදිලි තොරතුරු සමඟ අපව මඟපෙන්වූ අතර, විශේෂයෙන් දර්ශන තිලකරත්න මහතාගේ කැපවීම සහ කඩිනම් සහාය නිසා කිසිදු ප්‍රමාදයකින් තොරව අපගේ පවුලේ වීසා අනුමත විය.',
    dateEn: 'Travelled July 2026',
    dateSi: 'සංචාරය කළ දිනය: 2026 ජූලි',
    branchEn: 'Immigration Advisory',
    branchSi: 'ආගමන විගමන උපදේශන අංශය'
  },
  {
    authorEn: 'Client Review (Corporate Delegation)',
    authorSi: 'සේවාදායක ඇගයීම (ආයතනික නියෝජිත)',
    serviceEn: 'Annual Leadership Summit Dubai (45 Pax)',
    serviceSi: 'වාර්ෂික නායකත්ව සමුළුව ඩුබායි (පුද්ගලයින් 45)',
    commentEn: 'Star Plus managed ground handling, executive Mercedes coach transfers, and private desert banquet logistics for our EMEA executive summit in Dubai. Flawless punctuality, discreet coordinators, and 24/7 dedicated liaison managers who anticipated every requirement.',
    commentSi: 'ඩුබායි හි පැවති අපගේ විධායක සමුළුව සඳහා සුඛෝපභෝගී මර්සිඩීස් බස් රථ, ගුවන් තොටුපළ ප්‍රවාහනය සහ කාන්තාර උත්සව කටයුතු Star Plus ආයතනය විසින් නියමිත වේලාවට හා ඉතා විශිෂ්ට ලෙස සංවිධානය කරන ලදී.',
    dateEn: 'Travelled August 2026',
    dateSi: 'සංචාරය කළ දිනය: 2026 අගෝස්තු',
    branchEn: 'Corporate & MICE Division',
    branchSi: 'ආයතනික සහ MICE අංශය'
  },
  {
    authorEn: 'Client Review (VIP Ticketing & Luxury Stay)',
    authorSi: 'සේවාදායක ඇගයීම (VIP ගුවන් හා හෝටල්)',
    serviceEn: 'Emirates Business Class & Atlantis',
    serviceSi: 'එමිරේට්ස් ව්‍යාපාරික පන්තිය සහ ඇට්ලැන්ටිස්',
    commentEn: 'Star Plus secured exclusive unpublished business class fare cabins on Emirates alongside an exceptional luxury suite upgrade at Atlantis The Royal. Their VIP ticketing desk even arranged complimentary private chauffeur airport transfers on arrival in Dubai.',
    commentSi: 'එමිරේට්ස් ව්‍යාපාරික පන්තියේ විශේෂ වට්ටම් සහිත ගුවන් ටිකට්පත් සහ ඇට්ලැන්ටිස් ද රෝයල් හි සුඛෝපභෝගී කාමර Star Plus හරහා වෙන්කරවා ගත්තෙමු. ගුවන් තොටුපළ සිට හෝටලය දක්වා නොමිලේ VIP ප්‍රවාහන පහසුකම්ද සපයා තිබුණි.',
    dateEn: 'Travelled August 2026',
    dateSi: 'සංචාරය කළ දිනය: 2026 අගෝස්තු',
    branchEn: 'Private Client Ticketing',
    branchSi: 'පුද්ගලික ගනුදෙනුකාර ටිකට්පත් අංශය'
  },
  {
    authorEn: 'Client Review (Airport Visa Change)',
    authorSi: 'සේවාදායක ඇගයීම (ගුවන් තොටුපළ වීසා මාරුව)',
    serviceEn: 'Airport-to-Airport Express Visa Change',
    serviceSi: 'ගුවන් තොටුපළ හරහා ක්ෂණික වීසා මාරුව',
    commentEn: 'Needed an urgent same-day visa status change for my new employment transition. The Star Plus visa department arranged direct flydubai transit and issued my fresh entry visa before my return flight landed back at DXB Terminal 2. Exemplary efficiency.',
    commentSi: 'මගේ නව රැකියා වීසාව සඳහා කඩිනම් තත්ත්ව වෙනසක් අවශ්‍ය වූ අතර, Star Plus වීසා අංශය මගින් flydubai සංක්‍රමණ පහසුකම් සලසා මගේ නව වීසාව මා නැවත පැමිණීමටත් පෙරම නිකුත් කර දෙන ලදී. විශිෂ්ට කාර්යක්ෂමතාවයකි.',
    dateEn: 'Travelled August 2026',
    dateSi: 'සංචාරය කළ දිනය: 2026 අගෝස්තු',
    branchEn: 'Visa Operations Dept',
    branchSi: 'වීසා මෙහෙයුම් අංශය'
  },
  {
    authorEn: 'Client Review (Bespoke Island Getaway)',
    authorSi: 'සේවාදායක ඇගයීම (මාලදිවයින දූපත් නිවාඩුව)',
    serviceEn: 'Maldives Overwater Villa Retreat',
    serviceSi: 'මාලදිවයින සුඛෝපභෝගී දූපත් නිවාඩුව',
    commentEn: 'An unforgettable private lagoon holiday at Sun Siyam Iru Veli. Star Plus managed our seaplane charter connections and negotiated all-inclusive gourmet dining inclusions directly with the resort. Seamless coordination from both their Dubai and Colombo desks.',
    commentSi: 'Sun Siyam Iru Veli හි ගතකළ අමතක නොවන දූපත් නිවාඩුවක්. සීප්ලේන් ගුවන් ප්‍රවාහනය සහ සියලු පහසුකම් සහිත ආහාර වේල් Star Plus හරහා සකසා තිබුණි. ඩුබායි සහ කොළඹ කාර්යාල දෙකෙන්ම අඛණ්ඩ සහාය හිමිවිය.',
    dateEn: 'Travelled July 2026',
    dateSi: 'සංචාරය කළ දිනය: 2026 ජූලි',
    branchEn: 'Luxury Leisure Desk',
    branchSi: 'සුඛෝපභෝගී නිවාඩු අංශය'
  },
  {
    authorEn: 'Client Review (Trade Mission & MICE)',
    authorSi: 'සේවාදායක ඇගයීම (වෙළඳ නියෝජිත සමුළුව)',
    serviceEn: 'Dubai Expo City Trade Delegation',
    serviceSi: 'ඩුබායි එක්ස්පෝ සිටි වෙළඳ නියෝජිත පිරිස',
    commentEn: 'Our trade chamber brought 60 business delegates to Dubai. Star Plus handled group e-visas with zero rejections, hotel room blocks at the Address Downtown, and custom corporate event branding. Their on-site tour director was indispensable throughout the summit.',
    commentSi: 'අපගේ වෙළඳ මණ්ඩලයේ ව්‍යාපාරික නියෝජිතයින් 60 දෙනෙකු සඳහා කිසිදු ප්‍රතික්ෂේප වීමකින් තොරව කණ්ඩායම් වීසා, Address Downtown හෝටල් කාමර සහ ප්‍රවාහනය Star Plus විසින් පරිපූර්ණව කළමනාකරණය කරන ලදී.',
    dateEn: 'Travelled June 2026',
    dateSi: 'සංචාරය කළ දිනය: 2026 ජූනි',
    branchEn: 'Corporate & MICE Division',
    branchSi: 'ආයතනික සහ MICE අංශය'
  },
  {
    authorEn: 'Client Review (Royal Suite & Flights)',
    authorSi: 'සේවාදායක ඇගයීම (රාජකීය හෝටල් හා ගුවන්)',
    serviceEn: 'First Class Riyadh-DXB & Burj Al Arab',
    serviceSi: 'රියාද්-ඩුබායි පළමු පන්තිය සහ බර්ජ් අල් අරාබ්',
    commentEn: 'From discreet last-minute First Class booking on Saudia to a customized suite arrangement at Burj Al Arab with 24/7 dedicated butler, Star Plus delivers royal-grade travel management. Their responsiveness at 2 AM was unmatched.',
    commentSi: 'Saudia ගුවන් සේවයේ පළමු පන්තියේ ගුවන් ටිකට්පත් සහ බර්ජ් අල් අරාබ් හි රාජකීය කාමර Star Plus මඟින් වෙන්කර දුනි. මධ්‍යම රාත්‍රී 2 ට පවා ඔවුන් ලබාදුන් ක්ෂණික ප්‍රතිචාරය සහ සේවාව අසමසමයි.',
    dateEn: 'Travelled September 2026',
    dateSi: 'සංචාරය කළ දිනය: 2026 සැප්තැම්බර්',
    branchEn: 'VIP Concierge Desk',
    branchSi: 'VIP සත්කාරක අංශය'
  },
  {
    authorEn: 'Client Review (Shahdag Ski Tour)',
    authorSi: 'සේවාදායක ඇගයීම (ෂාඩාග් හිම සංචාරය)',
    serviceEn: 'Baku Alpine Retreat & Shahdag',
    serviceSi: 'බාකු කඳුකර නිවාඩුව සහ ෂාඩාග්',
    commentEn: 'Our 5-day Azerbaijan mountain getaway was curated to perfection. The private chalets at Shahdag, scenic cable cars, and private cultural walking tour through Baku Old City were sublime. Flexible Tabby installment checkout made holiday budgeting seamless.',
    commentSi: 'අසර්බයිජානයේ දින 5 ක කඳුකර නිවාඩුව ඉතා විශිෂ්ට ලෙස සැලසුම් කර තිබුණි. ෂාඩාග් හි කඳුකර නවාතැන්, කේබල් කාර් සහ බාකු නගර සංචාරය අතිශය සුන්දර විය. Tabby පහසු වාරික ක්‍රමය නිසා ගෙවීම්ද පහසු විය.',
    dateEn: 'Travelled July 2026',
    dateSi: 'සංචාරය කළ දිනය: 2026 ජූලි',
    branchEn: 'Holiday Packages Desk',
    branchSi: 'නිවාඩු පැකේජ අංශය'
  },
  {
    authorEn: 'Client Review (Sales Incentive Tour)',
    authorSi: 'සේවාදායක ඇගයීම (දිරිගැන්වීමේ නිවාඩුව)',
    serviceEn: 'Corporate Incentive Retreat to Sri Lanka',
    serviceSi: 'ශ්‍රී ලංකා ආයතනික දිරිගැන්වීමේ චාරිකාව',
    commentEn: 'We rewarded our top-performing regional executives with a luxury retreat in Sri Lanka. From the scenic private salon carriage train ride through tea plantations to beachfront banquets at Galle Fort, the Star Plus Colombo team executed flawlessly.',
    commentSi: 'අපගේ ආයතනයේ විශිෂ්ටතම විධායක නිලධාරීන් සඳහා ශ්‍රී ලංකාවේ සුඛෝපභෝගී නිවාඩුවක් Star Plus හරහා සංවිධානය කළෙමු. තේ වතු මැදින් ගමන් කළ විශේෂ දුම්රිය මැදිරිය සහ ගාලු කොටුවේ සාද සියල්ල ඉතා සාර්ථකව සිදුකර දෙන ලදී.',
    dateEn: 'Travelled July 2026',
    dateSi: 'සංචාරය කළ දිනය: 2026 ජූලි',
    branchEn: 'Colombo Concierge Desk',
    branchSi: 'කොළඹ සත්කාරක අංශය'
  }
];

// Visa Requirements & Live Calculator Information
const VISA_DATA = {
  uae: {
    key: 'uae',
    title: 'UAE Tourist & Freelance Visa (30 / 60 Days)',
    rateHeadline: 'From 380 AED | 24–48 Hours Express',
    badge: 'Popular • Express Approval',
    priceAED: 380,
    speed: '24–48 Hours Express',
    docs: [
      'Passport copy (valid 6+ months from travel date)',
      'Passport-size photograph with white background',
      'Previous UAE tourist visa copy or residence cancellation (if in UAE)',
      'National identity card copy (for selected nationalities)'
    ],
    whatsappMsg: "Hello Star Plus Travel, I'd like to check requirements and book the UAE Tourist & Freelance Visa (30 / 60 Days)."
  },
  oman_change: {
    key: 'oman_change',
    title: 'Oman Visa Change by Luxury Coach (Deira Departure)',
    rateHeadline: 'From 290 AED (Same Day Coach & Visa Return)',
    badge: 'Daily Departure • Deira Hub',
    priceAED: 290,
    speed: 'Same Day Coach & Visa Return',
    docs: [
      'Original passport with 6+ months validity',
      'Current UAE visa cancellation paper or active tourist visa copy',
      'Clear border travel status without active immigration fines',
      'Luxury AC coach seat reservation & border clearance'
    ],
    whatsappMsg: "Hello Star Plus Travel, I'd like to check requirements and book the Oman Visa Change by Luxury Coach (Deira Departure)."
  },
  schengen: {
    key: 'schengen',
    title: 'Schengen European Visa Full Concierge & File Preparation',
    rateHeadline: 'From 650 AED (Appointment Booking, Flight/Hotel Vouchers, Insurance)',
    badge: 'Concierge • VFS / BLS Appointments',
    priceAED: 650,
    speed: '10–15 Working Days (Fast-Track Slot Booking)',
    docs: [
      'Original passport with 3+ months validity beyond travel date',
      'UAE residence visa (valid for minimum 3 months)',
      'Official 3 to 6 months bank statements stamped by your bank',
      'No Objection Certificate (NOC) from employer or sponsor',
      'Appointment booking, confirmed flight/hotel vouchers & Schengen insurance'
    ],
    whatsappMsg: "Hello Star Plus Travel, I'd like to check requirements and book the Schengen European Visa Full Concierge & File Preparation."
  },
  srilanka: {
    key: 'srilanka',
    title: 'Sri Lanka Electronic Travel Authorization (ETA)',
    rateHeadline: 'From 210 AED | 12–24 Hours Approval',
    badge: 'Direct Official Portal Approval',
    priceAED: 210,
    speed: '12–24 Hours Approval',
    docs: [
      'Passport copy bio-page scan (valid 6+ months from arrival)',
      'Confirmed return flight booking or onward ticket',
      'Active email address & WhatsApp for instant electronic PDF dispatch',
      'Intended stay address or hotel voucher in Sri Lanka'
    ],
    whatsappMsg: "Hello Star Plus Travel, I'd like to check requirements and book the Sri Lanka Electronic Travel Authorization (ETA)."
  },
  azerbaijan: {
    key: 'azerbaijan',
    title: 'Azerbaijan Official ASAN e-Visa (3-Hour Express)',
    rateHeadline: 'From 195 AED | 3-Hour Super Express',
    badge: '3-Hour Super Express Delivery',
    priceAED: 195,
    speed: '3-Hour Super Express',
    docs: [
      'High-resolution passport bio-page scan (valid 3+ months beyond visa expiry)',
      'Flight arrival details into Heydar Aliyev Airport (GYD)',
      'Confirmed hotel reservation or accommodation address in Baku',
      'Valid email address for direct government e-visa PDF delivery'
    ],
    whatsappMsg: "Hello Star Plus Travel, I'd like to check requirements and book the Azerbaijan Official ASAN e-Visa (3-Hour Express)."
  }
};

const VISA_DATA_SI = {
  uae: {
    key: 'uae',
    title: 'එක්සත් අරාබි එමීර් සංචාරක සහ නිදහස් වීසා (දින 30 / 60)',
    rateHeadline: 'AED 380 සිට | පැය 24–48 කඩිනම් සේවාව',
    badge: 'ජනප්‍රියයි • කඩිනම් අනුමැතිය',
    priceAED: 380,
    speed: 'පැය 24–48 කඩිනම් සේවාව',
    docs: [
      'විදේශ ගමන් බලපත්‍ර පිටපත (මාස 6 කට වඩා වලංගු)',
      'සුදු පසුබිම සහිත ඡායාරූපය',
      'පෙර එක්සත් අරාබි එමීර් වීසා පිටපත හෝ අවලංගු කිරීමේ ලියකියවිලි',
      'ජාතික හැඳුනුම්පත් පිටපත (තෝරාගත් ජාතීන් සඳහා)'
    ],
    whatsappMsg: "ආයුබෝවන් Star Plus Travel, මට එක්සත් අරාබි එමීර් සංචාරක සහ නිදහස් වීසා (දින 30 / 60) පිළිබඳ විස්තර දැනගැනීමට සහ අයදුම් කිරීමට අවශ්‍යයි."
  },
  oman_change: {
    key: 'oman_change',
    title: 'ඕමාන් වීසා මාරුව සුඛෝපභෝගී බස් රථයෙන් (දෙයිරා සිට)',
    rateHeadline: 'AED 290 සිට (එදිනම බස් රථ ගමන සහ වීසා අලුත් කිරීම)',
    badge: 'දිනපතා පිටත්වීම් • දෙයිරා මධ්‍යස්ථානය',
    priceAED: 290,
    speed: 'එදිනම බස් රථ ගමන සහ වීසා අලුත් කිරීම',
    docs: [
      'මාස 6 කට වැඩි වලංගුතාවයක් සහිත මුල් ගමන් බලපත්‍රය',
      'වත්මන් එමීර් වීසා අවලංගු කිරීමේ පත්‍රිකාව හෝ වලංගු වීසා පිටපත',
      'දඩ මුදල් නොමැති බව තහවුරු කළ දේශසීමා සංචාරක තත්ත්වය',
      'සුඛෝපභෝගී බස් රථ ආසන වෙන්කිරීම සහ දේශසීමා නිෂ්කාශනය'
    ],
    whatsappMsg: "ආයුබෝවන් Star Plus Travel, මට ඕමාන් වීසා මාරුව සුඛෝපභෝගී බස් රථයෙන් ලබාගැනීමට අවශ්‍යයි."
  },
  schengen: {
    key: 'schengen',
    title: 'යුරෝපා ෂෙන්ගන් වීසා සම්පූර්ණ ලිපිගොනු සකස් කිරීමේ සේවාව',
    rateHeadline: 'AED 650 සිට (දිනයක් වෙන්කිරීම, හෝටල්/ගුවන් ටිකට් සහ රක්ෂණාවරණය)',
    badge: 'පුද්ගලික සේවාව • VFS / BLS වේලාවන්',
    priceAED: 650,
    speed: 'වැඩකරන දින 10–15 (කඩිනම් දිනයක් වෙන්කිරීම)',
    docs: [
      'සංචාරක දිනයෙන් පසු මාස 3 කට වැඩි වලංගුතාවයක් සහිත මුල් ගමන් බලපත්‍රය',
      'එක්සත් අරාබි එමීර් පදිංචි වීසා බලපත්‍රය (අවම වශයෙන් මාස 3 ක් වලංගු)',
      'බැංකුව මඟින් සහතික කරන ලද මාස 3 සිට 6 දක්වා බැංකු ප්‍රකාශන',
      'සේවායෝජකයාගෙන් විරෝධතාවක් නොමැති බවට ලිපිය (NOC)',
      'දිනයක් වෙන්කිරීම, තහවුරු කළ හෝටල්/ගුවන් වවුචර් සහ ෂෙන්ගන් රක්ෂණය'
    ],
    whatsappMsg: "ආයුබෝවන් Star Plus Travel, මට යුරෝපා ෂෙන්ගන් වීසා සේවාව පිළිබඳ විමසීමට අවශ්‍යයි."
  },
  srilanka: {
    key: 'srilanka',
    title: 'ශ්‍රී ලංකා විද්‍යුත් සංචාරක අනුමැතිය (ETA)',
    rateHeadline: 'AED 210 සිට | පැය 12–24 කඩිනම් අනුමැතිය',
    badge: 'සෘජු නිල අනුමැතිය',
    priceAED: 210,
    speed: 'පැය 12–24 කඩිනම් අනුමැතිය',
    docs: [
      'ගමන් බලපත්‍රයේ තොරතුරු පිටපතේ ස්කෑන් පිටපත (මාස 6 කට වඩා වලංගු)',
      'තහවුරු කළ ආපසු ගුවන් ටිකට්පත',
      'ඊ-වීසා PDF ලේඛනය ලබාගැනීමට සක්‍රීය විද්‍යුත් තැපෑල සහ WhatsApp',
      'ශ්‍රී ලංකාවේ රැඳී සිටින ලිපිනය හෝ හෝටල් වවුචරය'
    ],
    whatsappMsg: "ආයුබෝවන් Star Plus Travel, මට ශ්‍රී ලංකා විද්‍යුත් සංචාරක අනුමැතිය (ETA) ලබාගැනීමට අවශ්‍යයි."
  },
  azerbaijan: {
    key: 'azerbaijan',
    title: 'අසර්බයිජාන් නිල ASAN ඊ-වීසා (පැය 3 ක කඩිනම් සේවාව)',
    rateHeadline: 'AED 195 සිට | පැය 3 ක සුපිරි කඩිනම් සේවාව',
    badge: 'පැය 3 ක සුපිරි කඩිනම් නිකුතුව',
    priceAED: 195,
    speed: 'පැය 3 ක සුපිරි කඩිනම් සේවාව',
    docs: [
      'පැහැදිලි ගමන් බලපත්‍ර ස්කෑන් පිටපත (වීසා කාලයෙන් පසු මාස 3 ක් වලංගු)',
      'හයිඩර් අලියෙව් ගුවන්තොටුපළට (GYD) පැමිණීමේ ගුවන් විස්තර',
      'බාකු හි තහවුරු කළ හෝටල් වෙන්කිරීම හෝ නවාතැන් ලිපිනය',
      'රජයේ ඊ-වීසා PDF සෘජුවම ලබාගැනීමට වලංගු විද්‍යුත් තැපැල් ලිපිනය'
    ],
    whatsappMsg: "ආයුබෝවන් Star Plus Travel, මට අසර්බයිජාන් නිල ASAN ඊ-වීසා පිළිබඳ විමසීමට අවශ්‍යයි."
  }
};

// Global Helpers
function formatPrice(amountInAED) {
  const info = CURRENCIES[currentCurrency];
  const converted = Math.round(amountInAED * info.rate);
  return `${info.symbol}${converted.toLocaleString()}`;
}

function clearAllToasts() {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toasts = container.querySelectorAll('.toast');
  toasts.forEach(t => {
    t.classList.remove('show');
    t.remove();
  });
  container.innerHTML = '';
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  // Prevent excess toast stacking: limit to 3 max
  const existingToasts = container.querySelectorAll('.toast');
  if (existingToasts.length >= 3) {
    existingToasts[0].remove();
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-slate-900 border-amber-500/50 text-white' : 'bg-red-950 border-red-500/50 text-white';
  const icon = type === 'success' ? 'fa-circle-check text-amber-400' : 'fa-circle-exclamation text-red-400';

  toast.className = `toast glass-card border px-5 py-4 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-medium z-50 ${bgClass}`;
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-lg"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// Render Tour Package Cards
function getActiveFilteredPackages() {
  if (activeCategory === 'all') return PACKAGES;
  return PACKAGES.filter(pkg => {
    if (activeCategory === 'holiday') {
      return pkg.category === 'holiday' || pkg.category === 'dubai' || pkg.category === 'srilanka' || pkg.category === 'caucasus' || pkg.category === 'tropical';
    }
    if (activeCategory === 'corporate') {
      return pkg.category === 'corporate';
    }
    if (activeCategory === 'visa-bundle') {
      return pkg.category === 'visa-bundle' || pkg.category === 'spiritual';
    }
    if (activeCategory === 'dubai') {
      return pkg.category === 'dubai' || pkg.destination.toLowerCase().includes('dubai') || (pkg.tags && pkg.tags.includes('dubai'));
    }
    if (activeCategory === 'srilanka') {
      return pkg.category === 'srilanka' || pkg.destination.toLowerCase().includes('sri lanka') || (pkg.tags && pkg.tags.includes('srilanka'));
    }
    if (activeCategory === 'caucasus') {
      return pkg.category === 'caucasus' || (pkg.tags && pkg.tags.includes('caucasus'));
    }
    if (activeCategory === 'tropical') {
      return pkg.category === 'tropical' || (pkg.tags && pkg.tags.includes('tropical'));
    }
    if (activeCategory === 'spiritual') {
      return pkg.category === 'spiritual' || (pkg.tags && pkg.tags.includes('spiritual'));
    }
    return pkg.category === activeCategory || (pkg.tags && pkg.tags.includes(activeCategory));
  });
}

function renderPackages(filteredList = PACKAGES) {
  const grid = document.getElementById('packages-grid') || document.getElementById('packagesGrid') || document.querySelector('.packages-container');
  const countElem = document.getElementById('packagesCount');
  if (!grid) return;

  const currentLang = getPreferredLanguage();
  const t = I18N_TRANSLATIONS[currentLang] || I18N_TRANSLATIONS.en;

  if (countElem) {
    countElem.textContent = currentLang === 'si'
      ? `පැකේජ ${filteredList.length} ක් පෙන්වනු ලැබේ`
      : `Showing ${filteredList.length} hand-crafted itineraries`;
  }

  if (filteredList.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-20 h-20 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-amber-400 text-3xl mb-4">
          <i class="fa-solid fa-compass"></i>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">${currentLang === 'si' ? 'ගැළපෙන පැකේජ හමු නොවීය' : 'No matching packages found'}</h3>
        <p class="text-slate-400 text-sm max-w-md mx-auto mb-6">${currentLang === 'si' ? 'සෙවුමට ගැළපෙන පැකේජ කිසිවක් හමු නොවීය. වෙනත් ගමනාන්තයක් තෝරන්න හෝ නැවත සකසන්න.' : 'No packages found matching your search. Try another destination or click Reset.'}</p>
        <button onclick="resetFilters()" class="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer">
          ${currentLang === 'si' ? 'නැවත සකසන්න' : 'Reset'}
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredList.map(pkg => {
    const formattedPrice = formatPrice(pkg.priceAED);
    const formattedOriginal = formatPrice(pkg.originalPriceAED);
    const monthlyInstallment = formatPrice(Math.round(pkg.priceAED / 4));

    const i18nPkg = (currentLang === 'si' && PACKAGES_I18N[pkg.id]) ? PACKAGES_I18N[pkg.id] : null;
    const title = i18nPkg ? i18nPkg.title : pkg.title;
    const destination = i18nPkg ? i18nPkg.destination : pkg.destination;
    const duration = i18nPkg ? i18nPkg.duration : pkg.duration;
    const badge = i18nPkg ? i18nPkg.badge : pkg.badge;

    const startingFromText = t.startingFrom || 'Starting from';
    const perPersonText = t.perPerson || 'per person';
    const installmentText = currentLang === 'si' 
      ? `හෝ Tabby මගින් මසකට 4x ${monthlyInstallment}`
      : `or 4x ${monthlyInstallment}/mo with Tabby`;
    const itineraryBtnText = t.itineraryBtn || 'Itinerary';
    const quoteBtnText = currentLang === 'si' ? 'මිල ගණන්' : 'Request Quote';
    const whatsappBtnText = currentLang === 'si' ? 'WhatsApp මගින් විමසන්න' : 'Inquire on WhatsApp';

    const rawWaMsg = currentLang === 'si'
      ? `හෙලෝ Star Plus Travels, මම "${title}" (${formattedPrice}) පැකේජය පිළිබඳ විස්තර සහ ලබාගත හැකි දින දැනගැනීමට කැමතියි.`
      : `Hello Star Plus Travels, I would like to inquire about "${title}" (${formattedPrice} per person). Please share more details and availability.`;
    const whatsappUrl = `https://wa.me/971527582293?text=${encodeURIComponent(rawWaMsg)}`;

    return `
      <div class="package-card glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col relative group border border-slate-200 dark:border-white/10 transition-all duration-300 w-full max-w-full box-border min-w-0" data-package-id="${pkg.id}" data-package-title="${encodeURIComponent(pkg.title)}" data-package-dest="${encodeURIComponent(pkg.destination || '')}">
        <!-- Image & Badges -->
        <div class="img-container relative h-56 overflow-hidden bg-slate-900 w-full max-w-full">
          <img src="${pkg.image}" alt="${pkg.alt}" class="w-full h-full object-cover object-center" loading="lazy" onerror="this.onerror=null;this.src='${pkg.fallback || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}';">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>
          
          <!-- Category & Bestseller Badge -->
          <div class="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[80%]">
            <span class="px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${pkg.badgeColor} shadow-md truncate max-w-full">
              ${badge}
            </span>
          </div>

          <!-- Duration Pill -->
          <div class="absolute bottom-3 left-3 flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-xs font-semibold text-slate-200 border border-slate-700/50">
            <i class="fa-regular fa-clock text-amber-400"></i>
            <span>${duration}</span>
          </div>

          <!-- Rating -->
          <div class="absolute bottom-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/90 text-slate-950 text-xs font-black shadow-md">
            <i class="fa-solid fa-star text-[10px]"></i>
            <span>${pkg.rating}</span>
            <span class="text-[10px] opacity-80">(${pkg.reviews})</span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 flex-1 flex flex-col justify-between w-full max-w-full box-border min-w-0">
          <div class="w-full min-w-0">
            <!-- Location -->
            <div class="flex items-center space-x-2 text-xs font-medium text-amber-600 dark:text-amber-400 mb-2">
              <span>${pkg.flag}</span>
              <span class="uppercase tracking-wider font-semibold truncate">${destination}</span>
            </div>

            <!-- Title -->
            <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-snug mb-3 break-words">
              ${title}
            </h3>

            <!-- Perks Summary -->
            <ul class="space-y-1.5 mb-5 w-full min-w-0">
              ${pkg.perks.slice(0, 3).map(perk => `
                <li class="flex items-center text-xs text-slate-600 dark:text-slate-300 min-w-0">
                  <i class="fa-solid fa-check text-emerald-500 dark:text-emerald-400 text-[10px] mr-2 shrink-0"></i>
                  <span class="truncate">${perk}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Pricing & CTAs -->
          <div class="pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <div class="flex items-end justify-between mb-3 gap-2 min-w-0">
              <div class="min-w-0 flex-1">
                <span class="text-[11px] text-slate-500 dark:text-slate-400 block font-medium truncate">${startingFromText}</span>
                <div class="flex items-baseline space-x-2 flex-wrap">
                  <span class="price-aed text-2xl font-black text-amber-600 dark:text-amber-400 font-heading" data-base-aed="${pkg.priceAED}">${formattedPrice}</span>
                  <span class="text-xs text-slate-400 dark:text-slate-500 line-through" data-base-aed="${pkg.originalPriceAED}">${formattedOriginal}</span>
                </div>
                <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block break-words">
                  ${installmentText}
                </span>
              </div>
              <span class="text-[11px] text-slate-600 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg shrink-0 whitespace-nowrap border border-slate-200/60 dark:border-slate-700/60">${perPersonText}</span>
            </div>

            <!-- Action Buttons: WhatsApp Instant Conversion + Itinerary & Request Quote -->
            <div class="space-y-2 mt-2">
              <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-[0.98] text-white text-xs font-bold transition-all text-center flex items-center justify-center space-x-2 shadow-md shadow-emerald-950/20 group/wa cursor-pointer" title="Inquire on WhatsApp for ${title}">
                <i class="fa-brands fa-whatsapp text-sm text-white group-hover/wa:scale-110 transition-transform"></i>
                <span>${whatsappBtnText}</span>
              </a>

              <div class="grid grid-cols-2 gap-2">
                <button type="button" onclick="openItineraryModal('${pkg.id}')" class="w-full py-2 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer">
                  <i class="fa-solid fa-list-ul text-amber-500 text-[10px]"></i>
                  <span>${itineraryBtnText}</span>
                </button>
                <button type="button" onclick="handleRequestQuote('${pkg.id}', '${encodeURIComponent(pkg.title)}', '${encodeURIComponent(pkg.destination || '')}', event)" class="request-quote-btn w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-slate-950 text-xs font-black transition-all text-center shadow-md shadow-amber-500/20 flex items-center justify-center space-x-1 cursor-pointer" data-package-id="${pkg.id}" data-package-title="${encodeURIComponent(pkg.title)}" data-package-dest="${encodeURIComponent(pkg.destination || '')}">
                  <span>${quoteBtnText}</span>
                  <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Category filter
let activeCategory = 'all';

function filterCategory(cat, shouldScroll = false) {
  activeCategory = cat;
  
  // Synchronize all filter buttons & pills on page
  document.querySelectorAll('.cat-pill, .category-pill, .package-filter-btn, .cat-chip, [data-category]').forEach(btn => {
    const btnCat = btn.getAttribute('data-category');
    if (btnCat === cat) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const searchInput = document.getElementById('heroDestinationInput');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = PACKAGES;
  if (cat !== 'all') {
    filtered = PACKAGES.filter(p => {
      if (cat === 'holiday') {
        return p.category === 'holiday' || p.category === 'dubai' || p.category === 'srilanka' || p.category === 'caucasus' || p.category === 'tropical';
      }
      if (cat === 'corporate') {
        return p.category === 'corporate';
      }
      if (cat === 'visa-bundle') {
        return p.category === 'visa-bundle' || p.category === 'spiritual';
      }
      if (cat === 'dubai') {
        return p.category === 'dubai' || p.destination.toLowerCase().includes('dubai') || (p.tags && p.tags.includes('dubai'));
      }
      if (cat === 'srilanka') {
        return p.category === 'srilanka' || p.destination.toLowerCase().includes('sri lanka') || (p.tags && p.tags.includes('srilanka'));
      }
      if (cat === 'caucasus') {
        return p.category === 'caucasus' || (p.tags && p.tags.includes('caucasus'));
      }
      if (cat === 'tropical') {
        return p.category === 'tropical' || (p.tags && p.tags.includes('tropical'));
      }
      if (cat === 'spiritual') {
        return p.category === 'spiritual' || (p.tags && p.tags.includes('spiritual'));
      }
      return p.category === cat || (p.tags && p.tags.includes(cat));
    });
  }

  if (query) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.destination.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.perks && p.perks.some(perk => perk.toLowerCase().includes(query)))
    );
  }

  // Update inline search result badge if on packages page
  const searchBadge = document.getElementById('searchResultBadge');
  const searchBadgeText = document.getElementById('searchResultBadgeText');
  if (searchBadge && searchBadgeText) {
    if (query) {
      searchBadge.classList.remove('hidden');
      const currentLang = getPreferredLanguage();
      searchBadgeText.textContent = currentLang === 'si'
        ? `ගැළපෙන පැකේජ ${filtered.length} ක් සොයා ගන්නා ලදී`
        : `Showing ${filtered.length} matching ${filtered.length === 1 ? 'package' : 'packages'}`;
    } else {
      searchBadge.classList.add('hidden');
    }
  }

  // Update Reset button visibility and state
  updateResetButtonVisibility();

  renderPackages(filtered);

  if (shouldScroll) {
    const target = document.getElementById('packages-grid') || document.querySelector('.packages-container');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Dynamically toggles Reset button display/opacity based on query or non-default category
function updateResetButtonVisibility() {
  const searchInput = document.getElementById('heroDestinationInput');
  const resetBtn = document.getElementById('searchResetBtn') || document.querySelector('.reset-search-btn');
  if (!resetBtn) return;

  const hasSearch = searchInput && searchInput.value.trim().length > 0;
  const hasCategoryFilter = typeof activeCategory !== 'undefined' && activeCategory !== 'all';

  if (hasSearch || hasCategoryFilter) {
    resetBtn.style.opacity = '1';
    resetBtn.style.pointerEvents = 'auto';
    resetBtn.removeAttribute('aria-hidden');
    resetBtn.classList.remove('invisible', 'pointer-events-none');
  } else {
    // When in pure default state, keep it gracefully subdued or hidden
    resetBtn.style.opacity = '0.5';
  }
}

function resetFilters() {
  const searchInput = document.getElementById('heroDestinationInput');
  if (searchInput) {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  const dateInput = document.getElementById('heroDateInput');
  if (dateInput) dateInput.value = '';

  const travelersSelect = document.getElementById('heroTravelersSelect');
  if (travelersSelect) travelersSelect.value = '2';

  const searchBadge = document.getElementById('searchResultBadge');
  if (searchBadge) searchBadge.classList.add('hidden');

  clearAllToasts();

  // Reset category state and synchronously re-render full package grid
  activeCategory = 'all';
  filterCategory('all');

  // Update button visibility
  updateResetButtonVisibility();
}

// Debounce timer variable for real-time search
let heroSearchDebounceTimer = null;

// Hero Search Interactivity: Silent real-time instant filtering with 280ms debounce
function handleHeroSearch(event) {
  if (event && event.type === 'submit') {
    event.preventDefault();
  }

  // Clear existing toasts to prevent stacking along the right margin
  clearAllToasts();

  // Update reset button visibility dynamically
  updateResetButtonVisibility();

  if (heroSearchDebounceTimer) {
    clearTimeout(heroSearchDebounceTimer);
  }

  heroSearchDebounceTimer = setTimeout(() => {
    const dest = document.getElementById('heroDestinationInput')?.value.toLowerCase().trim() || '';
    
    // If on packages.html, filterCategory already handles combining activeCategory + search query
    const isPackagesPage = (!!document.getElementById('packages-grid') || !!document.getElementById('packagesGrid') || !!document.querySelector('.packages-container')) && !!document.querySelector('.package-filter-track');
    if (isPackagesPage) {
      filterCategory(activeCategory);
      updateResetButtonVisibility();
      return;
    }

    // Homepage / general hero form handling
    let matches = PACKAGES;
    if (dest) {
      matches = PACKAGES.filter(p => 
        p.title.toLowerCase().includes(dest) ||
        p.destination.toLowerCase().includes(dest) ||
        p.category.toLowerCase().includes(dest) ||
        (p.perks && p.perks.some(perk => perk.toLowerCase().includes(dest)))
      );
    }

    // Scroll smoothly to packages section only on form submission or if packages section exists
    if (event && event.type === 'submit') {
      const packagesSec = document.getElementById('packages');
      if (packagesSec) {
        packagesSec.scrollIntoView({ behavior: 'smooth' });
      }
    }

    renderPackages(matches);
    updateResetButtonVisibility();
  }, 280);
}

// Attach Enter key behavior to package search input
function setupPackageSearchKeydown() {
  const searchInput = document.getElementById('heroDestinationInput');
  if (!searchInput || searchInput._hasEnterListener) return;
  searchInput._hasEnterListener = true;

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target && e.target.form) {
        e.stopPropagation();
      }

      if (heroSearchDebounceTimer) {
        clearTimeout(heroSearchDebounceTimer);
      }

      const isPackagesPage = (!!document.getElementById('packages-grid') || !!document.getElementById('packagesGrid') || !!document.querySelector('.packages-container')) && !!document.querySelector('.package-filter-track');
      if (isPackagesPage) {
        filterCategory(activeCategory || 'all');
        updateResetButtonVisibility();
      } else if (typeof handleHeroSearch === 'function') {
        handleHeroSearch(e);
      }

      const target = document.getElementById('packages-grid') || document.querySelector('.packages-container');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}
window.setupPackageSearchKeydown = setupPackageSearchKeydown;

// Attach click listeners to Category & Destination Filter Chips for smooth scrolling
function setupPackageFilterChips() {
  const chips = document.querySelectorAll('.cat-chip, .package-filter-btn, .category-pill, .cat-pill');
  chips.forEach(chip => {
    if (chip._hasScrollListener) return;
    chip._hasScrollListener = true;
    chip.addEventListener('click', () => {
      const target = document.getElementById('packages-grid') || document.querySelector('.packages-container');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
window.setupPackageFilterChips = setupPackageFilterChips;

// Booking / Inquiry / Quote Modal Functionality
let selectedPackageForBooking = null;

function handleRequestQuote(pkgId, pkgTitle, pkgDest, event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  // 1. Resolve package data
  let pkg = null;
  if (typeof pkgId === 'object' && pkgId !== null) {
    pkg = pkgId;
  } else if (typeof PACKAGES !== 'undefined') {
    const sKey = String(pkgId || pkgTitle || '').toLowerCase().trim();
    pkg = PACKAGES.find(p => p.id === pkgId || p.title === pkgId || (sKey && p.title.toLowerCase().includes(sKey)) || (sKey && p.id.toLowerCase().includes(sKey)));
  }
  if (!pkg && typeof COUNTRY_SHOWCASE_DATA !== 'undefined') {
    for (const cKey in COUNTRY_SHOWCASE_DATA) {
      const sKey = String(pkgId || pkgTitle || '').toLowerCase().trim();
      const tour = COUNTRY_SHOWCASE_DATA[cKey]?.tours?.find(t => t.id === pkgId || t.title === pkgId || (sKey && t.title.toLowerCase().includes(sKey)));
      if (tour) {
        pkg = {
          id: tour.id || pkgId,
          title: tour.title,
          destination: COUNTRY_SHOWCASE_DATA[cKey].title || tour.title,
          flag: COUNTRY_SHOWCASE_DATA[cKey].flag || '✈️',
          duration: tour.duration || 'Flexible',
          image: tour.image || 'assets/logo.png',
          alt: tour.title,
          priceAED: tour.priceAED || 1850
        };
        break;
      }
    }
  }

  const currentLang = typeof getPreferredLanguage === 'function' ? getPreferredLanguage() : 'en';
  const isSi = (currentLang === 'si');
  const pI18n = (isSi && typeof PACKAGES_I18N !== 'undefined' && pkg?.id && PACKAGES_I18N[pkg.id]) ? PACKAGES_I18N[pkg.id] : null;

  const displayTitle = pI18n ? pI18n.title : (pkg?.title || pkgTitle || (typeof pkgId === 'string' && pkgId ? pkgId : 'Holiday Tour Package'));
  const displayDest = pI18n ? pI18n.destination : (pkg?.destination || pkgDest || 'Holiday Tour');
  const displayDuration = pI18n ? pI18n.duration : (pkg?.duration || 'Flexible');

  const finalTitle = pkg?.title || pkgTitle || (typeof pkgId === 'string' && pkgId ? pkgId : 'Holiday Tour Package');
  const finalDest = pkg?.destination || pkgDest || 'Holiday Tour';

  if (!pkg) {
    pkg = {
      id: (typeof pkgId === 'string' && pkgId) ? pkgId : 'custom-pkg',
      title: finalTitle,
      destination: finalDest,
      flag: '✈️',
      duration: 'Flexible',
      image: 'assets/logo.png',
      alt: finalTitle,
      priceAED: 1850
    };
  }

  selectedPackageForBooking = pkg;

  // 2. Check for Inquiry / Quote modal on the current page
  const quoteModal = document.getElementById('quoteModal') || 
                     document.getElementById('inquiryModal') || 
                     document.getElementById('bookingModal');

  if (quoteModal) {
    // Populate Package Title
    const titleElem = document.getElementById('modalPkgTitle') || 
                      quoteModal.querySelector('.modal-pkg-title, #quoteModalTitle, #inquiryModalTitle, h3');
    if (titleElem) {
      titleElem.textContent = displayTitle;
    }

    // Populate Destination / Subtitle
    const destElem = document.getElementById('modalPkgDestination') || 
                     quoteModal.querySelector('.modal-pkg-destination, #quoteModalDest');
    if (destElem) {
      destElem.innerHTML = `${pkg.flag || '✈️'} <span class="font-semibold">${displayDest}</span> &bull; <span>${displayDuration}</span>`;
    }

    // Populate Image
    const imgElem = document.getElementById('modalPkgImage') || quoteModal.querySelector('img');
    if (imgElem) {
      imgElem.src = pkg.image || 'assets/logo.png';
      imgElem.alt = pkg.alt || displayTitle;
    }

    // Populate Pricing (AED only, no LKR)
    const basePriceElem = document.getElementById('modalPkgBasePrice');
    if (basePriceElem) {
      basePriceElem.classList.add('price-aed');
      basePriceElem.setAttribute('data-base-aed', pkg.priceAED || 1850);
      basePriceElem.textContent = typeof formatPrice === 'function' ? formatPrice(pkg.priceAED || 1850) : `AED ${pkg.priceAED || 1850}`;
    }
    const secPriceElem = document.getElementById('modalPkgSecondaryPrice');
    if (secPriceElem) {
      secPriceElem.removeAttribute('data-secondary-for');
      secPriceElem.textContent = '';
    }

    // Prefill any package name inputs inside the modal
    quoteModal.querySelectorAll('input[name="packageName"], input[name="package"], input[name="destination"], #bookingPackageName, #quotePackageName, #inquiryPackage').forEach(input => {
      input.value = displayTitle;
    });

    // Reset default form inputs
    const travelersInput = document.getElementById('bookingTravelers') || quoteModal.querySelector('select[name="travelers"]');
    if (travelersInput) travelersInput.value = '2';

    const childrenInput = document.getElementById('bookingChildren') || quoteModal.querySelector('select[name="children"]');
    if (childrenInput) childrenInput.value = '0';

    const nameInput = document.getElementById('bookingName') || quoteModal.querySelector('input[name="name"], input[name="fullName"]');
    if (nameInput) nameInput.value = '';

    const emailInput = document.getElementById('bookingEmail') || quoteModal.querySelector('input[name="email"]');
    if (emailInput) emailInput.value = '';

    const phoneInput = document.getElementById('bookingPhone') || quoteModal.querySelector('input[name="phone"], input[type="tel"]');
    if (phoneInput) {
      phoneInput.value = '';
      if (phoneInput._iti) {
        phoneInput._iti.setCountry('ae');
      }
    }

    const notesInput = document.getElementById('bookingNotes') || quoteModal.querySelector('textarea[name="notes"], textarea[name="message"]');
    if (notesInput) {
      notesInput.value = isSi 
        ? `නිල මිල ගණන් සහ සංචාරක විස්තර ඉල්ලුම් කිරීම: ${displayTitle}`
        : `Requesting official quote & itinerary details for: ${finalTitle}`;
    }

    // Default date to next week
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dateInput = document.getElementById('bookingDate') || quoteModal.querySelector('input[name="date"], input[type="date"]');
    if (dateInput) {
      dateInput.value = nextWeek.toISOString().split('T')[0];
    }

    if (typeof calculateBookingTotal === 'function') {
      calculateBookingTotal();
    }

    quoteModal.classList.remove('hidden');
    quoteModal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Retranslate active dynamic modal elements
    if (typeof retranslateActiveModals === 'function') {
      retranslateActiveModals();
    }

    // Ensure intl-tel-input is initialized on modal display
    if (typeof initIntlTelInputs === 'function') {
      initIntlTelInputs();
    }
    return;
  }

  // 3. Fallback: If page has a contact/quote section, smooth-scroll and preselect
  const contactSection = document.getElementById('quote') || document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });

    const interestSel = document.getElementById('contactInterest');
    if (interestSel) {
      interestSel.value = 'package';
      if (typeof updateQuoteFormFields === 'function') {
        updateQuoteFormFields();
      }
    }

    const destInput = document.getElementById('contactDest');
    if (destInput) {
      destInput.value = finalTitle;
    }

    const notesInput = document.getElementById('contactMessage');
    if (notesInput) {
      notesInput.value = `Hello Star Plus Travels, I would like to request an official quote and custom itinerary for "${finalTitle}" (${pkg?.duration || ''}). Please advise on the best rates and availability.`;
    }

    if (typeof showToast === 'function') {
      showToast(`Selected "${finalTitle}". Please complete your inquiry below!`, 'success');
    }
    return;
  }

  // 4. Fallback if neither modal nor section is present on current page
  window.location.href = `packages.html?package=${encodeURIComponent(pkg.id || finalTitle)}`;
}

function openBookingModal(pkgId) {
  handleRequestQuote(pkgId);
}
window.openBookingModal = openBookingModal;
window.handleRequestQuote = handleRequestQuote;

// Global event delegation for "Request Quote" buttons
document.addEventListener('click', (e) => {
  const quoteBtn = e.target.closest('.request-quote-btn');
  if (!quoteBtn) return;
  e.preventDefault();

  const pkgId = quoteBtn.getAttribute('data-package-id');
  const pkgTitle = quoteBtn.getAttribute('data-package-title') ? decodeURIComponent(quoteBtn.getAttribute('data-package-title')) : '';
  const pkgDest = quoteBtn.getAttribute('data-package-dest') ? decodeURIComponent(quoteBtn.getAttribute('data-package-dest')) : '';

  handleRequestQuote(pkgId, pkgTitle, pkgDest, e);
});

function closeBookingModal() {
  const modal = document.getElementById('bookingModal') || document.getElementById('quoteModal') || document.getElementById('inquiryModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    const form = modal.querySelector('form');
    if (form) form.reset();
  }
  selectedPackageForBooking = null;
}
window.closeBookingModal = closeBookingModal;

function calculateBookingTotal() {
  if (!selectedPackageForBooking) return;

  const adults = parseInt(document.getElementById('bookingTravelers')?.value || 1);
  const children = parseInt(document.getElementById('bookingChildren')?.value || 0);

  // Children charged at 65% of adult price
  const totalAED = (adults * selectedPackageForBooking.priceAED) + (children * selectedPackageForBooking.priceAED * 0.65);
  const totalFormatted = formatPrice(Math.round(totalAED));
  const installmentFormatted = formatPrice(Math.round(totalAED / 4));

  const totalElem = document.getElementById('modalTotalCalculation') || document.getElementById('bookingEstimatedTotal');
  const installmentElem = document.getElementById('modalTabbyInstallment');

  if (totalElem) {
    totalElem.innerHTML = `<span class="price-aed" data-base-aed="${Math.round(totalAED)}">${totalFormatted}</span>`;
  }
  if (installmentElem) installmentElem.textContent = `or 4x ${installmentFormatted}/month interest-free with Tabby / Tamara`;
}

async function submitBookingForm(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');

  const nameInput = form.querySelector('#bookingName') || document.getElementById('bookingName');
  const emailInput = form.querySelector('#bookingEmail') || document.getElementById('bookingEmail');
  const phoneInput = form.querySelector('#bookingPhone') || document.getElementById('bookingPhone');
  const dateInput = form.querySelector('#bookingDate') || document.getElementById('bookingDate');

  const name = nameInput?.value?.trim() || '';
  const email = emailInput?.value?.trim() || '';
  const date = dateInput?.value || '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidFields = [];

  if (dateInput && dateInput.hasAttribute('required') && !date) {
    checkFieldValidity(dateInput, false, "Please select your departure date", invalidFields);
  } else if (dateInput) {
    clearFieldError(dateInput);
  }

  if (!name) {
    checkFieldValidity(nameInput, false, "Please provide your full name", invalidFields);
  } else {
    clearFieldError(nameInput);
  }

  if (!email || !emailRegex.test(email)) {
    checkFieldValidity(emailInput, false, "Please enter a valid email address", invalidFields);
  } else {
    clearFieldError(emailInput);
  }

  if (!validatePhoneField(phoneInput)) {
    if (phoneInput && !invalidFields.includes(phoneInput)) invalidFields.push(phoneInput);
  }

  if (invalidFields.length > 0) {
    focusFirstInvalidField(invalidFields);
    return;
  }

  const phone = (phoneInput && phoneInput._iti) ? (phoneInput._iti.getNumber() || phoneInput.value.trim()) : (phoneInput?.value?.trim() || '');

  const travelers = document.getElementById('bookingTravelers')?.value;
  const children = document.getElementById('bookingChildren')?.value;
  const notes = document.getElementById('bookingNotes')?.value?.trim() || '';
  const packageTitle = selectedPackageForBooking?.title || document.getElementById('modalPkgTitle')?.textContent || 'Tour Package';
  const packageDest = selectedPackageForBooking?.destination || document.getElementById('modalPkgDestination')?.textContent || '';

  const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i><span>Submitting Request...</span>';
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
  }

  const payload = {
    formType: "inquiry",
    fullName: name,
    email: email,
    phone: phone,
    interest: selectedPackageForBooking ? "Holiday Tour Package" : "Visa & Immigration Services",
    destination: `${packageDest ? packageDest + ' - ' : ''}${packageTitle}`,
    travelers: travelers,
    notes: `${notes ? notes + ' | ' : ''}Departure Date: ${date || 'Flexible'} | Children: ${children || 0}`
  };

  try {
    await fetch(GOOGLE_APPS_SCRIPT_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    form.reset();
    closeBookingModal();
    showToast('Thank you! Your submission has been received.', 'success');
  } catch (err) {
    console.error('Booking submission error:', err);
    showToast('Network error. Please try again or reach out on WhatsApp.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
      submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  }
}

// Visual Gallery State & Current Package State for Packages Itinerary Modal
let currentActivePackage = null;
let currentPackageGalleryItems = [];
let currentPackageGalleryIndex = 0;

function switchPackageGallery(index) {
  if (!currentPackageGalleryItems || !currentPackageGalleryItems[index]) return;
  currentPackageGalleryIndex = index;
  const item = currentPackageGalleryItems[index];
  const modalImg = document.getElementById('itineraryModalImage');
  if (modalImg) {
    modalImg.style.opacity = '0.35';
    setTimeout(() => {
      modalImg.src = item.image;
      modalImg.alt = item.title || 'Tour package photo';
      modalImg.onerror = function() {
        this.onerror = null;
        this.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
      };
      modalImg.style.opacity = '1';
    }, 150);
  }
  const thumbs = document.querySelectorAll('#itineraryThumbnailDock .package-gallery-thumb');
  thumbs.forEach((thumb, idx) => {
    if (idx === index) {
      thumb.classList.add('ring-2', 'ring-amber-400', 'border-transparent', 'active');
      thumb.classList.remove('border-slate-700', 'opacity-70');
    } else {
      thumb.classList.remove('ring-2', 'ring-amber-400', 'border-transparent', 'active');
      thumb.classList.add('border-slate-700', 'opacity-70');
    }
  });
}

function downloadCurrentPackageBrochure() {
  if (!currentActivePackage) return;
  const isSl = currentActivePackage.category === 'srilanka' || currentActivePackage.countryKey === 'srilanka' || (currentActivePackage.destination && currentActivePackage.destination.toLowerCase().includes('sri lanka')) || (currentActivePackage.title && currentActivePackage.title.toLowerCase().includes('sri lanka')) || (currentActivePackage.id && (currentActivePackage.id.startsWith('sl-') || currentActivePackage.id.includes('sri-lanka')));
  downloadTourBrochure({
    ...currentActivePackage,
    priceLKR: isSl ? '' : (currentActivePackage.priceLKR || `LKR ${(currentActivePackage.priceAED * 85).toLocaleString()}`),
    inclusions: currentActivePackage.perks || currentActivePackage.inclusions || [],
    itinerary: currentActivePackage.itinerary || []
  });
}

// Itinerary Modal Functionality
function openItineraryModal(pkgId) {
  const pkg = PACKAGES.find(p => p.id === pkgId);
  if (!pkg) return;
  currentActivePackage = pkg;

  // Badges on Image (Top Row)
  const categoryBadge = document.getElementById('itineraryCategoryBadge');
  if (categoryBadge) {
    categoryBadge.textContent = pkg.categoryTag || (pkg.category ? pkg.category.toUpperCase() : 'SIGNATURE TOUR');
  }
  const durationBadge = document.getElementById('itineraryDurationBadge');
  if (durationBadge) {
    durationBadge.textContent = pkg.duration;
  }
  const ratingVal = document.getElementById('itineraryRatingValue');
  if (ratingVal) {
    ratingVal.textContent = pkg.rating ? pkg.rating.toFixed(1) : '5.0';
  }
  const reviewsVal = document.getElementById('itineraryReviewsValue');
  if (reviewsVal) {
    reviewsVal.textContent = `(${pkg.reviews || '150+'})`;
  }

  // Visual Media Setup with 16:9 Aspect Ratio Container
  currentPackageGalleryItems = Array.isArray(pkg.galleryImages) && pkg.galleryImages.length > 0
    ? pkg.galleryImages
    : [{ image: pkg.image, title: pkg.title }];
  currentPackageGalleryIndex = 0;

  const modalImg = document.getElementById('itineraryModalImage');
  if (modalImg) {
    modalImg.src = currentPackageGalleryItems[0]?.image || pkg.image;
    modalImg.onerror = function() {
      this.onerror = null;
      this.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
    };
  }

  // Title, Tagline & Editorial Summary
  const titleElem = document.getElementById('itineraryModalTitle');
  if (titleElem) titleElem.textContent = pkg.title;

  const taglineElem = document.getElementById('itineraryModalTagline');
  if (taglineElem) {
    taglineElem.textContent = pkg.tagline || `${pkg.destination ? pkg.destination.toUpperCase() + ' • ' : ''}EXCLUSIVE SIGNATURE ITINERARY`;
  }

  const summaryElem = document.getElementById('itineraryModalSummary');
  if (summaryElem) {
    summaryElem.textContent = pkg.editorialSummary || pkg.description || 'Experience an unforgettable journey crafted with 4★ and 5★ handpicked luxury stays, private chauffeur transfers, and exclusive signature landmark excursions.';
  }

  // Highlights Pill Row (3–4 quick tags)
  const highlightTagsElem = document.getElementById('itineraryHighlightTags');
  if (highlightTagsElem) {
    const tags = pkg.highlightTags || [
      '✨ Handpicked Boutique Stays',
      '🚗 Private Chauffeur Logistics',
      '🎟️ VIP Landmark Privileges'
    ];
    highlightTagsElem.innerHTML = tags.map(tag => `
      <span class="bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
        ${tag}
      </span>
    `).join('');
  }

  // Thumbnail Dock
  const thumbsElem = document.getElementById('itineraryThumbnailDock');
  if (thumbsElem) {
    if (currentPackageGalleryItems.length > 1) {
      thumbsElem.style.display = 'flex';
      thumbsElem.innerHTML = currentPackageGalleryItems.map((item, idx) => `
        <button type="button" 
                onclick="switchPackageGallery(${idx})" 
                class="package-gallery-thumb flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border cursor-pointer transition-all ${idx === 0 ? 'ring-2 ring-amber-400 border-transparent active' : 'border-slate-700 hover:border-amber-400 opacity-70 hover:opacity-100'}" 
                title="${item.title || 'Tour landmark'}">
          <img src="${item.image}" alt="${item.title || 'Tour landmark'}" class="w-full h-full object-cover object-center pointer-events-none" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';">
        </button>
      `).join('');
    } else {
      thumbsElem.innerHTML = '';
      thumbsElem.style.display = 'none';
    }
  }

  // Itinerary timeline
  const timelineElem = document.getElementById('itineraryDaysContainer');
  if (timelineElem) {
    timelineElem.innerHTML = pkg.itinerary.map(item => `
      <div class="relative pl-7 pb-4 last:pb-0 border-l border-amber-500/40 last:border-transparent">
        <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900 shadow-md"></div>
        <span class="inline-block px-2 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/15 dark:bg-amber-500/20 text-amber-400 mb-1">Day ${item.day}</span>
        <h4 class="text-sm font-bold text-white">${item.title}</h4>
        ${item.desc ? `<p class="text-xs text-slate-300 mt-1 leading-relaxed">${item.desc}</p>` : ''}
      </div>
    `).join('');
  }

  // Perks list (Package Inclusions & Privileges)
  const perksElem = document.getElementById('itineraryPerksList');
  if (perksElem) {
    perksElem.innerHTML = (pkg.perks || []).map(perk => `
      <div class="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 shadow-sm">
        <i class="fa-solid fa-circle-check text-amber-500 text-xs flex-shrink-0"></i>
        <span>${perk}</span>
      </div>
    `).join('');
  }

  // Price & CTA
  const priceElem = document.getElementById('itineraryModalPrice');
  if (priceElem) {
    priceElem.classList.add('price-aed');
    priceElem.setAttribute('data-base-aed', pkg.priceAED);
    priceElem.textContent = typeof formatPrice === 'function' ? formatPrice(pkg.priceAED) : `AED ${pkg.priceAED.toLocaleString()}`;
  }
  const secPriceElem = document.getElementById('itineraryModalSecondaryPrice');
  if (secPriceElem) {
    secPriceElem.removeAttribute('data-secondary-for');
    secPriceElem.textContent = '';
  }

  const bookBtn = document.getElementById('itineraryBookButton');
  if (bookBtn) {
    bookBtn.onclick = () => {
      closeItineraryModal();
      openBookingModal(pkg.id);
    };
  }

  // Pre-fill WhatsApp Inquiry
  const itineraryWaBtn = document.getElementById('itineraryWhatsAppButton');
  if (itineraryWaBtn) {
    itineraryWaBtn.href = `https://wa.me/971527582293?text=${encodeURIComponent(`Hello Star Plus Travels, I am interested in booking the ${pkg.title} package (${pkg.duration}).`)}`;
  }

  const modal = document.getElementById('itineraryModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeItineraryModal() {
  const modal = document.getElementById('itineraryModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

// Testimonials Slider Logic
// Testimonials Continuous Marquee Logic
let currentSlide = 0;
let slideInterval = null;

function renderTestimonial() {
  const tracks = document.querySelectorAll('.review-track, #testimonialMarqueeTrack, #reviewsMarqueeTrack');
  const container = document.getElementById('testimonialSlide');
  const dotsContainer = document.getElementById('testimonialDots');

  const currentLang = typeof getPreferredLanguage === 'function' ? getPreferredLanguage() : 'en';
  const isSi = (currentLang === 'si' || document.documentElement.lang === 'si');
  const verifiedReviewText = isSi ? 'Google තහවුරු කළ ඇගයීම' : 'Google Verified Review';
  const googleVerifiedText = verifiedReviewText;

  const generateCardHTML = (t) => {
    const tName = (isSi && t.nameSi) ? t.nameSi : (t.name || t.authorEn);
    const tServiceTag = (isSi && t.serviceTagSi) ? t.serviceTagSi : (t.serviceTag || t.serviceEn || t.trip);
    const tComment = (isSi && t.commentSi) ? t.commentSi : (t.comment || t.commentEn);
    const initials = t.initials || (tName.match(/\(([^)]+)\)/)?.[1]?.slice(0, 2).toUpperCase() || 'SP');

    return `
      <div style="width: 340px !important; min-width: 340px !important; max-width: 340px !important; flex: 0 0 340px !important; white-space: normal !important;" class="w-[340px] min-w-[340px] max-w-[340px] shrink-0 bg-[#0B1120] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
        <!-- Header -->
        <div class="flex items-center justify-between gap-2">
          <div class="text-amber-400 text-xs flex items-center space-x-1 shrink-0" aria-label="5 stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <span class="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full truncate max-w-[170px]" title="${tServiceTag}">
            ${tServiceTag}
          </span>
        </div>

        <!-- Body -->
        <p style="white-space: normal !important; word-break: break-word;" class="text-sm text-slate-200 leading-relaxed my-3 line-clamp-4 italic block text-left">
          "${tComment}"
        </p>

        <!-- Footer -->
        <div class="pt-3 border-t border-slate-800/80 flex items-center gap-3 mt-auto">
          <div class="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-amber-400 shrink-0">
            ${initials}
          </div>
          <div class="overflow-hidden min-w-0 flex-1 text-left">
            <h4 class="text-xs font-semibold text-white truncate">${tName}</h4>
            <div class="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
              <svg width="16" height="16" class="w-4 h-4 min-w-[16px] max-w-[16px] min-h-[16px] max-h-[16px] shrink-0 inline-block" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span class="whitespace-nowrap">${verifiedReviewText}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // Render Infinite Marquee Ticker across all matching tracks
  if (tracks.length > 0) {
    // Duplicate array so CSS @keyframes scrollTrack (-50%) loops infinitely and seamlessly
    const marqueeItems = [...TESTIMONIALS, ...TESTIMONIALS];
    const marqueeHTML = marqueeItems.map(generateCardHTML).join('');
    tracks.forEach(track => {
      track.innerHTML = marqueeHTML;
    });
  }

  // Fallback for single slide if testimonialSlide is present
  if (!container) return;

  const t = TESTIMONIALS[currentSlide];
  if (!t) return;

  const tName = (isSi && t.nameSi) ? t.nameSi : t.name;
  const tTrip = (isSi && t.tripSi) ? t.tripSi : t.trip;
  const tServiceTag = (isSi && t.serviceTagSi) ? t.serviceTagSi : (t.serviceTag || t.trip);
  const tComment = (isSi && t.commentSi) ? t.commentSi : t.comment;

  container.innerHTML = `
    <div class="testimonial-slide flex flex-col justify-between text-left relative z-10">
      <div class="flex items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <div class="flex items-center space-x-1 text-amber-400 text-sm tracking-widest shrink-0">
            ${Array(t.stars).fill('<i class="fa-solid fa-star"></i>').join('')}
          </div>
          <span class="h-3 w-px bg-slate-700 select-none"></span>
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700/60" title="${googleVerifiedText}">
            <svg width="16" height="16" class="w-4 h-4 min-w-[16px] max-w-[16px] min-h-[16px] max-h-[16px] shrink-0 inline-block" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span class="text-xs font-medium text-slate-300 whitespace-nowrap">${googleVerifiedText}</span>
          </span>
        </div>
        <span class="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full whitespace-nowrap shrink-0">
          ${tServiceTag}
        </span>
      </div>
      <p class="text-sm md:text-base text-slate-200 font-normal leading-relaxed italic mb-6">
        ${tComment}
      </p>
      <div class="flex items-center gap-3 pt-2">
        <div class="w-11 h-11 rounded-full bg-slate-800 border border-amber-500/30 text-amber-400 text-sm font-semibold flex items-center justify-center flex-shrink-0">
          ${t.initials}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-bold text-white leading-tight">${tName}</h4>
            <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20 leading-tight">
              <i class="fa-solid fa-circle-check text-[9px]"></i> ${verifiedClientText}
            </span>
          </div>
          <p class="text-xs text-slate-400 font-normal leading-tight mt-1">${profileReviewText}</p>
        </div>
      </div>
    </div>
  `;

  if (dotsContainer) {
    dotsContainer.innerHTML = TESTIMONIALS.map((_, idx) => `
      <button onclick="goToSlide(${idx})" class="w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? 'bg-amber-500 w-8' : 'bg-slate-700 hover:bg-slate-500'}" aria-label="Go to slide ${idx + 1}"></button>
    `).join('');
  }
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % TESTIMONIALS.length;
  renderTestimonial();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
  renderTestimonial();
}

function goToSlide(idx) {
  currentSlide = idx;
  renderTestimonial();
  resetSlideTimer();
}

function startSlideTimer() {
  if (document.getElementById('testimonialSlide')) {
    slideInterval = setInterval(nextSlide, 6000);
  }
}

function resetSlideTimer() {
  if (slideInterval) {
    clearInterval(slideInterval);
    startSlideTimer();
  }
}

// Visa Checker Widget - Interactive Live Rates & Requirements Engine
function checkVisaRequirements() {
  const selectElem = document.getElementById('visaSelect');
  const selectedType = selectElem?.value || 'uae';
  const resultCard = document.getElementById('visaResultCard');
  if (!resultCard) return;

  const data = VISA_DATA[selectedType] || VISA_DATA.uae;
  if (!data) return;

  const activeLang = document.documentElement.lang || (typeof getPreferredLanguage === 'function' ? getPreferredLanguage() : (localStorage.getItem('site_lang') || 'en'));
  const isSi = (activeLang === 'si');
  const tDict = (typeof translations !== 'undefined' && translations[activeLang]) ? translations[activeLang] : {};
  const siData = (isSi && typeof VISA_DATA_SI !== 'undefined' && VISA_DATA_SI[selectedType]) ? VISA_DATA_SI[selectedType] : null;

  const displayTitle = siData ? siData.title : data.title;
  const displayHeadline = siData ? siData.rateHeadline : data.rateHeadline;
  const displayBadge = siData ? siData.badge : data.badge;
  const displayDocs = siData ? siData.docs : data.docs;
  const reqDocsTitle = tDict.visa_req_docs || (isSi ? 'අවශ්‍ය ලිපිලේඛන ලැයිස්තුව:' : 'REQUIRED DOCUMENTS CHECKLIST:');
  const whatsappMsg = siData ? siData.whatsappMsg : data.whatsappMsg;

  const waUrl = `https://wa.me/971527582293?text=${encodeURIComponent(whatsappMsg)}`;
  const curr = CURRENCIES[currentCurrency] || CURRENCIES.AED;
  const isAED = currentCurrency === 'AED';
  const convertedPrice = formatPrice(data.priceAED);

  resultCard.innerHTML = `
    <div class="glass-card p-5 sm:p-7 rounded-2xl border border-amber-500/30 dark:border-amber-500/25 bg-white/95 dark:bg-slate-900/95 shadow-xl transition-all duration-300 transform opacity-100 text-left">
      <!-- Header Row: Title & Badge -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5">
            <i class="fa-solid fa-bolt text-amber-500 text-[10px]"></i>
            ${displayBadge}
          </span>
          <h4 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading leading-tight">${displayTitle}</h4>
        </div>
      </div>

      <!-- Price & Processing Speed Banner -->
      <div class="my-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div class="min-w-0">
          <span class="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">${isSi ? 'මිල සහ සේවා කාලය' : 'Price &amp; Processing Speed'}</span>
          <p class="text-xs sm:text-sm md:text-base font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-2 flex-wrap">
            <i class="fa-solid fa-tag text-amber-500 text-xs shrink-0"></i>
            <span class="price-aed" data-base-aed="${data.priceAED}">${displayHeadline}</span>
          </p>
        </div>
        ${!isAED ? `
          <div class="text-left sm:text-right shrink-0 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <span class="text-[10px] text-slate-400 block">${isSi ? 'පරිවර්තනය කළ මිල' : 'Converted Price'}</span>
            <span class="text-xs font-bold text-amber-400">${convertedPrice} (${curr.name.split(' ')[0]})</span>
          </div>
        ` : ''}
      </div>

      <!-- Requirements Checklist -->
      <div class="mb-5">
        <h5 class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
          <i class="fa-solid fa-clipboard-check text-amber-500 text-xs"></i>
          <span data-i18n="visa_req_docs">${reqDocsTitle}</span>
        </h5>
        <ul class="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          ${displayDocs.map(doc => `
            <li class="flex items-start gap-2.5">
              <span class="w-4 h-4 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px]">
                <i class="fa-solid fa-check"></i>
              </span>
              <span class="leading-relaxed font-medium">${doc}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <!-- Primary WhatsApp Action Button -->
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all group cursor-pointer" title="${isSi ? 'WhatsApp මගින් විමසන්න' : 'Inquire on WhatsApp'}">
          <i class="fa-brands fa-whatsapp text-base transition-transform group-hover:scale-110"></i>
          <span>${isSi ? 'WhatsApp මගින් විමසන්න' : 'Inquire on WhatsApp'}</span>
        </a>

        <!-- Fast Online Form Booking Button -->
        <button type="button" onclick="openVisaInquiryModal('${displayTitle.replace(/'/g, "\\'")}', event)" class="flex-1 py-3 px-5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#070B14] font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer" title="${isSi ? 'අන්තර්ජාලය හරහා අයදුම් කරන්න' : 'Apply Online Form'}">
          <i class="fa-solid fa-file-signature text-[#070B14] text-xs sm:text-sm"></i>
          <span>${isSi ? 'අන්තර්ජාලය හරහා අයදුම් කරන්න' : 'Apply Online Form'}</span>
        </button>
      </div>
    </div>
  `;
}
window.checkVisaRequirements = checkVisaRequirements;

function openVisaInquiryModal(visaTitle, e) {
  if (e && e.preventDefault) {
    e.preventDefault();
  }

  const bookingModal = document.getElementById('bookingModal');
  const contactForm = document.getElementById('contact');

  // If a booking/inquiry modal is present on the page, open it directly without redirecting
  if (bookingModal) {
    selectedPackageForBooking = null;

    const currentLang = typeof getPreferredLanguage === 'function' ? getPreferredLanguage() : 'en';
    const isSi = (currentLang === 'si');

    const titleElem = document.getElementById('modalPkgTitle');
    if (titleElem) titleElem.textContent = visaTitle || (isSi ? 'වීසා අයදුම්පත' : 'Visa Application');

    const destElem = document.getElementById('modalPkgDestination');
    if (destElem) {
      destElem.innerHTML = `<i class="fa-solid fa-passport text-amber-500 mr-1.5"></i> <span class="font-semibold">${isSi ? 'වීසා සහ ආගමන සේවා' : 'Visa &amp; Immigration Services'}</span> &bull; <span>${isSi ? 'කඩිනම් සැකසුම්' : 'Express Processing'}</span>`;
    }

    const imgElem = document.getElementById('modalPkgImage');
    if (imgElem) {
      imgElem.src = 'assets/logo.png';
      imgElem.alt = visaTitle || (isSi ? 'වීසා අයදුම්පත' : 'Visa Application');
    }

    const priceElem = document.getElementById('modalPkgBasePrice');
    if (priceElem) priceElem.textContent = isSi ? 'නිල ගාස්තු' : 'Official Rate';

    const travelers = document.getElementById('bookingTravelers');
    if (travelers) travelers.value = '1';

    const children = document.getElementById('bookingChildren');
    if (children) children.value = '0';

    const nameInput = document.getElementById('bookingName');
    if (nameInput) nameInput.value = '';

    const emailInput = document.getElementById('bookingEmail');
    if (emailInput) emailInput.value = '';

    const phoneInput = document.getElementById('bookingPhone');
    if (phoneInput) {
      phoneInput.value = '';
      if (phoneInput._iti) {
        phoneInput._iti.setCountry('ae');
      }
    }

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 3);
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) dateInput.value = nextWeek.toISOString().split('T')[0];

    const notesInput = document.getElementById('bookingNotes');
    if (notesInput) {
      notesInput.value = isSi
        ? `මම මෙම වීසා කාණ්ඩය සඳහා අයදුම් කිරීමට කැමැත්තෙමි: ${visaTitle}. අවශ්‍ය ලියකියවිලි, කාලසීමාව සහ හමුවීම් ලබාගැනීම පිළිබඳ කරුණාකර මාව දැනුවත් කරන්න.`
        : `I would like to apply for: ${visaTitle}. Please advise on the required documents, processing timeline, and visa appointment availability.`;
    }

    const calcTotal = document.getElementById('modalTotalCalculation');
    if (calcTotal) calcTotal.textContent = isSi ? 'කෙලින්ම යොමු කිරීම' : 'Direct Submission';

    const installmentElem = document.getElementById('modalTabbyInstallment');
    if (installmentElem) installmentElem.textContent = isSi ? 'සුදුසුකම් ලත් සේවාවන් සඳහා Tabby සහ Tamara පොලී රහිත වාරික 4ක්' : 'Tabby & Tamara 4x interest-free available on eligible services';

    const submitBtn = bookingModal.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = isSi ? 'අයදුම්පත තහවුරු කරන්න' : 'Confirm Application Request';
    }

    bookingModal.classList.remove('hidden');
    bookingModal.classList.add('flex');

    if (typeof retranslateActiveModals === 'function') {
      retranslateActiveModals();
    }

    if (typeof initIntlTelInputs === 'function') {
      initIntlTelInputs();
    }

    return;
  }

  // If an embedded contact/quote form is on the current page, scroll and pre-fill
  if (contactForm) {
    contactForm.scrollIntoView({ behavior: 'smooth' });
    const interest = document.getElementById('contactInterest');
    if (interest) {
      interest.value = 'visa';
      if (typeof updateQuoteFormFields === 'function') {
        updateQuoteFormFields();
      }
    }
    const dest = document.getElementById('contactDest');
    if (dest && visaTitle) {
      dest.value = visaTitle;
    }
    const notes = document.getElementById('contactMessage');
    if (notes) {
      notes.value = `I would like to apply for: ${visaTitle}. Please advise on the exact documents and earliest processing appointment.`;
    }
    showToast(`Pre-filled inquiry for ${visaTitle}. Please submit your details below!`, 'success');
  } else {
    window.location.href = `index.html?interest=visa&dest=${encodeURIComponent(visaTitle)}#contact`;
  }
}
window.openVisaInquiryModal = openVisaInquiryModal;

// Dynamic Field Configuration for "Request a Free Travel Itinerary & Quote" Form
function updateQuoteFormFields() {
  const interestSelect = document.getElementById('contactInterest');
  if (!interestSelect) return;

  const interest = interestSelect.value;
  const field1Label = document.getElementById('quoteField1Label');
  const field1Input = document.getElementById('contactDest');
  const field2Label = document.getElementById('quoteField2Label');
  const travelersWrapper = document.getElementById('quoteTravelersSelectWrapper');
  const travelersSelect = document.getElementById('contactTravelers');
  const customField2Wrapper = document.getElementById('quoteCustomField2Wrapper');
  const customField2Input = document.getElementById('contactCustomField2');
  const messageInput = document.getElementById('contactMessage');

  const lang = (typeof getPreferredLanguage === 'function') ? getPreferredLanguage() : 'en';

  if (interest === 'visa') {
    // Fast-Track Visa Processing
    if (field1Label) {
      field1Label.textContent = lang === 'si' ? 'අපේක්ෂිත රට / වීසා වර්ගය *' : 'TARGET COUNTRY / VISA TYPE *';
    }
    if (field1Input) {
      field1Input.placeholder = 'e.g., UAE 60-Day Tourist, Schengen, UK, US';
      field1Input.setAttribute('aria-label', 'Target Country or Visa Type');
      field1Input.required = true;
    }
    if (field2Label) {
      field2Label.textContent = lang === 'si' ? 'වත්මන් පුරවැසිභාවය *' : 'CURRENT NATIONALITY *';
    }
    if (travelersWrapper) travelersWrapper.classList.add('hidden');
    if (travelersSelect) travelersSelect.required = false;
    if (customField2Wrapper) customField2Wrapper.classList.remove('hidden');
    if (customField2Input) {
      customField2Input.placeholder = 'e.g., Indian, Filipino, Sri Lankan, Pakistani';
      customField2Input.setAttribute('aria-label', 'Current Nationality');
      customField2Input.required = true;
    }
    if (messageInput) {
      messageInput.placeholder = 'State your expected travel dates, residency status, or specific visa requirements...';
    }
  } else if (interest === 'flight') {
    // Cheap Airline Tickets
    if (field1Label) {
      field1Label.textContent = lang === 'si' ? 'ගුවන් ගමන් මාර්ගය (සිට - දක්වා) *' : 'FLIGHT ROUTE (FROM – TO) *';
    }
    if (field1Input) {
      field1Input.placeholder = 'e.g., Dubai (DXB) to Colombo (CMB)';
      field1Input.setAttribute('aria-label', 'Flight Route (From - To)');
      field1Input.required = true;
    }
    if (field2Label) {
      field2Label.textContent = lang === 'si' ? 'ගමන් වර්ගය සහ අපේක්ෂිත දිනයන් *' : 'TRIP TYPE & TENTATIVE DATES *';
    }
    if (travelersWrapper) travelersWrapper.classList.add('hidden');
    if (travelersSelect) travelersSelect.required = false;
    if (customField2Wrapper) customField2Wrapper.classList.remove('hidden');
    if (customField2Input) {
      customField2Input.placeholder = 'e.g., Return / One-Way, mid-October';
      customField2Input.setAttribute('aria-label', 'Trip Type & Tentative Dates');
      customField2Input.required = true;
    }
    if (messageInput) {
      messageInput.placeholder = 'Preferred airlines, number of passengers, cabin class, or baggage needs...';
    }
  } else {
    // Holiday Tour Package ("package") OR Custom Tailor-Made Itinerary ("custom")
    if (field1Label) {
      field1Label.textContent = lang === 'si' ? 'කැමති ගමනාන්තය' : 'PREFERRED DESTINATION';
    }
    if (field1Input) {
      field1Input.placeholder = 'e.g., Sri Lanka, Georgia, Bali, Europe';
      field1Input.setAttribute('aria-label', 'Preferred Destination');
      field1Input.required = false;
    }
    if (field2Label) {
      field2Label.textContent = lang === 'si' ? 'සංචාරකයින් ගණන' : 'ESTIMATED TRAVELERS';
    }
    if (travelersWrapper) travelersWrapper.classList.remove('hidden');
    if (travelersSelect) travelersSelect.required = false;
    if (customField2Wrapper) customField2Wrapper.classList.add('hidden');
    if (customField2Input) {
      customField2Input.required = false;
    }
    if (messageInput) {
      messageInput.placeholder = 'Tell us about your preferred travel dates, hotel rating preference, or special requests...';
    }
  }
}
window.updateQuoteFormFields = updateQuoteFormFields;

// Currency Switcher Logic & Modern Currency Dropdown
const CURRENCY_DISPLAY_LABELS = {
  AED: 'AED (د.إ)',
  USD: 'USD ($)',
  EUR: 'EUR (€)',
  GBP: 'GBP (£)'
};

function updateModernCurrencyDropdownUI(curr) {
  const labelEl = document.getElementById('current-currency-label');
  if (labelEl && CURRENCY_DISPLAY_LABELS[curr]) {
    labelEl.textContent = CURRENCY_DISPLAY_LABELS[curr];
  }

  document.querySelectorAll('.currency-option').forEach(btn => {
    const btnCurr = btn.getAttribute('data-currency');
    if (btnCurr === curr) {
      btn.classList.add('text-amber-400', 'font-semibold', 'bg-white/10');
      btn.classList.remove('text-slate-200');
    } else {
      btn.classList.remove('text-amber-400', 'font-semibold', 'bg-white/10');
      btn.classList.add('text-slate-200');
    }
  });
}
window.updateModernCurrencyDropdownUI = updateModernCurrencyDropdownUI;

function initModernCurrencyDropdown() {
  const toggleBtn = document.getElementById('currency-toggle-btn');
  const menu = document.getElementById('currency-menu');
  const chevron = document.getElementById('currency-chevron') || toggleBtn?.querySelector('svg');
  const wrapper = document.getElementById('currency-dropdown-wrapper');

  if (!toggleBtn || !menu) return;

  // Sync initial label and active option
  updateModernCurrencyDropdownUI(currentCurrency);

  // Toggle handler
  if (!toggleBtn._hasCurrencyListener) {
    toggleBtn._hasCurrencyListener = true;
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentChevron = document.getElementById('currency-chevron') || toggleBtn.querySelector('svg');
      const isHidden = menu.classList.contains('hidden');
      if (isHidden) {
        menu.classList.remove('hidden');
        toggleBtn.setAttribute('aria-expanded', 'true');
        if (currentChevron) currentChevron.classList.add('rotate-180');
      } else {
        menu.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
        if (currentChevron) currentChevron.classList.remove('rotate-180');
      }
    });
  }

  // Option select handler
  document.querySelectorAll('.currency-option').forEach(btn => {
    if (!btn._hasCurrencyListener) {
      btn._hasCurrencyListener = true;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentChevron = document.getElementById('currency-chevron') || toggleBtn?.querySelector('svg');
        const curr = btn.getAttribute('data-currency');
        if (curr) {
          changeCurrency(curr);
        }
        menu.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
        if (currentChevron) currentChevron.classList.remove('rotate-180');
      });
    }
  });

  // Close on outside click
  if (!document._hasCurrencyOutsideListener) {
    document._hasCurrencyOutsideListener = true;
    document.addEventListener('click', (e) => {
      const activeWrapper = document.getElementById('currency-dropdown-wrapper');
      const activeMenu = document.getElementById('currency-menu');
      const activeBtn = document.getElementById('currency-toggle-btn');
      const activeChevron = document.getElementById('currency-chevron') || activeBtn?.querySelector('svg');
      if (activeWrapper && !activeWrapper.contains(e.target) && activeMenu && !activeMenu.classList.contains('hidden')) {
        activeMenu.classList.add('hidden');
        if (activeBtn) activeBtn.setAttribute('aria-expanded', 'false');
        if (activeChevron) activeChevron.classList.remove('rotate-180');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeMenu = document.getElementById('currency-menu');
        const activeBtn = document.getElementById('currency-toggle-btn');
        const activeChevron = document.getElementById('currency-chevron') || activeBtn?.querySelector('svg');
        if (activeMenu && !activeMenu.classList.contains('hidden')) {
          activeMenu.classList.add('hidden');
          if (activeBtn) activeBtn.setAttribute('aria-expanded', 'false');
          if (activeChevron) activeChevron.classList.remove('rotate-180');
        }
      }
    });
  }
}
window.initModernCurrencyDropdown = initModernCurrencyDropdown;

function changeCurrency(newCurr) {
  if (!CURRENCIES[newCurr]) return;
  currentCurrency = newCurr;

  try {
    localStorage.setItem('starplus_pref_currency', newCurr);
  } catch (e) {}

  // Update modern currency dropdown UI
  updateModernCurrencyDropdownUI(newCurr);

  // Update currency select dropdowns
  document.querySelectorAll('.currency-selector').forEach(sel => {
    sel.value = newCurr;
  });

  // Re-render packages with updated currency
  renderPackages(getActiveFilteredPackages());

  // Update Visa section if rendered
  checkVisaRequirements();

  // Update all marked base and secondary price tags across DOM
  updateAllPriceDisplays();

  // Update Country Showcase if active
  if (typeof currentShowcaseCountryKey !== 'undefined' && currentShowcaseCountryKey && typeof updateShowcaseTourUI === 'function') {
    updateShowcaseTourUI(currentShowcaseTourIndex || 0, false);
  }

  // Update booking modal if active
  if (selectedPackageForBooking) {
    calculateBookingTotal();
  }

  showToast(`Currency updated to ${CURRENCIES[newCurr].name}`, 'success');
}

// Contact / Itinerary & Quote Form Submission ("Request a Free Travel Itinerary & Quote")
async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');

  const nameInput = form.querySelector('#contactName') || document.getElementById('contactName');
  const emailInput = form.querySelector('#contactEmail') || document.getElementById('contactEmail');
  const phoneInput = form.querySelector('#contactPhone') || document.getElementById('contactPhone');
  const destInput = form.querySelector('#contactDest') || document.getElementById('contactDest');
  const customField2 = form.querySelector('#contactCustomField2');
  const customField2Wrapper = form.querySelector('#quoteCustomField2Wrapper');
  const interestSelect = form.querySelector('#contactInterest') || form.querySelector('#contactTopic');
  const rawInterestValue = interestSelect?.value || 'package';
  const interest = interestSelect?.options?.[interestSelect.selectedIndex]?.text || rawInterestValue;

  const fullName = nameInput?.value?.trim() || '';
  const email = emailInput?.value?.trim() || '';
  const destination = destInput?.value?.trim() || '';

  // Determine Field 2 value based on dynamic mode
  let travelers = '';
  if (customField2Wrapper && !customField2Wrapper.classList.contains('hidden') && customField2) {
    travelers = customField2.value.trim();
  } else {
    const travelersSelect = form.querySelector('#contactTravelers');
    travelers = travelersSelect?.value || 'Couple / 2 Adults';
  }

  const notesInput = form.querySelector('#contactMessage') || document.getElementById('contactMessage');
  const notes = notesInput?.value?.trim() || '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidFields = [];

  // Required Field 1: Full Name
  if (!fullName) {
    checkFieldValidity(nameInput, false, "Please provide your full name", invalidFields);
  } else {
    clearFieldError(nameInput);
  }

  // Required Field 2: Email
  if (!email || !emailRegex.test(email)) {
    checkFieldValidity(emailInput, false, "Please enter a valid email address", invalidFields);
  } else {
    clearFieldError(emailInput);
  }

  // Required Field 3: Phone
  if (!validatePhoneField(phoneInput)) {
    if (phoneInput && !invalidFields.includes(phoneInput)) invalidFields.push(phoneInput);
  }

  // Dynamic field validation
  if (rawInterestValue === 'visa') {
    if (!destination) {
      checkFieldValidity(destInput, false, "Please specify your Target Country / Visa Type", invalidFields);
    } else {
      clearFieldError(destInput);
    }
    if (!travelers) {
      checkFieldValidity(customField2, false, "Please specify your Current Nationality", invalidFields);
    } else {
      clearFieldError(customField2);
    }
  } else if (rawInterestValue === 'flight') {
    if (!destination) {
      checkFieldValidity(destInput, false, "Please specify your Flight Route (From - To)", invalidFields);
    } else {
      clearFieldError(destInput);
    }
    if (!travelers) {
      checkFieldValidity(customField2, false, "Please specify Trip Type & Tentative Dates", invalidFields);
    } else {
      clearFieldError(customField2);
    }
  } else {
    if (destInput) clearFieldError(destInput);
    if (customField2) clearFieldError(customField2);
  }

  if (invalidFields.length > 0) {
    focusFirstInvalidField(invalidFields);
    return;
  }

  const phone = (phoneInput && phoneInput._iti) ? (phoneInput._iti.getNumber() || phoneInput.value.trim()) : (phoneInput?.value?.trim() || '');

  // Preserve original button UI and show loading state
  const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i><span>Sending...</span>';
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
  }

  const payload = {
    formType: "inquiry",
    fullName: fullName,
    email: email,
    phone: phone,
    interest: interest,
    destination: destination,
    travelers: travelers,
    notes: notes
  };

  try {
    await fetch(GOOGLE_APPS_SCRIPT_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // In no-cors mode, resolved promise signifies successful delivery
    form.reset();
    if (typeof updateQuoteFormFields === 'function') {
      updateQuoteFormFields();
    }
    showToast('Thank you! Your submission has been received.', 'success');
  } catch (err) {
    console.error('Google Apps Script inquiry submission error:', err);
    showToast('Network error while sending request. Please message us on WhatsApp.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
      submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  }
}

// DMC Trade License File Selection Helper (Strict 5MB direct email attachment limit)
function handleLicenseFileSelect(input) {
  const fileInfo = document.getElementById('partnerLicenseFileInfo');
  if (!input || !input.files || input.files.length === 0) {
    if (fileInfo) {
      fileInfo.textContent = '';
      fileInfo.classList.add('hidden');
    }
    return;
  }

  const file = input.files[0];
  const maxBytes = 5 * 1024 * 1024; // 5MB limit
  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
  const ext = file.name.split('.').pop().toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    showToast('⚠️ Unsupported file format. Please attach a PDF, JPG, or PNG document.', 'error');
    input.value = '';
    if (fileInfo) {
      fileInfo.textContent = '';
      fileInfo.classList.add('hidden');
    }
    return;
  }

  if (file.size > maxBytes) {
    showToast('⚠️ Document is too large! Maximum allowed file size is 5MB to ensure direct email delivery without server rejection.', 'error');
    input.value = '';
    if (fileInfo) {
      fileInfo.textContent = '';
      fileInfo.classList.add('hidden');
    }
    return;
  }

  const formattedSize = file.size > 1024 * 1024 
    ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
    : Math.round(file.size / 1024) + ' KB';

  if (fileInfo) {
    fileInfo.textContent = `✓ ${file.name} (${formattedSize}) - Ready for email`;
    fileInfo.classList.remove('hidden');
  }
}

// DMC / Ground Services Form Submission ("Register Your DMC / Ground Services")
async function handlePartnerSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');

  const companyInput = document.getElementById('partnerCompany');
  const destInput = document.getElementById('partnerDestination');
  const contactInput = document.getElementById('partnerContact');
  const emailInput = document.getElementById('partnerEmail');
  const partnerPhoneInput = document.getElementById('partnerPhone');
  const websiteInput = document.getElementById('partnerWebsite');

  const companyName = companyInput?.value?.trim() || '';
  const country = destInput?.value?.trim() || '';
  const contactPerson = contactInput?.value?.trim() || '';
  const corporateEmail = emailInput?.value?.trim() || '';
  const website = websiteInput?.value?.trim() || '';
  const socialProfile = document.getElementById('partnerSocial')?.value?.trim() || '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const invalidFields = [];

  if (!companyName) {
    checkFieldValidity(companyInput, false, "Please provide your company or agency name", invalidFields);
  } else {
    clearFieldError(companyInput);
  }

  if (!country) {
    checkFieldValidity(destInput, false, "Please provide your operational country / destination", invalidFields);
  } else {
    clearFieldError(destInput);
  }

  if (!contactPerson) {
    checkFieldValidity(contactInput, false, "Please provide your full name", invalidFields);
  } else {
    clearFieldError(contactInput);
  }

  if (!corporateEmail || !emailRegex.test(corporateEmail)) {
    checkFieldValidity(emailInput, false, "Please enter a valid corporate email address", invalidFields);
  } else {
    clearFieldError(emailInput);
  }

  if (!validatePhoneField(partnerPhoneInput)) {
    if (partnerPhoneInput && !invalidFields.includes(partnerPhoneInput)) invalidFields.push(partnerPhoneInput);
  }

  if (!website) {
    checkFieldValidity(websiteInput, false, "Please provide your company website or official profile", invalidFields);
  } else {
    clearFieldError(websiteInput);
  }

  const certifyCheckbox = document.getElementById('dmc-certify-checkbox') || document.getElementById('partnerConsent');
  const checkboxError = document.getElementById('dmc-checkbox-error');
  if (certifyCheckbox && !certifyCheckbox.checked) {
    if (checkboxError) checkboxError.classList.remove('hidden');
    certifyCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    certifyCheckbox.focus();
    certifyCheckbox.classList.add('ring-2', 'ring-rose-500');
    showToast('⚠️ Please certify and check this box before submitting your application.', 'error');
    invalidFields.push(certifyCheckbox);
  } else {
    if (checkboxError) checkboxError.classList.add('hidden');
    if (certifyCheckbox) certifyCheckbox.classList.remove('ring-2', 'ring-rose-500');
  }

  if (certifyCheckbox && !certifyCheckbox.dataset.listenerBound) {
    certifyCheckbox.dataset.listenerBound = 'true';
    certifyCheckbox.addEventListener('change', () => {
      if (certifyCheckbox.checked && checkboxError) {
        checkboxError.classList.add('hidden');
        certifyCheckbox.classList.remove('ring-2', 'ring-rose-500');
      }
    });
  }

  if (invalidFields.length > 0) {
    focusFirstInvalidField(invalidFields);
    return;
  }

  const corporatePhone = (partnerPhoneInput && partnerPhoneInput._iti) ? (partnerPhoneInput._iti.getNumber() || partnerPhoneInput.value.trim()) : (partnerPhoneInput?.value?.trim() || '');

  const licenseNumber = document.getElementById('partnerLicense')?.value?.trim() || '';
  const licenseFileInput = document.getElementById('partnerLicenseFile');
  const licenseFile = licenseFileInput && licenseFileInput.files && licenseFileInput.files[0] ? licenseFileInput.files[0] : null;

  const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i><span>Sending...</span>';
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
  }

  let fileData = null;
  let fileName = null;
  let fileType = null;

  if (licenseFile) {
    try {
      fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(licenseFile);
      });
      fileName = licenseFile.name;
      fileType = licenseFile.type || 'application/pdf';
    } catch (readErr) {
      console.warn('Could not encode license file:', readErr);
    }
  }

  const payload = {
    formType: "dmc",
    companyName: companyName,
    country: country,
    contactPerson: contactPerson,
    corporateEmail: corporateEmail,
    corporatePhone: corporatePhone,
    website: website,
    socialProfile: socialProfile,
    licenseNumber: licenseNumber,
    fileData: fileData,
    fileName: fileName,
    fileType: fileType
  };

  try {
    await fetch(GOOGLE_APPS_SCRIPT_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    form.reset();
    const fileInfo = document.getElementById('partnerLicenseFileInfo');
    if (fileInfo) {
      fileInfo.textContent = '';
      fileInfo.classList.add('hidden');
    }
    showToast('Thank you! Your submission has been received.', 'success');
  } catch (err) {
    console.error('Google Apps Script DMC submission error:', err);
    showToast('Network error while submitting DMC registration. Please try again.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
      submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  }
}

// Helper: Open Mail Client with Full DMC Details for Direct Email Attachment
function sendDirectDmcEmail(e) {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }

  const certifyCheckbox = document.getElementById('dmc-certify-checkbox') || document.getElementById('partnerConsent');
  const checkboxError = document.getElementById('dmc-checkbox-error');

  // 1. Verify checkbox is certified
  if (certifyCheckbox && !certifyCheckbox.checked) {
    alert('Please check the certification box before sending your application.');
    if (checkboxError) {
      checkboxError.classList.remove('hidden');
    }
    certifyCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    certifyCheckbox.focus();
    certifyCheckbox.classList.add('ring-2', 'ring-rose-500');
    if (typeof showToast === 'function') {
      showToast('⚠️ Please certify and check this box before submitting your application.', 'error');
    }
    return;
  } else {
    if (checkboxError) {
      checkboxError.classList.add('hidden');
    }
    if (certifyCheckbox) {
      certifyCheckbox.classList.remove('ring-2', 'ring-rose-500');
    }
  }

  // 2. Extract values from form inputs
  const companyInputVal = document.querySelector('[name="company_name"]')?.value || document.getElementById('partnerCompany')?.value?.trim();
  const companyName = companyInputVal || 'N/A';
  const compLabel = companyInputVal || '[Company Name]';
  const contactPerson = document.querySelector('[name="contact_person"]')?.value || document.getElementById('partnerContact')?.value?.trim() || 'N/A';
  const email = document.querySelector('[name="email"]')?.value || document.getElementById('partnerEmail')?.value?.trim() || 'N/A';
  const partnerPhoneInput = document.querySelector('[name="phone"]') || document.getElementById('partnerPhone');
  const phone = (partnerPhoneInput && partnerPhoneInput._iti) ? (partnerPhoneInput._iti.getNumber() || partnerPhoneInput.value.trim()) : (partnerPhoneInput?.value?.trim() || 'N/A');
  const country = document.querySelector('[name="country"]')?.value || document.getElementById('partnerDestination')?.value?.trim() || 'N/A';
  const message = document.querySelector('[name="notes"]')?.value || document.getElementById('partnerProposal')?.value?.trim() || document.querySelector('textarea')?.value || 'None';

  const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
    .map(cb => cb.closest('label')?.textContent?.trim() || cb.value)
    .filter(Boolean)
    .join(', ');

  // 3. Construct email parameters
  const recipient = 'info@starplustraveluae.com';
  const subject = encodeURIComponent(`DMC Partnership Application - ${compLabel}`);
  
  const bodyContent = 
`Dear Star Plus Travels Team,

Please review our DMC Partner application details below:

• Company Name: ${companyName}
• Contact Person: ${contactPerson}
• Email: ${email}
• Phone: ${phone}
• Country/Region: ${country}
${selectedServices ? `• Selected Services: ${selectedServices}\n` : ''}
Fleet/Services notes:
${message}

Certification Confirmation:
I certify that our organization is a legally registered travel company in good standing, holds all necessary operational licenses and insurances, and consents to Star Plus Travels verifying our credentials for B2B contracting.`;

  const body = encodeURIComponent(bodyContent);

  // 4. Trigger mailto URL
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
}

// Newsletter Subscription ("VIP Travel Deals" in Footer)
async function handleNewsletter(e) {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }

  const form = (e && e.target && (e.target.tagName === 'FORM' ? e.target : e.target.closest('form')))
    || document.querySelector('form[onsubmit*="handleNewsletter"]')
    || document.getElementById('newsletterEmail')?.closest('form');

  const emailInput = form?.querySelector('#newsletterEmail')
    || form?.querySelector('input[type="email"]')
    || document.getElementById('newsletterEmail');

  const submitBtn = form?.querySelector('button[type="submit"]')
    || form?.querySelector('button');

  const email = emailInput?.value?.trim() || '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate that the email field is not empty and has a valid structure
  if (!email || !emailRegex.test(email)) {
    if (emailInput) {
      showFieldError(emailInput, "Please enter a valid email address");
      focusFirstInvalidField([emailInput]);
    } else if (typeof showToast === 'function') {
      showToast('Please enter a valid email address.', 'error');
    }
    return;
  }
  if (emailInput) {
    clearFieldError(emailInput);
  }

  // Change button text to "Subscribing..." and disable it temporarily to prevent duplicate clicks
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
  }

  const endpoint = typeof GOOGLE_APPS_SCRIPT_ENDPOINT !== 'undefined'
    ? GOOGLE_APPS_SCRIPT_ENDPOINT
    : 'https://script.google.com/macros/s/AKfycbz7vtBsDq--xmYbATR1Zszv2aO-aZeIIeJRvrj4OJgpYhPu9ZJjRTWDPu88y5_sW0DN/exec';

  const payload = {
    formType: "newsletter",
    email: email,
    source: "Website Footer"
  };

  try {
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    // Reset the input field
    if (emailInput) {
      emailInput.value = '';
    }

    // Display inline confirmation note below the button
    let feedback = form?.querySelector('.newsletter-feedback');
    if (!feedback && form) {
      feedback = document.createElement('p');
      feedback.className = 'newsletter-feedback text-[11px] text-emerald-400 font-medium mt-2 leading-snug transition-all';
      form.appendChild(feedback);
    }
    if (feedback) {
      feedback.textContent = "🎉 Thank you! You've subscribed to Star Plus VIP Deals.";
      feedback.classList.remove('hidden');
      feedback.style.display = 'block';
    }

    if (typeof showToast === 'function') {
      showToast("🎉 Thank you! You've subscribed to Star Plus VIP Deals.", 'success');
    }
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    if (emailInput) {
      emailInput.value = '';
    }
    let feedback = form?.querySelector('.newsletter-feedback');
    if (!feedback && form) {
      feedback = document.createElement('p');
      feedback.className = 'newsletter-feedback text-[11px] text-emerald-400 font-medium mt-2 leading-snug transition-all';
      form.appendChild(feedback);
    }
    if (feedback) {
      feedback.textContent = "🎉 Thank you! You've subscribed to Star Plus VIP Deals.";
      feedback.classList.remove('hidden');
      feedback.style.display = 'block';
    }
  } finally {
    // Restore the button text to "SUBSCRIBE" and re-enable it after 3 seconds
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'SUBSCRIBE';
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
      }
    }, 3000);
  }
}
window.handleNewsletter = handleNewsletter;

// FAQ Accordion Toggle
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const icon = btn.querySelector('.faq-icon');

  if (answer.classList.contains('hidden')) {
    answer.classList.remove('hidden');
    icon.classList.add('rotate-180');
  } else {
    answer.classList.add('hidden');
    icon.classList.remove('rotate-180');
  }
}

// Mobile Menu Toggle & Backdrop Helpers
let _mobileMenuDebounce = 0;

function getOrCreateMobileMenuBackdrop() {
  let backdrop = document.getElementById('mobileMenuBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'mobileMenuBackdrop';
    backdrop.className = 'fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 hidden lg:hidden transition-opacity duration-300';
    backdrop.setAttribute('aria-hidden', 'true');
    const header = document.getElementById('mainHeader') || document.querySelector('header');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(backdrop, header);
    } else {
      document.body.appendChild(backdrop);
    }
  }
  return backdrop;
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.classList.add('hidden');
  }

  const btn = document.getElementById('mobileMenuBtn');
  if (btn) {
    btn.setAttribute('aria-expanded', 'false');
    const icon = btn.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-bars-staggered text-sm';
  }

  const backdrop = document.getElementById('mobileMenuBackdrop');
  if (backdrop) {
    backdrop.classList.add('hidden');
  }
  document.body.style.overflow = '';

  const header = document.getElementById('mainHeader') || document.querySelector('header');
  if (header) {
    header.classList.remove('menu-open');
    if (typeof updateBrandLogoTheme === 'function') {
      updateBrandLogoTheme();
    }
  }
}
window.closeMobileMenu = closeMobileMenu;

function toggleMobileMenu(e) {
  if (e) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.target && e.target.tagName !== 'A' && e.preventDefault) {
      e.preventDefault();
    }
  }

  const now = Date.now();
  if (now - _mobileMenuDebounce < 160) return; // Debounce rapid multi-triggers
  _mobileMenuDebounce = now;

  const menu = document.getElementById('mobileMenu');
  if (!menu) return;

  const willBeOpen = menu.classList.contains('hidden');
  if (willBeOpen) {
    menu.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
  }

  const btn = document.getElementById('mobileMenuBtn');
  if (btn) {
    btn.setAttribute('aria-expanded', willBeOpen ? 'true' : 'false');
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = willBeOpen ? 'fa-solid fa-xmark text-sm' : 'fa-solid fa-bars-staggered text-sm';
    }
  }

  const backdrop = getOrCreateMobileMenuBackdrop();
  if (backdrop) {
    if (willBeOpen) {
      backdrop.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    } else {
      backdrop.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  const header = document.getElementById('mainHeader') || document.querySelector('header');
  if (header) {
    if (willBeOpen) {
      header.classList.add('menu-open');
    } else {
      header.classList.remove('menu-open');
    }
    if (typeof updateBrandLogoTheme === 'function') {
      updateBrandLogoTheme();
    }
  }
}
window.toggleMobileMenu = toggleMobileMenu;

function openMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu || !menu.classList.contains('hidden')) return;
  toggleMobileMenu();
}
window.openMobileMenu = openMobileMenu;

// ==========================================================================
// Theme Management (System Preferences Live Auto-Sync with Tri-State Toggle)
// Modes: 'system' (default live sync), 'light' (manual), 'dark' (manual)
// ==========================================================================
function isSystemDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getThemeMode() {
  try {
    const mode = localStorage.getItem('starplus_theme_mode');
    if (mode === 'light' || mode === 'dark' || mode === 'system') {
      return mode;
    }
  } catch (e) {}
  return 'system';
}

function getEffectiveTheme(mode = getThemeMode()) {
  if (mode === 'dark') return 'dark';
  if (mode === 'light') return 'light';
  return isSystemDarkMode() ? 'dark' : 'light';
}

function applyTheme(mode = getThemeMode(), save = false) {
  const root = document.documentElement;
  const effectiveTheme = getEffectiveTheme(mode);
  const isDark = effectiveTheme === 'dark';

  if (isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }

  if (save) {
    try {
      if (mode === 'system') {
        localStorage.setItem('starplus_theme_mode', 'system');
      } else {
        localStorage.setItem('starplus_theme_mode', mode);
      }
      // Purge legacy flat keys
      localStorage.removeItem('starplus_theme');
      localStorage.removeItem('starplus_manual_theme_set');
    } catch (e) {}
  }

  // Update theme toggle icons and tooltips
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    if (mode === 'system') {
      btn.setAttribute('title', `Theme: System Auto (${isDark ? 'Dark' : 'Light'}) • Click to toggle`);
    } else if (mode === 'dark') {
      btn.setAttribute('title', 'Theme: Dark (Manual) • Click to cycle to Light');
    } else {
      btn.setAttribute('title', 'Theme: Light (Manual) • Click to cycle to Auto');
    }
  });

  document.querySelectorAll('.theme-toggle-icon').forEach(icon => {
    if (mode === 'system') {
      icon.className = isDark 
        ? 'fa-solid fa-circle-half-stroke text-amber-400 theme-toggle-icon transition-transform' 
        : 'fa-solid fa-circle-half-stroke text-slate-700 theme-toggle-icon transition-transform';
    } else if (mode === 'dark') {
      icon.className = 'fa-solid fa-moon text-amber-400 theme-toggle-icon transition-transform';
    } else {
      icon.className = 'fa-solid fa-sun text-amber-500 theme-toggle-icon transition-transform';
    }
  });

  // Update theme toggle text labels in top bar & mobile menu
  document.querySelectorAll('.theme-toggle-label').forEach(label => {
    if (mode === 'system') {
      label.textContent = `Auto (${isDark ? 'Dark' : 'Light'})`;
    } else if (mode === 'dark') {
      label.textContent = 'Dark';
    } else {
      label.textContent = 'Light';
    }
  });

  // Update brand logos and images between white text (dark mode) and dark text (light mode)
  updateBrandLogoTheme();

  // Update preloader background if still present (strictly site dark navy #070b14)
  const preloader = document.getElementById('starplus-preloader') || document.getElementById('sitePreloader');
  if (preloader) {
    preloader.style.backgroundColor = '#070b14';
  }

  // Notify seasonal particle engine if present
  if (window.StarPlusSeason && typeof window.StarPlusSeason.refresh === 'function') {
    window.StarPlusSeason.refresh();
  }
}

function toggleTheme() {
  const currentMode = getThemeMode(); // 'system', 'light', 'dark'
  const sysDark = isSystemDarkMode();
  let nextMode;

  if (currentMode === 'system') {
    nextMode = sysDark ? 'light' : 'dark';
  } else if (currentMode === 'light') {
    nextMode = 'dark';
  } else if (currentMode === 'dark') {
    nextMode = 'system';
  } else {
    nextMode = 'system';
  }

  applyTheme(nextMode, true);

  if (nextMode === 'system') {
    showToast(`💻 Synced with device system settings (${sysDark ? 'Dark' : 'Light'} Mode)`, 'success');
  } else if (nextMode === 'dark') {
    showToast(`🌙 Switched to Dark mode (Manual)`, 'success');
  } else {
    showToast(`☀️ Switched to Light mode (Manual)`, 'success');
  }
}

function updateBrandLogoTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  const header = document.getElementById('mainHeader') || document.querySelector('header');
  const hasHero = !!document.getElementById('hero');
  const isOverHeroUnscrolled = hasHero && header && !header.classList.contains('header-scrolled');

  document.querySelectorAll('img[data-dark-src]').forEach(img => {
    const darkSrc = img.getAttribute('data-dark-src');
    const lightSrc = img.getAttribute('data-light-src');
    if (!darkSrc || !lightSrc) return;

    // Footer is permanently midnight dark (#050b12 / #020617 / bg-slate-950) across all pages
    if (img.id === 'brandFooterLogo' || img.classList.contains('footer-brand-logo') || img.closest('footer')) {
      img.src = darkSrc;
      return;
    }

    // Preloader background is strictly site dark navy (#070b14 / #0B132B) across both themes
    if (img.id === 'preloaderLogoImg' || img.classList.contains('preloader-brand-logo') || img.closest('#sitePreloader')) {
      img.src = darkSrc || img.src;
      return;
    }

    // Mobile menu drawer (light in light mode, dark in dark mode)
    if (img.classList.contains('mobile-brand-logo') || img.closest('#mobileMenu')) {
      img.src = isDark ? darkSrc : lightSrc;
      return;
    }

    // Over dark hero section before scrolling, always display darkSrc (crisp white subtitle) even in light mode
    if (isOverHeroUnscrolled && (img.id === 'brandHeaderLogo' || img.classList.contains('header-brand-logo'))) {
      img.src = darkSrc;
    } else {
      img.src = isDark ? darkSrc : lightSrc;
    }
  });
}
window.updateBrandLogoTheme = updateBrandLogoTheme;

// Live Real-Time OS System Color Scheme Listener (Auto-syncs live when in System mode)
(function setupSystemThemeWatcher() {
  if (!window.matchMedia) return;

  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = () => {
    const currentMode = getThemeMode();
    if (currentMode === 'system') {
      applyTheme('system', false);
    }
  };

  if (darkModeQuery.addEventListener) {
    darkModeQuery.addEventListener('change', handleSystemThemeChange);
  } else if (darkModeQuery.addListener) {
    darkModeQuery.addListener(handleSystemThemeChange);
  }
})();

// ==========================================================================
// Language / Localization Controller (English & Sinhala)
// ==========================================================================
function getPreferredLanguage() {
  try {
    const stored = localStorage.getItem('site_lang') || localStorage.getItem('pref_lang') || localStorage.getItem('starplus_lang');
    if (stored === 'si' || stored === 'en') {
      return stored;
    }
  } catch (e) {}
  return 'en';
}

function translateReviewsPage(lang) {
  const isSi = (lang === 'si');
  const reviewCards = document.querySelectorAll('.review-card');
  if (!reviewCards || reviewCards.length === 0) return;

  reviewCards.forEach((card, index) => {
    const idxAttr = card.getAttribute('data-review-index');
    const idx = (idxAttr !== null && idxAttr !== '') ? parseInt(idxAttr, 10) : index;
    const item = (typeof REVIEWS_DATA_I18N !== 'undefined' && REVIEWS_DATA_I18N[idx]) ? REVIEWS_DATA_I18N[idx] : null;
    if (!item) return;

    // 1. Author title
    const authorEl = card.querySelector('h3');
    if (authorEl) {
      authorEl.textContent = isSi ? item.authorSi : item.authorEn;
    }

    // 2. Verified Client / Traveler badge
    const verifiedEl = card.querySelector('.fa-circle-check')?.parentElement;
    if (verifiedEl) {
      verifiedEl.innerHTML = `<i class="fa-solid fa-circle-check text-[9px]"></i> ${isSi ? 'තහවුරු කළ සංචාරකයා' : 'Verified Client'}`;
    }

    // 3. Google Verified Review tooltip & label
    const googleTooltipEl = card.querySelector('[title*="Google"]');
    if (googleTooltipEl) {
      googleTooltipEl.setAttribute('title', isSi ? 'Google මගින් තහවුරු කළ ඇගයීමක්' : 'Google Verified Review');
      const googleSpan = googleTooltipEl.querySelector('span');
      if (googleSpan) {
        googleSpan.textContent = isSi ? 'Google තහවුරු කළ ඇගයීමක්' : 'Google Verified Review';
      }
    }

    // 4. Service Tag
    const serviceTagEl = card.querySelector('.service-tag, .pb-3\\.5 > span, span.inline-flex.items-center.gap-1\\.5');
    if (serviceTagEl) {
      const icon = serviceTagEl.querySelector('i');
      const iconHtml = icon ? icon.outerHTML + ' ' : '';
      serviceTagEl.innerHTML = `${iconHtml}${isSi ? item.serviceSi : item.serviceEn}`;
    }

    // 5. Testimonial quote text
    const quoteEl = card.querySelector('.quote-text, p.text-slate-200, p.text-slate-300');
    if (quoteEl) {
      quoteEl.textContent = isSi ? item.commentSi : item.commentEn;
    }

    // 6. Travelled date
    const calIcon = card.querySelector('.fa-calendar');
    const dateSpan = calIcon ? (calIcon.parentElement.querySelector('.review-date') || calIcon.parentElement.querySelector('span')) : null;
    if (dateSpan) {
      dateSpan.textContent = isSi ? item.dateSi : item.dateEn;
    }

    // 7. Branch / Desk location
    const locIcon = card.querySelector('.fa-location-dot');
    const branchSpan = locIcon ? (locIcon.parentElement.querySelector('.review-branch') || locIcon.parentElement.querySelector('span:last-child')) : null;
    if (branchSpan) {
      branchSpan.textContent = isSi ? item.branchSi : item.branchEn;
    }
  });

  // Filter chips text
  const filterMappings = {
    'all': { en: 'All Reviews', si: 'සියලුම ඇගයීම්' },
    'holiday': { en: 'Holiday Packages', si: 'නිවාඩු පැකේජ' },
    'visa': { en: 'UAE Visas', si: 'එක්සත් අරාබි එමීර් වීසා' },
    'corporate': { en: 'Corporate & MICE', si: 'ආයතනික සහ MICE' },
    'flights-hotels': { en: 'Flights & Hotels', si: 'ගුවන් සහ හෝටල්' }
  };

  document.querySelectorAll('.review-filter-btn').forEach(btn => {
    const filter = btn.getAttribute('data-filter');
    if (filter && filterMappings[filter]) {
      btn.textContent = isSi ? filterMappings[filter].si : filterMappings[filter].en;
    }
  });

  // Booked service label prefix across review cards if any
  document.querySelectorAll('.review-booked-prefix, [data-i18n-booked]').forEach(el => {
    el.textContent = isSi ? 'වෙන්කළ සේවාව: ' : 'Booked: ';
  });
}

function translateFormElements(lang) {
  const isSi = (lang === 'si');
  const t = I18N_TRANSLATIONS[lang] || I18N_TRANSLATIONS.en;

  // 1. Inputs with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) {
      el.placeholder = t[key];
    }
  });

  // 2. Standard input placeholders by type/id if no specific key
  document.querySelectorAll('input[type="email"], #newsletterEmail, #contactEmail, #bookingEmail, #applicantEmail, #partnerEmail').forEach(el => {
    if (!el.getAttribute('data-i18n-placeholder')) {
      el.placeholder = isSi ? 'ඔබගේ විද්‍යුත් තැපෑල ඇතුළත් කරන්න' : 'Enter your email';
    }
  });

  document.querySelectorAll('#contactName, #bookingName, #applicantName, #partnerName, input[name="name"]').forEach(el => {
    if (!el.getAttribute('data-i18n-placeholder')) {
      el.placeholder = isSi ? 'ඔබගේ සම්පූර්ණ නම' : 'Your Full Name';
    }
  });

  document.querySelectorAll('#contactPhone, #bookingPhone, #applicantPhone, #partnerPhone, input[type="tel"]').forEach(el => {
    if (!el.getAttribute('data-i18n-placeholder')) {
      el.placeholder = isSi ? 'දුරකථන / WhatsApp අංකය' : 'Phone / WhatsApp Number';
    }
  });

  document.querySelectorAll('#contactMessage, #bookingNotes, #applicantCover, #partnerMessage, textarea[name="notes"], textarea[name="message"]').forEach(el => {
    if (!el.getAttribute('data-i18n-placeholder')) {
      el.placeholder = isSi ? 'සංචාරක සටහන් / විශේෂ ඉල්ලීම්' : 'Trip Notes / Special Requests';
    }
  });

  // 3. Form select dropdowns and options
  // #bookingTravelers
  document.querySelectorAll('#bookingTravelers').forEach(sel => {
    const travelerMap = isSi ? {
      '1': 'වැඩිහිටි 1',
      '2': 'වැඩිහිටියන් 2',
      '3': 'වැඩිහිටියන් 3',
      '4': 'වැඩිහිටියන් 4',
      '5': 'වැඩිහිටියන් 5+'
    } : {
      '1': '1 Adult',
      '2': '2 Adults',
      '3': '3 Adults',
      '4': '4 Adults',
      '5': '5+ Adults'
    };
    Array.from(sel.options).forEach(opt => {
      if (travelerMap[opt.value]) {
        opt.textContent = travelerMap[opt.value];
      }
    });
  });

  // #bookingChildren
  document.querySelectorAll('#bookingChildren').forEach(sel => {
    const childrenMap = isSi ? {
      '0': 'ළමුන් 0',
      '1': 'ළමුන් 1 (-35%)',
      '2': 'ළමුන් 2',
      '3': 'ළමුන් 3'
    } : {
      '0': '0 Children',
      '1': '1 Child (-35%)',
      '2': '2 Children',
      '3': '3 Children'
    };
    Array.from(sel.options).forEach(opt => {
      if (childrenMap[opt.value]) {
        opt.textContent = childrenMap[opt.value];
      }
    });
  });

  // #visaSelect
  document.querySelectorAll('#visaSelect').forEach(sel => {
    const visaMap = isSi ? {
      'uae': 'එක්සත් අරාබි එමීර් සංචාරක සහ නිදහස් වීසා (දින 30 / 60)',
      'oman': 'ඕමාන් සංචාරක වීසා සහ දේශසීමා පිටවීමේ රැඳී සිටීම්',
      'schengen': 'ෂෙන්ගන් වීසා උපදේශනය සහ කඩිනම් හමුවීම්',
      'srilanka': 'ශ්‍රී ලංකා ETA / සංචාරක සහ ව්‍යාපාරික වීසා',
      'azerbaijan': 'අසර්බයිජාන් ASAN වීසා (කඩිනම් අනුමැතිය)'
    } : {
      'uae': 'UAE Tourist & Freelance Visa (30 / 60 Days)',
      'oman': 'Oman Tourist Visa & Border Exit Stays',
      'schengen': 'Schengen Visa Consultation & Express Appointment',
      'srilanka': 'Sri Lanka ETA / Tourist & Business Visa',
      'azerbaijan': 'Azerbaijan ASAN Visa (Fast Approval)'
    };
    Array.from(sel.options).forEach(opt => {
      if (visaMap[opt.value]) {
        opt.textContent = visaMap[opt.value];
      }
    });
  });

  // #applicantExp
  document.querySelectorAll('#applicantExp').forEach(sel => {
    const expMap = isSi ? {
      'entry': 'ආරම්භක මට්ටම (වසර 1ට අඩු)',
      '1-3': 'වසර 1 - 3',
      '3-5': 'වසර 3 - 5',
      '5+': 'වසර 5+ (ජ්‍යෙෂ්ඨ / ප්‍රධාන)'
    } : {
      'entry': 'Entry Level (< 1 year)',
      '1-3': '1 - 3 years',
      '3-5': '3 - 5 years',
      '5+': '5+ years (Senior / Lead)'
    };
    Array.from(sel.options).forEach(opt => {
      if (expMap[opt.value]) {
        opt.textContent = expMap[opt.value];
      }
    });
  });

  // #applicantBranch
  document.querySelectorAll('#applicantBranch').forEach(sel => {
    const branchMap = isSi ? {
      'uae': '🇦🇪 එක්සත් අරාබි එමීර් රාජ්‍ය ශාඛාව (info@starplustraveluae.com)',
      'sl': '🇱🇰 ශ්‍රී ලංකා ශාඛාව (info@starplustravelsl.com)'
    } : {
      'uae': '🇦🇪 UAE Branch (info@starplustraveluae.com)',
      'sl': '🇱🇰 Sri Lanka Branch (info@starplustravelsl.com)'
    };
    Array.from(sel.options).forEach(opt => {
      if (branchMap[opt.value]) {
        opt.textContent = branchMap[opt.value];
      }
    });
  });

  // #partnerDestination
  document.querySelectorAll('#partnerDestination').forEach(sel => {
    const destMap = isSi ? {
      '': 'ප්‍රධාන ගමනාන්තය තෝරන්න',
      'Singapore': 'සිංගප්පූරුව (Singapore)',
      'Malaysia': 'මැලේසියාව (Malaysia)',
      'Turkey': 'තුර්කිය (Turkey)',
      'Vietnam': 'වියට්නාමය (Vietnam)',
      'Bali (Indonesia)': 'බාලි (ඉන්දුනීසියාව)',
      'Maldives': 'මාලදිවයින (Maldives)',
      'Armenia': 'ආර්මේනියාව (Armenia)',
      'Kazakhstan': 'කසකස්තානය (Kazakhstan)',
      'Kyrgyzstan': 'කිර්ගිස්තානය (Kyrgyzstan)',
      'Japan': 'ජපානය (Japan)',
      'Mauritius': 'මොරිෂස් (Mauritius)',
      'Kenya': 'කෙන්යාව (Kenya)',
      'Other Global Market': 'වෙනත් ගෝලීය වෙළඳපලක්'
    } : {
      '': 'Select Primary Destination',
      'Singapore': 'Singapore',
      'Malaysia': 'Malaysia',
      'Turkey': 'Turkey',
      'Vietnam': 'Vietnam',
      'Bali (Indonesia)': 'Bali (Indonesia)',
      'Maldives': 'Maldives',
      'Armenia': 'Armenia',
      'Kazakhstan': 'Kazakhstan',
      'Kyrgyzstan': 'Kyrgyzstan',
      'Japan': 'Japan',
      'Mauritius': 'Mauritius',
      'Kenya': 'Kenya',
      'Other Global Market': 'Other Global Market'
    };
    Array.from(sel.options).forEach(opt => {
      if (destMap[opt.value] !== undefined) {
        opt.textContent = destMap[opt.value];
      }
    });
  });

  // 4. Modal uppercase form field labels
  document.querySelectorAll('[data-i18n="adult_travelers"]').forEach(l => {
    l.textContent = isSi ? 'වැඩිහිටි සංචාරකයින් (වයස 12+)' : 'ADULT TRAVELERS (12+ YRS)';
  });
  document.querySelectorAll('[data-i18n="children_travelers"]').forEach(l => {
    l.textContent = isSi ? 'ළමුන් (වයස 2-11)' : 'CHILDREN (2-11 YRS)';
  });
  document.querySelectorAll('[data-i18n="dep_date"]').forEach(l => {
    l.textContent = isSi ? 'කැමති පිටත්වීමේ දිනය' : 'PREFERRED DEPARTURE DATE';
  });
  document.querySelectorAll('[data-i18n="special_notes"]').forEach(l => {
    l.textContent = isSi ? 'විශේෂ සටහන් / විමසීම්' : 'SPECIAL NOTES / INQUIRIES';
  });

  // 5. Form action & submit buttons
  // Newsletter submit
  document.querySelectorAll('footer form button[type="submit"], form[onsubmit*="handleNewsletter"] button[type="submit"]').forEach(btn => {
    btn.textContent = isSi ? 'ලියාපදිංචි වන්න' : 'SUBSCRIBE';
  });

  // Application confirmation button
  document.querySelectorAll('#submitAppBtn, button.confirm-app-btn, [data-i18n="btnConfirmAppRequest"]').forEach(btn => {
    btn.textContent = isSi ? 'අයදුම්පත තහවුරු කරන්න' : 'CONFIRM APPLICATION REQUEST';
  });

  // Booking submit button
  const bookingSubmit = document.querySelector('#bookingModal form button[type="submit"], #bookingSubmitBtn');
  if (bookingSubmit) {
    bookingSubmit.textContent = isSi ? 'වෙන්කිරීම තහවුරු කරන්න' : 'Confirm Booking Request';
  }

  // Inquire via WhatsApp buttons
  document.querySelectorAll('.btn-whatsapp-inquire, [data-i18n="btnInquireWhatsApp"]').forEach(btn => {
    const icon = btn.querySelector('i');
    const iconHtml = icon ? icon.outerHTML + ' ' : '';
    btn.innerHTML = `${iconHtml}${isSi ? 'WhatsApp මගින් විමසන්න' : 'Inquire via WhatsApp'}`;
  });

  // DMC buttons
  const dmcSubmit = document.querySelector('#dmc-application-form button[type="submit"], [data-i18n="dmc_submit_btn"]');
  if (dmcSubmit) {
    const textSpan = dmcSubmit.querySelector('span[data-i18n="dmc_submit_btn"]') || dmcSubmit.querySelector('span');
    if (textSpan) {
      textSpan.textContent = isSi ? 'DMC අයදුම්පත යොමු කරන්න' : 'SUBMIT DMC APPLICATION';
    } else {
      dmcSubmit.textContent = isSi ? 'DMC අයදුම්පත යොමු කරන්න' : 'SUBMIT DMC APPLICATION';
    }
  }
  const dmcEmailBtn = document.getElementById('btn-dmc-email-client');
  if (dmcEmailBtn) {
    const textSpan = dmcEmailBtn.querySelector('span[data-i18n="dmc_email_client_btn"]') || dmcEmailBtn.querySelector('span');
    if (textSpan) {
      textSpan.textContent = isSi ? 'ඊමේල් මෘදුකාංගය හරහා යවන්න' : 'SEND VIA EMAIL CLIENT';
    } else {
      dmcEmailBtn.textContent = isSi ? 'ඊමේල් මෘදුකාංගය හරහා යවන්න' : 'SEND VIA EMAIL CLIENT';
    }
  }

  // Career application submit button
  const careerSubmitBtn = document.getElementById('submitApplicationBtn');
  if (careerSubmitBtn) {
    careerSubmitBtn.textContent = isSi ? 'අයදුම්පත යොමු කරන්න' : 'Submit Application';
  }

  // Labels for forms
  document.querySelectorAll('label[for="contactName"], label[for="bookingName"]').forEach(l => {
    l.textContent = isSi ? 'ඔබගේ සම්පූර්ණ නම *' : 'Your Full Name *';
  });
  document.querySelectorAll('label[for="contactEmail"], label[for="bookingEmail"]').forEach(l => {
    l.textContent = isSi ? 'විද්‍යුත් තැපෑල *' : 'Your Email Address *';
  });
  document.querySelectorAll('label[for="contactPhone"], label[for="bookingPhone"]').forEach(l => {
    l.textContent = isSi ? 'දුරකථන / WhatsApp අංකය *' : 'Phone / WhatsApp Number *';
  });

  // Re-run checkVisaRequirements if visa result card exists on the page
  const visaResultCard = document.getElementById('visaResultCard');
  if (visaResultCard && visaResultCard.children.length > 0 && typeof checkVisaRequirements === 'function') {
    checkVisaRequirements();
  }
}

function updateOpenModalsLanguage(lang) {
  const isSi = (lang === 'si');

  // 1. Booking / Quote Modal
  const bookingModal = document.getElementById('bookingModal') || document.getElementById('quoteModal');
  if (bookingModal && !bookingModal.classList.contains('hidden')) {
    if (typeof selectedPackageForBooking !== 'undefined' && selectedPackageForBooking) {
      const pkg = selectedPackageForBooking;
      const pI18n = (isSi && typeof PACKAGES_I18N !== 'undefined' && PACKAGES_I18N[pkg.id]) ? PACKAGES_I18N[pkg.id] : null;
      const title = pI18n ? pI18n.title : pkg.title;
      const destination = pI18n ? pI18n.destination : pkg.destination;
      const duration = pI18n ? pI18n.duration : pkg.duration;
      
      const titleEl = document.getElementById('modalPkgTitle');
      if (titleEl) titleEl.textContent = title;
      const destEl = document.getElementById('modalPkgDestination');
      if (destEl) destEl.innerHTML = `${pkg.flag || '✈️'} <span class="font-semibold">${destination}</span> &bull; <span>${duration}</span>`;
      if (typeof calculateBookingTotal === 'function') {
        calculateBookingTotal();
      }
    } else {
      // Visa application mode in booking modal
      const destElem = document.getElementById('modalPkgDestination');
      if (destElem) {
        destElem.innerHTML = `<i class="fa-solid fa-passport text-amber-500 mr-1.5"></i> <span class="font-semibold">${isSi ? 'වීසා සහ ආගමන සේවා' : 'Visa &amp; Immigration Services'}</span> &bull; <span>${isSi ? 'කඩිනම් සැකසුම්' : 'Express Processing'}</span>`;
      }
      const priceElem = document.getElementById('modalPkgBasePrice');
      if (priceElem) priceElem.textContent = isSi ? 'නිල ගාස්තු' : 'Official Rate';
      const calcTotal = document.getElementById('modalTotalCalculation');
      if (calcTotal) calcTotal.textContent = isSi ? 'කෙලින්ම යොමු කිරීම' : 'Direct Submission';
      const installmentElem = document.getElementById('modalTabbyInstallment');
      if (installmentElem) installmentElem.textContent = isSi ? 'සුදුසුකම් ලත් සේවාවන් සඳහා Tabby සහ Tamara පොලී රහිත වාරික 4ක්' : 'Tabby & Tamara 4x interest-free available on eligible services';
      const submitBtn = bookingModal.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = isSi ? 'අයදුම්පත තහවුරු කරන්න' : 'Confirm Application Request';
      }
    }
  }

  // 2. Career Apply Modal (careers.html)
  const applyModal = document.getElementById('applyModal');
  if (applyModal && !applyModal.classList.contains('hidden')) {
    if (typeof updateRoutingBadge === 'function') {
      updateRoutingBadge();
    }
  }

  // 3. Itinerary Modal
  const itineraryModal = document.getElementById('itineraryModal');
  if (itineraryModal && !itineraryModal.classList.contains('hidden')) {
    const itineraryBtn = document.getElementById('itineraryBookButton');
    if (itineraryBtn) {
      itineraryBtn.textContent = isSi ? 'වෙන්කරන්න' : 'Book This Package';
    }
  }

  // 4. Country Showcase Modal
  const showcaseModal = document.getElementById('destinationsModal') || document.getElementById('countryShowcaseModal');
  if (showcaseModal && !showcaseModal.classList.contains('hidden') && typeof currentShowcaseCountryKey !== 'undefined' && currentShowcaseCountryKey) {
    if (typeof populateShowcaseData === 'function') {
      populateShowcaseData(currentShowcaseCountryKey);
    }
    if (typeof updateShowcaseTourUI === 'function') {
      updateShowcaseTourUI(typeof currentTourIndex !== 'undefined' ? currentTourIndex : (typeof currentShowcaseTourIndex !== 'undefined' ? currentShowcaseTourIndex : 0), false);
    }
  }

  // 5. Regional Country Packages Modal
  const countryPkgModal = document.getElementById('countryPackagesModal');
  if (countryPkgModal && !countryPkgModal.classList.contains('hidden') && typeof currentActiveCountryPackagesKey !== 'undefined' && currentActiveCountryPackagesKey) {
    if (typeof openCountryPackages === 'function') {
      openCountryPackages(currentActiveCountryPackagesKey);
    }
  }

  // 6. Showcase Itinerary Modal (Drawer)
  const showcaseItinModal = document.getElementById('showcaseItineraryModal');
  if (showcaseItinModal && !showcaseItinModal.classList.contains('hidden') && typeof currentActiveShowcaseTour !== 'undefined' && currentActiveShowcaseTour) {
    if (typeof openShowcaseItinerary === 'function') {
      openShowcaseItinerary(currentActiveShowcaseTour);
    }
  }

  // 7. Popular Destinations Slider / Cards
  const destTrack = document.getElementById('destCardsTrack');
  if (destTrack && typeof initDestinationSlider === 'function') {
    initDestinationSlider();
    if (typeof updateActiveSlideUI === 'function') {
      updateActiveSlideUI(typeof currentDestSlideIndex !== 'undefined' ? currentDestSlideIndex : 0, false);
    }
  }
}

function retranslateActiveModals() {
  const currentLang = typeof getPreferredLanguage === 'function' ? getPreferredLanguage() : (document.documentElement.lang || 'en');
  if (typeof translateFormElements === 'function') {
    translateFormElements(currentLang);
  }
  if (typeof updateOpenModalsLanguage === 'function') {
    updateOpenModalsLanguage(currentLang);
  }
}
window.retranslateActiveModals = retranslateActiveModals;

function changeLanguage(lang, notify = true) {
  if (lang !== 'en' && lang !== 'si') lang = 'en';

  try {
    localStorage.setItem('site_lang', lang);
    localStorage.setItem('pref_lang', lang);
    localStorage.setItem('starplus_lang', lang);
  } catch (e) {}

  document.documentElement.lang = lang;

  // Apply Sinhala typography styles
  if (lang === 'si') {
    document.documentElement.classList.add('lang-si');
  } else {
    document.documentElement.classList.remove('lang-si');
  }

  // Update all language select dropdowns
  document.querySelectorAll('.lang-selector').forEach(sel => {
    sel.value = lang;
  });

  // Dynamic Toggle Button Label:
  // When in English ('en'), show 'සිංහල' (\u0DC3\u0DD2\u0D82\u0DC4\u0DBD) to invite user to switch to Sinhala.
  // When in Sinhala ('si'), show 'English' to invite user to switch to English.
  const sinhalaText = "\u0DC3\u0DD2\u0D82\u0DC4\u0DBD"; // Sinhala
  const targetLabel = lang === 'en' ? sinhalaText : 'English';
  
  document.querySelectorAll('.desktop-lang-text').forEach(el => {
    el.textContent = targetLabel;
  });
  document.querySelectorAll('.lang-badge').forEach(badge => {
    badge.textContent = targetLabel;
  });

  document.querySelectorAll('.lang-active-en').forEach(el => {
    if (lang === 'en') {
      el.className = 'lang-active-en font-black text-amber-600 dark:text-amber-400';
    } else {
      el.className = 'lang-active-en font-semibold text-slate-500 dark:text-slate-400';
    }
  });
  document.querySelectorAll('.lang-active-si').forEach(el => {
    if (lang === 'si') {
      el.className = 'lang-active-si font-black text-amber-600 dark:text-amber-400';
    } else {
      el.className = 'lang-active-si font-semibold text-slate-500 dark:text-slate-400';
    }
  });

  const enToggleBtn = document.getElementById('lang-toggle-en');
  const siToggleBtn = document.getElementById('lang-toggle-si');
  if (enToggleBtn && siToggleBtn) {
    if (!siToggleBtn.textContent.trim() || siToggleBtn.textContent.includes('à')) {
      siToggleBtn.textContent = sinhalaText;
    }
    if (lang === 'si') {
      siToggleBtn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-sm', 'px-2.5', 'py-1');
      siToggleBtn.classList.remove('text-slate-400', 'hover:text-white', 'font-semibold', 'text-white', 'px-2', 'py-0.5');
      enToggleBtn.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-sm', 'text-white', 'px-2.5', 'py-1');
      enToggleBtn.classList.add('text-slate-400', 'hover:text-white', 'font-semibold', 'px-2', 'py-0.5');
    } else {
      enToggleBtn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-sm', 'px-2.5', 'py-1');
      enToggleBtn.classList.remove('text-slate-400', 'hover:text-white', 'font-semibold', 'text-white', 'px-2', 'py-0.5');
      siToggleBtn.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-sm', 'text-white', 'px-2.5', 'py-1');
      siToggleBtn.classList.add('text-slate-400', 'hover:text-white', 'font-semibold', 'px-2', 'py-0.5');
    }
  }

  document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    btn.setAttribute('title', lang === 'si' ? `\u0DB7\u0DCF\u0DC2\u0DCF\u0DC0 \u0DB8\u0DCF\u0DBB\u0DD4 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1 (English / ${sinhalaText})` : 'Switch Language (English / Sinhala)');
    btn.setAttribute('aria-label', `Current language: ${lang === 'si' ? 'Sinhala' : 'English'}. Click to switch to ${lang === 'en' ? 'Sinhala' : 'English'}.`);
  });

  // Update mobile segmented buttons if present
  document.querySelectorAll('.lang-btn-en').forEach(btn => {
    if (lang === 'en') {
      btn.className = 'lang-btn-en px-3 py-1 rounded-md text-[11px] font-extrabold transition-all bg-amber-500 text-slate-950 shadow-sm';
    } else {
      btn.className = 'lang-btn-en px-3 py-1 rounded-md text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-all';
    }
  });

  document.querySelectorAll('.lang-btn-si').forEach(btn => {
    if (lang === 'si') {
      btn.className = 'lang-btn-si px-3 py-1 rounded-md text-[11px] font-extrabold transition-all bg-amber-500 text-slate-950 shadow-sm';
    } else {
      btn.className = 'lang-btn-si px-3 py-1 rounded-md text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-all';
    }
  });

  // Translate all static data-i18n elements
  const translations = I18N_TRANSLATIONS[lang] || I18N_TRANSLATIONS.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] !== undefined) {
      const val = translations[key];
      // Use innerHTML if translation contains HTML tags or HTML entities (e.g. &copy;, &amp;, &bull;)
      if ((val.includes('<') && val.includes('>')) || /&[a-zA-Z0-9#]+;/.test(val)) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }
  });

  // Translate input placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key] !== undefined) {
      el.placeholder = translations[key];
    }
  });

  // Comprehensive Form & Placeholder Translations
  if (typeof translateFormElements === 'function') {
    translateFormElements(lang);
  }

  // Dynamic Reviews Page and Review Cards Translation
  if (typeof translateReviewsPage === 'function') {
    translateReviewsPage(lang);
  }

  // Re-render dynamic tour packages with localized titles & descriptions
  if (typeof renderPackages === 'function') {
    renderPackages(typeof getActiveFilteredPackages === 'function' ? getActiveFilteredPackages() : PACKAGES);
  }

  // Re-render testimonial slider if present
  if (typeof renderTestimonial === 'function') {
    renderTestimonial();
  }

  // Update open modals if active
  if (typeof updateOpenModalsLanguage === 'function') {
    updateOpenModalsLanguage(lang);
  }

  // Dispatch custom language change event
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));

  // Re-run stats counters for any newly inserted translated counters
  if (typeof initStatsCounters === 'function') {
    initStatsCounters();
  }

  // Re-sync sliding nav pill indicator to newly translated text widths
  if (typeof syncNavPillIndicator === 'function') {
    setTimeout(() => syncNavPillIndicator(true), 60);
  }

    // Re-run stats counters for any newly inserted translated counters
  if (typeof initStatsCounters === 'function') {
    initStatsCounters();
  }

  // Update dynamic currency displays
  if (typeof updateAllPriceDisplays === 'function') {
    updateAllPriceDisplays();
  }

  if (notify) {
    const langName = lang === 'si' ? `${sinhalaText} (Sinhala)` : 'English';
    showToast(`Language switched to ${langName}`, 'success');
  }
}

let _toggleLanguageBusy = false;
function toggleLanguage() {
  if (_toggleLanguageBusy) return;
  _toggleLanguageBusy = true;
  const current = getPreferredLanguage();
  const next = current === 'en' ? 'si' : 'en';
  changeLanguage(next, true);
  setTimeout(() => {
    _toggleLanguageBusy = false;
  }, 400);
}
window.getPreferredLanguage = getPreferredLanguage;
window.changeLanguage = changeLanguage;
window.toggleLanguage = toggleLanguage;

// Setup Application & Event Listeners
function initApp() {
  try {
    // 1. Initialize language preference (syncs button label and DOM text)
    changeLanguage(getPreferredLanguage(), false);
  } catch (e) {
    console.error('Language preference init error:', e);
  }

  try {
    // Attach direct click listener to language toggle buttons to guarantee responsive triggers
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!_toggleLanguageBusy) {
          toggleLanguage();
        }
      });
    });
  } catch (e) {
    console.error('Lang btn listener error:', e);
  }

  try {
    // 2. Initialize theme strictly from system preference or explicit manual mode
    applyTheme(getThemeMode(), false);
  } catch (e) {
    console.error('Theme init error:', e);
  }

  try {
    // 3. Prevent refresh jump to FAQ or anchor hashes (always default cleanly to top of page)
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (e) {}
    }
    window.scrollTo(0, 0);
  } catch (e) {}

  try {
    // Initialize Modern Currency Dropdown
    initModernCurrencyDropdown();
    // Synchronize legacy currency selector dropdowns if any
    document.querySelectorAll('.currency-selector').forEach(sel => {
      sel.value = currentCurrency;
    });
    // Fetch live rates or apply cached rates and update UI
    fetchExchangeRates();
  } catch (e) {
    console.error('FX init error:', e);
  }

  try { renderPackages(PACKAGES); } catch (e) {}
  try { renderTestimonial(); } catch (e) {}
  try {
    if (document.getElementById('testimonialSlide')) {
      startSlideTimer();
    }
  } catch (e) {}
  try {
    const visaSel = document.getElementById('visaSelect');
    if (visaSel) {
      visaSel.addEventListener('change', checkVisaRequirements);
    }
    checkVisaRequirements();
  } catch (e) {}

  // Initialize dynamic quote form fields based on initial/default interest
  try {
    const interestSel = document.getElementById('contactInterest');
    if (interestSel) {
      interestSel.addEventListener('change', updateQuoteFormFields);
      updateQuoteFormFields();
    }
  } catch (e) {}

  // Sticky header scroll elevation listener
  try {
    const updateHeaderScroll = () => {
      const header = document.getElementById('mainHeader') || document.querySelector('header');
      if (header) {
        if (window.scrollY > 15) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
        updateBrandLogoTheme();
      }
    };
    window.addEventListener('scroll', updateHeaderScroll, { passive: true });
    updateHeaderScroll();
  } catch (e) {}

  // Mobile menu button listener
  try {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn) {
      mobileBtn.setAttribute('aria-expanded', 'false');
      mobileBtn.setAttribute('aria-controls', 'mobileMenu');
      mobileBtn.removeEventListener('click', toggleMobileMenu);
      mobileBtn.addEventListener('click', toggleMobileMenu);
    }
  } catch (e) {}

  // Close mobile menu when clicking any navigation link inside it
  try {
    document.querySelectorAll('#mobileMenu a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  } catch (e) {}

  // Close mobile menu when backdrop overlay is clicked
  try {
    const backdrop = getOrCreateMobileMenuBackdrop();
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileMenu();
      });
    }
  } catch (e) {}

  // Global click listener for modal backdrops and outside mobile menu click
  document.addEventListener('click', (e) => {
    // Backdrop clicks for main modals
    if (e.target && e.target.id === 'bookingModal') closeBookingModal();
    if (e.target && e.target.id === 'itineraryModal') closeItineraryModal();
    if (e.target && e.target.id === 'applyModal' && typeof closeApplyModal === 'function') closeApplyModal();

    // Close mobile menu on click outside (fallback if backdrop isn't clicked directly)
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('mobileMenuBtn');
    if (menu && !menu.classList.contains('hidden') && btn) {
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // Close modals & mobile menu on escape key & navigate showcase with arrow keys
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBookingModal();
      closeItineraryModal();
      closeCountryPackagesModal();
      closeCountryShowcase();
      closeMobileMenu();
      if (typeof closeApplyModal === 'function') {
        closeApplyModal();
      }
    }
    const showcaseModal = document.getElementById('countryShowcaseModal');
    if (showcaseModal && !showcaseModal.classList.contains('hidden')) {
      if (e.key === 'ArrowRight') {
        nextCountryShowcaseSlide();
      } else if (e.key === 'ArrowLeft') {
        prevCountryShowcaseSlide();
      }
    }
  });

  // Automatically close mobile menu when window expands to desktop size
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      closeMobileMenu();
    }
  }, { passive: true });

  // Attach search listeners
  try { document.getElementById('heroSearchForm')?.addEventListener('submit', handleHeroSearch); } catch (e) {}
  try { setupPackageSearchKeydown(); } catch (e) {}
  try { setupPackageFilterChips(); } catch (e) {}

  // DMC Application Form certification validation listener
  try {
    const dmcForm = document.getElementById('dmc-application-form');
    const certifyCheckbox = document.getElementById('dmc-certify-checkbox');
    const checkboxError = document.getElementById('dmc-checkbox-error');

    if (dmcForm && certifyCheckbox) {
      dmcForm.addEventListener('submit', (e) => {
        if (!certifyCheckbox.checked) {
          e.preventDefault();
          
          // Reveal the error message
          if (checkboxError) {
            checkboxError.classList.remove('hidden');
          }
          
          // Highlight the checkbox with a subtle glow/focus
          certifyCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          certifyCheckbox.focus();
          certifyCheckbox.classList.add('ring-2', 'ring-rose-500');
          if (typeof showToast === 'function') {
            showToast('⚠️ Please certify and check this box before submitting your application.', 'error');
          }
          return false;
        }

        // Hide error if checked
        if (checkboxError) {
          checkboxError.classList.add('hidden');
        }
        certifyCheckbox.classList.remove('ring-2', 'ring-rose-500');
      });

      // Clear error warning as soon as user checks the box
      certifyCheckbox.addEventListener('change', () => {
        if (certifyCheckbox.checked && checkboxError) {
          checkboxError.classList.add('hidden');
          certifyCheckbox.classList.remove('ring-2', 'ring-rose-500');
        }
      });
    }

    const emailClientBtn = document.getElementById('btn-dmc-email-client');
    if (emailClientBtn && !emailClientBtn.dataset.listenerBound) {
      emailClientBtn.dataset.listenerBound = 'true';
      emailClientBtn.addEventListener('click', (e) => {
        sendDirectDmcEmail(e);
      });
    }
  } catch (e) {}

  // Initialize Dynamic Hero Slideshow if present
  try { initHeroSlideshow(); } catch (e) {}

  // Initialize Navigation Dropdown interactions
  try { initNavDropdowns(); } catch (e) {}

  // Initialize Desktop Sliding Glass Pill Navigation Indicator
  try { initNavPillIndicator(); } catch (e) {}

  // Initialize Animated Statistics Number Counters
  try { initStatsCounters(); } catch (e) {}

  // Smooth scroll to top when clicking Home link or brand logo on the homepage
  try {
    document.querySelectorAll('a[href="/"], a[href="/#hero"], a[href="#hero"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '';
        if (isHomePage) {
          e.preventDefault();
          const heroSection = document.getElementById('hero') || document.body;
          if (window.scrollY > 0) {
            heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          if (window.history && window.history.pushState) {
            window.history.pushState(null, '', '/');
          }
          closeMobileMenu();
        }
      });
    });
  } catch (e) {}
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* ==========================================================================
   Dynamic Hero Slideshow Controller
   ========================================================================== */
let heroSlideshowTimer = null;
let currentSlideIndex = 0;

function switchHeroSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-indicator-dot');
  if (!slides || slides.length === 0) return;

  const validIndex = ((index % slides.length) + slides.length) % slides.length;

  slides.forEach((s, i) => {
    if (i === validIndex) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });

  dots.forEach((d, i) => {
    if (i === validIndex) {
      d.classList.add('active');
    } else {
      d.classList.remove('active');
    }
  });

  currentSlideIndex = validIndex;
}

function heroNextSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  switchHeroSlide(currentSlideIndex + 1);
  resetHeroTimer();
}

function heroPrevSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  switchHeroSlide(currentSlideIndex - 1);
  resetHeroTimer();
}

function resetHeroTimer() {
  if (heroSlideshowTimer) clearInterval(heroSlideshowTimer);
  heroSlideshowTimer = setInterval(() => {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;
    switchHeroSlide((currentSlideIndex + 1) % slides.length);
  }, 6000);
}

function stopHeroTimer() {
  if (heroSlideshowTimer) {
    clearInterval(heroSlideshowTimer);
    heroSlideshowTimer = null;
  }
}

function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-indicator-dot');
  if (!slides || slides.length === 0) return;

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.slideIndex, 10);
      if (!isNaN(idx)) {
        switchHeroSlide(idx);
        resetHeroTimer();
      }
    });
  });

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopHeroTimer);
    heroSection.addEventListener('mouseleave', resetHeroTimer);
  }

  switchHeroSlide(0);
  resetHeroTimer();
}

/* ==========================================================================
   Tour Packages Interactive Carousel Controller
   ========================================================================== */
function scrollPackagesCarousel(direction) {
  const track = document.getElementById('packagesGrid');
  if (!track) return;
  const scrollAmount = Math.max(300, Math.floor(track.clientWidth * 0.75)) * direction;
  track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}
window.scrollPackagesCarousel = scrollPackagesCarousel;

/* ==========================================================================
   Navigation Dropdown Controller (Explore Menu)
   ========================================================================== */
function initNavDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle('is-open');
      });
    }
  });

  document.addEventListener('click', (e) => {
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('is-open');
      }
    });
  });
}

/* ==========================================================================
   Desktop Sliding Glass Pill Navigation Indicator
   Glides & morphs smoothly behind whichever tab is currently active or hovered
   ========================================================================== */
function initNavPillIndicator() {
  const navTrack = document.getElementById('desktopNav');
  const indicator = document.getElementById('navPillIndicator');
  if (!navTrack || !indicator) return;

  const navLinks = navTrack.querySelectorAll('.nav-link');
  if (!navLinks.length) return;

  let isHovered = false;

  function moveIndicatorTo(target, animate = true) {
    if (!target) {
      indicator.style.opacity = '0';
      return;
    }

    const trackRect = navTrack.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const left = targetRect.left - trackRect.left;
    const top = targetRect.top - trackRect.top;
    const width = targetRect.width;
    const height = targetRect.height;

    if (!animate) {
      indicator.style.transition = 'none';
    } else {
      indicator.style.transition = '';
    }

    indicator.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
    indicator.style.width = `${Math.round(width)}px`;
    indicator.style.height = `${Math.round(height)}px`;
    indicator.style.opacity = '1';

    if (!animate) {
      void indicator.offsetWidth;
      indicator.style.transition = '';
    }
  }

  function getActiveItem() {
    return navTrack.querySelector('.nav-link.active') || navTrack.querySelector('.nav-link');
  }

  function syncActive(animate = false) {
    if (isHovered) return;
    const activeItem = getActiveItem();
    if (activeItem) {
      moveIndicatorTo(activeItem, animate);
    }
  }

  window.syncNavPillIndicator = (animate = false) => {
    syncActive(animate);
  };

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      isHovered = true;
      moveIndicatorTo(link, true);
    });
    link.addEventListener('focus', () => {
      isHovered = true;
      moveIndicatorTo(link, true);
    });
  });

  navTrack.addEventListener('mouseleave', () => {
    isHovered = false;
    syncActive(true);
  });

  window.addEventListener('resize', () => {
    syncActive(false);
  });

  // Re-sync once webfonts are loaded and layout coordinates settle
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => syncActive(false));
  }
  setTimeout(() => syncActive(false), 50);
  setTimeout(() => syncActive(false), 250);
}

/* ==========================================================================
   Simple & Elegant Luxury Preloader Controller
   ========================================================================== */
/* ==========================================================================
   Luxury Preloader & Strictly Time-Gated New Year Loading Screen Controller
   Condition: Only active on January 1st strictly between 12:00 AM & 12:00 PM
   ========================================================================== */
(function setupLuxuryPreloader() {
  const preloader = document.getElementById('starplus-preloader') || document.getElementById('sitePreloader');
  if (!preloader) return;

  // Session-based splash display: If already shown in this session (and not preview/force param), dismiss immediately
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const forceShow = urlParams.get('ny_loader') === '1' || urlParams.get('newyear_loader') === 'true' || urlParams.get('preview_loader') === '1' || urlParams.get('runway_loader') === '1';
    if (!forceShow && sessionStorage.getItem('splashShown') === 'true') {
      preloader.style.display = 'none';
      preloader.classList.add('fade-out', 'preloader-exit');
      if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      return;
    }
  } catch (e) {}

  /**
   * Evaluates whether current date & time falls strictly within
   * the January 1st morning celebratory window: 12:00 AM (00:00:00) to 12:00 PM (12:00:00).
   */
  function isNewYearMorningActive(targetDate) {
    let d = targetDate;
    if (!d) {
      if (typeof window !== 'undefined') {
        if (window.__FORCE_NY_LOADER === true) return true;
        if (window.__FORCE_NY_LOADER === false) return false;
        try {
          const params = new URLSearchParams(window.location.search);
          if (params.get('ny_loader') === '1' || params.get('newyear_loader') === 'true') {
            return true;
          }
          const dateParam = params.get('date');
          if (dateParam) {
            const parsed = new Date(dateParam);
            if (!isNaN(parsed.getTime())) d = parsed;
          }
        } catch (e) {}
      }
      if (!d) d = new Date();
    }

    // Month 0 = January, Date 1 = 1st
    if (d.getMonth() !== 0 || d.getDate() !== 1) {
      return false;
    }

    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    const ms = d.getMilliseconds();

    // Strictly between 12:00 AM (00:00:00.000) and 12:00 PM (12:00:00.000)
    if (h < 0 || h > 12) return false;
    if (h === 12 && (m > 0 || s > 0 || ms > 0)) return false;
    return true;
  }

  /**
   * Renders the Luxury Festive Greeting Card inside #sitePreloader
   */
  function renderNewYearCard(targetPreloader, year) {
    targetPreloader.classList.add('ny-celebration-active');

    const isDark = document.documentElement.classList.contains('dark') ||
      (!document.documentElement.classList.contains('light') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const logoSrc = isDark ? 'assets/logo-white-text.png?v=2' : 'assets/logo.png?v=2';

    targetPreloader.innerHTML = `
      <div class="ny-loader-card">
        <div class="ny-logo-container">
          <img src="${logoSrc}" alt="Star Plus Travel & Tourism LLC" class="ny-brand-logo" />
        </div>

        <div class="ny-badge-container">
          <span class="ny-festive-badge">
            HAPPY NEW YEAR • <span class="ny-year-text">${year}</span>
          </span>
        </div>

        <h2 class="ny-celebration-heading">
          Wishing You Extraordinary Journeys In <span class="ny-gold-year">${year}</span>
        </h2>

        <p class="ny-celebration-subheading">
          May your new year unfold timeless voyages, bespoke luxury &amp; unforgettable horizons across the globe.
        </p>

        <div class="ny-progress-wrapper">
          <div class="ny-progress-bar-track">
            <div class="ny-progress-bar-fill"></div>
          </div>
          <div class="ny-progress-status-text">PREPARING YOUR LUXURY EXPERIENCE</div>
        </div>
      </div>
    `;
  }

  // Determine active state
  const isNyActive = isNewYearMorningActive();
  window.__isNewYearLoaderActive = isNyActive;

  let cleanupConfetti = null;

  if (isNyActive) {
    const currentYear = new Date().getFullYear();
    renderNewYearCard(preloader, currentYear);
    cleanupConfetti = initConfettiCanvas(preloader);
  }

  // Dismiss logic with smooth fade-out transition
  function dismissPreloader() {
    if (preloader._dismissed) return;

    const start = window.__preloaderStartTime || Date.now();
    const elapsed = Date.now() - start;
    const minWait = isNyActive ? 2600 : 400;
    const remaining = Math.max(0, minWait - elapsed);

    setTimeout(() => {
      preloader._dismissed = true;
      preloader.classList.add('fade-out', 'preloader-exit');
      try { sessionStorage.setItem('splashShown', 'true'); } catch (e) {}
      if (cleanupConfetti) {
        cleanupConfetti();
        cleanupConfetti = null;
      }
      setTimeout(() => {
        if (preloader) {
          preloader.style.display = 'none';
          if (preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
          }
        }
      }, 700);
    }, remaining);
  }

  if (document.readyState === 'complete') {
    dismissPreloader();
  } else {
    window.addEventListener('load', () => {
      const preloader = document.getElementById('starplus-preloader') || document.getElementById('sitePreloader');
      if (preloader) {
        setTimeout(() => {
          preloader.classList.add('fade-out');
          dismissPreloader();
        }, 400);
      }
    });
  }

  // Fallback safety dismissal after 2.5s
  setTimeout(() => {
    const preloader = document.getElementById('starplus-preloader') || document.getElementById('sitePreloader');
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      dismissPreloader();
    }
  }, 2500);

  /**
   * Lightweight 60 FPS Canvas Particle Engine for Gold Confetti & Star Sparkles
   */
  function initConfettiCanvas(container) {
    const canvas = document.createElement('canvas');
    canvas.id = 'nyLoaderConfettiCanvas';
    canvas.className = 'ny-loader-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    container.insertBefore(canvas, container.firstChild);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function onResize() {
      if (!canvas || !canvas.parentNode) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', onResize);

    const colors = ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff', '#d97706', '#fde68a'];
    const particleCount = Math.min(65, Math.max(35, Math.floor(window.innerWidth / 20)));
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.8 - height * 0.4,
        w: Math.random() * 8 + 6,
        h: Math.random() * 5 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2.2 + 1.6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6,
        oscillationSpeed: Math.random() * 0.04 + 0.02,
        oscillationOffset: Math.random() * Math.PI * 2,
        type: Math.random() > 0.4 ? 'ribbon' : 'sparkle',
        opacity: Math.random() * 0.4 + 0.6
      });
    }

    let isRunning = true;
    let animId = null;

    function render(time) {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.x += p.vx + Math.sin(time * 0.002 + p.oscillationOffset) * 0.8;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.type === 'ribbon') {
          const scaleX = Math.cos(p.rotation * 0.05);
          ctx.scale(scaleX, 1);
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          // 4-point golden star sparkle
          const r = p.w * 0.55;
          ctx.beginPath();
          for (let s = 0; s < 4; s++) {
            const angle = (s * Math.PI) / 2;
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            const halfAngle = angle + Math.PI / 4;
            ctx.lineTo(Math.cos(halfAngle) * (r * 0.35), Math.sin(halfAngle) * (r * 0.35));
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return function cleanup() {
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (canvas && canvas.parentNode) {
        canvas.remove();
      }
    };
  }

  // Expose public API for developer preview & verification
  window.StarPlusNewYearLoader = {
    isActive: function() { return isNewYearMorningActive(); },
    checkCondition: isNewYearMorningActive,
    preview: function() {
      window.__FORCE_NY_LOADER = true;
      if (preloader) {
        preloader.style.display = 'flex';
        preloader.classList.remove('fade-out');
        const currentYear = new Date().getFullYear();
        renderNewYearCard(preloader, currentYear);
        if (cleanupConfetti) cleanupConfetti();
        cleanupConfetti = initConfettiCanvas(preloader);
        setTimeout(() => {
          preloader.classList.add('fade-out');
          setTimeout(() => {
            if (cleanupConfetti) cleanupConfetti();
            preloader.style.display = 'none';
          }, 500);
        }, 3200);
      }
    }
  };
})();

/* ==========================================================================
   Animated Statistics Number Counter (Scroll-Triggered with Smooth Easing)
   ========================================================================== */
function initStatsCounters() {
  const counterElements = document.querySelectorAll('.stat-counter');
  if (!counterElements.length) return;

  // Pre-initialize counters that are out of view so there is no jarring jump
  counterElements.forEach(el => {
    if (el._hasAnimated) return;
    const target = parseFloat(el.getAttribute('data-target') || '0');
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const useComma = el.getAttribute('data-format') === 'comma' || target >= 1000;
    const rect = el.getBoundingClientRect();
    const isPast = rect.bottom <= 0;
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (isPast) {
      el._hasAnimated = true;
      const finalFormatted = decimals > 0 ? target.toFixed(decimals) : (useComma ? Math.floor(target).toLocaleString('en-US') : target.toString());
      el.textContent = `${prefix}${finalFormatted}${suffix}`;
    } else if (!inView) {
      const zeroFormatted = decimals > 0 ? (0).toFixed(decimals) : '0';
      el.textContent = `${prefix}${zeroFormatted}${suffix}`;
    }
  });

  const animateCounter = (el) => {
    if (el._hasAnimated) return;
    el._hasAnimated = true;

    const target = parseFloat(el.getAttribute('data-target') || '0');
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const useComma = el.getAttribute('data-format') === 'comma' || target >= 1000;
    const duration = parseInt(el.getAttribute('data-duration') || '1800', 10);

    const startTime = performance.now();

    const updateValue = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth cubic ease-out curve: fast start, soft settle
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = target * easeOut;

      let formattedNumber;
      if (decimals > 0) {
        formattedNumber = current.toFixed(decimals);
      } else {
        const rounded = Math.floor(current);
        formattedNumber = useComma ? rounded.toLocaleString('en-US') : rounded.toString();
      }

      el.textContent = `${prefix}${formattedNumber}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        let finalFormatted;
        if (decimals > 0) {
          finalFormatted = target.toFixed(decimals);
        } else {
          finalFormatted = useComma ? Math.floor(target).toLocaleString('en-US') : target.toString();
        }
        el.textContent = `${prefix}${finalFormatted}${suffix}`;
      }
    };

    requestAnimationFrame(updateValue);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -20px 0px'
    });

    counterElements.forEach(el => {
      if (!el._hasAnimated) {
        observer.observe(el);
      }
    });
  } else {
    counterElements.forEach(animateCounter);
  }
}
window.initStatsCounters = initStatsCounters;

/* ==========================================================================
   Interactive Country-to-Destination Packages Data & Modal Management
   ========================================================================== */
const DESTINATION_COUNTRY_PACKAGES = {
  dubai: {
    country: 'Dubai & Abu Dhabi, UAE',
    badge: 'Flagship Hub & Arabian Glamour',
    season: 'October – April (Pleasant & Cool)',
    icon: 'fa-city',
    packages: [
      {
        id: 'dubai-family-3n4d',
        title: '3N / 4D Dubai Family Package (Signature Special)',
        badge: 'Flagship Family Deal',
        duration: '4 Days / 3 Nights',
        stay: 'Avani Deira Dubai Hotel (4-Star Deluxe)',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
        description: 'The ultimate Dubai family vacation featuring 4-star luxury at Avani Deira Hotel, iconic landmark access, thrilling red dune desert safaris, and Arabian dhow cruise dining.',
        highlights: [
          '3 Nights stay at Avani Deira Dubai Hotel with daily international buffet breakfast',
          'Roundtrip Private Dubai International Airport (DXB) transfers in luxury AC vehicle',
          'Burj Khalifa "At The Top" Observation Deck (124th & 125th Floor Tickets)',
          'Dubai Marina Luxury Dhow Cruise Dinner with 5-star buffet & live Tanoura dance show',
          'VIP 4x4 Desert Safari: Dune Bashing, Camel Rides, Sandboarding, Fire Show & BBQ Dinner',
          'Half-day guided Dubai City Tour (Dubai Frame photo stop, abra ride, Gold & Spice Souks)'
        ],
        priceAED: 1850,
        whatsappMsg: 'Hi Star Plus, I am interested in the 3N/4D Dubai Family Package with Avani Deira Hotel (AED 1,850/person). Please share availability and booking details!'
      },
      {
        id: 'dubai-abudhabi-5d4n',
        title: '5D / 4N Dubai & Abu Dhabi Grand Experience',
        badge: 'Luxury Twin City',
        duration: '5 Days / 4 Nights',
        stay: '5-Star Waterfront Hotel (Radisson Blu / Swissôtel)',
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
        description: 'Comprehensive luxury tour combining the futuristic skyline of Dubai with the imperial cultural heritage and palatial sights of Abu Dhabi.',
        highlights: [
          'Full-day Abu Dhabi Tour: Sheikh Zayed Grand Mosque, Emirates Palace & Louvre Abu Dhabi',
          'Private 2-Hour Yacht Cruise past Dubai Marina, JBR, and Atlantis The Palm',
          'Museum of the Future VIP Priority Entry & Dubai Mall Fountain Boardwalk',
          'Red Dune VIP Desert Safari with private majlis table and live BBQ entertainment',
          'Dedicated private chauffeur throughout the entire journey'
        ],
        priceAED: 2750,
        whatsappMsg: 'Hi Star Plus, I would like to inquire about the 5D/4N Dubai & Abu Dhabi Grand Experience (AED 2,750/person).'
      }
    ]
  },
  srilanka: {
    country: 'Sri Lanka Island Odyssey',
    badge: 'Cultural Triangle & Emerald Pearl',
    season: 'Year-Round Travel Circuits',
    icon: 'fa-gem',
    packages: [
      {
        id: 'sl-wildlife-rainforest',
        title: 'Wildlife & Rainforest Expedition',
        badge: 'Safari & Rainforest',
        duration: '5 Days / 4 Nights',
        stay: 'Luxury Eco-Lodges & Safari Tented Camps',
        image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80',
        description: 'Immerse in Sri Lanka’s wild sanctuary with big-game leopard safaris, UNESCO virgin rainforest trekking, and ocean whale encounters.',
        highlights: [
          'Exclusive 4x4 Jeep Safari in Yala National Park (World’s highest leopard density)',
          'Guided biodiversity trek through Sinharaja UNESCO Virgin Rainforest Biosphere',
          'Udawalawe Elephant Transit Home & wild herd rehabilitation observation',
          'Scenic Mirissa blue whale and dolphin watching expedition off the southern coast'
        ],
        priceAED: 2150,
        whatsappMsg: 'Hi Star Plus, I am interested in the Sri Lanka Wildlife & Rainforest Expedition regional package (AED 2,150/person). Please provide details.'
      },
      {
        id: 'sl-down-south-beach',
        title: 'Down South Beach & Coastal Getaway',
        badge: 'Beach & Coastal',
        duration: '4 Days / 3 Nights',
        stay: '4-Star Beachfront Luxury Resort (Bentota / Galle)',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
        description: 'Unwind along sun-drenched golden sands, UNESCO heritage fortress ramparts, and exhilarating coastal river and water adventures.',
        highlights: [
          'Guided walking tour of UNESCO World Heritage Galle Dutch Fort & Lighthouse',
          'Bentota watersports (Jet ski, banana boat) & Madu River mangrove safari with fish therapy',
          'Mirissa Secret Beach sunset viewpoints and beginner-friendly surfing at Weligama bay',
          'Kosgoda Sea Turtle Conservation & Hatchery project visit'
        ],
        priceAED: 1890,
        whatsappMsg: 'Hi Star Plus, I would like to book the Sri Lanka Down South Beach & Coastal Getaway package (AED 1,890/person).'
      },
      {
        id: 'sl-jaffna-northern',
        title: 'Jaffna & Northern Cultural Discovery',
        badge: 'Northern Heritage',
        duration: '4 Days / 3 Nights',
        stay: 'Premier Heritage Boutique Hotels in Jaffna City',
        image: 'assets/sri-lanka-jaffna-nallur-kovil.jpg',
        description: 'Explore the vibrant Tamil cultural heartland of Northern Sri Lanka, ancient island temples, and untouched colonial architecture.',
        highlights: [
          'Majestic golden Nallur Kandaswamy Kovil spiritual experience and puja ritual',
          'Historic star-shaped Jaffna Dutch Fort and restored colonial public library',
          'Scenic boat ferry excursion across Palk Strait to Nainativu Island (Nagapooshani Amman Temple)',
          'Keerimalai Sacred Natural Springs, Casuarina Beach & Point Pedro northernmost tip'
        ],
        priceAED: 1950,
        whatsappMsg: 'Hi Star Plus, I would like to inquire about the Jaffna & Northern Cultural Discovery package (AED 1,950/person).'
      },
      {
        id: 'sl-historical-heritage',
        title: 'Historical & Cultural Heritage Triangle',
        badge: 'UNESCO Heritage',
        duration: '5 Days / 4 Nights',
        stay: 'Heritage Garden Retreats & 4-Star Kandy Hotel',
        image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
        description: 'Step back through millennia of royal dynasties, sacred Buddhist monasteries, and dramatic stone citadels in the heart of Ceylon.',
        highlights: [
          'Ascend the iconic Sigiriya 5th-century Lion Rock Fortress and ancient fresco galleries',
          'Dambulla Golden Cave Temple complex with over 150 serene Buddha statues',
          'Sacred Temple of the Tooth Relic (Sri Dalada Maligawa) & evening Kandy cultural dance show',
          'Guided bicycle tour through Polonnaruwa Ancient Kingdom royal ruins'
        ],
        priceAED: 2250,
        whatsappMsg: 'Hi Star Plus, please send me details and availability for the Sri Lanka Historical & Cultural Heritage Triangle tour (AED 2,250/person).'
      },
      {
        id: 'sl-mountains-waterfalls',
        title: 'Mountains, Waterfalls & Misty Tea Hills',
        badge: 'Highlands & Scenic',
        duration: '5 Days / 4 Nights',
        stay: 'Colonial Tea Estate Bungalows & Misty Ella Resorts',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        description: 'Journey across emerald tea carpet valleys, ride the world-renowned blue train, and stand above the clouds at World’s End.',
        highlights: [
          'World-famous scenic blue train journey across Demodara Nine Arch Bridge in Ella',
          'Nuwara Eliya "Little England" Ceylon tea plantation tour & fresh estate tea tasting',
          'Horton Plains National Park trek to the dramatic 880m World’s End sheer precipice',
          'Ramboda Falls, Ravana Waterfall and Little Adam’s Peak sunrise summit hike'
        ],
        priceAED: 2050,
        whatsappMsg: 'Hi Star Plus, I am interested in the Mountains, Waterfalls & Misty Tea Hills package for Sri Lanka (AED 2,050/person).'
      }
    ]
  },
  maldives: {
    country: 'Maldives Island Retreats',
    badge: 'Turquoise Atolls & Luxury Seclusion',
    season: 'November – April (Dry Sun Season)',
    icon: 'fa-umbrella-beach',
    packages: [
      {
        id: 'maldives-overwater-luxury',
        title: '4D / 3N Overwater Villa Luxury Escape',
        badge: 'Honeymoon Luxury',
        duration: '4 Days / 3 Nights',
        stay: '5-Star Private Island Overwater Pool Villa',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
        description: 'Ultimate romantic retreat featuring overwater villa with private plunge pool, scenic seaplane arrival, and all-inclusive gourmet dining.',
        highlights: [
          'Roundtrip scenic seaplane transfers from Velana Male International Airport',
          'All-Inclusive Dine-Around: daily champagne breakfast, lunch & fine dinner',
          'Guided house reef snorkeling safari with marine biologists & sea turtles',
          'Sunset luxury dolphin cruise with sparkling drinks and chef canapés'
        ],
        priceAED: 4499,
        whatsappMsg: 'Hi Star Plus, I am interested in the 4D/3N Maldives Overwater Villa Luxury Escape (AED 4,499/person).'
      },
      {
        id: 'maldives-beach-family',
        title: '5D / 4N Beachfront Island Oasis',
        badge: 'Family Beach Retreat',
        duration: '5 Days / 4 Nights',
        stay: '4-Star Superior Island Resort (Beach Villa)',
        image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80',
        description: 'Sun-soaked tropical getaway with direct powder-white beach access, non-motorized water sports, and tranquil turquoise lagoons.',
        highlights: [
          'Speedboat transfers from Male Velana Airport',
          'Full Board meal plan (Breakfast, lunch, and dinner buffet included)',
          'Complimentary kayaks, stand-up paddleboards, and snorkeling gear',
          'Island hopping tour and local fishing village excursion'
        ],
        priceAED: 3250,
        whatsappMsg: 'Hi Star Plus, I would like to book the 5D/4N Maldives Beachfront Island Oasis (AED 3,250/person).'
      }
    ]
  },
  azerbaijan: {
    country: 'Baku & Caucasus, Azerbaijan',
    badge: 'Land of Fire & Silk Road',
    season: 'April – June & Sept – Nov',
    icon: 'fa-mountain-sun',
    packages: [
      {
        id: 'baku-shahdag-5d4n',
        title: '5D / 4N Baku & Shahdag Mountain Escape',
        badge: 'City & Alpine Blend',
        duration: '5 Days / 4 Nights',
        stay: '4-Star Central Baku Hotel + Shahdag Mountain Resort',
        image: 'assets/packages/baku-flame-towers.jpg',
        fallback: 'assets/packages/baku-flame-towers.jpg',
        description: 'Explore the modern marvels and medieval history of Baku followed by breathtaking alpine adventures in the high Caucasus.',
        highlights: [
          'Baku Old City (Icherisheher UNESCO) with Maiden Tower & Shirvanshah Palace',
          'Gobustan National Park: bubbling mud volcanoes and prehistoric petroglyphs',
          'Ateshgah Zoroastrian Fire Temple and Yanar Dag perpetually burning flames',
          'Shahdag Mountain Resort with scenic panoramic cable car ride',
          'Daily buffet breakfast, private chauffeur, and certified English guide'
        ],
        priceAED: 1950,
        whatsappMsg: 'Hi Star Plus, I would like to inquire about the Baku & Shahdag Mountain Escape package (AED 1,950/person).'
      },
      {
        id: 'azerbaijan-silkroad-6d5n',
        title: '6D / 5N Azerbaijan Silk Road & Sheki Tour',
        badge: 'Silk Road Explorer',
        duration: '6 Days / 5 Nights',
        stay: '4-Star Hotels in Baku, Gabala & Sheki',
        image: 'https://images.unsplash.com/photo-1621539205985-64585141ef30?auto=format&fit=crop&w=1200&q=80',
        fallback: 'assets/packages/baku-flame-towers.jpg',
        description: 'Journey through Caucasus mountain passes, picturesque alpine lakes, and ancient Silk Road trading cities.',
        highlights: [
          'Baku panoramic boulevard and Heydar Aliyev Cultural Centre photo stop',
          'Gabala Tufandag Mountain cable cars and peaceful Nohur Lake boat ride',
          'Sheki Khan Palace with mesmerizing handcrafted Shebeke stained glass',
          'Ancient Caravanserai tour and authentic Azerbaijani tea tasting'
        ],
        priceAED: 2390,
        whatsappMsg: 'Hi Star Plus, I am interested in the 6D/5N Azerbaijan Silk Road & Sheki Tour (AED 2,390/person).'
      }
    ]
  },
  georgia: {
    country: 'Tbilisi & Kazbegi, Georgia',
    badge: 'Caucasus Marvel & Ancient Heritage',
    season: 'May – October / Winter Ski',
    icon: 'fa-snowflake',
    packages: [
      {
        id: 'georgia-kazbegi-5d4n',
        title: '5D / 4N Majestic Georgia & Kazbegi Alpine Tour',
        badge: 'Caucasian Peaks',
        duration: '5 Days / 4 Nights',
        stay: '4-Star Boutique Hotel in Old Tbilisi & Gudauri Resort',
        image: 'assets/packages/georgia-kazbegi.jpg',
        fallback: 'assets/packages/georgia-kazbegi.jpg',
        description: 'Ascend dramatic Caucasus mountain passes, explore historic sulfur bath districts, and stand under snow-capped Mount Kazbek.',
        highlights: [
          'Old Tbilisi walking tour: Narikala Fortress cable car and sulfur bath district',
          'Scenic Georgian Military Highway, Ananuri Fortress & Jinvali blue reservoir',
          '4x4 Off-road ascent to 14th-century Gergeti Trinity Church under Mount Kazbek',
          'Traditional Georgian Supra feast with khachapuri, khinkali, and folk music'
        ],
        priceAED: 1890,
        whatsappMsg: 'Hi Star Plus, I am interested in the 5D/4N Georgia & Kazbegi Alpine Tour (AED 1,890/person).'
      },
      {
        id: 'georgia-wine-mountain-6d5n',
        title: '6D / 5N Georgia Wine & Mountain Splendor',
        badge: 'Wine & Romance',
        duration: '6 Days / 5 Nights',
        stay: '4-Star Hotels in Tbilisi & Kakheti Wine Valley',
        image: 'assets/packages/georgia-kazbegi.jpg',
        fallback: 'assets/packages/georgia-kazbegi.jpg',
        description: 'Delve into the cradle of wine in Kakheti, charming walled cities, and scenic Caucasian mountain valleys.',
        highlights: [
          'Sighnaghi "City of Love" cobblestone streets & Alazani Valley views',
          'Kvareli historic wine tunnel visit and ancient Qvevri method masterclass',
          'Borjomi mineral water national park walk and Rabati Castle fortress',
          'Private roundtrip airport transfers & full English-speaking guide'
        ],
        priceAED: 2290,
        whatsappMsg: 'Hi Star Plus, please share details for the 6D/5N Georgia Wine & Mountain Splendor package (AED 2,290/person).'
      }
    ]
  },
  bali: {
    country: 'Bali & Nusa Penida, Indonesia',
    badge: 'Island of the Gods & Tropical Bliss',
    season: 'April – October (Dry Season)',
    icon: 'fa-leaf',
    packages: [
      {
        id: 'bali-cultural-tropical-6d5n',
        title: '6D / 5N Bali Cultural & Tropical Wonder',
        badge: 'Tropical Bliss',
        duration: '6 Days / 5 Nights',
        stay: 'Private Pool Villa in Ubud & 4-Star Beach Resort Seminyak',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        description: 'Immerse in Bali’s spiritual sanctuary, lush emerald rice terraces, giant jungle swings, and clifftop sunset temples.',
        highlights: [
          'Tegallalang emerald rice terraces & world-famous giant jungle swing',
          'Sacred Monkey Forest sanctuary and Ubud Royal Palace art market',
          'Tirta Empul ancient holy water temple blessing ceremony',
          'Uluwatu dramatic clifftop temple & traditional sunset Kecak fire dance'
        ],
        priceAED: 2450,
        whatsappMsg: 'Hi Star Plus, I would like to inquire about the 6D/5N Bali Cultural & Tropical Wonder package (AED 2,450/person).'
      },
      {
        id: 'bali-nusapenida-7d6n',
        title: '7D / 6N Bali & Nusa Penida Island Hopper',
        badge: 'Island Explorer',
        duration: '7 Days / 6 Nights',
        stay: '4-Star Pool Villa Ubud + Sanur Beach Resort',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        description: 'Combine Bali’s cultural heart with the pristine white sands, crystal manta ray bays, and towering cliffs of Nusa Penida.',
        highlights: [
          'Speedboat day tour to Nusa Penida: Kelingking T-Rex Beach & Angel’s Billabong',
          'Snorkeling at Broken Beach and swimming in Crystal Bay',
          'Mount Batur sunrise 4x4 jeep safari and natural hot spring soak',
          'Tegenungan Waterfall trek and romantic Jimbaran beach seafood dinner'
        ],
        priceAED: 2890,
        whatsappMsg: 'Hi Star Plus, I am interested in the 7D/6N Bali & Nusa Penida Island Hopper package (AED 2,890/person).'
      }
    ]
  }
};

let currentActiveCountryPackagesKey = null;

function openCountryPackages(countryKey) {
  currentActiveCountryPackagesKey = countryKey;
  const currentLang = typeof getPreferredLanguage === 'function' ? getPreferredLanguage() : (localStorage.getItem('site_lang') || 'en');
  const isSi = (currentLang === 'si');

  let data = DESTINATION_COUNTRY_PACKAGES[countryKey];
  if (!data) return;

  if (isSi && typeof getLocalizedCountryPackages === 'function') {
    const loc = getLocalizedCountryPackages(countryKey, 'si');
    if (loc) data = loc;
  }

  const modal = document.getElementById('countryPackagesModal');
  const titleElem = document.getElementById('countryModalTitle');
  const badgeElem = document.getElementById('countryModalBadge');
  const seasonElem = document.getElementById('countryModalSeason');
  const iconElem = document.getElementById('countryModalIcon');
  const bodyElem = document.getElementById('countryModalBody');
  const customBtn = document.getElementById('countryModalCustomBtn');

  if (!modal || !bodyElem) return;

  if (titleElem) titleElem.textContent = data.country;
  if (badgeElem) badgeElem.textContent = data.badge;
  if (seasonElem) {
    seasonElem.innerHTML = `<i class="fa-solid fa-calendar text-amber-400/80 mr-1.5"></i>${isSi ? 'හොඳම කාලය:' : 'Best Season:'} ${data.season}`;
  }
  if (iconElem) {
    iconElem.className = `fa-solid ${data.icon || 'fa-earth-asia'}`;
  }
  if (customBtn) {
    customBtn.textContent = isSi ? 'සුවිශේෂී සංචාරක සැලැස්මක් ඉල්ලන්න' : 'Request Custom Itinerary';
    customBtn.href = `https://wa.me/971527582293?text=${encodeURIComponent(isSi ? `හෙලෝ Star Plus Travels, මම ${data.country} සඳහා සුවිශේෂී සංචාරක සැලැස්මක් ලබාගැනීමට කැමතියි.` : `Hi Star Plus, I would like to design a customized holiday itinerary for ${data.country}. Please connect me with a specialist.`)}`;
  }

  bodyElem.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${data.packages.map(pkg => {
        const formattedPrice = typeof formatPrice === 'function' ? formatPrice(pkg.priceAED) : `AED ${pkg.priceAED.toLocaleString()}`;
        const installmentAmount = Math.round(pkg.priceAED / 4);
        const formattedInstallment = typeof formatPrice === 'function' ? formatPrice(installmentAmount) : `AED ${installmentAmount.toLocaleString()}`;
        const isSl = countryKey === 'srilanka' || (pkg.id && pkg.id.includes('sl-'));
        
        return `
          <div class="regional-tour-card glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/40 bg-slate-900/80 flex flex-col justify-between shadow-xl">
            <div>
              <div class="relative h-48 overflow-hidden group">
                <img src="${pkg.image}" alt="${pkg.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" onerror="this.onerror=null;this.src='${pkg.fallback || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}';">
                <div class="absolute inset-0 bg-gradient-to-t from-[#09111e] via-[#09111e]/40 to-transparent"></div>
                <div class="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                  <span class="px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-amber-400 text-[10px] font-bold border border-slate-700/80">
                    <i class="fa-solid fa-tag mr-1"></i>${pkg.badge}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-emerald-400 text-[10px] font-bold border border-slate-700/80">
                    <i class="fa-solid fa-clock mr-1"></i>${pkg.duration}
                  </span>
                </div>
                <div class="absolute bottom-3 left-3 right-3">
                  <h4 class="text-base sm:text-lg font-bold text-white font-heading drop-shadow-md leading-tight">${pkg.title}</h4>
                </div>
              </div>

              <div class="p-4 sm:p-5 space-y-3">
                <p class="text-xs text-slate-300 leading-relaxed">${pkg.description}</p>
                
                <div class="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-1.5">
                  <div class="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <i class="fa-solid fa-star text-[10px]"></i> ${isSi ? 'සංචාරක විශේෂතා සහ ඇතුළත් දෑ' : 'Tour Highlights & Inclusions'}
                  </div>
                  <ul class="text-[11px] text-slate-300 space-y-1">
                    ${pkg.highlights.map(h => `<li class="flex items-start space-x-1.5"><i class="fa-solid fa-check text-amber-400 mt-0.5 text-[10px] flex-shrink-0"></i><span>${h}</span></li>`).join('')}
                  </ul>
                </div>

                ${pkg.stay ? `
                <div class="flex items-center space-x-2 text-[11px] text-slate-400 pt-1">
                  <i class="fa-solid fa-hotel text-amber-400/80"></i>
                  <span><strong class="text-slate-300">${isSi ? 'නවාතැන්:' : 'Stay:'}</strong> ${pkg.stay}</span>
                </div>
                ` : ''}
              </div>
            </div>

            <div class="p-4 sm:p-5 pt-0 border-t border-slate-800/80 mt-2">
              <div class="flex items-baseline justify-between pt-3 pb-3">
                <div>
                  <span class="text-[10px] text-slate-400 block uppercase tracking-wider">${isSi ? 'ආරම්භක මිල' : 'Starting from'}</span>
                  <div class="flex items-baseline gap-1.5 flex-wrap">
                    <span class="price-aed text-lg sm:text-xl font-black text-amber-400 font-heading" data-base-aed="${pkg.priceAED}">${formattedPrice}</span>
                  </div>
                  <span class="text-[10px] text-slate-400">${isSi ? '/ පුද්ගලයෙකුට' : '/ person'}</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-emerald-400 font-semibold block">${isSi ? `හෝ Tabby මගින් 4x ${formattedInstallment}` : `Tabby 4x ${formattedInstallment}/mo`}</span>
                  <span class="text-[9px] text-slate-500">${isSi ? 'බදු සහ ප්‍රවාහන ගාස්තු ඇතුළත්ය' : 'Taxes & Transfers Included'}</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <a href="https://wa.me/971527582293?text=${encodeURIComponent(pkg.whatsappMsg)}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/20">
                  <i class="fa-brands fa-whatsapp text-sm"></i>
                  <span>${isSi ? 'විමසන්න' : 'Inquire Package'}</span>
                </a>
                <a href="packages.html" class="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center justify-center" title="Full Itinerary">
                  <span>${isSi ? 'විස්තර' : 'Itinerary'}</span>
                  <i class="fa-solid fa-arrow-right text-[10px] ml-1"></i>
                </a>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeCountryPackagesModal() {
  const modal = document.getElementById('countryPackagesModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

window.openCountryPackages = openCountryPackages;
window.closeCountryPackagesModal = closeCountryPackagesModal;

/* ==========================================================================
   Roxaval-style Interactive Destinations Showcase Slider Controller
   ========================================================================== */
const POPULAR_DESTINATIONS_SLIDES = [
  {
    id: 'sigiriya-kandy',
    title: 'Sigiriya & Kandy',
    subtitle: 'Cultural Triangle & Ancient Citadels',
    category: 'Cultural',
    categoryIcon: 'fa-landmark',
    rating: '5.0',
    reviews: '340+ reviews',
    duration: '5 Days / 4 Nights',
    priceAED: 2250,
    countryKey: 'srilanka',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
    description: 'Ascend the legendary 5th-century UNESCO Sigiriya Lion Rock Fortress rising 200 meters above emerald jungle canopies. Wander through celestial royal water gardens, marvel at golden Dambulla Rock Cave temples, and witness the sacred evening puja at the Temple of the Sacred Tooth Relic in Kandy.',
    highlights: [
      'Sigiriya 5th-Century Lion Rock Fortress',
      'Golden Dambulla Rock Cave Temple Complex',
      'Temple of the Sacred Tooth Relic (Kandy)',
      'Polonnaruwa Ancient Kingdom Royal Ruins'
    ],
    whatsappMsg: 'Hi Star Plus, I am interested in the Sigiriya & Kandy Cultural Triangle tour package (AED 2,250/person).'
  },
  {
    id: 'ella-nuwaraeliya',
    title: 'Ella & Nuwara Eliya',
    subtitle: 'Misty Highlands & Alpine Tea Valleys',
    category: 'Hill Country',
    categoryIcon: 'fa-mountain',
    rating: '5.0',
    reviews: '420+ reviews',
    duration: '5 Days / 4 Nights',
    priceAED: 2050,
    countryKey: 'srilanka',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    description: 'Board the world-famous blue train as it weaves across misty valleys and the iconic Demodara Nine Arch Bridge. Savor world-renowned Ceylon tea in the cool alpine estates of "Little England", marvel at roaring waterfalls, and stand above the clouds at World’s End precipice in Horton Plains.',
    highlights: [
      'Scenic Blue Train across Demodara Nine Arch Bridge',
      'Ceylon Tea Factory Tour & Fresh Estate Tasting',
      'Horton Plains & 880m World’s End Cliff Drop',
      'Little Adam’s Peak & Ravana Waterfall Summit'
    ],
    whatsappMsg: 'Hi Star Plus, I would like to book the Ella & Nuwara Eliya Hill Country package (AED 2,050/person).'
  },
  {
    id: 'dubai-experience',
    title: 'Dubai & Abu Dhabi',
    subtitle: '3N / 4D Signature Family Experience',
    category: 'Luxury City',
    categoryIcon: 'fa-city',
    rating: '5.0',
    reviews: '510+ reviews',
    duration: '4 Days / 3 Nights',
    priceAED: 1850,
    countryKey: 'dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    description: 'Immerse your family in the glittering capital of modern luxury. Enjoy 4-star deluxe comfort at Avani Deira Hotel with daily buffet breakfast, take in 360° panoramic views from Burj Khalifa At The Top (124th/125th floor), sail Dubai Marina on a 5-star dhow dinner cruise with Tanoura dance, and conquer the Lahbab red dunes on a VIP 4x4 desert safari.',
    highlights: [
      'Avani Deira Dubai 4-Star Hotel Stay + Breakfast',
      'Burj Khalifa 124th/125th Floor Observation Deck',
      'Dubai Marina Luxury Dhow Dinner Cruise & Show',
      'VIP 4x4 Desert Safari, Camel Rides & BBQ Dinner'
    ],
    whatsappMsg: 'Hi Star Plus, I am interested in the 3N/4D Dubai Family Package with Avani Deira Hotel (AED 1,850/person).'
  },
  {
    id: 'yala-wildlife',
    title: 'Yala & Sinharaja',
    subtitle: 'Leopard Safari & Virgin Rainforest',
    category: 'Wildlife',
    categoryIcon: 'fa-paw',
    rating: '4.9',
    reviews: '280+ reviews',
    duration: '5 Days / 4 Nights',
    priceAED: 2150,
    countryKey: 'srilanka',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80',
    description: 'Venture into the heart of Sri Lanka’s untamed wilderness. Embark on custom 4x4 open-top jeep safaris in Yala National Park, tracking the highest density of wild leopards in the world. Trek beneath the ancient canopy of UNESCO Sinharaja Virgin Rainforest, visit orphaned elephants at Udawalawe, and set sail on ocean blue whale encounters in Mirissa.',
    highlights: [
      'Yala National Park Big-Game Leopard Safari',
      'Sinharaja UNESCO Virgin Rainforest Biosphere Trek',
      'Udawalawe Elephant Transit Home Wild Rehab',
      'Mirissa Blue Whale & Dolphin Ocean Safari'
    ],
    whatsappMsg: 'Hi Star Plus, I am interested in the Yala & Sinharaja Wildlife package (AED 2,150/person).'
  },
  {
    id: 'galle-downsouth',
    title: 'Galle & Down South',
    subtitle: 'Golden Coastlines & Colonial Ramparts',
    category: 'Beach & Coastal',
    categoryIcon: 'fa-umbrella-beach',
    rating: '4.9',
    reviews: '315+ reviews',
    duration: '4 Days / 3 Nights',
    priceAED: 1890,
    countryKey: 'srilanka',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    description: 'Unwind along Sri Lanka’s sun-kissed southern coastline. Wander the historic ramparts, lighthouse, and cobblestone boutiques of the 17th-century UNESCO Galle Dutch Fort. Cruise through mangrove tunnels on the Madu River boat safari, participate in sea turtle conservation at Kosgoda, and surf the idyllic golden waves of Weligama and Mirissa.',
    highlights: [
      'UNESCO Galle Dutch Fort & Heritage Lighthouse Walk',
      'Bentota Watersports & Madu River Boat Safari',
      'Mirissa Secret Beach & Weligama Surfing Coast',
      'Kosgoda Sea Turtle Conservation Project'
    ],
    whatsappMsg: 'Hi Star Plus, I would like to book the Galle & Down South Beach package (AED 1,890/person).'
  }
];

let currentDestSlideIndex = 0;

function initDestinationSlider() {
  const track = document.getElementById('destCardsTrack');
  const showcase = document.getElementById('destinationsShowcase');
  if (!track || !showcase) return;

  const currentLang = typeof getPreferredLanguage === 'function' ? getPreferredLanguage() : (localStorage.getItem('site_lang') || 'en');
  const slides = (currentLang === 'si' && typeof getLocalizedPopularDestinations === 'function') ? getLocalizedPopularDestinations(POPULAR_DESTINATIONS_SLIDES, 'si') : POPULAR_DESTINATIONS_SLIDES;

  // Render Horizontal Cards
  track.innerHTML = slides.map((slide, idx) => {
    const formattedPrice = typeof formatPrice === 'function' ? formatPrice(slide.priceAED) : `AED ${slide.priceAED.toLocaleString()}`;
    return `
      <div class="dest-preview-card ${idx === 0 ? 'active' : ''}" 
           data-slide-index="${idx}" 
           onclick="goToDestinationSlide(${idx})"
           role="button"
           tabindex="0"
           aria-label="Select destination ${slide.title}">
        <img src="${slide.thumbnail}" alt="${slide.title}" class="w-full h-full object-cover transition-transform duration-700 pointer-events-none" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';">
        <div class="absolute inset-0 bg-gradient-to-t from-[#070e17] via-[#070e17]/40 to-transparent pointer-events-none"></div>
        
        <!-- Category Badge -->
        <div class="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-amber-400 text-[11px] font-bold border border-slate-700/80 flex items-center gap-1.5 shadow-md">
          <i class="fa-solid ${slide.categoryIcon} text-[10px]"></i>
          <span>${slide.category}</span>
        </div>

        <!-- Bottom Card Info -->
        <div class="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
          <div class="flex items-center text-amber-400 text-[11px] gap-1 mb-1.5">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <span class="text-white font-bold ml-1">${slide.rating}</span>
          </div>
          <h4 class="text-base sm:text-lg font-bold text-white font-heading leading-tight drop-shadow-md">${slide.title}</h4>
          <div class="flex items-center justify-between text-[11px] text-slate-300 mt-1 font-medium">
            <span>${slide.duration}</span>
            <div class="text-right">
              <span class="price-aed text-amber-400 font-bold" data-base-aed="${slide.priceAED}">${formattedPrice}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Render Dots
  const dotsContainer = document.getElementById('sliderDots');
  const totalElem = document.getElementById('sliderTotalCount');
  if (dotsContainer) {
    dotsContainer.innerHTML = POPULAR_DESTINATIONS_SLIDES.map((_, idx) => `
      <button class="dest-dot ${idx === 0 ? 'active' : ''}" 
              onclick="goToDestinationSlide(${idx})"
              aria-label="Go to destination ${idx + 1}"></button>
    `).join('');
  }
  if (totalElem) {
    totalElem.textContent = String(POPULAR_DESTINATIONS_SLIDES.length).padStart(2, '0');
  }

  // Bind custom prev/next controls
  bindDestinationControls();

  // Initialize initial slide
  updateActiveSlideUI(0, false);
}

function updateActiveSlideUI(index, animate = true) {
  const currentLang = typeof getPreferredLanguage === 'function' ? getPreferredLanguage() : (localStorage.getItem('site_lang') || 'en');
  const rawSlide = POPULAR_DESTINATIONS_SLIDES[index];
  if (!rawSlide) return;
  const slide = (currentLang === 'si' && typeof getLocalizedDestinationSlide === 'function') ? getLocalizedDestinationSlide(rawSlide, 'si') : rawSlide;

  const bgImg = document.getElementById('sliderBgImage');
  const titleElem = document.getElementById('sliderActiveTitle');
  const subtitleElem = document.getElementById('sliderActiveSubtitle');
  const ratingElem = document.getElementById('sliderActiveRating');
  const reviewsElem = document.getElementById('sliderActiveReviews');
  const durationElem = document.getElementById('sliderActiveDuration');
  const descElem = document.getElementById('sliderActiveDesc');
  const highlightsElem = document.getElementById('sliderActiveHighlights');
  const whatsAppBtn = document.getElementById('sliderWhatsAppBtn');
  const currentIdxElem = document.getElementById('sliderCurrentIndex');

  // Background Image smooth transition
  if (bgImg) {
    if (animate) {
      bgImg.style.opacity = '0.35';
      bgImg.classList.add('zoom');
      setTimeout(() => {
        bgImg.src = slide.image;
        bgImg.style.opacity = '1';
        bgImg.classList.remove('zoom');
      }, 180);
    } else {
      bgImg.src = slide.image;
      bgImg.style.opacity = '1';
    }
  }

  // Text Animation
  if (animate) {
    if (titleElem) {
      titleElem.classList.remove('dest-text-fade');
      void titleElem.offsetWidth; // Trigger reflow
      titleElem.classList.add('dest-text-fade');
    }
    if (descElem) {
      descElem.classList.remove('dest-text-fade');
      void descElem.offsetWidth;
      descElem.classList.add('dest-text-fade');
    }
  }

  if (titleElem) titleElem.textContent = slide.title;
  if (subtitleElem) {
    subtitleElem.innerHTML = `<i class="fa-solid ${slide.categoryIcon} text-amber-400 mr-1.5"></i>${slide.subtitle}`;
  }
  if (ratingElem) ratingElem.textContent = slide.rating;
  if (reviewsElem) reviewsElem.textContent = slide.reviews;
  if (durationElem) durationElem.textContent = slide.duration;
  if (descElem) descElem.textContent = slide.description;

  if (highlightsElem && slide.highlights) {
    highlightsElem.innerHTML = slide.highlights.map(h => `
      <div class="flex items-center space-x-2">
        <i class="fa-solid fa-circle-check text-amber-400 text-xs flex-shrink-0"></i>
        <span class="truncate">${h}</span>
      </div>
    `).join('');
  }

  if (whatsAppBtn) {
    whatsAppBtn.href = `https://wa.me/971527582293?text=${encodeURIComponent(slide.whatsappMsg)}`;
  }

  if (currentIdxElem) {
    currentIdxElem.textContent = String(index + 1).padStart(2, '0');
  }

  // Update card active classes
  const cards = document.querySelectorAll('.dest-preview-card');
  cards.forEach((c, idx) => {
    if (idx === index) {
      c.classList.add('active');
      // Scroll into view within horizontal track
      c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      c.classList.remove('active');
    }
  });

  // Update dots
  const dots = document.querySelectorAll('.dest-dot');
  dots.forEach((d, idx) => {
    if (idx === index) {
      d.classList.add('active');
    } else {
      d.classList.remove('active');
    }
  });
}

function goToDestinationSlide(index) {
  if (index < 0 || index >= POPULAR_DESTINATIONS_SLIDES.length) return;
  currentDestSlideIndex = index;
  updateActiveSlideUI(index, true);
}

function nextDestinationSlide() {
  const nextIdx = (currentDestSlideIndex + 1) % POPULAR_DESTINATIONS_SLIDES.length;
  goToDestinationSlide(nextIdx);
}

function prevDestinationSlide() {
  const prevIdx = (currentDestSlideIndex - 1 + POPULAR_DESTINATIONS_SLIDES.length) % POPULAR_DESTINATIONS_SLIDES.length;
  goToDestinationSlide(prevIdx);
}

function handleSliderExplore() {
  const currentSlide = POPULAR_DESTINATIONS_SLIDES[currentDestSlideIndex];
  if (!currentSlide) return;

  if (currentSlide.countryKey && typeof openCountryPackages === 'function') {
    openCountryPackages(currentSlide.countryKey);
  } else {
    window.location.href = 'packages.html';
  }
}

window.initDestinationSlider = initDestinationSlider;
window.goToDestinationSlide = goToDestinationSlide;
window.nextDestinationSlide = nextDestinationSlide;
window.prevDestinationSlide = prevDestinationSlide;
window.handleSliderExplore = handleSliderExplore;

/* ==========================================================================
   LEVEL 2 & 3: Country-Specific Interactive Showcase & Itinerary Drawer System
   ========================================================================== */
const COUNTRY_SHOWCASE_DATA = {
  srilanka: {
    country: 'Sri Lanka Island Odyssey',
    badge: 'Cultural Triangle & Emerald Pearl',
    icon: 'fa-gem',
    categoryTag: 'POPULAR DESTINATIONS',
    tours: [
      {
        id: 'sl-wildlife-safari',
        title: 'Wildlife & Rainforest Tour',
        subtitle: 'DISCOVER THE UNTAMED BEAUTY OF SRI LANKA',
        category: 'Safari & Nature',
        categoryIcon: 'fa-paw',
        rating: '4.9',
        reviews: '280+ reviews',
        duration: '5 Days / 4 Nights',
        priceAED: 2150,
        highlightTags: ['🐆 Leopard Safari', '🐘 Udawalawe Sanctuary', '🌿 Sinharaja Rainforest', '🦩 Bundala Bird Sanctuary'],
        keyStops: ['Yala Safari', 'Sinharaja Forest', 'Udawalawe'],
        destinations: ['Yala Safari', 'Sinharaja Forest', 'Udawalawe'],
        placesCovered: [
          {
            name: 'Yala National Park',
            tagline: 'Leopard Safari & Wilderness',
            category: '— UNTAMED BIG GAME & LEOPARDS',
            description: 'Roam through scrub jungle and granite rock outcrops harboring the world\'s highest leopard density. Track sloth bears, spotted deer, and wild elephants on private 4x4 safaris.',
            checkmarks: ['High-Density Wild Leopard Tracking', 'Custom Open-Top 4x4 Safari Game Drives', 'Sloth Bears, Crocodiles & Birdlife'],
            image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80'
          },
          {
            name: 'Sinharaja Rainforest',
            tagline: 'UNESCO Rainforest Trek',
            category: '— PRIMARY TROPICAL RAINFOREST',
            description: 'Trek beneath the towering verdant canopy of Sri Lanka\'s last viable primary tropical rainforest. Encounter rare endemic songbirds, cascading jungle waterfalls, and giant tree ferns.',
            checkmarks: ['UNESCO Primary Lowland Rainforest', 'Endemic Bird Mixed Feeding Flocks', 'Hidden Canopy Waterfalls & Streams'],
            image: 'assets/packages/sl-sinharaja-rainforest.jpg'
          },
          {
            name: 'Udawalawe Sanctuary',
            tagline: 'Elephant Transit Home',
            category: '— ELEPHANT REFUGE & RESERVOIRS',
            description: 'Witness majestic Asian elephant herds roaming savannah grasslands, and observe rehabilitated orphaned baby elephants during their milk-bottle feeding sessions.',
            checkmarks: ['Baby Elephant Transit Home Feeding', 'Thriving Asian Elephant Herds', 'Udawalawe Reservoir Scenic Vistas'],
            image: 'assets/packages/sl-asian-elephants-minneriya.jpg'
          }
        ],
        stay: '4 Nights in Luxury Safari Tented Camps & Eco-Lodges (Chena Huts / Rainforest Edge)',
        gallery: [
          {
            image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 3: Yala Big-Game Leopard on Rock',
            title: 'Yala National Park Leopard Safari'
          },
          {
            image: 'assets/packages/sl-sinharaja-rainforest.jpg',
            tag: '📍 Day 1: Sinharaja Rainforest Canopy',
            title: 'UNESCO Sinharaja Biosphere'
          },
          {
            image: 'assets/packages/sl-asian-elephants-minneriya.jpg',
            tag: '📍 Day 2: Udawalawe Elephant Sanctuary',
            title: 'Elephant Transit Home'
          },
          {
            image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 4: Sri Lankan Wild Elephant Gathering',
            title: 'Wild Elephant Herds'
          }
        ],
        image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80',
        description: 'Track the highest leopard density on the planet with customized 4x4 open-top jeep safaris in Yala and Wilpattu. Trek beneath the ancient prehistoric canopy of UNESCO Sinharaja Virgin Rainforest, observe wild elephant rehabilitation at Udawalawe, and spot rare migratory wetland birds at Bundala.',
        checklist: [
          'Yala National Park Big-Game Leopard 4x4 Safari',
          'Udawalawe Elephant Transit Home & Orphan Rehabilitation',
          'Sinharaja UNESCO Virgin Rainforest Canopy Trek',
          'Bundala Wetland Migratory Bird Sanctuary',
          'Wilpattu Dense Forest Sloth Bear & Leopard Safari'
        ],
        inclusions: [
          '4 Nights luxury safari tented camp & eco-lodge accommodation',
          'Daily buffet breakfast and bush dinners under the stars',
          'Private 4x4 open-top safari jeeps with expert wildlife trackers and park rangers',
          'All National Park entrance fees, conservation permits, and tracker tips',
          'Guided Sinharaja rainforest nature walk with certified naturalist',
          'Private AC transfers between all national reserves',
          'Emirates flight booking assistance',
          '24/7 dedicated on-trip concierge'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival & Transfer to Sinharaja Rainforest Biosphere',
            desc: 'Meet your guide at Colombo Airport and drive to the fringes of the UNESCO Sinharaja Rainforest. Settle into your eco-lodge serenaded by jungle bird calls. Evening nocturnal nature walk.'
          },
          {
            day: 2,
            title: 'Sinharaja Deep Forest Trek & Udawalawe Elephant Home',
            desc: 'Embark on a guided morning trek beneath the ancient canopy of Sinharaja, spotting endemic birds, purple-faced langurs, and hidden streams. Afternoon drive to Udawalawe to witness baby elephant milk feeding at the Elephant Transit Home.'
          },
          {
            day: 3,
            title: 'Yala National Park Big-Game Afternoon Safari',
            desc: 'Check in to your luxury safari tented camp near Yala. Board your custom 4x4 open safari jeep for an intensive game drive in Yala Block 1, home to the world\'s densest wild leopard population, sloth bears, and crocodiles.'
          },
          {
            day: 4,
            title: 'Dawn Leopard Tracking & Bundala Bird Sanctuary',
            desc: 'Early morning game drive at first light when big cats are most active on the granite rocks. In the afternoon, visit the coastal wetlands of Bundala National Park, a UNESCO Biosphere sanctuary hosting thousands of migratory flamingos and waterfowl.'
          },
          {
            day: 5,
            title: 'Southern Coastal Drive & Colombo Airport Departure',
            desc: 'Enjoy a leisurely breakfast listening to peacocks in the bush. Take the southern expressway back to Colombo Airport for your departure flight.'
          }
        ],
        finePrint: [
          'Yala Block 1 undergoes annual dry-season maintenance in Sept/Oct; safaris redirected to Block 5/Lunugamvehera.',
          'Neutral clothing (khaki, olive, brown) recommended for all wildlife game drives.',
          'Safari jeeps are fully insured and operated by certified professional trackers.',
          '0% Tabby installment financing options available.'
        ],
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Wildlife & Rainforest Tour'
      },
      {
        id: 'sl-galle-south',
        title: 'Down South Beach Tour',
        subtitle: 'GOLDEN BEACHES, SURFING & COASTAL CHARM',
        category: 'Coastal Escape',
        categoryIcon: 'fa-umbrella-beach',
        rating: '4.9',
        reviews: '315+ reviews',
        duration: '4 Days / 3 Nights',
        priceAED: 1890,
        highlightTags: ['🏖️ Mirissa & Bentota Beach', '🏰 UNESCO Galle Dutch Fort', '🚤 Madu River Safari', '🐢 Turtle Conservation'],
        keyStops: ['Bentota', 'Galle Fort', 'Mirissa Beach'],
        destinations: ['Bentota', 'Galle Fort', 'Mirissa Beach'],
        placesCovered: [
          {
            name: 'Galle Dutch Fort',
            tagline: 'Lighthouse & Ramparts',
            category: '— UNESCO SOUTHERN COASTAL FORTRESS',
            description: 'Stroll the 17th-century coral ramparts and cobblestone paths of UNESCO Galle Dutch Fort, admire the iconic colonial lighthouse, and watch waves crash against Flag Rock bastion.',
            checkmarks: ['UNESCO 17th-Century Ramparts Walk', 'Iconic White Colonial Lighthouse', 'Cobblestone Alleys & Artisan Boutiques'],
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80'
          },
          {
            name: 'Mirissa Coastal Bay',
            tagline: 'Whale Watching & Coconut Tree Hill',
            category: '— TROPICAL OCEAN HAVEN & PALM HILL',
            description: 'Scale the picturesque palm-crowned mound of Coconut Tree Hill for panoramic Indian Ocean vistas, relax on golden crescent sands, and embark on early morning blue whale watching safaris.',
            checkmarks: ['Coconut Tree Hill Panoramic Viewpoint', 'Blue Whale & Dolphin Yacht Safaris', 'Sunset Golden Sand Beach Dining'],
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
          },
          {
            name: 'Bentota & Madu River',
            tagline: 'Water Sports & River Safari',
            category: '— LAGOON WATERWAYS & GOLDEN SHORES',
            description: 'Cruise through lush mangrove tunnels on the serene Madu River safari, explore traditional cinnamon processing islands, and enjoy jet-skiing or windsurfing on Bentota lagoon.',
            checkmarks: ['Madu Ganga Mangrove River Safari', 'Cinnamon Island & Natural Fish Spa', 'Lagoon Watersports & Golden Coast'],
            image: 'assets/packages/sl-bentota-beach.jpg'
          }
        ],
        stay: '3 Nights at 4-Star & 5-Star Beachfront Resort (Amari Galle / Heritance Ahungalla)',
        gallery: [
          {
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 2: UNESCO Galle Dutch Fort & Lighthouse',
            title: 'Historic Galle Dutch Fort'
          },
          {
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 3: Mirissa Coconut Tree Hill & Harbor',
            title: 'Mirissa Coastal Viewpoint'
          },
          {
            image: 'assets/packages/sl-bentota-beach.jpg',
            tag: '📍 Day 1: Bentota Golden Coast Beach',
            title: 'Bentota Golden Beach'
          },
          {
            image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 4: Madu River Mangrove Boat Safari',
            title: 'Madu River Mangroves'
          }
        ],
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
        description: 'Unwind along Sri Lanka\'s sun-drenched southern coastline. Stroll the 17th-century ramparts and cobblestone paths of UNESCO World Heritage Galle Dutch Fort, watch stilt fishermen at Koggala, catch premier surf breaks at Weligama and Hiriketiya, and cruise through mangrove tunnels on the Madu River boat safari.',
        checklist: [
          'UNESCO Galle Dutch Fort & Lighthouse Ramparts',
          'Mirissa Secret Beach & Whale Watching Harbor',
          'Unawatuna Japanese Peace Pagoda & Jungle Beach',
          'Hikkaduwa Coral Reef & Sea Turtle Sanctuary',
          'Bentota & Madu River Mangrove Boat Safari'
        ],
        inclusions: [
          '3 Nights accommodation at 4-Star Beachfront Resort in Galle/Bentota',
          'Daily International Buffet Breakfast',
          'Private Air-Conditioned luxury vehicle with English-speaking Chauffeur Guide',
          'Roundtrip Colombo Airport (CMB) private transfers',
          'Madu River Mangrove Boat Safari with Fish Spa Experience',
          'UNESCO Galle Dutch Fort & Lighthouse guided walking tour',
          'Emirates flight booking assistance & complimentary visa guidance',
          '24/7 dedicated on-trip concierge support'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Sri Lanka & Scenic Coastal Highway Transfer',
            desc: 'Warm VIP welcome at Colombo Bandaranaike International Airport (CMB). Meet your dedicated English-speaking chauffeur guide and transfer along the southern expressway to your beachfront resort in Bentota/Galle. Enjoy sunset ocean breezes and an evening at leisure.'
          },
          {
            day: 2,
            title: 'UNESCO Galle Dutch Fort & Madu River Mangrove Safari',
            desc: 'Embark on a private boat safari through the mangrove tunnels of the Madu River, visiting Cinnamon Island and experiencing natural fish therapy. Continue to the historic 17th-century Galle Dutch Fort; explore cobblestone alleys, boutique cafes, the iconic lighthouse, and rampart viewpoints at sunset.'
          },
          {
            day: 3,
            title: 'Mirissa Coastal Wonders, Stilt Fishermen & Beachside Dining',
            desc: 'Visit the picturesque coconut tree hill of Mirissa and observe the iconic traditional stilt fishermen of Koggala. Option for seasonal whale watching or relaxing at Hiriketiya beach. Savor a fresh seafood dinner right on the golden sands under the stars.'
          },
          {
            day: 4,
            title: 'Sea Turtle Conservation Project & Airport Departure',
            desc: 'Enjoy a leisurely breakfast overlooking the Indian Ocean. Visit the Kosgoda Sea Turtle Conservation Project to learn about endangered turtle rehabilitation. Scenic transfer back to Colombo Airport for your departure flight.'
          }
        ],
        finePrint: [
          'Rates are based on double/twin sharing per person.',
          'Standard hotel check-in is 14:00 hrs; check-out is 12:00 hrs.',
          'Whale watching excursion operates seasonally from November through April.',
          'Valid passport with at least 6 months validity and Sri Lanka ETA required.',
          'Flexible booking with 0% Tabby installment options available upon checkout.'
        ],
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Down South Beach Tour'
      },
      {
        id: 'sl-jaffna-north',
        title: 'Jaffna & Northern Tour',
        subtitle: 'UNVEILING THE RICH HERITAGE OF THE NORTH',
        category: 'Heritage & Culture',
        categoryIcon: 'fa-place-of-worship',
        rating: '4.8',
        reviews: '190+ reviews',
        duration: '4 Days / 3 Nights',
        priceAED: 1950,
        highlightTags: ['🛕 Nallur Golden Kovil', '🏰 Jaffna Dutch Fort', '🐎 Delft Island Wild Horses', '⛵ Sacred Nainativu Ferry'],
        keyStops: ['Nallur Temple', 'Jaffna Fort', 'Delft Island'],
        destinations: ['Nallur Temple', 'Jaffna Fort', 'Delft Island'],
        placesCovered: [
          {
            name: 'Nallur Kandaswamy Kovil',
            tagline: 'Sacred Golden Hindu Temple',
            category: '— NORTHERN SPIRITUAL JEWEL',
            description: 'Immerse yourself in the spiritual atmosphere of Jaffna\'s grandest Hindu temple, featuring a soaring golden Gopuram tower, sacred brass shrines, and devotional morning rituals.',
            checkmarks: ['Soaring Golden Gopuram Entrance', 'Devotional Morning & Evening Pujas', 'Sacred Temple Water Tank & Courtyard'],
            image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80'
          },
          {
            name: 'Jaffna Dutch Fort',
            tagline: 'Star-Shaped Coastal Fortress',
            category: '— HISTORIC NORTHERN CITADEL',
            description: 'Explore the expansive star-shaped limestone fortress built by the Portuguese and expanded by the Dutch in the 17th century overlooking the serene Jaffna lagoon.',
            checkmarks: ['17th-Century Star-Shaped Ramparts', 'Panoramic Jaffna Lagoon Views', 'Restored Colonial Armory & Bastions'],
            image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
          },
          {
            name: 'Casuarina Beach',
            tagline: 'Shallow Sands & Coastal Palms',
            category: '— KARAINAGAR PENINSULA COAST',
            description: 'Wade into shallow, calm turquoise waters framed by slender casuarina trees on Karainagar Island, renowned as one of Northern Sri Lanka\'s most tranquil and family-friendly beaches.',
            checkmarks: ['Calm Shallow Indian Ocean Waters', 'Shaded Casuarina Tree Groves', 'Karainagar Causeway Scenic Drive'],
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
          },
          {
            name: 'Nagadeepa Island',
            tagline: 'Nainativu Temple Ferry Crossing',
            category: '— SACRED MULTI-FAITH ISLAND',
            description: 'Board traditional wooden passenger ferries across the Palk Strait to Nainativu Island, home to both the revered Buddhist Nagadeepa Purana Viharaya and the ornate Nagapooshani Amman Kovil.',
            checkmarks: ['Palk Strait Passenger Boat Crossing', 'Nagadeepa Buddhist Stupa & Shrine', 'Nagapooshani Amman Kovil Sanctum'],
            image: 'assets/packages/sl-delft-island.jpg'
          }
        ],
        stay: '3 Nights at Premier Heritage Boutique Hotel (Jetwing Jaffna / Fox Resort Jaffna)',
        gallery: [
          {
            image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 2: Golden Nallur Kandaswamy Kovil',
            title: 'Nallur Kandaswamy Kovil'
          },
          {
            image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 1: Star-Shaped Jaffna Dutch Fort',
            title: 'Jaffna Dutch Fort'
          },
          {
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 4: Casuarina Beach & Northern Coastline',
            title: 'Casuarina Beach & Coast'
          },
          {
            image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 3: Minneriya / Yala Wild Elephants',
            title: 'Sri Lanka Wildlife & Elephants'
          }
        ],
        image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
        description: 'Discover the vibrant Tamil cultural capital of Northern Sri Lanka. Experience spiritual reverence at the golden Nallur Kandaswamy Kovil, explore the star-shaped Dutch fort, take scenic ferries across the Palk Strait to sacred Nagadeepa Temple, and witness wild horses on remote coral-walled Delft Island.',
        checklist: [
          'Star-Shaped Historic Jaffna Dutch Fort & Ramparts',
          'Golden Nallur Kandaswamy Kovil Puja Experience',
          'Nagadeepa (Nainativu) Island Ferry Crossing',
          'Delft Island Wild Horses & Ancient Baobab Tree',
          'Keerimalai Sacred Natural Healing Springs'
        ],
        inclusions: [
          '3 Nights stay at premier heritage boutique hotel in Jaffna City',
          'Daily traditional Northern Ceylon breakfast and Jaffna crab curry dinner',
          'Private AC vehicle throughout with regional specialist chauffeur guide',
          'Public and speed ferry boat transfers to Nainativu & Delft Islands',
          'Jaffna Dutch Fort and historical site entrance permits',
          'Emirates flight booking assistance',
          '24/7 travel concierge support'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Gateway to the North & Jaffna Dutch Fort',
            desc: 'Cross Elephant Pass into the Jaffna Peninsula. Check in to your boutique city hotel. Afternoon walking tour around the grand star-shaped Jaffna Dutch Fort and restored colonial public library. Taste the famous Jaffna mango ice cream at Rio.'
          },
          {
            day: 2,
            title: 'Nallur Kandaswamy Kovil & Heritage Discovery',
            desc: 'Witness the morning temple ceremonies and rhythmic drumming at the magnificent golden Nallur Kandaswamy Kovil. Visit the historic ruins of the Jaffna Kingdom (Sangiliyan Thoranam) and explore bustling local bazaars filled with Palmyra sweets and spices.'
          },
          {
            day: 3,
            title: 'Island Hopping: Nainativu & Delft Island',
            desc: 'Drive to Kurikadduwan jetty and take the ferry to sacred Nainativu island to visit Nagadeepa Buddhist Vihara and Nagapooshani Amman Hindu Kovil. Continue to remote Delft Island to see wild descendant horses of Portuguese cavalry, coral wall lanes, and the colossal ancient Baobab tree.'
          },
          {
            day: 4,
            title: 'Keerimalai Healing Springs, Point Pedro & Departure',
            desc: 'Visit Keerimalai Sacred Natural Springs overlooking the Palk Strait and stand at Point Pedro, the northernmost point of Sri Lanka. Transfer to Jaffna station for the luxury air-conditioned express train or drive south to Colombo Airport.'
          }
        ],
        finePrint: [
          'Conservative clothing required at temples (men remove shirts at Nallur inner sanctum).',
          'Island boat ferries are subject to sea weather and maritime authority scheduling.',
          '0% Tabby installment financing options available.'
        ],
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Jaffna & Northern Tour'
      },
      {
        id: 'sl-sigiriya-cultural',
        title: 'Cultural & Highlands Tour',
        subtitle: 'ANCIENT CITADELS, SACRED TEMPLES & TEA HIGHLANDS',
        category: 'Heritage & Highlands',
        categoryIcon: 'fa-landmark',
        rating: '5.0',
        reviews: '480+ reviews',
        duration: '5 Days / 4 Nights',
        priceAED: 2250,
        highlightTags: ['🦁 Sigiriya Lion Rock', '👑 Kandy Temple of Tooth', '🍃 Nuwara Eliya Tea Hills', '🌉 Ella Nine Arch Bridge'],
        keyStops: ['Sigiriya Rock', 'Kandy Temple', 'Nuwara Eliya', 'Ella Nine Arch'],
        destinations: ['Sigiriya Rock', 'Kandy Temple', 'Nuwara Eliya', 'Ella Nine Arch'],
        placesCovered: [
          {
            name: 'Sigiriya Rock Fortress',
            tagline: '5th-Century Lion Rock Citadel',
            category: '— CULTURAL TRIANGLE & SACRED CITADELS',
            description: 'Ascend the dramatic 200-meter sheer rock fortress built by King Kashyapa in the 5th century. Marvel at ancient maiden frescoes, the mirrored wall, and royal water gardens.',
            checkmarks: ['Lion Rock Summit Royal Palace Ruins', 'Mirror Wall & Ancient Fresco Murals', 'Symmetrical Landscaped Water Gardens'],
            image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80'
          },
          {
            name: 'Kandy Sacred Citadel',
            tagline: 'Temple of the Sacred Tooth Relic',
            category: '— LAST ROYAL CAPITAL & SACRED TOOTH',
            description: 'Visit the revered gold-roofed Temple of the Sacred Tooth Relic situated alongside scenic Kandy Lake, and experience the evening drumming puja ritual ceremony.',
            checkmarks: ['Golden Roofed Temple of the Tooth', 'Kandy Royal Lake & Palace Grounds', 'Evening Buddhist Puja Ceremonies'],
            image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=85'
          },
          {
            name: 'Nuwara Eliya Hills',
            tagline: 'Tea Plantations & Lake Gregory',
            category: '— LITTLE ENGLAND & TEA TERRACES',
            description: 'Wander through cool, misty highland tea estates, tour working British-era tea factories with tea tastings, and stroll along the scenic waterfront of Lake Gregory.',
            checkmarks: ['Rolling Ceylon Tea Estate Terraces', 'Lake Gregory Waterfront & Parks', 'Colonial Heritage & Fresh Highland Air'],
            image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
          },
          {
            name: 'Ella Mountain Pass',
            tagline: 'Nine Arch Bridge & Ella Gap',
            category: '— HIGHLAND VIADUCTS & WATERFALLS',
            description: 'Watch the iconic blue express train cross the 1921 Demodara Nine Arches Bridge surrounded by dense jungle, and hike to Little Adam\'s Peak for sweeping valley vistas.',
            checkmarks: ['1921 Stone Nine Arches Railway Viaduct', 'Little Adam\'s Peak 360° Panorama Hike', 'Thundering Ravana Waterfall Cascade'],
            image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
          }
        ],
        stay: '4 Nights at 4-Star & 5-Star Heritage Boutique Resorts (Heritance Kandalama / Grand Hotel Nuwara Eliya)',
        gallery: [
          {
            image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 2: Sigiriya 5th-Century Rock Citadel',
            title: 'Sigiriya Rock Fortress'
          },
          {
            image: 'assets/packages/sl-dambulla-cave-temple.jpg',
            tag: '📍 Day 4: Golden Dambulla Cave Temples',
            title: 'Dambulla Rock Temple'
          },
          {
            image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 4: Sacred Temple of the Tooth Kandy',
            title: 'Temple of the Tooth Relic'
          },
          {
            image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 3: Polonnaruwa Royal Palaces & Ruins',
            title: 'Ancient City of Polonnaruwa'
          }
        ],
        image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
        description: 'Journey through 2,500 years of royal Sri Lankan heritage. Scale the iconic 5th-century Lion Rock of Sigiriya, admire 150+ Buddha statues in Dambulla Cave Temples, explore the sprawling ruins of Anuradhapura and Polonnaruwa, and witness sacred relic ceremonies in Kandy.',
        checklist: [
          'Sigiriya 5th-Century Lion Rock Fortress Ascent',
          'Golden Dambulla Cave Temple Complex (150+ Statues)',
          'Anuradhapura Sacred Bodhi Tree & Monasteries',
          'Polonnaruwa Ancient Royal Kingdom Ruins',
          'Kandy Sacred Temple of the Tooth Relic'
        ],
        inclusions: [
          '4 Nights accommodation at 4-Star & 5-Star Heritage Boutique Resorts',
          'Daily buffet breakfast and authentic Ceylon dinners',
          'Private luxury AC transport with dedicated chauffeur guide',
          'VIP entrance tickets to Sigiriya Rock Fortress and Dambulla Cave Temples',
          'Temple of the Tooth Relic evening puja ritual entry',
          'Traditional village bullock cart tour with organic clay-pot lunch',
          'Emirates flight booking assistance & full visa concierge',
          '24/7 dedicated travel concierge'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Welcome to Sri Lanka & Transfer to Cultural Heartlands',
            desc: 'Arrival at Colombo Airport (CMB). Meet your chauffeur guide and drive into the heart of the Cultural Triangle. Check in to your eco-resort surrounded by tropical flora with views of the distant rock fortress.'
          },
          {
            day: 2,
            title: 'Climb 5th-Century Sigiriya Lion Rock & Village Experience',
            desc: 'Ascend the dramatic 200m monolithic citadel of Sigiriya in the crisp morning air. Marvel at ancient water gardens, royal frescoes, and the giant lion paws. Afternoon traditional village bullock cart ride and authentic rural home-cooked clay pot lunch.'
          },
          {
            day: 3,
            title: 'Polonnaruwa Ancient Kingdom Ruins & Minneriya Safari',
            desc: 'Cycle or tour the ancient royal capital of Polonnaruwa, exploring the Gal Vihara rock-cut Buddha sculptures and royal palaces. In the afternoon, embark on an open 4x4 jeep safari in Minneriya National Park to witness hundreds of wild Asian elephants at the lake reservoir.'
          },
          {
            day: 4,
            title: 'Dambulla Golden Caves, Spice Gardens & Royal Kandy',
            desc: 'Explore the 5 sacred cave shrines of Dambulla containing over 150 exquisite Buddha statues and intricate murals. Continue to Kandy with a fragrant spice garden stop. In the evening, attend the revered puja ceremony at the Temple of the Tooth Relic.'
          },
          {
            day: 5,
            title: 'Peradeniya Royal Botanical Gardens & Airport Departure',
            desc: 'Stroll through the sprawling Royal Botanical Gardens of Peradeniya, home to giant Javan fig trees and rare orchids. Panoramic Kandy lake drive before transferring to Colombo Airport for your departure flight.'
          }
        ],
        finePrint: [
          'Modest dress code required at sacred temple sites (shoulders and knees covered).',
          'Sigiriya climb involves approximately 1,200 steps; comfortable walking shoes recommended.',
          'Elephant gathering at Minneriya/Kaudulla depends on seasonal wildlife movement.',
          'Peak season supplement applies during festive dates and Kandy Esala Perahera.',
          '0% Tabby installment plans available.'
        ],
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Historical & Heritage Tour'
      },
      {
        id: 'sl-ella-nuwaraeliya',
        title: 'Mountains & Waterfalls Tour',
        subtitle: 'ESCAPE TO MISTY HILLS AND COOL GREEN VISTAS',
        category: 'Highlands & Nature',
        categoryIcon: 'fa-mountain',
        rating: '5.0',
        reviews: '420+ reviews',
        duration: '5 Days / 4 Nights',
        priceAED: 2050,
        highlightTags: ['🚂 Scenic Hill Train', '🌉 Nine Arches Bridge', '🍃 Ceylon Tea Terraces', '💧 Ravana Falls'],
        keyStops: ['Nuwara Eliya', 'Ella Nine Arch', 'Diyaluma Falls'],
        destinations: ['Nuwara Eliya', 'Ella Nine Arch', 'Diyaluma Falls'],
        stay: '4 Nights in Colonial Tea Estate Bungalows & Boutique Mountain Resorts (Grand Hotel Nuwara Eliya / 98 Acres)',
        gallery: [
          {
            image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 3: Demodara Nine Arches Bridge & Blue Train',
            title: 'Demodara Nine Arches Bridge'
          },
          {
            image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 1: Nuwara Eliya Highland Tea Terraces',
            title: 'Ceylon Tea Plantations'
          },
          {
            image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 4: Thundering Ravana Waterfall Cascade',
            title: 'Ravana Falls & Ella Gap'
          },
          {
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 2: Horton Plains & World\'s End Precipice',
            title: 'Horton Plains National Park'
          }
        ],
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        description: 'Ride the legendary blue train as it weaves across misty valleys and the architectural marvel of the Demodara Nine Arches Bridge. Wander through the crisp, emerald Ceylon tea plantations of Nuwara Eliya, stand above the clouds at World\'s End in Horton Plains, and hike to cascading waterfalls.',
        checklist: [
          'World-Famous Scenic Hill Country Blue Train Journey',
          'Demodara Nine Arches Bridge Photography Stop',
          'Ravana Falls & Little Adam\'s Peak Panoramic Hike',
          'Horton Plains National Park & World\'s End Precipice',
          'Colonial Ceylon Tea Plantation & Estate Tasting'
        ],
        inclusions: [
          '4 Nights stay in colonial tea estate bungalows & boutique mountain resorts',
          'Daily gourmet breakfast featuring freshly picked highland teas',
          'Reserved 1st / 2nd Class tickets for the scenic Hill Country Blue Train',
          'Private AC vehicle throughout with expert mountain driver guide',
          'Guided tea manufacturing tour and private tea tasting session',
          'Horton Plains National Park entry permits & guide',
          'Emirates flight booking assistance',
          '24/7 dedicated concierge assistance'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Ascend to the Misty Hills of Nuwara Eliya ("Little England")',
            desc: 'Arrive at Colombo Airport and begin the picturesque ascent into the central highlands. Pass cascading roadside waterfalls and rolling emerald tea terraces. Check in to your colonial bungalow in Nuwara Eliya and enjoy an evening stroll around Gregory Lake.'
          },
          {
            day: 2,
            title: 'Horton Plains & 880m World\'s End Cliff Trek',
            desc: 'Early morning expedition to Horton Plains National Park. Trek through cloud forests to the breathtaking 880m drop at World\'s End and admire Baker\'s Falls. Afternoon visit to a working British-era tea factory with tea master tasting.'
          },
          {
            day: 3,
            title: 'Scenic Blue Train Ride to Ella & Nine Arches Bridge',
            desc: 'Board the iconic blue train at Nanu Oya for one of the world\'s most scenic rail journeys, winding through misty mountain passes. Arrive in bohemian Ella; walk along the tracks to the majestic 1921 Demodara Nine Arches Bridge as trains pass through.'
          },
          {
            day: 4,
            title: 'Hike Little Adam\'s Peak & Ravana Waterfall Cascade',
            desc: 'Embark on an easy morning hike up Little Adam\'s Peak for 360-degree vistas across Ella Gap. Visit the thundering Ravana Falls and unwind at one of Ella\'s trendy clifftop cafes.'
          },
          {
            day: 5,
            title: 'Scenic Southern Descent & Airport Return',
            desc: 'Descend through rubber and coconut plantations towards the coast, taking the highway back to Colombo International Airport for your return flight.'
          }
        ],
        finePrint: [
          'Train tickets are subject to government railway reservation windows; guaranteed seating prioritized.',
          'Light jackets/warm clothing recommended for Nuwara Eliya evenings (12°C - 16°C).',
          'Horton Plains trek is approximately 9 km loop; suitable for active travelers.',
          '0% Tabby installment financing options available.'
        ],
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Mountains & Waterfalls Tour'
      }
    ]
  },
  dubai: {
    country: 'Dubai & Abu Dhabi, UAE',
    badge: 'Arabian Glamour & Flagship Hub',
    icon: 'fa-city',
    categoryTag: 'POPULAR DESTINATIONS',
    tours: [
      {
        id: 'dubai-family-escape',
        title: 'Classic Dubai Package',
        subtitle: 'GLAMOUR, ICONIC LANDMARKS & LUXURY DESERT',
        category: 'Flagship City & Desert',
        categoryIcon: 'fa-star',
        rating: '5.0',
        reviews: '510+ reviews',
        duration: '4 Days / 3 Nights',
        priceAED: 1850,
        priceLKR: 'LKR 380,000 / Adult (Child LKR 320,000)',
        highlightTags: ['🏙️ Burj Khalifa At The Top', '🏎️ VIP Red Dune Safari', '⛵ Marina Yacht Cruise', '🐠 Dubai Aquarium'],
        keyStops: ['Burj Khalifa', 'Dubai Marina', 'Desert Safari'],
        destinations: ['Burj Khalifa', 'Dubai Marina', 'Desert Safari'],
        placesCovered: [
          {
            name: 'Burj Khalifa & Downtown',
            tagline: 'At The Top & Dubai Mall',
            category: '— WORLD\'S TALLEST SKYSCRAPER',
            description: 'Zoom up high-speed double-decker elevators to the 124th and 125th floor observation decks of Burj Khalifa for 360-degree skyline views, then marvel at the musical Dubai Fountain.',
            checkmarks: ['124th & 125th Floor Observation Decks', 'Musical Dubai Fountain Spectacular', 'Dubai Mall & Underwater Aquarium'],
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'
          },
          {
            name: 'Dubai Marina & Yacht Cruise',
            tagline: 'Luxury Yacht & Waterfront Towers',
            category: '— CANAL TOWERS & YACHT HARBOR',
            description: 'Cruise through glittering skyscrapers and modern waterfront promenades aboard a luxury yacht, gliding past JBR Beach, Bluewaters Island, and Ain Dubai.',
            checkmarks: ['Luxury Marina Yacht Sunset Cruise', 'Glittering Illuminated Skyline Views', 'Bluewaters Island & Ain Dubai Backdrop'],
            image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80'
          },
          {
            name: 'Arabian Desert Dunes',
            tagline: 'VIP Red Dune 4x4 Safari & BBQ',
            category: '— LAHBAB GOLDEN RED SANDS',
            description: 'Conquer high crimson sand dunes on an adrenaline-fueled 4x4 Land Cruiser safari, glide down dunes on sandboards, and enjoy a 5-star open-air BBQ dinner with live shows.',
            checkmarks: ['Thrilling 4x4 Red Dune Bashing', 'Sunset Sandboarding & Camel Riding', 'Bedouin Camp BBQ Feast & Live Shows'],
            image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=1200&q=80'
          }
        ],
        stay: '3 Nights Deluxe Accommodation at Avani Deira Dubai Hotel (4-Star Deluxe)',
        gallery: [
          {
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 2: Burj Khalifa At The Top & Downtown Skyline',
            title: 'Burj Khalifa Observation Deck'
          },
          {
            image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 1: Dubai Marina & Luxury Yacht Cruise',
            title: 'Dubai Marina Luxury Waterfront'
          },
          {
            image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 3: VIP Red Dune Desert Safari & BBQ Dinner',
            title: 'Lahbab Red Dune Safari'
          },
          {
            image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 4: Sheikh Zayed Grand Mosque Architectural Marvel',
            title: 'Sheikh Zayed Grand Mosque'
          }
        ],
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
        description: 'The signature Dubai luxury family getaway. Stay in 4-star deluxe comfort at Avani Deira Hotel with daily international breakfast, ascend to the 124th/125th floor of the Burj Khalifa, explore the aquatic wonders of Dubai Aquarium & Underwater Zoo, sail Dubai Marina on a 5-star Dhow Cruise Dinner with live Tanoura dance, and conquer the golden dunes on a VIP 4x4 desert safari.',
        checklist: [
          'Avani Deira Dubai Hotel 4-Star Deluxe Stay',
          'Burj Khalifa 124th/125th Floor Observation Deck',
          'Dubai Aquarium & Underwater Zoo Experience',
          'Dubai Marina Luxury Dhow Cruise Dinner & Show',
          'Dubai Miracle Garden & Global Village Entry',
          'VIP 4x4 Desert Safari with Dune Bashing & BBQ'
        ],
        inclusions: [
          '3 Nights Deluxe accommodation at Avani Deira Dubai Hotel (4-Star Deluxe)',
          'Daily International Buffet Breakfast at hotel restaurant',
          'Roundtrip Private Dubai International Airport (DXB) transfers in luxury AC vehicle',
          'Burj Khalifa "At The Top" (124th & 125th Floor) Observation Deck prime tickets',
          'Dubai Aquarium & Underwater Zoo Explorer regular pass',
          '5-Star Dubai Marina Luxury Dhow Cruise Dinner with international buffet & live Tanoura dance show',
          'VIP 4x4 Desert Safari: Dune Bashing, Camel Ride, Sandboarding, BBQ Dinner, Fire & Belly Dance Shows',
          'Dubai Miracle Garden & Global Village entrance tickets with transfers',
          'Emirates flight booking assistance and express UAE Tourist Visa processing',
          '24/7 dedicated Dubai on-ground concierge support'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Welcome to Dubai & 5-Star Marina Dhow Cruise Dinner',
            desc: 'Arrive at Dubai International Airport (DXB). Meet our representative for private luxury transfer to Avani Deira Dubai Hotel. Freshen up and relax. In the evening, transfer to Dubai Marina for a 2-hour 5-star luxury Dhow Cruise Dinner: glide beneath illuminated skyscrapers, enjoy an opulent international buffet, and witness a mesmerizing live Tanoura dance show.'
          },
          {
            day: 2,
            title: 'Burj Khalifa "At The Top", Dubai Aquarium & Dubai Mall',
            desc: 'Enjoy buffet breakfast at Avani Deira Hotel. Transfer to Downtown Dubai and board the worldâ€™s fastest double-deck elevators to the 124th & 125th floors of Burj Khalifa for 360-degree panoramic skyline views. Explore the Dubai Aquarium & Underwater Zoo, marveling at thousands of aquatic animals and the giant 10-million-liter tank. Watch the musical Dubai Fountain show in the evening.'
          },
          {
            day: 3,
            title: 'Miracle Garden, Global Village & VIP Red Dune Desert Safari',
            desc: 'Morning visit to the vibrant floral wonderland of Dubai Miracle Garden. In the afternoon, embark on an exhilarating VIP 4x4 Desert Safari in a Land Cruiser across the high red Lahbab dunes. Enjoy thrilling dune bashing, sandboarding, camel rides, Arabic coffee & dates, henna painting, and an open-air 5-star BBQ dinner with fire shows and belly dance performances.'
          },
          {
            day: 4,
            title: 'Deira Gold Souks Leisure & Private Airport Departure',
            desc: 'Leisurely breakfast at the hotel. Explore the traditional Deira Gold & Spice Souks or do last-minute luxury shopping at Deira City Centre. Private chauffeur transfer to Dubai International Airport (DXB) for your Emirates flight back home.'
          }
        ],
        finePrint: [
          'Rates are based on twin/double sharing per person; special child rates applicable.',
          'Standard hotel check-in at 14:00 hrs & check-out at 12:00 hrs.',
          'Tourism Dirham fee of AED 15 per room per night payable directly to the hotel upon check-in.',
          'UAE 30-Day or 60-Day tourist visa assistance provided (approval in 24-48 hours).',
          '0% interest installment financing available through Tabby (4 convenient monthly payments).'
        ],
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Dubai 4D / 3N Family Escape'
      },
      {
        id: 'dubai-abudhabi-grand',
        title: 'Abu Dhabi Extension',
        subtitle: 'EMIRATES TWIN CITY & CULTURAL MARVEL',
        category: 'Capital & Architecture',
        categoryIcon: 'fa-building-columns',
        rating: '5.0',
        reviews: '390+ reviews',
        duration: '5 Days / 4 Nights',
        priceAED: 2750,
        priceLKR: 'LKR 560,000',
        keyStops: ['Sheikh Zayed Mosque', 'Louvre Abu Dhabi', 'Yas Marina'],
        destinations: ['Sheikh Zayed Mosque', 'Louvre Abu Dhabi', 'Yas Marina'],
        placesCovered: [
          {
            name: 'Sheikh Zayed Grand Mosque',
            tagline: 'White Marble Architectural Marvel',
            category: '— CAPITAL ARCHITECTURAL MASTERPIECE',
            description: 'Marvel at one of the world\'s largest mosques featuring 82 pure white marble domes, 24-carat gold-plated chandeliers, and the world\'s largest hand-knotted Persian carpet.',
            checkmarks: ['82 Pure White Marble Domes', 'World\'s Largest Hand-Knotted Carpet', 'Glistening Reflective Water Basins'],
            image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80'
          },
          {
            name: 'Louvre Abu Dhabi',
            tagline: 'Rain of Light Floating Museum',
            category: '— SAADIYAT CULTURAL DISTRICT',
            description: 'Step beneath Jean Nouvel\'s iconic geometric dome creating a magical "rain of light", and discover world-renowned art collections spanning global civilizations.',
            checkmarks: ['Iconic Floating Geometric Steel Dome', '"Rain of Light" Architectural Effect', 'Global Civilization Art Galleries'],
            image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85'
          },
          {
            name: 'Yas Island Marina',
            tagline: 'F1 Grand Prix Circuit & Waterfront',
            category: '— ENTERTAINMENT CAPITAL OF UAE',
            description: 'Stroll the glamorous Yas Marina against the backdrop of the Formula 1 Yas Marina Circuit, Ferrari World Abu Dhabi, and waterfront luxury lounges.',
            checkmarks: ['Yas Marina Formula 1 Grand Prix Circuit', 'Ferrari World & Warner Bros World', 'Luxury Waterfront Promenade Dining'],
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'
          }
        ],
        stay: '4 Nights at 5-Star Waterfront Hotel (Radisson Blu / Swissôtel Al Ghurair)',
        gallery: [
          {
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 2: Burj Khalifa Skyline & Museum of the Future',
            title: 'Downtown Dubai Skyline'
          },
          {
            image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 1: Palm Jumeirah & Marina Sunset Yacht Cruise',
            title: 'Private Dubai Marina Yacht'
          },
          {
            image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 3: Sheikh Zayed Grand Mosque Abu Dhabi',
            title: 'Sheikh Zayed Grand Mosque'
          },
          {
            image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 4: VIP Red Dune Safari & Starlight Majlis',
            title: 'VIP Desert Majlis Experience'
          }
        ],
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
        description: 'Experience the peak of Arabian architecture and opulence. Enjoy a private chauffeur-driven tour to Abu Dhabi\'s majestic Sheikh Zayed Grand Mosque and Louvre Museum, cruise around the Palm Jumeirah on a private yacht, and dine under desert stars in a VIP desert camp.',
        checklist: [
          'Sheikh Zayed Grand Mosque & Louvre Abu Dhabi',
          'Palm Jumeirah & Atlantis Private 2-Hr Yacht Cruise',
          'Museum of the Future Priority Access Passes',
          'Red Dune VIP Desert Safari with Private Majlis',
          'Dedicated Chauffeur & 5-Star Waterfront Hotel'
        ],
        inclusions: [
          '4 Nights at 5-Star Waterfront Hotel (Radisson Blu / SwissÃ´tel Al Ghurair)',
          'Daily International Gourmet Breakfast Buffet',
          'Full-day private chauffeur tour to Abu Dhabi (Grand Mosque, Corniche & Louvre)',
          'Private 2-Hour Luxury Yacht Cruise past Dubai Marina, JBR & Atlantis The Palm',
          'Museum of the Future VIP Priority Admission Tickets',
          'Red Dune VIP Desert Safari with private table majlis service',
          'Private roundtrip Dubai International Airport (DXB) transfers in luxury vehicle',
          'Emirates flights booking concierge & 24/7 dedicated travel manager'
        ],
        itinerary: [
          {
            day: 1,
            title: 'VIP Arrival in Dubai & Private 2-Hour Luxury Yacht Cruise',
            desc: 'VIP airport meet-and-greet at DXB with private luxury vehicle transfer to your 5-star waterfront hotel. Evening transfer to Dubai Marina Yacht Club for a private 2-hour sunset yacht cruise gliding past Ain Dubai, JBR, and Atlantis The Palm with chilled refreshments.'
          },
          {
            day: 2,
            title: 'Museum of the Future & Downtown Dubai Elegance',
            desc: 'Step into the year 2071 with VIP priority admission to the architectural marvel of the Museum of the Future. Afternoon visit to Dubai Frame with its transparent glass bridge, followed by dinner overlooking the Dubai Fountain.'
          },
          {
            day: 3,
            title: 'Full-Day Abu Dhabi Royal Capital Tour & Louvre Museum',
            desc: 'Private chauffeur excursion to UAE\'s capital, Abu Dhabi. Tour the breathtaking white marble Sheikh Zayed Grand Mosque, drive along the pristine Corniche past Emirates Palace, and explore world-class art at Louvre Abu Dhabi.'
          },
          {
            day: 4,
            title: 'VIP Red Dune Desert Safari & Starlight Majlis Dinner',
            desc: 'Morning at leisure for relaxation or designer shopping. In the afternoon, journey into the Lahbab red desert for thrilling dune bashing, falconry photography, and a private majlis BBQ banquet with live Arabian fire and dance performances.'
          },
          {
            day: 5,
            title: 'Luxury Shopping & Chauffeur Airport Departure',
            desc: 'Breakfast at the hotel. Chauffeur-driven shopping tour at Souk Madinat Jumeirah and Mall of the Emirates before direct private transfer to Dubai International Airport (DXB).'
          }
        ],
        finePrint: [
          'Modest dress code required for Sheikh Zayed Grand Mosque (abayas available for ladies).',
          'Louvre Abu Dhabi is closed on Mondays; schedule adjusted seamlessly.',
          'Tourism Dirham fee payable directly at the hotel (AED 20 per room per night).',
          '0% Tabby installment options available.'
        ],
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Dubai & Abu Dhabi Grand Tour'
      }
    ]
  },
  maldives: {
    country: 'Maldives Island Retreats',
    badge: 'Turquoise Atolls & Seclusion',
    icon: 'fa-umbrella-beach',
    categoryTag: 'POPULAR DESTINATIONS',
    tours: [
      {
        id: 'maldives-overwater',
        title: 'Island Escape',
        subtitle: 'TURQUOISE LAGOONS & PRIVATE OVERWATER POOLS',
        category: 'Overwater Luxury',
        categoryIcon: 'fa-umbrella-beach',
        rating: '5.0',
        reviews: '230+ reviews',
        duration: '4 Days / 3 Nights',
        priceAED: 4499,
        priceLKR: 'LKR 890,000',
        highlightTags: ['🏝️ Overwater Pool Villa', '🛩️ Scenic Seaplane Flight', '🐢 House Reef Snorkeling', '🐬 Sunset Dolphin Cruise'],
        keyStops: ['Private Lagoon', 'Coral Reef', 'Sunset Cruise'],
        destinations: ['Private Lagoon', 'Coral Reef', 'Sunset Cruise'],
        placesCovered: [
          {
            name: 'Private Overwater Lagoon',
            tagline: 'Luxury Villa & Plunge Pool',
            category: '— SECLUDED INDIAN OCEAN LUXURY',
            description: 'Wake up perched directly over crystal turquoise waters in your private overwater villa, featuring direct lagoon ladder access and a private infinity plunge pool.',
            checkmarks: ['Direct Lagoon Swimming Access Ladder', 'Private Infinity Edge Plunge Pool', 'Sunrise & Sunset Panoramic Horizon'],
            image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80'
          },
          {
            name: 'Coral Atoll Reef Snorkeling',
            tagline: 'House Reef Turtles & Marine Life',
            category: '— PRISTINE CORAL REEF ECOSYSTEM',
            description: 'Don your snorkel and mask to explore vibrant coral gardens teeming with green sea turtles, blacktip reef sharks, eagle rays, and tropical butterflyfish.',
            checkmarks: ['Guided House Reef Snorkel Safaris', 'Green Sea Turtles & Manta Rays', 'Vibrant Live Coral Gardens'],
            image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80'
          },
          {
            name: 'Sunset Dolphin Speedboat Cruise',
            tagline: 'Spinner Dolphins & Golden Hour',
            category: '— OPEN OCEAN YACHT CRUISE',
            description: 'Set sail into the calm atoll waters at golden hour on a traditional wooden yacht or swift speedboat, watching wild spinner dolphin pods leap and play in bow waves.',
            checkmarks: ['Wild Spinner Dolphin Pod Encounters', 'Champagne Toast at Golden Sunset', 'Traditional Wooden Dhoni Yacht Experience'],
            image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=85'
          }
        ],
        stay: '3 Nights in 5-Star Luxury Overwater Villa with Private Infinity Pool (Adaaran / Sun Siyam)',
        gallery: [
          {
            image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
            tag: '📍 Day 1: Scenic Trans-Maldivian Seaplane Flight',
            title: 'Scenic Seaplane Transfer'
          },
          {
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 2: Private Lagoon Overwater Pool Villa',
            title: 'Overwater Pool Villa'
          },
          {
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 2: House Reef Turtle Snorkeling Safari',
            title: 'Guided Coral Reef Snorkel'
          },
          {
            image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 3: Sunset Dolphin Yacht Cruise with Champagne',
            title: 'Traditional Dhoni Dolphin Yacht'
          }
        ],
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
        description: 'Wake up above crystal lagoons in your private overwater pool villa. Includes scenic return seaplane transfers from Male, all-inclusive dine-around fine dining, guided coral reef snorkeling with sea turtles, and sunset champagne dolphin cruises.',
        checklist: [
          '5-Star Overwater Pool Villa Accommodation',
          'Roundtrip Scenic Seaplane Transfers from Male',
          'All-Inclusive Fine Dining & Champagne Breakfast',
          'Guided Coral Reef Turtle Snorkeling Safari',
          'Sunset Dolphin Yacht Cruise with Canapes'
        ],
        inclusions: [
          '3 Nights in a 5-Star Luxury Overwater Villa with Private Infinity Plunge Pool',
          'Roundtrip Scenic Seaplane transfers from Velana International Airport (Male)',
          'All-Inclusive Dine-Around meal plan (Breakfast, Lunch, Dinner & Premium Beverages)',
          'Floating Champagne Breakfast in your villa pool',
          'Guided coral reef snorkeling excursion with resident marine biologist',
          'Sunset dolphin cruise on traditional wooden Dhoni yacht with champagne',
          'Complimentary non-motorized water sports (kayaks, paddleboards, snorkel gear)',
          'Emirates flight booking support and Maldives Green Tax included'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Male & Scenic Seaplane Flight to Atoll',
            desc: 'Arrive at Velana International Airport (MLE). Enjoy VIP Seaplane Lounge hospitality before boarding a breathtaking 35-minute scenic seaplane flight over turquoise atolls. Check in to your private Overwater Villa and toast the sunset with welcome champagne.'
          },
          {
            day: 2,
            title: 'Floating Pool Breakfast & Guided Turtle Snorkeling',
            desc: 'Start your morning with a lavish floating breakfast in your private infinity pool. Afternoon guided snorkeling excursion along the resort\'s house reef, swimming alongside green sea turtles, eagle rays, and vibrant schools of fish.'
          },
          {
            day: 3,
            title: 'Overwater Spa Indulgence & Sunset Dolphin Cruise',
            desc: 'Pamper yourselves with an overwater couples spa massage with glass floor ocean viewing. In the late afternoon, set sail on a traditional Maldivian yacht for a sunset dolphin watching cruise accompanied by canapÃ©s.'
          },
          {
            day: 4,
            title: 'Sunrise Lagoon Dip & Seaplane Transfer to Male',
            desc: 'Final morning swim in crystal turquoise waters. Savor a gourmet breakfast before taking the seaplane transfer back to Male Airport for your onward Emirates flight.'
          }
        ],
        finePrint: [
          'Seaplanes operate during daylight hours only (06:00 to 16:00).',
          'Maldives Green Tax ($6/person/night) included in all bookings.',
          'Honeymoon complimentary cake, bed decoration & fruit basket require wedding certificate within 6 months.',
          '0% Tabby installment financing options available.'
        ],
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Overwater Villa Luxury Escape'
      },
      {
        id: 'maldives-family-oasis',
        title: 'Beachfront Island Family Oasis',
        subtitle: 'WHITE SANDS & TROPICAL RELAXATION',
        category: 'Family Island',
        categoryIcon: 'fa-umbrella-beach',
        rating: '4.9',
        reviews: '175+ reviews',
        duration: '5 Days / 4 Nights',
        priceAED: 3250,
        priceLKR: 'LKR 640,000',
        highlightTags: ['🏖️ Beachfront Family Villa', '🚤 Swift Speedboat Transfer', '🏝️ Deserted Sandbank Picnic', '🍿 Starlight Beach Cinema'],
        keyStops: ['Beachfront Villa', 'Private Sandbank', 'Coral Lagoon'],
        destinations: ['Beachfront Villa', 'Private Sandbank', 'Coral Lagoon'],
        stay: '4 Nights in Deluxe Beachfront Family Villa with Private Sundeck (Bandos / Oblu Xperience)',
        gallery: [
          {
            image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 1: Swift Speedboat Lagoon Welcome',
            title: 'Speedboat Lagoon Transfer'
          },
          {
            image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 2: Beachfront Villa & Lagoon Watersports',
            title: 'Beachfront Family Villa'
          },
          {
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 3: Deserted Sandbank Family Picnic',
            title: 'Deserted Sandbank Cruise'
          },
          {
            image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 4: Starlight Beach Cinema Under Palms',
            title: 'Open-Air Beach Cinema'
          }
        ],
        image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1920&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80',
        description: 'Direct powder-soft beach access from your beachfront villa. Enjoy full board gourmet buffet dining, unlimited non-motorized watersports, children\'s club activities, and boat excursions to nearby coral atolls.',
        checklist: [
          'Beachfront Villa with Direct Lagoon Access',
          'Roundtrip Speedboat Airport Transfers from Male',
          'Full Board Plus Meal Plan (Breakfast, Lunch, Dinner)',
          'Kayaks, Paddleboards & Snorkel Equipment Included',
          'Island Hopping & Deserted Sandbank Excursion'
        ],
        inclusions: [
          '4 Nights in a Deluxe Beachfront Family Villa with private sundeck',
          'Roundtrip swift speedboat transfers from Male Airport (25 minutes)',
          'Full Board Plus meal plan (Daily Breakfast, Lunch, Dinner & soft drinks)',
          'Daily Kids Club supervised activities and coral nursery workshop',
          'Half-day deserted sandbank excursion with family picnic',
          'Complimentary use of snorkeling gear, sea kayaks, and paddleboards',
          'Emirates flight booking assistance and all resort service charges'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Swift Speedboat Arrival & Beachfront Villa Welcome',
            desc: 'Arrive at Male Airport and step directly onto your luxury speedboat for a 25-minute cruise across turquoise waters. Check in to your villa steps away from the powder-white sand. Relax and enjoy evening beachfront dining.'
          },
          {
            day: 2,
            title: 'Family Watersports & House Reef Coral Snorkel',
            desc: 'Explore the calm lagoon on paddleboards and transparent kayaks. In the afternoon, enjoy a family snorkeling tour guided by the resort marine team along the shallow coral garden.'
          },
          {
            day: 3,
            title: 'Private Sandbank Picnic & Island Hopping',
            desc: 'Cruise by boat to a pristine uninhabited sandbank in the middle of the Indian Ocean for private sunbathing, sandcastle building, and a gourmet beach picnic.'
          },
          {
            day: 4,
            title: 'Kids Coral Discovery & Open-Air Starlight Cinema',
            desc: 'Kids participate in an interactive coral planting activity. In the evening, relax with popcorn on beanbags under the coconut palms for an outdoor movie night on the beach.'
          },
          {
            day: 5,
            title: 'Island Farewell & Speedboat Return to Male',
            desc: 'Enjoy a rich tropical buffet breakfast, take one last lagoon swim, and board the speedboat back to Male Airport for departure.'
          }
        ],
        finePrint: [
          'Speedboat transfers operate 24 hours depending on flight arrival times.',
          'All resort taxes and service charges included.',
          '0% Tabby installment financing options available.'
        ],
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Beachfront Island Family Oasis'
      }
    ]
  },
  azerbaijan: {
    country: 'Baku & Caucasus, Azerbaijan',
    badge: 'Land of Fire & Silk Road',
    icon: 'fa-mountain-sun',
    categoryTag: 'POPULAR DESTINATIONS',
    tours: [
      {
        id: 'baku-shahdag',
        title: 'Baku & Shahdag Mountain Escape',
        subtitle: 'CASPIAN GLAMOUR & HIGH CAUCASUS PEAKS',
        category: 'City & Alpine',
        categoryIcon: 'fa-mountain',
        rating: '4.9',
        reviews: '210+ reviews',
        duration: '5 Days / 4 Nights',
        priceAED: 1950,
        priceLKR: 'LKR 390,000',
        highlightTags: ['🔥 Flame Towers & Caspian', '🏰 UNESCO Old Baku City', '🌋 Gobustan Mud Volcanoes', '🏔️ Shahdag Alpine Peaks'],
        keyStops: ['Old City Baku', 'Gobustan Volcanoes', 'Shahdag Peaks'],
        destinations: ['Old City Baku', 'Gobustan Volcanoes', 'Shahdag Peaks'],
        placesCovered: [
          {
            name: 'Old City Baku & Maiden Tower',
            tagline: 'UNESCO Icherisheher & Caspian',
            category: '— MEDIEVAL WALLS & CASPIAN SEASIDE',
            description: 'Explore ancient cobblestone labyrinths inside UNESCO Icherisheher, climb Maiden Tower, and admire the futuristic Flame Towers gleaming above the Caspian Boulevard.',
            checkmarks: ['UNESCO 12th-Century City Walls', 'Iconic Maiden Tower & Shirvanshahs', 'Highland Park Flame Towers Vista'],
            image: 'assets/packages/baku-flame-towers.jpg'
          },
          {
            name: 'Gobustan Mud Volcanoes',
            tagline: 'Prehistoric Petroglyphs & Fire',
            category: '— ACTIVE MUD VOLCANOES & ANCIENT ART',
            description: 'Marvel at 40,000-year-old rock engravings and bubbling cold mud volcanoes in the desert, followed by the eternal natural flames of Yanar Dag.',
            checkmarks: ['Bubbling Desert Mud Volcanoes', '40,000-Year-Old Rock Petroglyphs', 'Yanar Dag Millennia-Old Burning Hill'],
            image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85'
          },
          {
            name: 'Shahdag Alpine Peaks',
            tagline: 'Greater Caucasus Cable Cars',
            category: '— HIGH CAUCASUS MOUNTAIN RESORT',
            description: 'Ride panoramic gondola cable cars high into the Greater Caucasus peaks for pristine alpine air, mountain coaster adventures, and sweeping valley vistas.',
            checkmarks: ['High-Altitude Panoramic Cable Cars', 'Shahdag Alpine Coaster Adventure', 'Crisp Caucasian Mountain Air'],
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
          }
        ],
        stay: '3 Nights in 4-Star Baku City Center + 1 Night in Shahdag Mountain Resort',
        gallery: [
          {
            image: 'assets/packages/baku-flame-towers.jpg',
            tag: '📍 Day 1: Baku Flame Towers & Seaside Boulevard',
            title: 'Baku Flame Towers & Boulevard'
          },
          {
            image: 'assets/packages/baku-flame-towers.jpg',
            tag: '📍 Day 2: Old City (Icherisheher) & Maiden Tower',
            title: 'Old City (Icherisheher) & Maiden Tower'
          },
          {
            image: 'https://images.unsplash.com/photo-1621539205985-64585141ef30?auto=format&fit=crop&w=800&q=80',
            tag: '📍 Day 3: Gabala Mountains & Lake Nohur',
            title: 'Gabala Mountains & Lake Nohur'
          },
          {
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
            tag: '📍 Day 4: Shahdag Winter Alpine Resort & Cable Cars',
            title: 'Shahdag Winter Alpine Resort'
          }
        ],
        image: 'assets/packages/baku-flame-towers.jpg',
        thumbnail: 'assets/packages/baku-flame-towers.jpg',
        description: 'Explore the historic alleys of UNESCO Icherisheher, stand beneath the futuristic Flame Towers, marvel at bubbling mud volcanoes in Gobustan, and ride panoramic cable cars into Shahdag Alpine Resort.',
        checklist: [
          'Baku Old City UNESCO Walk & Maiden Tower',
          'Gobustan Mud Volcanoes & Prehistoric Petroglyphs',
          'Ateshgah Fire Temple & Yanar Dag Burning Hill',
          'Shahdag Alpine Resort Mountain Cable Car',
          'English-Speaking Guide & Chauffeur'
        ],
        inclusions: [
          '3 Nights in 4-Star Baku Hotel + 1 Night in Shahdag Mountain Resort',
          'Daily International Buffet Breakfast',
          'Private AC vehicle throughout with professional English-speaking guide',
          'Roundtrip Baku International Airport (GYD) private transfers',
          'Shahdag Mountain Resort panoramic cable car passes',
          'Entrance tickets: Maiden Tower, Shirvanshahs Palace, Gobustan & Ateshgah',
          'Emirates flight booking assistance and express ASAN e-Visa support',
          '24/7 dedicated travel concierge'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Baku & Caspian Boulevard Stroll',
            desc: 'Arrive at Baku Heydar Aliyev International Airport (GYD). Private transfer to your central 4-star hotel. Evening orientation walk along Nizami Street and the Caspian Seaside Boulevard.'
          },
          {
            day: 2,
            title: 'UNESCO Old City & Modern Architecture Icons',
            desc: 'Discover the ancient 12th-century walls of Icherisheher, Maiden Tower, and Shirvanshahs Palace. Afternoon photo stop at the iconic flowing contours of Zaha Hadid\'s Heydar Aliyev Center and evening views from Highland Park.'
          },
          {
            day: 3,
            title: 'Gobustan Mud Volcanoes & Eternal Flames of Absheron',
            desc: 'Drive to Gobustan National Park to marvel at 40,000-year-old rock petroglyphs and active mud volcanoes. Visit the ancient Ateshgah Zoroastrian Fire Temple and Yanar Dag, the hillside that has burned continuously for millennia.'
          },
          {
            day: 4,
            title: 'Caucasus Ascent to Shahdag Alpine Resort',
            desc: 'Scenic drive through the foothills of the Greater Caucasus mountains to Shahdag Mountain Resort. Ride panoramic cable cars, enjoy mountain coasters or winter snow activities, and relax in pristine alpine air.'
          },
          {
            day: 5,
            title: 'Bazaar Souvenirs & Baku Airport Departure',
            desc: 'Traditional Azerbaijani breakfast, scenic descent back to Baku, quick visit to Yashil Bazaar for local saffron and caviar, and airport transfer for your departure flight.'
          }
        ],
        finePrint: [
          'ASAN e-Visa required for most nationalities (processed online in 3 hours to 3 days).',
          'Winter snow season at Shahdag typically runs from December to March.',
          '0% Tabby installment financing options available.'
        ],
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Baku & Shahdag Mountain Escape'
      }
    ]
  },
  georgia: {
    country: 'Tbilisi & Kazbegi, Georgia',
    badge: 'Caucasian Peaks & Ancient Wine',
    icon: 'fa-snowflake',
    categoryTag: 'POPULAR DESTINATIONS',
    tours: [
      {
        id: 'georgia-kazbegi',
        title: 'Caucasus Explorer',
        subtitle: 'OLD TBILISI & CAUCASIAN SNOW CAPS',
        category: 'Alpine & Heritage',
        categoryIcon: 'fa-mountain',
        rating: '5.0',
        reviews: '260+ reviews',
        duration: '5 Days / 4 Nights',
        priceAED: 1890,
        priceLKR: 'LKR 375,000',
        highlightTags: ['🏔️ Mount Kazbek & Caucasus', '⛪ Gergeti Trinity Church', '🏰 Ananuri Fortress', '🍷 Old Tbilisi & Sulfur Baths'],
        keyStops: ['Gergeti Trinity', 'Old Tbilisi', 'Gudauri Alps'],
        destinations: ['Gergeti Trinity', 'Old Tbilisi', 'Gudauri Alps'],
        placesCovered: [
          {
            name: 'Gergeti Trinity Church',
            tagline: 'Kazbegi & Mount Kazbek Peak',
            category: '— HIGH CAUCASUS PEAKS & HERITAGE',
            description: 'Stand at 2,170 meters elevation beneath the dramatic 14th-century stone church with the snow-capped 5,054-meter Mount Kazbek towering in the background.',
            checkmarks: ['2,170m Elevation Caucasian Vistas', '14th-Century Stone Mountaintop Church', 'Mount Kazbek 5,054m Glacier Backdrop'],
            image: 'assets/packages/georgia-kazbegi.jpg'
          },
          {
            name: 'Old Tbilisi Sulphur Baths',
            tagline: 'Abanotubani & Carved Balconies',
            category: '— HISTORIC THERMAL SPRINGS & STREETS',
            description: 'Wander through the domed brick baths of Abanotubani, climb to Narikala Fortress, and admire charming cliff-clinging 19th-century wooden carved balconies.',
            checkmarks: ['Natural Thermal Sulphur Bath Domes', 'Narikala Fortress Cable Car Climb', 'Historic Wooden Carved Balconies'],
            image: 'assets/packages/georgia-kazbegi.jpg'
          },
          {
            name: 'Gudauri Mountain Panoramas',
            tagline: 'Jvari Pass & Russia-Georgia Monument',
            category: '— GREATER CAUCASUS HIGHWAY',
            description: 'Ascend the Georgian Military Highway to the Russia-Georgia Friendship Monument perched over Devils Valley for breathtaking 360-degree alpine panoramas.',
            checkmarks: ['Scenic Jvari Pass 2,379m Crossing', 'Friendship Monument Colorful Murals', 'Sweeping Valley & Canyon Vistas'],
            image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'
          }
        ],
        stay: '3 Nights in Old Tbilisi Boutique Hotel + 1 Night in Kazbegi Alpine Lodge (Rooms Hotel Kazbegi)',
        gallery: [
          {
            image: 'assets/packages/georgia-kazbegi.jpg',
            tag: '📍 Day 1: Old Tbilisi Colorful Balconies & Narikala',
            title: 'Old Tbilisi Colorful Balconies & Narikala'
          },
          {
            image: 'assets/packages/georgia-kazbegi.jpg',
            tag: '📍 Day 2: Gergeti Trinity Church & Kazbek Peak',
            title: 'Gergeti Trinity Church & Kazbek Peak'
          },
          {
            image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
            tag: '📍 Day 3: Ananuri Fortress & Aragvi River',
            title: 'Ananuri Fortress & Aragvi River'
          },
          {
            image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
            tag: '📍 Day 4: Gudauri Caucasus Ski Slopes',
            title: 'Gudauri Caucasus Ski Slopes'
          }
        ],
        image: 'assets/packages/georgia-kazbegi.jpg',
        thumbnail: 'assets/packages/georgia-kazbegi.jpg',
        description: 'Wander the sulfur bath cobblestone streets of Old Tbilisi, drive the scenic Georgian Military Highway past Ananuri Fortress and Jinvali Reservoir, and take a 4x4 up to 14th-century Gergeti Trinity Church under Mount Kazbek.',
        checklist: [
          'Old Tbilisi Walking Tour & Narikala Cable Car',
          'Scenic Georgian Military Highway Drive',
          'Ananuri Fortress & Turquoise Jinvali Lake',
          '4x4 Ascent to Gergeti Trinity Church',
          'Traditional Georgian Supra Feast with Wine'
        ],
        inclusions: [
          '3 Nights in Old Tbilisi boutique hotel + 1 Night in Kazbegi mountain lodge',
          'Daily organic Georgian buffet breakfast',
          'Private 4x4 transport throughout with dedicated English-speaking guide',
          'Roundtrip Tbilisi International Airport (TBS) transfers',
          '4x4 off-road ascent to 14th-century Gergeti Trinity Church',
          'Narikala Fortress cable car tickets and sulfur baths walking tour',
          'Emirates flight booking assistance',
          '24/7 travel concierge support'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in Tbilisi & Narikala Fortress Views',
            desc: 'Arrival at Tbilisi International Airport (TBS). Private transfer to your hotel in the historic district. Ride the cable car to Narikala Fortress for sweeping sunset vistas of the city and Mother of Georgia.'
          },
          {
            day: 2,
            title: 'Old Tbilisi Alleys, Sulfur Baths & Bridge of Peace',
            desc: 'Stroll cobblestone alleys in the Abanotubani sulfur bath district, see the Legvtakhevi waterfall inside the city, walk the modern glass Bridge of Peace, and ride the funicular up Mtatsminda Park.'
          },
          {
            day: 3,
            title: 'Georgian Military Highway, Jinvali & Ananuri Fortress',
            desc: 'Drive into the High Caucasus along the historic Georgian Military Highway. Stop at turquoise Jinvali Reservoir, explore the 17th-century Ananuri Fortress, cross the Jvari Pass (2,379m), and reach Stepantsminda (Kazbegi).'
          },
          {
            day: 4,
            title: '4x4 Climb to Gergeti Trinity Church & Khinkali Making',
            desc: 'Board a 4x4 for the dramatic climb to the iconic Gergeti Trinity Church perched at 2,170m beneath the snowy peak of Mount Kazbek (5,047m). Enjoy a culinary workshop learning to make traditional khinkali dumplings.'
          },
          {
            day: 5,
            title: 'Mtskheta UNESCO Cathedral & Departure',
            desc: 'Drive south, visiting the ancient royal capital of Mtskheta and the 11th-century Svetitskhoveli UNESCO Cathedral. Transfer to Tbilisi Airport for your return Emirates flight.'
          }
        ],
        finePrint: [
          'UAE residence visa holders enjoy visa-on-arrival or visa-free entry into Georgia.',
          'Warm alpine jackets and sturdy walking shoes recommended for Kazbegi year-round.',
          '0% Tabby installment financing options available.'
        ],
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Majestic Georgia & Kazbegi Alpine Tour'
      }
    ]
  },
  bali: {
    country: 'Bali & Nusa Penida, Indonesia',
    badge: 'Island of the Gods & Spiritual Bliss',
    icon: 'fa-leaf',
    categoryTag: 'POPULAR DESTINATIONS',
    tours: [
      {
        id: 'bali-cultural-island',
        title: 'Bali Cultural & Nusa Penida Hopper',
        subtitle: 'EMERALD TERRACES & DRAMATIC CLIFFS',
        category: 'Tropical Bliss',
        categoryIcon: 'fa-umbrella-beach',
        rating: '5.0',
        reviews: '290+ reviews',
        duration: '6 Days / 5 Nights',
        priceAED: 2450,
        priceLKR: 'LKR 490,000',
        highlightTags: ['🌴 Ubud Jungle Swing', '🌾 Tegallalang Rice Terraces', '🦖 Nusa Penida Kelingking', '🔥 Uluwatu Sunset Fire Dance'],
        keyStops: ['Ubud Terraces', 'Nusa Penida', 'Uluwatu Temple'],
        destinations: ['Ubud Terraces', 'Nusa Penida', 'Uluwatu Temple'],
        stay: '3 Nights in Ubud Private Pool Villa + 2 Nights in Seminyak Beachfront Resort',
        gallery: [
          {
            image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 2: Tegallalang Terraces & Ubud Jungle Swing',
            title: 'Tegallalang Rice Terraces'
          },
          {
            image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 4: Kelingking T-Rex Beach & Angel\'s Billabong',
            title: 'Nusa Penida Coastal Cliffs'
          },
          {
            image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 5: Uluwatu Clifftop Temple & Sunset Fire Dance',
            title: 'Uluwatu Sunset Kecak Dance'
          },
          {
            image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
            tag: '📍 Day 1: Luxury Ubud Jungle Pool Villa',
            title: 'Private Pool Villa Ubud'
          }
        ],
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        description: 'Swing high over Tegallalang emerald rice terraces, witness the sunset Kecak fire dance on Uluwatu cliffs, and speed across the strait to explore Kelingking T-Rex Beach and Angel\'s Billabong on Nusa Penida.',
        checklist: [
          'Tegallalang Rice Terraces & Giant Jungle Swing',
          'Ubud Sacred Monkey Forest Sanctuary',
          'Uluwatu Clifftop Temple & Sunset Fire Dance',
          'Nusa Penida Day Tour (Kelingking Beach)',
          'Private Pool Villa in Ubud & Seminyak Resort'
        ],
        inclusions: [
          '3 Nights in Private Pool Villa in Ubud + 2 Nights at Beach Resort in Seminyak',
          'Daily Ã  la carte breakfast with floating breakfast option in villa',
          'Private AC vehicle throughout with friendly English-speaking Balinese driver guide',
          'Return high-speed boat tickets between Sanur and Nusa Penida island',
          'Full-day private Nusa Penida island tour (Kelingking, Broken Beach, Angelâ€™s Billabong)',
          'Uluwatu Temple & Kecak Fire Dance sunset performance tickets',
          'Tegallalang Giant Jungle Swing and Ubud Monkey Forest passes',
          'Emirates flight booking support & airport transfers',
          '24/7 dedicated travel concierge'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Warm Balinese Welcome & Ubud Private Pool Villa',
            desc: 'Arrival at Denpasar International Airport (DPS). Meet your chauffeur with fragrant frangipani flower garlands and transfer to your luxury private pool villa in lush Ubud.'
          },
          {
            day: 2,
            title: 'Tegallalang Emerald Terraces & Jungle Swing',
            desc: 'Morning swing over the picturesque Tegallalang rice terraces. Wander through the Sacred Monkey Forest Sanctuary and explore Ubud Art Market and royal palace.'
          },
          {
            day: 3,
            title: 'Tirta Empul Holy Springs & Transfer to Seminyak',
            desc: 'Experience spiritual water cleansing at Tirta Empul temple and visit Tegenungan waterfall. Afternoon drive to fashionable Seminyak for beachfront sunset cocktails.'
          },
          {
            day: 4,
            title: 'Nusa Penida Island Expedition: Kelingking T-Rex',
            desc: 'Early morning speed boat to Nusa Penida. Stand above the famous T-Rex shaped cliff at Kelingking Beach, marvel at natural sea arches at Broken Beach, and swim in Angelâ€™s Billabong natural infinity pool.'
          },
          {
            day: 5,
            title: 'Clifftop Uluwatu Temple & Sunset Kecak Fire Dance',
            desc: 'Relax on Seminyak beach. Late afternoon visit to dramatic 70-meter clifftop Uluwatu Temple, followed by the enchanting rhythmic Kecak Fire Dance against the Indian Ocean sunset.'
          },
          {
            day: 6,
            title: 'Seminyak Boutique Shopping & Airport Departure',
            desc: 'Enjoy a leisurely breakfast and souvenir shopping in Seminyak before private transfer to Denpasar Airport for your return flight.'
          }
        ],
        finePrint: [
          'Bali tourist levy ($10/person) payable online or upon arrival.',
          'Nusa Penida speed boat boarding may require stepping into knee-deep water.',
          '0% Tabby installment financing options available.'
        ],
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Bali Cultural & Nusa Penida Hopper'
      }
    ]
  }
};

let currentShowcaseCountryKey = 'srilanka';
let currentShowcaseTourIndex = 0;

function populateShowcaseData(countryKey) {
  let data = COUNTRY_SHOWCASE_DATA[countryKey];
  if (!data || !data.tours || data.tours.length === 0) return false;

  currentShowcaseCountryKey = countryKey;
  currentShowcaseTourIndex = 0;

  const currentLang = typeof getPreferredLanguage === 'function' ? getPreferredLanguage() : (localStorage.getItem('site_lang') || 'en');
  const isSi = (currentLang === 'si');

  if (isSi && typeof getLocalizedCountryShowcase === 'function') {
    const loc = getLocalizedCountryShowcase(countryKey, 'si');
    if (loc) data = loc;
  }

  const headerTitle = document.getElementById('countryShowcaseHeaderTitle');
  const headerBadge = document.getElementById('countryShowcaseHeaderBadge');
  const headerIcon = document.getElementById('countryShowcaseIcon');
  const categoryTag = document.getElementById('showcaseCategoryTag');
  const cardsTrack = document.getElementById('countryShowcaseCardsTrack');
  const dotsContainer = document.getElementById('showcaseDotsContainer');
  const totalCountElem = document.getElementById('showcaseTotalCount');

  if (headerTitle) headerTitle.textContent = data.country;
  if (headerBadge) headerBadge.textContent = data.badge;
  if (headerIcon) headerIcon.className = `fa-solid ${data.icon || 'fa-gem'}`;
  if (categoryTag) categoryTag.textContent = data.categoryTag || (isSi ? 'ජනප්‍රියම ගමනාන්ත' : 'POPULAR DESTINATIONS');

  // Render Horizontal Floating Cards (Compact ~205px x 275px)
  if (cardsTrack) {
    cardsTrack.innerHTML = data.tours.map((tour, idx) => {
      const formattedAED = typeof formatPrice === 'function' ? formatPrice(tour.priceAED) : `AED ${tour.priceAED.toLocaleString()}`;
      return `
        <div class="showcase-preview-card ${idx === 0 ? 'active' : ''}" 
             data-tour-index="${idx}" 
             onclick="selectShowcaseTour(${idx})"
             ondblclick="openPlacesCoveredShowcase()"
             title="Click to select, double-click to view places covered"
             role="button"
             tabindex="0"
             aria-label="Select circuit ${tour.title}">
          <img src="${tour.thumbnail}" alt="${tour.title}" class="w-full h-full object-cover object-center transition-transform duration-700 pointer-events-none" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';">
          <div class="showcase-card-overlay"></div>
          
          <!-- Category Pill Badge (0.7rem, compact 3px 8px padding, whitespace-nowrap) -->
          <div class="showcase-category-badge">
            <i class="fa-solid ${tour.categoryIcon || 'fa-tag'} text-[9px] flex-shrink-0"></i>
            <span>${tour.category}</span>
          </div>

          <!-- Bottom Card Info -->
          <div class="absolute bottom-3 left-3 right-3 z-10 text-white pointer-events-none">
            <div class="flex items-center text-amber-400 text-[10px] gap-1 mb-0.5 font-semibold">
              <i class="fa-solid fa-star text-[9px]"></i>
              <span class="text-white font-bold ml-0.5">${tour.rating}</span>
            </div>
            <h4 class="showcase-card-title drop-shadow-md">${tour.title}</h4>
            
            <!-- Visited Places Badge Row -->
            <div class="showcase-card-stops">
              <i class="fa-solid fa-location-dot text-amber-400 text-[9px] mr-1 flex-shrink-0"></i>
              <span class="truncate">${(tour.keyStops || tour.destinations || []).join(' • ')}</span>
            </div>

            <div class="showcase-card-meta flex items-center justify-between text-slate-300 mt-1 font-medium pt-1.5 border-t border-white/15">
              <span class="flex items-center gap-1"><i class="fa-regular fa-clock text-amber-400 text-[9px]"></i>${tour.duration}</span>
              <div class="text-right">
                <span class="showcase-card-price price-aed text-amber-400 font-mono" data-base-aed="${tour.priceAED}">${formattedAED}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Indicator Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = data.tours.map((_, idx) => `
      <span class="dest-dot ${idx === 0 ? 'active' : ''}" onclick="selectShowcaseTour(${idx})" title="Tour ${idx + 1}"></span>
    `).join('');
  }

  // Set Total Count
  if (totalCountElem) {
    totalCountElem.textContent = String(data.tours.length).padStart(2, '0');
  }

  // Update initial active tour
  updateShowcaseTourUI(0, false);
  return true;
}

function openCountryShowcase(countryKey) {
  const modal = document.getElementById('destinationsModal') || document.getElementById('countryShowcaseModal') || document.querySelector('.showcase-modal-overlay');
  if (!modal) return;

  const populated = populateShowcaseData(countryKey);
  if (!populated) return;

  modal.classList.add('active');
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function updateShowcaseTourUI(index, animate = true) {
  const currentLang = typeof getPreferredLanguage === 'function' ? getPreferredLanguage() : (localStorage.getItem('site_lang') || 'en');
  const isSi = (currentLang === 'si');

  let data = COUNTRY_SHOWCASE_DATA[currentShowcaseCountryKey];
  if (!data || !data.tours || !data.tours[index]) return;

  if (isSi && typeof getLocalizedCountryShowcase === 'function') {
    const loc = getLocalizedCountryShowcase(currentShowcaseCountryKey, 'si');
    if (loc) data = loc;
  }

  const rawTour = data.tours[index];
  const tour = (isSi && typeof getLocalizedDestinationSlide === 'function') ? getLocalizedDestinationSlide(rawTour, 'si') : rawTour;
  const bgImg = document.getElementById('countryShowcaseBg');
  const titleElem = document.getElementById('showcaseActiveTitle');
  const subtitleElem = document.getElementById('showcaseActiveSubtitle');
  const ratingElem = document.getElementById('showcaseActiveRating');
  const reviewsElem = document.getElementById('showcaseActiveReviews');
  const durationElem = document.getElementById('showcaseActiveDuration');
  const descElem = document.getElementById('showcaseActiveDesc');
  const checklistElem = document.getElementById('showcaseActiveChecklist');
  const priceElem = document.getElementById('showcaseActivePrice');
  const altPriceElem = document.getElementById('showcaseActiveAltPrice');
  const whatsAppBtn = document.getElementById('showcaseWhatsAppBtn');
  const currentIdxElem = document.getElementById('showcaseCurrentIndex');

  // Background Image smooth transition
  if (bgImg) {
    if (animate) {
      bgImg.style.opacity = '0.35';
      bgImg.classList.add('zoom');
      setTimeout(() => {
        bgImg.src = tour.image;
        bgImg.style.opacity = '1';
        bgImg.classList.remove('zoom');
      }, 180);
    } else {
      bgImg.src = tour.image;
      bgImg.style.opacity = '1';
    }
  }

  // Text Animation
  if (animate) {
    if (titleElem) {
      titleElem.classList.remove('dest-text-fade');
      void titleElem.offsetWidth;
      titleElem.classList.add('dest-text-fade');
    }
    if (descElem) {
      descElem.classList.remove('dest-text-fade');
      void descElem.offsetWidth;
      descElem.classList.add('dest-text-fade');
    }
  }

  if (titleElem) titleElem.textContent = tour.title;
  if (subtitleElem) {
    subtitleElem.innerHTML = `<i class="fa-solid ${tour.categoryIcon || 'fa-tag'} text-amber-400 mr-1.5"></i>${tour.subtitle}`;
  }
  if (ratingElem) ratingElem.textContent = tour.rating;
  if (reviewsElem) reviewsElem.textContent = tour.reviews;
  if (durationElem) durationElem.textContent = tour.duration;
  if (descElem) descElem.textContent = tour.description;

  // Route & Key Highlights (Stops)
  const stopsElem = document.getElementById('showcaseActiveStops');
  const routeElem = document.getElementById('showcaseActiveRoute');
  const stops = tour.keyStops || tour.destinations || [];
  if (stopsElem) {
    stopsElem.innerHTML = stops.map(stop => `
      <span class="showcase-route-pill">
        <i class="fa-solid fa-location-dot text-[9px] text-amber-400 flex-shrink-0"></i>
        <span>${stop}</span>
      </span>
    `).join('');
  }
  if (routeElem) {
    routeElem.textContent = isSi ? 'සංචාරක මාර්ගය සහ ප්‍රධාන නැවතුම්' : 'Route & Key Highlights';
  }

  // Checklist with orange checkmarks
  if (checklistElem && tour.checklist) {
    checklistElem.innerHTML = tour.checklist.map(item => `
      <div class="flex items-center space-x-2">
        <i class="fa-solid fa-circle-check text-amber-500 text-xs flex-shrink-0"></i>
        <span class="truncate">${item}</span>
      </div>
    `).join('');
  }

  if (priceElem) {
    const formattedAED = typeof formatPrice === 'function' ? formatPrice(tour.priceAED) : `AED ${tour.priceAED.toLocaleString()}`;
    priceElem.classList.add('price-aed');
    priceElem.setAttribute('data-base-aed', tour.priceAED);
    priceElem.textContent = formattedAED;
  }
  if (altPriceElem) {
    altPriceElem.classList.remove('price-secondary');
    altPriceElem.removeAttribute('data-secondary-for');
    altPriceElem.removeAttribute('data-template');
    altPriceElem.textContent = '/ person';
  }

  // WhatsApp button dynamic pre-fill
  if (whatsAppBtn) {
    const dynamicMsg = `Hello Star Plus Travels, I'm interested in booking the ${tour.title}`;
    whatsAppBtn.href = `https://wa.me/971527582293?text=${encodeURIComponent(dynamicMsg)}`;
  }

  if (currentIdxElem) {
    currentIdxElem.textContent = String(index + 1).padStart(2, '0');
  }

  // Update card active states
  const cards = document.querySelectorAll('.showcase-preview-card');
  cards.forEach((c, idx) => {
    if (idx === index) {
      c.classList.add('active');
      c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      c.classList.remove('active');
    }
  });

  // Update dots
  const dots = document.querySelectorAll('#showcaseDotsContainer .dest-dot');
  dots.forEach((d, idx) => {
    if (idx === index) {
      d.classList.add('active');
    } else {
      d.classList.remove('active');
    }
  });
}

function selectShowcaseTour(index) {
  const data = COUNTRY_SHOWCASE_DATA[currentShowcaseCountryKey];
  if (!data || !data.tours || index < 0 || index >= data.tours.length) return;
  currentShowcaseTourIndex = index;
  updateShowcaseTourUI(index, true);
}

function nextCountryShowcaseSlide() {
  const data = COUNTRY_SHOWCASE_DATA[currentShowcaseCountryKey];
  if (!data || !data.tours) return;
  const nextIdx = (currentShowcaseTourIndex + 1) % data.tours.length;
  selectShowcaseTour(nextIdx);
}

function prevCountryShowcaseSlide() {
  const data = COUNTRY_SHOWCASE_DATA[currentShowcaseCountryKey];
  if (!data || !data.tours) return;
  const prevIdx = (currentShowcaseTourIndex - 1 + data.tours.length) % data.tours.length;
  selectShowcaseTour(prevIdx);
}

function closeCountryShowcase() {
  const modal = document.getElementById('destinationsModal') || document.getElementById('countryShowcaseModal') || document.querySelector('.showcase-modal-overlay');
  if (!modal) return;
  modal.classList.remove('active');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';
}

// Visual Places Gallery State
let currentShowcaseGalleryItems = [];
let currentShowcaseGalleryIndex = 0;
let currentActiveShowcaseTour = null;

function switchShowcaseGallery(index) {
  if (!currentShowcaseGalleryItems || !currentShowcaseGalleryItems[index]) return;
  currentShowcaseGalleryIndex = index;
  const item = currentShowcaseGalleryItems[index];

  const featImg = document.getElementById('showcaseGalleryFeaturedImg');
  const tagText = document.getElementById('showcaseGalleryTagText');
  const thumbs = document.querySelectorAll('#showcaseGalleryThumbs .showcase-gallery-thumb');

  if (featImg) {
    featImg.style.opacity = '0.35';
    setTimeout(() => {
      featImg.src = item.image;
      featImg.alt = item.title || item.tag || 'Destination Landmark';
      featImg.onerror = function() {
        this.onerror = null;
        this.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
      };
      featImg.style.opacity = '1';
    }, 150);
  }

  if (tagText) {
    tagText.textContent = item.tag || item.title || 'Featured Landmark';
  }

  thumbs.forEach((thumb, idx) => {
    if (idx === index) {
      thumb.classList.add('ring-2', 'ring-amber-400', 'border-transparent', 'active');
      thumb.classList.remove('border-slate-700', 'opacity-70');
    } else {
      thumb.classList.remove('ring-2', 'ring-amber-400', 'border-transparent', 'active');
      thumb.classList.add('border-slate-700', 'opacity-70');
    }
  });
}

// Visual Places Covered State (Modal Step 2 Drill-down)
let currentShowcasePlacesTour = null;
let currentShowcasePlaceIndex = 0;

function openPlacesCoveredShowcase(tour) {
  const data = COUNTRY_SHOWCASE_DATA[currentShowcaseCountryKey];
  const targetTour = tour || (data && data.tours ? data.tours[currentShowcaseTourIndex] : null);
  if (!targetTour) return;

  currentShowcasePlacesTour = targetTour;
  currentActiveShowcaseTour = targetTour;
  currentShowcasePlaceIndex = 0;

  const panel = document.getElementById('showcasePlacesCoveredPanel');
  if (!panel) return;

  // Header package name badge
  const pkgNameElem = document.getElementById('placesCoveredPackageName');
  if (pkgNameElem) {
    pkgNameElem.textContent = targetTour.title;
  }

  // Parent Tour badge
  const parentTourElem = document.getElementById('placesCoveredParentTour');
  if (parentTourElem) {
    parentTourElem.textContent = `${targetTour.duration} • ${targetTour.category || 'Curated Circuit'}`;
  }

  // Populate Places Covered Track
  const placesTrack = document.getElementById('placesCoveredCardsTrack');
  const places = targetTour.placesCovered || [];

  if (placesTrack) {
    if (places.length > 0) {
      placesTrack.innerHTML = places.map((place, idx) => `
        <div class="places-covered-card ${idx === 0 ? 'active' : ''}" 
             data-place-index="${idx}" 
             onclick="selectPlacesCoveredCard(${idx})"
             role="button"
             tabindex="0"
             aria-label="View ${place.name}">
          <img src="${place.image}" alt="${place.name}" class="w-full h-full object-cover object-center transition-transform duration-500 pointer-events-none" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';">
          <div class="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/40 to-transparent pointer-events-none"></div>
          
          <div class="places-card-indicator">
            <i class="fa-solid fa-check text-[10px]"></i>
          </div>

          <div class="absolute bottom-3 left-3 right-3 z-10 text-white pointer-events-none">
            <span class="text-[9px] font-black uppercase tracking-wider text-amber-400 block mb-0.5">${place.tagline || 'HIGHLIGHT'}</span>
            <h4 class="text-sm font-bold text-white font-heading leading-tight drop-shadow-md line-clamp-1">${place.name}</h4>
            <span class="text-[10px] text-slate-300 font-medium flex items-center gap-1 mt-0.5">
              <i class="fa-solid fa-location-dot text-amber-400 text-[9px]"></i>
              <span class="truncate">${place.tagline || 'Included Stop'}</span>
            </span>
          </div>
        </div>
      `).join('');
    } else {
      placesTrack.innerHTML = `<div class="text-slate-400 text-xs py-4">Highlights included in package itinerary.</div>`;
    }
  }

  // Update initial active place
  selectPlacesCoveredCard(0, false);

  // Cross-fade in the panel
  panel.classList.remove('hidden');
  panel.style.display = 'flex';
  requestAnimationFrame(() => {
    panel.classList.add('active');
  });
  panel.setAttribute('aria-hidden', 'false');
}

function closePlacesCoveredShowcase() {
  const panel = document.getElementById('showcasePlacesCoveredPanel');
  if (!panel) return;
  panel.classList.remove('active');
  setTimeout(() => {
    panel.classList.add('hidden');
    panel.style.display = 'none';
    panel.setAttribute('aria-hidden', 'true');
  }, 300);
}

function selectPlacesCoveredCard(index, animate = true) {
  if (!currentShowcasePlacesTour || !currentShowcasePlacesTour.placesCovered) return;
  const places = currentShowcasePlacesTour.placesCovered;
  if (index < 0 || index >= places.length) return;

  currentShowcasePlaceIndex = index;
  const place = places[index];

  const backdropImg = document.getElementById('placesCoveredBackdrop');
  const subtitleElem = document.getElementById('placesCoveredSubtitle');
  const titleElem = document.getElementById('placesCoveredTitle');
  const taglineElem = document.getElementById('placesCoveredTagline');
  const descElem = document.getElementById('placesCoveredDesc');
  const checkmarksElem = document.getElementById('placesCoveredCheckmarks');
  const waBtn = document.getElementById('placesCoveredWhatsAppBtn');

  // Backdrop smooth transition
  if (backdropImg) {
    if (animate) {
      backdropImg.style.opacity = '0.3';
      backdropImg.style.transform = 'scale(1.04)';
      setTimeout(() => {
        backdropImg.src = place.image;
        backdropImg.style.opacity = '1';
        backdropImg.style.transform = 'scale(1)';
      }, 160);
    } else {
      backdropImg.src = place.image;
      backdropImg.style.opacity = '1';
      backdropImg.style.transform = 'scale(1)';
    }
  }

  if (subtitleElem) {
    subtitleElem.innerHTML = `<span>${place.category || '— INCLUDED LANDMARK EXPERIENCE'}</span>`;
  }
  if (titleElem) {
    titleElem.textContent = place.name.toUpperCase();
  }
  if (taglineElem) {
    taglineElem.textContent = place.tagline || 'Key Itinerary Stop';
  }
  if (descElem) {
    descElem.textContent = place.description || 'Experience the quintessential beauty and cultural wonders of this destination.';
  }

  // Checkmarks
  if (checkmarksElem) {
    const checks = place.checkmarks || ['Included guided exploration', 'Scenic photography stop', 'Comfortable private transfer'];
    checkmarksElem.innerHTML = checks.map(c => `
      <div class="flex items-center space-x-2">
        <i class="fa-solid fa-circle-check text-amber-400 text-xs flex-shrink-0"></i>
        <span>${c}</span>
      </div>
    `).join('');
  }

  // WhatsApp CTA button pre-filled message
  if (waBtn) {
    const tourTitle = currentShowcasePlacesTour.title;
    const msg = `Hello Star Plus Travels, I'm interested in the ${tourTitle} covering ${place.name}. Please send details!`;
    waBtn.href = `https://wa.me/971527582293?text=${encodeURIComponent(msg)}`;
  }

  // Highlight active place card
  const cards = document.querySelectorAll('#placesCoveredCardsTrack .places-covered-card');
  cards.forEach((c, idx) => {
    if (idx === index) {
      c.classList.add('active');
      c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      c.classList.remove('active');
    }
  });
}

function scrollPlacesCoveredTrack(direction) {
  const track = document.getElementById('placesCoveredCardsTrack');
  if (!track) return;
  const scrollAmount = 210;
  if (direction === 'left') {
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

function viewDetailedItineraryFromPlaces() {
  if (currentShowcasePlacesTour) {
    openShowcaseItinerary(currentShowcasePlacesTour);
  }
}

function bookCurrentShowcaseTour() {
  const tour = currentShowcasePlacesTour || (COUNTRY_SHOWCASE_DATA[currentShowcaseCountryKey]?.tours[currentShowcaseTourIndex]);
  const tourTitle = tour ? tour.title : 'Curated Tour Package';
  if (typeof openBookingModal === 'function') {
    openBookingModal(tourTitle);
  } else {
    const msg = `Hello Star Plus Travels, I would like to book the ${tourTitle}`;
    window.open(`https://wa.me/971527582293?text=${encodeURIComponent(msg)}`, '_blank');
  }
}

// "VIEW PACKAGE DETAILS" Handler -> Opens Modal Step 2 Places Covered Showcase
function handleShowcaseDetailsAction() {
  const data = COUNTRY_SHOWCASE_DATA[currentShowcaseCountryKey];
  if (!data || !data.tours) return;
  const currentTour = data.tours[currentShowcaseTourIndex];
  if (!currentTour) return;
  openPlacesCoveredShowcase(currentTour);
}

// Normalize destination data across any tour/package format into dynamic editorial schema
function normalizeDestinationModalData(raw) {
  if (!raw) return null;
  const title = raw.title || raw.name || 'Star Plus Curated Package';

  // Category Tag: normalize to luxury uppercase categories
  let category = (raw.category || raw.destination || '').toUpperCase();
  if (category.includes('DUBAI') || category.includes('CITY') || category.includes('UAE') || category.includes('FAMILY')) {
    category = 'CITY BREAK & LUXURY';
  } else if (category.includes('SRI LANKA') || category.includes('SAFARI') || category.includes('NATURE') || category.includes('WILDLIFE')) {
    category = 'SAFARI & WILDLIFE';
  } else if (category.includes('AZERBAIJAN') || category.includes('GEORGIA') || category.includes('CAUCASUS') || category.includes('ALPINE') || category.includes('MOUNTAIN') || category.includes('HERITAGE')) {
    category = 'ALPINE & HERITAGE';
  } else if (category.includes('MALDIVES') || category.includes('BALI') || category.includes('BEACH') || category.includes('ISLAND') || category.includes('HONEYMOON') || category.includes('TROPICAL')) {
    category = 'TROPICAL ESCAPE';
  } else {
    category = raw.category ? raw.category.toUpperCase() : 'LUXURY GETAWAY';
  }

  const rating = raw.rating ? String(raw.rating) : '5.0';
  const reviewCount = raw.reviewCount || raw.reviews || '450+ reviews';
  const duration = raw.duration || '5 Days / 4 Nights';

  // Gallery Images & Thumbnails: dynamic array for hero view and thumbnail strip
  let galleryImages = [];
  if (Array.isArray(raw.galleryImages) && raw.galleryImages.length > 0) {
    galleryImages = raw.galleryImages.map(g => typeof g === 'string' ? { image: g, title } : g);
  } else if (Array.isArray(raw.gallery) && raw.gallery.length > 0) {
    galleryImages = raw.gallery.map(g => typeof g === 'string' ? { image: g, title } : { image: g.image, title: g.title || g.tag || title });
  } else if (raw.image) {
    galleryImages = [{ image: raw.image, title }];
  } else {
    galleryImages = [{ image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=1200&q=80', title }];
  }

  // 3 Highlights / Key Inclusions: array of 3 distinct features per destination
  let highlights = [];
  if (Array.isArray(raw.highlights) && raw.highlights.length >= 3) {
    highlights = raw.highlights.slice(0, 3);
  } else {
    const pool = raw.inclusions || raw.perks || raw.checklist || [];
    const stayFeature = raw.stay 
      ? raw.stay 
      : pool.find(i => /hotel|resort|lodge|villa|stay|night/i.test(i)) 
      || 'Handpicked 4-Star & 5-Star Luxury Boutique Accommodation';

    const transferFeature = pool.find(i => /transfer|chauffeur|jeep|seaplane|boat|flight|vehicle/i.test(i)) 
      || 'VIP Private Airport Transfers & Dedicated Chauffeur Logistics';

    const excursionFeature = pool.find(i => /tour|safari|excursion|entry|cruise|ticket|pass|sightseeing|guided/i.test(i) && i !== transferFeature && i !== stayFeature)
      || (raw.keyStops && raw.keyStops.length > 0 ? `Curated Excursions across ${raw.keyStops.join(', ')}` : 'Curated Guided Excursions & Signature Landmark Access');

    highlights = [stayFeature, transferFeature, excursionFeature];
  }

  // Highlights Pill Row: 3-4 quick tags
  let highlightTags = [];
  if (Array.isArray(raw.highlightTags) && raw.highlightTags.length > 0) {
    highlightTags = raw.highlightTags;
  } else if (Array.isArray(raw.keyStops) && raw.keyStops.length > 0) {
    const emojis = ['🐆', '🚂', '🏖️', '🏔️', '🕌', '🏝️', '⛵', '🌋'];
    highlightTags = raw.keyStops.slice(0, 4).map((s, idx) => `${emojis[idx % emojis.length]} ${s}`);
  } else if (Array.isArray(raw.highlights) && raw.highlights.length > 0) {
    highlightTags = raw.highlights.slice(0, 3).map(h => `✨ ${h.split(' ').slice(0, 4).join(' ')}`);
  } else {
    highlightTags = ['⭐ VIP Transfers', '🏨 Handpicked Stays', '✨ Curated Experiences'];
  }

  // Pricing & Currency
  const priceAED = Number(raw.priceAED || raw.price || 1890);
  const isSl = raw.category === 'srilanka' || raw.countryKey === 'srilanka' || (raw.destination && raw.destination.toLowerCase().includes('sri lanka')) || (raw.title && raw.title.toLowerCase().includes('sri lanka')) || (raw.id && (raw.id.startsWith('sl-') || raw.id.includes('sri-lanka')));
  let priceSecondary = raw.priceSecondary || '';
  if (!priceSecondary) {
    if (isSl) {
      priceSecondary = '';
    } else if (raw.priceLKR) {
      priceSecondary = raw.priceLKR;
    } else {
      const approxUSD = Math.round(priceAED * 0.272);
      priceSecondary = `approx. $${approxUSD.toLocaleString()} USD`;
    }
  } else if (isSl && priceSecondary.includes('LKR')) {
    priceSecondary = '';
  }

  // Pre-fill WhatsApp link with specific destination title
  const whatsappUrl = `https://wa.me/971527582293?text=Hello%20Star%20Plus,%20I%20am%20interested%20in%20the%20${encodeURIComponent(title)}%20package.`;

  return {
    ...raw,
    title,
    category,
    rating,
    reviewCount,
    duration,
    galleryImages,
    highlights,
    highlightTags,
    priceAED,
    priceSecondary,
    whatsappUrl
  };
}

// LEVEL 3: Comprehensive Package Itinerary & Visual Showcase Drawer Logic
function openShowcaseItinerary(tour) {
  if (!tour) return;

  const modal = document.getElementById('showcaseItineraryModal');
  if (!modal) return;

  const currentLang = typeof getPreferredLanguage === 'function' ? getPreferredLanguage() : (localStorage.getItem('site_lang') || 'en');
  const isSi = (currentLang === 'si');

  const data = normalizeDestinationModalData(tour);
  if (!data) return;

  currentActiveShowcaseTour = data;

  const featImg = document.getElementById('showcaseGalleryFeaturedImg');
  const fallbackImg = document.getElementById('showcaseItineraryImg');
  const thumbsElem = document.getElementById('showcaseGalleryThumbs');
  const badgeElem = document.getElementById('showcaseItineraryBadge');
  const durationElem = document.getElementById('showcaseItineraryDuration');
  const ratingElem = document.getElementById('showcaseItineraryRating');
  const reviewsElem = document.getElementById('showcaseItineraryReviews');
  const titleElem = document.getElementById('showcaseItineraryTitle');
  const subtitleElem = document.getElementById('showcaseItinerarySubtitle');
  const descElem = document.getElementById('showcaseItineraryDesc');
  const highlightTagsElem = document.getElementById('showcaseItineraryHighlightTags');
  const highlightsGrid = document.getElementById('showcaseItineraryHighlightsGrid');
  const inclusionsElem = document.getElementById('showcaseItineraryInclusions');
  const daysElem = document.getElementById('showcaseItineraryDays');
  const finePrintElem = document.getElementById('showcaseItineraryFinePrint');
  const priceElem = document.getElementById('showcaseItineraryPrice');
  const altPriceElem = document.getElementById('showcaseItineraryAltPrice');
  const waBtn = document.getElementById('showcaseItineraryWaBtn');

  // Setup Visual Places Gallery
  currentShowcaseGalleryItems = data.galleryImages;

  // Populate Gallery Thumbnails with w-16 h-12 md:w-20 md:h-14, onerror fallback, and active ring-2 ring-amber-400
  if (thumbsElem) {
    thumbsElem.innerHTML = currentShowcaseGalleryItems.map((item, idx) => `
      <button type="button" 
              onclick="switchShowcaseGallery(${idx})" 
              class="showcase-gallery-thumb flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border cursor-pointer transition-all ${idx === 0 ? 'ring-2 ring-amber-400 border-transparent active' : 'border-slate-700 hover:border-amber-400 opacity-70 hover:opacity-100'}" 
              title="${item.title || 'Tour landmark'}">
        <img src="${item.image}" alt="${item.title || 'Tour landmark'}" class="w-full h-full object-cover object-center pointer-events-none" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';">
      </button>
    `).join('');
  }

  // Switch to initial photo
  switchShowcaseGallery(0);
  if (fallbackImg) fallbackImg.src = data.galleryImages[0]?.image || data.image || '';

  if (badgeElem) badgeElem.textContent = data.category;
  if (durationElem) durationElem.textContent = data.duration;
  if (ratingElem) ratingElem.textContent = data.rating;
  if (reviewsElem) reviewsElem.textContent = data.reviewCount;
  if (titleElem) titleElem.textContent = data.title;
  if (subtitleElem) {
    subtitleElem.className = 'text-xs md:text-sm font-medium text-amber-400/90 tracking-wide uppercase mt-1 flex items-center gap-1.5';
    subtitleElem.innerHTML = `<i class="fa-solid ${data.categoryIcon || 'fa-tag'} text-amber-400"></i><span>${data.subtitle || data.duration + ' CURATED JOURNEY'}</span>`;
  }
  if (descElem) descElem.textContent = data.description;

  // Render Highlights Pill Row: 3–4 quick tags
  if (highlightTagsElem) {
    const tags = data.highlightTags || [];
    highlightTagsElem.innerHTML = tags.map(tag => `
      <span class="bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
        ${tag}
      </span>
    `).join('');
  }

  // Render 3 Highlights Grid (Responsive 3-column layout below media section)
  if (highlightsGrid) {
    const icons = ['fa-hotel', 'fa-car-side', 'fa-compass'];
    const labels = isSi 
      ? ['තෝරාගත් සුඛෝපභෝගී නවාතැන්', 'පෞද්ගලික ප්‍රවාහන පහසුකම්', 'සුවිශේෂී අත්දැකීම්']
      : ['HANDPICKED LODGING', 'VIP PRIVATE TRANSFERS', 'SIGNATURE EXPERIENCES'];
    highlightsGrid.innerHTML = data.highlights.map((h, i) => `
      <div class="p-3.5 sm:p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-amber-500/40 transition-colors flex items-start space-x-3 shadow-md">
        <div class="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i class="fa-solid ${icons[i] || 'fa-gem'} text-sm"></i>
        </div>
        <div class="flex-1 min-w-0">
          <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">${labels[i] || 'HIGHLIGHT'}</span>
          <span class="text-slate-200 text-xs font-medium leading-snug line-clamp-3">${h}</span>
        </div>
      </div>
    `).join('');
  }


  // Render Key Stops in Drawer
  const itinStopsElem = document.getElementById('showcaseItineraryStopsContainer');
  if (itinStopsElem) {
    const stops = data.keyStops || data.destinations || [];
    itinStopsElem.innerHTML = stops.map(stop => `
      <span class="showcase-route-pill">
        <i class="fa-solid fa-location-dot text-[9px] text-[#F59E0B] flex-shrink-0"></i>
        <span>${stop}</span>
      </span>
    `).join('');
  }

  // Render Accommodation & Hotel Stay Tier
  const stayElem = document.getElementById('showcaseItineraryStay');
  if (stayElem) {
    if (data.stay) {
      stayElem.textContent = data.stay;
    } else {
      stayElem.textContent = data.highlights[0] || `${data.duration || 'Multi-day'} Luxury 4-Star & 5-Star Handpicked Lodging`;
    }
  }

  // Render Included Services
  if (inclusionsElem) {
    const list = data.inclusions || data.checklist || [];
    inclusionsElem.innerHTML = list.map(item => `
      <div class="flex items-start space-x-2 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800 shadow-sm">
        <i class="fa-solid fa-circle-check text-[#F59E0B] text-xs mt-0.5 flex-shrink-0"></i>
        <span class="text-slate-200 text-xs">${item}</span>
      </div>
    `).join('');
  }

  // Render Day-by-Day Journey Breakdown with Milestones
  if (daysElem) {
    const itinerary = data.itinerary || [];
    daysElem.innerHTML = itinerary.map((item, idx) => {
      const text = `${item.title} ${item.desc || ''}`.toLowerCase();
      
      // Determine transport milestone
      let transportBadge = '';
      if (text.includes('safari') || text.includes('4x4') || text.includes('jeep') || text.includes('land cruiser')) {
        transportBadge = `<span class="itinerary-milestone-pill bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"><i class="fa-solid fa-truck-monster text-[10px]"></i> ${isSi ? '4x4 සෆාරි ජීප් රථය' : '4x4 Safari Jeep'}</span>`;
      } else if (text.includes('seaplane') || text.includes('flight') || text.includes('airport')) {
        transportBadge = `<span class="itinerary-milestone-pill bg-sky-500/15 text-sky-300 border border-sky-500/30"><i class="fa-solid fa-plane-departure text-[10px]"></i> ${isSi ? 'මුහුදු ගුවන් යානය / ගුවන් ගමන' : 'Seaplane / Flight'}</span>`;
      } else if (text.includes('speedboat') || text.includes('cruise') || text.includes('dhow') || text.includes('boat') || text.includes('yacht') || text.includes('ferry')) {
        transportBadge = `<span class="itinerary-milestone-pill bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"><i class="fa-solid fa-ship text-[10px]"></i> ${isSi ? 'සුඛෝපභෝගී බෝට්ටු / කෲස්' : 'Cruise / Speedboat'}</span>`;
      } else if (text.includes('train') || text.includes('railway')) {
        transportBadge = `<span class="itinerary-milestone-pill bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"><i class="fa-solid fa-train text-[10px]"></i> ${isSi ? 'මනරම් දුම්රිය චාරිකාව' : 'Scenic Train'}</span>`;
      } else {
        transportBadge = `<span class="itinerary-milestone-pill bg-amber-500/15 text-amber-300 border border-amber-500/30"><i class="fa-solid fa-car-side text-[10px]"></i> ${isSi ? 'පෞද්ගලික රියදුරු සහිත වාහනය' : 'Private AC Chauffeur'}</span>`;
      }

      // Determine meal milestone
      let mealBadge = '';
      if (text.includes('bbq') || text.includes('barbecue')) {
        mealBadge = `<span class="itinerary-milestone-pill bg-rose-500/15 text-rose-300 border border-rose-500/30"><i class="fa-solid fa-fire text-[10px]"></i> ${isSi ? 'VIP BBQ රාත්‍රී භෝජනය' : 'VIP BBQ Dinner'}</span>`;
      } else if (text.includes('all-inclusive') || text.includes('dine-around') || text.includes('full board')) {
        mealBadge = `<span class="itinerary-milestone-pill bg-purple-500/15 text-purple-300 border border-purple-500/30"><i class="fa-solid fa-wine-glass text-[10px]"></i> ${isSi ? 'සියලු ආහාරපාන ඇතුළත්' : 'All-Inclusive Dine'}</span>`;
      } else if (text.includes('dinner')) {
        mealBadge = `<span class="itinerary-milestone-pill bg-amber-500/15 text-amber-300 border border-amber-500/30"><i class="fa-solid fa-utensils text-[10px]"></i> ${isSi ? 'රාත්‍රී භෝජනය ඇතුළත්' : 'Dinner Included'}</span>`;
      } else if (text.includes('lunch')) {
        mealBadge = `<span class="itinerary-milestone-pill bg-amber-500/15 text-amber-300 border border-amber-500/30"><i class="fa-solid fa-utensils text-[10px]"></i> ${isSi ? 'දිවා ආහාරය ඇතුළත්' : 'Lunch Included'}</span>`;
      } else if (text.includes('breakfast') || text.includes('buffet')) {
        mealBadge = `<span class="itinerary-milestone-pill bg-blue-500/15 text-blue-300 border border-blue-500/30"><i class="fa-solid fa-mug-saucer text-[10px]"></i> ${isSi ? 'උදෑසන ආහාරය ඇතුළත්' : 'Buffet Breakfast'}</span>`;
      }

      return `
        <div class="itinerary-day-card">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[#F59E0B] font-extrabold text-[10px] uppercase tracking-wider">
              <i class="fa-solid fa-calendar-day text-[9px]"></i>
              <span>${isSi ? `දිනය ${item.day || (idx + 1)}` : `DAY ${item.day || (idx + 1)}`}</span>
            </div>
            <div class="flex flex-wrap items-center gap-1.5">
              ${transportBadge}
              ${mealBadge}
            </div>
          </div>
          <h5 class="text-xs sm:text-sm font-bold text-white mb-1.5 font-heading">${item.title}</h5>
          <p class="text-[11px] sm:text-xs text-slate-300 leading-relaxed">${item.desc || ''}</p>
        </div>
      `;
    }).join('');
  }

  // Render Fine Print
  if (finePrintElem) {
    const finePrint = data.finePrint || [
      'Standard hotel check-in at 14:00 hrs & check-out at 12:00 hrs.',
      'Rates are subject to peak season / festive period surcharges.',
      'Valid passport (min. 6 months validity) and relevant tourist visa required.',
      '0% Tabby installment financing options available upon booking confirmation.'
    ];
    finePrintElem.innerHTML = finePrint.map(fp => `<li>${fp}</li>`).join('');
  }

  // Price Display
  if (priceElem) {
    const formattedAED = typeof formatPrice === 'function' ? formatPrice(data.priceAED) : `AED ${data.priceAED.toLocaleString()}`;
    priceElem.classList.add('price-aed');
    priceElem.setAttribute('data-base-aed', data.priceAED);
    priceElem.textContent = formattedAED;
  }
  if (altPriceElem) {
    altPriceElem.classList.remove('price-secondary');
    altPriceElem.removeAttribute('data-secondary-for');
    altPriceElem.removeAttribute('data-template');
    altPriceElem.textContent = '';
  }

  // WhatsApp Inquiry CTA
  if (waBtn) {
    waBtn.href = data.whatsappUrl;
    const waSpan = waBtn.querySelector('span');
    if (waSpan) {
      waSpan.textContent = isSi ? 'WhatsApp මගින් විමසන්න' : 'Inquire via WhatsApp';
    }
  }

  // Localize Drawer section titles and footer
  const rateLabel = modal.querySelector('.showcase-drawer-footer span.uppercase');
  if (rateLabel) {
    rateLabel.textContent = isSi ? 'සියල්ල ඇතුළත් ආරම්භක මිල' : 'All-Inclusive Starting Rate';
  }
  const perPersonSpan = modal.querySelector('.showcase-drawer-footer span.text-slate-400.font-medium:last-of-type');
  if (perPersonSpan) {
    perPersonSpan.textContent = isSi ? '/ පුද්ගලයෙකුට' : '/ person';
  }
  const brochureBtnSpan = modal.querySelector('#showcaseDownloadPdfBtn span');
  if (brochureBtnSpan) {
    brochureBtnSpan.textContent = isSi ? 'විස්තර පත්‍රිකාව' : 'Brochure';
  }

  // Show drawer with slide-in animation
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  requestAnimationFrame(() => {
    modal.classList.add('active');
  });
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeShowcaseItinerary() {
  const modal = document.getElementById('showcaseItineraryModal');
  if (!modal) return;
  modal.classList.remove('active');
  setTimeout(() => {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    // If the country showcase is still open, keep body overflow hidden
    const countryModal = document.getElementById('countryShowcaseModal');
    if (!countryModal || countryModal.classList.contains('hidden')) {
      document.body.style.overflow = '';
    }
  }, 350);
}

// Download PDF Brochure Function
function downloadShowcaseBrochure() {
  if (currentActiveShowcaseTour) {
    downloadTourBrochure(currentActiveShowcaseTour);
    return;
  }
  const data = COUNTRY_SHOWCASE_DATA[currentShowcaseCountryKey];
  if (!data || !data.tours) return;
  const tour = data.tours[currentShowcaseTourIndex];
  if (!tour) return;
  downloadTourBrochure(tour);
}

function downloadTourBrochure(tour) {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Please allow popups to download or print the PDF brochure.');
    return;
  }

  const formattedAED = typeof formatPrice === 'function' ? formatPrice(tour.priceAED) : `AED ${tour.priceAED.toLocaleString()}`;
  const priceDisplay = formattedAED;

  const inclusionsHtml = (tour.inclusions || tour.checklist || []).map(inc => `
    <li style="margin-bottom: 7px; display: flex; align-items: flex-start;">
      <span style="color: #d97706; margin-right: 8px; font-weight: bold;">&#10004;</span>
      <span>${inc}</span>
    </li>
  `).join('');

  const itineraryHtml = (tour.itinerary || []).map(day => `
    <div style="margin-bottom: 16px; padding-left: 14px; border-left: 2px solid #f59e0b;">
      <div style="font-size: 11px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 1px;">Day ${day.day}: ${day.title}</div>
      <div style="font-size: 13px; color: #334155; margin-top: 4px; line-height: 1.5;">${day.desc}</div>
    </div>
  `).join('');

  const finePrintHtml = (tour.finePrint || []).map(fp => `
    <li style="margin-bottom: 4px; color: #475569; font-size: 11px;">${fp}</li>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${tour.title} - Star Plus Travels Official Brochure</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #0f172a;
          background: #ffffff;
          margin: 0;
          padding: 24px;
          line-height: 1.4;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #f59e0b;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .brand-title {
          font-size: 22px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }
        .brand-sub {
          font-size: 11px;
          color: #b45309;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .hero {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .tour-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
        }
        .tour-meta {
          font-size: 12px;
          font-weight: 700;
          color: #d97706;
          margin-bottom: 8px;
        }
        .tour-desc {
          font-size: 13px;
          color: #334155;
          line-height: 1.5;
        }
        .price-tag {
          font-size: 16px;
          font-weight: 800;
          color: #b45309;
          margin-top: 8px;
        }
        .section-title {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #0f172a;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 6px;
          margin-top: 18px;
          margin-bottom: 12px;
        }
        .footer {
          margin-top: 24px;
          border-top: 2px solid #f59e0b;
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #64748b;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 16px; text-align: right;">
        <button onclick="window.print()" style="background: #f59e0b; color: #000; font-weight: bold; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Print / Save as PDF</button>
      </div>
      <div class="header">
        <div>
          <div class="brand-title">Star Plus Travels &amp; Tourism LLC</div>
          <div class="brand-sub">Official Luxury Travel Itinerary &amp; Package Brochure</div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #475569;">
          <div><strong>UAE Concierge:</strong> +971 52 758 2293</div>
          <div><strong>Landline:</strong> +971 4 227 0005</div>
          <div><strong>Web:</strong> starplustravels.com</div>
        </div>
      </div>

      <div class="hero">
        <h1 class="tour-title">${tour.title}</h1>
        <div class="tour-meta">${tour.category} &bull; ${tour.duration} &bull; Rating: ${tour.rating} â˜…</div>
        <div class="tour-desc">${tour.description}</div>
        <div class="price-tag">Starting Rate: ${priceDisplay}</div>
      </div>

      <div class="section-title">Included Services &amp; Highlights</div>
      <ul style="list-style: none; padding: 0; margin: 0; font-size: 12px; color: #1e293b;">
        ${inclusionsHtml}
      </ul>

      <div class="section-title">Day-by-Day Journey Breakdown</div>
      <div>
        ${itineraryHtml}
      </div>

      ${tour.finePrint && tour.finePrint.length ? `
        <div class="section-title">Terms, Visa &amp; Fine Print</div>
        <ul style="padding-left: 20px; margin: 0;">
          ${finePrintHtml}
        </ul>
      ` : ''}

      <div class="footer">
        <div>Star Plus Travels &amp; Tourism LLC &bull; Dubai, United Arab Emirates</div>
        <div>Inquire on WhatsApp: +971 52 758 2293 &bull; info@starplustravels.com</div>
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 350);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

// Keyboard navigation for Country Showcase, Places Covered & Itinerary Modals
document.addEventListener('keydown', (e) => {
  const placesPanel = document.getElementById('showcasePlacesCoveredPanel');
  if (placesPanel && !placesPanel.classList.contains('hidden')) {
    if (e.key === 'Escape') {
      closePlacesCoveredShowcase();
      return;
    } else if (e.key === 'ArrowRight') {
      scrollPlacesCoveredTrack('right');
    } else if (e.key === 'ArrowLeft') {
      scrollPlacesCoveredTrack('left');
    }
  }

  const itineraryModal = document.getElementById('showcaseItineraryModal');
  if (itineraryModal && !itineraryModal.classList.contains('hidden')) {
    if (e.key === 'Escape') {
      closeShowcaseItinerary();
      return;
    }
  }

  const modal = document.getElementById('countryShowcaseModal');
  if (!modal || modal.classList.contains('hidden')) return;
  if (e.key === 'Escape') {
    closeCountryShowcase();
  } else if (e.key === 'ArrowRight') {
    nextCountryShowcaseSlide();
  } else if (e.key === 'ArrowLeft') {
    prevCountryShowcaseSlide();
  }
});

function scrollCountryShowcaseCards(direction) {
  const track = document.getElementById('countryShowcaseCardsTrack');
  if (!track) return;
  const cardWidth = window.innerWidth < 768 ? 182 : 225;
  if (direction === 'left') {
    track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    prevCountryShowcaseSlide();
  } else {
    track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    nextCountryShowcaseSlide();
  }
}

window.openCountryShowcase = openCountryShowcase;
window.closeCountryShowcase = closeCountryShowcase;
window.selectShowcaseTour = selectShowcaseTour;
window.nextCountryShowcaseSlide = nextCountryShowcaseSlide;
window.prevCountryShowcaseSlide = prevCountryShowcaseSlide;
window.handleShowcaseDetailsAction = handleShowcaseDetailsAction;
window.openPlacesCoveredShowcase = openPlacesCoveredShowcase;
window.closePlacesCoveredShowcase = closePlacesCoveredShowcase;
window.selectPlacesCoveredCard = selectPlacesCoveredCard;
window.scrollPlacesCoveredTrack = scrollPlacesCoveredTrack;
window.viewDetailedItineraryFromPlaces = viewDetailedItineraryFromPlaces;
window.bookCurrentShowcaseTour = bookCurrentShowcaseTour;
window.openShowcaseItinerary = openShowcaseItinerary;
window.closeShowcaseItinerary = closeShowcaseItinerary;
window.switchShowcaseGallery = switchShowcaseGallery;
window.downloadShowcaseBrochure = downloadShowcaseBrochure;
window.downloadTourBrochure = downloadTourBrochure;
window.scrollCountryShowcaseCards = scrollCountryShowcaseCards;
window.normalizeDestinationModalData = normalizeDestinationModalData;
window.openItineraryModal = openItineraryModal;
window.closeItineraryModal = closeItineraryModal;
window.switchPackageGallery = switchPackageGallery;
window.downloadCurrentPackageBrochure = downloadCurrentPackageBrochure;

window.populateShowcaseData = populateShowcaseData;
window.openCountryPackages = function(countryKey) {
  const showcaseModal = document.getElementById('destinationsModal') || document.getElementById('countryShowcaseModal') || document.querySelector('.showcase-modal-overlay');
  if (showcaseModal && COUNTRY_SHOWCASE_DATA[countryKey]) {
    return openCountryShowcase(countryKey);
  }
  if (typeof originalOpenCountryPackages === 'function') {
    return originalOpenCountryPackages(countryKey);
  }
};
window.closeCountryPackages = closeCountryShowcase;

// Explicit Event Listener Bindings for "VIEW PACKAGE DETAILS" CTA
// Explicit Event Listener Bindings for "VIEW PACKAGE DETAILS" CTA & Search Reset
function initShowcaseAndSearch() {
  const detailsBtn = document.getElementById('showcaseDetailsBtn');
  if (detailsBtn) {
    detailsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleShowcaseDetailsAction();
    });
  }

  document.querySelectorAll('.view-package-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleShowcaseDetailsAction();
    });
  });

  // Explicit Event Listener Binding for Tour Packages Search Reset Button
  const resetBtn = document.getElementById('searchResetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetFilters();
    });
  }

  document.querySelectorAll('.reset-search-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resetFilters();
    });
  });

  // Initialize Reset button visibility state on page load
  if (typeof updateResetButtonVisibility === 'function') {
    updateResetButtonVisibility();
  }

  // Initialize dynamic quote form fields based on initial/default interest
  if (typeof updateQuoteFormFields === 'function') {
    updateQuoteFormFields();
  }

  // Initialize international telephone inputs
  initIntlTelInputs();

  // Initialize newsletter form event listeners
  initNewsletterForms();
}

// ============================================================================
// Footer Newsletter Form Event Binding
// ============================================================================
function initNewsletterForms() {
  const forms = document.querySelectorAll('form[onsubmit*="handleNewsletter"], #newsletterEmail');
  forms.forEach(el => {
    const form = el.tagName === 'FORM' ? el : el.closest('form');
    if (form && !form.dataset.newsletterBound) {
      form.dataset.newsletterBound = 'true';
      form.addEventListener('submit', handleNewsletter);
    }
  });
}
window.initNewsletterForms = initNewsletterForms;

// ============================================================================
// Custom Luxury Form Validation & Inline Error System
// ============================================================================
const EXCLAMATION_SVG = `<svg class="w-5 h-5 shrink-0 text-rose-400" style="width: 20px; height: 20px; flex-shrink: 0;" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`;

function showFieldError(input, message) {
  if (!input) return;

  // 1. Refined crimson/coral border with gentle 300ms CSS shake animation
  input.classList.remove('input-shake');
  void input.offsetWidth; // Force DOM reflow to re-trigger animation
  input.classList.add(
    'border-rose-500/80',
    'focus:border-rose-500',
    'focus:ring-1',
    'focus:ring-rose-500/40',
    'field-error-border',
    'input-shake'
  );
  setTimeout(() => {
    input.classList.remove('input-shake');
  }, 350);

  // 2. Determine container anchor for phone inputs or relative wrappers
  const itiContainer = input.closest('.iti');
  let anchor = itiContainer || input;
  if (anchor.parentElement && anchor.parentElement.classList.contains('relative') && !itiContainer) {
    anchor = anchor.parentElement;
  }

  // 3. Render or update elegant error microcopy underneath the input
  const errorKey = input.id || input.name || 'field';
  let errEl = anchor.parentElement ? anchor.parentElement.querySelector(`[data-field-error-for="${errorKey}"]`) : null;
  if (!errEl && anchor.nextElementSibling && anchor.nextElementSibling.classList.contains('custom-inline-error')) {
    errEl = anchor.nextElementSibling;
  }

  if (!errEl) {
    errEl = document.createElement('div');
    errEl.setAttribute('data-field-error-for', errorKey);
    anchor.insertAdjacentElement('afterend', errEl);
  }

  errEl.className = 'custom-inline-error flex items-center gap-2 text-sm text-rose-400 mt-1';
  errEl.innerHTML = `${EXCLAMATION_SVG}<span>${message}</span>`;
  errEl.classList.remove('hidden', 'error-fade-out');
  errEl.style.display = 'flex';

  // 4. Live Dismissal: typing or changing value immediately clears error state
  if (!input._hasLiveDismissal) {
    input._hasLiveDismissal = true;
    const dismissHandler = () => clearFieldError(input);
    input.addEventListener('input', dismissHandler);
    input.addEventListener('change', dismissHandler);
  }
}
window.showFieldError = showFieldError;

function clearFieldError(input) {
  if (!input) return;

  input.classList.remove(
    'border-rose-500/80',
    'focus:border-rose-500',
    'focus:ring-1',
    'focus:ring-rose-500/40',
    'field-error-border',
    'phone-input-error',
    'input-shake'
  );
  input.style.borderColor = '';
  input.style.boxShadow = '';

  const itiContainer = input.closest('.iti');
  let anchor = itiContainer || input;
  if (anchor.parentElement && anchor.parentElement.classList.contains('relative') && !itiContainer) {
    anchor = anchor.parentElement;
  }

  const errorKey = input.id || input.name || 'field';
  const errEl = (anchor.parentElement ? anchor.parentElement.querySelector(`[data-field-error-for="${errorKey}"]`) : null)
    || (anchor.nextElementSibling && anchor.nextElementSibling.classList.contains('custom-inline-error') ? anchor.nextElementSibling : null)
    || (anchor.parentElement ? anchor.parentElement.querySelector('.phone-error-msg') : null);

  if (errEl) {
    errEl.classList.add('error-fade-out');
    setTimeout(() => {
      if (errEl.classList.contains('error-fade-out')) {
        errEl.classList.add('hidden');
        errEl.style.display = 'none';
        errEl.remove();
      }
    }, 200);
  }
}
window.clearFieldError = clearFieldError;

function showPhoneError(input, message = "Please enter a complete phone number for the selected country") {
  showFieldError(input, message);
}
window.showPhoneError = showPhoneError;

function clearPhoneError(input) {
  clearFieldError(input);
}
window.clearPhoneError = clearPhoneError;

function setupPhoneKeystrokeLimit(input, iti) {
  if (!input || input._hasKeystrokeLimit) return;
  input._hasKeystrokeLimit = true;

  function applyLimit() {
    const countryData = iti && typeof iti.getSelectedCountryData === 'function' ? iti.getSelectedCountryData() : null;
    const iso2 = countryData?.iso2 || (iti?.getCountry ? iti.getCountry() : 'ae');
    const isUae = (iso2 === 'ae');
    const maxLen = isUae ? 9 : 15;

    input.setAttribute('maxlength', maxLen.toString());

    // Automatically strip any non-digit character (allow only numbers)
    const cleaned = input.value.replace(/\D/g, '');
    const truncated = cleaned.slice(0, maxLen);
    if (input.value !== truncated) {
      input.value = truncated;
    }

    clearFieldError(input);
  }

  // Set initial limit
  applyLimit();

  input.addEventListener('input', applyLimit);
  input.addEventListener('paste', () => {
    setTimeout(applyLimit, 10);
  });
  input.addEventListener('countrychange', () => {
    applyLimit();
    clearFieldError(input);
  });
}
window.setupPhoneKeystrokeLimit = setupPhoneKeystrokeLimit;

function validatePhoneField(input) {
  if (!input) return false;

  const rawVal = input.value || '';
  const digits = rawVal.replace(/\D/g, '');
  const iti = input._iti;
  const errorMsg = "Please enter a complete phone number for the selected country";

  if (!digits) {
    showFieldError(input, errorMsg);
    return false;
  }

  const countryData = iti && typeof iti.getSelectedCountryData === 'function' ? iti.getSelectedCountryData() : null;
  const iso2 = countryData?.iso2 || (iti?.getCountry ? iti.getCountry() : 'ae');

  // UAE rule: exactly 9 digits (e.g. 50 123 4567)
  if (iso2 === 'ae') {
    if (digits.length !== 9) {
      showFieldError(input, errorMsg);
      return false;
    }
  } else {
    if (digits.length < 6 || digits.length > 15) {
      showFieldError(input, errorMsg);
      return false;
    }
  }

  // Run iti.isValidNumber() if available
  if (iti && typeof iti.isValidNumber === 'function') {
    const isValid = iti.isValidNumber();
    if (!isValid) {
      showFieldError(input, errorMsg);
      return false;
    }
  }

  clearFieldError(input);
  return true;
}
window.validatePhoneField = validatePhoneField;

function checkFieldValidity(input, isValid, errorMessage, invalidList) {
  if (!input) return isValid;
  if (!isValid) {
    showFieldError(input, errorMessage);
    if (invalidList && Array.isArray(invalidList) && !invalidList.includes(input)) {
      invalidList.push(input);
    }
    return false;
  } else {
    clearFieldError(input);
    return true;
  }
}
window.checkFieldValidity = checkFieldValidity;

function focusFirstInvalidField(invalidList) {
  if (!invalidList || !invalidList.length) return;
  const first = invalidList[0];
  const target = first.closest('.iti') || first;
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => {
    try {
      first.focus({ preventScroll: true });
    } catch (err) {
      first.focus();
    }
  }, 250);
}
window.focusFirstInvalidField = focusFirstInvalidField;

function initUniversalFormValidation() {
  // Disable native browser validation tooltips across all forms
  document.querySelectorAll('form').forEach(form => {
    form.setAttribute('novalidate', 'true');
  });

  // Attach live dismissal for required fields on user typing or select change
  document.querySelectorAll('input, textarea, select').forEach(field => {
    if (!field._hasUniversalDismissal) {
      field._hasUniversalDismissal = true;
      const clearHandler = () => {
        if (field.value && field.value.trim().length > 0) {
          clearFieldError(field);
        }
      };
      field.addEventListener('input', clearHandler);
      field.addEventListener('change', clearHandler);
    }
  });
}
window.initUniversalFormValidation = initUniversalFormValidation;

// ============================================================================
// International Telephone Input (intl-tel-input) Setup & Initialization
// ============================================================================
function initIntlTelInputs() {
  const phoneSelectors = [
    '#contactPhone',
    '#bookingPhone',
    '#applicantPhone',
    '#partnerPhone',
    'input[type="tel"]'
  ];

  // Attach immediate keystroke limit even before/without intl-tel-input
  phoneSelectors.forEach(selector => {
    const inputs = document.querySelectorAll(selector);
    inputs.forEach(input => {
      if (!input._hasInitialKeystrokeLimit) {
        input._hasInitialKeystrokeLimit = true;
        input.setAttribute('maxlength', '15');
        input.addEventListener('input', () => {
          const iso = input._iti?.getSelectedCountryData?.()?.iso2 || 'ae';
          const max = iso === 'ae' ? 9 : 15;
          input.setAttribute('maxlength', max.toString());
          const digits = input.value.replace(/\D/g, '');
          if (input.value !== digits.slice(0, max)) {
            input.value = digits.slice(0, max);
          }
        });
      }
    });
  });

  if (typeof window.intlTelInput !== 'function') return;

  phoneSelectors.forEach(selector => {
    const inputs = document.querySelectorAll(selector);
    inputs.forEach(input => {
      // If already initialized, ensure keystroke limit is attached
      if (input._iti || input.dataset.itiInitialized === 'true') {
        if (input._iti) {
          setupPhoneKeystrokeLimit(input, input._iti);
        }
        return;
      }

      try {
        const iti = window.intlTelInput(input, {
          initialCountry: "ae",
          preferredCountries: ["ae", "lk", "in", "pk", "ph", "gb", "sa", "om"],
          separateDialCode: true,
          strictMode: true,
          autoPlaceholder: "aggressive",
          utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/js/utils.js"
        });
        input._iti = iti;
        input.dataset.itiInitialized = 'true';

        setupPhoneKeystrokeLimit(input, iti);
      } catch (err) {
        console.warn('intl-tel-input init error on element:', input, err);
      }
    });
  });
}
window.initIntlTelInputs = initIntlTelInputs;

/* ==========================================================================
   Destination Spotlight & Interactive Cards Controller (/destinations)
   ========================================================================== */
const SPOTLIGHT_DESTINATIONS_DATA = {
  srilanka: {
    countryName: 'Sri Lanka',
    defaultIndex: 0,
    places: [
      {
        id: 'nuwara-eliya',
        title: 'NUWARA ELIYA',
        tagline: 'LITTLE ENGLAND & CELESTIAL TEA HIGHLANDS',
        description: 'Nestled 1,868 meters above sea level amid emerald rolling peaks, Nuwara Eliya boasts crisp mountain breezes, Tudor-style colonial bungalows, verdant Ceylon tea plantations, and tranquil boat cruises on Lake Gregory.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        badge: 'Highlands',
        highlights: ['Pedro Tea Estate & Factory', 'Lake Gregory Boating', 'Hakgala Botanical Gardens', 'Horton Plains & World\'s End'],
        packageId: 'sl-ella-nuwaraeliya',
        ctaText: 'Explore Package →',
        whatsappMsg: 'Hi Star Plus Travels, I would like to inquire about Nuwara Eliya tea highlands and tour packages.'
      },
      {
        id: 'sigiriya',
        title: 'SIGIRIYA',
        tagline: 'ANCIENT LION ROCK FORTRESS & 5TH CENTURY CITADEL',
        description: 'Rise above the central plains to explore King Kashyapa\'s dramatic 200-meter monolith citadel, renowned for world-famous ancient fresco paintings, symmetrical water gardens, and breathtaking 360-degree panorama over pristine jungles.',
        image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
        badge: 'UNESCO Citadel',
        highlights: ['Lion\'s Paw Gateway', 'Ancient Frescoes & Mirror Wall', 'Royal Water Gardens', 'Pidurangala Sunset Viewpoint'],
        packageId: 'sl-sigiriya-cultural',
        ctaText: 'Explore Package →',
        whatsappMsg: 'Hi Star Plus Travels, I would like to inquire about Sigiriya Rock Fortress tour packages.'
      },
      {
        id: 'kandy',
        title: 'KANDY',
        tagline: 'SACRED TEMPLE OF THE TOOTH & ROYAL HIGHLAND CAPITAL',
        description: 'Surrounded by misty mountain ranges and tranquil Kandy Lake, this last royal capital of Sri Lanka houses the sacred relic of the tooth of the Buddha, ancient traditional Kandyan dance theatres, and lush royal botanical gardens.',
        image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=85',
        badge: 'Sacred City',
        highlights: ['Temple of the Sacred Tooth Relic', 'Peradeniya Royal Botanic Gardens', 'Kandy Lake Promenade', 'Traditional Cultural Dance'],
        packageId: 'sl-sigiriya-cultural',
        ctaText: 'Explore Package →',
        whatsappMsg: 'Hi Star Plus Travels, I would like to inquire about Kandy cultural tour packages.'
      },
      {
        id: 'ella',
        title: 'ELLA',
        tagline: 'NINE ARCH BRIDGE & VERDANT MOUNTAIN TRAILS',
        description: 'Famous worldwide for the breathtaking Nine Arch Demodara Bridge and world-class blue mountain train journey. Hike to Little Adam\'s Peak for sunrise, swim in cascading Ravana Falls, and unwind in vibrant bohemian hillside cafes.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        badge: 'Scenic Gap',
        highlights: ['Demodara Nine Arch Viaduct', 'Little Adam\'s Peak Trek', 'Scenic Blue Train Route', 'Ravana Falls & Cave'],
        packageId: 'sl-ella-nuwaraeliya',
        ctaText: 'Explore Package →',
        whatsappMsg: 'Hi Star Plus Travels, I would like to inquire about Ella & Nine Arch Bridge tour packages.'
      },
      {
        id: 'yala',
        title: 'YALA',
        tagline: 'UNTAMED WILDLIFE & BIG-GAME LEOPARD SAFARI',
        description: 'Venture deep into Ruhuna National Park, home to the world\'s highest wild leopard concentration. Board customized 4x4 open safari jeeps to spot majestic leopards on granite boulders, wild elephant herds, sloth bears, and saltwater crocodiles.',
        image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80',
        badge: 'Wild Safari',
        highlights: ['Leopard Tracking in Block 1', 'Wild Elephant Gatherings', 'Sloth Bear Habitat', 'Luxury Tented Bush Camps'],
        packageId: 'sl-wildlife-safari',
        ctaText: 'Explore Package →',
        whatsappMsg: 'Hi Star Plus Travels, I would like to inquire about Yala wildlife safari tour packages.'
      },
      {
        id: 'galle',
        title: 'GALLE FORT',
        tagline: 'UNESCO 17TH-CENTURY DUTCH RAMPARTS & OCEAN LIGHTHOUSE',
        description: 'A living colonial bastion jutting out into the Indian Ocean. Stroll along ancient cobblestone fortifications, explore boutique artisan galleries and gem jewellers, watch stunning ocean sunsets from the iconic white lighthouse, and unwind on nearby golden beaches.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
        badge: 'Ocean Bastion',
        highlights: ['Historic Dutch Fort Ramparts', 'White Lighthouse & Flag Rock', 'Boutique Artisan Quarters', 'Bentota & Mirissa Beaches'],
        packageId: 'sl-galle-south',
        ctaText: 'Explore Package →',
        whatsappMsg: 'Hi Star Plus Travels, I would like to inquire about Galle Fort & South Coast packages.'
      }
    ]
  },
  dubai: {
    countryName: 'Dubai & UAE',
    defaultIndex: 0,
    places: [
      {
        id: 'burj-khalifa',
        title: 'BURJ KHALIFA & DOWNTOWN',
        tagline: 'WORLD\'S TALLEST TOWER & MODERN ARCHITECTURAL MARVEL',
        description: 'Ascend to Level 124 & 125 for panoramic vistas across Dubai\'s futuristic skyline and the Arabian Gulf. Marvel at the choreographed Dubai Fountain water show, explore Dubai Mall, and stroll through Dubai Opera district.',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
        badge: 'Iconic Tower',
        highlights: ['At The Top Observation Deck', 'Dubai Fountain Boardwalk', 'Dubai Mall & Aquarium', 'Souk Al Bahar Dining'],
        packageId: 'dubai-family-escape',
        ctaText: 'Explore Package →',
        whatsappMsg: 'Hi Star Plus Travels, I would like to inquire about Dubai Downtown & Burj Khalifa tour packages.'
      },
      {
        id: 'palm-jumeirah',
        title: 'PALM JUMEIRAH & ATLANTIS',
        tagline: 'WORLD-FAMOUS ARCHIPELAGO & ULTRA-LUXURY LIVING',
        description: 'Marvel at Dubai\'s world-famous tree-shaped artificial island. Experience Aquaventure Waterpark, Atlantis The Royal, luxury yacht cruises along the Palm crescent, and sunset beach clubs overlooking the Arabian Gulf.',
        image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80',
        badge: 'Island Luxury',
        highlights: ['Atlantis Aquaventure & Lost Chambers', 'Private Marina Yacht Charter', 'The View at The Palm 52F', 'Pointe Boardwalk Dining'],
        packageId: 'dubai-abudhabi-grand',
        ctaText: 'Explore Package →',
        whatsappMsg: 'Hi Star Plus Travels, I would like to inquire about Palm Jumeirah & Marina packages.'
      },
      {
        id: 'desert-safari',
        title: 'ARABIAN DESERT DUNES',
        tagline: 'RED DUNE 4X4 ADVENTURE & STARLIT BEDOUIN BANQUET',
        description: 'Embark into sweeping Lahbab red dunes in high-powered 4x4 land cruisers for thrilling dune bashing, sandboarding, and sunset camel treks, followed by a VIP Arabian desert camp dinner with fire and Tanoura performances.',
        image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=1200&q=80',
        badge: 'Red Dunes',
        highlights: ['Thrilling 4x4 Red Dune Bashing', 'Sandboarding & Camel Rides', 'VIP Bedouin Majlis BBQ Dinner', 'Live Fire & Tanoura Shows'],
        packageId: 'dubai-family-escape',
        ctaText: 'Explore Package →',
        whatsappMsg: 'Hi Star Plus Travels, I would like to inquire about VIP Dubai Desert Safari tours.'
      },
      {
        id: 'abu-dhabi',
        title: 'ABU DHABI & GRAND MOSQUE',
        tagline: 'IMPERIAL CULTURAL HERITAGE & ARCHITECTURAL SPLENDOR',
        description: 'Journey to the UAE capital to behold the awe-inspiring Sheikh Zayed Grand Mosque with pure white marble domes and floral inlays, followed by world-class art at Louvre Abu Dhabi and the regal splendor of Qasr Al Watan Presidential Palace.',
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
        badge: 'Imperial Heritage',
        highlights: ['Sheikh Zayed Grand Mosque', 'Louvre Abu Dhabi Museum', 'Qasr Al Watan Palace', 'Corniche Waterfront Promenade'],
        packageId: 'dubai-abudhabi-grand',
        ctaText: 'Explore Package →',
        whatsappMsg: 'Hi Star Plus Travels, I would like to inquire about Abu Dhabi Grand Mosque tour packages.'
      }
    ]
  },
  georgia: {
    countryName: 'Georgia',
    defaultIndex: 0,
    places: [
      {
        id: 'tbilisi',
        title: 'OLD TBILISI',
        tagline: 'ANCIENT COBBLESTONE COURTYARDS & HISTORIC SULFUR BATHS',
        description: 'Wander through centuries of vibrant Caucasian culture in Old Tbilisi, with carved wooden balconies hanging above cobblestone lanes, iconic domed sulfur bathhouses of Abanotubani, and Narikala Fortress overlooking the Mtkvari river.',
        image: 'assets/packages/georgia-kazbegi.jpg',
        badge: 'Old Town',
        highlights: ['Narikala Fortress Cable Car', 'Abanotubani Sulfur Baths', 'Bridge of Peace', 'Shardeni Street Cafes'],
        packageId: 'georgia-kazbegi',
        ctaText: 'Explore Package →',
        whatsappMsg: 'Hi Star Plus Travels, I would like to inquire about Tbilisi city and Georgia holiday packages.'
      },
      {
        id: 'kazbegi',
        title: 'KAZBEGI & GERGETI TRINITY',
        tagline: 'SNOW-CROWNED MOUNT KAZBEK & 14TH-CENTURY SANCTUARY',
        description: 'Travel the legendary Georgian Military Highway through the Caucasus range to Stepantsminda. Stand at the breathtaking 14th-century Gergeti Trinity Church perched 2,170m high against the backdrop of Mount Kazbek\'s 5,047m snow peaks.',
        image: 'assets/packages/georgia-kazbegi.jpg',
        badge: 'High Caucasus',
        highlights: ['Gergeti Trinity Church 2,170m', 'Mount Kazbek 5,047m Glacier', 'Ananuri Fortress Complex', 'Zhinvali Emerald Reservoir'],
        packageId: 'georgia-kazbegi',
        ctaText: 'Explore Package →',
        whatsappMsg: 'Hi Star Plus Travels, I would like to inquire about Kazbegi & Gergeti Trinity packages.'
      },
      {
        id: 'kakheti',
        title: 'KAKHETI WINE VALLEY',
        tagline: 'CRADLE OF 8,000-YEAR-OLD VITICULTURE & ROYAL VINEYARDS',
        description: 'Explore the fertile Alazani Valley where clay amphorae (qvevri) wine-making has thrived uninterrupted for 8,000 years. Visit the romantic hilltop town of Signagi, ancient monastery cellars, and traditional supra feasts.',
        image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=85',
        badge: 'Wine Country',
        highlights: ['UNESCO Qvevri Wine Cellars', 'Signagi City of Love', 'Bodbe St. Nino Monastery', 'Traditional Georgian Supra Feast'],
        packageId: 'georgia-kazbegi',
        ctaText: 'Explore Package →',
        whatsappMsg: 'Hi Star Plus Travels, I would like to inquire about Kakheti wine valley tours in Georgia.'
      },
      {
        id: 'gudauri',
        title: 'GUDAURI ALPS',
        tagline: 'ALPINE VISTAS, SKI SLOPES & CAUCASUS FRIENDSHIP MONUMENT',
        description: 'High on the southern slopes of the Greater Caucasus, Gudauri offers exhilarating mountain paragliding, panoramic ski slopes, and the dramatic circular Russia-Georgia Friendship Monument overlooking the Devil\'s Valley abyss.',
        image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
        badge: 'Alpine Peak',
        highlights: ['Caucasus Friendship Monument', 'Panoramic Mountain Paragliding', 'Jvari Pass 2,379m Elevation', 'Snowsports & Alpine Trails'],
        packageId: 'georgia-kazbegi',
        ctaText: 'Explore Package →',
        whatsappMsg: 'Hi Star Plus Travels, I would like to inquire about Gudauri alpine ski & mountain tours.'
      }
    ]
  }
};

function selectSpotlightCard(countryKey, cardIndex) {
  const countryData = SPOTLIGHT_DESTINATIONS_DATA[countryKey];
  if (!countryData || !countryData.places || !countryData.places[cardIndex]) return;

  const place = countryData.places[cardIndex];
  const section = document.getElementById('spotlight-' + countryKey);
  if (!section) return;

  // 1. Update Backdrop with smooth cross-fade transition
  const bg = section.querySelector('.dest-spotlight-backdrop');
  if (bg && bg.getAttribute('src') !== place.image) {
    bg.classList.add('is-transitioning');
    setTimeout(() => {
      bg.src = place.image;
      bg.alt = place.title;
      setTimeout(() => {
        bg.classList.remove('is-transitioning');
      }, 60);
    }, 180);
  }

  // 2. Update Left Column details
  const titleEl = section.querySelector('[data-spotlight="title"]');
  const taglineEl = section.querySelector('[data-spotlight="tagline"]');
  const descEl = section.querySelector('[data-spotlight="desc"]');
  const pillsEl = section.querySelector('[data-spotlight="pills"]');
  const ctaBtn = section.querySelector('[data-spotlight="cta"]');
  const waBtn = section.querySelector('[data-spotlight="wa"]');

  if (titleEl) {
    titleEl.textContent = place.title;
  }
  if (taglineEl) {
    taglineEl.textContent = place.tagline;
  }
  if (descEl) {
    descEl.textContent = place.description;
  }
  if (pillsEl && place.highlights) {
    pillsEl.innerHTML = place.highlights.map(h => `
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-300 text-xs font-medium backdrop-blur-md">
        <i class="fa-solid fa-check text-amber-400 text-[10px]"></i>
        <span>${h}</span>
      </span>
    `).join('');
  }
  if (ctaBtn) {
    ctaBtn.setAttribute('data-package-id', place.packageId || '');
    ctaBtn.setAttribute('data-country', countryKey);
  }
  if (waBtn && place.whatsappMsg) {
    waBtn.href = `https://wa.me/971527582293?text=${encodeURIComponent(place.whatsappMsg)}`;
  }

  // 3. Update active card in the track
  const track = section.querySelector('.dest-spotlight-track');
  if (track) {
    const cards = track.querySelectorAll('.dest-spotlight-card');
    cards.forEach((card, idx) => {
      if (idx === cardIndex) {
        card.classList.add('active');
        card.setAttribute('aria-selected', 'true');
      } else {
        card.classList.remove('active');
        card.setAttribute('aria-selected', 'false');
      }
    });
  }
}

function handleSpotlightCtaAction(btn) {
  if (!btn) return;
  const countryKey = btn.getAttribute('data-country');
  const packageId = btn.getAttribute('data-package-id');

  if (typeof openCountryShowcase === 'function' && countryKey) {
    openCountryShowcase(countryKey);
    // If packageId specified, try to select that tour in the modal
    if (packageId && typeof selectShowcaseTourById === 'function') {
      setTimeout(() => {
        selectShowcaseTourById(packageId);
      }, 150);
    }
  } else if (typeof openBookingModal === 'function') {
    openBookingModal(packageId || countryKey);
  } else {
    window.location.href = 'packages.html';
  }
}

function scrollSpotlightTrack(countryKey, direction) {
  const section = document.getElementById('spotlight-' + countryKey);
  if (!section) return;
  const track = section.querySelector('.dest-spotlight-track');
  if (!track) return;
  const scrollAmount = direction === 'left' ? -230 : 230;
  track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

function initSpotlightShowcases() {
  ['srilanka', 'dubai', 'georgia'].forEach(countryKey => {
    const section = document.getElementById('spotlight-' + countryKey);
    if (section) {
      selectSpotlightCard(countryKey, 0);
    }
  });
}

window.selectSpotlightCard = selectSpotlightCard;
window.handleSpotlightCtaAction = handleSpotlightCtaAction;
window.scrollSpotlightTrack = scrollSpotlightTrack;
window.initSpotlightShowcases = initSpotlightShowcases;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initShowcaseAndSearch();
    initIntlTelInputs();
    initNewsletterForms();
    initUniversalFormValidation();
    initSpotlightShowcases();
  });
} else {
  initShowcaseAndSearch();
  initIntlTelInputs();
  initNewsletterForms();
  initUniversalFormValidation();
  initSpotlightShowcases();
}

window.addEventListener('load', () => {
  initIntlTelInputs();
  initNewsletterForms();
  initUniversalFormValidation();
  initSpotlightShowcases();
});



