import "./globals.css";

export const metadata = {
  title: "SCHEME GYAN — India's Smart Government Scheme Advisor",
  description:
    "India's premier AI search engine for Central & State welfare schemes. Enter your details to retrieve matched real-time eligibility benefits from active government programs.",
  keywords: [
    "government schemes",
    "India welfare",
    "scholarship",
    "scheme finder",
    "Gemini AI",
    "SchemeGyan",
  ],
  authors: [{ name: "SchemeGyan" }],
  openGraph: {
    title: "SCHEME GYAN — India's Smart Government Scheme Advisor",
    description:
      "AI-powered search for Indian government schemes. Find scholarships, welfare benefits, and programs matching your profile.",
    siteName: "SchemeGyan",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[#020617] text-slate-200 antialiased font-sans selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
