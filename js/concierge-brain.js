/**
 * Star Plus Travels - AI Concierge Grounded Knowledge Base ("concierge-brain.js")
 * Comprehensive knowledge base for Star Plus Travel & Tourism LLC (Dubai & Colombo)
 * Includes official visa rules, Sri Lanka holiday packages, multi-lingual responses,
 * Tabby financing, contacts, and conversational inference engine.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ConciergeKnowledge = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const KNOWLEDGE_BASE = {
    brand: {
      name: "Star Plus Travel & Tourism LLC",
      tagline: "Your Gateway to the World • Luxury Holidays, Flights & Visas",
      headquarters: "Al Maktoum Road, Deira, Dubai, United Arab Emirates",
      branchColombo: "Colombo, Western Province, Sri Lanka",
      established: "Premier accredited IATA and Department of Economy and Tourism (DET) partner"
    },
    contacts: {
      whatsapp: "+971 52 758 2293",
      whatsappRaw: "971527582293",
      landline: "+971 4 227 0005",
      dubaiOfficeDirect: "+971 4 575 1321",
      sriLankaLine1: "+94 76 696 9799",
      sriLankaLine2: "+94 76 611 9799",
      email: "info@starplustraveluae.com",
      website: "https://www.starplustraveluae.com/",
      workingHours: "7 Days a week • 9:00 AM – 10:00 PM (Gulf Standard Time / GST)"
    },
    visas: {
      uaeTouristVisas: [
        {
          type: "30-Day Single Entry Tourist Visa",
          validity: "60 days from issuance to enter UAE; 30 days stay from date of entry",
          pricing: "Starting from AED 330 (includes mandatory medical coverage)",
          extension: "Extendable inside UAE without exit"
        },
        {
          type: "60-Day Single Entry Tourist Visa",
          validity: "60 days from issuance to enter UAE; 60 days stay from date of entry",
          pricing: "Starting from AED 590 (includes mandatory medical coverage)",
          extension: "Extendable inside UAE without exit"
        },
        {
          type: "Multiple Entry Tourist Visas (30-day & 60-day)",
          validity: "Ideal for frequent business or leisure travel across GCC and regional hubs",
          pricing: "Competitive corporate & leisure rates"
        }
      ],
      processingTime: "Standard turnaround 24–48 hours; Express same-day service available upon request.",
      requiredDocuments: [
        "Color passport copy (minimum 6 months validity from prospective travel date)",
        "Recent passport-size photograph with white background",
        "Previous UAE visa/residence copy (if applicable, for expedited clearing)"
      ],
      highlights: "Zero embassy queues, 99.2% approval rate, 100% digital submission via WhatsApp or web portal."
    },
    sriLankaPackages: {
      overview: "Private chauffeur-driven luxury journeys across Sri Lanka with handpicked 4/5-star boutique hotels, VIP airport clearance, and custom pacing.",
      circuits: [
        {
          id: "heritage-culture",
          name: "Heritage & Cultural Triangle",
          highlights: "Sigiriya Rock Fortress (UNESCO citadel), Dambulla Cave Temple, Sacred Temple of the Tooth in Kandy, Polonnaruwa royal ruins.",
          recommendedDuration: "3 to 4 Days",
          idealFor: "History enthusiasts, cultural explorers, couples and families."
        },
        {
          id: "hill-country",
          name: "Scenic Hill Country & Tea Estates",
          highlights: "Nuwara Eliya colonial tea bungalows & Pedro Tea Estate masterclass, Ella Nine Arch Bridge, world-famous scenic blue train ride through misty misty pine peaks.",
          recommendedDuration: "2 to 3 Days",
          idealFor: "Nature lovers, scenic photography, romantic mountain escapes."
        },
        {
          id: "wildlife-safari",
          name: "Wildlife & Safari Expeditions",
          highlights: "Yala National Park leopard safaris, Udawalawe elephant transit home & gathering, Minneriya elephant gathering.",
          recommendedDuration: "2 to 3 Days",
          idealFor: "Adventure seekers, wildlife photographers, family travelers."
        },
        {
          id: "southern-beaches",
          name: "Southern Beach Escapes & Coastal Luxury",
          highlights: "Bentota luxury water sports & private river boat safari, Mirissa whale and dolphin watching, historic Dutch Galle Fort walking tours.",
          recommendedDuration: "3 to 5 Days",
          idealFor: "Beach relaxation, sunset cocktails, coastal rejuvenation."
        }
      ],
      signatureItinerary: {
        name: "Wonders of Sri Lanka (6 Days / 5 Nights)",
        pricing: "From AED 2,150 per person (based on double occupancy)",
        inclusions: [
          "Hand-picked 4-star and 5-star boutique resort stays",
          "Daily gourmet buffet breakfast",
          "Dedicated private chauffeur-guide with climate-controlled luxury vehicle",
          "All toll charges, fuel, parking, and driver accommodations",
          "Airport VIP meet & greet at Colombo Bandaranaike International Airport (BIA)"
        ]
      },
      bespokeFlexibility: "100% customizable. Add private helicopter transfers, luxury boutique treehouses, Ayurvedic wellness retreats, or tailor day-by-day stops."
    },
    financing: {
      tabby: "Split holiday packages and visa applications into 4 interest-free monthly installments (0% interest, 0 hidden fees) via Tabby for UAE residents.",
      paymentMethods: "Credit/Debit Cards (Visa, MasterCard, Amex), Tabby, Wire Transfers, Cash at Dubai/Colombo offices."
    },
    flightAndTransfers: {
      flights: "Ticketing across Emirates, SriLankan Airlines, Flydubai, Qatar Airways, Etihad, and global carriers with exclusive baggage allowances.",
      transfers: "Executive luxury sedans, private SUVs, and VIP Mercedes Sprinters in Dubai (DXB/DWC) and Sri Lanka (BIA)."
    },
    languagesSupported: ["en", "si"],
    toneGuide: "Elite, hospitable, concise, reassuring, and conversion-focused."
  };

  /**
   * Conversational Knowledge Engine
   * Matches user inquiries, maintains multi-turn session context,
   * generates natural language grounded responses in English or Sinhala,
   * and provides optional external LLM (Gemini API) integration with zero-friction fallback.
   */
  class ConversationalEngine {
    constructor(options = {}) {
      this.kb = KNOWLEDGE_BASE;
      this.apiKey = options.apiKey || (typeof window !== 'undefined' && window.GEMINI_API_KEY) || null;
      this.apiModel = options.apiModel || "gemini-1.5-flash";
      this.chatHistory = [];
    }

    setApiKey(key) {
      this.apiKey = key;
    }

    clearHistory() {
      this.chatHistory = [];
    }

    isSinhala(text) {
      return /[\u0D80-\u0DFF]/.test(text);
    }

    /**
     * Determines whether an inquiry indicates booking/pricing intent that warrants WhatsApp handoff
     */
    isBookingOrPricingIntent(query) {
      const q = query.toLowerCase();
      const bookingKeywords = [
        'book', 'price', 'pricing', 'cost', 'quote', 'how much', 'rates', 'reserve',
        'customize', 'custom itinerary', 'package cost', 'visa fee', 'family of', 'tabby',
        'මිල', 'ගාස්තු', 'වෙන්කරන්න', 'සැලසුම්', 'කොපමණද', 'අයවැය'
      ];
      return bookingKeywords.some(kw => q.includes(kw));
    }

    /**
     * Build rich system prompt for LLM integration (Gemini)
     */
    getSystemPrompt() {
      return `You are the Starplus Luxury AI Concierge for Star Plus Travel & Tourism LLC (headquartered in Dubai, UAE & Colombo, Sri Lanka).
Your mission is to provide elite, hospitable, concise, reassuring, and conversion-focused travel advice grounded strictly in Starplus official services:
1. Brand & Contacts: WhatsApp: ${this.kb.contacts.whatsapp}, Landline: ${this.kb.contacts.landline}, Website: ${this.kb.contacts.website}.
2. UAE Tourist Visas: 30-Day and 60-Day visas (single and multiple entry). Fast turnaround 24-48 hours (express available). Only passport copy (min 6 months validity) and photo required.
3. Sri Lanka Packages: Private chauffeur-guided bespoke circuits including:
   - Heritage & Culture (Sigiriya, Kandy, Dambulla)
   - Scenic Hill Country & Tea Estates (Nuwara Eliya, Ella train)
   - Wildlife & Safari (Yala leopards, Udawalawe elephants)
   - Southern Beach Escapes (Bentota, Mirissa whales, Galle Fort)
   - Signature 6-Day Wonders of Sri Lanka from AED 2,150 per person.
4. Financing: 0% interest Tabby installments split into 4 months for UAE travelers.
5. Language: Respond in the exact language the user used (Fluent in English and Sinhala සිංහල).
Keep answers structured with bullet points, friendly, luxury-toned, and invite them to confirm travel dates on WhatsApp.`;
    }

    /**
     * Grounded Fallback Rule-Engine
     * Evaluates user prompt against Starplus Knowledge Base
     */
    generateGroundedResponse(query, languageOverride) {
      const q = query.toLowerCase();
      const lang = languageOverride || (this.isSinhala(query) ? 'si' : 'en');
      const isBookingIntent = this.isBookingOrPricingIntent(query);

      // Check Multi-Turn Context (Previous Queries)
      const previousUserTurn = this.chatHistory.filter(h => h.role === 'user').slice(-2, -1)[0];
      const prevContext = previousUserTurn ? previousUserTurn.content.toLowerCase() : '';

      // 1. Follow-up: Customization ("Can we customize day 3?", "Change hotel", "Customize")
      if (q.includes('customize') || q.includes('customise') || q.includes('day 3') || q.includes('change') || q.includes('tailor') || q.includes('වෙනස් කරන්න') || q.includes('සුවිශේෂී')) {
        if (lang === 'si') {
          return {
            text: `නියත වශයෙන්ම! අපගේ සියලුම සංචාරක සැලසුම් **100% ඔබගේ කැමැත්ත පරිදි වෙනස් කළ හැක (Fully Customizable)**.\n\n• **දිනෙන් දින සැලසුම:** 3 වන දිනයේ හෝ ඕනෑම දිනයක නවාතැන් හෝ නැරඹුම් ස්ථාන (උදා: ඇල්ල හෝ නුවරඑළිය අමතර රාත්‍රියක්) වෙනස් කළ හැක.\n• **හෝටල් පන්තිය:** තරු 4 හෝ 5 සුඛෝපභෝගී බුටික් හෝටල් සහ පෞද්ගලික විලා තෝරාගත හැක.\n• **පෞද්ගලික ප්‍රවාහනය:** ඔබගේ කණ්ඩායමට පමණක් වෙන්වූ කැපවූ AC වාහනය සහ පළපුරුදු රියදුරු-මඟපෙන්වන්නා.\n\nඔබගේ නිශ්චිත සංචාරක දින සහ වෙනස්කම් සඳහන් කර WhatsApp ඔස්සේ ක්ෂණික මිල ගණන් ලබාගන්න.`,
            actionLabel: "WhatsApp ඔස්සේ සැලසුම් කරන්න",
            actionUrl: `https://wa.me/${this.kb.contacts.whatsappRaw}?text=${encodeURIComponent('Hi Starplus Travels, I would like to customize an itinerary: ' + query)}`,
            handoffTopic: `Custom Itinerary: ${query}`,
            showWhatsAppHandoff: true
          };
        }
        return {
          text: `Absolutely! Every Starplus journey is **100% tailor-made to your pace and preferences**:\n\n• **Flexible Day-by-Day Adjustments:** Whether you wish to add an extra day in the Ella highlands, swap in a private leopard safari in Yala, or relax longer on Bentota beach, we adjust each day seamlessly.\n• **Boutique Accommodations:** Choose between colonial tea estate bungalows, 5-star beachfront resorts, or private rainforest eco-villas.\n• **Dedicated Chauffeur:** Your luxury climate-controlled vehicle and private chauffeur-guide remain exclusively with your party throughout.\n\nWould you like me to tailor this for your specific travel dates and number of guests on WhatsApp?`,
          actionLabel: "Tailor Itinerary on WhatsApp",
          actionUrl: `https://wa.me/${this.kb.contacts.whatsappRaw}?text=${encodeURIComponent('Hi Starplus Travels, I would like to customize an itinerary: ' + query)}`,
          handoffTopic: `Custom Itinerary: ${query}`,
          showWhatsAppHandoff: true
        };
      }

      // 2. Follow-up: Pricing for Family / Group ("How much for a family of four?", "Family rates")
      if (q.includes('family') || q.includes('four') || q.includes('group') || q.includes('how much for') || q.includes('2 adults') || q.includes('පවුලේ') || q.includes('සාමාජිකයින්')) {
        if (lang === 'si') {
          return {
            text: `පවුල් සහ කණ්ඩායම් සංචාර සඳහා අප සතුව **විශේෂ වට්ටම් සහිත පවුලේ පැකේජ (Family Packages)** ඇත:\n\n• **ශ්‍රී ලංකා දින 6 සංචාරය (4 දෙනෙකුගෙන් යුත් පවුලක් සඳහා):** එක් අයෙකුට AED 1,890 සිට විශේෂ ගාස්තු (දරුවන් සඳහා වට්ටම් සහිතව).\n• **ඇතුළත් දෑ:** ඉඩකඩ සහිත පවුලේ සුඛෝපභෝගී වෑන් රථයක් (Luxury Executive Van), පවුලේ කාමර හෝ එකිනෙක සම්බන්ධ කාමර (Connecting Rooms), සහ දිනපතා උදෑසන ආහාර.\n• **0% Tabby ගෙවීම්:** සම්පූර්ණ මුදල පොලී රහිතව මාස 4ක කොටස් වශයෙන් ගෙවිය හැක.\n\nඔබගේ දරුවන්ගේ වයස් සහ සංචාරක දිනයන් WhatsApp වෙත එවන්න, අප නිශ්චිත මිල ගණන් එවන්නෙමු.`,
            actionLabel: "පවුලේ පැකේජය විමසන්න",
            actionUrl: `https://wa.me/${this.kb.contacts.whatsappRaw}?text=${encodeURIComponent('Hi Starplus Travels, I would like a quotation for a family package: ' + query)}`,
            handoffTopic: `Family Package Quotation: ${query}`,
            showWhatsAppHandoff: true
          };
        }
        return {
          text: `For families and private groups, we offer **dedicated executive family rates with complimentary room upgrades** where available:\n\n• **Estimated Sri Lanka 6-Day Circuit for a Family of Four:** From approx. AED 1,890 – 2,100 per adult, with special subsidized child rates.\n• **Includes:** Spacious private high-roof luxury van (ample luggage capacity), interconnected or family deluxe suites, daily breakfast, and child-friendly tour pacing.\n• **0% Tabby Financing:** Split the entire family booking into 4 interest-free monthly payments.\n\nTell us your prospective dates and children's ages, and our team will provide a finalized family quotation on WhatsApp!`,
          actionLabel: "Get Family Quote on WhatsApp",
          actionUrl: `https://wa.me/${this.kb.contacts.whatsappRaw}?text=${encodeURIComponent('Hi Starplus Travels, I would like a quotation for a family package: ' + query)}`,
          handoffTopic: `Family Package Quotation: ${query}`,
          showWhatsAppHandoff: true
        };
      }

      // 3. UAE Visa Services & Requirements
      if (q.includes('visa') || q.includes('uae') || q.includes('tourist visa') || q.includes('entry') || q.includes('30-day') || q.includes('60-day') || q.includes('වීසා')) {
        if (lang === 'si') {
          return {
            text: `Star Plus Travels ආයතනය එක්සත් අරාබි එමීර් (UAE) සංචාරක වීසා කඩිනමින් නිකුත් කරයි:\n\n• **වීසා විකල්ප:** දින 30 සහ දින 60 සංචාරක වීසා (තනි සහ බහුවිධ ඇතුළුවීම් / Single & Multiple Entry).\n• **සැකසුම් කාලය:** පැය 24–48 ක සාමාන්‍ය අනුමැතිය (ක්ෂණික Express සේවාවද ඇත).\n• **අවශ්‍ය ලියකියවිලි:**\n  1. විදේශ ගමන් බලපත්‍රයේ පැහැදිලි පිටපතක් (මාස 6ක අවම වලංගුභාවය).\n  2. සුදු පසුබිම් සහිත විදේශ ගමන් බලපත්‍ර ප්‍රමාණයේ ඡායාරූපයක්.\n• **ගාස්තු:** දින 30 වීසා AED 330 සිට, දින 60 වීසා AED 590 සිට (සෞඛ්‍ය රක්ෂණය ඇතුළත්ය).\n• **Tabby පහසුකම:** 0% පොලී රහිතව මාස 4කින් ගෙවිය හැක.`,
            actionLabel: "වීසා අයදුම්පත WhatsApp වෙත",
            actionUrl: `https://wa.me/${this.kb.contacts.whatsappRaw}?text=${encodeURIComponent('Hi Starplus Travels, I would like to apply for a UAE Tourist Visa: ' + query)}`,
            handoffTopic: "UAE Tourist Visa Application",
            showWhatsAppHandoff: true
          };
        }
        return {
          text: `We issue official **UAE Tourist & Visit Visas** with guaranteed rapid processing and zero embassy visits:\n\n• **Available Categories:**\n  • **30-Day Tourist Visa:** Single or Multiple Entry (From AED 330).\n  • **60-Day Tourist Visa:** Single or Multiple Entry (From AED 590).\n• **Processing Timeline:** Fast 24–48 hours turnaround (Express same-day service available).\n• **Required Documents:**\n  1. Clear passport bio-data page copy (minimum 6 months validity).\n  2. Passport-sized color photo with white background.\n• **Financing:** Split visa fees into 4 interest-free installments with Tabby.\n\nSend your passport copy directly via WhatsApp to start processing today!`,
          actionLabel: "Apply for Visa on WhatsApp",
          actionUrl: `https://wa.me/${this.kb.contacts.whatsappRaw}?text=${encodeURIComponent('Hi Starplus Travels, I would like to apply for a UAE Tourist Visa: ' + query)}`,
          handoffTopic: "UAE Tourist Visa Application",
          showWhatsAppHandoff: true
        };
      }

      // 4. Sri Lanka Holiday Packages & Circuits
      if (q.includes('sri lanka') || q.includes('lanka') || q.includes('package') || q.includes('sigiriya') || q.includes('kandy') || q.includes('ella') || q.includes('nuwara eliya') || q.includes('yala') || q.includes('bentota') || q.includes('galle') || q.includes('ශ්‍රී ලංකා') || q.includes('සංචාරක පැකේජ')) {
        if (lang === 'si') {
          return {
            text: `අපගේ වඩාත් ආකර්ෂණීය **ශ්‍රී ලංකා පෞද්ගලික සංචාරක පැකේජයන් (Curated Sri Lanka Tours)**:\n\n• **ඓතිහාසික සහ සංස්කෘතික:** සීගිරිය පර්වත බලකොටුව, දඹුල්ල රජමහා විහාරය, මහනුවර ශ්‍රී දළදා මාළිගාව.\n• **මනරම් කඳුකරය:** නුවරඑළිය තේ වතු, ඇල්ල නයින් ආච් පාලම සහ සුප්‍රකට නිල් දුම්රිය චාරිකාව.\n• **වනජීවී සෆාරි:** යාල දිවියන් සහ උඩවලව අලි ඇතුන් නැරඹීම.\n• **දකුණු වෙරළ තීරය:** බෙන්තොට ජල ක්‍රීඩා, මිරිස්ස තල්මසුන් නැරඹීම, ගාලු කොටුව.\n• **Wonders of Sri Lanka (දින 6 / රාත්‍රී 5):** එක් අයෙකුට AED 2,150 සිට (තරු 4/5 හෝටල්, AC වාහනය සහ රියදුරු ඇතුළත්ය).`,
            actionLabel: "සංචාරක විස්තර WhatsApp වෙත",
            actionUrl: `https://wa.me/${this.kb.contacts.whatsappRaw}?text=${encodeURIComponent('Hi Starplus Travels, I would like details on Sri Lanka Tour Packages: ' + query)}`,
            handoffTopic: "Sri Lanka Holiday Packages",
            showWhatsAppHandoff: true
          };
        }
        return {
          text: `Explore our signature **Sri Lanka Private Luxury Circuits**, operated with dedicated chauffeur-guides and premier boutique stays:\n\n• **Heritage & Culture:** Climb UNESCO-listed Sigiriya Citadel, explore Dambulla Golden Caves, and visit the Sacred Temple of the Tooth in Kandy.\n• **Scenic Hill Country & Tea Estates:** Colonial tea estates in Nuwara Eliya, Ella Nine Arch Bridge, and the scenic mountain train ride.\n• **Wildlife & Safari:** Leopard tracks in Yala National Park & elephant herds in Udawalawe.\n• **Southern Beach Escapes:** Golden sands in Bentota, blue whale safaris in Mirissa, and cobblestone walks in Galle Dutch Fort.\n• **Signature 6-Day Journey:** Starting at **AED 2,150 per person** (includes 4/5★ resorts, breakfast, chauffeur-guide, luxury AC vehicle, & transfers).\n\n100% bespoke customization available on request!`,
          actionLabel: "Inquire on WhatsApp",
          actionUrl: `https://wa.me/${this.kb.contacts.whatsappRaw}?text=${encodeURIComponent('Hi Starplus Travels, I would like details on Sri Lanka Tour Packages: ' + query)}`,
          handoffTopic: "Sri Lanka Holiday Packages",
          showWhatsAppHandoff: true
        };
      }

      // 5. Contacts, Phone, Office Locations
      if (q.includes('contact') || q.includes('phone') || q.includes('call') || q.includes('whatsapp') || q.includes('location') || q.includes('office') || q.includes('address') || q.includes('email') || q.includes('දුරකථන') || q.includes('කාර්යාලය')) {
        if (lang === 'si') {
          return {
            text: `**Star Plus Travel & Tourism LLC** සබඳතා තොරතුරු:\n\n• **WhatsApp (ක්ෂණික සහය):** ${this.kb.contacts.whatsapp}\n• **ඩුබායි දුරකථන:** ${this.kb.contacts.landline} / ${this.kb.contacts.dubaiOfficeDirect}\n• **ශ්‍රී ලංකා කාර්යාලය:** ${this.kb.contacts.sriLankaLine1} / ${this.kb.contacts.sriLankaLine2}\n• **විද්‍යුත් තැපෑල:** ${this.kb.contacts.email}\n• **වෙබ් අඩවිය:** ${this.kb.contacts.website}\n• **කාර්යාල:** Deira, Dubai (UAE) සහ කොළඹ (ශ්‍රී ලංකාව).\n• **සේවා කාලය:** සතියේ දින 7ම පෙ.ව. 9:00 සිට ප.ව. 10:00 දක්වා.`,
            actionLabel: "සෘජුව WhatsApp අමතන්න",
            actionUrl: `https://wa.me/${this.kb.contacts.whatsappRaw}?text=${encodeURIComponent('Hi Starplus Travels, I would like to get in touch with your team.')}`,
            handoffTopic: "General Contact Inquiry",
            showWhatsAppHandoff: true
          };
        }
        return {
          text: `**Star Plus Travel & Tourism LLC** Direct Concierge Contacts:\n\n• **WhatsApp Concierge:** ${this.kb.contacts.whatsapp} (Direct replies in under 5 minutes)\n• **Dubai Landline:** ${this.kb.contacts.landline}\n• **Dubai Office Direct:** ${this.kb.contacts.dubaiOfficeDirect}\n• **Sri Lanka Branch:** ${this.kb.contacts.sriLankaLine1} | ${this.kb.contacts.sriLankaLine2}\n• **Official Website:** ${this.kb.contacts.website}\n• **Email:** ${this.kb.contacts.email}\n• **Locations:** Al Maktoum Road, Deira, Dubai, UAE & Colombo, Sri Lanka.\n• **Operating Hours:** 7 Days a week • 9:00 AM – 10:00 PM GST.`,
          actionLabel: "Chat on WhatsApp Now",
          actionUrl: `https://wa.me/${this.kb.contacts.whatsappRaw}?text=${encodeURIComponent('Hi Starplus Travels, I would like to get in touch with your team.')}`,
          handoffTopic: "General Contact Inquiry",
          showWhatsAppHandoff: true
        };
      }

      // 6. Capability Card 1: What can you do for me?
      if (q.includes('what can you do') || q.includes('do for me') || q.includes('capabilities') || q.includes('සේවාවන් මොනවාද')) {
        if (lang === 'si') {
          return {
            text: `මම ඔබගේ පුද්ගලික **Starplus සුඛෝපභෝගී AI සංචාරක සහයකයා** වෙමි. මට පහත සේවාවන් ක්ෂණිකව ලබාදිය හැක:\n\n• **ශ්‍රී ලංකා පෞද්ගලික චාරිකා:** සීගිරිය, නුවරඑළිය, ඇල්ල, යාල සහ බෙන්තොට සුඛෝපභෝගී සංචාර.\n• **UAE සංචාරක වීසා (දින 30/60):** පැය 24–48 කින් කඩිනම් නිකුත් කිරීම සහ සහතික කළ අනුමැතිය.\n• **සුවිශේෂී සංචාරක සැලසුම්:** ඔබගේ දින සහ අයවැයට ගැලපෙන පරිදි 100% වෙනස් කළ හැකි සැලසුම්.\n• **ගුවන් ප්‍රවේශපත්‍ර & VIP ප්‍රවාහන:** Emirates, SriLankan Airlines ඇතුළු ගුවන් ටිකට්පත් සහ VIP වාහන.\n• **0% Tabby පහසුකම:** මාස 4ක පොලී රහිත ගෙවීම්.`,
            actionLabel: "පැකේජයන් නරඹන්න",
            actionUrl: "/packages.html",
            handoffTopic: "Starplus Services Overview",
            showWhatsAppHandoff: isBookingIntent
          };
        }
        return {
          text: `I am your dedicated **Starplus Luxury AI Concierge**, engineered to assist with end-to-end travel curation:\n\n• **Bespoke Sri Lanka Holiday Circuits:** Sigiriya, Kandy, Nuwara Eliya tea estates, Ella mountain train, Yala wildlife safaris, and Bentota beaches.\n• **Fast-Track UAE Visas:** 30-Day and 60-Day tourist permits with 24–48hr turnaround and zero paperwork friction.\n• **Tailor-Made Route Planning:** Day-by-day customized circuits designed around your dates and party size in 5 minutes.\n• **VIP Airport Transfers & Flights:** Worldwide flight ticketing and executive chauffeured transport across Dubai and Colombo.\n• **Flexible 0% Tabby Financing:** Split holiday packages and visas into 4 interest-free monthly payments.`,
          actionLabel: "Explore Holiday Packages",
          actionUrl: "/packages.html",
          handoffTopic: "Starplus Services Overview",
          showWhatsAppHandoff: isBookingIntent
        };
      }

      // 7. Capability Card 2: Frequently Asked Questions
      if (q.includes('frequently asked') || q.includes('faq') || q.includes('නිතර අසන')) {
        if (lang === 'si') {
          return {
            text: `සංචාරකයින් නිතර විමසන ප්‍රධාන තොරතුරු මෙන්න:\n\n• **UAE වීසා සඳහා අවශ්‍ය මොනවාද?** පාස්පෝට් පිටපතක් (මාස 6ක වලංගු) සහ ඡායාරූපයක් පමණි. පැය 24–48 කින් නිකුත් වේ.\n• **ශ්‍රී ලංකා පැකේජවලට ඇතුළත් මොනවාද?** තරු 4/5 හෝටල්, උදෑසන ආහාර, පෞද්ගලික AC වාහනය සහ පළපුරුදු රියදුරු-මඟපෙන්වන්නා.\n• **පැකේජ වෙනස් කළ හැකිද?** ඔව්, ඕනෑම සැලැස්මක් ඔබ කැමති පරිදි 100% වෙනස් කළ හැක.\n• **ගෙවීම් ක්‍රම මොනවාද?** කාඩ්පත්, බැංකු තැන්පතු, සහ Tabby 0% පොලී රහිත මාස 4ක ගෙවීම්.`,
            actionLabel: "නිතර අසන ප්‍රශ්න පිටුව",
            actionUrl: "/faq.html",
            handoffTopic: "Frequently Asked Questions",
            showWhatsAppHandoff: isBookingIntent
          };
        }
        return {
          text: `Here are concise answers to our travelers' most common questions:\n\n• **What is needed for a UAE Tourist Visa?** Clear passport copy (valid for 6+ months) and passport-size photo. Standard approvals take 24–48 hours.\n• **What is included in Sri Lanka holiday packages?** 4/5★ luxury resort accommodations, daily breakfast, private chauffeur-guide, climate-controlled vehicle, and airport transfers.\n• **Can tours be personalized?** Yes, every single itinerary is 100% customizable to your exact dates, route, and party size.\n• **Can I pay in installments?** Yes, UAE travelers can split payments over 4 months with 0% interest via Tabby.`,
          actionLabel: "View Full FAQ Page",
          actionUrl: "/faq.html",
          handoffTopic: "Frequently Asked Questions",
          showWhatsAppHandoff: isBookingIntent
        };
      }

      // 8. General / Fallback Response
      if (lang === 'si') {
        return {
          text: `ස්තූතියි ඔබගේ විමසීමට! **Star Plus Travel & Tourism LLC** ආයතනය ශ්‍රී ලංකා පෞද්ගලික සුඛෝපභෝගී සංචාර, එක්සත් අරාබි එමීර් (UAE) සංචාරක වීසා, ගුවන් ප්‍රවේශපත්‍ර සහ හෝටල් වෙන්කිරීම් සඳහා විශේෂඥ සේවාවක් සපයයි.\n\nඔබගේ සංචාරක දිනයන්, පිරිවර හෝ අපේක්ෂිත සේවාව සඳහන් කරන්න, නැතහොත් අපගේ ජ්‍යෙෂ්ඨ උපදේශක කණ්ඩායම සමඟ WhatsApp ඔස්සේ සෘජුව සම්බන්ධ වන්න.`,
          actionLabel: "WhatsApp සහය ලබාගන්න",
          actionUrl: `https://wa.me/${this.kb.contacts.whatsappRaw}?text=${encodeURIComponent('Hi Starplus Travels, I have an inquiry: ' + query)}`,
          handoffTopic: query,
          showWhatsAppHandoff: true
        };
      }
      return {
        text: `Thank you for reaching out! **Star Plus Travel & Tourism LLC** specializes in curated Sri Lanka holiday circuits, rapid 30/60-day UAE tourist visas, tailor-made itineraries, and VIP transfers.\n\nTell me your prospective travel dates, destination interests, or party size, and I will be delighted to guide you, or connect you directly with our senior concierge desk on WhatsApp.`,
        actionLabel: "Connect on WhatsApp",
        actionUrl: `https://wa.me/${this.kb.contacts.whatsappRaw}?text=${encodeURIComponent('Hi Starplus Travels, I have an inquiry: ' + query)}`,
        handoffTopic: query,
        showWhatsAppHandoff: true
      };
    }

    /**
     * Main Turn Processor:
     * Attempts external Gemini API call if GEMINI_API_KEY is configured,
     * otherwise falls back to the comprehensive grounded conversational engine seamlessly.
     */
    async processUserTurn(query, languageOverride) {
      this.chatHistory.push({ role: 'user', content: query });
      const lang = languageOverride || (this.isSinhala(query) ? 'si' : 'en');
      const isBookingIntent = this.isBookingOrPricingIntent(query);

      // 1. If Gemini API key is present, attempt dynamic generation
      if (this.apiKey) {
        try {
          const geminiResponse = await this.callGeminiApi(query, lang);
          if (geminiResponse) {
            this.chatHistory.push({ role: 'assistant', content: geminiResponse });
            return {
              text: geminiResponse,
              actionLabel: isBookingIntent ? (lang === 'si' ? "WhatsApp ඔස්සේ තහවුරු කරන්න" : "Continue on WhatsApp with this request") : null,
              actionUrl: `https://wa.me/${this.kb.contacts.whatsappRaw}?text=${encodeURIComponent('Hi Starplus Travels, I would like to proceed with my inquiry: ' + query)}`,
              handoffTopic: query,
              showWhatsAppHandoff: isBookingIntent
            };
          }
        } catch (err) {
          console.warn("Starplus Concierge: Gemini API fallback engaged:", err);
        }
      }

      // 2. High-fidelity Grounded Knowledge Base Engine
      const groundedResult = this.generateGroundedResponse(query, lang);
      this.chatHistory.push({ role: 'assistant', content: groundedResult.text });
      return groundedResult;
    }

    /**
     * Gemini REST API Caller
     */
    async callGeminiApi(query, lang) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.apiModel}:generateContent?key=${this.apiKey}`;
      const contents = [];

      // System instruction as first user/model framing
      contents.push({
        role: "user",
        parts: [{ text: this.getSystemPrompt() }]
      });
      contents.push({
        role: "model",
        parts: [{ text: "Understood. I am the Starplus Luxury AI Concierge, grounded strictly in Star Plus Travel & Tourism LLC's official offerings." }]
      });

      // Append multi-turn history (up to last 6 turns)
      const recentHistory = this.chatHistory.slice(-6);
      recentHistory.forEach(turn => {
        contents.push({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.content }]
        });
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 600,
            topP: 0.95
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        return data.candidates[0].content.parts.map(p => p.text).join('\n').trim();
      }
      return null;
    }
  }

  return {
    KNOWLEDGE_BASE: KNOWLEDGE_BASE,
    ConversationalEngine: ConversationalEngine,
    engineInstance: new ConversationalEngine()
  };
});
