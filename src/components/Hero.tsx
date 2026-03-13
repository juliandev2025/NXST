"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsVisible(true);

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 15;
            const y = (clientY / window.innerHeight - 0.5) * 15;
            setMousePos({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <section
            ref={containerRef}
            className={`relative h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Cinematic Background Image with Parallax */}
            <div
                className="absolute inset-0 z-0 bg-[#b3b3b3]"
                style={{
                    transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)`,
                    transition: 'transform 0.4s cubic-bezier(0.1, 0, 0, 1)'
                }}
            >
                <div className="relative w-full h-full grayscale brightness-[1.1] contrast-[1.1] opacity-[0.15]">
                    <Image
                        src="/hero-core.png"
                        alt="NEXUS INDUSTRIAL CORE"
                        fill
                        className="object-cover scale-110"
                        priority
                    />
                </div>
            </div>

            {/* Grain/Noise Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Central Framing Interface */}
            <div className="relative z-30 flex flex-col items-center max-w-5xl w-full px-6">
                <div className="flex items-center gap-4 mb-8 opacity-40 animate-pulse">
                    <div className="h-[1px] w-12 bg-black"></div>
                    <span className="font-mono text-[9px] tracking-[0.5em] uppercase">
                        SYSTEM_ID: NX-2026-ST
                    </span>
                    <div className="h-[1px] w-12 bg-black"></div>
                </div>

                <div className="relative group cursor-default">
                    {/* Decorative Corner Details */}
                    <div className="absolute -top-6 -left-6 w-8 h-8 border-t border-l border-black/20"></div>
                    <div className="absolute -top-6 -right-6 w-8 h-8 border-t border-r border-black/20"></div>
                    <div className="absolute -bottom-6 -left-6 w-8 h-8 border-b border-l border-black/20"></div>
                    <div className="absolute -bottom-6 -right-6 w-8 h-8 border-b border-r border-black/20"></div>

                    <h1 className="font-heading text-[12vw] md:text-[8vw] font-black tracking-[-0.07em] leading-[0.85] text-black transition-all duration-700 group-hover:tracking-[-0.05em]">
                        NEXUS SAINT
                    </h1>
                </div>

                <p className="mt-12 font-mono text-[10px] md:text-[11px] opacity-50 max-w-md text-center leading-relaxed tracking-wider uppercase">
                    Architectural apparel for the posthuman era. <br />
                    Industrial utility meets cybernetic refinement.
                </p>

                <div className="mt-12 flex flex-col md:flex-row gap-6">
                    <button className="mercury-btn group relative px-12 py-4 bg-black text-white font-mono text-[10px] tracking-[0.2em] uppercase sharp overflow-hidden">
                        <span className="relative z-10">INITIALIZE_ASSETS</span>
                        <div className="btn-shine"></div>
                    </button>
                    <button className="px-12 py-4 border border-black/10 hover:border-black transition-colors font-mono text-[10px] tracking-[0.2em] uppercase sharp">
                        View_Manifesto
                    </button>
                </div>
            </div>

            {/* Procedural Data Overlays */}
            <div className="absolute top-1/2 left-8 -translate-y-1/2 hidden lg:flex flex-col gap-12 pointer-events-none">
                <div className="rotate-90 origin-left">
                    <span className="font-mono text-[8px] opacity-20 tracking-[0.4em] uppercase">
                        COORDINATES: 40.7128° N, 74.0060° W
                    </span>
                </div>
                <div className="rotate-90 origin-left">
                    <span className="font-mono text-[8px] opacity-20 tracking-[0.4em] uppercase">
                        PROJECT_ST_PHASE_01
                    </span>
                </div>
            </div>

            <div className="absolute bottom-12 right-12 hidden lg:block opacity-20">
                <div className="flex flex-col items-end gap-2 text-right">
                    <span className="font-mono text-[8px] tracking-[0.3em]">[ STATUS: OPERATIONAL ]</span>
                    <div className="h-0.5 w-32 bg-black/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gold-primary w-2/3 animate-[progress_3s_ease-in-out_infinite]"></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </section>
    );
}
