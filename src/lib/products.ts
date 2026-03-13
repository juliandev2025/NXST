import { CategoryProduct } from "@/components/CategoryProductGrid";

/**
 * Central product catalog for NEXUS SAINT.
 * All category pages pull from this single source of truth.
 */

export const ALL_PRODUCTS: CategoryProduct[] = [
    // === CAMISETAS ===
    {
        id: "st-001",
        name: "CORE TEE — NOIR",
        category: "CAMISETA",
        price: "$85.00",
        image: "/product-tshirt-noir.png",
        images: ["/product-tshirt-noir.png", "/product-tshirt-blanc.png", "/hoodie.png"],
        status: "ST_ACTIVE",
        details: "100% Heavy Cotton · Industrial Fit",
    },
    {
        id: "st-004",
        name: "ESSENTIAL TEE — BLANC",
        category: "CAMISETA",
        price: "$75.00",
        image: "/product-tshirt-blanc.png",
        status: "ST_ACTIVE",
        details: "Minimalist Design · Reinforced Seams",
    },
    {
        id: "st-007",
        name: "OVERSIZED TEE — SHADOW",
        category: "CAMISETA",
        price: "$90.00",
        image: "/product-tshirt-noir.png",
        status: "ST_ACTIVE",
        details: "Relaxed Silhouette · Double Stitched",
    },
    {
        id: "st-008",
        name: "CYBER V '24 TEE — LIMITED",
        category: "CAMISETA",
        price: "$110.00",
        image: "/product-tshirt-blanc.png",
        status: "ST_LIMITED",
        details: "Valentine Capsule · Numbered Edition",
    },

    // === HOODIES ===
    {
        id: "st-002",
        name: "NEXUS HOODIE — GOLD EDITION",
        category: "HOODIE",
        price: "$145.00",
        image: "/product-hoodie-noir.png",
        status: "ST_LIMITED",
        details: "Metallic Branding · Oversized",
    },
    {
        id: "st-005",
        name: "MODULAR HOODIE — TECH",
        category: "HOODIE",
        price: "$160.00",
        image: "/product-hoodie-stealth.png",
        status: "ST_IN_QUEUE",
        details: "Hidden Zips · Thermal Core",
    },
    {
        id: "st-009",
        name: "STEALTH HOODIE — ECLIPSE",
        category: "HOODIE",
        price: "$155.00",
        image: "/product-hoodie-noir.png",
        status: "ST_ACTIVE",
        details: "Matte Black · Bonded Seams",
    },

    // === CHAQUETAS ===
    {
        id: "st-003",
        name: "SAINT SHELL JACKET",
        category: "CHAQUETA",
        price: "$220.00",
        image: "/product-jacket-shell.png",
        status: "ST_ACTIVE",
        details: "Waterproof · Modular Pockets",
    },
    {
        id: "st-006",
        name: "CARGO JACKET — R&D",
        category: "CHAQUETA",
        price: "$285.00",
        image: "/product-jacket-shell.png",
        status: "ST_PHASE_01",
        details: "Experimental Fabric · Gold Accents",
    },
    {
        id: "st-010",
        name: "OUTER SHELL — ARCTIC",
        category: "CHAQUETA",
        price: "$310.00",
        image: "/product-jacket-shell.png",
        status: "ST_ACTIVE",
        details: "Insulated Core · Wind Resistant",
    },

    // === ACCESORIOS ===
    {
        id: "st-011",
        name: "UTILITY BELT — MODULAR",
        category: "ACCESORIO",
        price: "$65.00",
        image: "/product-cargo-pants.png",
        status: "ST_ACTIVE",
        details: "Magnetic Buckle · Nylon Webbing",
    },
    {
        id: "st-012",
        name: "NEXUS CAP — STEALTH",
        category: "ACCESORIO",
        price: "$55.00",
        image: "/product-tshirt-noir.png",
        status: "ST_ACTIVE",
        details: "Structured Fit · Embroidered Logo",
    },

    // === PANTALONES ===
    {
        id: "st-013",
        name: "CARGO PANTS — TACTICAL",
        category: "PANTALÓN",
        price: "$135.00",
        image: "/product-cargo-pants.png",
        status: "ST_ACTIVE",
        details: "Ripstop Fabric · Multi-Pocket",
    },
    {
        id: "st-014",
        name: "JOGGER — PHANTOM",
        category: "PANTALÓN",
        price: "$115.00",
        image: "/product-cargo-pants.png",
        status: "ST_ACTIVE",
        details: "Tech Fleece · Tapered Cut",
    },
];

// --- FILTER HELPERS ---

export function getProductsByCategory(category: string): CategoryProduct[] {
    return ALL_PRODUCTS.filter(
        (p) => p.category.toUpperCase() === category.toUpperCase()
    );
}

export function getNewCollectionProducts(): CategoryProduct[] {
    return ALL_PRODUCTS.filter(
        (p) => p.status === "ST_LIMITED" || p.status === "ST_PHASE_01"
    );
}

export function getArchiveProducts(): CategoryProduct[] {
    return ALL_PRODUCTS.filter((p) => p.status === "ST_IN_QUEUE");
}

export function getCyberValentineProducts(): CategoryProduct[] {
    return ALL_PRODUCTS.filter(
        (p) =>
            p.id === "st-008" ||
            p.id === "st-002" ||
            p.id === "st-011" ||
            p.id === "st-012"
    );
}

export function getEssentialWearProducts(): CategoryProduct[] {
    return ALL_PRODUCTS.filter(
        (p) =>
            p.id === "st-007" ||
            p.id === "st-013" ||
            p.id === "st-010" ||
            p.id === "st-004"
    );
}
