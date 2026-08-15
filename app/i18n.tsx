"use client";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import generatedTranslations from "./translations.generated.json";
import { homeTranslations } from "./translations.home";
export type Lang = string;
export type LanguageOption = {
  locale: string;
  name: string;
  native_name: string;
  sort_order?: number;
};
const defaultLanguages: LanguageOption[] = [
  { locale: "en", name: "English", native_name: "English" },
  { locale: "hi", name: "Hindi", native_name: "हिन्दी" },
  { locale: "mr", name: "Marathi", native_name: "मराठी" },
  { locale: "ta", name: "Tamil", native_name: "தமிழ்" },
  { locale: "bn", name: "Bengali", native_name: "বাংলা" },
];
const C = createContext<{
  language: Lang;
  languages: LanguageOption[];
  setLanguage: (l: Lang) => void;
}>({ language: "en", languages: defaultLanguages, setLanguage: () => {} });

function canonicalLocale(value: string) {
  const locale = String(value || "en").trim().toLowerCase().replace("_", "-");
  if (locale === "bengali" || locale === "ben" || locale.startsWith("bn-")) return "bn";
  if (locale === "hindi" || locale === "hin" || locale.startsWith("hi-")) return "hi";
  if (locale === "marathi" || locale === "mar" || locale.startsWith("mr-")) return "mr";
  if (locale === "tamil" || locale === "tam" || locale.startsWith("ta-")) return "ta";
  if (locale === "bhojpuri" || locale.startsWith("bho-")) return "bho";
  if (locale.startsWith("en-")) return "en";
  return locale;
}
const hi: Record<string, string> = {
  Home: "होम",
  "About Us": "हमारे बारे में",
  "Get Help": "सहायता पाएं",
  "Our Impact": "हमारा प्रभाव",
  "Partner With Us": "हमसे जुड़ें",
  Resources: "संसाधन",
  "Donate Now": "अभी दान करें",
  "Direct Financial Support": "प्रत्यक्ष वित्तीय सहायता",
  "The Vision for an": "एक समावेशी भारत",
  "Inclusive India": "की परिकल्पना",
  "Direct Financial Support for the Underprivileged Divyangjan of Uttar Pradesh.":
    "उत्तर प्रदेश के वंचित दिव्यांगजनों के लिए प्रत्यक्ष वित्तीय सहायता।",
  "Empowering Every Child to Move Beyond Disability. Starting with U.P., Aiming for India.":
    "हर बच्चे को दिव्यांगता से आगे बढ़ने में सशक्त बनाना। शुरुआत उत्तर प्रदेश से, लक्ष्य पूरा भारत।",
  "Apply for Aid": "सहायता के लिए आवेदन करें",
  "Partner With Us (CSR)": "हमसे जुड़ें (सीएसआर)",
  "Kids Supported": "बच्चों को सहायता",
  "Districts (U.P.)": "जिले (उ.प्र.)",
  "Impact Zones": "प्रभाव क्षेत्र",
  "Lives Touched": "लाभान्वित जीवन",
  Overview: "परिचय",
  "The Impact Map": "प्रभाव मानचित्र",
  "Expanding across 75 districts of U.P.":
    "उत्तर प्रदेश के सभी 75 जिलों में विस्तार।",
  "Our Core Focus Areas": "हमारे प्रमुख कार्य क्षेत्र",
  "Deaf & Mute": "श्रवण एवं वाणी बाधित",
  Blind: "दृष्टिबाधित",
  "Mentally Challenged": "बौद्धिक दिव्यांगता",
  "Learn More →": "और जानें →",
  "Our Roadmap": "हमारी कार्ययोजना",
  "A Specialized Model. A Replicable Impact.": "विशेष मॉडल। व्यापक प्रभाव।",
  "What We Do: Our Core Services": "हम क्या करते हैं: मुख्य सेवाएं",
  "Cochlear Life-Support": "कॉक्लियर जीवन-सहायता",
  "Digital Empowerment": "डिजिटल सशक्तिकरण",
  "Therapeutic Aid": "चिकित्सकीय सहायता",
  "The Problem We Solve": "हम जिस समस्या का समाधान करते हैं",
  "Our Scale": "हमारा विस्तार",
  "Why Partner With Us?": "हमारे साथ क्यों जुड़ें?",
  "We are here for you.": "हम आपकी सहायता के लिए हैं।",
  "Chat on WhatsApp": "व्हाट्सऐप पर बात करें",
  "Beyond Disability Helpline": "बियॉन्ड डिसएबिलिटी हेल्पलाइन",
  "Email Support": "ईमेल सहायता",
  "Our Support Centers": "हमारे सहायता केंद्र",
  "How It Works (3 Simple Steps)": "यह कैसे काम करता है (3 आसान चरण)",
  "Apply Online": "ऑनलाइन आवेदन करें",
  "Upload Documents": "दस्तावेज़ अपलोड करें",
  "Verification & Support": "सत्यापन और सहायता",
  "Documents Required": "आवश्यक दस्तावेज़",
  "Need Help Filling the Form?": "फॉर्म भरने में सहायता चाहिए?",
  "Apply for Financial Aid": "वित्तीय सहायता के लिए आवेदन करें",
  "Submit Application / आवेदन जमा करें": "आवेदन जमा करें",
  "Child / Applicant name": "बच्चे / आवेदक का नाम",
  "Mobile number": "मोबाइल नंबर",
  District: "जिला",
  "Support needed": "आवश्यक सहायता",
  "Tell us what support is needed": "बताएं कि किस सहायता की आवश्यकता है",
  "UDID Card": "यूडीआईडी कार्ड",
  "Income Certificate": "आय प्रमाण पत्र",
  "Select district": "जिला चुनें",
  "I confirm that the information provided is correct.":
    "मैं पुष्टि करता/करती हूं कि दी गई जानकारी सही है।",
  "Partner in Our Growth": "हमारी प्रगति में भागीदार बनें",
  "Join Hands. Change Lives.": "हाथ मिलाएं। जीवन बदलें।",
  "Corporate Partnerships (CSR)": "कॉर्पोरेट भागीदारी (सीएसआर)",
  "What You Get": "आपको क्या मिलेगा",
  "Start a CSR Conversation": "सीएसआर संवाद शुरू करें",
  "Company / Organisation": "कंपनी / संस्था",
  "Contact person": "संपर्क व्यक्ति",
  "Email address": "ईमेल पता",
  "Phone number": "फोन नंबर",
  "How would you like to partner?": "आप किस प्रकार भागीदारी करना चाहेंगे?",
  "Send CSR Enquiry": "सीएसआर पूछताछ भेजें",
  "Download CSR Brochure": "सीएसआर विवरणिका डाउनलोड करें",
  "Support Our Mission": "हमारे मिशन का समर्थन करें",
  "Every contribution creates a life-changing impact.":
    "हर योगदान जीवन बदलने वाला प्रभाव पैदा करता है।",
  "Choose a convenient way to contribute.": "योगदान का सुविधाजनक तरीका चुनें।",
  "One-time Donation": "एकमुश्त दान",
  "Monthly Donation": "मासिक दान",
  "Payment Options": "भुगतान विकल्प",
  "Net Banking": "नेट बैंकिंग",
  Wallets: "वॉलेट",
  "Scan & Pay": "स्कैन करें और भुगतान करें",
  "Donate Now Securely 🔒": "सुरक्षित रूप से दान करें 🔒",
  "Information that helps families move forward.":
    "परिवारों को आगे बढ़ने में मदद करने वाली जानकारी।",
  "News & Updates": "समाचार और अपडेट",
  "Reports & Downloads": "रिपोर्ट और डाउनलोड",
  "Frequently Asked Questions": "अक्सर पूछे जाने वाले प्रश्न",
  "Privacy & Document Safety": "गोपनीयता और दस्तावेज़ सुरक्षा",
  "Who can apply for aid?": "सहायता के लिए कौन आवेदन कर सकता है?",
  "Which documents are required?": "कौन से दस्तावेज़ आवश्यक हैं?",
  "How long does verification take?": "सत्यापन में कितना समय लगता है?",
  "Quick Links": "त्वरित लिंक",
  "Our Services": "हमारी सेवाएं",
  Important: "महत्वपूर्ण",
  "Contact Us": "संपर्क करें",
  "Awareness & Advocacy": "जागरूकता और पैरवी",
  "Privacy Policy": "गोपनीयता नीति",
};
Object.assign(hi, {
  "At Beyond Disability Foundation, we believe that every individual deserves the opportunity to learn, grow, participate, and thrive—regardless of physical, sensory, developmental, or cognitive challenges.":
    "बियॉन्ड डिसएबिलिटी फाउंडेशन में हमारा विश्वास है कि शारीरिक, संवेदी, विकासात्मक या संज्ञानात्मक चुनौतियों के बावजूद हर व्यक्ति को सीखने, बढ़ने, भाग लेने और आगे बढ़ने का अवसर मिलना चाहिए।",
  "Our mission is to empower persons with disabilities and their families by promoting inclusion, accessibility, education, awareness, and equal opportunities. We work to support individuals with hearing impairment, visual impairment, autism spectrum disorder, and other disabilities, helping them lead independent, dignified, and fulfilling lives.":
    "हमारा मिशन समावेशन, सुगम्यता, शिक्षा, जागरूकता और समान अवसरों को बढ़ावा देकर दिव्यांगजनों और उनके परिवारों को सशक्त बनाना है। हम श्रवण बाधित, दृष्टिबाधित, ऑटिज़्म स्पेक्ट्रम और अन्य दिव्यांगताओं वाले व्यक्तियों को स्वतंत्र और सम्मानपूर्ण जीवन जीने में सहायता करते हैं।",
  "We envision a society where disability is not seen as a limitation but as a part of human diversity. Through advocacy, community engagement, financial assistance, support services, and partnerships, we strive to break barriers that prevent people with disabilities from reaching their full potential.":
    "हम ऐसे समाज की कल्पना करते हैं जहां दिव्यांगता को सीमा नहीं, बल्कि मानवीय विविधता का हिस्सा माना जाए। पैरवी, सामुदायिक सहभागिता, वित्तीय सहायता, सेवाओं और साझेदारियों के माध्यम से हम बाधाओं को दूर करने का प्रयास करते हैं।",
  "Beyond Disability is a foundation dedicated to ensuring that no child is held back by a lack of access to technology or maintenance. From the streets of Kanpur to the furthest corners of Uttar Pradesh, we are bridging the gap between disability and independence.":
    "बियॉन्ड डिसएबिलिटी यह सुनिश्चित करने के लिए समर्पित है कि तकनीक या रखरखाव की कमी से कोई बच्चा पीछे न रहे। कानपुर से उत्तर प्रदेश के दूरस्थ क्षेत्रों तक हम दिव्यांगता और आत्मनिर्भरता के बीच की दूरी कम कर रहे हैं।",
  "Empowering hearing-impaired children through cochlear support, therapy & education.":
    "कॉक्लियर सहायता, थेरेपी और शिक्षा के माध्यम से श्रवण बाधित बच्चों को सशक्त बनाना।",
  "Enabling visually impaired students with assistive technology & resources.":
    "सहायक तकनीक और संसाधनों से दृष्टिबाधित विद्यार्थियों को सक्षम बनाना।",
  "Supporting children with autism and other cognitive challenges through therapy & care.":
    "थेरेपी और देखभाल द्वारा ऑटिज़्म और अन्य संज्ञानात्मक चुनौतियों वाले बच्चों को सहयोग देना।",
  "Districts of U.P.": "उत्तर प्रदेश के जिले",
  "Therapies Funded": "वित्तपोषित थेरेपी",
  "Devices Provided": "उपकरण प्रदान किए",
  "We have built a sustainable model that addresses the real, recurring needs of Divyangjan. Our roadmap ensures we create deep impact at every level.":
    "हमने दिव्यांगजनों की वास्तविक और निरंतर जरूरतों को पूरा करने वाला टिकाऊ मॉडल बनाया है। हमारी कार्ययोजना हर स्तर पर गहरा प्रभाव सुनिश्चित करती है।",
  "Providing critical external parts—cables, batteries and coils—to ensure the Gift of Hearing never fades.":
    "सुनने की क्षमता बनाए रखने के लिए केबल, बैटरी और कॉइल जैसे आवश्यक बाहरी हिस्से उपलब्ध कराना।",
  "Equipping blind students with smartphones and laptops to unlock modern education.":
    "आधुनिक शिक्षा तक पहुंच के लिए दृष्टिबाधित विद्यार्थियों को स्मार्टफोन और लैपटॉप उपलब्ध कराना।",
  "Financial grants for specialized Autism, Speech and OT therapy for early intervention.":
    "प्रारंभिक हस्तक्षेप हेतु ऑटिज़्म, स्पीच और ओटी थेरेपी के लिए वित्तीय अनुदान।",
  "If you or your child is a person with disability and needs financial support for assistive devices, therapy, or maintenance, please reach out to us.":
    "यदि आप या आपका बच्चा दिव्यांग है और सहायक उपकरण, थेरेपी या रखरखाव के लिए वित्तीय सहायता चाहता है, तो हमसे संपर्क करें।",
  "Fill the application form with basic details.":
    "मूल विवरण के साथ आवेदन फॉर्म भरें।",
  "Upload UDID card, income certificate & required documents.":
    "यूडीआईडी कार्ड, आय प्रमाण पत्र और आवश्यक दस्तावेज़ अपलोड करें।",
  "Our team verifies your details & provides financial support.":
    "हमारी टीम विवरण सत्यापित कर वित्तीय सहायता प्रदान करती है।",
  "Secure digital verification": "सुरक्षित डिजिटल सत्यापन",
  "Upload clear photos or PDFs. Your documents are encrypted and only visible to the verification team.":
    "स्पष्ट फोटो या पीडीएफ अपलोड करें। आपके दस्तावेज़ सुरक्षित हैं और केवल सत्यापन टीम को दिखाई देते हैं।",
  "We are looking for Growth Partners who want to create significant, long-term impact in the lives of Divyangjan.":
    "हम ऐसे विकास भागीदारों की तलाश में हैं जो दिव्यांगजनों के जीवन में दीर्घकालिक और महत्वपूर्ण प्रभाव पैदा करना चाहते हैं।",
  "Your CSR can help us scale our impact across Uttar Pradesh and build a stronger, more inclusive India.":
    "आपका सीएसआर उत्तर प्रदेश में हमारे प्रभाव को बढ़ाने और अधिक समावेशी भारत बनाने में सहायता कर सकता है।",
  "Tell us about your organisation and the impact you want to create.":
    "अपनी संस्था और इच्छित सामाजिक प्रभाव के बारे में बताएं।",
  Reports: "रिपोर्ट",
  FAQs: "सामान्य प्रश्न",
});
const mr: Record<string, string> = {
  Home: "मुख्यपृष्ठ",
  "About Us": "आमच्याबद्दल",
  "Get Help": "मदत मिळवा",
  "Our Impact": "आमचा प्रभाव",
  "Partner With Us": "आमच्यासोबत भागीदारी करा",
  Resources: "संसाधने",
  "Donate Now": "आता देणगी द्या",
  "Direct Financial Support": "थेट आर्थिक सहाय्य",
  "The Vision for an": "समावेशक भारताची",
  "Inclusive India": "दृष्टी",
  "Apply for Aid": "सहाय्यासाठी अर्ज करा",
  "Partner With Us (CSR)": "आमच्यासोबत भागीदारी करा (CSR)",
  "Kids Supported": "मुलांना सहाय्य",
  "Districts (U.P.)": "जिल्हे (उ.प्र.)",
  "Impact Zones": "प्रभाव क्षेत्रे",
  "Lives Touched": "जीवनांवर प्रभाव",
  Overview: "आढावा",
  "The Impact Map": "प्रभाव नकाशा",
  "Our Core Focus Areas": "आमची प्रमुख कार्यक्षेत्रे",
  "Deaf & Mute": "श्रवण व वाणी बाधित",
  Blind: "दृष्टिहीन",
  "Mentally Challenged": "बौद्धिक दिव्यांगता",
  "Learn More →": "अधिक जाणून घ्या →",
  "Our Roadmap": "आमचा मार्गनकाशा",
  "What We Do: Our Core Services": "आम्ही काय करतो: प्रमुख सेवा",
  "Cochlear Life-Support": "कॉक्लिअर जीवन-सहाय्य",
  "Digital Empowerment": "डिजिटल सक्षमीकरण",
  "Therapeutic Aid": "उपचार सहाय्य",
  "The Problem We Solve": "आम्ही सोडवत असलेली समस्या",
  "Our Scale": "आमचा विस्तार",
  "We are here for you.": "आम्ही तुमच्यासाठी येथे आहोत.",
  "Chat on WhatsApp": "व्हॉट्सअॅपवर बोला",
  "How It Works (3 Simple Steps)": "हे कसे कार्य करते (3 सोप्या पायऱ्या)",
  "Documents Required": "आवश्यक कागदपत्रे",
  "Apply for Financial Aid": "आर्थिक सहाय्यासाठी अर्ज करा",
  "Child / Applicant name": "मुलाचे / अर्जदाराचे नाव",
  "Mobile number": "मोबाइल क्रमांक",
  District: "जिल्हा",
  "Support needed": "आवश्यक सहाय्य",
  "Submit Application / आवेदन जमा करें": "अर्ज सादर करा",
  "Partner in Our Growth": "आमच्या विकासात भागीदार व्हा",
  "Corporate Partnerships (CSR)": "कॉर्पोरेट भागीदारी (CSR)",
  "Start a CSR Conversation": "CSR संवाद सुरू करा",
  "Send CSR Enquiry": "CSR चौकशी पाठवा",
  "Support Our Mission": "आमच्या ध्येयाला साथ द्या",
  "One-time Donation": "एकवेळ देणगी",
  "Monthly Donation": "मासिक देणगी",
  "Payment Options": "पेमेंट पर्याय",
  "Donate Now Securely 🔒": "सुरक्षितपणे देणगी द्या 🔒",
  "News & Updates": "बातम्या आणि अद्यतने",
  "Frequently Asked Questions": "वारंवार विचारले जाणारे प्रश्न",
  "Privacy Policy": "गोपनीयता धोरण",
  "Quick Links": "द्रुत दुवे",
  "Our Services": "आमच्या सेवा",
  "Contact Us": "संपर्क करा",
};
const ta: Record<string, string> = {
  Home: "முகப்பு",
  "About Us": "எங்களைப் பற்றி",
  "Get Help": "உதவி பெறுங்கள்",
  "Our Impact": "எங்கள் தாக்கம்",
  "Partner With Us": "எங்களுடன் இணையுங்கள்",
  Resources: "வளங்கள்",
  "Donate Now": "இப்போது நன்கொடை அளிக்கவும்",
  "Direct Financial Support": "நேரடி நிதி உதவி",
  "The Vision for an": "அனைவரையும் உள்ளடக்கிய இந்தியா",
  "Inclusive India": "என்ற நோக்கு",
  "Apply for Aid": "உதவிக்கு விண்ணப்பிக்கவும்",
  "Partner With Us (CSR)": "எங்களுடன் இணையுங்கள் (CSR)",
  "Kids Supported": "ஆதரிக்கப்பட்ட குழந்தைகள்",
  "Districts (U.P.)": "மாவட்டங்கள் (உ.பி.)",
  "Impact Zones": "தாக்கப் பகுதிகள்",
  "Lives Touched": "பயனடைந்த வாழ்க்கைகள்",
  Overview: "கண்ணோட்டம்",
  "The Impact Map": "தாக்க வரைபடம்",
  "Our Core Focus Areas": "எங்கள் முக்கியப் பகுதிகள்",
  "Deaf & Mute": "கேட்கும் மற்றும் பேசும் குறைபாடு",
  Blind: "பார்வையற்றோர்",
  "Mentally Challenged": "அறிவுசார் மாற்றுத்திறன்",
  "Learn More →": "மேலும் அறிக →",
  "Our Roadmap": "எங்கள் செயல்திட்டம்",
  "What We Do: Our Core Services": "நாங்கள் செய்வது: முக்கிய சேவைகள்",
  "Cochlear Life-Support": "காக்லியர் வாழ்க்கை ஆதரவு",
  "Digital Empowerment": "டிஜிட்டல் அதிகாரமளித்தல்",
  "Therapeutic Aid": "சிகிச்சை உதவி",
  "The Problem We Solve": "நாங்கள் தீர்க்கும் பிரச்சினை",
  "Our Scale": "எங்கள் விரிவு",
  "We are here for you.": "உங்களுக்கு உதவ நாங்கள் இருக்கிறோம்.",
  "Chat on WhatsApp": "வாட்ஸ்அப்பில் பேசுங்கள்",
  "How It Works (3 Simple Steps)": "இது எப்படி செயல்படுகிறது (3 எளிய படிகள்)",
  "Documents Required": "தேவையான ஆவணங்கள்",
  "Apply for Financial Aid": "நிதி உதவிக்கு விண்ணப்பிக்கவும்",
  "Child / Applicant name": "குழந்தை / விண்ணப்பதாரர் பெயர்",
  "Mobile number": "மொபைல் எண்",
  District: "மாவட்டம்",
  "Support needed": "தேவையான உதவி",
  "Submit Application / आवेदन जमा करें": "விண்ணப்பத்தை சமர்ப்பிக்கவும்",
  "Partner in Our Growth": "எங்கள் வளர்ச்சியில் பங்கெடுங்கள்",
  "Corporate Partnerships (CSR)": "நிறுவன கூட்டாண்மைகள் (CSR)",
  "Start a CSR Conversation": "CSR உரையாடலைத் தொடங்குங்கள்",
  "Send CSR Enquiry": "CSR விசாரணையை அனுப்பவும்",
  "Support Our Mission": "எங்கள் பணியை ஆதரிக்கவும்",
  "One-time Donation": "ஒருமுறை நன்கொடை",
  "Monthly Donation": "மாதாந்திர நன்கொடை",
  "Payment Options": "கட்டண விருப்பங்கள்",
  "Donate Now Securely 🔒": "பாதுகாப்பாக நன்கொடை அளிக்கவும் 🔒",
  "News & Updates": "செய்திகள் மற்றும் புதுப்பிப்புகள்",
  "Frequently Asked Questions": "அடிக்கடி கேட்கப்படும் கேள்விகள்",
  "Privacy Policy": "தனியுரிமைக் கொள்கை",
  "Quick Links": "விரைவு இணைப்புகள்",
  "Our Services": "எங்கள் சேவைகள்",
  "Contact Us": "தொடர்பு கொள்ளுங்கள்",
};
const bn: Record<string, string> = {
  Home: "হোম",
  "About Us": "আমাদের সম্পর্কে",
  "Get Help": "সহায়তা নিন",
  "Our Impact": "আমাদের প্রভাব",
  "Partner With Us": "আমাদের সঙ্গে যুক্ত হন",
  Resources: "সম্পদ",
  "Donate Now": "এখন দান করুন",
  "Direct Financial Support": "সরাসরি আর্থিক সহায়তা",
  "The Vision for an": "অন্তর্ভুক্তিমূলক ভারতের",
  "Inclusive India": "স্বপ্ন",
  "Apply for Aid": "সহায়তার জন্য আবেদন করুন",
  "Partner With Us (CSR)": "আমাদের সঙ্গে যুক্ত হন (CSR)",
  "Kids Supported": "সহায়তাপ্রাপ্ত শিশু",
  "Districts (U.P.)": "জেলা (উ.প্র.)",
  "Impact Zones": "প্রভাব অঞ্চল",
  "Lives Touched": "উপকৃত জীবন",
  Overview: "সংক্ষিপ্ত বিবরণ",
  "The Impact Map": "প্রভাবের মানচিত্র",
  "Our Core Focus Areas": "আমাদের প্রধান ক্ষেত্র",
  "Deaf & Mute": "শ্রবণ ও বাক প্রতিবন্ধী",
  Blind: "দৃষ্টিহীন",
  "Mentally Challenged": "বুদ্ধিবৃত্তিক প্রতিবন্ধকতা",
  "Learn More →": "আরও জানুন →",
  "Our Roadmap": "আমাদের রোডম্যাপ",
  "What We Do: Our Core Services": "আমরা যা করি: প্রধান সেবা",
  "Cochlear Life-Support": "কক্লিয়ার জীবন-সহায়তা",
  "Digital Empowerment": "ডিজিটাল ক্ষমতায়ন",
  "Therapeutic Aid": "থেরাপিউটিক সহায়তা",
  "The Problem We Solve": "যে সমস্যার সমাধান করি",
  "Our Scale": "আমাদের বিস্তার",
  "We are here for you.": "আমরা আপনার পাশে আছি।",
  "Chat on WhatsApp": "হোয়াটসঅ্যাপে কথা বলুন",
  "How It Works (3 Simple Steps)": "এটি যেভাবে কাজ করে (৩টি সহজ ধাপ)",
  "Documents Required": "প্রয়োজনীয় নথি",
  "Apply for Financial Aid": "আর্থিক সহায়তার জন্য আবেদন করুন",
  "Child / Applicant name": "শিশু / আবেদনকারীর নাম",
  "Mobile number": "মোবাইল নম্বর",
  District: "জেলা",
  "Support needed": "প্রয়োজনীয় সহায়তা",
  "Submit Application / आवेदन जमा करें": "আবেদন জমা দিন",
  "Partner in Our Growth": "আমাদের অগ্রগতির অংশীদার হন",
  "Corporate Partnerships (CSR)": "কর্পোরেট অংশীদারিত্ব (CSR)",
  "Start a CSR Conversation": "CSR আলোচনা শুরু করুন",
  "Send CSR Enquiry": "CSR অনুসন্ধান পাঠান",
  "Support Our Mission": "আমাদের মিশনকে সমর্থন করুন",
  "One-time Donation": "এককালীন দান",
  "Monthly Donation": "মাসিক দান",
  "Payment Options": "পেমেন্ট বিকল্প",
  "Donate Now Securely 🔒": "নিরাপদে দান করুন 🔒",
  "News & Updates": "সংবাদ ও আপডেট",
  "Frequently Asked Questions": "সাধারণ জিজ্ঞাসা",
  "Privacy Policy": "গোপনীয়তা নীতি",
  "Quick Links": "দ্রুত লিংক",
  "Our Services": "আমাদের সেবা",
  "Contact Us": "যোগাযোগ করুন",
};
Object.assign(hi, {
  Donate: "दान करें",
  "Inclusive care. Lasting independence.":
    "समावेशी देखभाल। स्थायी आत्मनिर्भरता।",
  "Every child deserves the tools to":
    "हर बच्चा आगे बढ़ने के साधनों का हकदार है",
  "thrive.": "आगे बढ़े।",
  "We connect children with disabilities across Uttar Pradesh to assistive technology, therapy, education and family support.":
    "हम उत्तर प्रदेश के दिव्यांग बच्चों को सहायक तकनीक, थेरेपी, शिक्षा और पारिवारिक सहयोग से जोड़ते हैं।",
  "Donate & Change a Life": "दान करें, जीवन बदलें",
  "Apply for Support": "सहायता के लिए आवेदन करें",
  "Registered nonprofit": "पंजीकृत गैर-लाभकारी संस्था",
  "80G tax benefits": "80G कर लाभ",
  "children supported with dignity": "बच्चों को सम्मानपूर्वक सहायता",
  "What we believe": "हमारा विश्वास",
  "Disability should never decide a child's future.":
    "दिव्यांगता कभी किसी बच्चे का भविष्य तय नहीं करनी चाहिए।",
  "Our programmes": "हमारे कार्यक्रम",
  "Support designed around real lives": "वास्तविक जीवन के अनुरूप सहायता",
  "How support works": "सहायता कैसे मिलती है",
  "A clear path from need to possibility.":
    "ज़रूरत से संभावना तक एक स्पष्ट रास्ता।",
  "Tell us what you need": "अपनी आवश्यकता बताएं",
  "We review together": "हम मिलकर समीक्षा करते हैं",
  "Support reaches you": "सहायता आप तक पहुँचती है",
  "Start an application": "आवेदन शुरू करें",
  "Be part of the change": "बदलाव का हिस्सा बनें",
  "Make a secure donation": "सुरक्षित दान करें",
  "Partner with us": "हमसे जुड़ें",
  "Need guidance?": "मार्गदर्शन चाहिए?",
  "Our team is here to listen.": "हमारी टीम आपकी बात सुनने के लिए है।",
  "Get support": "सहायता प्राप्त करें",
  Explore: "जानें",
  "About our work": "हमारे कार्य के बारे में",
  "Our impact": "हमारा प्रभाव",
  "CSR partnerships": "सीएसआर साझेदारी",
  Programmes: "कार्यक्रम",
  "Hearing support": "श्रवण सहायता",
  "Digital access": "डिजिटल पहुंच",
  "Therapy assistance": "थेरेपी सहायता",
  Contact: "संपर्क",
  Privacy: "गोपनीयता",
  Transparency: "पारदर्शिता",
  "Building an inclusive Uttar Pradesh, one family at a time.":
    "हर परिवार के साथ एक समावेशी उत्तर प्रदेश का निर्माण।",
  "Pay with Razorpay": "रेज़रपे से भुगतान करें",
  Custom: "अन्य राशि",
  Card: "कार्ड",
  Banks: "बैंक",
  "Preparing secure payment…": "सुरक्षित भुगतान तैयार हो रहा है…",
  "Payment service is not configured yet.": "भुगतान सेवा अभी उपलब्ध नहीं है।",
});
Object.assign(mr, {
  "Hearing. Dignity. Inclusion.": "श्रवण. सन्मान. समावेश.",
  Donate: "देणगी द्या",
  "Inclusive care. Lasting independence.":
    "समावेशक काळजी. कायमस्वरूपी स्वावलंबन.",
  "Every child deserves the tools to":
    "प्रत्येक मुलाला आवश्यक साधने मिळायला हवीत",
  "thrive.": "भरभराटीसाठी.",
  "We connect children with disabilities across Uttar Pradesh to assistive technology, therapy, education and family support.":
    "आम्ही उत्तर प्रदेशातील दिव्यांग मुलांना सहाय्यक तंत्रज्ञान, उपचार, शिक्षण आणि कौटुंबिक मदतीशी जोडतो.",
  "Donate & Change a Life": "देणगी द्या, जीवन बदला",
  "Apply for Support": "सहाय्यासाठी अर्ज करा",
  "Registered nonprofit": "नोंदणीकृत ना-नफा संस्था",
  "80G tax benefits": "80G कर लाभ",
  "children supported with dignity": "मुलांना सन्मानाने सहाय्य",
  "What we believe": "आमचा विश्वास",
  "Disability should never decide a child's future.":
    "दिव्यांगत्वाने मुलाचे भविष्य ठरू नये.",
  "Our programmes": "आमचे कार्यक्रम",
  "Support designed around real lives": "वास्तविक जीवनासाठी तयार केलेले सहाय्य",
  "How support works": "सहाय्य कसे मिळते",
  "A clear path from need to possibility.":
    "गरजेपासून संधीपर्यंत स्पष्ट मार्ग.",
  "Tell us what you need": "तुमची गरज सांगा",
  "We review together": "आम्ही एकत्रित आढावा घेतो",
  "Support reaches you": "सहाय्य तुमच्यापर्यंत पोहोचते",
  "Start an application": "अर्ज सुरू करा",
  "Be part of the change": "बदलाचा भाग व्हा",
  "Make a secure donation": "सुरक्षित देणगी द्या",
  "Partner with us": "आमच्यासोबत भागीदारी करा",
  "Need guidance?": "मार्गदर्शन हवे आहे?",
  "Our team is here to listen.": "आमची टीम तुमचे म्हणणे ऐकण्यासाठी येथे आहे.",
  "Get support": "सहाय्य मिळवा",
  Explore: "जाणून घ्या",
  "About our work": "आमच्या कार्याबद्दल",
  "Our impact": "आमचा प्रभाव",
  "CSR partnerships": "CSR भागीदारी",
  Programmes: "कार्यक्रम",
  "Hearing support": "श्रवण सहाय्य",
  "Digital access": "डिजिटल प्रवेश",
  "Therapy assistance": "उपचार सहाय्य",
  Contact: "संपर्क",
  Privacy: "गोपनीयता",
  Transparency: "पारदर्शकता",
  "Building an inclusive Uttar Pradesh, one family at a time.":
    "प्रत्येक कुटुंबासोबत समावेशक उत्तर प्रदेश घडवत आहोत.",
  "Pay with Razorpay": "Razorpay द्वारे भरा",
  Custom: "इतर रक्कम",
  Card: "कार्ड",
  Banks: "बँका",
});
Object.assign(ta, {
  Donate: "நன்கொடை",
  "Inclusive care. Lasting independence.":
    "உள்ளடக்கிய பராமரிப்பு. நீடித்த சுதந்திரம்.",
  "Every child deserves the tools to":
    "ஒவ்வொரு குழந்தைக்கும் வளர தேவையான கருவிகள் உரியது",
  "thrive.": "செழிக்க.",
  "We connect children with disabilities across Uttar Pradesh to assistive technology, therapy, education and family support.":
    "உத்தரப் பிரதேசம் முழுவதும் மாற்றுத்திறனுள்ள குழந்தைகளை உதவி தொழில்நுட்பம், சிகிச்சை, கல்வி மற்றும் குடும்ப ஆதரவுடன் இணைக்கிறோம்.",
  "Donate & Change a Life": "நன்கொடை அளித்து வாழ்வை மாற்றுங்கள்",
  "Apply for Support": "உதவிக்கு விண்ணப்பிக்கவும்",
  "Registered nonprofit": "பதிவுசெய்யப்பட்ட இலாப நோக்கற்ற அமைப்பு",
  "80G tax benefits": "80G வரிச் சலுகைகள்",
  "children supported with dignity": "கண்ணியத்துடன் ஆதரிக்கப்பட்ட குழந்தைகள்",
  "What we believe": "எங்கள் நம்பிக்கை",
  "Disability should never decide a child's future.":
    "மாற்றுத்திறன் ஒரு குழந்தையின் எதிர்காலத்தை தீர்மானிக்கக் கூடாது.",
  "Our programmes": "எங்கள் திட்டங்கள்",
  "Support designed around real lives":
    "உண்மை வாழ்க்கைக்காக வடிவமைக்கப்பட்ட ஆதரவு",
  "How support works": "ஆதரவு செயல்முறை",
  "A clear path from need to possibility.":
    "தேவையிலிருந்து வாய்ப்பிற்கான தெளிவான பாதை.",
  "Tell us what you need": "உங்கள் தேவையைச் சொல்லுங்கள்",
  "We review together": "நாங்கள் இணைந்து பரிசீலிக்கிறோம்",
  "Support reaches you": "ஆதரவு உங்களைச் சென்றடைகிறது",
  "Start an application": "விண்ணப்பத்தைத் தொடங்குங்கள்",
  "Be part of the change": "மாற்றத்தின் பகுதியாகுங்கள்",
  "Make a secure donation": "பாதுகாப்பாக நன்கொடை அளிக்கவும்",
  "Partner with us": "எங்களுடன் இணையுங்கள்",
  "Need guidance?": "வழிகாட்டுதல் வேண்டுமா?",
  "Our team is here to listen.": "உங்கள் குரலைக் கேட்க எங்கள் குழு உள்ளது.",
  "Get support": "உதவி பெறுங்கள்",
  Explore: "ஆராயுங்கள்",
  "About our work": "எங்கள் பணியைப் பற்றி",
  "Our impact": "எங்கள் தாக்கம்",
  "CSR partnerships": "CSR கூட்டாண்மைகள்",
  Programmes: "திட்டங்கள்",
  "Hearing support": "கேட்கும் திறன் ஆதரவு",
  "Digital access": "டிஜிட்டல் அணுகல்",
  "Therapy assistance": "சிகிச்சை உதவி",
  Contact: "தொடர்பு",
  Privacy: "தனியுரிமை",
  Transparency: "வெளிப்படைத்தன்மை",
  "Building an inclusive Uttar Pradesh, one family at a time.":
    "ஒவ்வொரு குடும்பத்துடனும் உள்ளடக்கிய உத்தரப் பிரதேசத்தை உருவாக்குகிறோம்.",
  "Pay with Razorpay": "Razorpay மூலம் செலுத்துங்கள்",
  Custom: "வேறு தொகை",
  Card: "அட்டை",
  Banks: "வங்கிகள்",
});
Object.assign(bn, {
  Donate: "দান করুন",
  "Inclusive care. Lasting independence.":
    "অন্তর্ভুক্তিমূলক যত্ন। স্থায়ী স্বাধীনতা।",
  "Every child deserves the tools to":
    "প্রতিটি শিশুর প্রয়োজনীয় উপকরণ পাওয়ার অধিকার আছে",
  "thrive.": "এগিয়ে যেতে।",
  "We connect children with disabilities across Uttar Pradesh to assistive technology, therapy, education and family support.":
    "আমরা উত্তর প্রদেশের প্রতিবন্ধী শিশুদের সহায়ক প্রযুক্তি, থেরাপি, শিক্ষা ও পারিবারিক সহায়তার সঙ্গে যুক্ত করি।",
  "Donate & Change a Life": "দান করুন, জীবন বদলান",
  "Apply for Support": "সহায়তার জন্য আবেদন করুন",
  "Registered nonprofit": "নিবন্ধিত অলাভজনক সংস্থা",
  "80G tax benefits": "80G কর সুবিধা",
  "children supported with dignity": "শিশুদের মর্যাদাপূর্ণ সহায়তা",
  "What we believe": "আমাদের বিশ্বাস",
  "Disability should never decide a child's future.":
    "প্রতিবন্ধকতা কখনো শিশুর ভবিষ্যৎ নির্ধারণ করবে না।",
  "Our programmes": "আমাদের কর্মসূচি",
  "Support designed around real lives": "বাস্তব জীবনের জন্য পরিকল্পিত সহায়তা",
  "How support works": "সহায়তা যেভাবে কাজ করে",
  "A clear path from need to possibility.":
    "প্রয়োজন থেকে সম্ভাবনার স্পষ্ট পথ।",
  "Tell us what you need": "আপনার প্রয়োজন জানান",
  "We review together": "আমরা একসঙ্গে পর্যালোচনা করি",
  "Support reaches you": "সহায়তা আপনার কাছে পৌঁছায়",
  "Start an application": "আবেদন শুরু করুন",
  "Be part of the change": "পরিবর্তনের অংশ হোন",
  "Make a secure donation": "নিরাপদে দান করুন",
  "Partner with us": "আমাদের সঙ্গে যুক্ত হন",
  "Need guidance?": "পরামর্শ প্রয়োজন?",
  "Our team is here to listen.": "আমাদের দল আপনার কথা শুনতে প্রস্তুত।",
  "Get support": "সহায়তা নিন",
  Explore: "জানুন",
  "About our work": "আমাদের কাজ সম্পর্কে",
  "Our impact": "আমাদের প্রভাব",
  "CSR partnerships": "CSR অংশীদারিত্ব",
  Programmes: "কর্মসূচি",
  "Hearing support": "শ্রবণ সহায়তা",
  "Digital access": "ডিজিটাল প্রবেশাধিকার",
  "Therapy assistance": "থেরাপি সহায়তা",
  Contact: "যোগাযোগ",
  Privacy: "গোপনীয়তা",
  Transparency: "স্বচ্ছতা",
  "Building an inclusive Uttar Pradesh, one family at a time.":
    "প্রতিটি পরিবারের সঙ্গে অন্তর্ভুক্তিমূলক উত্তর প্রদেশ গড়ছি।",
  "Pay with Razorpay": "Razorpay দিয়ে পেমেন্ট করুন",
  Custom: "অন্য পরিমাণ",
  Card: "কার্ড",
  Banks: "ব্যাংক",
});
const bho: Record<string, string> = {
  Home: "मुख्य पन्ना",
  "About Us": "हमनी के बारे में",
  "Get Help": "मदद लीं",
  "Our Impact": "हमनी के असर",
  "Partner With Us": "हमनी से जुड़ीं",
  Resources: "संसाधन",
  Donate: "दान करीं",
  "Donate Now": "अबहीं दान करीं",
  "Inclusive care. Lasting independence.":
    "समावेशी देखभाल। टिकाऊ आत्मनिर्भरता।",
  "Every child deserves the tools to":
    "हर बच्चा के आगे बढ़े खातिर साधन मिले के चाहीं",
  "thrive.": "आगे बढ़े।",
  "We connect children with disabilities across Uttar Pradesh to assistive technology, therapy, education and family support.":
    "हमनी उत्तर प्रदेश के दिव्यांग बच्चन के सहायक तकनीक, थेरेपी, पढ़ाई आ परिवार के सहयोग से जोड़त बानी।",
  "Donate & Change a Life": "दान करीं, जिनगी बदलीं",
  "Apply for Support": "मदद खातिर आवेदन करीं",
  "Registered nonprofit": "पंजीकृत गैर-लाभकारी संस्था",
  "80G tax benefits": "80G कर लाभ",
  "children supported with dignity": "बच्चन के सम्मान के साथ मदद",
  "Kids Supported": "मदद पवले बच्चा",
  "Districts (U.P.)": "जिला (उ.प्र.)",
  "Impact Zones": "असर वाला इलाका",
  "Lives Touched": "जिनगी पर असर",
  "What we believe": "हमनी के विश्वास",
  "Disability should never decide a child's future.":
    "दिव्यांगता कबो कवनो बच्चा के भविष्य तय ना करे के चाहीं।",
  "Our programmes": "हमनी के कार्यक्रम",
  "Support designed around real lives": "असल जिनगी के जरूरत हिसाब से मदद",
  "How support works": "मदद कइसे मिले ला",
  "A clear path from need to possibility.": "जरूरत से संभावना ले साफ रास्ता।",
  "Tell us what you need": "अपना जरूरत बताईं",
  "We review together": "हमनी मिलके जाँच करब",
  "Support reaches you": "मदद रउरा लगे पहुँची",
  "Start an application": "आवेदन शुरू करीं",
  "Be part of the change": "बदलाव के हिस्सा बनीं",
  "Make a secure donation": "सुरक्षित दान करीं",
  "Partner with us": "हमनी से जुड़ीं",
  "Need guidance?": "राह-दिखावे के जरूरत बा?",
  "Our team is here to listen.": "हमनी के टीम रउरा बात सुने खातिर मौजूद बा।",
  "Get support": "मदद लीं",
  Explore: "जानीं",
  "About our work": "हमनी के काम के बारे में",
  "Our impact": "हमनी के असर",
  "CSR partnerships": "सीएसआर साझेदारी",
  Programmes: "कार्यक्रम",
  "Hearing support": "सुने में सहायता",
  "Digital access": "डिजिटल पहुँच",
  "Therapy assistance": "थेरेपी सहायता",
  Contact: "संपर्क",
  Privacy: "गोपनीयता",
  Transparency: "पारदर्शिता",
  "Building an inclusive Uttar Pradesh, one family at a time.":
    "हर परिवार के साथ एगो समावेशी उत्तर प्रदेश बनावत बानी।",
  "Apply for Financial Aid": "आर्थिक मदद खातिर आवेदन करीं",
  "Secure digital verification": "सुरक्षित डिजिटल सत्यापन",
  "Child / Applicant name": "बच्चा / आवेदक के नाम",
  "Mobile number": "मोबाइल नंबर",
  District: "जिला",
  "Support needed": "कइसन मदद चाहीं",
  "Tell us what support is needed": "बताईं कि कइसन मदद के जरूरत बा",
  "UDID Card": "यूडीआईडी कार्ड",
  "Income Certificate": "आय प्रमाण पत्र",
  "Select district": "जिला चुनीं",
  "I confirm that the information provided is correct.":
    "हम पुष्टि करत बानी कि दिहल जानकारी सही बा।",
  "Submit Application / आवेदन जमा करें": "आवेदन जमा करीं",
  "Documents Required": "जरूरी कागजात",
  "Upload Documents": "कागजात अपलोड करीं",
  "Verification & Support": "सत्यापन आ सहायता",
};
const dictionaries: Record<string, Record<string, string>> = {
  hi: { ...generatedTranslations.hi, ...homeTranslations.hi, ...hi },
  mr: { ...generatedTranslations.mr, ...homeTranslations.mr, ...mr },
  ta: { ...generatedTranslations.ta, ...homeTranslations.ta, ...ta },
  bn: { ...generatedTranslations.bn, ...homeTranslations.bn, ...bn },
  bho,
};
Object.assign(dictionaries.hi, {
  "GIVE HOPE": "आशा दें",
  "CHANGE A LIFE": "एक जीवन बदलें",
  "EVERY CHILD MATTERS": "हर बच्चा महत्वपूर्ण है",
  "EMPOWER DREAMS": "सपनों को सशक्त बनाएं",
  "INCLUSIVE FUTURE": "समावेशी भविष्य",
  "MAKE A DIFFERENCE": "बदलाव लाएं",
  "SUPPORT ABILITIES": "क्षमताओं को समर्थन दें",
  "OPEN DOORS": "अवसरों के द्वार खोलें",
  "SHARE KINDNESS": "दयालुता बांटें",
  "BUILD CONFIDENCE": "आत्मविश्वास बढ़ाएं",
  "CREATE OPPORTUNITIES": "अवसर बनाएं",
  "INSPIRE CHANGE": "बदलाव की प्रेरणा दें",
  "STRENGTHEN FAMILIES": "परिवारों को मजबूत बनाएं",
  "UNLOCK POTENTIAL": "क्षमता को उजागर करें",
  "DONATE TODAY": "आज दान करें",
  "BE THE REASON": "बदलाव का कारण बनें",
});
Object.assign(dictionaries.mr, {
  "GIVE HOPE": "आशा द्या",
  "CHANGE A LIFE": "एक जीवन बदला",
  "EVERY CHILD MATTERS": "प्रत्येक मूल महत्त्वाचे आहे",
  "EMPOWER DREAMS": "स्वप्नांना बळ द्या",
  "INCLUSIVE FUTURE": "समावेशक भविष्य",
  "MAKE A DIFFERENCE": "बदल घडवा",
  "SUPPORT ABILITIES": "क्षमतांना आधार द्या",
  "OPEN DOORS": "संधींची दारे उघडा",
  "SHARE KINDNESS": "दयाळूपणा वाटा",
  "BUILD CONFIDENCE": "आत्मविश्वास वाढवा",
  "CREATE OPPORTUNITIES": "संधी निर्माण करा",
  "INSPIRE CHANGE": "बदलाची प्रेरणा द्या",
  "STRENGTHEN FAMILIES": "कुटुंबांना बळ द्या",
  "UNLOCK POTENTIAL": "क्षमता खुली करा",
  "DONATE TODAY": "आज देणगी द्या",
  "BE THE REASON": "बदलाचे कारण बना",
});
Object.assign(dictionaries.ta, {
  "GIVE HOPE": "நம்பிக்கை அளியுங்கள்",
  "CHANGE A LIFE": "ஒரு வாழ்க்கையை மாற்றுங்கள்",
  "EVERY CHILD MATTERS": "ஒவ்வொரு குழந்தையும் முக்கியம்",
  "EMPOWER DREAMS": "கனவுகளுக்கு வலிமை அளியுங்கள்",
  "INCLUSIVE FUTURE": "உள்ளடக்கிய எதிர்காலம்",
  "MAKE A DIFFERENCE": "மாற்றத்தை உருவாக்குங்கள்",
  "SUPPORT ABILITIES": "திறன்களுக்கு ஆதரவளியுங்கள்",
  "OPEN DOORS": "வாய்ப்புகளின் கதவுகளைத் திறங்கள்",
  "SHARE KINDNESS": "அன்பைப் பகிருங்கள்",
  "BUILD CONFIDENCE": "தன்னம்பிக்கையை வளருங்கள்",
  "CREATE OPPORTUNITIES": "வாய்ப்புகளை உருவாக்குங்கள்",
  "INSPIRE CHANGE": "மாற்றத்திற்கு ஊக்கமளியுங்கள்",
  "STRENGTHEN FAMILIES": "குடும்பங்களை வலுப்படுத்துங்கள்",
  "UNLOCK POTENTIAL": "திறனை வெளிப்படுத்துங்கள்",
  "DONATE TODAY": "இன்றே நன்கொடை அளியுங்கள்",
  "BE THE REASON": "மாற்றத்திற்குக் காரணமாக இருங்கள்",
});
Object.assign(dictionaries.bn, {
  "GIVE HOPE": "আশা দিন",
  "CHANGE A LIFE": "একটি জীবন বদলান",
  "EVERY CHILD MATTERS": "প্রতিটি শিশুই গুরুত্বপূর্ণ",
  "EMPOWER DREAMS": "স্বপ্নকে শক্তি দিন",
  "INCLUSIVE FUTURE": "অন্তর্ভুক্তিমূলক ভবিষ্যৎ",
  "MAKE A DIFFERENCE": "পরিবর্তন আনুন",
  "SUPPORT ABILITIES": "সক্ষমতাকে সমর্থন করুন",
  "OPEN DOORS": "সুযোগের দরজা খুলুন",
  "SHARE KINDNESS": "সহমর্মিতা ভাগ করুন",
  "BUILD CONFIDENCE": "আত্মবিশ্বাস গড়ুন",
  "CREATE OPPORTUNITIES": "সুযোগ তৈরি করুন",
  "INSPIRE CHANGE": "পরিবর্তনে অনুপ্রাণিত করুন",
  "STRENGTHEN FAMILIES": "পরিবারকে শক্তিশালী করুন",
  "UNLOCK POTENTIAL": "সম্ভাবনা উন্মুক্ত করুন",
  "DONATE TODAY": "আজই দান করুন",
  "BE THE REASON": "পরিবর্তনের কারণ হোন",
});
Object.assign(dictionaries.hi, {
  "Advocacy": "पक्षसमर्थन",
  "Closing gaps at the source": "समस्या की जड़ में मौजूद कमियों को दूर करना",
  "At Beyond Disability Foundation, we believe that sustainable change requires addressing systemic bottlenecks at the highest levels of governance, which is why our policy-level advocacy focuses directly on bridging the gaps that prevent government programs from delivering their intended benefits to children with disabilities. By actively engaging with policymakers, health authorities, and administrative bodies, we strive to transform welfare frameworks into robust, practical lifelines for underprivileged families. This is an ongoing exercise where we need support of those who can influence decision makers to understand our mission and give momentum to our efforts.": "बियॉन्ड डिसएबिलिटी फाउंडेशन में हमारा मानना है कि स्थायी बदलाव के लिए शासन के उच्चतम स्तरों पर प्रणालीगत बाधाओं को दूर करना आवश्यक है। इसलिए हमारी नीतिगत पैरवी उन कमियों को भरने पर केंद्रित है जो सरकारी कार्यक्रमों को दिव्यांग बच्चों तक उनका अपेक्षित लाभ पहुंचाने से रोकती हैं। नीति निर्माताओं, स्वास्थ्य अधिकारियों और प्रशासनिक संस्थाओं के साथ सक्रिय संवाद के माध्यम से हम कल्याणकारी ढांचों को वंचित परिवारों के लिए मजबूत और व्यावहारिक जीवनरेखा में बदलने का प्रयास करते हैं। यह एक सतत प्रयास है और हमें ऐसे लोगों के सहयोग की आवश्यकता है जो निर्णय निर्माताओं को हमारा उद्देश्य समझा सकें और हमारे प्रयासों को गति दे सकें।",
  "Fixing Cochlear Implant Gaps of State and Central Government": "राज्य और केंद्र सरकार की कॉक्लियर इम्प्लांट योजनाओं की कमियां दूर करना",
  "We are making effort to sensitize the government of the disadvantages of just finding the implants and leaving the implanted children to fund for themselves. Most of the children cannot afford accessories and become deaf again. We are actively trying to ensure that government make changes in the program which otherwise loses its purpose.": "हम सरकार को केवल इम्प्लांट उपलब्ध कराने और उसके बाद बच्चों को आवश्यक खर्च स्वयं उठाने के लिए छोड़ देने की कमियों के प्रति संवेदनशील बनाने का प्रयास कर रहे हैं। अधिकांश बच्चे सहायक उपकरणों का खर्च नहीं उठा सकते और फिर से सुनने की क्षमता खो देते हैं। हम सरकारी कार्यक्रम में आवश्यक बदलाव सुनिश्चित करने के लिए सक्रिय रूप से प्रयासरत हैं, ताकि उसका मूल उद्देश्य पूरा हो सके।",
  "Universal Newborn Hearing Screening Protocols": "सार्वभौमिक नवजात श्रवण जांच प्रोटोकॉल",
  "We have made representations to authorities to implement a mandatory standardized protocol for early newborn hearing testing following the globally recognized 1-3-6 guideline—ensuring universal screening by 1 month of age, comprehensive diagnostic evaluation by 3 months, and the commencement of early intervention services by 6 months, we need support to be heard.": "हमने अधिकारियों से विश्व स्तर पर मान्य 1-3-6 दिशानिर्देश के अनुसार नवजात शिशुओं की प्रारंभिक श्रवण जांच के लिए अनिवार्य मानकीकृत प्रोटोकॉल लागू करने का अनुरोध किया है - 1 माह तक सार्वभौमिक जांच, 3 माह तक व्यापक निदान और 6 माह तक प्रारंभिक हस्तक्षेप सेवाओं की शुरुआत। हमारी आवाज सुनी जाए, इसके लिए हमें सहयोग चाहिए।",
  "Influence for Change": "बदलाव के लिए प्रभाव",
  "This is an ongoing exercise where we need support of those who can influence decision makers to understand our mission and give momentum to our efforts.": "यह एक सतत प्रयास है और हमें ऐसे लोगों के सहयोग की आवश्यकता है जो निर्णय निर्माताओं को हमारा उद्देश्य समझा सकें और हमारे प्रयासों को गति दे सकें।",
  "Read more": "और पढ़ें",
  "Support this effort →": "इस प्रयास का समर्थन करें →",
  "Help us be heard →": "हमारी आवाज़ बुलंद करें →",
  "Work with us →": "हमारे साथ काम करें →",
});
Object.assign(dictionaries.mr, {
  "Advocacy": "धोरणात्मक पाठपुरावा", "Closing gaps at the source": "मुळातील त्रुटी दूर करणे", "Fixing Cochlear Implant Gaps of State and Central Government": "राज्य आणि केंद्र सरकारच्या कॉक्लिअर इम्प्लांट योजनांतील त्रुटी दूर करणे", "Universal Newborn Hearing Screening Protocols": "सार्वत्रिक नवजात श्रवण तपासणी प्रोटोकॉल", "Influence for Change": "बदलासाठी प्रभाव", "Read more": "अधिक वाचा", "Support this effort →": "या प्रयत्नाला पाठिंबा द्या →", "Help us be heard →": "आमचा आवाज पोहोचवायला मदत करा →", "Work with us →": "आमच्यासोबत काम करा →",
  "This is an ongoing exercise where we need support of those who can influence decision makers to understand our mission and give momentum to our efforts.": "हा सातत्याने चालणारा प्रयत्न आहे. निर्णय घेणाऱ्यांना आमचे ध्येय समजावून सांगू शकणाऱ्या आणि आमच्या प्रयत्नांना गती देऊ शकणाऱ्या व्यक्तींच्या सहकार्याची आम्हाला गरज आहे.",
  "At Beyond Disability Foundation, we believe that sustainable change requires addressing systemic bottlenecks at the highest levels of governance, which is why our policy-level advocacy focuses directly on bridging the gaps that prevent government programs from delivering their intended benefits to children with disabilities. By actively engaging with policymakers, health authorities, and administrative bodies, we strive to transform welfare frameworks into robust, practical lifelines for underprivileged families. This is an ongoing exercise where we need support of those who can influence decision makers to understand our mission and give momentum to our efforts.": "बियॉन्ड डिसॅबिलिटी फाउंडेशनमध्ये आमचा विश्वास आहे की शाश्वत बदलासाठी शासनाच्या सर्वोच्च स्तरांवरील प्रणालीगत अडथळे दूर करणे आवश्यक आहे. म्हणून आमचा धोरणात्मक पाठपुरावा दिव्यांग मुलांपर्यंत सरकारी योजनांचे अपेक्षित लाभ पोहोचण्यास अडथळा ठरणाऱ्या त्रुटी भरून काढण्यावर केंद्रित आहे. धोरणकर्ते, आरोग्य अधिकारी आणि प्रशासकीय संस्थांशी सक्रिय संवाद साधून आम्ही कल्याणकारी चौकटींना वंचित कुटुंबांसाठी मजबूत आणि व्यावहारिक आधार बनवण्याचा प्रयत्न करतो. या सातत्यपूर्ण प्रयत्नाला निर्णयकर्त्यांवर प्रभाव टाकू शकणाऱ्या व्यक्तींच्या सहकार्याची गरज आहे.",
  "We are making effort to sensitize the government of the disadvantages of just finding the implants and leaving the implanted children to fund for themselves. Most of the children cannot afford accessories and become deaf again. We are actively trying to ensure that government make changes in the program which otherwise loses its purpose.": "केवळ इम्प्लांट उपलब्ध करून दिल्यानंतर आवश्यक खर्च कुटुंबांवर सोडण्याच्या त्रुटींबाबत सरकारला संवेदनशील करण्याचा आम्ही प्रयत्न करत आहोत. बहुतेक मुलांना बाह्य उपकरणांचा खर्च परवडत नाही आणि त्यांची श्रवणक्षमता पुन्हा हरवते. कार्यक्रमाचा मूळ उद्देश टिकून राहावा यासाठी सरकारी योजनेत आवश्यक बदल व्हावेत म्हणून आम्ही सक्रिय प्रयत्न करत आहोत.",
  "We have made representations to authorities to implement a mandatory standardized protocol for early newborn hearing testing following the globally recognized 1-3-6 guideline—ensuring universal screening by 1 month of age, comprehensive diagnostic evaluation by 3 months, and the commencement of early intervention services by 6 months, we need support to be heard.": "जागतिक स्तरावर मान्य 1-3-6 मार्गदर्शक तत्त्वांनुसार नवजात बालकांच्या श्रवण तपासणीसाठी अनिवार्य प्रमाणित प्रोटोकॉल लागू करण्याची आम्ही मागणी केली आहे - 1 महिन्यापर्यंत तपासणी, 3 महिन्यांपर्यंत संपूर्ण निदान आणि 6 महिन्यांपर्यंत प्रारंभिक हस्तक्षेप. आमचा आवाज पोहोचण्यासाठी आम्हाला सहकार्याची गरज आहे.",
});
Object.assign(dictionaries.ta, {
  "Advocacy": "கொள்கை ஆதரவு", "Closing gaps at the source": "மூலத்திலேயே இடைவெளிகளை சரிசெய்தல்", "Fixing Cochlear Implant Gaps of State and Central Government": "மாநில மற்றும் மத்திய அரசின் காக்லியர் இம்பிளாண்ட் திட்ட இடைவெளிகளை சரிசெய்தல்", "Universal Newborn Hearing Screening Protocols": "அனைவருக்குமான புதிதாகப் பிறந்த குழந்தை செவித்திறன் பரிசோதனை நெறிமுறைகள்", "Influence for Change": "மாற்றத்திற்கான செல்வாக்கு", "Read more": "மேலும் படிக்க", "Support this effort →": "இந்த முயற்சியை ஆதரிக்கவும் →", "Help us be heard →": "எங்கள் குரல் கேட்க உதவுங்கள் →", "Work with us →": "எங்களுடன் இணைந்து செயல்படுங்கள் →",
  "This is an ongoing exercise where we need support of those who can influence decision makers to understand our mission and give momentum to our efforts.": "இது தொடர்ந்து நடைபெறும் முயற்சி. முடிவெடுப்பவர்களுக்கு எங்கள் நோக்கத்தைப் புரியவைத்து எங்கள் முயற்சிகளுக்கு வேகம் அளிக்கக்கூடியவர்களின் ஆதரவு எங்களுக்கு தேவை.",
  "At Beyond Disability Foundation, we believe that sustainable change requires addressing systemic bottlenecks at the highest levels of governance, which is why our policy-level advocacy focuses directly on bridging the gaps that prevent government programs from delivering their intended benefits to children with disabilities. By actively engaging with policymakers, health authorities, and administrative bodies, we strive to transform welfare frameworks into robust, practical lifelines for underprivileged families. This is an ongoing exercise where we need support of those who can influence decision makers to understand our mission and give momentum to our efforts.": "பியாண்ட் டிஸ்அபிலிட்டி அறக்கட்டளையில், நிலையான மாற்றத்திற்கு ஆட்சியின் உயர்ந்த நிலைகளில் உள்ள அமைப்புசார் தடைகளைத் தீர்ப்பது அவசியம் என்று நாங்கள் நம்புகிறோம். மாற்றுத்திறனுள்ள குழந்தைகளுக்கு அரசுத் திட்டங்களின் பயன்கள் சென்றடைவதைத் தடுக்கும் இடைவெளிகளை நிரப்புவதில் எங்கள் கொள்கை ஆதரவு கவனம் செலுத்துகிறது. கொள்கை வகுப்பாளர்கள், சுகாதார அதிகாரிகள் மற்றும் நிர்வாக அமைப்புகளுடன் செயல்பட்டு, நலத்திட்டங்களை பின்தங்கிய குடும்பங்களுக்கான வலுவான நடைமுறை ஆதரவாக மாற்ற முயல்கிறோம். முடிவெடுப்பவர்களுக்கு எங்கள் நோக்கத்தைப் புரியவைத்து இந்த முயற்சிக்கு வேகம் அளிக்கக்கூடியவர்களின் ஆதரவு தேவை.",
  "We are making effort to sensitize the government of the disadvantages of just finding the implants and leaving the implanted children to fund for themselves. Most of the children cannot afford accessories and become deaf again. We are actively trying to ensure that government make changes in the program which otherwise loses its purpose.": "இம்பிளாண்ட் மட்டும் வழங்கிவிட்டு, தேவையான செலவுகளை குடும்பங்களே ஏற்க வேண்டிய நிலையின் பாதிப்புகளை அரசுக்கு உணர்த்த முயற்சிக்கிறோம். பெரும்பாலான குழந்தைகளால் வெளிப்புற உபகரணங்களை வாங்க முடியாமல் மீண்டும் செவித்திறனை இழக்கின்றனர். திட்டத்தின் நோக்கம் வீணாகாமல் இருக்க அரசு தேவையான மாற்றங்களைச் செய்ய வேண்டும் என தொடர்ந்து முயற்சிக்கிறோம்.",
  "We have made representations to authorities to implement a mandatory standardized protocol for early newborn hearing testing following the globally recognized 1-3-6 guideline—ensuring universal screening by 1 month of age, comprehensive diagnostic evaluation by 3 months, and the commencement of early intervention services by 6 months, we need support to be heard.": "உலகளவில் அங்கீகரிக்கப்பட்ட 1-3-6 வழிகாட்டுதலின்படி புதிதாகப் பிறந்த குழந்தைகளுக்கான கட்டாய செவித்திறன் பரிசோதனை நெறிமுறையை அமல்படுத்த அதிகாரிகளிடம் கோரியுள்ளோம் - 1 மாதத்திற்குள் பரிசோதனை, 3 மாதத்திற்குள் முழுமையான நோயறிதல் மற்றும் 6 மாதத்திற்குள் ஆரம்ப தலையீடு. எங்கள் கோரிக்கை கேட்கப்பட ஆதரவு தேவை.",
});
Object.assign(dictionaries.bn, {
  "Advocacy": "নীতিগত প্রচার", "Closing gaps at the source": "সমস্যার উৎসেই ঘাটতি দূর করা", "Fixing Cochlear Implant Gaps of State and Central Government": "রাজ্য ও কেন্দ্রীয় সরকারের কক্লিয়ার ইমপ্ল্যান্ট কর্মসূচির ঘাটতি দূর করা", "Universal Newborn Hearing Screening Protocols": "সর্বজনীন নবজাতক শ্রবণ পরীক্ষার প্রোটোকল", "Influence for Change": "পরিবর্তনের জন্য প্রভাব", "Read more": "আরও পড়ুন", "Support this effort →": "এই উদ্যোগকে সমর্থন করুন →", "Help us be heard →": "আমাদের কথা পৌঁছে দিতে সাহায্য করুন →", "Work with us →": "আমাদের সঙ্গে কাজ করুন →",
  "This is an ongoing exercise where we need support of those who can influence decision makers to understand our mission and give momentum to our efforts.": "এটি একটি চলমান উদ্যোগ। যারা সিদ্ধান্ত গ্রহণকারীদের আমাদের লক্ষ্য বুঝতে সাহায্য করতে এবং আমাদের প্রচেষ্টাকে গতি দিতে পারেন, তাঁদের সহযোগিতা আমাদের প্রয়োজন।",
  "At Beyond Disability Foundation, we believe that sustainable change requires addressing systemic bottlenecks at the highest levels of governance, which is why our policy-level advocacy focuses directly on bridging the gaps that prevent government programs from delivering their intended benefits to children with disabilities. By actively engaging with policymakers, health authorities, and administrative bodies, we strive to transform welfare frameworks into robust, practical lifelines for underprivileged families. This is an ongoing exercise where we need support of those who can influence decision makers to understand our mission and give momentum to our efforts.": "বিয়ন্ড ডিসঅ্যাবিলিটি ফাউন্ডেশনে আমরা বিশ্বাস করি, স্থায়ী পরিবর্তনের জন্য শাসনের সর্বোচ্চ স্তরে থাকা পদ্ধতিগত বাধাগুলি দূর করা জরুরি। তাই প্রতিবন্ধী শিশুদের কাছে সরকারি কর্মসূচির কাঙ্ক্ষিত সুবিধা পৌঁছাতে যে ঘাটতিগুলি বাধা দেয়, আমাদের নীতিগত প্রচার সরাসরি সেগুলি পূরণের দিকে কেন্দ্রীভূত। নীতিনির্ধারক, স্বাস্থ্য কর্তৃপক্ষ ও প্রশাসনিক সংস্থার সঙ্গে সক্রিয়ভাবে কাজ করে আমরা কল্যাণ কাঠামোকে সুবিধাবঞ্চিত পরিবারের জন্য শক্তিশালী ও বাস্তব সহায়তায় রূপান্তর করার চেষ্টা করি। সিদ্ধান্ত গ্রহণকারীদের আমাদের লক্ষ্য বোঝাতে এবং প্রচেষ্টাকে গতি দিতে পারেন এমন মানুষের সহযোগিতা আমাদের প্রয়োজন।",
  "We are making effort to sensitize the government of the disadvantages of just finding the implants and leaving the implanted children to fund for themselves. Most of the children cannot afford accessories and become deaf again. We are actively trying to ensure that government make changes in the program which otherwise loses its purpose.": "শুধু ইমপ্ল্যান্টের ব্যবস্থা করে পরে প্রয়োজনীয় খরচ পরিবারের ওপর ছেড়ে দেওয়ার অসুবিধা সম্পর্কে সরকারকে সচেতন করার চেষ্টা করছি। অধিকাংশ শিশু বাহ্যিক সরঞ্জামের খরচ বহন করতে পারে না এবং আবার শ্রবণক্ষমতা হারায়। কর্মসূচির উদ্দেশ্য যাতে ব্যর্থ না হয়, সে জন্য প্রয়োজনীয় সরকারি পরিবর্তন নিশ্চিত করতে আমরা সক্রিয়ভাবে কাজ করছি।",
  "We have made representations to authorities to implement a mandatory standardized protocol for early newborn hearing testing following the globally recognized 1-3-6 guideline—ensuring universal screening by 1 month of age, comprehensive diagnostic evaluation by 3 months, and the commencement of early intervention services by 6 months, we need support to be heard.": "বিশ্বব্যাপী স্বীকৃত ১-৩-৬ নির্দেশিকা অনুযায়ী নবজাতকের প্রাথমিক শ্রবণ পরীক্ষার জন্য বাধ্যতামূলক মানসম্মত প্রোটোকল চালুর আবেদন করেছি - ১ মাসের মধ্যে পরীক্ষা, ৩ মাসের মধ্যে পূর্ণাঙ্গ নির্ণয় এবং ৬ মাসের মধ্যে প্রাথমিক হস্তক্ষেপ। আমাদের কথা শোনাতে সহযোগিতা প্রয়োজন।",
});

