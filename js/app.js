/**
 * Star Plus Travels - Interactive Application Logic & Video Hero Engine
 */

// Exchange Rates relative to AED (Base currency: AED)
const CURRENCIES = {
  AED: { symbol: 'AED ', rate: 1, name: 'UAE Dirham (AED)' },
  USD: { symbol: '$', rate: 0.272, name: 'US Dollar (USD)' },
  EUR: { symbol: '€', rate: 0.252, name: 'Euro (EUR)' },
  GBP: { symbol: '£', rate: 0.215, name: 'British Pound (GBP)' },
  LKR: { symbol: 'LKR ', rate: 82.5, name: 'Sri Lankan Rupee (LKR)' }
};

let currentCurrency = 'AED';

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

    // Hero Section
    heroBadge: "Star Plus Travel & Tourism LLC • Dubai & Sri Lanka",
    heroTitleFull: 'Your <span class="text-amber-400">Gateway</span> to the World, Crafted with <span class="text-amber-400">Luxury</span> & Ease.',
    heroTitleLead: "Your Gateway to the",
    heroTitleWorld: "World",
    heroTitleMiddle: "Crafted with",
    heroTitleLuxury: "Luxury & Ease",
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
    contactUaeAddress: "Al Maktoum Road, Deira, Dubai",
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
    footerCopyright: "&copy; 2026 Star Plus Travel &amp; Tourism LLC. All Rights Reserved.",
    footerAttribution: "Redesigned &amp; Developed by Lupo",

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

    // Hero Section
    heroBadge: "Star Plus Travel & Tourism LLC • ඩුබායි සහ ශ්‍රී ලංකාව",
    heroTitleFull: 'ඔබේ සිහින <span class="text-amber-400">ලෝක සංචාරය</span>, උසස්ම <span class="text-amber-400">සුවපහසුවෙන් සැබෑ කරගන්න</span>.',
    heroTitleLead: "ඔබේ සිහින",
    heroTitleWorld: "ලෝක සංචාරය",
    heroTitleMiddle: "උසස්ම",
    heroTitleLuxury: "සුවපහසුවෙන් සැබෑ කරගන්න",
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
    contactUaeAddress: "අල් මක්ටූම් පාර, දෙයිරා, ඩුබායි",
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
    footerCopyright: "&copy; 2026 Star Plus Travel &amp; Tourism LLC. සියලු හිමිකම් ඇවිරිණි.",
    footerAttribution: "Redesigned &amp; Developed by Lupo",

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

    // Dynamic strings
    startingFrom: "ආරම්භක මිල",
    perPerson: "පුද්ගලයෙකුට",
    installmentText: "හෝ Tabby මගින් මසකට 4x {amount}",
    itineraryBtn: "විස්තර",
    bookNowBtn: "වෙන්කරන්න"
  }
};

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
    destination: 'Dubai, UAE',
    flag: '<i class="fa-solid fa-city text-amber-400"></i>',
    duration: '5 Days / 4 Nights',
    rating: 4.9,
    reviews: 184,
    badge: 'Bestseller',
    badgeColor: 'from-amber-500 to-yellow-500',
    image: 'assets/packages/dubai-desert-safari.jpg',
    alt: 'Iconic sunset skyline of Dubai featuring the Burj Khalifa and illuminated city highways',
    priceAED: 2450,
    originalPriceAED: 3100,
    perks: ['5★ Luxury Hotel Stay', 'VIP Desert Safari & BBQ', 'Burj Khalifa Top Deck', 'Luxury Marina Yacht Cruise', 'Private Airport Transfers'],
    itinerary: [
      { day: 1, title: 'Arrival & Marina Dhow Cruise Dinner' },
      { day: 2, title: 'Modern Dubai City Tour & Burj Khalifa At The Top' },
      { day: 3, title: 'VIP Desert Safari with Dune Bashing & BBQ Feast' },
      { day: 4, title: 'Miracle Garden & Museum of the Future Tour' },
      { day: 5, title: 'Luxury Shopping Leisure & Airport Departure' }
    ]
  },
  {
    id: 'sri-lanka-wildlife',
    title: 'Scenic Sri Lanka: Tea Hills, Wildlife & Beaches',
    category: 'srilanka',
    destination: 'Colombo, Kandy & Bentota',
    flag: '<i class="fa-solid fa-gem text-amber-400"></i>',
    duration: '6 Days / 5 Nights',
    rating: 5.0,
    reviews: 142,
    badge: 'Trending',
    badgeColor: 'from-emerald-500 to-teal-500',
    image: 'assets/sri-lanka-destination.jpg',
    alt: 'Sri Lanka Ella Nine Arch Bridge and Tea Hills',
    priceAED: 1890,
    originalPriceAED: 2400,
    perks: ['Scenic Scenic Train to Ella', 'Sigiriya Rock Fortress Tour', 'Yala Safari Wildlife Encounter', 'Private English Chauffeur', 'Daily Gourmet Breakfast'],
    itinerary: [
      { day: 1, title: 'Arrival in Colombo & Transfer to Kandy' },
      { day: 2, title: 'Temple of the Tooth & Royal Botanical Gardens' },
      { day: 3, title: 'Scenic Train Ride to Nuwara Eliya & Tea Estates' },
      { day: 4, title: 'Ella Rock Trek & Yala National Park Safari' },
      { day: 5, title: 'Bentota Golden Beach Relaxation & Water Sports' },
      { day: 6, title: 'Colombo City Tour & Departure' }
    ]
  },
  {
    id: 'baku-azerbaijan',
    title: 'Baku & Caucasus Wonders of Azerbaijan',
    category: 'caucasus',
    destination: 'Baku & Gabala, Azerbaijan',
    flag: '<i class="fa-solid fa-mountain-sun text-amber-400"></i>',
    duration: '5 Days / 4 Nights',
    rating: 4.8,
    reviews: 96,
    badge: 'Popular',
    badgeColor: 'from-blue-600 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1785608149582-51b1a856da10?auto=format&fit=crop&w=800&q=80',
    alt: 'Baku Flame Towers and Caspian Sea Waterfront Skyline, Azerbaijan',
    priceAED: 2150,
    originalPriceAED: 2750,
    perks: ['Return Flights Included', '4★ Central Baku Hotel', 'Gabala Cable Car & Lake Tour', 'Gobustan Rock Art & Mud Volcanoes', 'English Speaking Guide'],
    itinerary: [
      { day: 1, title: 'Arrival in Baku & Boulevard Evening Walk' },
      { day: 2, title: 'Old City (Icherisheher) & Flame Towers Tour' },
      { day: 3, title: 'Full Day Gabala Mountains & Tufandag Resort' },
      { day: 4, title: 'Gobustan Mud Volcanoes & Fire Temple (Ateshgah)' },
      { day: 5, title: 'Heydar Aliyev Center & Airport Transfer' }
    ]
  },
  {
    id: 'georgia-kazbegi',
    title: 'Magical Georgia: Tbilisi, Kazbegi & Gudauri',
    category: 'caucasus',
    destination: 'Tbilisi & Caucasus, Georgia',
    flag: '<i class="fa-solid fa-snowflake text-amber-400"></i>',
    duration: '6 Days / 5 Nights',
    rating: 4.9,
    reviews: 118,
    badge: 'Winter Special',
    badgeColor: 'from-indigo-500 to-purple-500',
    image: 'https://images.unsplash.com/photo-1692262211862-26f4555ef0b7?auto=format&fit=crop&w=1200&q=85',
    alt: 'Gergeti Trinity Church and Mount Kazbek Caucasus Mountains, Georgia',
    priceAED: 2290,
    originalPriceAED: 2950,
    perks: ['Direct Flights Option', '4★ Boutique Hotel in Old Tbilisi', 'Kazbegi 4x4 Mountain Excursion', 'Traditional Georgian Feast & Wine', 'Roundtrip Transfers'],
    itinerary: [
      { day: 1, title: 'Welcome to Tbilisi & Narikala Fortress Cable Car' },
      { day: 2, title: 'Mtskheta Ancient Capital & Jvari Monastery' },
      { day: 3, title: 'Ananuri Fortress, Gudauri & Gergeti Trinity Church' },
      { day: 4, title: 'Kakheti Wine Region & Bodbe Monastery' },
      { day: 5, title: 'Tbilisi Sulphur Baths & Shopping Leisure' },
      { day: 6, title: 'Departure Flight Transfer' }
    ]
  },
  {
    id: 'maldives-all-inclusive',
    title: 'Maldives Overwater Villa Paradise Escape',
    category: 'tropical',
    destination: 'North Malé Atoll, Maldives',
    flag: '<i class="fa-solid fa-umbrella-beach text-amber-400"></i>',
    duration: '4 Days / 3 Nights',
    rating: 5.0,
    reviews: 210,
    badge: 'Luxury Romance',
    badgeColor: 'from-pink-500 to-rose-500',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    alt: 'Maldives Overwater Villas and Turquoise Lagoon',
    priceAED: 4650,
    originalPriceAED: 5900,
    perks: ['Overwater Pool Villa', 'All-Inclusive Dine & Drinks', 'Speedboat Airport Transfers', 'Sunset Dolphin Cruise', 'Complimentary Snorkeling Gear'],
    itinerary: [
      { day: 1, title: 'Speedboat Arrival & Overwater Villa Check-in' },
      { day: 2, title: 'Coral Reef Snorkeling & Sunset Dolphin Cruise' },
      { day: 3, title: 'Luxury Spa Treatment & Private Candlelight Beach Dinner' },
      { day: 4, title: 'Floating Lagoon Breakfast & Departure' }
    ]
  },
  {
    id: 'bali-luxury-nature',
    title: 'Bali Heavenly Getaway: Ubud & Seminyak',
    category: 'tropical',
    destination: 'Bali, Indonesia',
    flag: '<i class="fa-solid fa-leaf text-amber-400"></i>',
    duration: '7 Days / 6 Nights',
    rating: 4.9,
    reviews: 165,
    badge: 'Bestseller',
    badgeColor: 'from-emerald-600 to-lime-600',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    alt: 'Bali Temple and Tropical Landscape',
    priceAED: 2850,
    originalPriceAED: 3600,
    perks: ['Private Pool Villa in Ubud', 'Nusa Penida Island Tour', 'Floating Breakfast Experience', 'Mount Batur Sunrise Jeep Trek', 'Private Chauffeur Throughout'],
    itinerary: [
      { day: 1, title: 'Denpasar Arrival & Ubud Villa Check-in' },
      { day: 2, title: 'Tegalalang Rice Terraces & Jungle Swing' },
      { day: 3, title: 'Mount Batur Sunrise Adventure & Hot Springs' },
      { day: 4, title: 'Nusa Penida Kelingking Beach Day Excursion' },
      { day: 5, title: 'Seminyak Beach Club & Sunset Seafood at Jimbaran' },
      { day: 6, title: 'Uluwatu Cliff Temple & Kecak Fire Dance' },
      { day: 7, title: 'Spa & Departure Airport Transfer' }
    ]
  },
  {
    id: 'turkey-istanbul-cappadocia',
    title: 'Classic Turkey: Istanbul & Cappadocia Balloons',
    category: 'caucasus',
    destination: 'Istanbul & Cappadocia, Turkey',
    flag: '<i class="fa-solid fa-landmark-dome text-amber-400"></i>',
    duration: '6 Days / 5 Nights',
    rating: 4.9,
    reviews: 138,
    badge: 'Bucket List',
    badgeColor: 'from-purple-600 to-pink-600',
    image: 'assets/packages/turkey-cappadocia-balloons.jpg',
    alt: 'Cappadocia colorful hot air balloons rising over fairy chimneys at sunrise, Turkey',
    priceAED: 3350,
    originalPriceAED: 4200,
    perks: ['Domestic Flights (Istanbul-Cappadocia)', 'Authentic Cave Hotel Stay', 'Bosphorus Sunset Yacht Cruise', 'Hagia Sophia & Grand Bazaar Tour', 'Hot Air Balloon Booking Assistance'],
    itinerary: [
      { day: 1, title: 'Arrival in Istanbul & Bosphorus Yacht Sunset Cruise' },
      { day: 2, title: 'Hagia Sophia, Blue Mosque & Topkapi Palace' },
      { day: 3, title: 'Flight to Cappadocia & Cave Suite Check-in' },
      { day: 4, title: 'Sunrise Hot Air Balloon & Goreme Open-Air Museum' },
      { day: 5, title: 'Underground City & Pigeon Valley Exploration' },
      { day: 6, title: 'Return Flight to Istanbul & International Departure' }
    ]
  },
  {
    id: 'umrah-spiritual-package',
    title: 'Premium Umrah Spiritual Journey',
    category: 'spiritual',
    duration: '7 Days / 6 Nights',
    destination: 'Makkah & Madinah, KSA',
    flag: '<i class="fa-solid fa-mosque text-amber-400"></i>',
    rating: 5.0,
    reviews: 245,
    badge: 'Spiritual Peace',
    badgeColor: 'from-amber-600 to-yellow-600',
    image: 'assets/packages/umrah-grand-mosque.jpg',
    alt: 'Atmospheric evening view of the Kaaba and illuminated minarets at Masjid al-Haram with warm golden lighting',
    priceAED: 2990,
    originalPriceAED: 3800,
    perks: ['5★ Clock Tower Front Hotel', 'Direct Luxury High-Speed Train Haramain', 'Complete Umrah Visa Processing', 'Comprehensive Ziyarat Tours', '24/7 Dedicated Arabic/English Guide'],
    itinerary: [
      { day: 1, title: 'Arrival in Jeddah & VIP Transfer to Makkah' },
      { day: 2, title: 'Performance of Umrah with Experienced Muallim' },
      { day: 3, title: 'Makkah Historical Ziyarat (Jabal Al-Noor, Mina, Arafat)' },
      { day: 4, title: 'Haramain High-Speed Train to Madinah Munawwarah' },
      { day: 5, title: 'Masjid An-Nabawi & Rawdah Sharif Visits' },
      { day: 6, title: 'Madinah Ziyarat (Masjid Quba, Mount Uhud)' },
      { day: 7, title: 'Final Prayers & Departure Transfer to Airport' }
    ]
  },
  {
    id: 'dubai-corporate-mice',
    title: 'Executive Dubai MICE, Gala & Corporate Summit',
    category: 'corporate',
    tags: ['corporate', 'dubai', 'mice'],
    destination: 'Dubai & Abu Dhabi, UAE',
    flag: '<i class="fa-solid fa-briefcase text-amber-400"></i>',
    duration: '4 Days / 3 Nights',
    rating: 5.0,
    reviews: 88,
    badge: 'Corporate VIP',
    badgeColor: 'from-blue-600 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
    alt: 'Luxury corporate gala conference and executive summit in Dubai',
    priceAED: 3450,
    originalPriceAED: 4400,
    perks: ['5★ Luxury Business Hotel Stay', 'State-of-the-Art Conference Hall Setup', 'Private Executive Fleet Chauffeur', 'Exclusive Marina Yacht Gala Dinner', 'VIP Fast-Track Airport Protocols'],
    itinerary: [
      { day: 1, title: 'VIP Airport Arrival & Luxury Executive Check-in' },
      { day: 2, title: 'Corporate Keynote, Breakouts & Team Workshops' },
      { day: 3, title: 'Innovation Safari, Museum of the Future & Gala Dinner' },
      { day: 4, title: 'Executive Debrief & Airport Escort' }
    ]
  },
  {
    id: 'baku-corporate-retreat',
    title: 'Caucasus Executive Leadership & Team Incentive Retreat',
    category: 'corporate',
    tags: ['corporate', 'caucasus'],
    destination: 'Baku & Shahdag, Azerbaijan',
    flag: '<i class="fa-solid fa-building-user text-amber-400"></i>',
    duration: '5 Days / 4 Nights',
    rating: 4.9,
    reviews: 64,
    badge: 'Executive Retreat',
    badgeColor: 'from-amber-600 to-orange-600',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85',
    alt: 'Corporate team building and executive leadership retreat in Azerbaijan',
    priceAED: 2650,
    originalPriceAED: 3300,
    perks: ['Direct Return Airline Bookings', 'Flame Towers 5★ Luxury Suites', 'Alpine Team Building in Shahdag Resort', 'Private Caspian Waterfront Gala Dinner', 'Dedicated 24/7 Corporate Account Lead'],
    itinerary: [
      { day: 1, title: 'Arrival in Baku & Boulevard Executive Reception' },
      { day: 2, title: 'Leadership Strategy Sessions & Old City Walk' },
      { day: 3, title: 'Alpine Team Building & Mountain Activities in Shahdag' },
      { day: 4, title: 'Ateshgah Cultural Discovery & Formal Gala Banquet' },
      { day: 5, title: 'Executive Farewell & Airport Transfer' }
    ]
  },
  {
    id: 'uae-golden-visa-bundle',
    title: 'UAE 10-Year Golden Visa & Concierge Relocation Bundle',
    category: 'visa-bundle',
    tags: ['visa-bundle', 'dubai'],
    destination: 'Dubai, United Arab Emirates',
    flag: '<i class="fa-solid fa-passport text-amber-400"></i>',
    duration: 'Express 5-7 Days',
    rating: 5.0,
    reviews: 196,
    badge: '10-Year Residency',
    badgeColor: 'from-amber-500 to-yellow-500',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    alt: 'UAE Golden Visa processing and VIP government concierge in Dubai',
    priceAED: 4950,
    originalPriceAED: 6500,
    perks: ['Complete 10-Year Golden Visa Clearance', 'VIP Medical & Emirates ID Fast-Track', 'Corporate Bank Account Introductions', 'Luxury Chauffeur to Government Centers', '100% Legal & Regulatory Assurance'],
    itinerary: [
      { day: 1, title: 'Document Vetting & Initial Authority Nomination' },
      { day: 2, title: 'VIP Medical Fitness & Biometrics Fast-Track' },
      { day: 3, title: 'Emirates ID Issuance & Residency Stamping' },
      { day: 4, title: 'Corporate Banking & Personal Relocation Handover' }
    ]
  },
  {
    id: 'schengen-visa-travel-bundle',
    title: 'Schengen Europe Express Visa + Flight Booking Bundle',
    category: 'visa-bundle',
    tags: ['visa-bundle', 'caucasus'],
    destination: 'France, Switzerland & Italy',
    flag: '<i class="fa-solid fa-file-shield text-amber-400"></i>',
    duration: '10-15 Days Processing',
    rating: 4.9,
    reviews: 172,
    badge: 'Guaranteed Slot',
    badgeColor: 'from-emerald-600 to-teal-600',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=85',
    alt: 'Schengen visa and international flight bundle',
    priceAED: 1450,
    originalPriceAED: 1950,
    perks: ['Guaranteed Embassy Appointment Slot', 'Official Confirmed Flight & Hotel Vouchers', 'Custom Day-by-Day Travel Itinerary', 'Comprehensive Schengen Travel Insurance', 'Senior Immigration Specialist Review'],
    itinerary: [
      { day: 1, title: 'Profile Assessment & Required Checklist Formulation' },
      { day: 2, title: 'Embassy Slot Confirmation & Application Submission' },
      { day: 3, title: 'Flight & Hotel Reservation Certificate Issuance' },
      { day: 4, title: 'Biometrics Appointment Attendance Support' },
      { day: 5, title: 'Passport Retrieval with Valid Visa Stamping' }
    ]
  }
];

