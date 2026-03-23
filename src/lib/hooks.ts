import { useState, useEffect } from "react";

/**
 * Hook reutilizable para detectar si el componente está montado en el cliente.
 * Evita hydration mismatches entre SSR y CSR.
 * Reemplaza el patrón repetitivo: const [mounted, setMounted] = useState(false); useEffect(()=>setMounted(true),[]);
 */
export function useMounted(): boolean {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    return mounted;
}
