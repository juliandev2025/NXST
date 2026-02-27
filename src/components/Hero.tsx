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
            const x = (clientX / window.innerWidth - 0.5) * 20;
            const y = (clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className={`relative h-screen w-full flex flex-col items-center justify-start pt-[120px] overflow-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >

            {/* Cinematic Background Image with Parallax & Slow Zoom */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`,
                    transition: 'transform 0.2s ease-out'
                }}
            >
                <div className="relative w-full h-full slow-zoom grayscale brightness-[0.7] contrast-125 opacity-20">
                    <Image
                        src="/hero-core.png"
                        alt="Industrial Core"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Hero-specific Liquid Glass overlay */}
            <div className="absolute inset-0 z-10 backdrop-blur-[100px] bg-white/5 pointer-events-none"></div>

            {/* Overlay Vignette for depth */}
            <div className="absolute inset-0 z-15 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none"></div>

            {/* Center Content */}
            <div className="relative z-30 flex flex-col items-center text-center">
                <span className="font-mono text-[10px] wide-tracking mb-2 opacity-70 tracking-[0.4em] flicker">
                    ACCESS_ST_POINT_01
                </span>

                <div className="relative px-12 py-1">
                    {/* Internal Technical Framing Lines (Aligned with Text) */}
                    <div className="absolute top-0 left-[-100vw] right-[-100vw] h-px bg-white/10"></div>
                    <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-px bg-white/10"></div>
                    <div className="absolute left-0 top-[-100vh] bottom-[-100vh] w-px bg-white/5"></div>
                    <div className="absolute right-0 top-[-100vh] bottom-[-100vh] w-px bg-white/5"></div>

                    {/* Coordinate data relative to framing */}
                    <span className="absolute -top-3 left-0 font-mono text-[7px] text-white/20 tracking-tighter">X_REF: 40.7128N</span>
                    <span className="absolute -bottom-3 right-0 font-mono text-[7px] text-white/20 tracking-tighter">Y_REF: 74.006W</span>

                    <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black tracking-[-0.05em] text-white leading-none">
                        NEXUS SAINT
                    </h1>
                </div>

                <div className="group relative mt-6">
                    <button className="mercury-btn px-16 py-4 bg-white/10 backdrop-blur-md text-white font-mono text-xs wide-tracking uppercase sharp">
                        <span className="relative z-10">INITIALIZE_SYSTEM</span>
                        <div className="btn-shine"></div>
                    </button>
                </div>
            </div>

            {/* Vertical Side Text */}
            <div className="absolute left-10 bottom-24 z-20 hidden md:flex items-center gap-6">
                <div className="w-px h-12 bg-white/30"></div>
                <span className="vertical-text font-mono text-[9px] text-white opacity-40 wide-tracking uppercase">
                    ST_SERIES_01 // RESEARCH & DEVELOPMENT
                </span>
            </div>

            <div className="absolute right-10 top-24 z-20 hidden md:flex flex-col items-end gap-6 text-right">
                <span className="font-mono text-[9px] text-white opacity-40 wide-tracking uppercase">
                    POSTHUMAN_ITERATION_v1.0.4
                </span>
                <div className="w-px h-12 bg-white/30"></div>
            </div>

            {/* Bottom Status Bar Simulation */}
            <div className="absolute bottom-8 left-0 right-0 z-20 px-8 flex justify-between items-end font-mono text-[8px] text-white/30 uppercase wide-tracking">
                <div className="flex flex-col gap-1">
                    <span>PWR: OPTIMAL</span>
                    <span>NET: SECURE</span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                    <span>LAT: 0.042ms</span>
                    <span>STRM: ACTIVE</span>
                </div>
            </div>


        </section>
    );
}
