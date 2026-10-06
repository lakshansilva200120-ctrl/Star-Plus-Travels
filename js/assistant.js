/**
 * Star Plus Travels - AI Assistant ("Starplus Concierge")
 * Live Conversational Chat Engine with Knowledge Grounding & WhatsApp Handoff
 * TAMM-style floating orb launcher, bilingual support (English & Sinhala),
 * session memory, typing indicator, and deep-link package inquiry generator.
 */

(function () {
  'use strict';

  // Prevent duplicate execution
  if (window.StarplusAssistantInitialized) return;
  window.StarplusAssistantInitialized = true;

  // Configuration & Grounded Knowledge Base
  const CONFIG = {
    brand: "Star Plus Travels & Tourism LLC",
    locations: "Dubai, United Arab Emirates & Colombo, Sri Lanka",
    phone: "971527582293",
    phoneFormatted: "+971 52 758 2293",
    landline: "+971 4 227 0005",
    email: "info@starplustravels.com",
    website: "starplustravels.com",
    tabby: "0% interest Tabby installments (split in 4)",
    currencies: "AED & USD"
  };

  const I18N = {
    en: {
      launcherText: "Starplus Assistant",
      title: "Starplus Concierge",
      subtitle: "Luxury Travel & Visa Advisor",
      status: "Online • Live Assistance",
      welcomeGreeting: "Hello! Welcome to Star Plus Travels. I am your personal concierge assistant. How may I assist your travel plans or UAE visa requirements today?",
      chips: [
        { label: "Sri Lanka 6-Day Tour", query: "Tell me about the Sri Lanka 6-Day Tour" },
        { label: "UAE Visa Requirements", query: "What are the UAE Visa requirements and pricing?" },
        { label: "Custom Itinerary", query: "Can you design a custom luxury itinerary?" },
        { label: "Flight & Airport Transfers", query: "Do you arrange flights and private luxury transfers?" }
      ],
      placeholder: "Ask about packages, visas, custom trips...",
      send: "Send",
      waHandoffBtn: "Continue on WhatsApp",
      waPreMessage: "Hi Starplus Travels, I was chatting with Starplus Concierge about: ",
      typicalResponsePrefix: "",
      typingLabel: "Starplus Assistant is typing..."
    },
    si: {
      launcherText: "Starplus සහයක",
      title: "Starplus සහයක",
      subtitle: "සුඛෝපභෝගී සංචාරක සහ වීසා උපදේශක",
      status: "සක්‍රියයි • ක්ෂණික සේවාව",
      welcomeGreeting: "ආයුබෝවන්! Star Plus Travels වෙත සාදරයෙන් පිළිගනිමු. මම ඔබගේ පුද්ගලික සංචාරක සහයකයා වෙමි. අද ඔබගේ නිවාඩු සැලසුම් හෝ එක්සත් අරාබි එමීර් (UAE) වීසා සේවාවන් සඳහා මට ඔබට කෙසේ සහය විය හැකිද?",
      chips: [
        { label: "ශ්‍රී ලංකා දින 6 සංචාරය", query: "ශ්‍රී ලංකා දින 6 සංචාරක පැකේජය ගැන විස්තර කියන්න" },
        { label: "UAE වීසා අවශ්‍යතා", query: "එක්සත් අරාබි එමීර් (UAE) වීසා ලබාගැනීමට අවශ්‍ය දෑ සහ ගාස්තු මොනවාද?" },
        { label: "සුවිශේෂී ගමන් සැලැස්මක්", query: "මට අවශ්‍ය පරිදි සුවිශේෂී සංචාරක සැලසුමක් සකස් කරගත හැකිද?" },
        { label: "ගුවන් ප්‍රවේශපත්‍ර සහ ප්‍රවාහන", query: "ගුවන් ප්‍රවේශපත්‍ර සහ සුඛෝපභෝගී ප්‍රවාහන පහසුකම් සපයනවාද?" }
      ],
      placeholder: "පැකේජ, වීසා හෝ සංචාරක තොරතුරු අසන්න...",
      send: "යවන්න",
      waHandoffBtn: "WhatsApp ඔස්සේ ඉදිරියට යන්න",
      waPreMessage: "හෙලෝ Starplus Travels, මම Starplus සහයකයා සමග සාකච්ඡා කළෙමි: ",
      typicalResponsePrefix: "",
      typingLabel: "Starplus සහයක පිළිතුර සකසමින් සිටී..."
    }
  };

  // Helper to detect current site language
  function getActiveLanguage() {
    if (typeof window.getActiveSiteLanguage === 'function') {
      return window.getActiveSiteLanguage();
    }
    const path = window.location.pathname.toLowerCase();
    const htmlLang = (document.documentElement.lang || '').toLowerCase();
    const storedLang = (localStorage.getItem('lang') || localStorage.getItem('language') || localStorage.getItem('starplus_lang') || localStorage.getItem('site_lang') || '').toLowerCase();
    const hasSiClass = document.body && (document.body.classList.contains('lang-si') || document.documentElement.classList.contains('si'));

    if (path.includes('/si') || path.includes('/sinhala') || htmlLang.startsWith('si') || storedLang.startsWith('si') || hasSiClass) {
      return 'si';
    }
    return 'en';
  }

  // Detect whether a query string contains Sinhala characters
  function isSinhalaQuery(text) {
    return /[\u0D80-\u0DFF]/.test(text);
  }

  // State Management
  let sessionHistory = [];
  let isPanelOpen = false;
  let isGenerating = false;

  // Grounded Knowledge Base Queries & Intelligent Intent Matcher
  function generateGroundedResponse(rawQuery, targetLang) {
    const q = rawQuery.toLowerCase();
    const lang = targetLang || (isSinhalaQuery(rawQuery) ? 'si' : getActiveLanguage());

    // 1. Sri Lanka 6-Day Tour / General Sri Lanka Tours
    if (q.includes('sri lanka') || q.includes('6-day') || q.includes('6 day') || q.includes('lanka') || q.includes('ශ්‍රී ලංකා') || q.includes('සංචාර')) {
      if (lang === 'si') {
        return {
          text: `අපගේ වඩාත් ජනප්‍රිය **දින 6 / රාත්‍රී 5 "Wonders of Sri Lanka"** සුඛෝපභෝගී සංචාරක පැකේජය තුළ සීගිරිය පර්වත බලකොටුව, මහනුවර ශ්‍රී දළදා මාළිගාව, ඇල්ල නයින් ආච් පාලම සහ මනරම් නිල් දුම්රිය චාරිකාව, මෙන්ම බෙන්තොට වෙරළ තීරය ඇතුළත් වේ.\n\n• **ඇතුළත් දෑ:** තරු 4/5 සුඛෝපභෝගී හෝටල් නවාතැන්, දිනපතා උදෑසන ආහාර, කැපවූ පුද්ගලික ඉංග්‍රීසි/සිංහල කතාකරන රියදුරු සහ AC වාහනය, සියලුම දේශීය බදු.\n• **මිල:** එක් අයෙකුට AED 2,150 සිට (Tabby මගින් 0% පොලියට කොටස් 4කින් ගෙවිය හැක).\n\nඔබගේ සංචාරක දිනයන්ට අනුව ගැලපෙන සැලැස්මක් සකසා ගැනීමට කැමතිද?`,
          actionLabel: "ශ්‍රී ලංකා පැකේජ නරඹන්න",
          actionUrl: "/packages.html",
          handoffTopic: "Sri Lanka 6-Day Tour Details & Quotation"
        };
      }
      return {
        text: `Our premier **6-Day / 5-Night "Wonders of Sri Lanka"** curated private tour covers the iconic Sigiriya Rock Citadel, the Sacred Temple of the Tooth in Kandy, the scenic Ella tea mountain blue train journey, and golden beaches in Bentota.\n\n• **Includes:** Hand-picked 4/5-star boutique resort stays, daily buffet breakfast, private chauffeur-guide with dedicated luxury AC vehicle, entrance clearances, and airport transfers.\n• **Pricing:** From AED 2,150 per person (Tabby 0% split-in-4 installment plans available).\n\nWould you like me to share the day-by-day itinerary or customize it for your travel dates?`,
        actionLabel: "View All Sri Lanka Packages",
        actionUrl: "/packages.html",
        handoffTopic: "Sri Lanka 6-Day Tour Details & Quotation"
      };
    }

    // 2. UAE Visa Services & Requirements
    if (q.includes('visa') || q.includes('uae') || q.includes('dubai') || q.includes('entry') || q.includes('30-day') || q.includes('60-day') || q.includes('වීසා')) {
      if (lang === 'si') {
        return {
          text: `Star Plus Travels මගින් එක්සත් අරාබි එමීර් (UAE) සංචාරක සහ විවේක වීසා කඩිනමින් ලබාදේ:\n\n• **වීසා වර්ග:** දින 30 සහ දින 60 (තනි සහ බහුවිධ ඇතුළුවීම් / Single & Multiple Entry).\n• **සැකසුම් කාලය:** පැය 24 සිට 48 දක්වා අධිවේගී අනුමැතිය (Express processing available).\n• **අවශ්‍ය ලියකියවිලි:** විදේශ ගමන් බලපත්‍රයේ පැහැදිලි පිටපතක් (මාස 6ක් වලංගු) සහ ඡායාරූපයක් පමණි.\n• **ගාස්තු:** දින 30 වීසා AED 330 සිට, දින 60 වීසා AED 590 සිට.\n\nඅපගේ වීසා කණ්ඩායම සමඟ දැන්ම අයදුම් කිරීමට සූදානම්ද?`,
          actionLabel: "වීසා සේවාවන් පරීක්ෂා කරන්න",
          actionUrl: "/visa-services.html",
          handoffTopic: "UAE Visit Visa Application (30/60 Days)"
        };
      }
      return {
        text: `We issue official UAE Tourist & Visit Visas with guaranteed rapid processing and zero hidden charges:\n\n• **Available Options:** 30-Day Single/Multiple Entry & 60-Day Single/Multiple Entry.\n• **Turnaround Time:** 24–48 Hours standard approval (Express same-day available upon request).\n• **Required Documents:** Passport copy (min. 6 months validity) and passport-size photograph with white background.\n• **Rates:** 30-Day from AED 330, 60-Day from AED 590 (includes mandatory COVID health cover).\n\nWould you like to initiate your visa application right away?`,
        actionLabel: "Explore UAE Visa Services",
        actionUrl: "/visa-services.html",
        handoffTopic: "UAE Visit Visa Application (30/60 Days)"
      };
    }

    // 3. Custom Itinerary Planner & Bespoke Journeys
    if (q.includes('custom') || q.includes('itinerary') || q.includes('plan') || q.includes('tailor') || q.includes('bespoke') || q.includes('සැලසුම්') || q.includes('සුවිශේෂී')) {
      if (lang === 'si') {
        return {
          text: `අපගේ විශේෂත්වය වන්නේ ඔබගේ අයවැය, දින ගණන සහ කැමැත්ත අනුව සකස් කරන ලද **100% පුද්ගලික සංචාරක සැලසුම් (Custom Itineraries)** සැකසීමයි.\n\n• වනජීවී සෆාරි (යාල, උඩවලව, මින්නේරිය)\n• මධ්‍යම කඳුකර තේ වතු, දියඇලි සහ ඇල්ල කඳු නැගීම\n• වෙරළ විවේක සහ දියයට කිමිදුම් (මිරිස්ස, බෙන්තොට, ත්‍රිකුණාමලය)\n• ඓතිහාසික සංස්කෘතික නගර (අනුරාධපුර, පොළොන්නරුව, සීගිරිය)\n\nඔබ සංචාරය කිරීමට බලාපොරොත්තු වන දින සහ සාමාජිකයින් ගණන සඳහන් කරන්න, විනාඩි 5කින් සැලැස්ම සකස් කර දෙන්නෙමු!`,
          actionLabel: "සංචාරක සැලසුම්කරු වෙත",
          actionUrl: "/#itinerary-planner",
          handoffTopic: "Custom Itinerary Inquiry"
        };
      }
      return {
        text: `We specialize in **100% bespoke luxury journeys** designed from scratch to match your travel rhythm, hotel preferences, and exact dates.\n\n• **Wildlife & Safaris:** Yala Leopard Safaris, Udawalawe Elephant Sanctuary, Minneriya Elephant Gathering.\n• **Highland Serenity:** Colonial bungalows in Nuwara Eliya, tea factory tastings, Ella hiking.\n• **Coastal Luxury:** Private villas in Bentota, whale watching in Mirissa, surfing in Weligama.\n• **Heritage Citadels:** UNESCO wonders of Sigiriya, Polonnaruwa, and Dambulla.\n\nTell me your prospective travel dates, number of guests, and vibe, and our specialists will generate your custom day-by-day plan on WhatsApp!`,
        actionLabel: "Open Itinerary Planner",
        actionUrl: "/#itinerary-planner",
        handoffTopic: "Custom Itinerary Inquiry"
      };
    }

    // 4. Flights, Luxury Transfers & VIP Services
    if (q.includes('flight') || q.includes('transfer') || q.includes('airport') || q.includes('car') || q.includes('chauffeur') || q.includes('hotel') || q.includes('ප්‍රවාහන') || q.includes('ගුවන්')) {
      if (lang === 'si') {
        return {
          text: `Star Plus Travels ආයතනය මගින් ගුවන් ප්‍රවේශපත්‍ර (Emirates, SriLankan Airlines, Flydubai ආදී), කොළඹ බණ්ඩාරනායක ජාත්‍යන්තර ගුවන් තොටුපළ (BIA) සහ ඩුබායි (DXB) VIP ප්‍රවාහන සේවා මෙන්ම පුද්ගලික සුඛෝපභෝගී වාහන සේවා සපයනු ලැබේ.\n\n• සියලුම වාහන පූර්ණ රක්ෂණය සහ පළපුරුදු ඉංග්‍රීසි/සිංහල කතාකරන රියදුරන් සහිතයි.\n• ඔබගේ ගුවන් ගමන් විස්තර WhatsApp ඔස්සේ අප වෙත එවන්න.`,
          actionLabel: "අප අමතන්න",
          actionUrl: "/contact.html",
          handoffTopic: "Flights & Airport Transfers Inquiry"
        };
      }
      return {
        text: `We handle worldwide airline ticketing (Emirates, SriLankan Airlines, Flydubai, Qatar Airways, etc.), private airport Meet & Greet, and VIP chauffeur-driven transfers across both the UAE and Sri Lanka.\n\n• Modern fleet of luxury SUVs, Mercedes sedans, and high-roof executive vans.\n• Professional licensed English-speaking drivers with 24/7 route support.\n\nShare your route or flight schedules, and we will issue an immediate confirmation quote.`,
        actionLabel: "Contact Our Desk",
        actionUrl: "/contact.html",
        handoffTopic: "Flights & Airport Transfers Inquiry"
      };
    }

    // 5. Contact, Office Locations, Landline
    if (q.includes('contact') || q.includes('call') || q.includes('phone') || q.includes('office') || q.includes('location') || q.includes('address') || q.includes('email') || q.includes('කාර්යාලය') || q.includes('දුරකථන')) {
      if (lang === 'si') {
        return {
          text: `**Star Plus Travels & Tourism LLC** අපගේ සබඳතා තොරතුරු:\n\n• **WhatsApp (කඩිනම් සේවාව):** +971 52 758 2293\n• **ඩුබායි දුරකථන:** +971 4 227 0005\n• **විද්‍යුත් තැපෑල:** info@starplustravels.com\n• **ප්‍රධාන කාර්යාල:** Deira, Dubai, UAE සහ කොළඹ, ශ්‍රී ලංකාව.\n• **සේවා කාලය:** සතියේ දින 7ම පෙ.ව. 9:00 සිට ප.ව. 10:00 දක්වා (GST).`,
          actionLabel: "සම්බන්ධතා පිටුව",
          actionUrl: "/contact.html",
          handoffTopic: "General Office Inquiry"
        };
      }
      return {
        text: `**Star Plus Travels & Tourism LLC** Contact Information:\n\n• **Concierge WhatsApp:** +971 52 758 2293 (Under 5-minute replies)\n• **Dubai Landline:** +971 4 227 0005\n• **Email:** info@starplustravels.com\n• **Locations:** Deira, Dubai, UAE & Colombo, Sri Lanka.\n• **Operating Hours:** 7 Days a week, 9:00 AM – 10:00 PM (Gulf Standard Time).`,
        actionLabel: "View Contact Page",
        actionUrl: "/contact.html",
        handoffTopic: "General Office Inquiry"
      };
    }

    // 6. Currency, Tabby, Payment terms
    if (q.includes('currency') || q.includes('price') || q.includes('cost') || q.includes('tabby') || q.includes('installment') || q.includes('pay') || q.includes('මිල') || q.includes('ගෙවීම්')) {
      if (lang === 'si') {
        return {
          text: `අපගේ මිල ගණන් **AED (එක්සත් අරාබි එමීර් ඩිරාම්)** හෝ **USD (ඇමරිකානු ඩොලර්)** මගින් ලබාගත හැක.\n\n• **0% Tabby පහසුකම:** ඕනෑම පැකේජයක් හෝ වීසා ගාස්තුවක් කිසිදු පොලියක් රහිතව මාස 4ක කොටස් වශයෙන් ගෙවීමේ හැකියාව.\n• සියලුම ප්‍රධාන ක්‍රෙඩිට්/ඩෙබිට් කාඩ්පත් සහ බැංකු හුවමාරු පිළිගනු ලැබේ.`,
          actionLabel: "පැකේජ ගාස්තු බලන්න",
          actionUrl: "/packages.html",
          handoffTopic: "Payment Options & Tabby Installments"
        };
      }
      return {
        text: `All quotations are provided transparently in **AED (UAE Dirhams)** or **USD**.\n\n• **0% Tabby Installments:** Eligible UAE residents can split their holiday packages and visa payments into 4 interest-free monthly installments.\n• Secure credit/debit card processing, wire transfers, and digital payment links supported.`,
        actionLabel: "Browse Packages & Pricing",
        actionUrl: "/packages.html",
        handoffTopic: "Payment Options & Tabby Installments"
      };
    }

    // 7. Fallback / Default Grounded Response
    if (lang === 'si') {
      return {
        text: `ස්තූතියි! Star Plus Travels ආයතනය ලෙස අපි ශ්‍රී ලංකා සුඛෝපභෝගී පෞද්ගලික සංචාර, එක්සත් අරාබි එමීර් (UAE) සංචාරක වීසා, ගුවන් ප්‍රවේශපත්‍ර සහ හෝටල් වෙන්කිරීම් සඳහා විශේෂඥ සහය ලබාදෙන්නෙමු.\n\nඔබට වඩාත් නිශ්චිත විස්තර දැනගැනීමට හෝ අපගේ ජ්‍යෙෂ්ඨ සංචාරක උපදේශකයෙකු සමඟ සෘජුවම WhatsApp මඟින් සම්බන්ධ වීමට අවශ්‍යද?`,
        actionLabel: null,
        actionUrl: null,
        handoffTopic: rawQuery
      };
    }
    return {
      text: `Thank you for your message! Star Plus Travels specializes in curated Sri Lanka holiday circuits, rapid UAE tourist visas, tailored global getaways, and VIP transfers.\n\nWould you like more specific details on our packages, or would you prefer to connect directly with our senior travel designers on WhatsApp?`,
      actionLabel: null,
      actionUrl: null,
      handoffTopic: rawQuery
    };
  }

  // Create & Inject Assistant DOM Elements
  function buildAssistantUI() {
    if (document.getElementById('starplusAssistantLauncher')) return;

    const currentLang = getActiveLanguage();
    const t = I18N[currentLang] || I18N.en;

    // 1. Sleek TAMM-style Floating Launcher Pill
    const launcher = document.createElement('div');
    launcher.id = 'starplusAssistantLauncher';
    launcher.className = 'starplus-assistant-launcher';
    launcher.setAttribute('role', 'button');
    launcher.setAttribute('tabindex', '0');
    launcher.setAttribute('aria-label', 'Open Starplus AI Concierge');
    launcher.innerHTML = `
      <div class="starplus-assistant-orb">
        <svg class="w-4 h-4 fill-current text-slate-950" viewBox="0 0 24 24">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"/>
        </svg>
      </div>
      <span id="starplusAssistantLabel" class="text-xs sm:text-sm font-bold tracking-wide text-amber-300">
        ${t.launcherText}
      </span>
      <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
    `;

    // 2. Slide-up Interactive Modal / Drawer Panel
    const panel = document.createElement('div');
    panel.id = 'starplusAssistantPanel';
    panel.className = 'starplus-assistant-panel hidden';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Starplus AI Concierge Dialog');
    panel.innerHTML = `
      <!-- Luxury Gold & Slate Header -->
      <div class="flex items-center justify-between px-4 py-3.5 bg-slate-950/95 border-b border-amber-500/25 select-none">
        <div class="flex items-center gap-3">
          <div class="relative w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 flex items-center justify-center text-slate-950 shadow-md flex-shrink-0">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0-2.5-2.5z"/>
            </svg>
            <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h4 id="assistantHeaderTitle" class="text-sm font-bold text-white tracking-wide leading-tight">
                ${t.title}
              </h4>
              <span class="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">AI</span>
            </div>
            <p id="assistantHeaderSubtitle" class="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
              ${t.subtitle}
            </p>
          </div>
        </div>
        <button type="button" id="assistantCloseBtn" class="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm" aria-label="Close Assistant">
          ✕
        </button>
      </div>

      <!-- Chat Messages Scroll Container -->
      <div id="assistantMessages" class="starplus-assistant-messages space-y-3.5">
        <!-- Initial Welcome Message from Assistant -->
        <div class="flex items-start gap-2.5 max-w-[92%]">
          <div class="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0 text-xs">
            ★
          </div>
          <div class="bg-slate-800/90 border border-slate-700/70 rounded-2xl rounded-tl-sm p-3.5 text-xs sm:text-sm text-slate-100 shadow-md leading-relaxed">
            <p id="assistantWelcomeText">${t.welcomeGreeting}</p>
          </div>
        </div>

        <!-- Quick Starter Chips Wrapper -->
        <div id="assistantChipsWrapper" class="flex flex-wrap gap-1.5 pt-1"></div>
      </div>

      <!-- Typing Indicator (Hidden by default) -->
      <div id="assistantTyping" class="px-4 py-1.5 hidden">
        <div class="starplus-typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <!-- Persistent WhatsApp Handover CTA -->
      <div class="p-2.5 bg-slate-950/90 border-t border-slate-800/80">
        <a 
          id="assistantWaHandoffLink"
          href="https://wa.me/${CONFIG.phone}?text=${encodeURIComponent('Hi Starplus Travels, I am chatting with Starplus Concierge and would like assistance with my booking.')}"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md active:scale-[0.98]"
        >
          <svg class="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span id="assistantWaHandoffText" class="truncate">${t.waHandoffBtn}</span>
        </a>
      </div>

      <!-- Conversational Input Bar -->
      <form id="assistantChatForm" class="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input 
          type="text" 
          id="assistantChatInput" 
          class="flex-1 bg-slate-950 text-slate-100 placeholder-slate-500 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 transition-colors" 
          placeholder="${t.placeholder}"
          autocomplete="off"
        />
        <button 
          type="submit" 
          id="assistantChatSend" 
          class="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center shadow-md active:scale-95"
          aria-label="Send message"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </form>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    setupAssistantEvents(launcher, panel);
    renderQuickChips();
  }

  // Setup Event Listeners & Interaction Handlers
  function setupAssistantEvents(launcher, panel) {
    const closeBtn = panel.querySelector('#assistantCloseBtn');
    const form = panel.querySelector('#assistantChatForm');
    const input = panel.querySelector('#assistantChatInput');

    function toggleAssistant(open) {
      isPanelOpen = typeof open === 'boolean' ? open : panel.classList.contains('hidden');
      if (isPanelOpen) {
        panel.classList.remove('hidden');
        setTimeout(() => {
          if (input) input.focus();
        }, 150);
      } else {
        panel.classList.add('hidden');
      }
    }

    launcher.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAssistant(!panel.classList.contains('hidden') ? false : true);
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAssistant(false);
    });

    // Close when clicking outside on desktop
    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('hidden') && !panel.contains(e.target) && !launcher.contains(e.target)) {
        toggleAssistant(false);
      }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (!query || isGenerating) return;
      input.value = '';
      executeUserTurn(query);
    });

    // Listen for language changes dispatched across the Star Plus site
    window.addEventListener('languagechange', (e) => {
      syncLanguage(e.detail && e.detail.lang ? e.detail.lang : getActiveLanguage());
    });
  }

  // Sync Language UI Text
  function syncLanguage(lang) {
    const t = I18N[lang] || I18N.en;

    const label = document.getElementById('starplusAssistantLabel');
    if (label) label.textContent = t.launcherText;

    const title = document.getElementById('assistantHeaderTitle');
    if (title) title.textContent = t.title;

    const sub = document.getElementById('assistantHeaderSubtitle');
    if (sub) sub.textContent = t.subtitle;

    const welcome = document.getElementById('assistantWelcomeText');
    if (welcome && sessionHistory.length === 0) welcome.textContent = t.welcomeGreeting;

    const waTxt = document.getElementById('assistantWaHandoffText');
    if (waTxt) waTxt.textContent = t.waHandoffBtn;

    const input = document.getElementById('assistantChatInput');
    if (input) input.placeholder = t.placeholder;

    renderQuickChips(lang);
  }

  // Render Interactive Quick-Prompt Chips
  function renderQuickChips(lang) {
    const activeLang = lang || getActiveLanguage();
    const chipsWrapper = document.getElementById('assistantChipsWrapper');
    if (!chipsWrapper) return;

    chipsWrapper.innerHTML = '';
    const chipData = (I18N[activeLang] || I18N.en).chips;

    chipData.forEach((item) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'starplus-assistant-chip';
      chip.innerHTML = `<span>✨</span><span>${item.label}</span>`;
      chip.addEventListener('click', () => {
        if (isGenerating) return;
        executeUserTurn(item.query, item.label);
      });
      chipsWrapper.appendChild(chip);
    });
  }

  // Append Chat Message Bubbles
  function appendMessage(sender, text, action) {
    const container = document.getElementById('assistantMessages');
    if (!container) return;

    if (sender === 'user') {
      const bubble = document.createElement('div');
      bubble.className = 'flex justify-end';
      bubble.innerHTML = `
        <div class="bg-amber-500 text-slate-950 font-semibold rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-xs sm:text-sm max-w-[85%] shadow-md leading-relaxed">
          ${escapeHtml(text)}
        </div>
      `;
      container.appendChild(bubble);
    } else {
      const bubble = document.createElement('div');
      bubble.className = 'flex items-start gap-2.5 max-w-[92%]';
      bubble.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0 text-xs">
          ★
        </div>
        <div class="bg-slate-800/90 border border-slate-700/70 rounded-2xl rounded-tl-sm p-3.5 text-xs sm:text-sm text-slate-100 shadow-md leading-relaxed">
          <div class="space-y-2 prose-invert">${formatMarkdown(text)}</div>
          ${action ? `
            <div class="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap items-center gap-2">
              <a href="${action.url}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors">
                ${action.label} →
              </a>
            </div>
          ` : ''}
        </div>
      `;
      container.appendChild(bubble);
    }

    container.scrollTop = container.scrollHeight;
  }

  // Update Dynamic WhatsApp Handoff Link with Session Context
  function updateWhatsAppHandoff(lastTopic) {
    const waLink = document.getElementById('assistantWaHandoffLink');
    if (!waLink) return;

    const currentLang = isSinhalaQuery(lastTopic) ? 'si' : getActiveLanguage();
    const t = I18N[currentLang] || I18N.en;

    const message = `${t.waPreMessage}"${lastTopic}". Please connect me with a specialist for custom pricing and itinerary confirmation.`;
    waLink.href = `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(message)}`;
  }

  // Handle Turn-by-Turn Conversational Execution
  function executeUserTurn(query, displayLabel) {
    const typingIndicator = document.getElementById('assistantTyping');
    const container = document.getElementById('assistantMessages');

    isGenerating = true;
    appendMessage('user', displayLabel || query);
    sessionHistory.push({ role: 'user', content: query });

    // Show typing animation
    if (typingIndicator) {
      typingIndicator.classList.remove('hidden');
      if (container) container.scrollTop = container.scrollHeight;
    }

    // Determine target response language
    const queryLang = isSinhalaQuery(query) ? 'si' : getActiveLanguage();

    // Natural processing simulated delay
    const delay = Math.min(800, 300 + query.length * 10);
    setTimeout(() => {
      const result = generateGroundedResponse(query, queryLang);

      if (typingIndicator) typingIndicator.classList.add('hidden');

      appendMessage('assistant', result.text, result.actionLabel ? { label: result.actionLabel, url: result.actionUrl } : null);
      sessionHistory.push({ role: 'assistant', content: result.text });

      updateWhatsAppHandoff(result.handoffTopic || query);
      isGenerating = false;
    }, delay);
  }

  // Utility helpers
  function escapeHtml(string) {
    return String(string)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMarkdown(text) {
    return text
      .split('\n\n')
      .map(p => {
        let formatted = p.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300 font-bold">$1</strong>');
        if (formatted.startsWith('• ')) {
          const items = formatted.split('\n• ').map(item => `<li class="mt-1">${item.replace(/^• /, '')}</li>`).join('');
          return `<ul class="list-disc pl-4 space-y-1 text-slate-200">${items}</ul>`;
        }
        return `<p>${formatted.replace(/\n/g, '<br/>')}</p>`;
      })
      .join('');
  }

  // Initialization
  function init() {
    buildAssistantUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global controller
  window.StarplusAssistant = {
    open: () => {
      const p = document.getElementById('starplusAssistantPanel');
      if (p) p.classList.remove('hidden');
    },
    close: () => {
      const p = document.getElementById('starplusAssistantPanel');
      if (p) p.classList.add('hidden');
    },
    ask: (q) => executeUserTurn(q),
    syncLanguage: (l) => syncLanguage(l)
  };
})();