const originals = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
function cleanTranslation(value: string) {
  return value
    .replace(/<\/?g\b[^>]*>/gi, "")
    .replace(/<x\b[^>]*\/?\s*>/gi, "")
    .replace(/&lt;\/?g\b.*?&gt;/gi, "")
    .replace(/&lt;x\b.*?\/?&gt;/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
function translate(root: ParentNode, lang: Lang) {
  const locale = canonicalLocale(lang);
  const dictionary = dictionaries[locale] || {};
  const missing = new Set<string>();
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const list: Text[] = [];
  while (w.nextNode()) list.push(w.currentNode as Text);
  for (const n of list) {
    if (
      n.parentElement?.closest(
        'script,style,.logo,.language,.MuiDateCalendar-root,.beyond-date-picker,[data-no-translate],[translate="no"]',
      )
    )
      continue;
    const raw = n.nodeValue || "",
      trim = raw.trim();
    if (!trim) continue;
    if (!originals.has(n)) originals.set(n, trim);
    const original = originals.get(n) || trim,
      value = locale === "en"
        ? original
        : cleanTranslation(dictionary[original] || original);
    if (
      locale !== "en" &&
      !dictionary[original] &&
      /[A-Za-z]/.test(original) &&
      !original.includes("@") &&
      !/^\+?[\d\s().-]+$/.test(original)
    )
      missing.add(original);
    if (trim !== value) n.nodeValue = raw.replace(trim, value);
  }
  for (const el of root.querySelectorAll?.(
    "[placeholder],[title],[aria-label],[alt]",
  ) || []) {
    if (
      el.closest(
        '.logo,.language,.MuiDateCalendar-root,.beyond-date-picker,[data-no-translate],[translate="no"]',
      )
    )
      continue;
    let saved = originalAttributes.get(el);
    if (!saved) {
      saved = new Map();
      originalAttributes.set(el, saved);
    }
    for (const name of ["placeholder", "title", "aria-label", "alt"]) {
      const current = el.getAttribute(name);
      if (!current) continue;
      if (!saved.has(name)) saved.set(name, current);
      const original = saved.get(name) || current;
      if (locale !== "en" && !dictionary[original] && /[A-Za-z]/.test(original))
        missing.add(original);
      const value = locale === "en"
        ? original
        : cleanTranslation(dictionary[original] || original);
      if (current !== value) el.setAttribute(name, value);
    }
  }
  return [...missing];
}
const pendingTranslations: Record<string, Set<string>> = {};
const translationCooldown: Record<string, number> = {};
const LANGUAGE_STORAGE_KEY = "beyond-language";
function savedLanguage() {
  const cookie = document.cookie
    .split("; ")
    .find((value) => value.startsWith(`${LANGUAGE_STORAGE_KEY}=`))
    ?.split("=")
    .slice(1)
    .join("=");
  return canonicalLocale(
    (cookie && decodeURIComponent(cookie)) ||
      localStorage.getItem(LANGUAGE_STORAGE_KEY) ||
      "en",
  );
}
function storeLanguage(locale: Lang) {
  const value = canonicalLocale(locale);
  localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
  document.cookie = `${LANGUAGE_STORAGE_KEY}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
}
async function fillMissing(lang: Lang, texts: string[]) {
  lang = canonicalLocale(lang);
  if (
    lang === "en" ||
    !texts.length ||
    Date.now() < (translationCooldown[lang] || 0)
  )
    return;
  const pending = (pendingTranslations[lang] ??= new Set<string>());
  const fresh = texts.filter((text) => !pending.has(text));
  fresh.forEach((text) => pending.add(text));
  const batches = Array.from(
    { length: Math.ceil(fresh.length / 12) },
    (_, index) => fresh.slice(index * 12, index * 12 + 12),
  );
  for (const batch of batches) {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale: lang, texts: batch }),
      });
      const data = (await response.json()) as {
        translations?: Record<string, string>;
        limited?: boolean;
        retryAfterSeconds?: number;
      };
      if (response.ok && data.translations) {
        dictionaries[lang] ??= {};
        Object.assign(dictionaries[lang], data.translations);
        translate(document.body, lang);
      }
      if (data.limited) {
        translationCooldown[lang] =
          Date.now() + (data.retryAfterSeconds || 900) * 1000;
        break;
      }
    } finally {
      batch.forEach((text) => pending.delete(text));
    }
  }
}
export function LanguageProvider({ children, initialLanguage = "en" }: { children: ReactNode; initialLanguage?: Lang }) {
  const pathname = usePathname();
  const [language, setState] = useState<Lang>(() => canonicalLocale(initialLanguage)),
    [languages, setLanguages] = useState<LanguageOption[]>(defaultLanguages);
  const changeId = useRef(0);
  const setLanguage = (l: Lang) => {
    const locale = canonicalLocale(l);
    if (locale !== canonicalLocale(language)) {
      changeId.current += 1;
      document.documentElement.classList.add("language-loading");
    }
    translate(document.body, locale);
    setState(locale);
    storeLanguage(locale);
    document.documentElement.lang = locale;
  };
  useLayoutEffect(() => {
    const locale = canonicalLocale(initialLanguage);
    translate(document.body, locale);
    document.documentElement.lang = locale;
    if (locale !== "en") storeLanguage(locale);
    document.documentElement.classList.remove("language-loading");
  }, [initialLanguage]);
  useEffect(() => {
    fetch("/api/languages")
      .then((r) => r.json())
      .then(
        (data: {
          languages?: LanguageOption[];
          translations?: Record<string, Record<string, string>>;
        }) => {
          if (data.translations)
            for (const [locale, values] of Object.entries(data.translations)) {
              const normalizedLocale = canonicalLocale(locale);
              dictionaries[normalizedLocale] = {
                ...values,
                ...(dictionaries[normalizedLocale] || {}),
              };
            }
          if (data.languages?.length) {
            const saved = savedLanguage();
            const normalizedLanguages = data.languages.map((item) => ({
              ...item,
              locale: canonicalLocale(item.locale),
            })).filter((item, index, items) =>
              items.findIndex((candidate) => candidate.locale === item.locale) === index,
            );
            setLanguages(normalizedLanguages);
            setLanguage(
              normalizedLanguages.some((item) => item.locale === saved)
                ? saved
                : "en",
            );
          } else setLanguage(savedLanguage());
        },
      )
      .catch(() => setLanguage(savedLanguage()));
  }, []);
  useEffect(() => {
    let timer = 0,
      cancelled = false;
    const activeChange = changeId.current;
    const complete = () => {
      try {
        const missing = translate(document.body, language);
        requestAnimationFrame(() => {
          if (!cancelled && activeChange === changeId.current) {
            document.documentElement.classList.remove("language-loading");
            window.dispatchEvent(new CustomEvent("beyond:language-change"));
          }
        });
        void fillMissing(language, missing).then(() => {
          if (!cancelled && activeChange === changeId.current)
            translate(document.body, language);
        });
      } catch {
        if (!cancelled && activeChange === changeId.current)
          document.documentElement.classList.remove("language-loading");
      }
    };
    complete();
    const run = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(complete, 40);
    };
    const o = new MutationObserver(run);
    o.observe(document.body, {
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "alt"],
      subtree: true,
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      o.disconnect();
    };
  }, [language, pathname]);
  return (
    <C.Provider value={{ language, languages, setLanguage }}>
      {children}
    </C.Provider>
  );
}
export const useLanguage = () => useContext(C);
