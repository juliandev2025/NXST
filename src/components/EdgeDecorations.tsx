"use client";

import { useEffect, useState } from "react";

export default function EdgeDecorations() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">

            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-16 opacity-10 hidden xl:flex">
                <div className="vertical-text font-mono text-[7px] tracking-[0.4em] uppercase whitespace-nowrap">
                    SYSTEM_ACTIVE // システム稼働中
                </div>
                <div className="w-[1px] h-32 bg-black/20"></div>
                <div className="vertical-text font-mono text-[7px] tracking-[0.4em] uppercase whitespace-nowrap">
                    NXS_LAB_V4 // プロトコル
                </div>
            </div>


            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-16 opacity-10 hidden xl:flex">
                <div className="vertical-text font-mono text-[7px] tracking-[0.4em] uppercase whitespace-nowrap text-right">
                    SECURED_STREAM // 接続済み
                </div>
                <div className="w-[1px] h-32 bg-black/20"></div>
                <div className="vertical-text font-mono text-[7px] tracking-[0.4em] uppercase whitespace-nowrap text-right">
                    GLOBAL_DIST // 国際配送
                </div>
            </div>


            <div className="absolute left-10 bottom-12 opacity-5 hidden md:block">
                <div className="font-mono text-[6px] leading-relaxed space-y-1 uppercase tracking-[0.2em]">
                    <div>OS_KRNL: NEXUS_ST_v0.4.2</div>
                    <div>MEM_USAGE: ADAPTIVE</div>
                    <div>LOC_ORIGIN: 4.7110° N, 74.0721° W</div>
                    <div className="text-gold-primary">STATUS: ACCESS_GRANTED</div>
                </div>
            </div>


            <div className="absolute right-10 bottom-12 opacity-5 hidden md:block text-right">
                <div className="font-mono text-[6px] leading-relaxed space-y-1 uppercase tracking-[0.2em]">
                    <div>[ 新入荷 ] NEW_IN_STOCK</div>
                    <div>[ 限定版 ] LIMITED_EDITION</div>
                    <div>[ 規格 ] SPEC_INDUSTRIAL</div>
                </div>
            </div>


            <div className="absolute top-1/4 left-0 w-2 h-[1px] bg-black/10"></div>
            <div className="absolute top-3/4 left-0 w-2 h-[1px] bg-black/10"></div>
            <div className="absolute top-1/4 right-0 w-2 h-[1px] bg-black/10"></div>
            <div className="absolute top-3/4 right-0 w-2 h-[1px] bg-black/10"></div>
        </div>
    );
}