// Testimonials Data (Organic Google Reviews - 4.9 Stars Across 28 Reviews, Star Plus Travel & Tourism LLC, Twin Towers, Deira, Dubai)
const TESTIMONIALS = [
  {
    name: 'Muhammad Rizwan',
    role: 'Verified Google Reviewer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    trip: 'UAE 60-Day Tourist Visa',
    flag: '<i class="fa-brands fa-google text-[#4285F4]"></i>',
    stars: 5,
    date: '2 weeks ago',
    comment: 'Excellent and very trustworthy travel agency located in Twin Towers, Deira! Got my UAE 60-day tourist visa within 24 hours without any hassle. The staff explained the exact documentation required and kept me updated on WhatsApp. Highly recommend Star Plus Travel!'
  },
  {
    name: 'Dilini Senanayake',
    role: 'Verified Google Reviewer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    trip: 'Sri Lanka Holiday & Flights',
    flag: '<i class="fa-brands fa-google text-[#4285F4]"></i>',
    stars: 5,
    date: '3 weeks ago',
    comment: 'We booked our family holiday to Sri Lanka through Star Plus Travel & Tourism LLC. From direct flight ticketing to our private chauffeur van covering Kandy, Nuwara Eliya, and Bentota, everything was arranged seamlessly. Best agency in Deira for holiday packages and flights!'
  },
  {
    name: 'Faheem Akhtar',
    role: 'Verified Google Reviewer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    trip: 'Oman Bus Visa Change',
    flag: '<i class="fa-brands fa-google text-[#4285F4]"></i>',
    stars: 5,
    date: '1 month ago',
    comment: 'Did my Oman visa change by bus with Star Plus Travel. The bus was clean and on time from Deira, the hotel stay in Buraimi was safe and comfortable, and the staff at the border assisted us through every checkpoint. Received my new residence entry permit next morning smoothly.'
  },
  {
    name: 'Elena Rostova',
    role: 'Verified Google Reviewer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    trip: 'Schengen Visa Consultation',
    flag: '<i class="fa-brands fa-google text-[#4285F4]"></i>',
    stars: 5,
    date: '1 month ago',
    comment: 'Professional and fast service! I needed urgent assistance with my Schengen visa documentation and flight itinerary reservations. The consultants at the Twin Towers office scrutinized all my paperwork thoroughly. My visa was approved in just 9 days. Very thankful!'
  },
  {
    name: 'Abdul Rahman Al-Marzooqi',
    role: 'Verified Google Reviewer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    trip: 'Executive Umrah Package',
    flag: '<i class="fa-brands fa-google text-[#4285F4]"></i>',
    stars: 5,
    date: '2 months ago',
    comment: 'Booked an executive Umrah package for my parents from Dubai. Star Plus handled the Saudi visas, Haramain high-speed train tickets between Makkah and Madinah, and 5-star hotels right facing the Haram. My parents were truly impressed by the attentive support.'
  },
  {
    name: 'Kavinda Wickramasinghe',
    role: 'Verified Google Reviewer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    trip: 'Georgia Winter Escape',
    flag: '<i class="fa-brands fa-google text-[#4285F4]"></i>',
    stars: 5,
    date: '2 months ago',
    comment: 'Visited their Twin Towers office in Deira after a colleague\'s recommendation. Booked our winter holiday to Georgia (Tbilisi & Gudauri ski resort). The price was completely transparent with zero hidden charges. Our English-speaking driver in Georgia was super helpful and friendly!'
  }
];

