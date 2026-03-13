"use client";

import { useEffect, useState } from "react";
import CategoryHero from "@/components/CategoryHero";
import CategoryProductGrid from "@/components/CategoryProductGrid";
import { getSpringSummerProducts } from "@/lib/products";
import { useSettingsStore } from "@/lib/settings-store";

export default function SpringSummer25Page() {
    const [mounted, setMounted] = useState(false);
    const { language } = useSettingsStore();
    const products = getSpringSummerProducts();
    const isEs = language === "ES";

    useEffect(() => {
        setMounted(true);
    }, []);

    const content = {
        title: "SPRING/SUMMER '25",
        subtitle: mounted && isEs 
            ? "DESPLIEGUE ESTACIONAL. MATERIALES LIGEROS, SILUETAS VENTILADAS Y ADAPTACIONES DE ALTA VISIBILIDAD."
            : "SEASONAL DEPLOYMENT. LIGHTWEIGHT MATERIALS, VENTILATED SILHOUETTES, AND HIGH-VISIBILITY ADAPTATIONS.",
        categories: [
            { en: "Seasonal T-Shirts", es: "Camisetas Estacionales" },
            { en: "Technical Vests", es: "Chalecos Técnicos" },
            { en: "Accessories", es: "Accesorios" }
        ],
        empty: mounted && isEs ? "COLECCIÓN_AGOTADA" : "COLLECTION_SOLD_OUT",
        label: mounted && isEs ? "ESTACIONAL" : "SEASONAL"
    };

    return (
        <div className="flex flex-col min-h-screen">
            <CategoryHero
                title={content.title}
                subtitle={content.subtitle}
                code="SS25_SEQUENCE"
                productCount={products.length}
            />

            {/* Collection Descriptor */}
            <section className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {content.categories.map((cat) => (
                        <div
                            key={cat.en}
                            className="border border-black/10 p-6 hover:border-gold-primary/40 transition-colors group"
                        >
                            <span className="font-mono text-[9px] opacity-40 tracking-[0.3em] uppercase block mb-2">
                                {mounted && isEs ? "SUB_SECUENCIA" : "SUB_SEQUENCE"}
                            </span>
                            <h3 className="font-heading text-lg font-bold group-hover:text-gold-primary transition-colors">
                                {(mounted && isEs ? cat.es : cat.en).toUpperCase()}
                            </h3>
                        </div>
                    ))}
                </div>
            </section>

            <CategoryProductGrid products={products} emptyMessage={content.empty} />

            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
                <div className="pt-8 border-t border-black/10 flex justify-between items-center opacity-30">
                    <div className="flex gap-4">
                        <span className="font-mono text-[8px]">[ SS_25 ]</span>
                        <span className="font-mono text-[8px] font-bold text-gold-muted">[ {content.label} ]</span>
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.3em]">NEXUS_SYSTEM_ST_0.4</span>
                </div>
            </div>
        </div>
    );
}
