import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { LanguageProvider } from "./i18n";
import { MotionExperience } from "./motion-experience";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://beyonddisability.org";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Beyond Disability Foundation | Empowering Divyangjan",
    template: "%s | Beyond Disability Foundation",
  },
  description: "Direct financial support, assistive technology and therapeutic aid for children with disabilities across Uttar Pradesh, with special focus on hearing impairment.",
  applicationName: "Beyond Disability Foundation",
  keywords: ["disability support", "hearing loss support", "cochlear implant support", "assistive technology", "therapy support", "inclusive education", "Uttar Pradesh NGO"],
  authors: [{ name: "Beyond Disability Foundation" }],
  creator: "Beyond Disability Foundation",
  publisher: "Beyond Disability Foundation",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Beyond Disability Foundation",
    title: "Beyond Disability Foundation | Empowering Divyangjan",
    description: "Assistive technology, therapy and direct support for children with disabilities across Uttar Pradesh, with special focus on hearing impairment.",
    images: [{ url: "/beyond-hero.webp", width: 1672, height: 941, alt: "Children supported by Beyond Disability Foundation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beyond Disability Foundation | Empowering Divyangjan",
    description: "Assistive technology, therapy and direct support for children with disabilities across Uttar Pradesh, with special focus on hearing impairment.",
    images: ["/beyond-hero.webp"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const storedLanguage = cookieStore.get("beyond-language")?.value || "en";
  const initialLanguage = /^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(storedLanguage)
    ? storedLanguage
    : "en";
  return (
    <html lang={initialLanguage} className={initialLanguage === "en" ? undefined : "language-loading"} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-enabled')",
          }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NGO",
            name: "Beyond Disability Foundation",
            url: siteUrl,
            logo: `${siteUrl}/logo.png`,
            description: "Supporting children with disabilities through assistive technology, therapy, education and family support, with special focus on hearing impairment.",
            telephone: "+91-80000-12345",
            email: "info@beyonddisability.org",
            address: { "@type": "PostalAddress", addressLocality: "Kanpur", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
            areaServed: { "@type": "State", name: "Uttar Pradesh" },
          }) }}
        />
        <LanguageProvider initialLanguage={initialLanguage}><MotionExperience>{children}<a className="floating-whatsapp" href="https://wa.me/918000012345?text=Hello%20Beyond%20Disability%2C%20I%20need%20assistance." target="_blank" rel="noreferrer" aria-label="Chat with Beyond Disability on WhatsApp"><img src="/whatsapp.svg" alt=""/></a></MotionExperience></LanguageProvider>
      </body>
    </html>
  );
}
