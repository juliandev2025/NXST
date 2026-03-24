"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, UserRole } from "@/lib/auth-store";
import { useSettingsStore } from "@/lib/settings-store";
import { useMounted } from "@/lib/hooks";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, isAuthenticated } = useAuthStore();
    const { language } = useSettingsStore();
    const router = useRouter();
    const mounted = useMounted();

    useEffect(() => {
        if (mounted && isAuthenticated) {
            router.push("/");
        }
    }, [mounted, isAuthenticated, router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Mock login logic
        if (email === "admin@nexussaint.com" && password === "admin123") {
            login({
                id: "1",
                email: "admin@nexussaint.com",
                name: "ADMIN_ALPHA",
                role: "ADMIN",
            });
            router.push("/admin");
        } else if (email === "cliente@email.com" && password === "cliente123") {
            login({
                id: "2",
                email: "cliente@email.com",
                name: "CLIENT_ZERO",
                role: "CLIENT",
            });
            router.push("/account");
        } else {
            setError(language === "ES" ? "CREDENCIALES_INVÁLIDAS" : "INVALID_CREDENTIALS");
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-md bg-white/5 border border-black/10 p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-black/10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-black/10 pointer-events-none" />
                
                <div className="mb-10 text-center">
                    <span className="font-mono text-[9px] text-gold-primary tracking-[0.4em] uppercase block mb-2">
                        {language === "ES" ? "ACCESO_SISTEMA" : "SYSTEM_ACCESS"}
                    </span>
                    <h1 className="font-heading text-4xl font-black tracking-tighter uppercase">
                        {language === "ES" ? "INGRESAR" : "SIGN IN"}
                    </h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="font-mono text-[9px] opacity-40 tracking-[0.2em] uppercase block mb-2">
                            {language === "ES" ? "IDENTIFICACIÓN (EMAIL)" : "IDENTIFICATION (EMAIL)"}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="USER@NEXUSSAINT.COM"
                            className="w-full bg-transparent border border-black/15 px-4 py-3 font-mono text-sm focus:border-black outline-none transition-colors sharp uppercase"
                        />
                    </div>

                    <div>
                        <label className="font-mono text-[9px] opacity-40 tracking-[0.2em] uppercase block mb-2">
                            {language === "ES" ? "CÓDIGO_ACCESO (PASSWORD)" : "ACCESS_CODE (PASSWORD)"}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full bg-transparent border border-black/15 px-4 py-3 font-mono text-sm focus:border-black outline-none transition-colors sharp"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-600 font-mono text-[10px] p-3 text-center uppercase tracking-wider">
                            {error}
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="mercury-btn w-full h-14 bg-black text-white font-mono text-[10px] tracking-[0.3em] uppercase sharp group relative overflow-hidden"
                        >
                            <span className="relative z-10">
                                {language === "ES" ? "INICIALIZAR_SESIÓN" : "INITIALIZE_SESSION"}
                            </span>
                            <div className="btn-shine" />
                        </button>
                    </div>

                    <div className="text-center pt-6 opacity-30">
                        <p className="font-mono text-[8px] uppercase tracking-widest leading-loose">
                            {language === "ES" 
                                ? "ADMIN: admin@nexussaint.com / admin123" 
                                : "ADMIN: admin@nexussaint.com / admin123"}
                            <br />
                            {language === "ES" 
                                ? "CLIENT: cliente@email.com / cliente123" 
                                : "CLIENT: cliente@email.com / cliente123"}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
