# Electro Pi

Electro Pi is a Next.js food-ordering prototype with bilingual UI, cart and order flows, authenticated admin pages, and a Polar-powered payment path with a local checkout simulator fallback.

## What It Does

- Browse menu items on the homepage.
- Add items to a cart and place an order.
- Switch between cash-on-delivery and Polar checkout.
- View past orders in an authenticated orders page.
- Manage menu content from the admin dashboard.
- Upload menu images with Uploadthing when configured.

## Stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Clerk for authentication
- Drizzle ORM with Neon/Postgres support
- Polar for payment checkout
- Uploadthing for media uploads
- Tailwind CSS v4 for styling

## Getting Started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - build the app for production
- `npm run start` - start the production server
- `npm run lint` - run ESLint

## Environment Variables

Create a local `.env` file with the values your deployment needs.

- `DATABASE_URL` - Neon/Postgres connection string
- `NEXT_PUBLIC_APP_URL` - public app URL used for checkout redirects
- `POLAR_ACCESS_TOKEN` - Polar API token
- `POLAR_PRODUCT_ID` - Polar product ID for real checkout sessions
- `POLAR_WEBHOOK_SECRET` - Polar webhook verification secret
- `UPLOADTHING_TOKEN` - Uploadthing token for image uploads
- Clerk authentication keys - required by `@clerk/nextjs`

If `DATABASE_URL` is missing, the app falls back to the in-memory mock database. That is fine for short local sessions, but order data will not persist reliably across requests.

If Polar is not configured, checkout redirects to the local simulator at `/cart/checkout-simulation`.

## Key Routes

- `/` - menu and landing page
- `/cart` - cart and checkout flow
- `/cart/checkout-simulation` - local Polar simulator
- `/orders` - authenticated order history
- `/admin` - authenticated admin dashboard
- `/sign-in` and `/sign-up` - Clerk auth flows

Useful aliases:

- `/onsite-pay`
- `/cart/onsite-pay`

Both redirect to the checkout simulation path.

## Notes

- The app uses a fallback mock store when Neon is unavailable.
- Orders are protected by Clerk middleware.
- The UI supports English and Arabic, with theme toggling and a responsive mobile nav.
