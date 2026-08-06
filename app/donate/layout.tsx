import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description: "Donate to help children with disabilities access assistive technology, therapy, education and ongoing support.",
  alternates: { canonical: "/donate" },
};

export default function DonateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
