import Image from "next/image";

import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />
        <ProductGrid />
      </main>

      <footer className="w-full p-8 flex justify-between font-mono text-[10px] opacity-30">
        <div>COORDINATES: 40.7128° N, 74.0060° W</div>
        <div className="text-center uppercase tracking-widest font-heading">
          © {new Date().getFullYear()} NEXUS SAINT [ LEGAL_ENTITY ]
        </div>
        <div>ST_PROJECT_CODE: NH-01</div>
      </footer>
    </div>
  );
}
