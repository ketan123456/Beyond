import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { LanguageProvider } from "./i18n";
import { MotionExperience } from "./motion-experience";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beyond Disability Foundation | Empowering Divyangjan",
  description: "Direct financial support, assistive technology and therapeutic aid for children with disabilities across Uttar Pradesh.",
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
      <body className={`${geistSans.variable} antialiased`}>
        <LanguageProvider><MotionExperience>{children}<a className="floating-whatsapp" href="https://wa.me/918000012345?text=Hello%20Beyond%20Disability%2C%20I%20need%20assistance." target="_blank" rel="noreferrer" aria-label="Chat with Beyond Disability on WhatsApp"><img src="/whatsapp.svg" alt=""/></a></MotionExperience></LanguageProvider>
      </body>
    </html>
  );
}
