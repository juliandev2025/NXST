import { CategoryProduct } from "@/components/CategoryProductGrid";



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
        details: "COMPOSICIÓN: 100% HEAVY COTTON // DENSIDAD: 400GSM // ORIGEN: NXS_LAB_01",
    },
    {
        id: "st-004",
        name: "ESSENTIAL TEE — BLANC",
        category: "CAMISETA",
        price: "$75.00",
        image: "/product-tshirt-blanc.png",
        status: "ST_ACTIVE",
        details: "COMPOSICIÓN: 100% ORGANIC COTTON // DENSIDAD: 280GSM // ESPEC: REINFORCED SEAMS",
    },
    {
        id: "st-007",
        name: "OVERSIZED TEE — SHADOW",
        category: "CAMISETA",
        price: "$90.00",
        image: "/product-tshirt-noir.png",
        status: "ST_ACTIVE",
        details: "COMPOSICIÓN: 100% PREMIUM COTTON // CORTE: RELAXED SILHOUETTE // ORIGEN: NXS_LAB_01",
    },
    {
        id: "st-008",
        name: "SPRING/SUMMER '25 TEE — LIMITED",
        category: "CAMISETA",
        price: "$110.00",
        image: "/product-tshirt-blanc.png",
        status: "ST_LIMITED",
        details: "PROGRAMA: S/S '25 CAPSULE // EDICIÓN: BATCH_LIMITED // ORIGEN: NXS_LAB_02",
    },

    // === HOODIES ===
    {
        id: "st-002",
        name: "NEXUS HOODIE — GOLD EDITION",
        category: "HOODIE",
        price: "$145.00",
        image: "/product-hoodie-noir.png",
        status: "ST_LIMITED",
        details: "TEJIDO: BRUSHED FLEECE // DENSIDAD: 500GSM // DETALLE: METALLIC BRANDING",
    },
    {
        id: "st-005",
        name: "MODULAR HOODIE — TECH",
        category: "HOODIE",
        price: "$160.00",
        image: "/product-hoodie-stealth.png",
        status: "ST_IN_QUEUE",
        details: "TEJIDO: THERMAL CORE // TIPO: MODULAR_ZIP // ORIGEN: NXS_LAB_03",
    },
    {
        id: "st-009",
        name: "STEALTH HOODIE — ECLIPSE",
        category: "HOODIE",
        price: "$155.00",
        image: "/product-hoodie-noir.png",
        status: "ST_ACTIVE",
        details: "TEJIDO: PRE-SHRUNK FLEECE // COLOR: MATTE BLACK // ORIGEN: NXS_LAB_01",
    },

    // === CHAQUETAS ===
    {
        id: "st-003",
        name: "SAINT SHELL JACKET",
        category: "CHAQUETA",
        price: "$220.00",
        image: "/product-jacket-shell.png",
        status: "ST_ACTIVE",
        details: "MEMBRANA: WATERPROOF SHELL // ESPEC: MODULAR POCKETS // ORIGEN: NXS_LAB_04",
    },
    {
        id: "st-006",
        name: "CARGO JACKET — R&D",
        category: "CHAQUETA",
        price: "$285.00",
        image: "/product-jacket-shell.png",
        status: "ST_PHASE_01",
        details: "PROGRAMA: EXPERIMENTAL_UNIT // ACABADO: GOLD ACCENTS // ORIGEN: NXS_LAB_04",
    },
    {
        id: "st-010",
        name: "OUTER SHELL — ARCTIC",
        category: "CHAQUETA",
        price: "$310.00",
        image: "/product-jacket-shell.png",
        status: "ST_ACTIVE",
        details: "MATERIAL: INSULATED CORE // ESPEC: WIND RESISTANT // ORIGEN: NXS_LAB_04",
    },

    // === ACCESORIOS ===
    {
        id: "st-011",
        name: "UTILITY BELT — MODULAR",
        category: "ACCESORIO",
        price: "$65.00",
        image: "/product-cargo-pants.png",
        status: "ST_ACTIVE",
        details: "SISTEMA: MAGNETIC BUCKLE // WEBBING: INDUSTRIAL NYLON // ORIGEN: NXS_LAB_03",
    },
    {
        id: "st-012",
        name: "NEXUS CAP — STEALTH",
        category: "ACCESORIO",
        price: "$55.00",
        image: "/product-tshirt-noir.png",
        status: "ST_ACTIVE",
        details: "TIPO: STRUCTURED FIT // LOGO: EMBROIDERED // ORIGEN: NXS_LAB_01",
    },

    // === PANTALONES ===
    {
        id: "st-013",
        name: "CARGO PANTS — TACTICAL",
        category: "PANTALÓN",
        price: "$135.00",
        image: "/product-cargo-pants.png",
        status: "ST_ACTIVE",
        details: "TEJIDO: RIPSTOP FABRIC // ESPEC: MULTI-POCKET // ORIGEN: NXS_LAB_03",
    },
    {
        id: "st-014",
        name: "JOGGER — PHANTOM",
        category: "PANTALÓN",
        price: "$115.00",
        image: "/product-cargo-pants.png",
        status: "ST_ACTIVE",
        details: "TEJIDO: TECH FLEECE // CORTE: TAPERED FIT // ORIGEN: NXS_LAB_01",
    },
];



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

export function getSpringSummerProducts(): CategoryProduct[] {
    return ALL_PRODUCTS.filter(
        (p) =>
            p.id === "st-008" ||
            p.id === "st-002" ||
            p.id === "st-011" ||
            p.id === "st-012"
    );
}



export const USD_TO_COP = 4000;

export function formatPrice(priceStr: string, currency: "USD" | "COP"): string {
    const numericPrice = parseFloat(priceStr.replace("$", "").replace(",", ""));
    if (currency === "COP") {
        const copPrice = numericPrice * USD_TO_COP;
        return `COP $${copPrice.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return `$${numericPrice.toFixed(2)}`;
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
