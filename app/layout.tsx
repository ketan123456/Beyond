import type { Metadata } from "next";
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
  description: "Direct financial support, assistive technology and therapeutic aid for children with disabilities across Uttar Pradesh.",
  applicationName: "Beyond Disability Foundation",
  keywords: ["disability support", "Divyangjan", "assistive technology", "therapy support", "Uttar Pradesh NGO", "inclusive education"],
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
    description: "Assistive technology, therapy and direct support for children with disabilities across Uttar Pradesh.",
    images: [{ url: "/beyond-hero.webp", width: 1672, height: 941, alt: "Children supported by Beyond Disability Foundation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beyond Disability Foundation | Empowering Divyangjan",
    description: "Assistive technology, therapy and direct support for children with disabilities across Uttar Pradesh.",
    images: ["/beyond-hero.webp"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
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
            description: "Supporting children with disabilities through assistive technology, therapy, education and family support.",
            telephone: "+91-80000-12345",
            email: "info@beyonddisability.org",
            address: { "@type": "PostalAddress", addressLocality: "Kanpur", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
            areaServed: { "@type": "State", name: "Uttar Pradesh" },
          }) }}
        />
        <LanguageProvider><MotionExperience>{children}<a className="floating-whatsapp" href="https://wa.me/918000012345?text=Hello%20Beyond%20Disability%2C%20I%20need%20assistance." target="_blank" rel="noreferrer" aria-label="Chat with Beyond Disability on WhatsApp"><img src="/whatsapp.svg" alt=""/></a></MotionExperience></LanguageProvider>
      </body>
    </html>
  );
}
