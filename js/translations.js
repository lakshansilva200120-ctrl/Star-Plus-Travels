// js/translations.js
/**
 * Star Plus Travel & Tourism LLC - Internationalization (i18n) Dictionary
 * Comprehensive bilingual dictionary supporting English (en) and Sinhala (si).
 */

const translations = {
  en: {
    // ------------------------------------------------------------------------
    // 1. Navigation Links & Header
    // ------------------------------------------------------------------------
    nav_home: "Home",
    nav_destinations: "Destinations",
    nav_packages: "Packages",
    nav_visa: "Visa Services",
    nav_contact: "Contact Us",
    nav_about: "About Us",
    nav_why_us: "Why Choose Us",
    nav_reviews: "Reviews",
    nav_faq: "FAQ",
    nav_terms: "Terms & Conditions",
    nav_careers: "Careers",
    nav_partners: "B2B Partners",
    nav_explore: "Explore",
    nav_get_quote: "Get Quote",

    // Legacy / Template Nav Keys
    navHome: "Home",
    navPackages: "Tour Packages",
    navDestinations: "Destinations",
    navActivitiesVisa: "Visa Services",
    navReviews: "Reviews",
    navWhyUs: "Why Choose Us",
    navCareers: "Careers",
    navFaq: "Help & FAQ",
    navTerms: "Terms & Conditions",
    navContact: "Contact Us",
    navExplore: "Explore",
    navGetQuote: "Request Quote",
    navHiringBadge: "Hiring",
    topBarHiring: "We're Hiring! Join our growing teams in Dubai & Sri Lanka",
    whatsappConcierge: "WhatsApp Concierge",
    customTripBtn: "Request Custom Itinerary",
    lang_toggle_si: "\u0DC3\u0DD2\u0D82\u0DC4\u0DBD",
    lang_toggle_en: "English",

    // ------------------------------------------------------------------------
    // 2. Hero Section
    // ------------------------------------------------------------------------
    hero_title: "Explore the World with Star Plus Travels",
    hero_subtitle: "Curated luxury tours, seamless visa solutions, and unforgettable journeys.",
    heroBadge: "STAR PLUS TRAVEL & TOURISM LLC • DUBAI & SRI LANKA ★",
    heroTitleLead: "Luxury Curated Vacations &",
    heroTitleWorld: "Express Global Visa Services",
    heroSubtitleFull: "Handcrafted holiday packages across Dubai, Georgia, Azerbaijan, Sri Lanka, Maldives, Bali & beyond. Experience bespoke luxury with 0% interest Tabby installments.",
    tabHolidays: "Holidays",
    tabFlights: "Flights",
    tabVisas: "Visas",
    tabHotels: "Hotels",
    destinationLabel: "Destination",
    destinationPlaceholder: "e.g. Dubai, Sri Lanka, Baku",
    travelDateLabel: "Travel Date",
    travelersLabel: "Travelers",
    searchBtn: "Find Packages",
    trendingLabel: "Trending:",

    // ------------------------------------------------------------------------
    // 3. Card Labels & Booking UI
    // ------------------------------------------------------------------------
    card_best_season: "Best Season:",
    card_recommended: "Recommended:",
    card_starting_from: "Starting from:",
    card_view_details: "View Details",
    card_inquire_now: "Inquire Now",
    card_view_packages: "View Packages",
    card_per_person: "per person",
    card_book_now: "Book Now",
    card_itinerary: "Itinerary",
    card_stay: "Stay:",
    card_highlights: "Tour Highlights & Inclusions",
    card_taxes_included: "Taxes & Transfers Included",
    startingFrom: "Starting from",
    perPerson: "per person",
    installmentText: "or 4x {amount}/mo with Tabby",
    itineraryBtn: "Itinerary",
    bookNowBtn: "Book Now",
    inquireWhatsAppBtn: "Inquire on WhatsApp",
    dayLabel: "Day",
    daysLabel: "Days",
    nightsLabel: "Nights",

    // Modal Specific Labels
    modal_route_highlights: "Route & Key Highlights",
    modal_included_services: "Included Services & Perks",
    modal_day_by_day: "Day-by-Day Journey Breakdown",
    modal_hotel_stay: "Accommodation & Handpicked Lodging",
    modal_fine_print: "Important Information & Booking Notes",
    modal_lodging_tag: "HANDPICKED LODGING",
    modal_transfers_tag: "VIP PRIVATE TRANSFERS",
    modal_experiences_tag: "SIGNATURE EXPERIENCES",

    // ------------------------------------------------------------------------
    // 4. Destination Names, Descriptions & Itinerary Highlights
    // ------------------------------------------------------------------------
    dest_dubai: "Dubai, UAE",
    dest_srilanka: "Sri Lanka",
    dest_azerbaijan: "Baku & Caucasus, Azerbaijan",
    dest_georgia: "Tbilisi & Kazbegi, Georgia",
    dest_maldives: "Maldives",
    dest_bali: "Bali, Indonesia",
    dest_turkey: "Istanbul & Cappadocia, Turkey",
    dest_switzerland: "Swiss Alps & Zurich, Switzerland",
    dest_umrah: "Umrah & Saudi Arabia Pilgrimage",
    dest_thailand: "Bangkok & Phuket, Thailand",
    dest_singapore: "Singapore",
    dest_malaysia: "Kuala Lumpur & Langkawi, Malaysia",

    desc_dubai: "Experience futuristic skyscrapers, luxury desert safaris with red dune bashing, marina yacht cruises, and iconic Arabian hospitality.",
    desc_srilanka: "Discover UNESCO Sigiriya rock fortress, misty Ceylon tea valleys of Ella, wild elephant safaris, and golden tropical beaches.",
    desc_azerbaijan: "Explore the Land of Fire: historic UNESCO Old City Baku, futuristic Flame Towers, Gobustan mud volcanoes, and alpine Shahdag resorts.",
    desc_georgia: "Discover Old Tbilisi cobblestone streets, ancient Gergeti Trinity Church below Mount Kazbegi, Kakheti wine valleys, and Gudauri ski slopes.",
    desc_maldives: "Pristine private island overwater villas, turquoise lagoons, vibrant coral reefs, and all-inclusive tropical luxury.",
    desc_bali: "Lush Ubud jungle sanctuaries, sacred sea temples of Tanah Lot, cascading Tegallalang rice terraces, and Seminyak beach sunsets.",
    desc_turkey: "Where East embraces West: the historic Bosphorus, Byzantine Hagia Sophia, Grand Bazaar, and magical hot air balloon rides over Cappadocia.",
    desc_switzerland: "Scenic glacier express trains, alpine peaks of the Matterhorn, crystal blue lakes of Interlaken, and Swiss chocolate heritage.",
    desc_umrah: "Complete spiritual pilgrimage packages to Makkah and Madinah with 5-star hotel accommodations near Haram and dedicated transport.",

    // Itinerary Highlights
    hl_desert_safari: "VIP 4x4 Desert Safari & Sunset BBQ Dinner",
    hl_burj_khalifa: "Burj Khalifa 'At The Top' Priority Admission",
    hl_luxury_hotel: "Handpicked 4-Star & 5-Star Luxury Accommodations",
    hl_private_transfers: "Private Air-Conditioned Chauffeur & Airport Transfers",
    hl_sigiriya: "Sigiriya 5th-Century Lion Rock UNESCO Fortress",
    hl_kandy_tooth: "Temple of the Sacred Tooth Relic (Kandy)",
    hl_ella_train: "Scenic Blue Highland Train & Nine Arch Bridge",
    hl_baku_flame: "Baku Old City (Icherisheher) & Flame Towers",
    hl_kazbegi_peaks: "Mount Kazbegi 5,047m & Gergeti Trinity Church",
    hl_gudauri_alps: "Gudauri Greater Caucasus Mountain Passes",
    hl_all_inclusive: "All-Inclusive Resort Dining & Water Activities",

    // ------------------------------------------------------------------------
    // 5. Contact Form Fields, Labels, Placeholders & Error Messages
    // ------------------------------------------------------------------------
    form_title: "Request a Free Travel Itinerary & Quote",
    form_subtitle: "We respond with comprehensive options and transparent pricing within 2 hours.",
    form_name: "Your Full Name *",
    form_email: "Email Address *",
    form_phone: "Phone / WhatsApp Number *",
    form_destination: "Preferred Destination",
    form_travelers: "Estimated Travelers",
    form_interest: "Primary Interest",
    form_notes: "Trip Notes / Special Requests",
    form_submit: "Send Travel Request",

    placeholder_name: "e.g. John Smith",
    placeholder_email: "name@example.com",
    placeholder_phone: "+971 50 123 4567",
    placeholder_destination: "e.g. Dubai, Sri Lanka, Baku",
    placeholder_notes: "Tell us about your preferred travel dates, hotel rating preference, or special requests...",

    // Form Validation & Error Messages
    error_required_name: "Please enter your full name",
    error_invalid_email: "Please enter a valid email address",
    error_invalid_phone: "Please enter a valid phone number",
    error_country_phone: "Please enter a complete phone number for the selected country",
    error_required_destination: "Please select a destination",
    error_form_submit: "There was an error sending your request. Please try again or reach out on WhatsApp.",
    success_form_submit: "Thank you! Your travel inquiry has been received. Our team will contact you within 2 hours.",

    // ------------------------------------------------------------------------
    // 6. Footer Copyright, Links & License Information
    // ------------------------------------------------------------------------
    footer_rights: "All rights reserved.",
    footer_copyright: "© 2026 Star Plus Travel & Tourism LLC. All rights reserved.",
    footer_attribution: "Redesigned & Developed by Lupo",
    footer_license: "Government Accredited Travel Management Company licensed by Dubai Department of Economy and Tourism (DET License No. 1489063) and registered with Sri Lanka Tourism Development Authority (SLTDA).",
    footer_about: "Star Plus Travel & Tourism LLC is a premier licensed travel agency in the United Arab Emirates and Sri Lanka, delivering bespoke luxury vacations, corporate airline ticketing, and rapid express visa processing.",
    footer_uae_inquiry: "UAE Headquarters: Office 204, Al Rigga Business Center, Deira, Dubai",
    footer_sl_inquiry: "Sri Lanka Branch: Galle Road, Colombo 03, Sri Lanka",
    footer_quick_links: "Quick Links",
    footer_top_packages: "Top Packages",
    footer_destinations: "Key Hubs",
    footer_legal: "Accreditations & Disclosures",
    footer_payment_notice: "Official Payment Notice: All payments must be remitted strictly to verified corporate bank accounts of Star Plus Travel & Tourism LLC. We never ask for transfers to personal accounts.",

    // ------------------------------------------------------------------------
    // 7. Visa Section
    // ------------------------------------------------------------------------
    visa_title: "Express Visa & Immigration Concierge",
    visa_desc: "Fast, authorized visa issuance with a 99.4% approval track record across the UAE, GCC, Schengen, Sri Lanka, and worldwide.",
    visa_calc_title: "Check Visa Requirements & Rates",
    visa_opt_uae: "UAE Tourist & Freelance Visa (30 / 60 Days)",
    visa_price_speed: "From 380 AED | 24–48 Hours Express",
    visa_req_docs: "REQUIRED DOCUMENTS CHECKLIST:",
    doc_passport: "Passport copy (valid 6+ months from travel date)",
    doc_photo: "Passport-size photograph with white background",
    doc_prev_visa: "Previous UAE tourist visa copy or residence cancellation (if in UAE)",
    doc_nic: "National identity card copy (for selected nationalities)",

    // ------------------------------------------------------------------------
    // 8. Quote Modal & Form Controls
    // ------------------------------------------------------------------------
    adult_travelers: "ADULT TRAVELERS (12+ YRS)",
    children_travelers: "CHILDREN (2-11 YRS)",
    dep_date: "PREFERRED DEPARTURE DATE",
    special_notes: "SPECIAL NOTES / INQUIRIES (OPTIONAL)",
    opt_adults_count: "{count} Adults",
    opt_children_count: "{count} Children",

    // ------------------------------------------------------------------------
    // 9. Custom Itinerary & Trust Badges
    // ------------------------------------------------------------------------
    custom_itinerary_title: "Need a Completely Customized Itinerary?",
    custom_itinerary_desc: "Our private travel specialists design custom routes, private luxury chauffeurs, multi-city airline tickets, and boutique hotel bookings tailored exactly to your family or corporate group budget.",
    btn_request_custom: "Request Custom Quote",
    badge_dual_licensed: "Dual Licensed",
    badge_dual_desc: "Accredited by UAE DET and Sri Lanka SLTDA.",
    badge_fare: "Best Fare Assurance",
    badge_fare_desc: "Direct airline consolidator pricing with zero hidden fees.",
    badge_split: "Split in 4 Payments",
    badge_split_desc: "Flexible interest-free installments via Tabby & Tamara.",
    badge_support: "24/7 Dedicated Support",
    badge_support_desc: "Human travel architects available before and during your journey.",

    // ------------------------------------------------------------------------
    // 10. Section Titles
    // ------------------------------------------------------------------------
    destinations_title: "Inspiring Travel Destinations",
    destinations_sub: "From glistening Arabian skyscrapers and tranquil Indian Ocean atolls to misty tea mountains and ancient Caucasian fortresses.",
    why_choose_title: "Why Discerning Travelers Choose Us",
    why_choose_sub: "Dual headquarters in Dubai and Colombo, accredited legal authority, direct wholesale airline partnerships, and around-the-clock personal concierge service.",
    faq_title: "Frequently Asked Questions",
    faq_sub: "Find authoritative answers regarding tour package bookings, UAE and Schengen visa procedures, payment split plans, and refund policies.",
    contact_title: "Contact Our Global Offices",
    contact_sub: "Visit our physical branches in Dubai or Colombo, or speak directly with our senior travel specialists on phone or WhatsApp.",

    // Compatible Page Aliases
    visaPageTitle: "Express Visa & Immigration Concierge",
    visaPageSubtitle: "Fast, authorized visa issuance with a 99.4% approval track record across the UAE, GCC, Schengen, Sri Lanka, and worldwide.",
    destinationsPageTitle: "Inspiring Travel Destinations",
    destinationsPageSubtitle: "From glistening Arabian skyscrapers and tranquil Indian Ocean atolls to misty tea mountains and ancient Caucasian fortresses.",
    whyUsPageTitle: "Why Discerning Travelers Choose Us",
    whyUsPageSubtitle: "Dual headquarters in Dubai and Colombo, accredited legal authority, direct wholesale airline partnerships, and around-the-clock personal concierge service.",
    faqPageTitle: "Frequently Asked Questions",
    faqPageSubtitle: "Find authoritative answers regarding tour package bookings, UAE and Schengen visa procedures, payment split plans, and refund policies.",
    contactPageTitle: "Contact Our Global Offices",
    contactPageSubtitle: "Visit our physical branches in Dubai or Colombo, or speak directly with our senior travel specialists on phone or WhatsApp.",

    visa_opt_oman: "Oman Visa Change by Luxury Coach (Deira Departure)",
    visa_opt_schengen: "Schengen European Visa Full Concierge & File Preparation",
    visa_opt_srilanka: "Sri Lanka Electronic Travel Authorization (ETA)",
    visa_opt_azerbaijan: "Azerbaijan Official ASAN e-Visa (3-Hour Express)",
    faq_search_placeholder: "Search questions (e.g., visa documents, refund, Tabby)...",

    // Career Section & Modal
    career_badge: "Careers at Star Plus Travel & Tourism LLC",
    career_hero_title: "Turn Travel Dreams Into <span class=\"gold-gradient-text\">Lifelong Careers</span>",
    career_hero_sub: "We are building the next generation of seamless international travel, luxury vacations, and visa solutions. Join our multi-cultural teams in Dubai, UAE and Colombo, Sri Lanka.",
    career_vacancies_badge: "Open Vacancies",
    career_vacancies_title: "Current Career Opportunities",
    career_vacancies_sub: "Select a position below to review requirements and submit your resume directly to our regional HR desks.",
    career_full_time: "Full-Time",
    career_apply_now: "Apply Now",
    career_apply_to: "Apply to UAE or SL",
    career_job1_dept: "Holiday Planning & Operations",
    career_job1_title: "Travel Consultant",
    career_job2_dept: "VIP & Luxury Travel",
    career_job2_title: "Senior Travel Consultant",
    career_job3_dept: "Consular & Visa Services",
    career_job3_title: "Visa Processing Officer",
    career_job4_dept: "Ground Operations & Logistics",
    career_job4_title: "Tour Coordinator",
    career_job5_dept: "Commercial & B2B Partnerships",
    career_job5_title: "Sales Officer",
    career_modal_full_name: "Your Full Name *",
    career_modal_email: "Email Address *",
    career_modal_phone: "Phone / WhatsApp *",
    career_modal_target_branch: "Target Branch Location *",
    career_modal_exp: "Relevant Experience (Years)",
    career_modal_portfolio: "LinkedIn or Portfolio URL",
    career_modal_resume_title: "Resume / CV Document *",
    career_modal_resume_sub: "PDF, DOC, DOCX up to 5MB",
    career_modal_dropzone_idle: "Click or drag & drop your Resume/CV",
    career_modal_cover_note: "Brief Cover Note / Introduction",
    career_modal_submit_btn: "Submit Application",
    career_modal_open_email: "Open in Email App",
    career_routing_uae: "Routing to: info@starplustraveluae.com (UAE Desk)",
    career_routing_sl: "Routing to: info@starplustravelsl.com (Sri Lanka Desk)",

    // DMC Partner Form / Modal
    dmc_register_sub: "Official Intake Application",
    dmc_register_title: "Register Your DMC / Ground Services",
    dmc_register_desc: "Fill out the confidential intake form below. Our Contracting Director will connect directly via WhatsApp and corporate email.",
    dmc_company_name: "Legal Company Name *",
    dmc_primary_dest: "Primary Destination / Country *",
    dmc_contact_person: "Key Contact Person & Title *",
    dmc_corp_email: "Corporate Work Email *",
    dmc_phone: "Corporate Phone / WhatsApp *",
    dmc_website: "Website / Online Portfolio *",
    dmc_social: "Social Media Link / Professional Profile",
    dmc_license: "Tourism License / Reg No. *",
    dmc_hq_city: "Headquarters City & Country *",
    dmc_fleet_notes: "Fleet, Services & Portfolio Overview",
    dmc_certify_text: "I certify that our organization is a legally registered travel company in good standing, holds all necessary operational licenses and insurances, and consents to Star Plus Travels verifying our credentials for B2B contracting.",
    dmc_checkbox_error: "⚠️ Please certify and check this box before submitting your application.",
    dmc_submit_btn: "Submit DMC Application",
    dmc_email_client_btn: "Send via Email Client"
  },

  si: {
    // ------------------------------------------------------------------------
    // 1. Navigation Links & Header
    // ------------------------------------------------------------------------
    nav_home: "මුල් පිටුව",
    nav_destinations: "ගමනාන්ත",
    nav_packages: "පැකේජ",
    nav_visa: "වීසා සේවා",
    nav_contact: "අප අමතන්න",
    nav_about: "අප ගැන",
    nav_why_us: "ඇයි Star Plus",
    nav_reviews: "ප්‍රසාද අදහස්",
    nav_faq: "නිතර අසන ප්‍රශ්න",
    nav_terms: "නියම සහ කොන්දේසි",
    nav_careers: "රැකියා අවස්ථා",
    nav_partners: "B2B හවුල්කරුවන්",
    nav_explore: "ගවේෂණය",
    nav_get_quote: "මිල ගණන් ලබාගන්න",

    // Legacy / Template Nav Keys
    navHome: "මුල් පිටුව",
    navPackages: "සංචාරක පැකේජ",
    navDestinations: "ගමනාන්ත",
    navActivitiesVisa: "වීසා සේවා",
    navReviews: "ප්‍රසාද අදහස්",
    navWhyUs: "ඇයි Star Plus",
    navCareers: "රැකියා අවස්ථා",
    navFaq: "නිතර අසන ප්‍රශ්න",
    navTerms: "නියම සහ කොන්දේසි",
    navContact: "අප අමතන්න",
    navExplore: "ගවේෂණය",
    navGetQuote: "මිල ගණන් ලබාගන්න",
    navHiringBadge: "බඳවා ගැනේ",
    topBarHiring: "අප බඳවා ගනු ලැබේ! ඩුබායි සහ ශ්‍රී ලංකාවේ අපගේ කණ්ඩායම් වලට එක්වන්න",
    whatsappConcierge: "වට්ස්ඇප් සේවාව",
    customTripBtn: "සුවිශේෂී සංචාරක සැලැස්මක් ඉල්ලන්න",
    lang_toggle_si: "\u0DC3\u0DD2\u0D82\u0DC4\u0DBD",
    lang_toggle_en: "English",

    // ------------------------------------------------------------------------
    // 2. Hero Section
    // ------------------------------------------------------------------------
    hero_title: "Star Plus Travels සමඟ ලොව වටා සංචාරය කරන්න",
    hero_subtitle: "විශේෂිත සුඛෝපභෝගී සංචාර, වීසා සේවා සහ අමතක නොවන අත්දැකීම්.",
    heroBadge: "STAR PLUS TRAVEL & TOURISM LLC • ඩුබායි සහ ශ්‍රී ලංකාව ★",
    heroTitleLead: "විශ්වාසනීය ගමනක සුඛෝපභෝගී අත්දැකීම —",
    heroTitleWorld: "ඔබේ ලෝක සංචාරක සිහිනය සැබෑ කරගන්න.",
    heroSubtitleFull: "ඩුබායි, ජෝර්ජියාව, අසර්බයිජානය, ශ්‍රී ලංකාව, මාලදිවයින සහ බාලි ඇතුළු රටවල් 45+ කට සුඛෝපභෝගී නිවාඩු පැකේජ. Tabby හරහා 0% පොලී රහිත වාරික ගෙවීම් පහසුකම් සමඟින්.",
    tabHolidays: "සංචාරක පැකේජ",
    tabFlights: "ගුවන් ටිකට්පත්",
    tabVisas: "වීසා සේවා",
    tabHotels: "හෝටල් වෙන්කිරීම්",
    destinationLabel: "ගමනාන්තය",
    destinationPlaceholder: "උදා: ඩුබායි, ශ්‍රී ලංකාව, බාකු",
    travelDateLabel: "සංචාරක දිනය",
    travelersLabel: "සංචාරකයින්",
    searchBtn: "පැකේජ සොයන්න",
    trendingLabel: "ජනප්‍රියම:",

    // ------------------------------------------------------------------------
    // 3. Card Labels & Booking UI
    // ------------------------------------------------------------------------
    card_best_season: "හොඳම කාලය:",
    card_recommended: "නිර්දේශිත කාලය:",
    card_starting_from: "ආරම්භක මිල:",
    card_view_details: "විස්තර බලන්න",
    card_inquire_now: "විමසන්න",
    card_view_packages: "පැකේජ බලන්න",
    card_per_person: "පුද්ගලයෙකුට",
    card_book_now: "වෙන්කරන්න",
    card_itinerary: "විස්තර",
    card_stay: "නවාතැන්:",
    card_highlights: "සංචාරක විශේෂතා සහ ඇතුළත් දෑ",
    card_taxes_included: "බදු සහ ප්‍රවාහන ගාස්තු ඇතුළත්ය",
    startingFrom: "ආරම්භක මිල",
    perPerson: "පුද්ගලයෙකුට",
    installmentText: "හෝ Tabby මගින් මසකට 4x {amount}",
    itineraryBtn: "විස්තර",
    bookNowBtn: "වෙන්කරන්න",
    inquireWhatsAppBtn: "WhatsApp මගින් විමසන්න",
    dayLabel: "දිනය",
    daysLabel: "දින",
    nightsLabel: "රාත්‍රී",

    // Modal Specific Labels
    modal_route_highlights: "සංචාරක මාර්ගය සහ ප්‍රධාන නැවතුම්",
    modal_included_services: "ඇතුළත් සේවාවන් සහ වරප්‍රසාද",
    modal_day_by_day: "දිනෙන් දින සංචාරක කාලසටහන",
    modal_hotel_stay: "තෝරාගත් සුඛෝපභෝගී නවාතැන් පහසුකම්",
    modal_fine_print: "වැදගත් තොරතුරු සහ වෙන්කිරීමේ නියමයන්",
    modal_lodging_tag: "තෝරාගත් සුඛෝපභෝගී නවාතැන්",
    modal_transfers_tag: "පෞද්ගලික ප්‍රවාහන පහසුකම්",
    modal_experiences_tag: "සුවිශේෂී අත්දැකීම්",

    // ------------------------------------------------------------------------
    // 4. Destination Names, Descriptions & Itinerary Highlights
    // ------------------------------------------------------------------------
    dest_dubai: "ඩුබායි, එක්සත් අරාබි එමීර් රාජ්‍යය",
    dest_srilanka: "ශ්‍රී ලංකාව",
    dest_azerbaijan: "බාකු සහ කොකේසස්, අසර්බයිජානය",
    dest_georgia: "ටිබිලිසි සහ කස්බෙගි, ජෝර්ජියාව",
    dest_maldives: "මාලදිවයින",
    dest_bali: "බාලි, ඉන්දුනීසියාව",
    dest_turkey: "ඉස්තාන්බුල් සහ කැපඩෝසියා, තුර්කිය",
    dest_switzerland: "ස්විස් ඇල්ප්ස් සහ සූරිච්, ස්විට්සර්ලන්තය",
    dest_umrah: "උම්රා සහ සෞදි අරාබි වන්දනා චාරිකා",
    dest_thailand: "බැංකොක් සහ ෆුකෙට්, තායිලන්තය",
    dest_singapore: "සිංගප්පූරුව",
    dest_malaysia: "ක්වාලාලම්පූර් සහ ලන්කාවි, මැලේසියාව",

    desc_dubai: "අති නවීන නගර අලංකාරය, කාන්තාර සෆාරි, මැරීනා යාත්‍රා චාරිකා සහ ප්‍රමුඛ පෙළේ අරාබි ආගන්තුක සත්කාරය විඳගන්න.",
    desc_srilanka: "යුනෙස්කෝ ලෝක උරුම සීගිරිය බලකොටුව, ඇල්ල මනරම් තේ වතු යායවල්, වනජීවී සෆාරි සහ ස්වභාවික වෙරළ තීරයන් ගවේෂණය කරන්න.",
    desc_azerbaijan: "ගිනිදැල් දේශය: ඓතිහාසික සිල්ක් මාවත, නූතන ගිනිදැල් කුළුණු, ගොබුස්තාන් මඩ ගිනි කඳු සහ ශහ්ඩැග් හිම කඳුකරය.",
    desc_georgia: "පෞරාණික ටිබිලිසි නගරය, කස්බෙගි හි හිමෙන් වැසුණු කඳු මුදුන්, පුරාණ දේවස්ථාන සහ සුප්‍රසිද්ධ ජෝර්ජියානු ආගන්තුක සත්කාරය.",
    desc_maldives: "දියමත පිහිටි සුඛෝපභෝගී විලා, නිල්වන් සාගර ජලය, වර්ණවත් කොරල් පර සහ අසමසම නිවාඩු සුවය.",
    desc_bali: "උබුඩ් හි නිවර්තන වනගත අසිරිය, පූජනීය මුහුදු කෝවිල්, මනරම් පඩිපෙළ කුඹුරු සහ සෙමින්‍යක් වෙරළ තීරයන්.",
    desc_turkey: "පෙරදිග සහ අපරදිග එක්වන බොස්ෆරස් සමුද්‍ර සන්ධිය, ඓතිහාසික හගියා සොෆියා සහ කැපඩෝසියා උණුසුම් වායු බැලූන් අත්දැකීම.",
    desc_switzerland: "සුප්‍රසිද්ධ ඇල්පයින් දුම්රිය චාරිකා, මැටර්හෝන් හිම කඳු, ඉන්ටර්ලැකන් විල් සහ ස්විස් චොක්ලට් සංස්කෘතිය.",
    desc_umrah: "ශුද්ධ වූ මක්කම සහ මදීනා වෙත පූර්ණ මගපෙන්වීම්, තරු 5 හෝටල් සහ ප්‍රවාහනය සහිත ආධ්‍යාත්මික උම්රා චාරිකා.",

    // Itinerary Highlights
    hl_desert_safari: "VIP 4x4 කාන්තාර සෆාරි සහ බාබකියු රාත්‍රී භෝජනය",
    hl_burj_khalifa: "බර්ජ් කලීෆා නිරීක්ෂණාගාර ප්‍රමුඛ ප්‍රවේශය",
    hl_luxury_hotel: "තෝරාගත් තරු 4 සහ තරු 5 සුඛෝපභෝගී නවාතැන්",
    hl_private_transfers: "පෞද්ගලික වායුසමනය කළ රථ සහ ගුවන් තොටුපළ ප්‍රවාහනය",
    hl_sigiriya: "සීගිරිය 5 වන සියවසේ ලෝක උරුම පර්වත බලකොටුව",
    hl_kandy_tooth: "ශ්‍රී දළදා මාළිගාව (මහනුවර)",
    hl_ella_train: "ඇල්ල මනරම් නිල් දුම්රිය ගමන සහ ආරුක්කු නවයේ පාලම",
    hl_baku_flame: "බාකු පැරණි නගරය සහ නූතන ගිනිදැල් කුළුණු",
    hl_kazbegi_peaks: "මීටර් 5,047 උසැති කස්බෙගි කඳු මුදුන සහ ගර්ගෙටි දේවස්ථානය",
    hl_gudauri_alps: "ගුඩවුරි මහා කොකේසස් කඳුකර මාර්ග සහ හිම ක්‍රීඩා",
    hl_all_inclusive: "සියල්ල ඇතුළත් ආහාරපාන සහ ජල ක්‍රීඩා අත්දැකීම්",

    // ------------------------------------------------------------------------
    // 5. Contact Form Fields, Labels, Placeholders & Error Messages
    // ------------------------------------------------------------------------
    form_title: "නොමිලේ සංචාරක සැලැස්මක් සහ මිල ගණන් ලබාගන්න",
    form_subtitle: "පැය 2ක් ඇතුළත සම්පූර්ණ තොරතුරු සහ විනිවිදභාවයෙන් යුතු මිල ගණන් අප විසින් සපයනු ලැබේ.",
    form_name: "ඔබගේ සම්පූර්ණ නම *",
    form_email: "විද්‍යුත් තැපෑල *",
    form_phone: "දුරකථන / WhatsApp අංකය *",
    form_destination: "කැමති ගමනාන්තය",
    form_travelers: "සංචාරකයින් සංඛ්‍යාව",
    form_interest: "ප්‍රධාන අවශ්‍යතාවය",
    form_notes: "සංචාරක සටහන් / විශේෂ ඉල්ලීම්",
    form_submit: "සංචාරක ඉල්ලීම යොමු කරන්න",

    placeholder_name: "උදා: කසුන් පෙරේරා",
    placeholder_email: "name@example.com",
    placeholder_phone: "+971 50 123 4567",
    placeholder_destination: "උදා: ඩුබායි, ශ්‍රී ලංකාව, බාකු",
    placeholder_notes: "ඔබගේ සංචාරක දිනයන්, හෝටල් මට්ටම හෝ වෙනත් විශේෂ ඉල්ලීම් සඳහන් කරන්න...",

    // Form Validation & Error Messages
    error_required_name: "කරුණාකර ඔබගේ සම්පූර්ණ නම ඇතුළත් කරන්න",
    error_invalid_email: "කරුණාකර වලංගු විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න",
    error_invalid_phone: "කරුණාකර වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න",
    error_country_phone: "තෝරාගත් රට සඳහා කරුණාකර සම්පූර්ණ දුරකථන අංකය ඇතුළත් කරන්න",
    error_required_destination: "කරුණාකර ගමනාන්තයක් තෝරන්න",
    error_form_submit: "ඉල්ලීම යොමු කිරීමේදී දෝෂයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න හෝ WhatsApp මගින් සම්බන්ධ වන්න.",
    success_form_submit: "ස්තූතියි! ඔබගේ සංචාරක ඉල්ලීම අප වෙත ලැබිණි. අපගේ කණ්ඩායම පැය 2 ක් ඇතුළත ඔබ හා සම්බන්ධ වනු ඇත.",

    // ------------------------------------------------------------------------
    // 6. Footer Copyright, Links & License Information
    // ------------------------------------------------------------------------
    footer_rights: "සියලු හිමිකම් ඇවිරිණි.",
    footer_copyright: "© 2026 Star Plus Travel & Tourism LLC. සියලු හිමිකම් ඇවිරිණි.",
    footer_attribution: "නිර්මාණය Lupo විසිනි",
    footer_license: "ඩුබායි ආර්ථික හා සංචාරක දෙපාර්තමේන්තුව (DET බලපත්‍ර අංක: 1489063) මඟින් බලපත්‍රලත් සහ ශ්‍රී ලංකා සංචාරක සංවර්ධන අධිකාරිය (SLTDA) යටතේ ලියාපදිංචි නිල සංචාරක කළමනාකරණ සමාගමකි.",
    footer_about: "Star Plus Travel & Tourism LLC යනු එක්සත් අරාබි එමීර් රාජ්‍යයේ සහ ශ්‍රී ලංකාවේ බලපත්‍රලාභී ප්‍රමුඛතම සංචාරක ආයතනයක් වන අතර, සුඛෝපභෝගී නිවාඩු චාරිකා, ආයතනික ගුවන් ටිකට්පත් සහ ක්ෂණික එක්ස්ප්‍රස් වීසා සේවා සපයයි.",
    footer_uae_inquiry: "ඩුබායි ප්‍රධාන කාර්යාලය: කාර්යාල අංක 204, අල් රිග්ගා ව්‍යාපාරික මධ්‍යස්ථානය, දෙයිරා, ඩුබායි",
    footer_sl_inquiry: "ශ්‍රී ලංකා ශාඛාව: ගාලු පාර, කොළඹ 03, ශ්‍රී ලංකාව",
    footer_quick_links: "ක්ෂණික පිවිසුම්",
    footer_top_packages: "ප්‍රධාන පැකේජ",
    footer_destinations: "ප්‍රධාන මධ්‍යස්ථාන",
    footer_legal: "නීතිමය සහතික සහ ප්‍රතිපත්ති",
    footer_payment_notice: "නිල ගෙවීම් ආරක්ෂණ දැනුම්දීම: සියලුම ගෙවීම් අපගේ නිල සමාගම් බැංකු ගිණුමට පමණක් සිදු කළ යුතුය. කිසිදු පුද්ගලික ගිණුමකට මුදල් බැර කරන ලෙස අප කිසිවිටෙකත් ඉල්ලා නොසිටිමු.",

    // ------------------------------------------------------------------------
    // 7. Visa Section
    // ------------------------------------------------------------------------
    visa_title: "එක්ස්ප්රස් වීසා සහ ආගමන විගමන සේවාව",
    visa_desc: "එක්සත් අරාබි එමීර් රාජ්යය, GCC, ෂෙන්ගන්, ශ්රී ලංකාව සහ ලොව පුරා 99.4% ක අනුමැතියක් සහිත නිල වීසා සේවාව.",
    visa_calc_title: "වීසා අවශ්යතා සහ ගාස්තු පරීක්ෂා කරන්න",
    visa_opt_uae: "එක්සත් අරාබි එමීර් සංචාරක සහ නිදහස් වීසා (දින 30 / 60)",
    visa_price_speed: "AED 380 සිට | පැය 24–48 කඩිනම් සේවාව",
    visa_req_docs: "අවශ්ය ලිපිලේඛන ලැයිස්තුව:",
    doc_passport: "විදේශ ගමන් බලපත්ර පිටපත (මාස 6 කට වඩා වලංගු)",
    doc_photo: "සුදු පසුබිම සහිත ඡායාරූපය",
    doc_prev_visa: "පෙර එක්සත් අරාබි එමීර් වීසා පිටපත හෝ අවලංගු කිරීමේ ලියකියවිලි",
    doc_nic: "ජාතික හැඳුනුම්පත් පිටපත",

    // ------------------------------------------------------------------------
    // 8. Quote Modal & Form Controls
    // ------------------------------------------------------------------------
    adult_travelers: "වැඩිහිටි සංචාරකයින් (වයස 12+)",
    children_travelers: "ළමුන් (වයස 2-11)",
    dep_date: "බලාපොරොත්තු වන පිටත්වීමේ දිනය",
    special_notes: "විශේෂ සටහන් / විමසීම් (විකල්ප)",
    opt_adults_count: "වැඩිහිටියන් {count}",
    opt_children_count: "ළමුන් {count}",

    // ------------------------------------------------------------------------
    // 9. Custom Itinerary & Trust Badges
    // ------------------------------------------------------------------------
    custom_itinerary_title: "ඔබටම වෙන්වූ සංචාරක සැලසුමක් අවශ්යද?",
    custom_itinerary_desc: "ඔබේ පවුලේ හෝ ආයතනික අයවැයට ගැළපෙන පරිදි විශේෂ ගමන් මාර්ග, සුඛෝපභෝගී වාහන සහ හෝටල් වෙන්කිරීම් අපගේ විශේෂඥයින් විසින් සකස් කරනු ලැබේ.",
    btn_request_custom: "මිල කැඳවීමක් ලබාගන්න",
    badge_dual_licensed: "ද්විත්ව බලපත්රලාභී",
    badge_dual_desc: "UAE DET සහ ශ්රී ලංකා SLTDA මඟින් නිල වශයෙන් අනුමතයි.",
    badge_fare: "හොඳම මිල සහතිකය",
    badge_fare_desc: "සැඟවුණු ගාස්තු රහිත සෘජු ගුවන් සේවා ගාස්තු.",
    badge_split: "කොටස් 4කින් ගෙවන්න",
    badge_split_desc: "Tabby සහ Tamara හරහා පොලී රහිත පහසු ගෙවීමේ ක්රම.",
    badge_support: "24/7 පාරිභෝගික සහය",
    badge_support_desc: "ඔබගේ සංචාරය පුරාවටම ඕනෑම වේලාවක අපගේ සහයෝගය.",

    // ------------------------------------------------------------------------
    // 10. Section Titles
    // ------------------------------------------------------------------------
    destinations_title: "සිත් ඇදගන්නා සංචාරක ගමනාන්ත",
    destinations_sub: "අරාබි අහස උසට නැඟුණු ගොඩනැගිලි සහ සන්සුන් ඉන්දියන් සාගර දූපත් වල සිට මිහිදුම් සහිත තේ වතු සහ ඓතිහාසික බලකොටු දක්වා.",
    why_choose_title: "සංචාරකයින් අපව තෝරාගන්නේ ඇයි",
    why_choose_sub: "ඩුබායි සහ කොළඹ පිහිටි ප්රධාන කාර්යාල, නිල නීතිමය අනුමැතිය සහ පැය 24 පුරා ක්රියාත්මක පෞද්ගලික සේවාව.",
    faq_title: "නිතර අසන ප්රශ්න",
    faq_sub: "සංචාරක පැකේජ, වීසා ක්රියාවලි, පහසු ගෙවීමේ ක්රම සහ මුදල් ආපසු ලබාගැනීමේ ප්රතිපත්ති පිළිබඳ තොරතුරු.",
    contact_title: "අපගේ ගෝලීය කාර්යාල හා සම්බන්ධ වන්න",
    contact_sub: "ඩුබායි හෝ කොළඹ පිහිටි අපගේ ශාඛා වෙත පැමිණෙන්න, නැතහොත් දුරකථන හෝ WhatsApp හරහා අප හා සම්බන්ධ වන්න.",

    // Compatible Page Aliases
    visaPageTitle: "එක්ස්ප්රස් වීසා සහ ආගමන විගමන සේවාව",
    visaPageSubtitle: "එක්සත් අරාබි එමීර් රාජ්යය, GCC, ෂෙන්ගන්, ශ්රී ලංකාව සහ ලොව පුරා 99.4% ක අනුමැතියක් සහිත නිල වීසා සේවාව.",
    destinationsPageTitle: "සිත් ඇදගන්නා සංචාරක ගමනාන්ත",
    destinationsPageSubtitle: "අරාබි අහස උසට නැඟුණු ගොඩනැගිලි සහ සන්සුන් ඉන්දියන් සාගර දූපත් වල සිට මිහිදුම් සහිත තේ වතු සහ ඓතිහාසික බලකොටු දක්වා.",
    whyUsPageTitle: "සංචාරකයින් අපව තෝරාගන්නේ ඇයි",
    whyUsPageSubtitle: "ඩුබායි සහ කොළඹ පිහිටි ප්රධාන කාර්යාල, නිල නීතිමය අනුමැතිය සහ පැය 24 පුරා ක්රියාත්මක පෞද්ගලික සේවාව.",
    faqPageTitle: "නිතර අසන ප්රශ්න",
    faqPageSubtitle: "සංචාරක පැකේජ, වීසා ක්රියාවලි, පහසු ගෙවීමේ ක්රම සහ මුදල් ආපසු ලබාගැනීමේ ප්රතිපත්ති පිළිබඳ තොරතුරු.",
    contactPageTitle: "අපගේ ගෝලීය කාර්යාල හා සම්බන්ධ වන්න",
    contactPageSubtitle: "ඩුබායි හෝ කොළඹ පිහිටි අපගේ ශාඛා වෙත පැමිණෙන්න, නැතහොත් දුරකථන හෝ WhatsApp හරහා අප හා සම්බන්ධ වන්න.",

    visa_opt_oman: "ඕමාන් වීසා මාරුව සුඛෝපභෝගී බස් රථයෙන් (දෙයිරා සිට)",
    visa_opt_schengen: "යුරෝපා ෂෙන්ගන් වීසා සම්පූර්ණ ලිපිගොනු සකස් කිරීමේ සේවාව",
    visa_opt_srilanka: "ශ්‍රී ලංකා විද්‍යුත් සංචාරක අනුමැතිය (ETA)",
    visa_opt_azerbaijan: "අසර්බයිජාන් නිල ASAN ඊ-වීසා (පැය 3 ක කඩිනම් සේවාව)",
    faq_search_placeholder: "ප්‍රශ්න සොයන්න (උදා: වීසා ලියකියවිලි, මුදල් ආපසු ගැනීම්, Tabby)...",

    // Career Section & Modal
    career_badge: "Star Plus Travel & Tourism LLC රැකියා අවස්ථා",
    career_hero_title: "සංචාරක සිහින <span class=\"gold-gradient-text\">දිගුකාලීන වෘත්තීන්</span> බවට පත් කරගන්න",
    career_hero_sub: "අපි නවීන ජාත්‍යන්තර සංචාර, සුඛෝපභෝගී නිවාඩු සහ වීසා විසඳුම් ගොඩනඟමු. ඩුබායි සහ කොළඹ පිහිටි අපගේ කණ්ඩායම් සමඟ එක්වන්න.",
    career_vacancies_badge: "ඇබෑර්තු",
    career_vacancies_title: "වත්මන් රැකියා අවස්ථා",
    career_vacancies_sub: "අවශ්‍යතා පරීක්ෂා කර ඔබගේ ජීව දත්ත පත්‍රිකාව අපගේ කලාපීය මානව සම්පත් අංශය වෙත යොමු කරන්න.",
    career_full_time: "පූර්ණ කාලීන",
    career_apply_now: "දැන් අයදුම් කරන්න",
    career_apply_to: "ඩුබායි හෝ ශ්‍රී ලංකාවට අයදුම් කරන්න",
    career_job1_dept: "නිවාඩු සැලසුම් සහ මෙහෙයුම්",
    career_job1_title: "සංචාරක උපදේශක",
    career_job2_dept: "VIP සහ සුඛෝපභෝගී සංචාර",
    career_job2_title: "ජ්‍යෙෂ්ඨ සංචාරක උපදේශක",
    career_job3_dept: "තානාපති සහ වීසා සේවා",
    career_job3_title: "වීසා සැකසුම් නිලධාරී",
    career_job4_dept: "භූමි මෙහෙයුම් සහ සැපයුම්",
    career_job4_title: "සංචාර සම්බන්ධීකාරක",
    career_job5_dept: "වාණිජ සහ B2B හවුල්කාරිත්ව",
    career_job5_title: "විකුණුම් නිලධාරී",
    career_modal_full_name: "ඔබගේ සම්පූර්ණ නම *",
    career_modal_email: "විද්‍යුත් තැපෑල *",
    career_modal_phone: "දුරකථන / WhatsApp *",
    career_modal_target_branch: "අයදුම් කරන ශාඛාව *",
    career_modal_exp: "අදාළ පළපුරුද්ද (වසර)",
    career_modal_portfolio: "LinkedIn හෝ Portfolio වෙබ් ලිපිනය",
    career_modal_resume_title: "ජීව දත්ත පත්‍රිකාව (CV) *",
    career_modal_resume_sub: "PDF, DOC, DOCX (උපරිම 5MB)",
    career_modal_dropzone_idle: "ඔබගේ CV ලේඛනය මෙතැනට Drag & Drop කරන්න හෝ ක්ලික් කරන්න",
    career_modal_cover_note: "කෙටි හැඳින්වීමක් / ආවරණ සටහනක්",
    career_modal_submit_btn: "අයදුම්පත යොමු කරන්න",
    career_modal_open_email: "Email App එකෙන් විවෘත කරන්න",
    career_routing_uae: "යොමු කෙරේ: info@starplustraveluae.com (එ.අ.එ. කාර්යාලය)",
    career_routing_sl: "යොමු කෙරේ: info@starplustravelsl.com (ශ්‍රී ලංකා කාර්යාලය)",

    // DMC Partner Form / Modal
    dmc_register_sub: "නිල ලියාපදිංචි අයදුම්පත",
    dmc_register_title: "ඔබගේ DMC / භූමි සේවා ලියාපදිංචි කරන්න",
    dmc_register_desc: "පහත රහස්‍ය පෝරමය පුරවන්න. අපගේ ගිවිසුම් අධ්‍යක්ෂවරයා WhatsApp සහ නිල විද්‍යුත් තැපෑල හරහා ඔබ හා සම්බන්ධ වනු ඇත.",
    dmc_company_name: "ලියාපදිංචි සමාගමේ නම *",
    dmc_primary_dest: "ප්‍රධාන ගමනාන්තය / රට *",
    dmc_contact_person: "බලයලත් සම්බන්ධීකාරක *",
    dmc_corp_email: "ආයතනික විද්‍යුත් තැපෑල *",
    dmc_phone: "දුරකථන / WhatsApp අංකය *",
    dmc_website: "සමාගම් වෙබ් අඩවිය / Profile ලිපිනය *",
    dmc_social: "සමාජ මාධ්‍ය / LinkedIn පිටුව",
    dmc_license: "සංචාරක බලපත්‍ර / ලියාපදිංචි අංකය *",
    dmc_hq_city: "ප්‍රධාන කාර්යාලය පිහිටි නගරය සහ රට *",
    dmc_fleet_notes: "වාහන ඇණිය, සේවා සහ කළඹ පිළිබඳ විස්තරය",
    dmc_certify_text: "අපගේ ආයතනය නීත්‍යානුකූලව ලියාපදිංචි සංචාරක සමාගමක් බවත්, සියලුම මෙහෙයුම් බලපත්‍ර සහ රක්ෂණාවරණ සතු බවත්, B2B ගිවිසුම්ගත වීම සඳහා Star Plus Travels ආයතනයට අපගේ සුදුසුකම් සත්‍යාපනය කිරීමට එකඟ වන බවත් සහතික කරමි.",
    dmc_checkbox_error: "⚠️ අයදුම්පත ඉදිරිපත් කිරීමට පෙර කරුණාකර මෙම කොටුව පරීක්ෂා කර සහතික කරන්න.",
    dmc_submit_btn: "DMC අයදුම්පත ඉදිරිපත් කරන්න",
    dmc_email_client_btn: "Email මගින් යවන්න"
  }
};

if (typeof window !== 'undefined') {
  window.translations = translations;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = translations;
}
