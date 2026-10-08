/**
 * Star Plus Travels - AI Concierge ("Starplus Assistant")
 * TAMM Luxury Architecture & Conversational Chat Engine
 * Grounded Knowledge Base, Bilingual Support (English & Sinhala),
 * Floating Orb Launcher Positioned Above Floating WhatsApp Widget,
 * Structured Capability Cards, Dynamic WhatsApp Handoff.
 */

(function () {
  'use strict';

  // Prevent duplicate execution
  if (window.StarplusAssistantInitialized) return;
  window.StarplusAssistantInitialized = true;

  // Reference Grounded Knowledge Engine (from concierge-brain.js or internal fallback)
  const brainModule = (typeof window !== 'undefined' && window.ConciergeKnowledge) 
    ? window.ConciergeKnowledge 
    : (typeof ConciergeKnowledge !== 'undefined' ? ConciergeKnowledge : null);

  const engine = (brainModule && brainModule.engineInstance)
    ? brainModule.engineInstance
    : (brainModule && brainModule.ConversationalEngine ? new brainModule.ConversationalEngine() : null);

  const KB = (brainModule && brainModule.KNOWLEDGE_BASE) || {
    brand: { name: "Star Plus Travel & Tourism LLC" },
    contacts: {
      whatsapp: "+971 52 758 2293",
      whatsappRaw: "971527582293",
      landline: "+971 4 227 0005",
      email: "info@starplustraveluae.com",
      website: "https://www.starplustraveluae.com/"
    }
  };

  // Configuration & Grounded Knowledge Base
  const CONFIG = {
    brand: (KB.brand && KB.brand.name) || "Star Plus Travel & Tourism LLC",
    locations: "Dubai, United Arab Emirates & Colombo, Sri Lanka",
    phone: (KB.contacts && KB.contacts.whatsappRaw) || "971527582293",
    phoneFormatted: (KB.contacts && KB.contacts.whatsapp) || "+971 52 758 2293",
    landline: (KB.contacts && KB.contacts.landline) || "+971 4 227 0005",
    email: (KB.contacts && KB.contacts.email) || "info@starplustraveluae.com",
    website: (KB.contacts && KB.contacts.website) || "https://www.starplustraveluae.com/",
    tabby: "0% interest Tabby installments (split in 4)",
    currencies: "AED & USD"
  };

  const I18N = {
    en: {
      launcherText: "AI Concierge",
      launcherTooltip: "Starplus AI Luxury Concierge",
      brandPill: "STARPLUS AI CONCIERGE",
      status: "Live Assistance",
      greetingTitle: "Hi Traveler",
      greetingSubtitle: "How can I help you today?",
      card1Title: "What can you do for me?",
      card1Sub: "Explore tour curation, visas & bespoke travel",
      card1Query: "What can you do for me?",
      card2Title: "Frequently Asked Questions",
      card2Sub: "UAE visas, Sri Lanka itineraries & payment policies",
      card2Query: "Frequently Asked Questions",
      card3Title: "Plan a Custom Itinerary",
      card3Sub: "Build a day-by-day luxury route in 5 minutes",
      card3Query: "Plan a Custom Itinerary",
      explorePrompts: "✦ Explore Prompts",
      explorePromptsClose: "✕ Hide Prompts",
      prompts: [
        { label: "Sri Lanka 6-Day Tour", query: "Tell me about the Sri Lanka 6-Day Tour" },
        { label: "UAE Visa (30/60 Days)", query: "What are the UAE Visa requirements and pricing?" },
        { label: "Tabby 0% Installments", query: "How do Tabby 0% interest installments work?" },
        { label: "Airport VIP Transfers", query: "Do you arrange flights and private luxury transfers?" }
      ],
      placeholder: "Ask me about tours, visas, pricing...",
      send: "Send",
      waHandoffBarText: "Forward chat to WhatsApp Concierge",
      waHandoffBtn: "WhatsApp Concierge",
      waPreMessage: "Hi Starplus Travels, I was chatting with Starplus AI Concierge about: ",
      disclaimer: "Starplus AI Concierge is trained to assist with luxury travel and visa inquiries. Verify critical travel dates with our team.",
      typingLabel: "Starplus AI is formulating a response..."
    },
    si: {
      launcherText: "AI සහයක",
      launcherTooltip: "Starplus සුඛෝපභෝගී AI සංචාරක සහයක",
      brandPill: "STARPLUS AI සහයක",
      status: "ක්ෂණික සේවාව",
      greetingTitle: "ආයුබෝවන් සංචාරකය",
      greetingSubtitle: "අද මම ඔබට කෙසේ සහය විය හැකිද?",
      card1Title: "මට ලැබෙන සේවාවන් මොනවාද?",
      card1Sub: "සංචාරක සැලසුම්, වීසා සහ සුඛෝපභෝගී සේවාවන්",
      card1Query: "මට ලබාගත හැකි සේවාවන් මොනවාද?",
      card2Title: "නිතර අසන ප්‍රශ්න",
      card2Sub: "UAE වීසා, ශ්‍රී ලංකා සංචාර සහ ගෙවීම් ක්‍රම",
      card2Query: "නිතර අසන ප්‍රශ්න සහ පිළිතුරු",
      card3Title: "සුවිශේෂී සංචාරක සැලසුමක්",
      card3Sub: "විනාඩි 5කින් දිනෙන් දින සුඛෝපභෝගී සැලැස්මක්",
      card3Query: "සුවිශේෂී සංචාරක සැලසුමක් සකස් කරන්න",
      explorePrompts: "✦ විමසිය හැකි තොරතුරු",
      explorePromptsClose: "✕ සඟවන්න",
      prompts: [
        { label: "ශ්‍රී ලංකා දින 6 සංචාරය", query: "ශ්‍රී ලංකා දින 6 සංචාරක පැකේජය ගැන විස්තර කියන්න" },
        { label: "UAE වීසා (දින 30/60)", query: "එක්සත් අරාබි එමීර් (UAE) වීසා අවශ්‍යතා සහ ගාස්තු මොනවාද?" },
        { label: "Tabby 0% පොලී රහිත ගෙවීම්", query: "Tabby 0% පොලී රහිත ගෙවීම් පහසුකම ක්‍රියාත්මක වන්නේ කෙසේද?" },
        { label: "ගුවන් ප්‍රවේශපත්‍ර සහ ප්‍රවාහන", query: "ගුවන් ප්‍රවේශපත්‍ර සහ සුඛෝපභෝගී ප්‍රවාහන පහසුකම් සපයනවාද?" }
      ],
      placeholder: "පැකේජ, වීසා හෝ සංචාරක තොරතුරු අසන්න...",
      send: "යවන්න",
      waHandoffBarText: "WhatsApp ඔස්සේ සාකච්ඡාව ඉදිරියට ගෙනයන්න",
      waHandoffBtn: "WhatsApp සහයක",
      waPreMessage: "හෙලෝ Starplus Travels, මම Starplus AI සහයකයා සමග සාකච්ඡා කළෙමි: ",
      disclaimer: "Starplus AI සහයකයා සුඛෝපභෝගී සංචාර සහ වීසා තොරතුරු සඳහා සකසා ඇත. නිශ්චිත සංචාරක දින අප කණ්ඩායම සමඟ තහවුරු කරගන්න.",
      typingLabel: "Starplus AI පිළිතුර සකසමින් සිටී..."
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
  let isPromptsTrayOpen = false;

  // Grounded Knowledge Base Queries & Intelligent Intent Matcher
  function generateGroundedResponse(rawQuery, targetLang) {
    const q = rawQuery.toLowerCase();
    const lang = targetLang || (isSinhalaQuery(rawQuery) ? 'si' : getActiveLanguage());

    // 1. "What can you do for me?" / Capability Overview
    if (q.includes('what can you do') || q.includes('do for me') || q.includes('capabilities') || q.includes('සේවාවන් මොනවාද') || q.includes('කරන්න පුළුවන් මොනවද')) {
      if (lang === 'si') {
        return {
          text: `මම ඔබගේ පුද්ගලික **Starplus සුඛෝපභෝගී AI සංචාරක උපදේශකයා** වෙමි. මට ඔබට පහත සේවාවන් ක්ෂණිකව ලබාදිය හැක:\n\n• **ශ්‍රී ලංකා පෞද්ගලික චාරිකා:** තරු 4/5 හෝටල්, කැපවූ රියදුරු-මඟපෙන්වන්නන් සහ සුවිශේෂී මාර්ග (සීගිරිය, නුවරඑළිය, ඇල්ල, යාල).\n• **UAE සංචාරක වීසා (දින 30/60):** පැය 24–48 කින් කඩිනම් නිකුත් කිරීම සහ සහතික කළ අනුමැතිය.\n• **සුවිශේෂී සංචාරක සැලසුම් (Custom Itineraries):** ඔබගේ කැමැත්ත සහ අයවැය අනුව විනාඩි 5කින් සැලසුම් කිරීම.\n• **ගුවන් ප්‍රවේශපත්‍ර & VIP ප්‍රවාහන:** ඩුබායි සහ කොළඹ ගුවන් තොටුපළ VIP පිළිගැනීම් සහ සුඛෝපභෝගී මෝටර් රථ.\n• **0% Tabby පහසුකම:** ඕනෑම මුදලක් පොලී රහිතව මාස 4ක කොටස් වශයෙන් ගෙවීමේ හැකියාව.\n\nඅද ඔබගේ සැලසුම් ආරම්භ කිරීමට කැමතිද?`,
          actionLabel: "සියලුම පැකේජ බලන්න",
          actionUrl: "/packages.html",
          handoffTopic: "Starplus Services Overview"
        };
      }
      return {
        text: `I am your dedicated **Starplus Luxury AI Concierge**, tailored to curate seamless, end-to-end travel experiences:\n\n• **Curated Sri Lanka Circuits:** Private multi-day journeys featuring boutique 4/5★ resorts, personal chauffeur-guides, scenic highland trains, and Yala wildlife safaris.\n• **Official UAE Tourist Visas:** Rapid 30-Day & 60-Day visit permits with 24–48hr turnaround and zero paperwork friction.\n• **Bespoke Itinerary Planning:** 100% tailor-made day-by-day luxury routes built around your pace, dates, and party size.\n• **VIP Airport & Flight Logistics:** Worldwide airline ticketing and premium executive transfers in Dubai (DXB) and Colombo (BIA).\n• **Flexible 0% Tabby Financing:** Split holiday packages or visa fees into 4 interest-free monthly installments.\n\nHow would you like to begin your journey today?`,
        actionLabel: "Explore Premier Packages",
        actionUrl: "/packages.html",
        handoffTopic: "Starplus Services Overview"
      };
    }

    // 2. "Frequently Asked Questions" / FAQ Summary
    if (q.includes('frequently asked') || q.includes('faq') || q.includes('නිතර අසන') || q.includes('ප්‍රශ්න සහ පිළිතුරු')) {
      if (lang === 'si') {
        return {
          text: `සංචාරකයින් බහුලව අසන ප්‍රධාන තොරතුරු මෙන්න:\n\n• **UAE වීසා ලබාගැනීමට කොපමණ කාලයක් ගතවේද?** සාමාන්‍යයෙන් පැය 24 සිට 48 දක්වා. එදිනම ලබාගැනීමේ අධිවේගී (Express) සේවාවද ඇත. අවශ්‍ය වන්නේ පාස්පෝට් පිටපතක් සහ ඡායාරූපයක් පමණි.\n• **ශ්‍රී ලංකා සංචාරක පැකේජවලට ඇතුළත් මොනවාද?** තරු 4/5 සුඛෝපභෝගී හෝටල්, දිනපතා උදෑසන ආහාර, පෞද්ගලික AC වාහනය සහ කැපවූ පළපුරුදු රියදුරු.\n• **පැකේජයන් අපට අවශ්‍ය පරිදි වෙනස් කළ හැකිද?** ඔව්, ඕනෑම සැලැස්මක් ඔබගේ සංචාරක දිනයන්ට සහ කැමැත්තට 100% වෙනස් කළ හැක.\n• **ගෙවීම් ක්‍රම මොනවාද?** ක්‍රෙඩිට්/ඩෙබිට් කාඩ්පත්, බැංකු තැන්පතු, සහ Tabby 0% පොලී රහිත මාස 4ක කොටස් ගෙවීම්.\n\nවැඩිදුර විස්තර සඳහා අපගේ උපදේශක කණ්ඩායම අමතන්න!`,
          actionLabel: "Help & FAQ පිටුව බලන්න",
          actionUrl: "/faq",
          handoffTopic: "Frequently Asked Questions"
        };
      }
      return {
        text: `Here are concise answers to our travelers' most frequent inquiries:\n\n• **How quickly are UAE Visas processed?** Approvals typically take 24–48 hours, with express same-day turnaround available. Only a passport copy (6+ months validity) and photo are needed.\n• **What is included in Sri Lanka holiday packages?** Hand-picked 4/5★ luxury boutique resorts, daily buffet breakfast, private chauffeur-guide with AC vehicle, all government permits, and airport transfers.\n• **Can existing packages be tailored?** Yes, every package is 100% customizable to your exact dates, guest count, and pace.\n• **What payment methods are supported?** Credit/Debit cards, wire transfers, and Tabby 0% interest installments (split over 4 months).\n\nWould you like more details on a specific policy or direct assistance from our team?`,
        actionLabel: "View Help & FAQ Page",
        actionUrl: "/faq",
        handoffTopic: "Frequently Asked Questions"
      };
    }

    // 3. Plan a Custom Itinerary / Bespoke Journeys
    if (q.includes('custom') || q.includes('itinerary') || q.includes('plan') || q.includes('tailor') || q.includes('bespoke') || q.includes('සැලසුම්') || q.includes('සුවිශේෂී')) {
      if (lang === 'si') {
        return {
          text: `අපගේ විශේෂත්වය වන්නේ ඔබගේ අයවැය, දින ගණන සහ කැමැත්ත අනුව සකස් කරන ලද **100% පුද්ගලික සංචාරක සැලසුම් (Custom Itineraries)** නිර්මාණය කිරීමයි.\n\n• **වනජීවී සෆාරි:** යාල දිවියන් නැරඹීම, උඩවලව අලි රංචු, මින්නේරිය මහා අලි එක්රැස්වීම.\n• **මධ්‍යම කඳුකර සුන්දරත්වය:** නුවරඑළිය තේ වතු, දියඇලි, ඇල්ල නිල් දුම්රිය චාරිකාව.\n• **වෙරළබඩ නිවාඩු:** බෙන්තොට පෞද්ගලික විලා, මිරිස්ස තල්මසුන් නැරඹීම, වැලිගම.\n• **ඓතිහාසික උරුමයන්:** සීගිරිය පර්වත බලකොටුව, දඹුල්ල සහ පොළොන්නරුව.\n\nඔබ සංචාරය කිරීමට බලාපොරොත්තු වන දින සහ සාමාජිකයින් ගණන සඳහන් කරන්න, අපගේ විශේෂඥ කණ්ඩායම විනාඩි 5කින් සැලැස්ම සකස් කර දෙන්නෙමු!`,
          actionLabel: "සංචාරක සැලසුම්කරු වෙත",
          actionUrl: "/#itinerary-planner",
          handoffTopic: "Custom Itinerary Inquiry"
        };
      }
      return {
        text: `We specialize in **100% bespoke luxury journeys** designed from scratch around your travel rhythm, accommodation preferences, and exact dates:\n\n• **Wildlife & Safaris:** Yala leopard treks, Udawalawe elephant sanctuary, and Minneriya gathering.\n• **Highland Serenity:** Colonial heritage bungalows in Nuwara Eliya, tea factory masterclasses, and Ella blue train rides.\n• **Coastal Luxury:** Private boutique villas in Bentota, whale watching in Mirissa, and reef diving.\n• **Heritage Citadels:** UNESCO wonders of Sigiriya Rock Fortress, Polonnaruwa, and Kandy.\n\nTell me your prospective travel dates, number of guests, and vibe, and our specialists will craft your custom day-by-day plan on WhatsApp!`,
        actionLabel: "Open Itinerary Planner",
        actionUrl: "/#itinerary-planner",
        handoffTopic: "Custom Itinerary Inquiry"
      };
    }

    // 4. Sri Lanka 6-Day Tour / General Sri Lanka Tours
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

    // 5. UAE Visa Services & Requirements
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

    // 6. Currency, Tabby, Payment terms
    if (q.includes('tabby') || q.includes('currency') || q.includes('price') || q.includes('cost') || q.includes('installment') || q.includes('pay') || q.includes('මිල') || q.includes('ගෙවීම්')) {
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

    // 7. Flights, Luxury Transfers & VIP Services
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

    // 8. Contact, Office Locations, Landline
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

    // 9. Fallback / Default Grounded Response
    if (lang === 'si') {
      return {
        text: `ස්තූතියි! Star Plus Travels ආයතනය ලෙස අපි ශ්‍රී ලංකා සුඛෝපභෝගී පෞද්ගලික සංචාර, එක්සත් අරාබි එමීර් (UAE) සංචාරක වීසා, ගුවන් ප්‍රවේශපත්‍ර සහ හෝටල් වෙන්කිරීම් සඳහා විශේෂඥ සහය ලබාදෙන්නෙමු.\n\nඔබට වඩාත් නිශ්චිත විස්තර දැනගැනීමට හෝ අපගේ ජ්‍යෙෂ්ඨ සංචාරක උපදේශකයෙකු සමඟ සෘජුවම WhatsApp මඟින් සම්බන්ධ වීමට අවශ්‍යද?`,
        actionLabel: null,
        actionUrl: null,
        handoffTopic: rawQuery
      };
    }
    return {
      text: `Thank you for reaching out! Star Plus Travels specializes in curated Sri Lanka holiday circuits, rapid UAE tourist visas, bespoke itineraries, and VIP transfers.\n\nWould you like more specific details on our packages, or would you prefer to connect directly with our senior concierge desk on WhatsApp?`,
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

    // 1. Sleek TAMM-style Circular Floating Launcher Button positioned above WhatsApp widget
    const launcher = document.createElement('div');
    launcher.id = 'starplusAssistantLauncher';
    launcher.className = 'starplus-assistant-launcher';
    launcher.setAttribute('role', 'button');
    launcher.setAttribute('tabindex', '0');
    launcher.setAttribute('aria-label', 'Open Starplus AI Concierge');
    launcher.setAttribute('title', t.launcherText);
    launcher.setAttribute('data-tooltip', t.launcherText);
    launcher.innerHTML = `
      <div class="tamm-launcher-orb"></div>
      <span class="tamm-online-dot"></span>
    `;

    // 2. TAMM Luxury Architecture Drawer / Modal Panel
    const panel = document.createElement('div');
    panel.id = 'starplusAssistantPanel';
    panel.className = 'starplus-assistant-panel hidden';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Starplus AI Concierge Dialog');
    panel.innerHTML = `
      <!-- Top Bar with Minimize Button (-) -->
      <div class="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-amber-500/20 select-none flex-shrink-0">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span id="assistantBrandPill" class="text-[11px] font-bold tracking-widest text-amber-300 uppercase">
            ${t.brandPill}
          </span>
        </div>
        <button 
          type="button" 
          id="assistantMinimizeBtn" 
          class="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-base font-bold shadow cursor-pointer" 
          aria-label="Minimize Assistant"
          title="Minimize"
        >
          <svg class="w-3.5 h-3.5 fill-none stroke-current" stroke-width="2.5" stroke-linecap="round" viewBox="0 0 24 24">
            <path d="M5 12h14"/>
          </svg>
        </button>
      </div>

      <!-- Main Scroll Body: Hero, Cards & Chat Stream -->
      <div id="assistantBody" class="starplus-assistant-body">
        
        <!-- Hero Section: Centered Glowing Orb Avatar & Large Typography -->
        <div id="assistantHero" class="text-center pt-1 select-none">
          <div class="tamm-hero-orb-wrap">
            <div class="tamm-hero-orb"></div>
          </div>
          <h3 id="assistantGreetingTitle" class="text-xl sm:text-2xl font-bold text-white tracking-tight mt-3">
            ${t.greetingTitle}
          </h3>
          <p id="assistantGreetingSub" class="text-xs sm:text-sm text-slate-300 font-medium mt-1">
            ${t.greetingSubtitle}
          </p>
        </div>

        <!-- Structured Capability Cards (replacing cramped chips) -->
        <div id="assistantCapabilityCards" class="space-y-2 mt-1">
          <!-- Card 1 -->
          <button type="button" class="tamm-card" data-query="${t.card1Query}">
            <div class="tamm-card-icon bg-teal-500/20 text-teal-300 border border-teal-500/30">
              🗺️
            </div>
            <div class="flex-1 min-w-0">
              <div class="tamm-card-title">${t.card1Title}</div>
              <div class="tamm-card-sub">${t.card1Sub}</div>
            </div>
            <span class="tamm-card-arrow">→</span>
          </button>

          <!-- Card 2 -->
          <button type="button" class="tamm-card" data-query="${t.card2Query}">
            <div class="tamm-card-icon bg-sky-500/20 text-sky-300 border border-sky-500/30">
              💬
            </div>
            <div class="flex-1 min-w-0">
              <div class="tamm-card-title">${t.card2Title}</div>
              <div class="tamm-card-sub">${t.card2Sub}</div>
            </div>
            <span class="tamm-card-arrow">→</span>
          </button>

          <!-- Card 3 -->
          <button type="button" class="tamm-card" data-query="${t.card3Query}">
            <div class="tamm-card-icon bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ✨
            </div>
            <div class="flex-1 min-w-0">
              <div class="tamm-card-title">${t.card3Title}</div>
              <div class="tamm-card-sub">${t.card3Sub}</div>
            </div>
            <span class="tamm-card-arrow">→</span>
          </button>
        </div>

        <!-- Quick Action Link: Explore Prompts -->
        <div class="text-center">
          <button 
            type="button" 
            id="assistantExplorePromptsBtn" 
            class="text-xs font-semibold text-amber-400/90 hover:text-amber-300 transition-colors py-1 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span id="assistantExplorePromptsText">${t.explorePrompts}</span>
          </button>
        </div>

        <!-- Expandable Prompt Pills Tray -->
        <div id="assistantPromptsTray" class="flex flex-wrap justify-center gap-1.5 pt-0.5 hidden"></div>

        <!-- Chat Messages Container -->
        <div id="assistantMessages" class="space-y-3 pt-2"></div>

        <!-- Typing Indicator -->
        <div id="assistantTyping" class="py-1 hidden">
          <div class="starplus-typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- WhatsApp Handoff Bar -->
      <div class="px-3.5 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-shrink-0 select-none">
        <div class="flex items-center gap-1.5 text-[11px] text-slate-300 truncate">
          <span class="w-2 h-2 rounded-full bg-[#25D366] flex-shrink-0"></span>
          <span id="assistantWaHandoffLabel" class="truncate">${t.waHandoffBarText}</span>
        </div>
        <a 
          id="assistantWaHandoffLink"
          href="https://wa.me/${CONFIG.phone}?text=${encodeURIComponent('Hi Starplus Travels, I was chatting with Starplus AI Concierge and would like to speak to a specialist.')}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-xs font-bold border border-[#25D366]/35 transition-all flex-shrink-0"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span id="assistantWaHandoffBtnText">${t.waHandoffBtn}</span>
        </a>
      </div>

      <!-- Modern Search / Input Bar -->
      <form id="assistantChatForm" class="p-2.5 bg-slate-900 border-t border-slate-800 flex-shrink-0">
        <div class="tamm-input-container">
          <button 
            type="button" 
            id="assistantPlusActionBtn" 
            class="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 flex items-center justify-center transition-colors text-base font-bold flex-shrink-0 cursor-pointer" 
            title="Toggle Quick Prompts" 
            aria-label="Toggle Quick Prompts"
          >
            +
          </button>
          <input 
            type="text" 
            id="assistantChatInput" 
            class="flex-1 bg-transparent text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none" 
            placeholder="${t.placeholder}"
            autocomplete="off"
          />
          <button 
            type="submit" 
            id="assistantChatSend" 
            class="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold flex items-center justify-center transition-all shadow-md active:scale-95 flex-shrink-0 cursor-pointer"
            aria-label="Send message"
          >
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </form>

      <!-- Disclaimer Footer -->
      <div class="px-4 py-1.5 bg-slate-950 text-[10px] text-slate-400 text-center border-t border-slate-900 select-none flex-shrink-0">
        <p id="assistantDisclaimerText">${t.disclaimer}</p>
      </div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    setupAssistantEvents(launcher, panel);
    renderPromptsTray();
  }

  // Setup Event Listeners & Interaction Handlers
  function setupAssistantEvents(launcher, panel) {
    const minimizeBtn = panel.querySelector('#assistantMinimizeBtn');
    const form = panel.querySelector('#assistantChatForm');
    const input = panel.querySelector('#assistantChatInput');
    const explorePromptsBtn = panel.querySelector('#assistantExplorePromptsBtn');
    const plusBtn = panel.querySelector('#assistantPlusActionBtn');
    const cardsWrapper = panel.querySelector('#assistantCapabilityCards');

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

    function togglePromptsTray() {
      const tray = panel.querySelector('#assistantPromptsTray');
      const textSpan = panel.querySelector('#assistantExplorePromptsText');
      const lang = getActiveLanguage();
      const t = I18N[lang] || I18N.en;

      isPromptsTrayOpen = !isPromptsTrayOpen;
      if (isPromptsTrayOpen) {
        tray.classList.remove('hidden');
        if (textSpan) textSpan.textContent = t.explorePromptsClose;
      } else {
        tray.classList.add('hidden');
        if (textSpan) textSpan.textContent = t.explorePrompts;
      }
    }

    launcher.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAssistant(panel.classList.contains('hidden'));
    });

    launcher.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAssistant(panel.classList.contains('hidden'));
      }
    });

    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAssistant(false);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.classList.contains('hidden')) {
        toggleAssistant(false);
      }
    });

    // Close when clicking outside on desktop
    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('hidden') && !panel.contains(e.target) && !launcher.contains(e.target)) {
        toggleAssistant(false);
      }
    });

    // Capability cards click delegation
    cardsWrapper.addEventListener('click', (e) => {
      const card = e.target.closest('.tamm-card');
      if (!card || isGenerating) return;
      const query = card.getAttribute('data-query');
      if (query) {
        executeUserTurn(query);
      }
    });

    // Explore Prompts link toggle
    explorePromptsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePromptsTray();
    });

    // '+' button inside search bar toggle
    plusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePromptsTray();
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

    const launcher = document.getElementById('starplusAssistantLauncher');
    if (launcher) {
      launcher.setAttribute('title', t.launcherText);
      launcher.setAttribute('data-tooltip', t.launcherText);
      launcher.setAttribute('aria-label', t.launcherText);
    }

    const label = document.getElementById('starplusAssistantLabel');
    if (label) label.textContent = t.launcherText;

    const brandPill = document.getElementById('assistantBrandPill');
    if (brandPill) brandPill.textContent = t.brandPill;

    const greetingTitle = document.getElementById('assistantGreetingTitle');
    if (greetingTitle) greetingTitle.textContent = t.greetingTitle;

    const greetingSub = document.getElementById('assistantGreetingSub');
    if (greetingSub) greetingSub.textContent = t.greetingSubtitle;

    // Update Capability Cards
    const cardsWrapper = document.getElementById('assistantCapabilityCards');
    if (cardsWrapper) {
      const cards = cardsWrapper.querySelectorAll('.tamm-card');
      if (cards.length >= 3) {
        // Card 1
        cards[0].setAttribute('data-query', t.card1Query);
        cards[0].querySelector('.tamm-card-title').textContent = t.card1Title;
        cards[0].querySelector('.tamm-card-sub').textContent = t.card1Sub;

        // Card 2
        cards[1].setAttribute('data-query', t.card2Query);
        cards[1].querySelector('.tamm-card-title').textContent = t.card2Title;
        cards[1].querySelector('.tamm-card-sub').textContent = t.card2Sub;

        // Card 3
        cards[2].setAttribute('data-query', t.card3Query);
        cards[2].querySelector('.tamm-card-title').textContent = t.card3Title;
        cards[2].querySelector('.tamm-card-sub').textContent = t.card3Sub;
      }
    }

    const exploreText = document.getElementById('assistantExplorePromptsText');
    if (exploreText) {
      exploreText.textContent = isPromptsTrayOpen ? t.explorePromptsClose : t.explorePrompts;
    }

    const waLabel = document.getElementById('assistantWaHandoffLabel');
    if (waLabel) waLabel.textContent = t.waHandoffBarText;

    const waBtnText = document.getElementById('assistantWaHandoffBtnText');
    if (waBtnText) waBtnText.textContent = t.waHandoffBtn;

    const input = document.getElementById('assistantChatInput');
    if (input) input.placeholder = t.placeholder;

    const disclaimer = document.getElementById('assistantDisclaimerText');
    if (disclaimer) disclaimer.textContent = t.disclaimer;

    renderPromptsTray(lang);
  }

  // Render Expandable Prompt Pills in Tray
  function renderPromptsTray(lang) {
    const activeLang = lang || getActiveLanguage();
    const tray = document.getElementById('assistantPromptsTray');
    if (!tray) return;

    tray.innerHTML = '';
    const prompts = (I18N[activeLang] || I18N.en).prompts;

    prompts.forEach((item) => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'tamm-prompt-pill';
      pill.innerHTML = `<span>✨</span><span>${item.label}</span>`;
      pill.addEventListener('click', () => {
        if (isGenerating) return;
        executeUserTurn(item.query, item.label);
      });
      tray.appendChild(pill);
    });
  }

  // Append Chat Message Bubbles
  function appendMessage(sender, text, action, queryTopic) {
    const container = document.getElementById('assistantMessages');
    const scrollBody = document.getElementById('assistantBody');
    if (!container) return;

    if (sender === 'user') {
      const bubble = document.createElement('div');
      bubble.className = 'flex justify-end';
      bubble.innerHTML = `
        <div class="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-2xl rounded-tr-sm px-4 py-2.5 text-xs sm:text-sm max-w-[85%] shadow-md leading-relaxed">
          ${escapeHtml(text)}
        </div>
      `;
      container.appendChild(bubble);
    } else {
      const bubble = document.createElement('div');
      bubble.className = 'flex items-start gap-2.5 max-w-[95%]';
      bubble.innerHTML = `
        <div class="tamm-launcher-orb w-7 h-7 flex-shrink-0 text-xs shadow-md"></div>
        <div class="bg-slate-900/90 border border-slate-700/70 rounded-2xl rounded-tl-sm p-3.5 text-xs sm:text-sm text-slate-100 shadow-lg leading-relaxed flex-1">
          <div class="space-y-2 text-slate-200">${formatMarkdown(text)}</div>
          
          <div class="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            ${action ? `
              <a href="${action.url}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/35 transition-colors">
                ${action.label} →
              </a>
            ` : '<span></span>'}

            <a 
              href="https://wa.me/${CONFIG.phone}?text=${encodeURIComponent('Hi Starplus Travels, ' + (queryTopic || 'I would like to inquire with a concierge specialist.'))}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-xs font-bold border border-[#25D366]/30 transition-colors"
              title="Continue on WhatsApp with this request"
            >
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Continue on WhatsApp with this request</span>
            </a>
          </div>
        </div>
      `;
      container.appendChild(bubble);
    }

    if (scrollBody) scrollBody.scrollTop = scrollBody.scrollHeight;
  }

  // Update Dynamic WhatsApp Handoff Link with Session Context
  function updateWhatsAppHandoff(lastTopic) {
    const waLink = document.getElementById('assistantWaHandoffLink');
    if (!waLink) return;

    const currentLang = isSinhalaQuery(lastTopic) ? 'si' : getActiveLanguage();
    const t = I18N[currentLang] || I18N.en;

    const message = `${t.waPreMessage}"${lastTopic}". Please connect me with a concierge specialist for custom pricing and itinerary confirmation.`;
    waLink.href = `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(message)}`;
  }

  // Handle Turn-by-Turn Conversational Execution
  async function executeUserTurn(query, displayLabel) {
    const typingIndicator = document.getElementById('assistantTyping');
    const scrollBody = document.getElementById('assistantBody');

    isGenerating = true;
    appendMessage('user', displayLabel || query);
    sessionHistory.push({ role: 'user', content: query });

    // Show realistic typing animation
    if (typingIndicator) {
      typingIndicator.classList.remove('hidden');
      if (scrollBody) scrollBody.scrollTop = scrollBody.scrollHeight;
    }

    // Determine target response language
    const queryLang = isSinhalaQuery(query) ? 'si' : getActiveLanguage();

    try {
      // Natural processing delay
      const delay = Math.min(800, 350 + query.length * 8);
      await new Promise(r => setTimeout(r, delay));

      let result;
      if (engine && typeof engine.processUserTurn === 'function') {
        result = await engine.processUserTurn(query, queryLang);
      } else {
        result = generateGroundedResponse(query, queryLang);
      }

      if (typingIndicator) typingIndicator.classList.add('hidden');

      const action = result.actionLabel ? { label: result.actionLabel, url: result.actionUrl } : null;
      appendMessage(
        'assistant', 
        result.text, 
        action,
        result.handoffTopic || query
      );
      sessionHistory.push({ role: 'assistant', content: result.text });

      updateWhatsAppHandoff(result.handoffTopic || query);
    } catch (err) {
      console.error("Starplus Assistant execution error:", err);
      if (typingIndicator) typingIndicator.classList.add('hidden');
      const fallback = generateGroundedResponse(query, queryLang);
      appendMessage('assistant', fallback.text, null, query);
    } finally {
      isGenerating = false;
    }
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
