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

// Comprehensive Tour Packages Data
const PACKAGES = [
  {
    id: 'dubai-luxury',
    title: 'Ultimate Dubai & Desert Safari Extravaganza',
    category: 'dubai',
    destination: 'Dubai, UAE',
    flag: '🇦🇪',
    duration: '5 Days / 4 Nights',
    rating: 4.9,
    reviews: 184,
    badge: 'Bestseller',
    badgeColor: 'from-amber-500 to-yellow-500',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    alt: 'Dubai Skyline and Burj Khalifa',
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
    flag: '🇱🇰',
    duration: '6 Days / 5 Nights',
    rating: 5.0,
    reviews: 142,
    badge: 'Trending',
    badgeColor: 'from-emerald-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
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
    flag: '🇦🇿',
    duration: '5 Days / 4 Nights',
    rating: 4.8,
    reviews: 96,
    badge: 'Popular',
    badgeColor: 'from-blue-600 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    alt: 'Baku Flame Towers',
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
    flag: '🇬🇪',
    duration: '6 Days / 5 Nights',
    rating: 4.9,
    reviews: 118,
    badge: 'Winter Special',
    badgeColor: 'from-indigo-500 to-purple-500',
    image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80',
    alt: 'Kazbegi Mountain Church Georgia',
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
    flag: '🇲🇻',
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
    flag: '🇮🇩',
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
    flag: '🇹🇷',
    duration: '6 Days / 5 Nights',
    rating: 4.9,
    reviews: 138,
    badge: 'Bucket List',
    badgeColor: 'from-purple-600 to-pink-600',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
    alt: 'Cappadocia Hot Air Balloons',
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
    flag: '🇸🇦',
    rating: 5.0,
    reviews: 245,
    badge: 'Spiritual Peace',
    badgeColor: 'from-amber-600 to-yellow-600',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    alt: 'Makkah Clock Tower and Holy Mosque',
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

// Testimonials Data
const TESTIMONIALS = [
  {
    name: 'Ahmad Al-Mansoor',
    role: 'Corporate Executive, Dubai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    trip: 'Maldives Overwater Luxury Tour',
    flag: '🇦🇪',
    stars: 5,
    date: 'February 2026',
    comment: 'Star Plus Travels managed everything seamlessly from our private flights to the overwater villa in Maldives. Their team in Deira provided 24/7 WhatsApp assistance throughout. Will book our winter getaway with them again!'
  },
  {
    name: 'Samantha & David Wright',
    role: 'Travel Bloggers, London UK',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    trip: 'Sri Lanka Wildlife & Scenic Train',
    flag: '🇬🇧',
    stars: 5,
    date: 'January 2026',
    comment: 'The 6-day Sri Lanka tour was beyond perfection! The private chauffeur was courteous, the hotels were 5-star standard, and the train ride through the Nuwara Eliya tea hills was unforgettable. Star Plus Travels is top tier.'
  },
  {
    name: 'Mohamed Farook & Family',
    role: 'Business Owner, Colombo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    trip: 'Georgia Caucasus & Kazbegi Tour',
    flag: '🇱🇰',
    stars: 5,
    date: 'December 2025',
    comment: 'Our family of five enjoyed snow in Kazbegi and delicious cuisine in Tbilisi. Visa approvals were processed in just 48 hours without any hassle. Exceptional service and honest transparent pricing.'
  },
  {
    name: 'Fatima Zahra & Sisters',
    role: 'Educator, Abu Dhabi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    trip: 'Baku & Gabala Wonders',
    flag: '🇦🇪',
    stars: 5,
    date: 'November 2025',
    comment: 'Azerbaijan was stunning! Star Plus Travels customized our itinerary to include Gabala cable cars and historical Baku. Their Fly Now Pay Later option with Tabby was super convenient!'
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
function renderPackages(filteredList = PACKAGES) {
  const grid = document.getElementById('packagesGrid');
  const countElem = document.getElementById('packagesCount');
  if (!grid) return;

  if (countElem) {
    countElem.textContent = `Showing ${filteredList.length} hand-crafted itineraries`;
  }

  if (filteredList.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-20 h-20 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-amber-400 text-3xl mb-4">
          <i class="fa-solid fa-compass"></i>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">No matching packages found</h3>
        <p class="text-slate-400 text-sm max-w-md mx-auto mb-6">Try searching for other destinations like Dubai, Sri Lanka, Baku, Georgia, Maldives, or Bali.</p>
        <button onclick="resetFilters()" class="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20">
          View All Packages
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredList.map(pkg => {
    const formattedPrice = formatPrice(pkg.priceAED);
    const formattedOriginal = formatPrice(pkg.originalPriceAED);
    const monthlyInstallment = formatPrice(Math.round(pkg.priceAED / 4));

    return `
      <div class="package-card glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col relative group border border-slate-200 dark:border-slate-700/50">
        <!-- Image & Badges -->
        <div class="img-container relative h-56 overflow-hidden bg-slate-900">
          <img src="${pkg.image}" alt="${pkg.alt}" class="w-full h-full object-cover" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          
          <!-- Category & Bestseller Badge -->
          <div class="absolute top-3 left-3 flex flex-wrap gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${pkg.badgeColor} shadow-md">
              ${pkg.badge}
            </span>
          </div>

          <!-- Duration Pill -->
          <div class="absolute bottom-3 left-3 flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-xs font-semibold text-slate-200 border border-slate-700/50">
            <i class="fa-regular fa-clock text-amber-400"></i>
            <span>${pkg.duration}</span>
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
              <span class="uppercase tracking-wider font-semibold">${pkg.destination}</span>
            </div>

            <!-- Title -->
            <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-snug mb-3">
              ${pkg.title}
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
            <div class="flex items-end justify-between mb-4">
              <div>
                <span class="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Starting from</span>
                <div class="flex items-baseline space-x-2">
                  <span class="text-2xl font-black text-amber-600 dark:text-amber-400 font-heading">${formattedPrice}</span>
                  <span class="text-xs text-slate-400 dark:text-slate-500 line-through">${formattedOriginal}</span>
                </div>
                <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                  or 4x ${monthlyInstallment}/mo with Tabby
                </span>
              </div>
              <span class="text-[11px] text-slate-600 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800/60 px-2 py-1 rounded-md">per person</span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button onclick="openItineraryModal('${pkg.id}')" class="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 shadow-sm">
                <i class="fa-solid fa-list-ul text-slate-500 dark:text-slate-400"></i>
                <span>Itinerary</span>
              </button>
              <button onclick="openBookingModal('${pkg.id}')" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold transition-all text-center shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-1.5">
                <span>Book Now</span>
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
  document.getElementById('modalPkgDestination').textContent = `${pkg.flag} ${pkg.destination} • ${pkg.duration}`;
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
  document.getElementById('itineraryModalMeta').textContent = `${pkg.flag} ${pkg.destination} • ${pkg.duration} • Rating: ★ ${pkg.rating}`;
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
        <span class="absolute -bottom-2 -right-2 text-2xl">${t.flag}</span>
      </div>

      <!-- Quote Content -->
      <div class="flex-1">
        <div class="flex items-center space-x-1 text-amber-500 text-sm mb-3">
          ${Array(t.stars).fill('<i class="fa-solid fa-star"></i>').join('')}
          <span class="text-xs text-slate-500 dark:text-slate-400 font-semibold ml-2">Verified Traveler • ${t.date}</span>
        </div>
        <p class="text-base md:text-lg text-slate-700 dark:text-slate-200 italic leading-relaxed mb-4">
          "${t.comment}"
        </p>
        <div>
          <h4 class="text-base font-bold text-slate-900 dark:text-white">${t.name}</h4>
          <p class="text-xs text-amber-600 dark:text-amber-400 font-medium">${t.role} — <span class="text-slate-500 dark:text-slate-400">${t.trip}</span></p>
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
  menu.classList.toggle('hidden');
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
      btn.setAttribute('title', 'Theme: Dark (Manual) • Click to cycle to Auto');
    } else {
      btn.setAttribute('title', 'Theme: Light (Manual) • Click to cycle to Dark');
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

  // Update theme toggle text labels in mobile menu
  document.querySelectorAll('.theme-toggle-label').forEach(label => {
    if (mode === 'system') {
      label.textContent = `Auto / System (${isDark ? 'Dark' : 'Light'})`;
    } else if (mode === 'dark') {
      label.textContent = 'Dark Mode';
    } else {
      label.textContent = 'Light Mode';
    }
  });

  // Update brand logos and images between white text (dark mode) and dark text (light mode)
  document.querySelectorAll('img[data-dark-src]').forEach(img => {
    const darkSrc = img.getAttribute('data-dark-src');
    const lightSrc = img.getAttribute('data-light-src');
    img.src = isDark ? darkSrc : lightSrc;
  });

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
    // If currently on system auto, switch to the opposite of current system theme
    nextMode = sysDark ? 'light' : 'dark';
  } else if (currentMode === 'light') {
    nextMode = sysDark ? 'dark' : 'system';
  } else if (currentMode === 'dark') {
    nextMode = sysDark ? 'system' : 'light';
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

// Setup Event Listeners on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize theme strictly from system preference or explicit manual mode
  applyTheme(getThemeMode(), false);

  // 2. Prevent refresh jump to FAQ or anchor hashes (always default cleanly to top of page)
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
});

/* ==========================================================================
   Simple & Elegant Luxury Preloader Controller
   ========================================================================== */
(function setupLuxuryPreloader() {
  function dismissPreloader() {
    const preloader = document.getElementById('sitePreloader');
    if (!preloader || preloader.classList.contains('fade-out')) return;

    const start = window.__preloaderStartTime || Date.now();
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, 600 - elapsed);

    setTimeout(() => {
      preloader.classList.add('fade-out');
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
    setTimeout(dismissPreloader, 1500);
  }
})();
