import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * ═══════════════════════════════════════════════════════════════
 * PUNTO 3B — Middleware Edge para Protección de /admin
 * ═══════════════════════════════════════════════════════════════
 *
 * Este middleware se ejecuta en Vercel Edge Runtime (antes de SSR),
 * lo que significa:
 * - Latencia mínima (~5ms)
 * - No consume Serverless Function time
 * - Intercepta la request antes de que llegue a la página
 *
 * FLUJO:
 * 1. Si la ruta NO comienza con /admin → pasa sin cambios
 * 2. Si la ruta es /admin → lee la cookie de sesión de Supabase
 * 3. Valida el token con Supabase Auth (getUser)
 * 4. Si no hay sesión válida → redirige a /login
 * 5. Si hay sesión → deja pasar la request
 *
 * SEGURIDAD:
 * - Usa getUser() (valida contra Supabase) en vez de getSession() (solo lee JWT)
 * - getUser() es más seguro porque verifica que el token no esté revocado
 */

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ─── Solo interceptar rutas /admin ───
    if (!pathname.startsWith("/admin")) {
        return NextResponse.next();
    }

    // ─── Leer token de sesión de las cookies ───
    // Supabase Auth Helper almacena los tokens en cookies con este patrón:
    const accessToken =
        request.cookies.get("sb-access-token")?.value ||
        request.cookies.get("supabase-auth-token")?.value;

    // También buscar en el formato de @supabase/ssr
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        // Si no hay credenciales de Supabase, bloquear acceso por defecto
        console.warn("[MIDDLEWARE] Supabase credentials missing — blocking /admin");
        return redirectToLogin(request);
    }

    // ─── Buscar todas las cookies de Supabase ───
    // El formato de @supabase/ssr es: sb-{project-ref}-auth-token.{chunk}
    const projectRef = supabaseUrl.match(/https:\/\/(.+?)\.supabase/)?.[1] || "";
    const authCookieName = `sb-${projectRef}-auth-token`;

    // Las cookies pueden estar fragmentadas (chunked) en Next.js
    let tokenData: string | undefined;
    const allCookies = request.cookies.getAll();

    // Intentar cookie completa primero
    const singleCookie = allCookies.find((c) => c.name === authCookieName);
    if (singleCookie) {
        tokenData = singleCookie.value;
    } else {
        // Intentar cookies fragmentadas (sb-xxx-auth-token.0, .1, .2...)
        const chunks = allCookies
            .filter((c) => c.name.startsWith(`${authCookieName}.`))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => c.value);

        if (chunks.length > 0) {
            tokenData = chunks.join("");
        }
    }

    // Fallback: token directo de cookie legacy
    if (!tokenData && accessToken) {
        tokenData = accessToken;
    }

    if (!tokenData) {
        console.log("[MIDDLEWARE] No auth token found — redirecting to /login");
        return redirectToLogin(request);
    }

    // ─── Validar sesión con Supabase ───
    try {
        // Parsear el token si es JSON (formato @supabase/ssr)
        let jwt: string;
        try {
            const parsed = JSON.parse(tokenData);
            jwt = parsed.access_token || parsed[0]?.access_token || tokenData;
        } catch {
            jwt = tokenData;
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: { Authorization: `Bearer ${jwt}` },
            },
        });

        // getUser() valida contra el servidor (no solo decodifica el JWT)
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error || !user) {
            console.log("[MIDDLEWARE] Invalid session — redirecting to /login");
            return redirectToLogin(request);
        }

        // ─── Verificación de rol (opcional pero recomendado) ───
        // Si tienes roles en user_metadata o en una tabla separada:
        // const role = user.user_metadata?.role;
        // if (role !== "ADMIN") {
        //     return redirectToLogin(request);
        // }

        // ✅ Usuario autenticado — dejar pasar
        return NextResponse.next();
    } catch (err) {
        console.error("[MIDDLEWARE] Auth verification failed:", err);
        return redirectToLogin(request);
    }
}

/**
 * Redirige al login preservando la URL original como query param
 * para que el login pueda hacer redirect-back después.
 */
function redirectToLogin(request: NextRequest) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
}

/**
 * MATCHER: Solo ejecutar el middleware en rutas que empiecen con /admin.
 * Esto evita overhead innecesario en todas las demás rutas.
 */
export const config = {
    matcher: ["/admin/:path*"],
};
