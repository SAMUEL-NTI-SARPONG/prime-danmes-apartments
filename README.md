# Prime Danmes Apartments

Booking and property-management website for Prime Danmes Apartments in Anaji, Takoradi. It includes the public apartment catalogue, 17 locally hosted property photos, booking and contact forms, and a protected admin dashboard for apartments, bookings, maintenance records, and site contact details.

## Run locally

Requires Node.js 20 or later.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin dashboard is at [http://localhost:3000/admin](http://localhost:3000/admin).

Local development works without external accounts: data is persisted in `.data/dev-db.json`. If `ADMIN_PASSKEY` is not set in development, the local-only passkey is `danmes2026#admin`.

The **Site Details** tab in the admin dashboard controls the public street address, GhanaPost GPS address, phone numbers, WhatsApp numbers, email, office hours, and Google Maps embed URL. Changes are applied across the header, footer, homepage, contact page, and apartment booking pages.

## Production configuration

Copy `.env.example` to `.env.local` for local overrides, or add the same variables to the deployment environment.

Required in production:

- `DATABASE_URL`: Neon/PostgreSQL connection string for durable apartments, bookings, enquiries, maintenance data, and site settings.
- `ADMIN_PASSKEY`: private passkey used to enter the admin dashboard.
- `ADMIN_SESSION_SECRET`: a long random value used to sign admin session cookies.

Recommended:

- `WEB3FORMS_ACCESS_KEY`: sends every new booking and contact enquiry to the manager's verified email address. The booking remains saved if email delivery is unavailable.
- `BLOB_READ_WRITE_TOKEN`: enables durable apartment image uploads on Vercel. Local development stores uploads under `public/uploads`.

Optional WhatsApp automation:

- `MANAGER_WHATSAPP_1` and `CALLMEBOT_API_KEY_1` send new bookings through CallMeBot.
- `MANAGER_WHATSAPP_2` and `CALLMEBOT_API_KEY_2` add a second recipient.

Without automated WhatsApp credentials, a successful booking displays a pre-filled WhatsApp button so the guest can send the booking reference to the manager directly.

## Verification

```bash
npm run lint
npm run build
```

The downloaded property images and their source are documented in `public/images/danmes/README.md`.
