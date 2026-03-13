"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useSettingsStore } from "@/lib/settings-store";
import { ALL_PRODUCTS, formatPrice } from "@/lib/products";

interface Product {
    id: string;
    name: string;
    category: string;
    price: string;
    image: string;
    images?: string[];
    status: string;
    details: string;
}

const SIZE_OPTIONS: Record<string, string[]> = {
    CAMISETA: ["XS", "S", "M", "L", "XL", "XXL"],
    HOODIE: ["S", "M", "L", "XL", "XXL"],
    CHAQUETA: ["S", "M", "L", "XL"],
    PANTALÓN: ["28", "30", "32", "34", "36"],
    ACCESORIO: ["ONE SIZE"],
};

const SIZE_GUIDE: Record<string, Record<string, Record<string, string>>> = {
    CAMISETA: {
        CHEST: { XS: "48", S: "51", M: "54", L: "57", XL: "60", XXL: "63" },
        LENGTH: { XS: "68", S: "70", M: "72", L: "74", XL: "76", XXL: "78" },
        SHOULDER: { XS: "44", S: "46", M: "48", L: "50", XL: "52", XXL: "54" },
    },
    HOODIE: {
        CHEST: { S: "56", M: "59", L: "62", XL: "65", XXL: "68" },
        LENGTH: { S: "68", M: "70", L: "72", XL: "74", XXL: "76" },
        SLEEVE: { S: "62", M: "64", L: "66", XL: "68", XXL: "70" },
    },
    CHAQUETA: {
        CHEST: { S: "54", M: "57", L: "60", XL: "63" },
        LENGTH: { S: "70", M: "72", L: "74", XL: "76" },
        SLEEVE: { S: "64", M: "66", L: "68", XL: "70" },
    },
};

