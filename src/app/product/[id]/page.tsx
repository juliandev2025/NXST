import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ALL_PRODUCTS } from "@/lib/products";
import ProductDetailsContent from "@/components/ProductDetailsContent";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
    if (id.startsWith("st-")) {
        return ALL_PRODUCTS.find((p) => p.id === id) || null;
    }

    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();
        if (data && !error) return data;
    } catch (err) {
        // fallback
    }
    return ALL_PRODUCTS.find((p) => p.id === id) || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: "Product Not Found | NEXUS SAINT",
        };
    }

    return {
        title: `${product.name} | NEXUS SAINT`,
        description: `${product.details} - Buy ${product.name} from the Nexus Saint industrial collection.`,
        openGraph: {
            title: `${product.name} | NEXUS SAINT`,
            description: product.details,
            images: [
                {
                    url: product.image,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    console.log("Fetching product with ID:", id);
    const product = await getProduct(id);

    if (!product) {
        console.log("Product not found for ID:", id);
        notFound();
    }

    console.log("Found product:", product.name);
    return <ProductDetailsContent initialProduct={product} />;
}
