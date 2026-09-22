/**
 * Star Plus Travel & Tourism LLC - Package Data Service
 * Comprehensive registry of international tour packages and country-specific circuits.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const exports = factory();
    root.STARPLUS_PACKAGES = exports.PACKAGES;
    root.STARPLUS_COUNTRY_PACKAGES = exports.DESTINATION_COUNTRY_PACKAGES;
    root.getLocalizedPackage = exports.getLocalizedPackage;
    root.getLocalizedPackages = exports.getLocalizedPackages;
    root.getLocalizedCountryPackages = exports.getLocalizedCountryPackages;
    root.getActiveLanguage = exports.getActiveLanguage;
  }
})(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const FALLBACK_UNIVERSAL = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
  const FALLBACK_AZERBAIJAN = 'assets/packages/baku-flame-towers.jpg';
  const FALLBACK_GEORGIA = 'assets/packages/georgia-kazbegi.jpg';

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
      fallback: FALLBACK_UNIVERSAL,
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
      perks: ['5★ Luxury Hotel Stay', 'VIP Desert Safari & BBQ', 'Burj Khalifa Top Deck', 'Luxury Marina Yacht Cruise', 'Private Airport Transfers']
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
      fallback: FALLBACK_AZERBAIJAN,
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
      perks: ['Return Flights Included', '4★ Central Baku Hotel', 'Gabala Cable Car & Lake Tour', 'Gobustan Rock Art & Mud Volcanoes', 'English Speaking Guide']
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
      fallback: FALLBACK_GEORGIA,
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
      perks: ['Direct Flights Option', '4★ Boutique Hotel in Old Tbilisi', 'Kazbegi 4x4 Mountain Excursion', 'Traditional Georgian Feast & Wine', 'Roundtrip Transfers']
    },
    {
      id: 'sri-lanka-wildlife',
      title: 'Sri Lanka Wildlife Safari & Heritage Wonders',
      category: 'srilanka',
      categoryTag: 'SAFARI & WILDLIFE',
      destination: 'Yala, Sigiriya & Kandy, Sri Lanka',
      tagline: 'LEOPARDS, ELEPHANTS & ANCIENT CITADELS',
      editorialSummary: 'Explore the teardrop island from ancient 5th-century Sigiriya Rock Fortress to misty tea mountains of Nuwara Eliya, culminating in thrilling big-game leopard and elephant safaris in Yala National Park.',
      highlightTags: ['🐆 Yala Leopard Safari', '🏰 Sigiriya Rock Fortress', '☕ Ceylon Tea Highlands'],
      flag: '<i class="fa-solid fa-paw text-amber-400"></i>',
      duration: '7 Days / 6 Nights',
      rating: 4.9,
      reviews: 142,
      badge: 'Eco Safari',
      badgeColor: 'from-emerald-600 to-teal-500',
      image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
      fallback: FALLBACK_UNIVERSAL,
      alt: 'Ancient Sigiriya Lion Rock Fortress rising dramatically above lush emerald jungle canopies in Sri Lanka',
      galleryImages: [
        { image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80', title: 'Sigiriya Lion Rock Fortress' },
        { image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', title: 'Ella Demodara Nine Arch Bridge' },
        { image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80', title: 'Yala Big-Game Leopard Safari' },
        { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', title: 'Bentota & Galle Ocean Coastline' }
      ],
      priceAED: 2350,
      originalPriceAED: 2990,
      perks: ['Yala 4x4 Private Safari', 'Sigiriya & Dambulla Entries', 'Scenic Blue Train Journey', 'Deluxe Boutique Stays', 'Chauffeur Guide Throughout']
    },
    {
      id: 'maldives-all-inclusive',
      title: 'Maldives Overwater Luxury Lagoon Retreat',
      category: 'maldives',
      categoryTag: 'TROPICAL & HONEYMOON',
      destination: 'North Malé Atoll, Maldives',
      tagline: 'TURQUOISE LAGOONS & PRIVATE OVERWATER VILLAS',
      editorialSummary: 'Surrender to absolute luxury with private overwater bungalows perched atop crystal-clear turquoise lagoons. Enjoy all-inclusive gourmet dining, manta ray snorkeling expeditions, and breathtaking coral atoll sunsets.',
      highlightTags: ['🏝️ Overwater Villa', '🐠 Coral Reef Snorkeling', '🍽️ All-Inclusive Dining'],
      flag: '<i class="fa-solid fa-umbrella-beach text-amber-400"></i>',
      duration: '4 Days / 3 Nights',
      rating: 5.0,
      reviews: 215,
      badge: 'Luxury Honeymoon',
      badgeColor: 'from-rose-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
      fallback: FALLBACK_UNIVERSAL,
      alt: 'Luxury overwater bungalow villas over crystal clear turquoise ocean lagoon in the Maldives',
      galleryImages: [
        { image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80', title: 'Turquoise Lagoon & Overwater Villas' },
        { image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80', title: 'Private Island Beach Sanctuary' }
      ],
      priceAED: 3850,
      originalPriceAED: 4900,
      priceLKR: 'LKR 335,000',
      perks: ['Speedboat / Seaplane Transfers', 'Overwater Villa with Ocean Access', 'All-Inclusive Dine-Around Pass', 'Complimentary Snorkeling Equipment', 'Sunset Dolphin Cruise Included']
    }
  ];

  const DESTINATION_COUNTRY_PACKAGES = {
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
          fallback: FALLBACK_AZERBAIJAN,
          priceAED: 1950
        },
        {
          id: 'azerbaijan-silkroad-6d5n',
          title: '6D / 5N Azerbaijan Silk Road & Sheki Tour',
          badge: 'Silk Road Explorer',
          duration: '6 Days / 5 Nights',
          stay: '4-Star Hotels in Baku, Gabala & Sheki',
          image: 'https://images.unsplash.com/photo-1621539205985-64585141ef30?auto=format&fit=crop&w=1200&q=80',
          fallback: FALLBACK_AZERBAIJAN,
          priceAED: 2390
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
          fallback: FALLBACK_GEORGIA,
          priceAED: 1890
        },
        {
          id: 'georgia-wine-mountain-6d5n',
          title: '6D / 5N Georgia Wine & Mountain Splendor',
          badge: 'Wine & Romance',
          duration: '6 Days / 5 Nights',
          stay: '4-Star Hotels in Tbilisi & Kakheti Wine Valley',
          image: 'assets/packages/georgia-kazbegi.jpg',
          fallback: FALLBACK_GEORGIA,
          priceAED: 2290
        }
      ]
    }
  };

  const PACKAGES_LOCALIZED_SI = {
    'dubai-luxury': {
      title: 'ඩුබායි සහ කාන්තාර සෆාරි සුඛෝපභෝගී චාරිකාව',
      destination: 'ඩුබායි, එක්සත් අරාබි එමීර් රාජ්‍යය',
      duration: 'දින 5 / රාත්‍රී 4',
      badge: 'වැඩිම ඉල්ලුමක් ඇති',
      tagline: 'ආකර්ෂණීය නගර සිරි, සුඛෝපභෝගී කාන්තාර සෆාරි සහ මැරීනා යාත්‍රා චාරිකා',
      editorialSummary: 'ඩුබායි හි අති නවීන තරු 5 හෝටල් නවාතැන්, රතු වැලි කඳු මත VIP 4x4 කාන්තාර සෆාරි සහ බාබකියු රාත්‍රී භෝජනය, මැරීනා යාත්‍රා චාරිකා සහ බර්ජ් කලීෆා නිරීක්ෂණාගාර ප්‍රවේශය සහිත සුඛෝපභෝගී අත්දැකීම.',
      perks: ['තරු 5 සුඛෝපභෝගී හෝටල් නවාතැන්', 'VIP කාන්තාර සෆාරි සහ BBQ රාත්‍රී භෝජනය', 'බර්ජ් කලීෆා ඉහළ මාල ප්‍රවේශය', 'ඩුබායි මැරීනා යාත්‍රා චාරිකාව', 'පෞද්ගලික ගුවන් තොටුපළ ප්‍රවාහනය']
    },
    'baku-azerbaijan': {
      title: 'බාකු සහ අසර්බයිජානයේ කොකේසස් ආශ්චර්යය',
      destination: 'බාකු සහ ගබාලා, අසර්බයිජානය',
      duration: 'දින 5 / රාත්‍රී 4',
      badge: 'ප්‍රමුඛ',
      tagline: 'ගිනිදැල් දේශය, කැස්පියන් මුහුදු සුළඟ සහ ඓතිහාසික උරුමය',
      editorialSummary: 'යුරෝපය සහ ආසියාව එක්වන බාකු අගනුවර සංචාරය කරන්න. යුනෙස්කෝ පැරණි නගරය, නූතන ගිනිදැල් කුළුණු සහ ගබාලා හි මනරම් කඳුකර අත්දැකීම විඳගන්න.',
      perks: ['තරු 4/5 හෝටල් නවාතැන්', 'බාකු නගර චාරිකාව සහ ගිනිදැල් කුළුණු', 'ගබාලා කේබල් කාර් සහ ඇල්පයින් චාරිකාව', 'ගොබුස්තාන් මඩ ගිනිකඳු නැරඹීම', 'පෞද්ගලික වායුසමනය කළ ප්‍රවාහනය']
    },
    'georgia-kazbegi': {
      title: 'සුන්දර ජෝර්ජියාව: ටිබිලිසි, කස්බෙගි සහ ගුඩවුරි',
      destination: 'ටිබිලිසි සහ කොකේසස්, ජෝර්ජියාව',
      duration: 'දින 6 / රාත්‍රී 5',
      badge: 'ශීත ඍතු විශේෂ',
      tagline: 'පෞරාණික දේවස්ථාන, හිමෙන් වැසුණු කොකේසස් කඳු සහ ස්වභාවික සුන්දරත්වය',
      editorialSummary: 'ටිබිලිසි හි ඓතිහාසික මංමාවත්, මීටර් 5,047 ක් උසැති කස්බෙගි කඳු මුදුන, ගර්ගෙටි ත්‍රිත්ව දේවස්ථානය සහ ගුඩවුරි හිම ක්‍රීඩා නිම්නය ගවේෂණය කරන්න.',
      perks: ['ටිබිලිසි පැරණි නගරයේ තරු 4 බුටික් හෝටල්', 'කස්බෙගි සහ ගර්ගෙටි 4x4 ජීප් චාරිකාව', 'ගුඩවුරි ඇල්පයින් ස්කී නිම්න නැරඹීම', 'කාකෙටි වයින් නිම්න සංචාරය', 'පෞද්ගලික රියදුරු සහ මගපෙන්වීම්']
    },
    'sri-lanka-wildlife': {
      title: 'සුන්දර ශ්‍රී ලංකාව: තේ වතු, වනජීවී සෆාරි සහ වෙරළ',
      destination: 'කොළඹ, මහනුවර සහ බෙන්තොට',
      duration: 'දින 6 / රාත්‍රී 5',
      badge: 'ජනප්‍රියම',
      tagline: 'තේ වතු, යුනෙස්කෝ උරුම, වනජීවී සෆාරි සහ රන්වන් වෙරළ',
      editorialSummary: 'මනරම් ශ්‍රී ලංකාව ගවේෂණය කරන්න: සීගිරිය පර්වත බලකොටුව, මහනුවර ශ්‍රී දළදා මාළිගාව, ඇල්ල නිල් දුම්රිය චාරිකාව සහ බෙන්තොට රන්වන් වෙරළ තීරය.',
      perks: ['තරු 4/5 තෝරාගත් හෝටල් නවාතැන්', 'සීගිරිය සහ දඹුල්ල ගල් ලෙන් විහාර නැරඹීම', 'මහනුවර සංස්කෘතික නර්තන හා දළදා වන්දනාව', 'යාල වනජීවී සෆාරි චාරිකාව', 'පෞද්ගලික වායුසමනය කළ වාහනයක් සමඟ රියදුරු සහාය']
    },
    'maldives-all-inclusive': {
      title: 'මාලදිවයින දියමත විලා සුඛෝපභෝගී නිවාඩුව',
      destination: 'උතුරු මාලේ අතොළුව, මාලදිවයින',
      duration: 'දින 4 / රාත්‍රී 3',
      badge: 'රොමෑන්ටික් නිවාඩුවක්',
      tagline: 'දියමත විලා, නිල්වන් කලපු සහ පෞද්ගලික දූපත් සුඛෝපභෝගී බව',
      editorialSummary: 'සුඛෝපභෝගී දියමත විලා නවාතැන්, සියලු ආහාරපාන ඇතුළත් කෑම බීම, ස්නෝකර්ලින් සහ කෲස් චාරිකා සමඟ අමතක නොවන මාලදිවයින් නිවාඩුවක්.',
      perks: ['දියමත පෞද්ගලික පූල් විලා නවාතැන්', 'සියලු ආහාරපාන සහ බීම වර්ග ඇතුළත් (All-Inclusive)', 'ස්පීඩ්බෝට් හෝ මුහුදු ගුවන් යානා ප්‍රවාහනය', 'කොරල් පර ආශ්‍රිත ස්නෝකර්ලින් සහ ජල ක්‍රීඩා', 'හිරු බැසයන සැන්දෑ කෲස් චාරිකාව']
    },
    'bali-luxury-nature': {
      title: 'ස්වර්ගීය බාලි චාරිකාව: උබුඩ් සහ සෙමින්‍යක්',
      destination: 'බාලි, ඉන්දුනීසියාව',
      duration: 'දින 7 / රාත්‍රී 6',
      badge: 'වැඩිම ඉල්ලුමක් ඇති',
      tagline: 'නිවර්තන වනපෙත්, පූජනීය කෝවිල් සහ වෙරළාශ්‍රිත විවේකය',
      editorialSummary: 'උබුඩ් හි නිවර්තන වනගත සුන්දරත්වය, තේගල්ලාං පඩිපෙළ කුඹුරු, තනාහ් ලොට් මුහුදු කෝවිල සහ සෙමින්‍යක් හි වෙරළාශ්‍රිත සුඛෝපභෝගී නිවාඩුව.',
      perks: ['උබුඩ් පෞද්ගලික පූල් විලා සහ සෙමින්‍යක් රිසෝට් නවාතැන්', 'උබුඩ් ඔන්චිල්ලාව සහ කුඹුරු යාය නැරඹීම', 'තනාහ් ලොට් සහ උළුවතු කෝවිල් සංචාරය', 'බාලි සම්බාහන සහ ස්පා අත්දැකීම්', 'පෞද්ගලික රියදුරු සහිත සම්පූර්ණ ප්‍රවාහනය']
    }
  };

  const COUNTRY_PACKAGES_LOCALIZED_SI = {
    srilanka: {
      country: 'ශ්‍රී ලංකාව: සීගිරිය, නුවරඑළිය සහ යාල',
      badge: 'යුනෙස්කෝ ලෝක උරුම සහ ස්වභාව සෞන්දර්යය',
      season: 'වසර පුරාම (නොවැම්බර් – අප්‍රේල් / මැයි – සැප්තැම්බර්)',
      packages: [
        {
          id: 'sl-heritage-5d4n',
          title: 'දින 5 / රාත්‍රී 4 ශ්‍රී ලංකා සංස්කෘතික සහ කඳුකර චාරිකාව',
          badge: 'සංස්කෘතික උරුමය',
          duration: 'දින 5 / රාත්‍රී 4',
          stay: 'මහනුවර සහ නුවරඑළිය තරු 4 හෝටල්'
        },
        {
          id: 'sl-wildlife-beach-6d5n',
          title: 'දින 6 / රාත්‍රී 5 යාල වනජීවී සහ දකුණු වෙරළ චාරිකාව',
          badge: 'වනජීවී සහ වෙරළ',
          duration: 'දින 6 / රාත්‍රී 5',
          stay: 'යාල සෆාරි ලොජ් සහ බෙන්තොට වෙරළ රිසෝට්'
        }
      ]
    },
    azerbaijan: {
      country: 'බාකු සහ කොකේසස්, අසර්බයිජානය',
      badge: 'ගිනිදැල් දේශය සහ සිල්ක් මාවත',
      season: 'අප්‍රේල් – ජූනි සහ සැප්තැම්බර් – නොවැම්බර්',
      packages: [
        {
          id: 'baku-shahdag-5d4n',
          title: 'දින 5 / රාත්‍රී 4 බාකු සහ ශහ්ඩැග් හිම කඳුකර චාරිකාව',
          badge: 'නගර සහ ඇල්පයින් සුසංයෝගය',
          duration: 'දින 5 / රාත්‍රී 4',
          stay: 'බාකු තරු 4 හෝටලය + ශහ්ඩැග් මවුන්ටන් රිසෝට්'
        },
        {
          id: 'azerbaijan-silkroad-6d5n',
          title: 'දින 6 / රාත්‍රී 5 අසර්බයිජාන් සිල්ක් මාවත සහ ෂෙකි චාරිකාව',
          badge: 'සිල්ක් මාවත ගවේෂණය',
          duration: 'දින 6 / රාත්‍රී 5',
          stay: 'බාකු, ගබාලා සහ ෂෙකි හි තරු 4 හෝටල්'
        }
      ]
    },
    georgia: {
      country: 'ටිබිලිසි සහ කස්බෙගි, ජෝර්ජියාව',
      badge: 'කොකේසස් ආශ්චර්යය සහ ඓතිහාසික උරුමය',
      season: 'මැයි – ඔක්තෝබර් / ශීත ඍතු හිම ක්‍රීඩා',
      packages: [
        {
          id: 'georgia-kazbegi-5d4n',
          title: 'දින 5 / රාත්‍රී 4 සුන්දර ජෝර්ජියා සහ කස්බෙගි ඇල්පයින් චාරිකාව',
          badge: 'කොකේසස් කඳු මුදුන්',
          duration: 'දින 5 / රාත්‍රී 4',
          stay: 'පැරණි ටිබිලිසි තරු 4 බුටික් හෝටලය සහ ගුඩවුරි රිසෝට්'
        },
        {
          id: 'georgia-wine-mountain-6d5n',
          title: 'දින 6 / රාත්‍රී 5 ජෝර්ජියා වයින් නිම්න සහ කඳුකර සුන්දරත්වය',
          badge: 'වයින් සහ රොමෑන්තික බව',
          duration: 'දින 6 / රාත්‍රී 5',
          stay: 'ටිබිලිසි සහ කාකෙටි වයින් නිම්නයේ තරු 4 හෝටල්'
        }
      ]
    }
  };

  function getActiveLanguage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const lang = localStorage.getItem('site_lang') || localStorage.getItem('pref_lang') || localStorage.getItem('starplus_lang');
        if (lang === 'si' || lang === 'en') return lang;
      }
    } catch (e) {}
    return 'en';
  }

  function getLocalizedPackage(pkg, lang) {
    if (!pkg) return pkg;
    const currentLang = lang || getActiveLanguage();
    if (currentLang !== 'si') return pkg;
    const siData = PACKAGES_LOCALIZED_SI[pkg.id];
    if (!siData) return pkg;
    return Object.assign({}, pkg, {
      title: siData.title || pkg.title,
      destination: siData.destination || pkg.destination,
      duration: siData.duration || pkg.duration,
      badge: siData.badge || pkg.badge,
      tagline: siData.tagline || pkg.tagline,
      editorialSummary: siData.editorialSummary || pkg.editorialSummary,
      perks: siData.perks || pkg.perks
    });
  }

  function getLocalizedPackages(packagesList, lang) {
    const list = packagesList || PACKAGES;
    const currentLang = lang || getActiveLanguage();
    return list.map(pkg => getLocalizedPackage(pkg, currentLang));
  }

  function getLocalizedCountryPackages(countryKey, lang) {
    const currentLang = lang || getActiveLanguage();
    const data = DESTINATION_COUNTRY_PACKAGES[countryKey];
    if (!data) return null;
    if (currentLang !== 'si') return data;
    const siData = COUNTRY_PACKAGES_LOCALIZED_SI[countryKey];
    if (!siData) return data;

    const localizedPackages = (data.packages || []).map(p => {
      const siPkg = (siData.packages || []).find(sp => sp.id === p.id);
      if (!siPkg) return p;
      return Object.assign({}, p, {
        title: siPkg.title || p.title,
        badge: siPkg.badge || p.badge,
        duration: siPkg.duration || p.duration,
        stay: siPkg.stay || p.stay
      });
    });

    return Object.assign({}, data, {
      country: siData.country || data.country,
      badge: siData.badge || data.badge,
      season: siData.season || data.season,
      packages: localizedPackages
    });
  }

  return {
    PACKAGES,
    DESTINATION_COUNTRY_PACKAGES,
    getLocalizedPackage,
    getLocalizedPackages,
    getLocalizedCountryPackages,
    getActiveLanguage,
    FALLBACK_UNIVERSAL,
    FALLBACK_AZERBAIJAN,
    FALLBACK_GEORGIA
  };
});