export default function ProductDetailsContent({ initialProduct }: { initialProduct: Product }) {
    if (!initialProduct) return null;
    const params = useParams();
    const router = useRouter();
    const { addItem } = useCartStore();

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [sizeError, setSizeError] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const [sizeUnit, setSizeUnit] = useState<"cm" | "in">("cm");
    const [addedFeedback, setAddedFeedback] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { language, currency } = useSettingsStore();
    const [mounted, setMounted] = useState(false);

    const productImages = initialProduct.images || [initialProduct.image];

    useEffect(() => {
        setMounted(true);
    }, []);

    // Navigation
    const currentIndex = ALL_PRODUCTS.findIndex((p) => p.id === initialProduct.id);
    const nextProduct = currentIndex < ALL_PRODUCTS.length - 1 ? ALL_PRODUCTS[currentIndex + 1] : null;

    useEffect(() => {
        setSelectedSize(null);
        setSizeError(false);
        setOpenAccordion(null);
        setAddedFeedback(false);
        setCurrentImageIndex(0);
    }, [initialProduct.id]);

    const handleAddToCart = () => {
        const sizes = SIZE_OPTIONS[initialProduct.category.toUpperCase()] || ["ONE SIZE"];
        if (sizes[0] !== "ONE SIZE" && !selectedSize) {
            setSizeError(true);
            return;
        }
        setSizeError(false);
        addItem({
            id: initialProduct.id,
            name: initialProduct.name,
            category: initialProduct.category,
            price: initialProduct.price,
            image: initialProduct.image,
            details: `${initialProduct.details}${selectedSize ? ` · Size ${selectedSize}` : ""}`,
        });
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 2000);
    };

    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const sizes = SIZE_OPTIONS[initialProduct.category.toUpperCase()] || ["ONE SIZE"];
    const sizeGuide = SIZE_GUIDE[initialProduct.category.toUpperCase()];

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex justify-between items-center px-6 md:px-12 py-3 border-b border-black/8">
                <button
                    onClick={() => router.back()}
                    className="font-mono text-[10px] tracking-wider opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1.5"
                >
                    <span>‹</span> {mounted && language === "ES" ? "VOLVER A" : "BACK TO"} {initialProduct.category.toUpperCase()}
                </button>
                {nextProduct && (
                    <Link
                        href={`/product/${nextProduct.id}`}
                        className="font-mono text-[10px] tracking-wider opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1.5 no-underline"
                    >
                        {mounted && language === "ES" ? "SIGUIENTE PRODUCTO" : "NEXT PRODUCT"} <span>›</span>
                    </Link>
                )}
            </div>

            <main className="flex-1 flex flex-col lg:flex-row">
                {/* LEFT: Product Image(s) */}
                <div className="lg:w-[55%] bg-[#ece9e4] flex flex-col md:flex-row">
                    {/* Desktop Thumbnails (Left side) */}
                    {productImages.length > 1 && (
                        <div className="hidden md:flex flex-col gap-2 p-4 w-20 shrink-0 border-r border-black/5 bg-white/10">
                            {productImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative aspect-[3/4] overflow-hidden border transition-all ${
                                        currentImageIndex === idx ? "border-black" : "border-transparent opacity-50 hover:opacity-100"
                                    }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${initialProduct.name} - Thumbnail ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative flex-1 aspect-[3/4] lg:aspect-auto lg:h-full lg:min-h-[80vh]">
                        <Image
                            src={productImages[currentImageIndex]}
                            alt={initialProduct.name}
                            fill
                            className="object-cover object-center animate-in fade-in duration-500"
                            priority
                        />
                        
                        {/* Mobile Thumbnails / Dots */}
                        {productImages.length > 1 && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
                                {productImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            currentImageIndex === idx ? "bg-black w-4" : "bg-black/20"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        {initialProduct.status === "ST_LIMITED" && (
                            <div className="absolute top-4 left-4">
                                <span className="bg-black text-white font-mono text-[9px] tracking-wider px-3 py-1.5">
                                    {mounted && language === "ES" ? "EDICIÓN LIMITADA" : "LIMITED EDITION"}
                                </span>
                            </div>
                        )}
                        {initialProduct.status === "ST_PHASE_01" && (
                            <div className="absolute top-4 left-4">
                                <span className="bg-gold-primary text-white font-mono text-[9px] tracking-wider px-3 py-1.5">
                                    {mounted && language === "ES" ? "NUEVO" : "NEW"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:w-[45%] flex flex-col">
                    <div className="lg:sticky lg:top-20 flex flex-col h-auto lg:h-[calc(100vh-5rem)]">
                        <div className="flex-1 overflow-y-auto px-6 md:px-10 lg:px-12 pt-8 pb-6">
                            <h1 className="text-xl md:text-2xl font-heading font-bold tracking-tight mb-2">
                                {initialProduct.name}
                            </h1>
                            <p className="text-base font-heading mb-8">
                                {mounted ? formatPrice(initialProduct.price, currency) : initialProduct.price}
                            </p>

                            <div className="border-t border-black/8 pt-5 pb-5">
                                <p className="font-mono text-[11px] tracking-wider mb-3">
                                    {initialProduct.category.toUpperCase()}
                                </p>
                            </div>

                            {sizes[0] !== "ONE SIZE" && (
                                <div className="border-t border-black/8 pt-5 pb-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="font-mono text-[11px] tracking-wider">{mounted && language === "ES" ? "TALLA" : "SIZE"}</p>
                                        {sizeError && <span className="font-mono text-[10px] text-red-500">{mounted && language === "ES" ? "Por favor selecciona una talla" : "Please select a size"}</span>}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => { setSelectedSize(size); setSizeError(false); }}
                                                className={`min-w-[48px] h-10 px-4 font-mono text-[11px] tracking-wider border transition-all ${
                                                    selectedSize === size ? "bg-black text-white border-black" : "border-black/15 hover:border-black/40"
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-black/8 pt-5 pb-2">
                                <p className="font-mono text-[10px] opacity-50 leading-relaxed">
                                    {mounted && language === "ES" 
                                        ? "Envío mundial gratuito en todos los pedidos. Entrega en 5-10 días hábiles." 
                                        : "Free worldwide shipping on all orders. Delivery in 5–10 business days."}
                                </p>
                            </div>

                            <div className="mt-2">
                                <div className="border-t border-black/8">
                                    <button onClick={() => toggleAccordion("details")} className="w-full flex items-center justify-between py-4 group">
                                        <span className="font-mono text-[11px] tracking-wider font-medium">
                                            {mounted && language === "ES" ? "ESPECIFICACIONES_TÉCNICAS" : "TECHNICAL_SPECIFICATIONS"}
                                        </span>
                                        <span className={`text-sm transition-transform duration-200 ${openAccordion === "details" ? "rotate-90" : ""}`}>›</span>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-300 ${openAccordion === "details" ? "max-h-60 pb-5" : "max-h-0"}`}>
                                        <ul className="space-y-3 font-mono text-[11px] opacity-70 leading-relaxed pl-0 list-none">
                                            {initialProduct.details.split("//").map((detail, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <span className="w-1.5 h-[1px] bg-gold-primary mt-2 flex-shrink-0"></span>
                                                    <span>{detail.trim()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {sizeGuide && (
                                    <div className="border-t border-black/8">
                                        <button onClick={() => toggleAccordion("sizeguide")} className="w-full flex items-center justify-between py-4 group">
                                            <span className="font-mono text-[11px] tracking-wider font-medium">{mounted && language === "ES" ? "GUÍA DE TALLAS" : "SIZE GUIDE"}</span>
                                            <span className={`text-sm transition-transform duration-200 ${openAccordion === "sizeguide" ? "rotate-90" : ""}`}>›</span>
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ${openAccordion === "sizeguide" ? "max-h-96 pb-5" : "max-h-0"}`}>
                                            <p className="font-mono text-[10px] opacity-50 mb-4">
                                                {mounted && language === "ES" 
                                                    ? "Todas las medidas se toman sobre la prenda estirada en una superficie plana." 
                                                    : "All measurements are taken across the garment while laid flat."}
                                            </p>
                                            <div className="flex items-center gap-3 mb-4 font-mono text-[10px]">
                                                <button onClick={() => setSizeUnit("cm")} className={`pb-0.5 ${sizeUnit === "cm" ? "border-b border-black font-bold" : "opacity-40"}`}>CM</button>
                                                <span className="opacity-20">|</span>
                                                <button onClick={() => setSizeUnit("in")} className={`pb-0.5 ${sizeUnit === "in" ? "border-b border-black font-bold" : "opacity-40"}`}>INCHES</button>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full font-mono text-[10px]">
                                                    <thead>
                                                        <tr className="border-b border-black/10">
                                                            <th className="text-left py-2 pr-4 font-medium opacity-50">{mounted && language === "ES" ? "TALLA" : "SIZE"}</th>
                                                            {sizes.map(s => <th key={s} className="text-center py-2 px-3 font-medium opacity-50">{s}</th>)}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.entries(sizeGuide).map(([measurement, values]) => {
                                                            const translatedMeasurement = mounted && language === "ES" ? {
                                                                "CHEST": "PECHO",
                                                                "LENGTH": "LARGO",
                                                                "SLEEVE": "MANGA",
                                                                "SHOULDER": "HOMBRO"
                                                            }[measurement] || measurement : measurement;

                                                            return (
                                                                <tr key={measurement} className="border-b border-black/5">
                                                                    <td className="py-2.5 pr-4 font-medium">{translatedMeasurement}</td>
                                                                    {sizes.map(s => {
                                                                        const val = parseFloat(values[s] || "0");
                                                                        const display = sizeUnit === "in" ? (val / 2.54).toFixed(1) : val;
                                                                        return <td key={s} className="text-center py-2.5 px-3 opacity-70">{values[s] ? display : "—"}</td>;
                                                                    })}
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-black/8">
                                    <button onClick={() => toggleAccordion("shipping")} className="w-full flex items-center justify-between py-4 group">
                                        <span className="font-mono text-[11px] tracking-wider font-medium">{mounted && language === "ES" ? "ENVÍOS Y DEVOLUCIONES" : "SHIPPING & RETURNS"}</span>
                                        <span className={`text-sm transition-transform duration-200 ${openAccordion === "shipping" ? "rotate-90" : ""}`}>›</span>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-300 ${openAccordion === "shipping" ? "max-h-60 pb-5" : "max-h-0"}`}>
                                        <div className="space-y-4 font-mono text-[11px] opacity-70 leading-relaxed">
                                            <div>
                                                <p className="font-medium opacity-100 mb-1">{mounted && language === "ES" ? "Envío" : "Shipping"}</p>
                                                <p>{mounted && language === "ES" ? "Envío estándar: Gratis en todos los pedidos" : "Standard shipping: Free on all orders"}</p>
                                                <p>{mounted && language === "ES" ? "Envío express: $15.00 USD" : "Express shipping: $15.00 USD"}</p>
                                                <p>{mounted && language === "ES" ? "Entrega estimada: 5–10 días hábiles" : "Estimated delivery: 5–10 business days"}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium opacity-100 mb-1">{mounted && language === "ES" ? "Devoluciones" : "Returns"}</p>
                                                <p>{mounted && language === "ES" ? "Se aceptan devoluciones dentro de los 30 días posteriores a la entrega." : "Returns accepted within 30 days of delivery."}</p>
                                                <p>{mounted && language === "ES" ? "Los artículos deben estar sin usar y con las etiquetas originales." : "Items must be unworn with tags attached."}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-b border-black/8">
                                    <button onClick={() => toggleAccordion("care")} className="w-full flex items-center justify-between py-4 group">
                                        <span className="font-mono text-[11px] tracking-wider font-medium">{mounted && language === "ES" ? "CUIDADO" : "CARE"}</span>
                                        <span className={`text-sm transition-transform duration-200 ${openAccordion === "care" ? "rotate-90" : ""}`}>›</span>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-300 ${openAccordion === "care" ? "max-h-40 pb-5" : "max-h-0"}`}>
                                        <ul className="space-y-2 font-mono text-[11px] opacity-70 leading-relaxed pl-0 list-none">
                                            <li className="flex items-start gap-2"><span className="opacity-30">·</span> {mounted && language === "ES" ? "Lavar a máquina con agua fría" : "Machine wash cold"}</li>
                                            <li className="flex items-start gap-2"><span className="opacity-30">·</span> {mounted && language === "ES" ? "No usar blanqueador" : "Do not bleach"}</li>
                                            <li className="flex items-start gap-2"><span className="opacity-30">·</span> {mounted && language === "ES" ? "Secar en secadora a baja temperatura" : "Tumble dry low"}</li>
                                            <li className="flex items-start gap-2"><span className="opacity-30">·</span> {mounted && language === "ES" ? "Planchar a baja temperatura si es necesario" : "Iron low if needed"}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 px-6 md:px-10 lg:px-12 pb-6 pt-4 bg-[#b3b3b3]">
                            <button
                                onClick={handleAddToCart}
                                className={`w-full py-4 font-mono text-[11px] tracking-[0.15em] uppercase transition-all duration-300 ${
                                    addedFeedback ? "bg-green-900 text-white" : "bg-black text-white hover:bg-gold-primary"
                                }`}
                            >
                                {addedFeedback 
                                    ? (mounted && language === "ES" ? "✓ AÑADIDO AL CARRITO" : "✓ ADDED TO BAG") 
                                    : (mounted && language === "ES" ? `AÑADIR AL CARRITO — ${mounted ? formatPrice(initialProduct.price, currency) : initialProduct.price}` : `ADD TO BAG — ${mounted ? formatPrice(initialProduct.price, currency) : initialProduct.price}`)}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
