export const locales = ["en", "hi", "kn"] as const;
export type Locale = (typeof locales)[number];

export const translations = {
  en: {
    // Header top bar
    portalLabel: "Government Service Portal",
    portalSubtitle: "Official digital access point for welfare scheme discovery",
    // Language labels
    langEn: "EN",
    langHi: "हिंदी",
    langKn: "ಕನ್ನಡ",
    // Brand
    brandGovLine: "भारत सरकार | Government of India",
    brandName: "SchemeConnect",
    brandTagline: "Citizen welfare scheme guidance and official portal readiness support",
    nationalService: "National Service",
    secureInterface: "Secure public information interface",
    // Nav
    navHome: "Home",
    navEligibility: "Eligibility",
    navSchemes: "Schemes",
    // Auth
    loginCitizen: "Login",
    loginAdmin: "Admin",
    logout: "Logout",
    // Marquee
    marqueeText: "Citizens are advised to verify eligibility details before proceeding to the official application portal. Keep Aadhaar, bank-linked records, and residence documents ready.",
    // Loading page
    loadingTitle: "Opening your citizen portal",
    loadingSubtitle: "Please wait while we route you to login or your saved dashboard flow.",
    loadingLabel: "SchemeConnect Access",
  },
  hi: {
    portalLabel: "सरकारी सेवा पोर्टल",
    portalSubtitle: "कल्याण योजना खोज के लिए आधिकारिक डिजिटल पहुँच",
    langEn: "EN",
    langHi: "हिंदी",
    langKn: "ಕನ್ನಡ",
    brandGovLine: "भारत सरकार | Government of India",
    brandName: "SchemeConnect",
    brandTagline: "नागरिक कल्याण योजना मार्गदर्शन और आधिकारिक पोर्टल तत्परता सहायता",
    nationalService: "राष्ट्रीय सेवा",
    secureInterface: "सुरक्षित सार्वजनिक सूचना इंटरफ़ेस",
    navHome: "होम",
    navEligibility: "पात्रता",
    navSchemes: "योजनाएँ",
    loginCitizen: "लॉगिन",
    loginAdmin: "व्यवस्थापक",
    logout: "लॉग आउट",
    marqueeText: "नागरिकों को सलाह दी जाती है कि आधिकारिक आवेदन पोर्टल पर जाने से पहले पात्रता विवरण सत्यापित करें। आधार, बैंक-लिंक्ड रिकॉर्ड और निवास दस्तावेज़ तैयार रखें।",
    loadingTitle: "आपका नागरिक पोर्टल खुल रहा है",
    loadingSubtitle: "कृपया प्रतीक्षा करें जबकि हम आपको लॉगिन या डैशबोर्ड पर भेज रहे हैं।",
    loadingLabel: "SchemeConnect एक्सेस",
  },
  kn: {
    portalLabel: "ಸರ್ಕಾರಿ ಸೇವಾ ಪೋರ್ಟಲ್",
    portalSubtitle: "ಕಲ್ಯಾಣ ಯೋಜನೆ ಶೋಧನೆಗಾಗಿ ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ಪ್ರವೇಶ",
    langEn: "EN",
    langHi: "हिंदी",
    langKn: "ಕನ್ನಡ",
    brandGovLine: "ಭಾರತ ಸರ್ಕಾರ | Government of India",
    brandName: "SchemeConnect",
    brandTagline: "ನಾಗರಿಕ ಕಲ್ಯಾಣ ಯೋಜನೆ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಸಿದ್ಧತೆ ಬೆಂಬಲ",
    nationalService: "ರಾಷ್ಟ್ರೀಯ ಸೇವೆ",
    secureInterface: "ಸುರಕ್ಷಿತ ಸಾರ್ವಜನಿಕ ಮಾಹಿತಿ ಇಂಟರ್ಫೇಸ್",
    navHome: "ಮುಖಪುಟ",
    navEligibility: "ಅರ್ಹತೆ",
    navSchemes: "ಯೋಜನೆಗಳು",
    loginCitizen: "ಲಾಗಿನ್",
    loginAdmin: "ನಿರ್ವಾಹಕ",
    logout: "ಲಾಗ್ ಔಟ್",
    marqueeText: "ಅಧಿಕೃತ ಅರ್ಜಿ ಪೋರ್ಟಲ್‌ಗೆ ತೆರಳುವ ಮೊದಲು ಅರ್ಹತೆ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ನಾಗರಿಕರಿಗೆ ಸಲಹೆ ನೀಡಲಾಗಿದೆ। ಆಧಾರ್, ಬ್ಯಾಂಕ್ ದಾಖಲೆಗಳು ಮತ್ತು ವಾಸಸ್ಥಳ ದಾಖಲೆಗಳನ್ನು ಸಿದ್ಧವಾಗಿ ಇರಿಸಿ.",
    loadingTitle: "ನಿಮ್ಮ ನಾಗರಿಕ ಪೋರ್ಟಲ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ",
    loadingSubtitle: "ನಿಮ್ಮನ್ನು ಲಾಗಿನ್ ಅಥವಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ನಿರ್ದೇಶಿಸುವಾಗ ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ.",
    loadingLabel: "SchemeConnect ಪ್ರವೇಶ",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;