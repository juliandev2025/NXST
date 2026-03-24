"use client";

import { useAuthStore } from "@/lib/auth-store";
import { useSettingsStore } from "@/lib/settings-store";
import { useMounted } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AccountPage() {
    const { user, logout, isAuthenticated } = useAuthStore();
    const { language } = useSettingsStore();
    const router = useRouter();
    const mounted = useMounted();

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push("/login");
        }
    }, [mounted, isAuthenticated, router]);

    if (!mounted || !isAuthenticated) return null;

    return (
        <div className="min-h-screen px-4 md:px-12 py-10 md:py-20">
            <div className="max-w-4xl mx-auto space-y-16">
                
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-black/10 pb-12">
                    <div>
                        <span className="font-mono text-[9px] text-gold-primary tracking-[0.4em] uppercase block mb-3">
                             User Profile_V1.0 // {user?.id}
                        </span>
                        <h1 className="font-heading text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                            {user?.name || (language === "ES" ? "USUARIO_CLIENTE" : "CLIENT_USER")}
                        </h1>
                        <p className="mt-4 font-mono text-xs opacity-40 uppercase tracking-widest">{user?.email}</p>
                    </div>
                    <button 
                        onClick={() => {
                            logout();
                            router.push("/");
                        }}
                        className="border border-black/15 font-mono text-[10px] tracking-[0.2em] px-10 py-4 uppercase sharp hover:border-black transition-colors"
                    >
                        {language === "ES" ? "CERRAR_SESIÓN" : "LOGOUT"}
                    </button>
                </div>

                {/* Dashboard Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Orders Column */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="flex justify-between items-center border-b border-black/10 pb-4">
                            <h2 className="font-heading text-xl font-bold uppercase tracking-tight">/ {language === "ES" ? "PEDIDOS_ACTIVOS" : "ACTIVE_ORDERS"}</h2>
                            <span className="font-mono text-[9px] opacity-30">[1 ACTIVE]</span>
                        </div>
                        
                        <div className="space-y-6">
                            {[
                                { id: "NX-8902", date: "23.03.2026", total: "$340.00", status: "ST_SHIPPED" }
                            ].map((order) => (
                                <div key={order.id} className="border border-black/10 p-6 bg-white/[0.02] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-black/[0.03]">
                                    <div className="space-y-1">
                                        <div className="font-heading font-bold text-lg">{order.id}</div>
                                        <div className="font-mono text-[10px] opacity-40 uppercase">{order.date} // {order.total}</div>
                                    </div>
                                    <div className="flex items-center gap-8 w-full md:w-auto">
                                         <div className="flex items-center gap-2">
                                             <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                             <span className="font-mono text-[10px] font-medium tracking-wider">{order.status}</span>
                                         </div>
                                         <button className="flex-1 md:flex-none border border-black/10 px-6 py-2 font-mono text-[9px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors">TRACK_ID</button>
                                    </div>
                                </div>
                            ))}
                            {/* Empty state for demonstration */}
                            <p className="font-mono text-[10px] opacity-30 uppercase tracking-[0.2em] pt-4 text-center">END_OF_ORDER_HISTORY</p>
                        </div>
                    </div>

                    {/* Account Settings / Sidebar */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h3 className="font-mono text-[11px] font-bold opacity-30 uppercase tracking-[0.3em]">/ {language === "ES" ? "AJUSTES" : "SETTINGS"}</h3>
                            <div className="flex flex-col gap-4">
                                <Link href="#" className="font-heading text-lg font-bold hover:italic hover:tracking-widest transition-all">{language === "ES" ? "DIRECCIONES" : "ADDRESSES"}</Link>
                                <Link href="#" className="font-heading text-lg font-bold hover:italic hover:tracking-widest transition-all">{language === "ES" ? "MÉTODOS_PAGO" : "PAYMENT_METHODS"}</Link>
                                <Link href="#" className="font-heading text-lg font-bold hover:italic hover:tracking-widest transition-all">{language === "ES" ? "DETALLES_PERFIL" : "PROFILE_DETAILS"}</Link>
                            </div>
                        </div>

                        <div className="bg-black text-white p-6 space-y-4">
                             <h4 className="font-mono text-[10px] font-bold tracking-[0.2em]">NXS_LOYALTY_PASS</h4>
                             <p className="font-mono text-[9px] opacity-60 leading-relaxed uppercase">
                                 {language === "ES" 
                                    ? "ESTADO: MIEMBRO_BRONCE // ACCESO A LANZAMIENTOS: ACTIVADO" 
                                    : "STATUS: BRONZE_MEMBER // ACCESS_TO_DROPS: ACTIVATED"}
                             </p>
                             <div className="w-full bg-white/20 h-[1px]">
                                 <div className="bg-gold-primary h-full w-1/3"></div>
                             </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
