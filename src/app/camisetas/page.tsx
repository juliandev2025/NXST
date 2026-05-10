import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import CategoryHero from "@/components/CategoryHero";
import CategoryProductGrid from "@/components/CategoryProductGrid";
import { getProductsByCategory } from "@/lib/products";

/**
 * ═══════════════════════════════════════════════════════════════
 * PUNTO 3A — ISR (Incremental Static Regeneration) Ejemplo
 * ═══════════════════════════════════════════════════════════════
 *
 * Esta página es un Server Component (sin "use client").
 * Next.js App Router usa `revalidate` para cachear la página
 * como HTML estático y regenerarla cada N segundos en background.
 *
 * RESULTADO:
 * - Primera visita: genera la página y la cachea.
 * - Visitas siguientes dentro de 60s: sirve desde caché (0ms DB).
 * - Después de 60s: Next.js regenera la página en background.
 * - La DB solo se consulta 1 vez cada 60 segundos (no por visita).
 *
 * NOTA: Los productos están en lib/products.ts (datos estáticos locales).
 * Cuando migres a Supabase, descomenta el fetch y usa los datos de la DB.
 */

// ISR: Revalidar cada 60 segundos
export const revalidate = 60;

// Metadatos SEO estáticos para esta categoría
export const metadata: Metadata = {
    title: "T-SHIRTS | NEXUS SAINT",
    description:
        "Engineered foundations. Heavy cotton constructions designed for the posthuman silhouette.",
};

// ────────────────────────────────────────────────────────────────
// Función de datos — preparada para Supabase
// ────────────────────────────────────────────────────────────────
async function getCamisetas() {
    // ─── OPCIÓN 1: Datos locales (actual) ───
    return getProductsByCategory("CAMISETA");

    // ─── OPCIÓN 2: Desde Supabase (futura migración) ───
    // Descomenta esto cuando los productos estén en tu base de datos:
    //
    // const supabase = createClient(
    //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //     process.env.SUPABASE_SERVICE_ROLE_KEY!   // Service role: solo en servidor
    // );
    //
    // const { data, error } = await supabase
    //     .from("products")
    //     .select("*")
    //     .eq("category", "CAMISETA")
    //     .eq("active", true)
    //     .order("created_at", { ascending: false });
    //
    // if (error) {
    //     console.error("Supabase fetch error:", error);
    //     return [];
    // }
    //
    // return data ?? [];
}

// ────────────────────────────────────────────────────────────────
// Server Component — renderiza sin JS del cliente
// ────────────────────────────────────────────────────────────────
export default async function CamisetasPage() {
    const products = await getCamisetas();

    return (
        <div className="flex flex-col min-h-screen">
            <CategoryHero
                title="T-SHIRTS"
                subtitle="ENGINEERED FOUNDATIONS. HEAVY COTTON CONSTRUCTIONS DESIGNED FOR THE POSTHUMAN SILHOUETTE."
                code="TSH_DIRECTORY"
                productCount={products.length}
            />
            <CategoryProductGrid products={products} emptyMessage="INVENTORY_EMPTY" />

            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
                <div className="pt-8 border-t border-black/10 flex justify-between items-center opacity-30">
                    <div className="flex gap-4">
                        <span className="font-mono text-[8px]">[ TSH_DIR ]</span>
                        <span className="font-mono text-[8px] font-bold text-gold-muted">
                            [ CORE_LAYER ]
                        </span>
                    </div>
                    <span className="font-mono text-[8px] tracking-[0.3em]">
                        NEXUS_SYSTEM_ST_0.4
                    </span>
                </div>
            </div>
        </div>
    );
}
