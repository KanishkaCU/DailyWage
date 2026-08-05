import React, { createContext, useContext, useState } from "react";

export const translations = {
  en: {
    // Nav
    dashboard: "Dashboard",
    addWorker: "Add Worker",
    attendance: "Attendance",
    reports: "Reports",
    logout: "Logout",
    owner: "Owner",
    tagline: "Attendance & Salary Manager",

    // Dashboard
    welcome: "Welcome",
    totalWorkers: "Total Workers",
    presentToday: "Present Today",
    todaysSalaryGiven: "Today's Salary Given",
    workers: "Workers",
    searchPlaceholder: "Search by name or phone...",
    name: "Name",
    phone: "Phone",
    today: "Today",
    actions: "Actions",
    details: "Details",
    noWorkersFound: "No workers found. Click 'Add Worker' to get started.",
    logAttendanceBtn: "Log Attendance",
    notMarked: "Not Marked",

    // Attendance
    attendanceTitle: "Attendance",
    saveAll: "Save All",
    save: "Save",
    saved: "Saved",
    saving: "Saving...",
    present: "Present",
    halfDay: "Half Day",
    absent: "Absent",
    salaryAmount: "Salary Amount (₹)",
    enterAmount: "Enter amount",
    workersMovedMsg: "Workers marked Present or Half Day will move to the Reports page and reappear here tomorrow.",
    allMarkedMsg: "All workers have been marked for today. Check the Reports page.",
    noWorkersDateMsg: "No workers to show for this date.",
    attendanceSaved: "Attendance saved successfully",
    enterSalaryWarn: "Please enter the salary amount before saving",
    noUnsavedChanges: "No unsaved changes",

    // Reports
    reportsTitle: "Reports",
    reportsSubtitle: "View worker attendance and salary data by date",
    exportCsv: "Export CSV",
    print: "Print",
    period: "Period:",
    todayPreset: "Today",
    yesterdayPreset: "Yesterday",
    thisWeekPreset: "This Week",
    thisMonthPreset: "This Month",
    customRange: "Custom Range",
    startDate: "Start Date",
    endDate: "End Date",
    searchWorker: "Search worker...",
    totalSalary: "Total Salary",
    workerReport: "Worker Report",
    records: "records",
    workerName: "Worker Name",
    totalSalaryGivenCol: "Total Salary Given",
    noDataDate: "No attendance data found for the selected date.",

    // Add Worker
    addWorkerSubtitle: "Register new workers to your team",
    workerNameLabel: "Worker Name",
    phoneNumberLabel: "Phone Number",
    enterValidPhone: "Enter a valid 10-digit phone number.",
    enterNameAndPhone: "Please enter worker name and phone number.",
    workerAddedSuccess: "Worker added successfully.",
    failedAddWorker: "Failed to add worker.",
    allWorkers: "All Workers",
    total: "total",
    adding: "Adding...",

    // Worker Details
    back: "Back",
    recordPayment: "Record Payment",
    amountRupees: "Amount (₹)",
    reason: "Reason (e.g. Advance)",
    addPaymentBtn: "Add Payment",
    paymentHistory: "Payment History",
    attendanceHistory: "Attendance History",
    date: "Date",
    status: "Status",
    salary: "Salary",
    noPayments: "No payments yet.",
    noAttendanceLogged: "No attendance logged yet.",

    // Login
    loginTab: "Log In",
    signupTab: "Sign Up",
    usernameLabel: "Username",
    emailLabel: "Email",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm Password",
    signInBtn: "Sign In",
    createAccountBtn: "Create Account",
    authenticating: "Authenticating...",
    selectLanguage: "Language",
  },

  hi: {
    // Nav
    dashboard: "डैशबोर्ड",
    addWorker: "कर्मचारी जोड़ें",
    attendance: "उपस्थिति",
    reports: "रिपोर्ट्स",
    logout: "लॉग आउट",
    owner: "मालिक",
    tagline: "उपस्थिति और वेतन प्रबंधक",

    // Dashboard
    welcome: "स्वागत है",
    totalWorkers: "कुल कर्मचारी",
    presentToday: "आज उपस्थित",
    todaysSalaryGiven: "आज दिया गया वेतन",
    workers: "कर्मचारी",
    searchPlaceholder: "नाम या फोन से खोजें...",
    name: "नाम",
    phone: "फोन",
    today: "आज",
    actions: "कार्रवाई",
    details: "विवरण",
    noWorkersFound: "कोई कर्मचारी नहीं मिला। शुरू करने के लिए 'कर्मचारी जोड़ें' पर क्लिक करें।",
    logAttendanceBtn: "उपस्थिति दर्ज करें",
    notMarked: "दर्ज नहीं",

    // Attendance
    attendanceTitle: "उपस्थिति",
    saveAll: "सभी सहेजें",
    save: "सहेजें",
    saved: "सहेजा गया",
    saving: "सहेजा जा रहा है...",
    present: "उपस्थित",
    halfDay: "आधा दिन",
    absent: "अनुपस्थित",
    salaryAmount: "वेतन राशि (₹)",
    enterAmount: "राशि दर्ज करें",
    workersMovedMsg: "उपस्थित या आधा दिन दर्ज कर्मचारियों की जानकारी रिपोर्ट पेज पर दिखेगी और कल फिर यहाँ दिखेगी।",
    allMarkedMsg: "आज के लिए सभी कर्मचारियों की उपस्थिति दर्ज कर ली गई है। रिपोर्ट पेज देखें।",
    noWorkersDateMsg: "इस तिथि के लिए कोई कर्मचारी नहीं है।",
    attendanceSaved: "उपस्थिति सफलतापूर्वक सहेजी गई",
    enterSalaryWarn: "कृपया सहेजने से पहले वेतन राशि दर्ज करें",
    noUnsavedChanges: "कोई अनसहेजे बदलाव नहीं हैं",

    // Reports
    reportsTitle: "रिपोर्ट्स",
    reportsSubtitle: "तिथि के अनुसार कर्मचारी उपस्थिति और वेतन डेटा देखें",
    exportCsv: "CSV निर्यात करें",
    print: "प्रिंट करें",
    period: "अवधि:",
    todayPreset: "आज",
    yesterdayPreset: "कल",
    thisWeekPreset: "इस सप्ताह",
    thisMonthPreset: "इस महीने",
    customRange: "कस्टम रेंज",
    startDate: "प्रारंभ तिथि",
    endDate: "अंतिम तिथि",
    searchWorker: "कर्मचारी खोजें...",
    totalSalary: "कुल वेतन",
    workerReport: "कर्मचारी रिपोर्ट",
    records: "रिकॉर्ड",
    workerName: "कर्मचारी नाम",
    totalSalaryGivenCol: "दिया गया कुल वेतन",
    noDataDate: "चयनित तिथि के लिए कोई उपस्थिति डेटा नहीं मिला।",

    // Add Worker
    addWorkerSubtitle: "अपनी टीम में नए कर्मचारी जोड़ें",
    workerNameLabel: "कर्मचारी का नाम",
    phoneNumberLabel: "फोन नंबर",
    enterValidPhone: "वैध 10-अंकीय फोन नंबर दर्ज करें।",
    enterNameAndPhone: "कृपया कर्मचारी का नाम और फोन नंबर दर्ज करें।",
    workerAddedSuccess: "कर्मचारी सफलतापूर्वक जोड़ा गया।",
    failedAddWorker: "कर्मचारी जोड़ने में विफल।",
    allWorkers: "सभी कर्मचारी",
    total: "कुल",
    adding: "जोड़ा जा रहा है...",

    // Worker Details
    back: "वापस",
    recordPayment: "भुगतान दर्ज करें",
    amountRupees: "राशि (₹)",
    reason: "कारण (उदा. अग्रिम)",
    addPaymentBtn: "भुगतान जोड़ें",
    paymentHistory: "भुगतान इतिहास",
    attendanceHistory: "उपस्थिति इतिहास",
    date: "तिथि",
    status: "स्थिति",
    salary: "वेतन",
    noPayments: "अभी तक कोई भुगतान नहीं।",
    noAttendanceLogged: "अभी तक कोई उपस्थिति दर्ज नहीं की गई।",

    // Login
    loginTab: "लॉग इन",
    signupTab: "साइन अप",
    usernameLabel: "उपयोगकर्ता नाम",
    emailLabel: "ईमेल",
    passwordLabel: "पासवर्ड",
    confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
    signInBtn: "साइन इन करें",
    createAccountBtn: "खाता बनाएं",
    authenticating: "प्रमाणीकरण हो रहा है...",
    selectLanguage: "भाषा",
  },

  ta: {
    // Nav
    dashboard: "டேஷ்போர்டு",
    addWorker: "பணியாளரைச் சேர்க்க",
    attendance: "வருகைப் பதிவு",
    reports: "அறிக்கைகள்",
    logout: "வெளியேறு",
    owner: "உரிமையாளர்",
    tagline: "வருகை மற்றும் சம்பள மேலாளர்",

    // Dashboard
    welcome: "வரவேற்கிறோம்",
    totalWorkers: "மொத்த பணியாளர்கள்",
    presentToday: "இன்று வந்தவர்கள்",
    todaysSalaryGiven: "இன்று வழங்கப்பட்ட சம்பளம்",
    workers: "பணியாளர்கள்",
    searchPlaceholder: "பெயர் அல்லது போன் மூலமாகத் தேடுக...",
    name: "பெயர்",
    phone: "போன்",
    today: "இன்று",
    actions: "செயல்கள்",
    details: "விவரங்கள்",
    noWorkersFound: "பணியாளர்கள் இல்லை. தொடங்க 'பணியாளரைச் சேர்க்க' என்பதைக் கிளிக் செய்யவும்.",
    logAttendanceBtn: "வருகைப் பதிவு செய்க",
    notMarked: "பதிவாகவில்லை",

    // Attendance
    attendanceTitle: "வருகைப் பதிவு",
    saveAll: "அனைத்தையும் சேமிக்க",
    save: "சேமிக்க",
    saved: "சேமிக்கப்பட்டது",
    saving: "சேமிக்கப்படுகிறது...",
    present: "வந்துள்ளது",
    halfDay: "அரை நாள்",
    absent: "வரவில்லை",
    salaryAmount: "சம்பள தொகை (₹)",
    enterAmount: "தொகையை உள்ளிடவும்",
    workersMovedMsg: "வந்துள்ளது/அரை நாள் எனப் பதிவானவர்கள் அறிக்கைகள் பக்கத்திற்குச் செல்வர், நாளை மீண்டும் இங்கு வருவர்.",
    allMarkedMsg: "இன்றைய வருகைப் பதிவு நிறைவடைந்தது. அறிக்கைகள் பக்கத்தைப் பார்க்கவும்.",
    noWorkersDateMsg: "இந்தத் தேதிக்கு பணியாளர்கள் இல்லை.",
    attendanceSaved: "வருகைப் பதிவு வெற்றிகரமாகச் சேமிக்கப்பட்டது",
    enterSalaryWarn: "சேமிப்பதற்கு முன் சம்பளத் தொகையை உள்ளிடவும்",
    noUnsavedChanges: "சேமிக்கப்படாத மாற்றங்கள் இல்லை",

    // Reports
    reportsTitle: "அறிக்கைகள்",
    reportsSubtitle: "தேதி வாரியாக வருகை மற்றும் சம்பளத் தரவைப் பார்க்கவும்",
    exportCsv: "CSV ஏற்றுமதி",
    print: "அச்சிடுக",
    period: "காலகட்டம்:",
    todayPreset: "இன்று",
    yesterdayPreset: "நேற்று",
    thisWeekPreset: "இந்த வாரம்",
    thisMonthPreset: "இந்த மாதம்",
    customRange: "தேதி வரம்பு",
    startDate: "ஆரம்ப தேதி",
    endDate: "முடிவு தேதி",
    searchWorker: "பணியாளரைத் தேடுக...",
    totalSalary: "மொத்த சம்பளம்",
    workerReport: "பணியாளர் அறிக்கை",
    records: "பதிவுகள்",
    workerName: "பணியாளர் பெயர்",
    totalSalaryGivenCol: "வழங்கப்பட்ட மொத்த சம்பளம்",
    noDataDate: "தேர்ந்தெடுக்கப்பட்ட தேதிக்கு வருகைத் தரவு எதுவும் இல்லை.",

    // Add Worker
    addWorkerSubtitle: "உங்கள் குழுவில் புதிய பணியாளர்களைச் சேர்க்கவும்",
    workerNameLabel: "பணியாளர் பெயர்",
    phoneNumberLabel: "போன் எண்",
    enterValidPhone: "சரியான 10 இலக்க போன் எண்ணை உள்ளிடவும்.",
    enterNameAndPhone: "பணியாளர் பெயர் மற்றும் போன் எண்ணை உள்ளிடவும்.",
    workerAddedSuccess: "பணியாளர் வெற்றிகரமாகச் சேர்க்கப்பட்டார்.",
    failedAddWorker: "பணியாளரைச் சேர்க்க முடியவில்லை.",
    allWorkers: "அனைத்து பணியாளர்கள்",
    total: "மொத்தம்",
    adding: "சேர்க்கப்படுகிறது...",

    // Worker Details
    back: "பின்னால்",
    recordPayment: "பணம் செலுத்துதலைப் பதிவு செய்க",
    amountRupees: "தொகை (₹)",
    reason: "காரணம் (எ.கா. முன்பணம்)",
    addPaymentBtn: "பணம் சேர்க்க",
    paymentHistory: "பணப் பரிவர்த்தனை வரலாறு",
    attendanceHistory: "வருகைப் பதிவு வரலாறு",
    date: "தேதி",
    status: "நிலை",
    salary: "சம்பளம்",
    noPayments: "இன்னும் செலுத்துதல்கள் இல்லை.",
    noAttendanceLogged: "இன்னும் வருகைப் பதிவு செய்யப்படவில்லை.",

    // Login
    loginTab: "லாகின்",
    signupTab: "சைன் அப்",
    usernameLabel: "பயனர் பெயர்",
    emailLabel: "மின்னஞ்சல்",
    passwordLabel: "கடவுச்சொல்",
    confirmPasswordLabel: "கடவுச்சொல்லை உறுதிப்படுத்துக",
    signInBtn: "உள்நுழைக",
    createAccountBtn: "கணக்கை உருவாக்குக",
    authenticating: "சரிபார்க்கிறது...",
    selectLanguage: "மொழி",
  },

  te: {
    // Nav
    dashboard: "డాష్‌బోర్డ్",
    addWorker: "వర్కర్‌ను జోడించు",
    attendance: "హాజరు",
    reports: "రిపోర్టులు",
    logout: "లాగ్ అవుట్",
    owner: "యజమాని",
    tagline: "హాజరు మరియు జీతం మేనేజర్",

    // Dashboard
    welcome: "స్వాగతం",
    totalWorkers: "మొత్తం వర్కర్లు",
    presentToday: "ఈరోజు హాజరైనవారు",
    todaysSalaryGiven: "ఈరోజు ఇచ్చిన జీతం",
    workers: "వర్కర్లు",
    searchPlaceholder: "పేరు లేదా ఫోన్ నంబర్‌ ద్వారా వెతకండి...",
    name: "పేరు",
    phone: "ఫోన్",
    today: "ఈరోజు",
    actions: "చర్యలు",
    details: "వివరాలు",
    noWorkersFound: "ఏ వర్కర్లు లేరు. ప్రారంభించడానికి 'వర్కర్‌ను జోడించు' క్లిక్ చేయండి.",
    logAttendanceBtn: "హాజరు నమోదు చేయండి",
    notMarked: "నమోదు కాలేదు",

    // Attendance
    attendanceTitle: "హాజరు",
    saveAll: "అన్నీ సేవ్ చేయండి",
    save: "సేవ్",
    saved: "సేవ్ చేయబడింది",
    saving: "సేవ్ అవుతోంది...",
    present: "హాజరు",
    halfDay: "హాఫ్ డే",
    absent: "గైర్హాజరు",
    salaryAmount: "జీతం మొత్తం (₹)",
    enterAmount: "మొత్తం నమోదు చేయండి",
    workersMovedMsg: "హాజరు లేదా హాఫ్ డే నమోదైన వర్కర్లు రిపోర్టుల పేజీకి బదిలీ అవుతారు, రేపు మళ్లీ ఇక్కడ కనిపిస్తారు.",
    allMarkedMsg: "ఈరోజుకు వర్కర్ల హాజరు పూర్తయింది. రిపోర్టుల పేజీ చూడండి.",
    noWorkersDateMsg: "ఈ తేదీకి వర్కర్లు లేరు.",
    attendanceSaved: "హాజరు విజయవంతంగా సేవ్ చేయబడింది",
    enterSalaryWarn: "దయచేసి సేవ్ చేసే ముందు జీతం మొత్తం నమోదు చేయండి",
    noUnsavedChanges: "సేవ్ కాని మార్పులు లేవు",

    // Reports
    reportsTitle: "రిపోర్టులు",
    reportsSubtitle: "తేదీ వారీగా వర్కర్ హాజరు మరియు జీతం వివరాలు చూడండి",
    exportCsv: "CSV ఎగుమతి",
    print: "ప్రింట్",
    period: "సమయం:",
    todayPreset: "ఈరోజు",
    yesterdayPreset: "నిన్న",
    thisWeekPreset: "ఈ వారం",
    thisMonthPreset: "ఈ నెల",
    customRange: "కస్టమ్ రేంజ్",
    startDate: "ప్రారంభ తేదీ",
    endDate: "ముగింపు తేదీ",
    searchWorker: "వర్కర్‌ను వెతకండి...",
    totalSalary: "మొత్తం జీతం",
    workerReport: "వర్కర్ రిపోర్ట్",
    records: "నమోదులు",
    workerName: "వర్కర్ పేరు",
    totalSalaryGivenCol: "ఇచ్చిన మొత్తం జీతం",
    noDataDate: "ఎంచుకున్న తేదీకి హాజరు వివరాలు లేవు.",

    // Add Worker
    addWorkerSubtitle: "మీ టీమ్‌లో కొత్త వర్కర్లను జోడించండి",
    workerNameLabel: "వర్కర్ పేరు",
    phoneNumberLabel: "ఫోన్ నంబర్",
    enterValidPhone: "సరైన 10 అంకెల ఫోన్ నంబర్ నమోదు చేయండి.",
    enterNameAndPhone: "దయచేసి వర్కర్ పేరు మరియు ఫోన్ నంబర్ నమోదు చేయండి.",
    workerAddedSuccess: "వర్కర్ విజయవంతంగా జోడించబడ్డారు.",
    failedAddWorker: "వర్కర్ జోడించడం విఫలమైంది.",
    allWorkers: "అందరు వర్కర్లు",
    total: "మొత్తం",
    adding: "జోడిస్తోంది...",

    // Worker Details
    back: "వెనుకకు",
    recordPayment: "చెల్లింపు నమోదు చేయండి",
    amountRupees: "మొత్తం (₹)",
    reason: "కారణం (ఉదా. అడ్వాన్స్)",
    addPaymentBtn: "చెల్లింపు జోడించు",
    paymentHistory: "చెల్లింపుల హిస్టరీ",
    attendanceHistory: "హాజరు హిస్టరీ",
    date: "తేదీ",
    status: "స్టేటస్",
    salary: "జీతం",
    noPayments: "ఇంకా చెల్లింపులు లేవు.",
    noAttendanceLogged: "ఇంకా హాజరు నమోదు కాలేదు.",

    // Login
    loginTab: "లాగిన్",
    signupTab: "సైన్ అప్",
    usernameLabel: "యూజర్‌నేమ్",
    emailLabel: "ఈమెయిల్",
    passwordLabel: "పాస్‌వర్డ్",
    confirmPasswordLabel: "పాస్‌వర్డ్ నిర్ధారించండి",
    signInBtn: "సైన్ ఇన్ చేయండి",
    createAccountBtn: "ఖాతా సృష్టించండి",
    authenticating: "పరిశీలిస్తోంది...",
    selectLanguage: "భాష",
  },

  ml: {
    // Nav
    dashboard: "ഡാഷ്‌ബോർഡ്",
    addWorker: "തൊഴിലാളിയെ ചേർക്കുക",
    attendance: "ഹാജർ",
    reports: "റിപ്പോർട്ടുകൾ",
    logout: "ലോഗ് ഔട്ട്",
    owner: "ഉടമ",
    tagline: "ഹാജർ & ശമ്പള മാനേജർ",

    // Dashboard
    welcome: "സ്വാഗതം",
    totalWorkers: "ആകെ തൊഴിലാളികൾ",
    presentToday: "ഇന്ന് ഹാജരായവർ",
    todaysSalaryGiven: "ഇന്ന് നൽകിയ ശമ്പളം",
    workers: "തൊഴിലാളികൾ",
    searchPlaceholder: "പേര് അല്ലെങ്കിൽ ഫോൺ തിരയുക...",
    name: "പേര്",
    phone: "ഫോൺ",
    today: "ഇന്ന്",
    actions: "നടപടികൾ",
    details: "വിവരങ്ങൾ",
    noWorkersFound: "തൊഴിലാളികളെ കണ്ടെത്തിയില്ല. ആരംഭിക്കാൻ 'തൊഴിലാളിയെ ചേർക്കുക' ക്ലിക്ക് ചെയ്യുക.",
    logAttendanceBtn: "ഹാജർ രേഖപ്പെടുത്തുക",
    notMarked: "രേഖപ്പെടുത്തിയിട്ടില്ല",

    // Attendance
    attendanceTitle: "ഹാജർ",
    saveAll: "എല്ലാം സേവ് ചെയ്യുക",
    save: "സേവ്",
    saved: "സേവ് ചെയ്തു",
    saving: "സേവ് ചെയ്യുന്നു...",
    present: "ഹാജർ",
    halfDay: "ഹാഫ് ഡേ",
    absent: "ഗൈർഹാജർ",
    salaryAmount: "ശമ്പള തുക (₹)",
    enterAmount: "തുക നൽകുക",
    workersMovedMsg: "ഹാജർ അല്ലെങ്കിൽ ഹാഫ് ഡേ രേഖപ്പെടുത്തിയ തൊഴിലാളികൾ റിപ്പോർട്ട് പേജിലേക്ക് മാറും, നാളെ വീണ്ടും ഇവിടെ കാണാം.",
    allMarkedMsg: "ഇന്നത്തെ ഹാജർ പൂർത്തിയായി. റിപ്പോർട്ട് പേജ് പരിശോധിക്കുക.",
    noWorkersDateMsg: "ഈ തീയതിയിൽ തൊഴിലാളികളില്ല.",
    attendanceSaved: "ഹാജർ വിജയകരമായി സേവ് ചെയ്തു",
    enterSalaryWarn: "സേവ് ചെയ്യുന്നതിന് മുമ്പ് ശമ്പള തുക നൽകുക",
    noUnsavedChanges: "സേവ് ചെയ്യാത്ത മാറ്റങ്ങളൊന്നുമില്ല",

    // Reports
    reportsTitle: "റിപ്പോർട്ടുകൾ",
    reportsSubtitle: "തീയതി തിരിച്ച് ഹാജർ, ശമ്പള വിവരങ്ങൾ കാണുക",
    exportCsv: "CSV എക്സ്പോർട്ട്",
    print: "പ്രിന്റ്",
    period: "കാലയളവ്:",
    todayPreset: "ഇന്ന്",
    yesterdayPreset: "ഇന്നലെ",
    thisWeekPreset: "ഈ ആഴ്ച",
    thisMonthPreset: "ഈ മാസം",
    customRange: "കസ്റ്റം റേഞ്ച്",
    startDate: "ആരംഭ തീയതി",
    endDate: "അവസാന തീയതി",
    searchWorker: "തൊഴിലാളിയെ തിരയുക...",
    totalSalary: "ആകെ ശമ്പളം",
    workerReport: "തൊഴിലാളി റിപ്പോർട്ട്",
    records: "റെക്കോർഡുകൾ",
    workerName: "തൊഴിലാളിയുടെ പേര്",
    totalSalaryGivenCol: "നൽകിയ ആകെ ശമ്പളം",
    noDataDate: "തിരഞ്ഞെടുത്ത തീയതിയിൽ ഹാജർ വിവരങ്ങളൊന്നുമില്ല.",

    // Add Worker
    addWorkerSubtitle: "നിങ്ങളുടെ ടീമിലേക്ക് പുതിയ തൊഴിലാളികളെ ചേർക്കുക",
    workerNameLabel: "തൊഴിലാളിയുടെ പേര്",
    phoneNumberLabel: "ഫോൺ നമ്പർ",
    enterValidPhone: "കൃത്യമായ 10 അക്ക ഫോൺ നമ്പർ നൽകുക.",
    enterNameAndPhone: "തൊഴിലാളിയുടെ പേരും ഫോൺ നമ്പറും നൽകുക.",
    workerAddedSuccess: "തൊഴിലാളിയെ വിജയകരമായി ചേർത്തു.",
    failedAddWorker: "തൊഴിലാളിയെ ചേർക്കാൻ സാധിച്ചില്ല.",
    allWorkers: "എല്ലാ തൊഴിലാളികളും",
    total: "ആകെ",
    adding: "ചേർക്കുന്നു...",

    // Worker Details
    back: "തിരികെ",
    recordPayment: "പണമടയ്ക്കൽ രേഖപ്പെടുത്തുക",
    amountRupees: "തുക (₹)",
    reason: "കാരണം (ഉദാ. അഡ്വാൻസ്)",
    addPaymentBtn: "പണം ചേർക്കുക",
    paymentHistory: "പണമിടപാട് ചരിത്രം",
    attendanceHistory: "ഹാജർ ചരിത്രം",
    date: "തീയതി",
    status: "സ്റ്റാറ്റസ്",
    salary: "ശമ്പളം",
    noPayments: "ഇതുവരെ പണമടയ്ക്കലുകളൊന്നുമില്ല.",
    noAttendanceLogged: "ഇതുവരെ ഹാജർ രേഖപ്പെടുത്തിയിട്ടില്ല.",

    // Login
    loginTab: "ലോഗിൻ",
    signupTab: "സൈൻ അപ്പ്",
    usernameLabel: "യൂസർനെയിം",
    emailLabel: "ഇമെയിൽ",
    passwordLabel: "പാസ്‌വേഡ്",
    confirmPasswordLabel: "പാസ്‌വേഡ് ഉറപ്പാക്കുക",
    signInBtn: "സൈൻ ഇൻ",
    createAccountBtn: "അക്കൗണ്ട് ഉണ്ടാക്കുക",
    authenticating: "പരിശോധിക്കുന്നു...",
    selectLanguage: "ഭാഷ",
  },
};

export const LanguageContext = createContext();

export const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी (Hindi)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "ml", label: "മലയാളം (Malayalam)" },
];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("app_language") || "en";
  });

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguageState(langCode);
      localStorage.setItem("app_language", langCode);
    }
  };

  const t = (key) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
