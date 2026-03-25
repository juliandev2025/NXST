"use client";

import { useAuthStore } from "@/lib/auth-store";
import { useSettingsStore } from "@/lib/settings-store";
import { useMounted } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ALL_PRODUCTS as products } from "@/lib/products";

export default function AdminDashboard() {
    const { user, logout, isAuthenticated } = useAuthStore();
    const { language } = useSettingsStore();
    const router = useRouter();
    const mounted = useMounted();

    useEffect(() => {
        if (mounted && (!isAuthenticated || user?.role !== "ADMIN")) {
            router.push("/login");
        }
    }, [mounted, isAuthenticated, user, router]);

    if (!mounted || user?.role !== "ADMIN") return null;

    return (
        <div className="min-h-screen px-4 md:px-12 py-10 md:py-16">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/10 pb-8">
                    <div>
                        <span className="font-mono text-[9px] text-gold-primary tracking-[0.4em] uppercase block mb-2">
                             System Terminal // Admin_v1.0
                        </span>
                        <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                            {language === "ES" ? "PANEL_CONTROL" : "CONTROL_PANEL"}
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            className="bg-black text-white font-mono text-[10px] tracking-[0.2em] px-8 py-3 uppercase sharp hover:bg-gold-primary transition-colors h-12"
                        >
                            {language === "ES" ? "NUEVO_PEDIDO" : "NEW_ORDER"}
                        </button>
                        <button 
                            onClick={() => {
                                logout();
                                router.push("/");
                            }}
                            className="border border-black/15 font-mono text-[10px] tracking-[0.2em] px-8 py-3 uppercase sharp hover:border-black transition-colors h-12"
                        >
                            {language === "ES" ? "SALIR" : "LOGOUT"}
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "REV_TOTAL", value: "$45,230.00", status: "ST_ACTIVE" },
                        { label: "PEDIDOS_PEND", value: "12", status: "ST_PENDING" },
                        { label: "STOCK_BAJO", value: "05", status: "ST_WARNING", color: "text-red-500" },
                        { label: "VISITAS_HOY", value: "1,240", status: "ST_STABLE" }
                    ].map((stat, i) => (
                        <div key={i} className="border border-black/[0.08] p-6 bg-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-1 h-full bg-black/10 group-hover:bg-gold-primary transition-colors" />
                            <span className="font-mono text-[9px] opacity-40 uppercase tracking-widest">{stat.label}</span>
                            <div className={`text-3xl font-heading font-black mt-2 ${stat.color || 'text-black'}`}>{stat.value}</div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-pulse" />
                                <span className="font-mono text-[8px] opacity-30">{stat.status}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Orders History */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center border-b border-black/5 pb-4">
                            <h2 className="font-heading text-xl font-bold uppercase tracking-tight">/ {language === "ES" ? "PEDIDOS_RECIENTES" : "RECENT_ORDERS"}</h2>
                            <span className="font-mono text-[9px] opacity-30">LOG_ENTRIES: [12]</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-mono text-[10px] uppercase border-collapse">
                                <thead className="border-b border-black/10">
                                    <tr className="opacity-40">
                                        <th className="py-4 px-2">ORDER_ID</th>
                                        <th className="py-4 px-2">CUSTOMER</th>
                                        <th className="py-4 px-2">STATUS</th>
                                        <th className="py-4 px-2">TOTAL</th>
                                        <th className="py-4 px-2 text-right">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/[0.03]">
                                    {[
                                        { id: "NX-8902", client: "JULIAN_F", status: "ST_SHIPPED", total: "$340.00" },
                                        { id: "NX-8903", client: "ANDRES_G", status: "ST_PROCESSING", total: "$120.00" },
                                        { id: "NX-8904", client: "LAURA_M", status: "ST_PENDING", total: "$540.00" },
                                        { id: "NX-8905", client: "FELIPE_S", status: "ST_SHIPPED", total: "$220.00" }
                                    ].map((order) => (
                                        <tr key={order.id} className="hover:bg-black/[0.02] transition-colors group">
                                            <td className="py-4 px-2 font-bold">{order.id}</td>
                                            <td className="py-4 px-2 opacity-60">{order.client}</td>
                                            <td className="py-4 px-2 flex items-center gap-2 mt-4 md:mt-0">
                                                <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'ST_SHIPPED' ? 'bg-green-500' : 'bg-gold-primary animate-pulse'}`} />
                                                {order.status}
                                            </td>
                                            <td className="py-4 px-2 font-bold">{order.total}</td>
                                            <td className="py-4 px-2 text-right">
                                                <button className="text-[8px] border border-black/10 px-3 py-1 hover:bg-black hover:text-white transition-colors">VIEW_DATA</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Inventory Snapshot */}
                    <div className="space-y-6 bg-black/[0.03] p-8 border border-black/5">
                        <div className="flex justify-between items-center border-b border-black/5 pb-4">
                            <h2 className="font-heading text-xl font-bold uppercase tracking-tight">/ {language === "ES" ? "INVENTARIO_ACTIVO" : "ACTIVE_INVENTORY"}</h2>
                             <span className="font-mono text-[9px] opacity-30 text-gold-primary">SYNC_OK</span>
                        </div>
                        <div className="space-y-4">
                            {products.slice(0, 5).map((prod) => (
                                <div key={prod.id} className="flex justify-between items-center group">
                                    <div className="flex flex-col">
                                        <span className="font-heading text-[11px] font-bold group-hover:text-gold-primary transition-colors">{prod.name}</span>
                                        <span className="font-mono text-[8px] opacity-40">REF: {prod.id}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-end">
                                            <span className="font-mono text-[10px] font-bold">128_UNITS</span>
                                            <span className="font-mono text-[7px] opacity-30">ST_OK</span>
                                        </div>
                                        <button className="w-6 h-6 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                                            +
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full h-12 border border-black/10 font-mono text-[9px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors mt-8">
                            {language === "ES" ? "VER_INVENTARIO_COMPLETO" : "VIEW_FULL_INVENTORY"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
