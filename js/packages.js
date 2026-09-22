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

  return {
    PACKAGES,
    DESTINATION_COUNTRY_PACKAGES,
    FALLBACK_UNIVERSAL,
    FALLBACK_AZERBAIJAN,
    FALLBACK_GEORGIA
  };
});
