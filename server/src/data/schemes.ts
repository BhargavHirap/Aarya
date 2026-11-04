// ⚠️ Developer must verify every URL / amount / date on the official portal
// before production use. Do NOT invent scheme data.

export interface Scheme {
  id: string;
  nameMr: string;
  nameEn: string;
  category: string;
  summaryMr: string;
  summaryEn: string;
  eligibilityMr: string;
  eligibilityEn: string;
  documents: string[];
  applicationStepsMr: string[];
  applicationStepsEn: string[];
  officialUrl: string;
  lastVerified: string;
  sourceLabel: string;
}

export const schemes: Scheme[] = [
  {
    id: 'post-matric-sc',
    nameMr: 'पोस्ट-मॅट्रिक शिष्यवृत्ती (SC/ST)',
    nameEn: 'Post-Matric Scholarship (SC/ST)',
    category: 'Scholarship',
    summaryMr: 'SC/ST विद्यार्थ्यांसाठी उच्च शिक्षण शिष्यवृत्ती.',
    summaryEn: 'Scholarship for SC/ST students pursuing higher education.',
    eligibilityMr: 'SC/ST प्रवर्ग, कुटुंब उत्पन्न मर्यादा, मान्यताप्राप्त संस्थेत प्रवेश.',
    eligibilityEn: 'SC/ST category, income limit, enrolled in a recognised institution.',
    documents: ['Caste certificate', 'Income certificate', 'Aadhaar', 'Bank passbook', 'Marksheet'],
    applicationStepsMr: ['scholarships.gov.in वर नोंदणी करा', 'अर्ज भरा', 'कागदपत्रे अपलोड करा', 'सबमिट करा'],
    applicationStepsEn: ['Register on scholarships.gov.in', 'Fill the application', 'Upload documents', 'Submit'],
    officialUrl: 'https://scholarships.gov.in',
    lastVerified: '2024-01-01',
    sourceLabel: 'Official portal',
  },
  {
    id: 'mahadbt',
    nameMr: 'महाडीबीटी योजना',
    nameEn: 'MahaDBT Scholarship Schemes',
    category: 'Scholarship',
    summaryMr: 'महाराष्ट्रातील विद्यार्थ्यांसाठी विविध शिष्यवृत्ती.',
    summaryEn: 'Various scholarship schemes for Maharashtra students.',
    eligibilityMr: 'महाराष्ट्र रहिवासी, विशिष्ट प्रवर्ग/उत्पन्न मर्यादा.',
    eligibilityEn: 'Maharashtra resident, specific category / income limits.',
    documents: ['Domicile', 'Income certificate', 'Caste certificate (if applicable)', 'Aadhaar', 'Bank passbook'],
    applicationStepsMr: ['mahadbt.maharashtra.gov.in वर नोंदणी करा', 'योजना निवडा', 'अर्ज भरा'],
    applicationStepsEn: ['Register on mahadbt.maharashtra.gov.in', 'Select scheme', 'Fill application'],
    officialUrl: 'https://mahadbt.maharashtra.gov.in',
    lastVerified: '2024-01-01',
    sourceLabel: 'Government of Maharashtra',
  },
  {
    id: 'css',
    nameMr: 'केंद्रीय क्षेत्र शिष्यवृत्ती',
    nameEn: 'Central Sector Scheme of Scholarship',
    category: 'Scholarship',
    summaryMr: 'उच्च शिक्षणासाठी केंद्र सरकारची शिष्यवृत्ती.',
    summaryEn: 'Central government scholarship for higher education.',
    eligibilityMr: '12 वी नंतरचे विद्यार्थी, विशिष्ट टक्के.',
    eligibilityEn: 'Students after class 12, minimum percentage.',
    documents: ['Marksheet', 'Income certificate', 'Aadhaar', 'Bank passbook'],
    applicationStepsMr: ['scholarships.gov.in वर अर्ज करा'],
    applicationStepsEn: ['Apply on scholarships.gov.in'],
    officialUrl: 'https://scholarships.gov.in',
    lastVerified: '2024-01-01',
    sourceLabel: 'Government of India',
  },
  {
    id: 'nmms',
    nameMr: 'राष्ट्रीय साधन-सह-गुणवत्ता शिष्यवृत्ती',
    nameEn: 'National Means-cum-Merit Scholarship',
    category: 'Education',
    summaryMr: 'इयत्ता 8 ते 12 साठी शिष्यवृत्ती.',
    summaryEn: 'Scholarship for classes 8 to 12.',
    eligibilityMr: 'इयत्ता 8 उत्तीर्ण, उत्पन्न मर्यादा.',
    eligibilityEn: 'Passed class 8, income limit.',
    documents: ['Marksheet', 'Income certificate', 'Bank passbook'],
    applicationStepsMr: ['शाळेमार्फत अर्ज करा'],
    applicationStepsEn: ['Apply through your school'],
    officialUrl: 'https://scholarships.gov.in',
    lastVerified: '2024-01-01',
    sourceLabel: 'Government of India',
  },
  {
    id: 'ladki-bahin',
    nameMr: 'मुख्यमंत्री माझी लाडकी बहीण योजना',
    nameEn: 'Mukhyamantri Majhi Ladki Bahin Yojana',
    category: 'Welfare',
    summaryMr: 'महाराष्ट्रातील पात्र महिलांसाठी आर्थिक मदत.',
    summaryEn: 'Financial assistance for eligible women in Maharashtra.',
    eligibilityMr: 'महाराष्ट्र रहिवासी महिला, वय व उत्पन्न मर्यादा.',
    eligibilityEn: 'Maharashtra resident women, age and income limits.',
    documents: ['Aadhaar', 'Domicile', 'Bank passbook', 'Income certificate'],
    applicationStepsMr: ['अधिकृत पोर्टलवर नोंदणी करा'],
    applicationStepsEn: ['Register on the official portal'],
    officialUrl: 'https://ladkibahin.maharashtra.gov.in',
    lastVerified: '2024-01-01',
    sourceLabel: 'Government of Maharashtra',
  },
  {
    id: 'pmjay',
    nameMr: 'आयुष्मान भारत (PM-JAY)',
    nameEn: 'Ayushman Bharat (PM-JAY)',
    category: 'Health / Welfare',
    summaryMr: 'पात्र कुटुंबांसाठी आरोग्य विमा.',
    summaryEn: 'Health insurance for eligible families.',
    eligibilityMr: 'SECC आधारित पात्रता.',
    eligibilityEn: 'SECC-based eligibility.',
    documents: ['Aadhaar', 'Ration card'],
    applicationStepsMr: ['pmjay.gov.in वर पात्रता तपासा'],
    applicationStepsEn: ['Check eligibility on pmjay.gov.in'],
    officialUrl: 'https://pmjay.gov.in',
    lastVerified: '2024-01-01',
    sourceLabel: 'Government of India',
  },
];
