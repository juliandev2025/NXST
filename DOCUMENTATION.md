# 🛠 Documentación: NEXUS SAINT Project

Este documento proporciona una visión detallada de la arquitectura, estructura de carpetas y componentes del proyecto **NEXUS SAINT**. El proyecto es una plataforma de e-commerce moderna con una estética "Industrial/R&D" inspirada en laboratorios de investigación tecnológica.

---

## 🏗 Arquitectura Técnica
- **Framework**: Next.js (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4.0 (Aesthetics: Dark Mode, Metallic Bevels, HUD layout)
- **Estado**: Zustand (Carrito, Autenticación, Configuración)
- **Base de Datos/Auth**: Supabase
- **Pagos**: Stripe & Mercado Pago
- **Deployment**: Vercel

---

## 📂 Estructura de Carpetas

### `src/app/`
Contiene las rutas y páginas de la aplicación siguiendo el sistema de [App Router](https://nextjs.org/docs/app) de Next.js.
- **`(root)`**: Página de inicio (`page.tsx`) y layout global (`layout.tsx`).
- **`account/`**: Gestión de perfil de usuario y pedidos.
- **`admin/`**: Panel de control para gestión de inventario (Role-based access).
- **`api/`**: Endpoints para webhooks de pagos y procesos de servidor.
- **`checkout/`**: Flujo de compra e integración con pasarelas de pago.
- **`[category]/`**: Páginas dinámicas para categorías bajo nombres específicos como `chaquetas`, `camisetas`, `hoodies`.

### `src/components/`
Componentes de UI reutilizables con un enfoque modular.
- **Layout**: `Navbar.tsx`, `Footer.tsx`, `Menu.tsx`.
- **Efectos Visuales**: `BackgroundEffects.tsx`, `EdgeDecorations.tsx`.
- **E-commerce**: `ProductGrid.tsx`, `CartSidebar.tsx`, `ProductDetailsContent.tsx`.

### `src/lib/`
Lógica de negocio, configuración de clientes y stores de estado global.
- **`supabase.ts`**: Cliente de conexión para la base de datos y autenticación.
- **`cart-store.ts`**: Lógica reactiva del carrito de compras con persistencia local.
- **`products.ts`**: Utilidades para fetch de datos e interfaces de producto.

---

## 🧱 Componentes Clave y Ejemplos de Código

### 1. `Navbar.tsx`
Controla la navegación principal y los accesos rápidos HUD. Utiliza un efecto de desenfoque (`backdrop-blur`) y bordes de alta tecnología.

**Propósito:** Navegación persistente y acceso a búsqueda/carrito.

```tsx
// Ejemplo de implementación conceptual
export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/10 bg-black/50">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <Logo />
        <NavigationLinks />
        <CartIndicator count={items.length} />
      </div>
    </nav>
  );
};
```

### 2. `BackgroundEffects.tsx`
Implementa el "Blueprint Grid" y los efectos de iluminación ambiental (Radial Glow).

**Propósito:** Establecer la atmósfera industrial del sitio sin interferir con la legibilidad.

```tsx
// Lógica de diseño
export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Líneas de cuadrícula técnica */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px]" />
      {/* Resplandor central naranja */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,77,0,0.03)_0%,transparent_70%)]" />
    </div>
  );
}
```

### 3. `cart-store.ts` (Zustand + Persistence)
Gestiona el estado global del carrito. Al usar Zustand, evitamos prop-drilling y aseguramos que el carrito se mantenga al recargar la página.

**Propósito:** Gestión dinámica de inventario en el cliente.

```typescript
// Implementación simplificada
export const useCartStore = create()(
  persist((set) => ({
    items: [],
    addItem: (product) => set((state) => ({ 
      items: [...state.items, product] 
    })),
    clear: () => set({ items: [] }),
  }), { name: 'nexus-saint-cart' })
);
```

### 4. `Hero.tsx`
El punto de entrada visual. Combina tipografía metálica con elementos decorativos HUD laterales.

---

## 🎨 Sistema de Diseño (Aesthetics)
- **Color Palette**: Dark UI (#080808), Neon Orange (Primary), Steel Gray.
- **Interactive FX**:
  - `Scanning Hover`: Efecto de esquinas de escaneo en tarjetas de producto.
  - `Metallic Bevel`: Bordes con gradientes que simulan profundidad metálica.
  - `Technical Hud`: Texto vertical informativo en los bordes de la pantalla.

---

## 🚀 Recomendación de Plataforma de Despliegue

Para desplegar y gestionar esta documentación de manera profesional, te recomiendo estas opciones según tu necesidad:

### A. Si quieres algo rápido y potente (Recomendado): **GitBook**
- **Plataforma**: [GitBook.com](https://www.gitbook.com/)
- **Ventajas**: Diseño industrial impecable de serie, buscador muy rápido, permite sincronizar con tu repositorio de GitHub para que la doc se actualice sola cuando editas archivos Markdown.
- **Caso de uso**: Equipos de desarrollo y clientes.

### B. Si prefieres control total (Technical): **Vercel + Nextra**
- **Framework**: [Nextra](https://nextra.site/)
- **Ventajas**: Se construye sobre Next.js. Puedes usar componentes de React dentro de la documentación. Es lo que usan proyectos como Turbo o SWR.
- **Caso de uso**: Documentación técnica profunda con demos interactivas.

### C. Si quieres algo minimalista: **GitHub Pages + Docsify**
- **Librería**: [Docsify](https://docsify.js.org/)
- **Ventajas**: No necesita compilación. Solo subes tus archivos `.md` y listo.
- **Caso de uso**: Documentación interna rápida y gratuita.

---
*Documentación NEXUS SAINT v1.0*
