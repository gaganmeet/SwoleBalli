import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const supabaseHost = env.VITE_SUPABASE_URL ? new URL(env.VITE_SUPABASE_URL).host : undefined

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: ['favicon.png', 'icons/apple-touch-icon.png'],
        manifest: {
          name: 'Open Gym',
          short_name: 'Open Gym',
          description: 'Track your training, coach your clients.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#ffffff',
          theme_color: '#2a78d6',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            {
              src: '/icons/icon-maskable-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          runtimeCaching: [
            ...(supabaseHost
              ? [
                  {
                    urlPattern: new RegExp(`^https://${supabaseHost}/auth/.*`),
                    handler: 'NetworkOnly' as const,
                  },
                  {
                    urlPattern: new RegExp(`^https://${supabaseHost}/rest/.*`),
                    handler: 'NetworkFirst' as const,
                    options: {
                      cacheName: 'supabase-api',
                      networkTimeoutSeconds: 4,
                      expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
                      cacheableResponse: { statuses: [0, 200] },
                    },
                  },
                ]
              : []),
            {
              urlPattern: ({ request }: { request: Request }) =>
                request.destination === 'image' || request.destination === 'font',
              handler: 'CacheFirst' as const,
              options: {
                cacheName: 'static-assets',
                expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  }
})
