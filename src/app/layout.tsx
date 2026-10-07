import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StartupGen & Validator — AI + API + Cloud Intelligence",
  description:
    "Generate, validate, and stress-test startup concepts using Artificial Intelligence, real-time market APIs, and Cloud Computing architecture blueprints.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0f1013] text-[#f8fafc] min-h-screen selection:bg-indigo-500 selection:text-white antialiased font-sans">
        <div className="fixed inset-0 bg-grid-pattern opacity-15 pointer-events-none z-0"></div>
        <div className="fixed top-0 left-1/4 w-[450px] h-[450px] bg-indigo-500/[0.05] rounded-full blur-[140px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-1/4 right-1/4 w-[450px] h-[450px] bg-emerald-500/[0.04] rounded-full blur-[140px] pointer-events-none -z-10"></div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
