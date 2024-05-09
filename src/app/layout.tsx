import Providers from "@/components/Providers";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";
import { cn } from "./lib/utils";

import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";



import { Toaster } from "@/components/ui/toaster";
import { constructMetadata } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='light'>
      <Providers>
        <body className={cn(
          'min-h-screen font-sans antialiased grainy',
          inter.className
        )}>
          <Toaster />
          <Navbar />
          {children}
          </body>
        </Providers>
    </html>
  );
}
