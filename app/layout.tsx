import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "aos/dist/aos.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Particles from "@/components/ui/Particles";
import ThreeParticleCursor from "@/components/ui/ThreeParticleCursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeFi Bull World",
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
        <AuthProvider>
          <ContextProvider cookies={cookies}>
            <Navbar />
            <main className="pt-14">{children}</main>
            <Footer />
            <Particles />
            <ThreeParticleCursor />
          </ContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
