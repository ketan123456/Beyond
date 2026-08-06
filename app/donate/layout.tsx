import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description: "Donate to fund cochlear implant accessories, medical interventions, rehabilitation and practical support for children with disabilities.",
  alternates: { canonical: "/donate" },
};

export default function DonateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
