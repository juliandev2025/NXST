"use client";

import { useEffect, useRef } from "react";

export default function BackgroundEffects() {
    const fogRef = useRef<HTMLDivElement>(null);
    const patternRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 2; // -1 to 1
            const yPos = (clientY / window.innerHeight - 0.5) * 2; // -1 to 1

            if (fogRef.current) {
                // Fog moves slower for deep parallax
                fogRef.current.style.transform = `translate(${xPos * 15}px, ${yPos * 15}px) rotate(${xPos * 2}deg)`;
            }
            if (patternRef.current) {
                // Pattern moves faster to feel closer
                patternRef.current.style.transform = `translate(${xPos * -10}px, ${yPos * -10}px)`;
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <>
            <div className="fog-wrapper">
                <div ref={fogRef} className="fog-layer"></div>
            </div>
            <div ref={patternRef} className="background-pattern"></div>
            <div className="liquid-glass"></div>
            <div className="vignette"></div>
        </>
    );
}
