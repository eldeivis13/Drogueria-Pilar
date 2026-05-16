"use client";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F0EEF8]">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 max-w-screen-xl mx-auto w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
