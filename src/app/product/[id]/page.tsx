"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";

interface Product {
    id: string;
    name: string;
    category: string;
    price: string;
    image: string;
    status: string;
    details: string;
}

export default function ProductDetail() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;
                if (data) setProduct(data);
            } catch (err) {
                console.error("Error fetching product:", err);
                // Fallback to local if needed, but since we are in detail view, 
                // we probably want to handle 404
            } finally {
                setIsLoading(false);
            }
        }

        if (params.id) fetchProduct();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center">
                <div className="h-1 w-24 bg-gold-primary animate-pulse rounded-full" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-8">
                <h1 className="font-heading text-4xl mb-4">ASSET_NOT_FOUND</h1>
                <button
                    onClick={() => router.push('/')}
                    className="font-mono text-sm border-b border-black hover:text-gold-primary hover:border-gold-primary transition-all"
                >
                    RETURN_TO_BASE
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <BackgroundEffects />
            <Navbar />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Image Section */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-white/5 border border-black/10 group">
                        <div className="absolute inset-0 bg-gold-glow opacity-30 bg-[radial-gradient(circle_at_center,var(--color-gold-glow),transparent)]" />
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover grayscale brightness-95 contrast-105"
                            priority
                        />
                        <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col justify-center border-l-2 border-gold-primary pl-8 lg:pl-16">
                        <div className="mb-8">
                            <span className="font-mono text-[10px] text-gold-muted tracking-[0.4em] uppercase mb-4 block">
                                REF: {product.id.toUpperCase()} // STATUS: {product.status}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-4 leading-none">
                                {product.name}
                            </h1>
                            <div className="flex gap-4 items-center">
                                <span className="bg-black text-white px-4 py-1 font-mono text-xs tracking-widest">
                                    {product.category}
                                </span>
                                <span className="text-3xl font-heading font-bold text-gold-primary">
                                    {product.price}
                                </span>
                            </div>
                        </div>

                        <div className="mb-12">
                            <h3 className="font-mono text-[10px] text-black/40 uppercase tracking-[0.2em] mb-4">Specification</h3>
                            <p className="font-mono text-sm leading-relaxed max-w-md">
                                {product.details}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 max-w-sm">
                            <button className="w-full bg-black text-white py-5 font-mono text-xs tracking-[0.3em] uppercase sharp hover:bg-gold-primary transition-colors">
                                ACQUIRE_ASSET
                            </button>
                            <button
                                onClick={() => router.back()}
                                className="w-full border border-black/20 py-5 font-mono text-xs tracking-[0.3em] uppercase sharp hover:border-black/50 transition-colors"
                            >
                                BACK_TO_COLLECTION
                            </button>
                        </div>

                        {/* Technical Footer Detail */}
                        <div className="mt-16 pt-8 border-t border-black/10 opacity-30">
                            <div className="flex justify-between items-center font-mono text-[8px]">
                                <span>NXST_OS_VERSION_0.4</span>
                                <span>SECURE_ENCRYPTION_ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
