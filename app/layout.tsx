import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "aos/dist/aos.css";
import Particles from "@/components/ui/Particles";
import ThreeParticleCursor from "@/components/ui/ThreeParticleCursor";
import { Toaster } from "@/components/ui/toaster"
import ComingSoon from "@/components/sections/coming";

const inter = Inter({ subsets: ["latin"] });

// Set this to false when you're ready to launch the full site
const COMING_SOON_MODE = true;

export const metadata: Metadata = {
  title: COMING_SOON_MODE ? "DeFi Bull World - Coming Soon" : "DeFi Bull World",
  description:
    "Empowering Web3 education through exclusive NFT memberships and token-gated content."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get("cookie");

  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider cookies={cookies}>
          {COMING_SOON_MODE ? (
            <ComingSoon />
          ) : (
            <>
              <Toaster />
              <Navbar />
              <main className="pt-14">{children}</main>
              <Footer />
              <Particles />
              <ThreeParticleCursor />
            </>
          )}
        </ContextProvider>
      </body>
    </html>
  );
}