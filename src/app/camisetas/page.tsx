"use client";

import { useEffect, useState } from "react";
import CategoryHero from "@/components/CategoryHero";
import CategoryProductGrid from "@/components/CategoryProductGrid";
import { getProductsByCategory } from "@/lib/products";
import { useSettingsStore } from "@/lib/settings-store";

export default function CamisetasPage() {
    const [mounted, setMounted] = useState(false);
    const { language } = useSettingsStore();
    const products = getProductsByCategory("CAMISETA");

    useEffect(() => {
        setMounted(true);
    }, []);

    const content = {
        title: mounted && language === "ES" ? "CAMISETAS" : "T-SHIRTS",
        subtitle: mounted && language === "ES" 
            ? "BASES DE INGENIERÍA. CONSTRUCCIONES DE ALGODÓN PESADO DISEÑADAS PARA LA SILUETA POSTHUMANA."
            : "ENGINEERED FOUNDATIONS. HEAVY COTTON CONSTRUCTIONS DESIGNED FOR THE POSTHUMAN SILHOUETTE.",
        empty: mounted && language === "ES" ? "INVENTARIO_VACÍO" : "INVENTORY_EMPTY",
        label: mounted && language === "ES" ? "CAPA_ESENCIAL" : "CORE_LAYER"
    };

    return (
        <div className="flex flex-col min-h-screen">
            <CategoryHero
                title={content.title}
                subtitle={content.subtitle}
                code="TSH_DIRECTORY"
                productCount={products.length}
            />
            <CategoryProductGrid products={products} emptyMessage={content.empty} />

            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
                <div className="pt-8 border-t border-black/10 flex justify-between items-center opacity-30">
                    <div className="flex gap-4">
                        <span className="font-mono text-[8px]">[ TSH_DIR ]</span>
                        <span className="font-mono text-[8px] font-bold text-gold-muted">[ {content.label} ]</span>
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.3em]">NEXUS_SYSTEM_ST_0.4</span>
                </div>
            </div>
        </div>
    );
}
