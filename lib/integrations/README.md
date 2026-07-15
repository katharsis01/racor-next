# Integraciones pendientes de credenciales

Cada servicio se activa creando la cuenta, rellenando sus variables en `.env.local`
(ver `.env.example` en la raíz) e instalando su SDK. La UI ya está preparada.

| Servicio | Variables | SDK a instalar | Dónde se conecta |
| --- | --- | --- | --- |
| Shopify Headless | `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | — (fetch a Storefront API) | `lib/commerce/index.ts` |
| Medusa | `MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | `@medusajs/js-sdk` | `lib/commerce/index.ts` |
| Stripe Checkout | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `stripe` | crear `app/api/checkout/route.ts` |
| Sanity (CMS) | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | `next-sanity` | `lib/integrations/sanity.ts` |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `@supabase/supabase-js` | `lib/integrations/supabase.ts` |
| Cloudinary | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | — (loader de next/image) | `next.config.ts` (`images.loaderFile`) |
| GA4 | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | — (`@next/third-parties`) | `components/site/analytics.tsx` |
| Microsoft Clarity | `NEXT_PUBLIC_CLARITY_PROJECT_ID` | — | `components/site/analytics.tsx` |
| Vercel | — | — | `vercel deploy` desde esta carpeta |
