/**
 * Star Plus Travel & Tourism LLC - Destination Showcase & Spotlight Data Service
 * Interactive destination cards, country showcase circuits, and spotlight data.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const exports = factory();
    root.STARPLUS_COUNTRY_SHOWCASE = exports.COUNTRY_SHOWCASE_DATA;
    root.STARPLUS_POPULAR_DESTINATIONS = exports.POPULAR_DESTINATIONS_SLIDES;
    root.STARPLUS_SPOTLIGHT_DESTINATIONS = exports.SPOTLIGHT_DESTINATIONS_DATA;
  }
})(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const FALLBACK_UNIVERSAL = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
  const FALLBACK_AZERBAIJAN = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80';
  const FALLBACK_GEORGIA = 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=1200&q=80';

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
        priceLKR: 'LKR 190,000',
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
        priceLKR: 'LKR 165,000',
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
        priceLKR: 'LKR 170,000',
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
        priceLKR: 'LKR 195,000',
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
        priceLKR: 'LKR 180,000',
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
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80'
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
            image: 'https://images.unsplash.com/photo-1579618218290-24a26f63a758?auto=format&fit=crop&w=800&q=80',
            tag: '📍 Day 1: Baku Flame Towers & Seaside Boulevard',
            title: 'Baku Flame Towers & Boulevard'
          },
          {
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1579618218290-24a26f63a758?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1579618218290-24a26f63a758?auto=format&fit=crop&w=1200&q=80',
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
            image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80'
          },
          {
            name: 'Old Tbilisi Sulphur Baths',
            tagline: 'Abanotubani & Carved Balconies',
            category: '— HISTORIC THERMAL SPRINGS & STREETS',
            description: 'Wander through the domed brick baths of Abanotubani, climb to Narikala Fortress, and admire charming cliff-clinging 19th-century wooden carved balconies.',
            checkmarks: ['Natural Thermal Sulphur Bath Domes', 'Narikala Fortress Cable Car Climb', 'Historic Wooden Carved Balconies'],
            image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=800&q=80'
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
            image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=800&q=80',
            tag: '📍 Day 1: Old Tbilisi Colorful Balconies & Narikala',
            title: 'Old Tbilisi Colorful Balconies & Narikala'
          },
          {
            image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
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
        image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=1200&q=80',
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
        image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
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

  return {
    POPULAR_DESTINATIONS_SLIDES,
    COUNTRY_SHOWCASE_DATA,
    SPOTLIGHT_DESTINATIONS_DATA,
    FALLBACK_UNIVERSAL,
    FALLBACK_AZERBAIJAN,
    FALLBACK_GEORGIA
  };
});