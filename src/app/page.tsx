import { Metadata } from "next";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
    title: "NEXUS SAINT | CODE: POSTHUMAN",
    description: "Industrial, Cyber, and Posthuman Apparel. High-performance silhouettes for the digital age.",
    openGraph: {
        title: "NEXUS SAINT | CODE: POSTHUMAN",
        description: "Industrial, Cyber, and Posthuman Apparel.",
        type: "website",
    },
};

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <Hero />
                <ProductGrid />
            </main>
        </div>
    );
}
