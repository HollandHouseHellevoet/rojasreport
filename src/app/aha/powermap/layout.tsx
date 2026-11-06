import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The AHA Power Map",
  description:
    "The structural anatomy of the most powerful hospital lobbying operation in America: lobbying spend, PAC money, the revolving door, and where every fight over hospital law and regulation stands.",
  alternates: { canonical: "https://rojasreport.com/aha/powermap/" },
};

export default function PowerMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
