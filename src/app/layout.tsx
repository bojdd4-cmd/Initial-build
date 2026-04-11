import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "BuildMyCycle — Smart Steroid Cycle Planner",
  description:
    "Evidence-based steroid cycle builder with AI analysis. For educational purposes only. Build and evaluate anabolic stacks with RoidAI.",
  keywords: ["steroid cycle", "anabolic steroids", "PED education", "harm reduction"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-[var(--border-subtle)] mt-16 py-8 text-center text-[var(--text-muted)] text-sm">
            <p>⚠️ BuildMyCycle is for educational and harm-reduction purposes only.</p>
            <p className="mt-1">Nothing here constitutes medical advice. Consult a physician before using any substances.</p>
            <p className="mt-3 text-xs">© 2025 BuildMyCycle.com</p>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
