// js/translations.js
const translations = {
  en: {
    nav_home: "Home",
    nav_destinations: "Destinations",
    nav_packages: "Packages",
    nav_contact: "Contact Us",
    hero_title: "Explore the World with Star Plus Travels",
    hero_subtitle: "Curated luxury tours, seamless visa solutions, and unforgettable journeys.",
    card_best_season: "Best Season:",
    card_recommended: "Recommended:",
    card_starting_from: "Starting from:",
    card_view_details: "View Details",
    footer_rights: "All rights reserved."
  },
  si: {
    nav_home: "මුල් පිටුව",
    nav_destinations: "ගමනාන්ත",
    nav_packages: "පැකේජ",
    nav_contact: "අප අමතන්න",
    hero_title: "Star Plus Travels සමඟ ලොව වටා සංචාරය කරන්න",
    hero_subtitle: "විශේෂිත සුඛෝපභෝගී සංචාර, වීසා සේවා සහ අමතක නොවන අත්දැකීම්.",
    card_best_season: "හොඳම කාලය:",
    card_recommended: "නිර්දේශිත කාලය:",
    card_starting_from: "ආරම්භක මිල:",
    card_view_details: "විස්තර බලන්න",
    footer_rights: "සියලු හිමිකම් ඇවිරිණි."
  }
};

if (typeof window !== 'undefined') {
  window.translations = translations;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = translations;
}