// Visa Requirements Information
const VISA_DATA = {
  uae: {
    title: 'UAE Tourist & Freelance Visa',
    types: ['30 Days Single Entry', '60 Days Multiple Entry', '2-Year Freelance Residence'],
    time: '24 - 48 Hours Express',
    priceAED: 350,
    docs: ['Passport copy (minimum 6 months validity)', 'Passport size photo (white background)', 'Previous travel stamps or national ID']
  },
  schengen: {
    title: 'Schengen European Visa Assistance',
    types: ['Tourist Visa (C Type)', 'Business & Conference Visa'],
    time: '10 - 15 Working Days',
    priceAED: 650,
    docs: ['Original Passport', 'UAE Residence Visa (3+ months validity)', '3-6 Months Bank Statements with stamp', 'NOC Letter from Employer / Sponsor', 'Flight & Hotel Reservation (Provided by us)']
  },
  azerbaijan: {
    title: 'Azerbaijan Official ASAN e-Visa',
    types: ['30-Day Single Entry e-Visa'],
    time: '3 Hours (Urgent) / 3 Days (Standard)',
    priceAED: 180,
    docs: ['Clear color scan of passport bio page', 'Confirmed hotel booking & return ticket']
  },
  srilanka: {
    title: 'Sri Lanka ETA / Tourist Visa',
    types: ['30-Day Double Entry ETA', '180-Day Multiple Entry'],
    time: 'Instant / 12 Hours',
    priceAED: 220,
    docs: ['Valid Passport scan', 'Email address for digital ETA delivery']
  },
  oman_change: {
    title: 'Oman Visa Change by Luxury Coach',
    types: ['Same-Day Dubai ⇄ Oman Border Transit + New UAE Visa'],
    time: 'Same Day Run (Daily Departures from Deira)',
    priceAED: 850,
    docs: ['Current UAE Visa cancellation or tourist visa copy', 'Passport copy']
  }
};

