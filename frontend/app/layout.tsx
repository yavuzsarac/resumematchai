import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ResumeMatch AI",
    template: "%s | ResumeMatch AI",
  },
  description:
    "Analyze your resume against any job description with ATS scoring, skill matching, and personalized feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
