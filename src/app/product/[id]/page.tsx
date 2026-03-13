import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ALL_PRODUCTS } from "@/lib/products";
import ProductDetailsContent from "@/components/ProductDetailsContent";
import { notFound } from "next/navigation";

interface Props {
    params: { id: string };
}

async function getProduct(id: string) {
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
    const product = await getProduct(params.id);

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
    const product = await getProduct(params.id);

    if (!product) {
        notFound();
    }

    return <ProductDetailsContent initialProduct={product} />;
}