// Global Helpers
function formatPrice(amountInAED) {
  const info = CURRENCIES[currentCurrency];
  const converted = Math.round(amountInAED * info.rate);
  return `${info.symbol}${converted.toLocaleString()}`;
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

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
  const grid = document.getElementById('packagesGrid');
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
        <p class="text-slate-400 text-sm max-w-md mx-auto mb-6">${currentLang === 'si' ? 'ඩුබායි, ශ්‍රී ලංකාව, ආයතනික හෝ වීසා පැකේජ වැනි වෙනත් විකල්ප සොයන්න.' : 'Try selecting All Packages or searching for corporate, holiday, or visa bundles.'}</p>
        <button onclick="resetFilters()" class="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer">
          ${currentLang === 'si' ? 'සියලු පැකේජ බලන්න' : 'View All Packages'}
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
      <div class="package-card glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col relative group border border-slate-200 dark:border-white/10 transition-all duration-300">
        <!-- Image & Badges -->
        <div class="img-container relative h-56 overflow-hidden bg-slate-900">
          <img src="${pkg.image}" alt="${pkg.alt}" class="w-full h-full object-cover" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          
          <!-- Category & Bestseller Badge -->
          <div class="absolute top-3 left-3 flex flex-wrap gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${pkg.badgeColor} shadow-md">
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
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <!-- Location -->
            <div class="flex items-center space-x-2 text-xs font-medium text-amber-600 dark:text-amber-400 mb-2">
              <span>${pkg.flag}</span>
              <span class="uppercase tracking-wider font-semibold">${destination}</span>
            </div>

            <!-- Title -->
            <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-snug mb-3">
              ${title}
            </h3>

            <!-- Perks Summary -->
            <ul class="space-y-1.5 mb-5">
              ${pkg.perks.slice(0, 3).map(perk => `
                <li class="flex items-center text-xs text-slate-600 dark:text-slate-300">
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
                  <span class="text-2xl font-black text-amber-600 dark:text-amber-400 font-heading">${formattedPrice}</span>
                  <span class="text-xs text-slate-400 dark:text-slate-500 line-through">${formattedOriginal}</span>
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
                <button type="button" onclick="openBookingModal('${pkg.id}')" class="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-slate-950 text-xs font-black transition-all text-center shadow-md shadow-amber-500/20 flex items-center justify-center space-x-1 cursor-pointer">
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

function filterCategory(cat) {
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

  renderPackages(filtered);
}

function resetFilters() {
  const searchInput = document.getElementById('heroDestinationInput');
  if (searchInput) searchInput.value = '';
  filterCategory('all');
}

// Hero Search Interactivity
function handleHeroSearch(event) {
  if (event) event.preventDefault();
  
  const dest = document.getElementById('heroDestinationInput')?.value.toLowerCase().trim() || '';
  const date = document.getElementById('heroDateInput')?.value || '';
  const travelers = document.getElementById('heroTravelersSelect')?.value || '2';

  let matches = PACKAGES;
  if (dest) {
    matches = PACKAGES.filter(p => 
      p.title.toLowerCase().includes(dest) ||
      p.destination.toLowerCase().includes(dest) ||
      p.category.toLowerCase().includes(dest)
    );
  }

  // Scroll smoothly to packages section
  const packagesSec = document.getElementById('packages');
  if (packagesSec) {
    packagesSec.scrollIntoView({ behavior: 'smooth' });
  }

  renderPackages(matches);
  showToast(`Found ${matches.length} matching packages for your search!`, 'success');
}

// Booking Modal Functionality
let selectedPackageForBooking = null;

function openBookingModal(pkgId) {
  const pkg = PACKAGES.find(p => p.id === pkgId);
  if (!pkg) return;

  selectedPackageForBooking = pkg;

  document.getElementById('modalPkgTitle').textContent = pkg.title;
  document.getElementById('modalPkgDestination').innerHTML = `${pkg.flag} <span class="font-semibold">${pkg.destination}</span> &bull; <span>${pkg.duration}</span>`;
  document.getElementById('modalPkgImage').src = pkg.image;
  document.getElementById('modalPkgImage').alt = pkg.alt;
  document.getElementById('modalPkgBasePrice').textContent = formatPrice(pkg.priceAED);
  
  // Set default form values
  document.getElementById('bookingTravelers').value = '2';
  document.getElementById('bookingChildren').value = '0';
  document.getElementById('bookingName').value = '';
  document.getElementById('bookingEmail').value = '';
  document.getElementById('bookingPhone').value = '';
  document.getElementById('bookingNotes').value = '';

  // Default date to next week
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  document.getElementById('bookingDate').value = nextWeek.toISOString().split('T')[0];

  calculateBookingTotal();

  const modal = document.getElementById('bookingModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  selectedPackageForBooking = null;
}

function calculateBookingTotal() {
  if (!selectedPackageForBooking) return;

  const adults = parseInt(document.getElementById('bookingTravelers')?.value || 1);
  const children = parseInt(document.getElementById('bookingChildren')?.value || 0);

  // Children charged at 65% of adult price
  const totalAED = (adults * selectedPackageForBooking.priceAED) + (children * selectedPackageForBooking.priceAED * 0.65);
  const totalFormatted = formatPrice(Math.round(totalAED));
  const installmentFormatted = formatPrice(Math.round(totalAED / 4));

  const totalElem = document.getElementById('modalTotalCalculation');
  const installmentElem = document.getElementById('modalTabbyInstallment');

  if (totalElem) totalElem.textContent = totalFormatted;
  if (installmentElem) installmentElem.textContent = `or 4x ${installmentFormatted}/month interest-free with Tabby / Tamara`;
}

function submitBookingForm(e) {
  e.preventDefault();
  const name = document.getElementById('bookingName').value;
  const email = document.getElementById('bookingEmail').value;
  const phone = document.getElementById('bookingPhone').value;

  if (!name || !email || !phone) {
    showToast('Please fill in all required contact details.', 'error');
    return;
  }

  closeBookingModal();
  showToast(`Booking inquiry sent for ${selectedPackageForBooking?.title || 'Tour'}! Our Dubai concierge will contact you within 2 hours.`, 'success');
}

// Itinerary Modal Functionality
function openItineraryModal(pkgId) {
  const pkg = PACKAGES.find(p => p.id === pkgId);
  if (!pkg) return;

  document.getElementById('itineraryModalTitle').textContent = pkg.title;
  document.getElementById('itineraryModalMeta').innerHTML = `${pkg.flag} <span class="font-semibold">${pkg.destination}</span> &bull; <span>${pkg.duration}</span> &bull; <span class="text-amber-400 font-bold"><i class="fa-solid fa-star text-xs"></i> ${pkg.rating}</span>`;
  document.getElementById('itineraryModalImage').src = pkg.image;

  // Itinerary timeline
  const timelineElem = document.getElementById('itineraryDaysContainer');
  timelineElem.innerHTML = pkg.itinerary.map(item => `
    <div class="relative pl-7 pb-5 last:pb-0 border-l border-amber-500/40 last:border-transparent">
      <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900 shadow-md"></div>
      <span class="inline-block px-2 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 mb-1">Day ${item.day}</span>
      <h4 class="text-sm font-bold text-slate-900 dark:text-white">${item.title}</h4>
    </div>
  `).join('');

  // Perks list
  const perksElem = document.getElementById('itineraryPerksList');
  perksElem.innerHTML = pkg.perks.map(perk => `
    <div class="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm">
      <i class="fa-solid fa-circle-check text-amber-500"></i>
      <span>${perk}</span>
    </div>
  `).join('');

  // Price & CTA
  const priceElem = document.getElementById('itineraryModalPrice');
  if (priceElem) priceElem.textContent = formatPrice(pkg.priceAED);

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
    const formattedPrice = formatPrice(pkg.priceAED);
    const currentLang = getPreferredLanguage();
    const rawWaMsg = currentLang === 'si'
      ? `හෙලෝ Star Plus Travels, මම "${pkg.title}" (${formattedPrice}) පැකේජයේ සම්පූර්ණ විස්තර සහ දින සැලසුම පිළිබඳව විමසීමට කැමතියි.`
      : `Hello Star Plus Travels, I am reviewing the itinerary for "${pkg.title}" (${formattedPrice}) and would like to inquire about booking availability and custom details.`;
    itineraryWaBtn.href = `https://wa.me/971527582293?text=${encodeURIComponent(rawWaMsg)}`;
  }

  const modal = document.getElementById('itineraryModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeItineraryModal() {
  const modal = document.getElementById('itineraryModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// Testimonials Slider Logic
let currentSlide = 0;
let slideInterval = null;

function renderTestimonial() {
  const container = document.getElementById('testimonialSlide');
  const dotsContainer = document.getElementById('testimonialDots');
  if (!container) return;

  const t = TESTIMONIALS[currentSlide];
  container.innerHTML = `
    <div class="testimonial-slide flex flex-col md:flex-row items-center gap-8 text-left">
      <!-- Traveler Avatar -->
      <div class="relative shrink-0">
        <div class="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-xl shadow-amber-500/10">
          <img src="${t.avatar}" alt="${t.name}" class="w-full h-full object-cover">
        </div>
        <span class="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-slate-900 border border-amber-500/50 flex items-center justify-center text-xs shadow-md">${t.flag}</span>
      </div>

      <!-- Quote Content -->
      <div class="flex-1">
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <div class="flex items-center space-x-1 text-amber-400 text-sm">
            ${Array(t.stars).fill('<i class="fa-solid fa-star"></i>').join('')}
          </div>
          <span class="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
            <i class="fa-brands fa-google text-[#4285F4]"></i> Google Verified Review • ${t.date}
          </span>
        </div>
        <p class="text-base md:text-lg text-slate-700 dark:text-slate-200 italic leading-relaxed mb-4">
          "${t.comment}"
        </p>
        <div>
          <div class="flex items-center gap-2">
            <h4 class="text-base font-bold text-slate-900 dark:text-white">${t.name}</h4>
            <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <i class="fa-solid fa-circle-check text-[9px]"></i> Verified
            </span>
          </div>
          <p class="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">${t.role} &bull; <span class="text-slate-500 dark:text-slate-400 font-normal">${t.trip}</span></p>
        </div>
      </div>
    </div>
  `;

  // Render dots
  if (dotsContainer) {
    dotsContainer.innerHTML = TESTIMONIALS.map((_, idx) => `
      <button onclick="goToSlide(${idx})" class="w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? 'bg-amber-500 w-8' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500'}" aria-label="Go to slide ${idx + 1}"></button>
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
  slideInterval = setInterval(nextSlide, 6000);
}

function resetSlideTimer() {
  clearInterval(slideInterval);
  startSlideTimer();
}

// Visa Checker Widget
function checkVisaRequirements() {
  const selectedType = document.getElementById('visaSelect')?.value;
  const resultCard = document.getElementById('visaResultCard');
  if (!resultCard || !selectedType) return;

  const data = VISA_DATA[selectedType];
  if (!data) return;

  resultCard.innerHTML = `
    <div class="glass-card p-6 rounded-2xl border border-amber-500/30 animate-fadeIn">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Fast-Track Assistance</span>
          <h4 class="text-lg font-bold text-slate-900 dark:text-white">${data.title}</h4>
        </div>
        <div class="text-right">
          <span class="text-xs text-slate-500 dark:text-slate-400 block font-medium">Starting Fee</span>
          <span class="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-heading">${formatPrice(data.priceAED)}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-5 text-xs text-slate-700 dark:text-slate-300">
        <div class="bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span class="text-slate-500 dark:text-slate-400 block font-semibold mb-1"><i class="fa-solid fa-bolt text-amber-500 mr-1.5"></i>Turnaround Time</span>
          <span class="text-slate-900 dark:text-white font-bold">${data.time}</span>
        </div>
        <div class="bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span class="text-slate-500 dark:text-slate-400 block font-semibold mb-1"><i class="fa-solid fa-passport text-amber-500 mr-1.5"></i>Available Options</span>
          <span class="text-slate-900 dark:text-white font-bold">${data.types.join(' • ')}</span>
        </div>
      </div>

      <div class="mb-5">
        <h5 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Key Required Documents</h5>
        <ul class="space-y-1.5">
          ${data.docs.map(doc => `
            <li class="flex items-center text-xs text-slate-600 dark:text-slate-300">
              <i class="fa-solid fa-check text-emerald-500 dark:text-emerald-400 text-[10px] mr-2"></i>
              <span>${doc}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <button onclick="openVisaInquiryModal('${data.title}')" class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20">
        Apply for ${data.title}
      </button>
    </div>
  `;
}

function openVisaInquiryModal(visaTitle) {
  const contactForm = document.getElementById('contact');
  if (contactForm) {
    contactForm.scrollIntoView({ behavior: 'smooth' });
    const interest = document.getElementById('contactInterest');
    if (interest) interest.value = 'visa';
    const notes = document.getElementById('contactMessage');
    if (notes) notes.value = `I would like to apply for: ${visaTitle}. Please advise on the exact documents and earliest processing appointment.`;
    showToast(`Pre-filled inquiry for ${visaTitle}. Please submit your details below!`, 'success');
  }
}

// Currency Switcher Logic
function changeCurrency(newCurr) {
  if (!CURRENCIES[newCurr]) return;
  currentCurrency = newCurr;

  // Update currency select dropdowns
  document.querySelectorAll('.currency-selector').forEach(sel => {
    sel.value = newCurr;
  });

  // Re-render packages with updated currency
  renderPackages(getActiveFilteredPackages());

  // Update Visa section if rendered
  checkVisaRequirements();

  showToast(`Currency updated to ${CURRENCIES[newCurr].name}`, 'success');
}

// Contact Form Submission
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contactName')?.value;
  const email = document.getElementById('contactEmail')?.value;
  const phone = document.getElementById('contactPhone')?.value;

  if (!name || !email || !phone) {
    showToast('Please complete the required contact fields.', 'error');
    return;
  }

  // Reset form
  e.target.reset();
  showToast('Inquiry received! A Star Plus Travels specialist will contact you with a customized quote shortly.', 'success');
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

// B2B Supplier & DMC Partnership Form Submission
function handlePartnerSubmit(e) {
  e.preventDefault();
  const company = document.getElementById('partnerCompany')?.value?.trim();
  const destination = document.getElementById('partnerDestination')?.value?.trim();
  const contact = document.getElementById('partnerContact')?.value?.trim();
  const email = document.getElementById('partnerEmail')?.value?.trim();
  const phone = document.getElementById('partnerPhone')?.value?.trim();
  const website = document.getElementById('partnerWebsite')?.value?.trim();
  const social = document.getElementById('partnerSocial')?.value?.trim() || 'Not Provided';
  const license = document.getElementById('partnerLicense')?.value?.trim();
  const city = document.getElementById('partnerCity')?.value?.trim();
  const proposal = document.getElementById('partnerProposal')?.value?.trim();
  
  // Selected Services
  const serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
  const services = Array.from(serviceCheckboxes).map(cb => cb.value);

  // Attached Trade License
  const licenseFileInput = document.getElementById('partnerLicenseFile');
  const licenseFile = licenseFileInput?.files?.[0];

  if (!company || !destination || !email || !contact || !phone || !website || !license || !city || !proposal) {
    showToast('Please complete all required company and credential fields.', 'error');
    return;
  }

  // File size validation defense check (strict 5MB limit)
  if (licenseFile && licenseFile.size > 5 * 1024 * 1024) {
    showToast('⚠️ Attached document exceeds 5MB! Please select a file under 5MB to ensure delivery.', 'error');
    return;
  }

  // Optional validation: If social link provided, basic URL sanity check
  if (social && social !== 'Not Provided') {
    const isUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i.test(social);
    if (!isUrl && !social.includes('.') && !social.includes('/')) {
      showToast('Please provide a valid URL or username for your social media profile.', 'error');
      return;
    }
  }

  const formattedDocSize = licenseFile 
    ? (licenseFile.size > 1024 * 1024 ? (licenseFile.size / (1024 * 1024)).toFixed(1) + ' MB' : Math.round(licenseFile.size / 1024) + ' KB')
    : 'None Attached';

  const licenseAttachmentInfo = licenseFile ? {
    fileName: licenseFile.name,
    fileSize: licenseFile.size,
    formattedSize: formattedDocSize,
    fileType: licenseFile.type || 'application/octet-stream',
    lastModified: licenseFile.lastModified
  } : null;

  // Construct structured intake payload for corporate email / CRM ingestion
  const dmcSubmissionPayload = {
    formType: 'DMC_GROUND_SERVICES_INTAKE',
    submittedAt: new Date().toISOString(),
    recipient: 'nfo@starplustraveluae.com',
    companyDetails: {
      companyName: company,
      primaryDestination: destination,
      contactPerson: contact,
      corporateEmail: email,
      phoneWhatsApp: phone,
      website: website,
      socialMediaLink: social,
      tradeLicenseNumber: license,
      tradeLicenseAttachment: licenseAttachmentInfo ? `${licenseAttachmentInfo.fileName} (${licenseAttachmentInfo.formattedSize})` : 'None Attached',
      headquarters: city
    },
    servicesOffered: services,
    proposalOverview: proposal,
    complianceConsent: true
  };

  // Persist locally for session continuity / fallback
  try {
    const existingIntakes = JSON.parse(localStorage.getItem('starplus_dmc_intakes') || '[]');
    existingIntakes.push(dmcSubmissionPayload);
    localStorage.setItem('starplus_dmc_intakes', JSON.stringify(existingIntakes.slice(-10)));
  } catch (err) {
    console.warn('Local intake caching unavailable:', err);
  }

  console.info('DMC Partnership Submission Payload Prepared:', dmcSubmissionPayload);

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Dispatching Application...';
  }

  setTimeout(() => {
    // Trigger direct email client pre-fill with cleanly formatted structured data
    const subject = encodeURIComponent(`B2B DMC Intake: ${company} (${destination})`);
    const body = encodeURIComponent(
      `===================================================\n` +
      `  NEW B2B DMC / GROUND SERVICES INTAKE APPLICATION  \n` +
      `===================================================\n\n` +
      `[1] COMPANY DETAILS\n` +
      `• Company Name: ${company}\n` +
      `• Destination / Country: ${destination}\n` +
      `• Headquarters Location: ${city}\n` +
      `• Tourism License / Reg No: ${license}\n\n` +
      `[2] CONTACT PERSON & ONLINE PRESENCE\n` +
      `• Key Contact Person: ${contact}\n` +
      `• Corporate Email: ${email}\n` +
      `• Phone / WhatsApp: ${phone}\n` +
      `• Official Website: ${website}\n` +
      `• Social Media Link / Profile: ${social}\n\n` +
      `[3] TRADE LICENSE ATTACHMENT (Max 5MB)\n` +
      (licenseFile 
        ? `• Attached File: ${licenseFile.name} (${formattedDocSize})\n  (Please ensure document is attached to this email message)\n` 
        : `• Attached File: [Please attach official Trade License/Certificate file here]\n`) +
      `\n[4] SERVICES & ASSETS OFFERED\n` +
      `• ${services.length > 0 ? services.join('\n• ') : 'Full Inbound Services'}\n\n` +
      `[5] PROPOSAL & TARIFF OVERVIEW\n` +
      `${proposal}\n\n` +
      `===================================================\n` +
      `I certify that our organization is a legally registered travel company and consent to Star Plus Travels verifying our credentials.\n\n` +
      `Submitted by:\n${contact} | ${company}\n`
    );

    e.target.reset();
    const fileInfo = document.getElementById('partnerLicenseFileInfo');
    if (fileInfo) {
      fileInfo.textContent = '';
      fileInfo.classList.add('hidden');
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }

    showToast('🤝 DMC Application dispatched! Opening email client addressed to nfo@starplustraveluae.com.', 'success');
    window.location.href = `mailto:nfo@starplustraveluae.com?subject=${subject}&body=${body}`;
  }, 1000);
}

// Helper: Open Mail Client with Full DMC Details for Direct Email Attachment
function sendDirectDmcEmail() {
  const company = document.getElementById('partnerCompany')?.value?.trim() || 'Partner Company';
  const destination = document.getElementById('partnerDestination')?.value?.trim() || 'Destination';
  const contact = document.getElementById('partnerContact')?.value?.trim() || 'Managing Director';
  const email = document.getElementById('partnerEmail')?.value?.trim() || '';
  const phone = document.getElementById('partnerPhone')?.value?.trim() || '';
  const website = document.getElementById('partnerWebsite')?.value?.trim() || '';
  const social = document.getElementById('partnerSocial')?.value?.trim() || 'Not Provided';
  const license = document.getElementById('partnerLicense')?.value?.trim() || 'Pending';
  const city = document.getElementById('partnerCity')?.value?.trim() || '';
  const proposal = document.getElementById('partnerProposal')?.value?.trim() || '';
  
  const licenseFileInput = document.getElementById('partnerLicenseFile');
  const licenseFile = licenseFileInput?.files?.[0];

  if (licenseFile && licenseFile.size > 5 * 1024 * 1024) {
    showToast('⚠️ Document exceeds 5MB! Please upload a file under 5MB to attach via email.', 'error');
    return;
  }

  const formattedDocSize = licenseFile 
    ? (licenseFile.size > 1024 * 1024 ? (licenseFile.size / (1024 * 1024)).toFixed(1) + ' MB' : Math.round(licenseFile.size / 1024) + ' KB')
    : 'None Attached';

  const subject = encodeURIComponent(`B2B DMC Intake: ${company} (${destination})`);
  const body = encodeURIComponent(
    `===================================================\n` +
    `  NEW B2B DMC / GROUND SERVICES INTAKE APPLICATION  \n` +
    `===================================================\n\n` +
    `[1] COMPANY DETAILS\n` +
    `• Company Name: ${company}\n` +
    `• Destination / Country: ${destination}\n` +
    `• Headquarters Location: ${city}\n` +
    `• Tourism License / Reg No: ${license}\n\n` +
    `[2] CONTACT PERSON & ONLINE PRESENCE\n` +
    `• Key Contact Person: ${contact}\n` +
    `• Corporate Email: ${email}\n` +
    `• Phone / WhatsApp: ${phone}\n` +
    `• Official Website: ${website}\n` +
    `• Social Media Link / Profile: ${social}\n\n` +
    `[3] TRADE LICENSE ATTACHMENT (Max 5MB)\n` +
    (licenseFile 
      ? `• Attached File: ${licenseFile.name} (${formattedDocSize})\n  (Please ensure document is attached to this email message)\n` 
      : `• Attached File: [Please attach official Trade License/Certificate file here]\n`) +
    `\n[4] PROPOSAL & TARIFF OVERVIEW\n` +
    `${proposal}\n\n` +
    `===================================================\n` +
    `Submitted by:\n${contact} | ${company}\n`
  );

  window.location.href = `mailto:nfo@starplustraveluae.com?subject=${subject}&body=${body}`;
}

// Newsletter Subscription
function handleNewsletter(e) {
  e.preventDefault();
  const emailInput = document.getElementById('newsletterEmail');
  if (!emailInput || !emailInput.value) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }
  emailInput.value = '';
  showToast('🎉 You have subscribed to VIP Star Plus travel deals & secret discounts!', 'success');
}

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

// Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  const isHidden = menu.classList.toggle('hidden');
  const btn = document.getElementById('mobileMenuBtn');
  if (btn) {
    const icon = btn.querySelector('i');
    if (icon) {
      if (isHidden) {
        icon.className = 'fa-solid fa-bars-staggered text-sm';
      } else {
        icon.className = 'fa-solid fa-xmark text-sm';
      }
    }
  }
  const header = document.getElementById('mainHeader') || document.querySelector('header');
  if (header) {
    if (!isHidden) {
      header.classList.add('menu-open');
    } else {
      header.classList.remove('menu-open');
    }
    updateBrandLogoTheme();
  }
}

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

  // Update preloader background if still present
  const preloader = document.getElementById('sitePreloader');
  if (preloader) {
    preloader.style.backgroundColor = isDark ? '#070e17' : '#ffffff';
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

    // Preloader handles its own background switch or uses darkSrc for dark background
    if (img.id === 'preloaderLogoImg' || img.classList.contains('preloader-brand-logo') || img.closest('#sitePreloader')) {
      img.src = isDark ? darkSrc : lightSrc;
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
    const stored = localStorage.getItem('starplus_lang');
    if (stored === 'si' || stored === 'en') {
      return stored;
    }
  } catch (e) {}
  return 'en';
}

function changeLanguage(lang, notify = true) {
  if (lang !== 'en' && lang !== 'si') lang = 'en';

  try {
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
  // When in English ('en'), show 'සිංහල' to invite user to switch to Sinhala.
  // When in Sinhala ('si'), show 'English' to invite user to switch to English.
  const targetLabel = lang === 'en' ? 'සිංහල' : 'English';
  
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

  document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    btn.setAttribute('title', lang === 'si' ? 'භාෂාව මාරු කරන්න (English / සිංහල)' : 'Switch Language (English / Sinhala)');
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
      if (translations[key].includes('<') && translations[key].includes('>')) {
        el.innerHTML = translations[key];
      } else {
        el.textContent = translations[key];
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

  // Re-render dynamic tour packages with localized titles & descriptions
  if (typeof renderPackages === 'function') {
    renderPackages(typeof getActiveFilteredPackages === 'function' ? getActiveFilteredPackages() : PACKAGES);
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

  if (notify) {
    showToast(lang === 'si' ? 'භාෂාව සිංහල ලෙස වෙනස් කරන ලදී' : 'Language switched to English', 'success');
  }
}

let _toggleLanguageBusy = false;
function toggleLanguage() {
  if (_toggleLanguageBusy) return;
  _toggleLanguageBusy = true;
  setTimeout(() => { _toggleLanguageBusy = false; }, 200);

  const activeDomLang = document.documentElement.lang;
  const currentLang = (activeDomLang === 'si' || getPreferredLanguage() === 'si') ? 'si' : 'en';
  const nextLang = currentLang === 'en' ? 'si' : 'en';
  changeLanguage(nextLang, true);
}

// Attach globally for inline HTML handlers
window.getPreferredLanguage = getPreferredLanguage;
window.changeLanguage = changeLanguage;
window.toggleLanguage = toggleLanguage;

// Setup Event Listeners on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize language preference (syncs button label and DOM text)
  changeLanguage(getPreferredLanguage(), false);

  // Attach direct click listener to language toggle buttons to guarantee responsive triggers
  document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!_toggleLanguageBusy) {
        toggleLanguage();
      }
    });
  });

  // 2. Initialize theme strictly from system preference or explicit manual mode
  applyTheme(getThemeMode(), false);

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

  renderPackages(PACKAGES);
  renderTestimonial();
  startSlideTimer();
  checkVisaRequirements();

  // Sticky header scroll elevation listener
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

  // Mobile menu button listener
  document.getElementById('mobileMenuBtn')?.addEventListener('click', toggleMobileMenu);

  // Close modals on escape key & navigate showcase with arrow keys
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBookingModal();
      closeItineraryModal();
      closeCountryPackagesModal();
      closeCountryShowcase();
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

  // Attach search listeners
  document.getElementById('heroSearchForm')?.addEventListener('submit', handleHeroSearch);

  // Initialize Dynamic Hero Slideshow if present
  initHeroSlideshow();

  // Initialize Navigation Dropdown interactions
  initNavDropdowns();

  // Initialize Desktop Sliding Glass Pill Navigation Indicator
  initNavPillIndicator();

  // Initialize Animated Statistics Number Counters
  initStatsCounters();

  // Initialize Roxaval-style Interactive Destinations Showcase Slider
  initDestinationSlider();

  // Smooth scroll to top when clicking Home link or brand logo on the homepage
  document.querySelectorAll('a[href="/"], a[href="/#hero"], a[href="#hero"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '';
      if (isHomePage) {
        // If already on homepage, smoothly scroll to top/hero section
        e.preventDefault();
        const heroSection = document.getElementById('hero') || document.body;
        if (window.scrollY > 0) {
          heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', '/');
        }
        // If mobile drawer open, close it
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          toggleMobileMenu();
        }
      }
    });
  });
});

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
  const preloader = document.getElementById('sitePreloader');
  if (!preloader) return;

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
    let year = new Date().getFullYear();
    try {
      const p = new URLSearchParams(window.location.search);
      const dp = p.get('date');
      if (dp) {
        const parsed = new Date(dp);
        if (!isNaN(parsed.getTime())) year = parsed.getFullYear();
      }
    } catch (e) {}
    renderNewYearCard(preloader, year);
    cleanupConfetti = initConfettiCanvas(preloader);
  }

  function dismissPreloader() {
    if (!preloader || preloader.classList.contains('fade-out')) return;

    const start = window.__preloaderStartTime || Date.now();
    const elapsed = Date.now() - start;
    // On New Year morning, give visitors ~2600ms to enjoy the celebration, otherwise standard luxury 1200ms
    const minWait = isNyActive ? 2600 : 1200;
    const remaining = Math.max(0, minWait - elapsed);

    setTimeout(() => {
      preloader.classList.add('fade-out');
      if (cleanupConfetti) {
        cleanupConfetti();
        cleanupConfetti = null;
      }
      setTimeout(() => {
        if (preloader && preloader.parentNode) {
          preloader.style.display = 'none';
        }
      }, 650);
    }, remaining);
  }

  if (document.readyState === 'complete') {
    dismissPreloader();
  } else {
    window.addEventListener('load', dismissPreloader);
    setTimeout(dismissPreloader, isNyActive ? 3600 : 2500);
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
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1588258524675-c6353d9e8790?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
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
        image: 'assets/sri-lanka-destination.jpg',
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
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1785608149582-51b1a856da10?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1692262211862-26f4555ef0b7?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80',
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

function openCountryPackages(countryKey) {
  const data = DESTINATION_COUNTRY_PACKAGES[countryKey];
  if (!data) return;

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
    seasonElem.innerHTML = `<i class="fa-solid fa-calendar text-amber-400/80 mr-1.5"></i>Best Season: ${data.season}`;
  }
  if (iconElem) {
    iconElem.className = `fa-solid ${data.icon || 'fa-earth-asia'}`;
  }
  if (customBtn) {
    customBtn.href = `https://wa.me/971527582293?text=${encodeURIComponent(`Hi Star Plus, I would like to design a customized holiday itinerary for ${data.country}. Please connect me with a specialist.`)}`;
  }

  bodyElem.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${data.packages.map(pkg => {
        const formattedPrice = typeof formatPrice === 'function' ? formatPrice(pkg.priceAED) : `AED ${pkg.priceAED.toLocaleString()}`;
        const installmentAmount = Math.round(pkg.priceAED / 4);
        const formattedInstallment = typeof formatPrice === 'function' ? formatPrice(installmentAmount) : `AED ${installmentAmount.toLocaleString()}`;
        
        return `
          <div class="regional-tour-card glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/40 bg-slate-900/80 flex flex-col justify-between shadow-xl">
            <div>
              <div class="relative h-48 overflow-hidden group">
                <img src="${pkg.image}" alt="${pkg.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
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
                    <i class="fa-solid fa-star text-[10px]"></i> Tour Highlights & Inclusions
                  </div>
                  <ul class="text-[11px] text-slate-300 space-y-1">
                    ${pkg.highlights.map(h => `<li class="flex items-start space-x-1.5"><i class="fa-solid fa-check text-amber-400 mt-0.5 text-[10px] flex-shrink-0"></i><span>${h}</span></li>`).join('')}
                  </ul>
                </div>

                ${pkg.stay ? `
                <div class="flex items-center space-x-2 text-[11px] text-slate-400 pt-1">
                  <i class="fa-solid fa-hotel text-amber-400/80"></i>
                  <span><strong class="text-slate-300">Stay:</strong> ${pkg.stay}</span>
                </div>
                ` : ''}
              </div>
            </div>

            <div class="p-4 sm:p-5 pt-0 border-t border-slate-800/80 mt-2">
              <div class="flex items-baseline justify-between pt-3 pb-3">
                <div>
                  <span class="text-[10px] text-slate-400 block uppercase tracking-wider">Starting from</span>
                  <span class="text-lg sm:text-xl font-black text-amber-400 font-heading">${formattedPrice}</span>
                  <span class="text-[10px] text-slate-400">/ person</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-emerald-400 font-semibold block">Tabby 4x ${formattedInstallment}/mo</span>
                  <span class="text-[9px] text-slate-500">Taxes & Transfers Included</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <a href="https://wa.me/971527582293?text=${encodeURIComponent(pkg.whatsappMsg)}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/20">
                  <i class="fa-brands fa-whatsapp text-sm"></i>
                  <span>Inquire Package</span>
                </a>
                <a href="packages.html" class="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center justify-center" title="Full Itinerary">
                  <span>Itinerary</span>
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
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1920&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
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
    image: 'assets/sri-lanka-destination.jpg',
    thumbnail: 'assets/sri-lanka-destination.jpg',
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
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1920&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
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

  // Render Horizontal Cards
  track.innerHTML = POPULAR_DESTINATIONS_SLIDES.map((slide, idx) => {
    const formattedPrice = typeof formatPrice === 'function' ? formatPrice(slide.priceAED) : `AED ${slide.priceAED.toLocaleString()}`;
    return `
      <div class="dest-preview-card ${idx === 0 ? 'active' : ''}" 
           data-slide-index="${idx}" 
           onclick="goToDestinationSlide(${idx})"
           role="button"
           tabindex="0"
           aria-label="Select destination ${slide.title}">
        <img src="${slide.thumbnail}" alt="${slide.title}" class="w-full h-full object-cover transition-transform duration-700 pointer-events-none" loading="lazy">
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
            <span class="text-amber-400 font-bold">${formattedPrice}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Render Indicator Dots
  const dotsContainer = document.getElementById('sliderDotsContainer');
  if (dotsContainer) {
    dotsContainer.innerHTML = POPULAR_DESTINATIONS_SLIDES.map((_, idx) => `
      <span class="dest-dot ${idx === 0 ? 'active' : ''}" onclick="goToDestinationSlide(${idx})" title="Slide ${idx + 1}"></span>
    `).join('');
  }

  // Set Total Count
  const totalElem = document.getElementById('sliderTotalCount');
  if (totalElem) {
    totalElem.textContent = String(POPULAR_DESTINATIONS_SLIDES.length).padStart(2, '0');
  }

  // Display initial active slide content
  updateActiveSlideUI(0, false);
}

function updateActiveSlideUI(index, animate = true) {
  const slide = POPULAR_DESTINATIONS_SLIDES[index];
  if (!slide) return;

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
        id: 'sl-galle-south',
        title: 'Galle & Down South',
        subtitle: 'GOLDEN COASTLINES & COLONIAL RAMPARTS',
        category: 'Beach & Coastal',
        categoryIcon: 'fa-umbrella-beach',
        rating: '4.9',
        reviews: '315+ reviews',
        duration: '4 Days / 3 Nights',
        priceAED: 1890,
        priceLKR: 'LKR 165,000',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        description: 'Unwind along Sri Lankaâ€™s sun-drenched southern coastline. Stroll the 17th-century ramparts and cobblestone paths of UNESCO World Heritage Galle Dutch Fort, watch stilt fishermen at Koggala, catch premier surf breaks at Weligama and Hiriketiya, and cruise through mangrove tunnels on the Madu River boat safari.',
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
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Galle & Down South'
      },
      {
        id: 'sl-sigiriya-cultural',
        title: 'Sigiriya & Cultural Triangle',
        subtitle: 'ANCIENT KINGDOMS & UNESCO CITADELS',
        category: 'Cultural',
        categoryIcon: 'fa-landmark',
        rating: '5.0',
        reviews: '340+ reviews',
        duration: '5 Days / 4 Nights',
        priceAED: 2250,
        priceLKR: 'LKR 195,000',
        image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1920&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
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
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Sigiriya & Cultural Triangle'
      },
      {
        id: 'sl-ella-nuwaraeliya',
        title: 'Ella & Nuwara Eliya',
        subtitle: 'MISTY HIGHLANDS & ALPINE TEA VALLEYS',
        category: 'Hill Country',
        categoryIcon: 'fa-mountain',
        rating: '5.0',
        reviews: '420+ reviews',
        duration: '5 Days / 4 Nights',
        priceAED: 2050,
        priceLKR: 'LKR 180,000',
        image: 'assets/sri-lanka-destination.jpg',
        thumbnail: 'assets/sri-lanka-destination.jpg',
        description: 'Ride the legendary blue train as it weaves across misty valleys and the architectural marvel of the Demodara Nine Arches Bridge. Wander through the crisp, emerald Ceylon tea plantations of Nuwara Eliya, stand above the clouds at Worldâ€™s End in Horton Plains, and hike to cascading waterfalls.',
        checklist: [
          'World-Famous Scenic Hill Country Blue Train Journey',
          'Demodara Nine Arches Bridge Photography Stop',
          'Ravana Falls & Little Adamâ€™s Peak Panoramic Hike',
          'Horton Plains National Park & Worldâ€™s End Precipice',
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
            title: 'Horton Plains & 880m Worldâ€™s End Cliff Trek',
            desc: 'Early morning expedition to Horton Plains National Park. Trek through cloud forests to the breathtaking 880m drop at Worldâ€™s End and admire Bakerâ€™s Falls. Afternoon visit to a working British-era tea factory with tea master tasting.'
          },
          {
            day: 3,
            title: 'Scenic Blue Train Ride to Ella & Nine Arches Bridge',
            desc: 'Board the iconic blue train at Nanu Oya for one of the worldâ€™s most scenic rail journeys, winding through misty mountain passes. Arrive in bohemian Ella; walk along the tracks to the majestic 1921 Demodara Nine Arches Bridge as trains pass through.'
          },
          {
            day: 4,
            title: 'Hike Little Adamâ€™s Peak & Ravana Waterfall Cascade',
            desc: 'Embark on an easy morning hike up Little Adamâ€™s Peak for 360-degree vistas across Ella Gap. Visit the thundering Ravana Falls and unwind at one of Ellaâ€™s trendy clifftop cafes.'
          },
          {
            day: 5,
            title: 'Scenic Southern Descent & Airport Return',
            desc: 'Descend through rubber and coconut plantations towards the coast, taking the highway back to Colombo International Airport for your return flight.'
          }
        ],
        finePrint: [
          'Train tickets are subject to government railway reservation windows; guaranteed seating prioritized.',
          'Light jackets/warm clothing recommended for Nuwara Eliya evenings (12Â°C - 16Â°C).',
          'Horton Plains trek is approximately 9 km loop; suitable for active travelers.',
          '0% Tabby installment financing options available.'
        ],
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Ella & Nuwara Eliya'
      },
      {
        id: 'sl-wildlife-safari',
        title: 'Wildlife & Rainforest Safari',
        subtitle: 'LEOPARD SANCTUARIES & JUNGLE EXPEDITIONS',
        category: 'Wildlife',
        categoryIcon: 'fa-paw',
        rating: '4.9',
        reviews: '280+ reviews',
        duration: '5 Days / 4 Nights',
        priceAED: 2150,
        priceLKR: 'LKR 190,000',
        image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1920&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
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
            desc: 'Check in to your luxury safari tented camp near Yala. Board your custom 4x4 open safari jeep for an intensive game drive in Yala Block 1, home to the worldâ€™s densest wild leopard population, sloth bears, and crocodiles.'
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
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Wildlife & Rainforest Safari'
      },
      {
        id: 'sl-jaffna-north',
        title: 'Jaffna & Untouched North',
        subtitle: 'VIBRANT TAMIL HERITAGE & PALK STRAIT ISLANDS',
        category: 'Northern Heritage',
        categoryIcon: 'fa-place-of-worship',
        rating: '4.8',
        reviews: '190+ reviews',
        duration: '4 Days / 3 Nights',
        priceAED: 1950,
        priceLKR: 'LKR 170,000',
        image: 'https://images.unsplash.com/photo-1588258524675-c6353d9e8790?auto=format&fit=crop&w=1920&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1588258524675-c6353d9e8790?auto=format&fit=crop&w=800&q=80',
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
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Jaffna & Untouched North'
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
        title: 'Dubai 4D / 3N Family Escape',
        subtitle: 'GLAMOUR, ICONIC LANDMARKS & LUXURY DESERT',
        category: 'Family Holiday',
        categoryIcon: 'fa-star',
        rating: '5.0',
        reviews: '510+ reviews',
        duration: '4 Days / 3 Nights',
        priceAED: 1850,
        priceLKR: 'LKR 380,000 / Adult (Child LKR 320,000)',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
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
          'Rates are based on twin/double sharing per person; special child rates applicable (LKR 320,000).',
          'Standard hotel check-in at 14:00 hrs & check-out at 12:00 hrs.',
          'Tourism Dirham fee of AED 15 per room per night payable directly to the hotel upon check-in.',
          'UAE 30-Day or 60-Day tourist visa assistance provided (approval in 24-48 hours).',
          '0% interest installment financing available through Tabby (4 convenient monthly payments).'
        ],
        whatsappMsg: 'Hello Star Plus Travels, I\'m interested in booking the Dubai 4D / 3N Family Escape'
      },
      {
        id: 'dubai-abudhabi-grand',
        title: 'Dubai & Abu Dhabi Grand Tour',
        subtitle: 'EMIRATES TWIN CITY & CULTURAL MARVEL',
        category: 'Luxury City',
        categoryIcon: 'fa-building-columns',
        rating: '5.0',
        reviews: '390+ reviews',
        duration: '5 Days / 4 Nights',
        priceAED: 2750,
        priceLKR: 'LKR 560,000',
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1920&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
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
        title: 'Overwater Villa Luxury Escape',
        subtitle: 'TURQUOISE LAGOONS & PRIVATE POOLS',
        category: 'Honeymoon',
        categoryIcon: 'fa-heart',
        rating: '5.0',
        reviews: '230+ reviews',
        duration: '4 Days / 3 Nights',
        priceAED: 4499,
        priceLKR: 'LKR 890,000',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1920&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1785608149582-51b1a856da10?auto=format&fit=crop&w=1920&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1785608149582-51b1a856da10?auto=format&fit=crop&w=800&q=80',
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
        title: 'Majestic Georgia & Kazbegi Alpine Tour',
        subtitle: 'OLD TBILISI & CAUCASIAN SNOW CAPS',
        category: 'Mountains',
        categoryIcon: 'fa-mountain',
        rating: '5.0',
        reviews: '260+ reviews',
        duration: '5 Days / 4 Nights',
        priceAED: 1890,
        priceLKR: 'LKR 375,000',
        image: 'https://images.unsplash.com/photo-1692262211862-26f4555ef0b7?auto=format&fit=crop&w=1920&q=85',
        thumbnail: 'https://images.unsplash.com/photo-1692262211862-26f4555ef0b7?auto=format&fit=crop&w=800&q=80',
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

function openCountryShowcase(countryKey) {
  const data = COUNTRY_SHOWCASE_DATA[countryKey];
  if (!data || !data.tours || data.tours.length === 0) return;

  currentShowcaseCountryKey = countryKey;
  currentShowcaseTourIndex = 0;

  const modal = document.getElementById('countryShowcaseModal');
  const headerTitle = document.getElementById('countryShowcaseHeaderTitle');
  const headerBadge = document.getElementById('countryShowcaseHeaderBadge');
  const headerIcon = document.getElementById('countryShowcaseIcon');
  const categoryTag = document.getElementById('showcaseCategoryTag');
  const cardsTrack = document.getElementById('countryShowcaseCardsTrack');
  const dotsContainer = document.getElementById('showcaseDotsContainer');
  const totalCountElem = document.getElementById('showcaseTotalCount');

  if (!modal || !cardsTrack) return;

  if (headerTitle) headerTitle.textContent = data.country;
  if (headerBadge) headerBadge.textContent = data.badge;
  if (headerIcon) headerIcon.className = `fa-solid ${data.icon || 'fa-gem'}`;
  if (categoryTag) categoryTag.textContent = data.categoryTag || 'POPULAR DESTINATIONS';

  // Render Horizontal Floating Cards (Compact ~205px x 275px)
  cardsTrack.innerHTML = data.tours.map((tour, idx) => {
    const formattedAED = typeof formatPrice === 'function' ? formatPrice(tour.priceAED) : `AED ${tour.priceAED.toLocaleString()}`;
    return `
      <div class="showcase-preview-card ${idx === 0 ? 'active' : ''}" 
           data-tour-index="${idx}" 
           onclick="selectShowcaseTour(${idx})"
           role="button"
           tabindex="0"
           aria-label="Select circuit ${tour.title}">
        <img src="${tour.thumbnail}" alt="${tour.title}" class="w-full h-full object-cover transition-transform duration-700 pointer-events-none" loading="lazy">
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
          <div class="showcase-card-meta flex items-center justify-between text-slate-300 mt-1 font-medium pt-1.5 border-t border-white/15">
            <span class="flex items-center gap-1"><i class="fa-regular fa-clock text-amber-400 text-[9px]"></i>${tour.duration}</span>
            <span class="showcase-card-price text-amber-400 font-mono">${formattedAED}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

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

  // Show modal
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function updateShowcaseTourUI(index, animate = true) {
  const data = COUNTRY_SHOWCASE_DATA[currentShowcaseCountryKey];
  if (!data || !data.tours || !data.tours[index]) return;

  const tour = data.tours[index];
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
    priceElem.textContent = formattedAED;
  }
  if (altPriceElem) {
    altPriceElem.textContent = tour.priceLKR ? `/ person (${tour.priceLKR})` : '/ person';
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
  const modal = document.getElementById('countryShowcaseModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// "VIEW PACKAGE DETAILS" Handler -> Opens comprehensive itinerary modal
function handleShowcaseDetailsAction() {
  const data = COUNTRY_SHOWCASE_DATA[currentShowcaseCountryKey];
  if (!data || !data.tours) return;
  const currentTour = data.tours[currentShowcaseTourIndex];
  if (!currentTour) return;
  openShowcaseItinerary(currentTour);
}

// LEVEL 3: Comprehensive Package Itinerary & Inclusions Modal Logic
function openShowcaseItinerary(tour) {
  if (!tour) return;

  const modal = document.getElementById('showcaseItineraryModal');
  if (!modal) return;

  const imgElem = document.getElementById('showcaseItineraryImg');
  const badgeElem = document.getElementById('showcaseItineraryBadge');
  const durationElem = document.getElementById('showcaseItineraryDuration');
  const ratingElem = document.getElementById('showcaseItineraryRating');
  const titleElem = document.getElementById('showcaseItineraryTitle');
  const subtitleElem = document.getElementById('showcaseItinerarySubtitle');
  const descElem = document.getElementById('showcaseItineraryDesc');
  const inclusionsElem = document.getElementById('showcaseItineraryInclusions');
  const daysElem = document.getElementById('showcaseItineraryDays');
  const finePrintElem = document.getElementById('showcaseItineraryFinePrint');
  const priceElem = document.getElementById('showcaseItineraryPrice');
  const altPriceElem = document.getElementById('showcaseItineraryAltPrice');
  const waBtn = document.getElementById('showcaseItineraryWaBtn');

  if (imgElem) imgElem.src = tour.image || tour.thumbnail;
  if (badgeElem) badgeElem.textContent = tour.category;
  if (durationElem) durationElem.textContent = tour.duration;
  if (ratingElem) ratingElem.textContent = `${tour.rating} (${tour.reviews})`;
  if (titleElem) titleElem.textContent = tour.title;
  if (subtitleElem) subtitleElem.textContent = tour.subtitle;
  if (descElem) descElem.textContent = tour.description;

  // Render Included Services
  if (inclusionsElem) {
    const list = tour.inclusions || tour.checklist || [];
    inclusionsElem.innerHTML = list.map(item => `
      <div class="flex items-start space-x-2 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800 shadow-sm">
        <i class="fa-solid fa-circle-check text-amber-400 text-xs mt-0.5 flex-shrink-0"></i>
        <span class="text-slate-200 text-xs">${item}</span>
      </div>
    `).join('');
  }

  // Render Day-by-Day Journey Breakdown
  if (daysElem) {
    const itinerary = tour.itinerary || [];
    daysElem.innerHTML = itinerary.map((item, idx) => `
      <div class="relative pl-6 pb-4 last:pb-1 border-l-2 border-amber-500/40 last:border-transparent">
        <div class="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-[#070e17] flex items-center justify-center shadow-md">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
        </div>
        <div class="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider mb-1">
          <span>DAY ${item.day || (idx + 1)}</span>
        </div>
        <h5 class="text-xs sm:text-sm font-bold text-white mb-1 font-heading">${item.title}</h5>
        <p class="text-[11px] sm:text-xs text-slate-300 leading-relaxed">${item.desc}</p>
      </div>
    `).join('');
  }

  // Render Fine Print
  if (finePrintElem) {
    const finePrint = tour.finePrint || [
      'Standard hotel check-in at 14:00 hrs & check-out at 12:00 hrs.',
      'Rates are subject to peak season / festive period surcharges.',
      'Valid passport (min. 6 months validity) and relevant tourist visa required.',
      '0% Tabby installment financing options available upon booking confirmation.'
    ];
    finePrintElem.innerHTML = finePrint.map(fp => `<li>${fp}</li>`).join('');
  }

  // Price & Alt Price
  if (priceElem) {
    const formattedAED = typeof formatPrice === 'function' ? formatPrice(tour.priceAED) : `AED ${tour.priceAED.toLocaleString()}`;
    priceElem.textContent = formattedAED;
  }
  if (altPriceElem) {
    altPriceElem.textContent = tour.priceLKR ? `/ person (${tour.priceLKR})` : '/ person';
  }

  // WhatsApp Inquiry CTA
  if (waBtn) {
    const dynamicMsg = `Hello Star Plus Travels, I'm interested in booking the ${tour.title}`;
    waBtn.href = `https://wa.me/971527582293?text=${encodeURIComponent(dynamicMsg)}`;
  }

  // Show modal
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeShowcaseItinerary() {
  const modal = document.getElementById('showcaseItineraryModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  // If the country showcase is still open, keep body overflow hidden
  const countryModal = document.getElementById('countryShowcaseModal');
  if (!countryModal || countryModal.classList.contains('hidden')) {
    document.body.style.overflow = '';
  }
}

// Download PDF Brochure Function
function downloadShowcaseBrochure() {
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
  const priceDisplay = tour.priceLKR ? `${formattedAED} (${tour.priceLKR})` : formattedAED;

  const inclusionsHtml = (tour.inclusions || tour.checklist || []).map(inc => `
    <li style="margin-bottom: 7px; display: flex; align-items: flex-start;">
      <span style="color: #d97706; margin-right: 8px; font-weight: bold;">âœ”</span>
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

// Keyboard navigation for Country Showcase & Itinerary Modals
document.addEventListener('keydown', (e) => {
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
  const cardWidth = 225;
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
window.openShowcaseItinerary = openShowcaseItinerary;
window.closeShowcaseItinerary = closeShowcaseItinerary;
window.downloadShowcaseBrochure = downloadShowcaseBrochure;
window.downloadTourBrochure = downloadTourBrochure;
window.scrollCountryShowcaseCards = scrollCountryShowcaseCards;

// Smart alias: if countryShowcaseModal exists on the page, use openCountryShowcase; otherwise fallback to classic openCountryPackages
const originalOpenCountryPackages = typeof openCountryPackages === 'function' ? openCountryPackages : null;
window.openCountryPackages = function(countryKey) {
  const showcaseModal = document.getElementById('countryShowcaseModal');
  if (showcaseModal && COUNTRY_SHOWCASE_DATA[countryKey]) {
    return openCountryShowcase(countryKey);
  }
  if (typeof originalOpenCountryPackages === 'function') {
    return originalOpenCountryPackages(countryKey);
  }
};
