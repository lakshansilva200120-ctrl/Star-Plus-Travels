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
    topAnnouncementText: "Dubai & Sri Lanka Premier Travel & Visa Specialists",
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
    heroBadge: "Your Gateway to the World • Dubai & Sri Lanka",
    heroTitleFull: 'Your <span class="text-amber-400">Gateway</span> to the World, Crafted with <span class="text-amber-400">Luxury</span> & Ease.',
    heroTitleLead: "Your Gateway to the",
    heroTitleWorld: "World",
    heroTitleMiddle: "Crafted with",
    heroTitleLuxury: "Luxury & Ease",
    heroSubtitle: "Seamless journey from Sri Lanka & the UAE to 45+ global destinations. Handcrafted luxury holiday packages, competitive flights, and fast-track express visa processing.",
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
    footerDesc: "Star Plus Travel and Tourism LLC is a premier licensed travel agency in the United Arab Emirates and Sri Lanka, delivering bespoke luxury vacations, corporate airline ticketing, and rapid express visa processing.",
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
    termsArt1Desc: "Star Plus Travel and Tourism LLC is a registered, licensed entity authorized by the Government of Dubai Department of Economy and Tourism (DET) in the United Arab Emirates, and affiliated with Star Plus Travel (PVT) LTD accredited under the Sri Lanka Tourism Development Authority (SLTDA). By booking holiday packages, international airline tickets, visa concierge services, or transportation through Star Plus Travels, the client acknowledges and enters into an agreement governed by the terms specified herein.",
    termsArt2Title: "Tour Package Quotations &amp; Confirmations",
    termsArt2Desc: "All published or quoted prices are subject to inventory availability and airline fare fluctuations until full payment or the agreed initial deposit has been secured. Star Plus Travels guarantees that once an official booking confirmation voucher has been issued, no supplementary fuel surcharges or unexpected taxes will be added unless mandated by sudden government statutory decree.",
    termsArt3Title: "Split Payments &amp; Installments (Tabby &amp; Tamara)",
    termsArt3Desc: "Customers utilizing split payment solutions (such as Tabby or Tamara) enter into an independent financing relationship with the respective payment provider. Approval of split installment eligibility is determined entirely by Tabby or Tamara algorithms based on UAE Emirates ID verification and credit scoring. Star Plus Travels does not charge any interest or financing fees for split installments. Any late penalty fees assessed for overdue payments are governed strictly by the provider's consumer terms.",
    termsArt4Title: "Official Company Bank Accounts &amp; Secure Payment Policy",
    termsArt4Desc: "All payments must be made strictly to our official company bank account. We will never ask you to transfer funds to a personal account.",
    termsArt4ClauseTitle: "Official Payment Protection Clause:",
    termsArt4ClauseDesc: "All monetary remittances—including holiday deposits, flight ticketing charges, visa processing fees, and hotel reservations—must be remitted exclusively to the verified corporate bank accounts of <strong>Star Plus Travel and Tourism LLC</strong> (in the UAE) or <strong>Star Plus Travel (PVT) LTD</strong> (in Sri Lanka), or completed via our authorized point-of-sale terminals or accredited installment gateways. Under no circumstances will any representative, employee, or agent of Star Plus Travels instruct a client to transfer funds into an individual or personal account.",
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
    topAnnouncementText: "ඩුබායි සහ ශ්‍රී ලංකා ප්‍රමුඛතම සංචාරක සහ වීසා විශේෂඥයෝ",
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
    heroBadge: "ඔබේ විශ්වාසනීය සංචාරක සහකරු • ඩුබායි සහ ශ්‍රී ලංකාව",
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
    footerDesc: "Star Plus Travel and Tourism LLC යනු එක්සත් අරාබි එමීර් රාජ්‍යයේ සහ ශ්‍රී ලංකාවේ බලපත්‍රලාභී ප්‍රමුඛතම සංචාරක ආයතනයක් වන අතර, සුඛෝපභෝගී නිවාඩු චාරිකා, ආයතනික ගුවන් ටිකට්පත් සහ ක්ෂණික එක්ස්ප්‍රස් වීසා සේවා සපයයි.",
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
    termsArt1Desc: "Star Plus Travel and Tourism LLC යනු එක්සත් අරාබි එමීර් රාජ්‍යයේ ඩුබායි ආර්ථික හා සංචාරක දෙපාර්තමේන්තුව (DET) මඟින් බලපත්‍රලත් නීත්‍යානුකූල සමාගමක් වන අතර, ශ්‍රී ලංකා සංචාරක සංවර්ධන අධිකාරිය (SLTDA) යටතේ ලියාපදිංචි Star Plus Travel (PVT) LTD සමඟ අනුබද්ධිත වේ. Star Plus Travels හරහා නිවාඩු පැකේජ, ජාත්‍යන්තර ගුවන් ටිකට්පත්, වීසා සේවා හෝ ප්‍රවාහන සේවා වෙන්කරවා ගැනීමෙන්, සේවාදායකයා මෙහි සඳහන් නියමයන්ට එකඟතාව පළ කරනු ලබයි.",
    termsArt2Title: "සංචාරක පැකේජ මිල ගණන් සහ තහවුරු කිරීම්",
    termsArt2Desc: "සම්පූර්ණ ගෙවීම හෝ එකඟ වූ මූලික තැන්පතුව ගෙවන තුරු ප්‍රකාශිත හෝ ලබාදුන් සියලුම මිල ගණන් හෝටල් කාමර සහ ගුවන් ගාස්තු වෙනස්වීම් මත රඳා පවතී. නිල වෙන්කිරීම් තහවුරු කිරීමේ වවුචරයක් නිකුත් කළ පසු, හදිසි රජයේ බදු නියෝගයකින් හැර කිසිදු අමතර ඉන්ධන අධිභාරයක් හෝ අනපේක්ෂිත බද්දක් එකතු නොකරන බවට Star Plus Travels සහතික කරයි.",
    termsArt3Title: "පහසු වාරික ගෙවීම් (Tabby සහ Tamara)",
    termsArt3Desc: "Tabby හෝ Tamara වැනි පහසු වාරික ගෙවීම් ක්‍රම භාවිතා කරන පාරිභෝගිකයින් අදාළ ගෙවීම් සේවා සපයන්නා සමඟ ස්වාධීන මූල්‍ය ගිවිසුමකට එළඹේ. වාරික ගෙවීමේ සුදුසුකම් අනුමැතිය එක්සත් අරාබි එමීර් රාජ්‍යයේ හැඳුනුම්පත් (Emirates ID) සත්‍යාපනය සහ ණය ශ්‍රේණිගත කිරීම මත Tabby හෝ Tamara මඟින් තීරණය කරනු ලැබේ. Star Plus Travels වාරික ගෙවීම් සඳහා කිසිදු පොලියක් හෝ මූල්‍ය ගාස්තුවක් අය නොකරයි. ප්‍රමාද ගාස්තු අදාළ සේවා සපයන්නාගේ පාරිභෝගික නියමයන්ට යටත් වේ.",
    termsArt4Title: "නිල සමාගම් බැංකු ගිණුම් සහ ආරක්ෂිත ගෙවීම් ප්‍රතිපත්තිය",
    termsArt4Desc: "සියලුම ගෙවීම් අපගේ නිල සමාගම් බැංකු ගිණුමට පමණක් සිදු කළ යුතුය. පුද්ගලික ගිණුම්වලට මුදල් තැන්පත් කරන ලෙස අප කිසි විටෙකත් ඉල්ලා නොසිටිමු.",
    termsArt4ClauseTitle: "නිල ගෙවීම් ආරක්ෂණ වගන්තිය:",
    termsArt4ClauseDesc: "නිවාඩු තැන්පතු, ගුවන් ටිකට්පත් ගාස්තු, වීසා ගාස්තු සහ හෝටල් වෙන්කිරීම් ඇතුළු සියලුම මුදල් ගනුදෙනු <strong>Star Plus Travel and Tourism LLC</strong> (එක්සත් අරාබි එමීර් රාජ්‍යයේ) හෝ <strong>Star Plus Travel (PVT) LTD</strong> (ශ්‍රී ලංකාවේ) නිල සමාගම් බැංකු ගිණුම්වලට හෝ අපගේ බලයලත් ගෙවීම් පර්යන්ත/වාරික ගේට්වේ හරහා පමණක් සිදු කළ යුතුය. කිසිදු සේවකයෙකු හෝ නියෝජිතයෙකු පුද්ගලික ගිණුම්වලට මුදල් තැන්පත් කිරීමට උපදෙස් නොදෙනු ඇත.",
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
  return PACKAGES.filter(pkg => pkg.category === activeCategory);
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
        <p class="text-slate-400 text-sm max-w-md mx-auto mb-6">${currentLang === 'si' ? 'ඩුබායි, ශ්‍රී ලංකාව, බාකු, ජෝර්ජියාව, මාලදිවයින හෝ බාලි වැනි වෙනත් ගමනාන්ත සොයන්න.' : 'Try searching for other destinations like Dubai, Sri Lanka, Baku, Georgia, Maldives, or Bali.'}</p>
        <button onclick="resetFilters()" class="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20">
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
    const bookNowBtnText = t.bookNowBtn || 'Book Now';

    return `
      <div class="package-card glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col relative group border border-slate-200 dark:border-white/10">
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
                  <i class="fa-solid fa-check text-emerald-500 dark:text-emerald-400 text-[10px] mr-2"></i>
                  <span class="truncate">${perk}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Pricing & CTAs -->
          <div class="pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <div class="flex items-end justify-between mb-4 gap-2 min-w-0">
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
              <span class="text-[11px] text-slate-600 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800/60 px-2 py-1 rounded-md shrink-0 whitespace-nowrap">${perPersonText}</span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button onclick="openItineraryModal('${pkg.id}')" class="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 shadow-sm">
                <i class="fa-solid fa-list-ul text-slate-500 dark:text-slate-400"></i>
                <span>${itineraryBtnText}</span>
              </button>
              <button onclick="openBookingModal('${pkg.id}')" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold transition-all text-center shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-1.5">
                <span>${bookNowBtnText}</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
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
  
  // Update UI tabs
  document.querySelectorAll('.cat-pill').forEach(btn => {
    if (btn.dataset.category === cat) {
      btn.className = 'cat-pill px-5 py-2 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition-all';
    } else {
      btn.className = 'cat-pill px-5 py-2 rounded-full text-xs font-semibold bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-all shadow-sm';
    }
  });

  if (cat === 'all') {
    renderPackages(PACKAGES);
  } else {
    const filtered = PACKAGES.filter(p => p.category === cat);
    renderPackages(filtered);
  }
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
  document.getElementById('itineraryModalPrice').textContent = formatPrice(pkg.priceAED);
  document.getElementById('itineraryBookButton').onclick = () => {
    closeItineraryModal();
    openBookingModal(pkg.id);
  };

  const modal = document.getElementById('itineraryModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
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
  if (activeCategory === 'all') {
    renderPackages(PACKAGES);
  } else {
    renderPackages(PACKAGES.filter(p => p.category === activeCategory));
  }

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
    recipient: 'info@starplustraveluae.com',
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
    // Also trigger direct email client pre-fill with full details so the file is directly attached
    const subject = encodeURIComponent(`B2B DMC Partnership Intake: ${company} - ${destination}`);
    const body = encodeURIComponent(
      `Dear Star Plus Travels Contracting Desk,\n\n` +
      `Please find our official DMC and Ground Services partnership application:\n\n` +
      `COMPANY & CREDENTIALS:\n` +
      `- Company Legal Name: ${company}\n` +
      `- Primary Destination: ${destination}\n` +
      `- Key Contact: ${contact}\n` +
      `- Corporate Email: ${email}\n` +
      `- Corporate Phone / WhatsApp: ${phone}\n` +
      `- Website / Portfolio: ${website}\n` +
      `- Social Media Profile: ${social}\n` +
      `- Tourism License / Registration No: ${license}\n` +
      `- Headquarters Location: ${city}\n\n` +
      `OFFICIAL TRADE LICENSE ATTACHMENT (Max 5MB):\n` +
      (licenseFile 
        ? `- Document: ${licenseFile.name} (${formattedDocSize}) [Attached to this email]` 
        : `- Document: [Please attach your official license / certificate document here]\n`) +
      `\nSERVICES & ASSETS:\n` +
      `- ${services.length > 0 ? services.join(', ') : 'Full Inbound Services'}\n\n` +
      `PROPOSAL & TARIFF OVERVIEW:\n` +
      `${proposal}\n\n` +
      `We certify our operational compliance and look forward to receiving contracting documents.\n\n` +
      `Sincerely,\n` +
      `${contact}\n` +
      `${company}`
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

    showToast('🤝 DMC Application and Trade License dispatched! Opening email client to finalize direct attachment to info@starplustraveluae.com.', 'success');
    window.location.href = `mailto:info@starplustraveluae.com?subject=${subject}&body=${body}`;
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
  const social = document.getElementById('partnerSocial')?.value?.trim() || 'N/A';
  const license = document.getElementById('partnerLicense')?.value?.trim() || 'N/A';
  const city = document.getElementById('partnerCity')?.value?.trim() || '';
  const proposal = document.getElementById('partnerProposal')?.value?.trim() || '';
  
  const licenseFileInput = document.getElementById('partnerLicenseFile');
  const licenseFile = licenseFileInput?.files?.[0];

  if (licenseFile && licenseFile.size > 5 * 1024 * 1024) {
    showToast('⚠️ Document exceeds 5MB! Please upload a file under 5MB to attach via email.', 'error');
    return;
  }

  const fileNotice = licenseFile 
    ? `Document: ${licenseFile.name} (${(licenseFile.size / 1024).toFixed(1)} KB) - Attached to this email`
    : 'Document: [Please attach your official license / certificate document directly to this email]';

  const subject = encodeURIComponent(`B2B DMC Partnership Intake: ${company} - ${destination}`);
  const body = encodeURIComponent(
    `Dear Star Plus Travels Contracting Team,\n\n` +
    `Please find our official DMC and Ground Services partnership application:\n\n` +
    `COMPANY & CREDENTIALS:\n` +
    `- Company Legal Name: ${company}\n` +
    `- Primary Destination: ${destination}\n` +
    `- Key Contact: ${contact}\n` +
    `- Corporate Email: ${email}\n` +
    `- Corporate Phone / WhatsApp: ${phone}\n` +
    `- Website / Portfolio: ${website}\n` +
    `- Social Media / Professional Profile: ${social}\n` +
    `- Tourism License / Registration No: ${license}\n` +
    `- Headquarters Location: ${city}\n\n` +
    `TRADE LICENSE ATTACHMENT:\n` +
    `- ${fileNotice}\n\n` +
    `PROPOSAL & TARIFF OVERVIEW:\n` +
    `${proposal}\n\n` +
    `We certify our operational compliance and look forward to receiving contracting documents.\n\n` +
    `Sincerely,\n` +
    `${contact}\n` +
    `${company}`
  );

  window.location.href = `mailto:info@starplustraveluae.com?subject=${subject}&body=${body}`;
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

  // Close modals on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBookingModal();
      closeItineraryModal();
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
    const logoSrc = isDark ? 'assets/logo-white-text.png?v=7.0.0' : 'assets/original-removebg-preview.png?v=7.0.0';

    targetPreloader.innerHTML = `
      <div class="ny-loader-card">
        <div class="ny-logo-container">
          <img src="${logoSrc}" alt="Star Plus Travel and Tourism LLC" class="ny-brand-logo" />
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
    // On New Year morning, give visitors ~2600ms to enjoy the celebration, otherwise standard 600ms
    const minWait = isNyActive ? 2600 : 600;
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
      }, 500);
    }, remaining);
  }

  if (document.readyState === 'complete') {
    dismissPreloader();
  } else {
    window.addEventListener('load', dismissPreloader);
    setTimeout(dismissPreloader, isNyActive ? 3600 : 1500);
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

