import { MetadataRoute } from 'next'
import { ALL_PRODUCTS } from '@/lib/products'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nexus-saint.vercel.app'

  // Static routes
  const staticRoutes = [
    '',
    '/nueva-coleccion',
    '/camisetas',
    '/hoodies',
    '/chaquetas',
    '/archive',
    '/terms',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic product routes
  const productRoutes = ALL_PRODUCTS.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes]
}
