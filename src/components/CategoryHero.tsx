"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CategoryHeroProps {
    title: string;
    subtitle: string;
    code?: string;
    productCount?: number;
}

export default function CategoryHero({ title, subtitle, productCount }: CategoryHeroProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    return (
        <section
            className={`relative w-full pt-8 pb-12 px-6 md:px-12 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        >
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-8 font-mono text-[10px] opacity-40 tracking-wider">
                    <Link href="/" className="hover:opacity-100 transition-opacity">Home</Link>
                    <span>/</span>
                    <span className="opacity-100 text-black">{title}</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-3">
                    {title}
                </h1>
                <p className="font-mono text-[11px] opacity-45 max-w-lg leading-relaxed">
                    {subtitle}
                </p>
            </div>
        </section>
    );
}
