# Black Pepper Entertainment

Premium booking website for:
- `VSL`
- `VSR`
- `The Arcade`
- `Events`

The app uses:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Prisma ORM
- Supabase Postgres

## Local Setup

1. Copy the example env file.

```bash
cp .env.example .env.local
```

2. Fill in these required values in `.env.local`:
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`

3. Install dependencies.

```bash
npm install
```

4. Generate the Prisma client.

```bash
npx prisma generate
```

5. Apply the Prisma migrations to Supabase Postgres.

```bash
npx prisma migrate deploy
```

6. Seed baseline settings and availability slots.

```bash
npm run db:seed
```

7. Start the app.

```bash
npm run dev
```

## Auth + Roles

- All signups go through Supabase Auth.
- Every new profile defaults to `role = user`.
- App roles stay in the Prisma `User` table.
- Admin access is checked with `role === "admin"` on the server.
- These emails are allowlisted for admin promotion:
  - `adityasingh808589@gmail.com`
  - `gotofriend123@gmail.com`

If one of those emails signs in and already exists in Supabase Auth, the app profile layer promotes that email to `admin` when the user record syncs.

If you need to promote a different existing user manually:

```bash
node scripts/promote-admin.mjs someone@example.com
```

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Booking Notifications

- Booking notifications are triggered only after the booking record is saved successfully.
- Booking success is never rolled back if email or WhatsApp delivery fails.
- Each booking stores per-channel delivery flags so refreshes and reopens do not re-send the same notification for the same booking record.

### Gmail SMTP

Use a Gmail App Password in `.env.local`:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=blackpepperentertainment.in@gmail.com
SMTP_PASS=your_gmail_app_password
MAIL_FROM="Black Pepper Entertainment <blackpepperentertainment.in@gmail.com>"
```

### Twilio WhatsApp Sandbox

- `TWILIO_WHATSAPP_FROM` must be the Twilio sandbox sender, not your business mobile number.
- Customer numbers and any admin alert number must first join the sandbox.
- To enable the optional internal WhatsApp alert, set:

```bash
TWILIO_ADMIN_WHATSAPP_TO=whatsapp:+919203411611
```

If that variable is omitted, the admin WhatsApp alert stays skipped while customer delivery can still work.

## Events Module

- `/events` is the separate event discovery experience.
- `/events/[slug]` is the event detail page with its own sticky booking card.
- `/events/confirmation` is the success state for event bookings.
- `/host-an-event` is the organizer CTA page.
- Event bookings are stored in the Prisma `EventBooking` table, separate from the hall/studio `Booking` flow.

## What To Test Locally

1. Guest homepage, header, mobile menu, and auth popup.
2. Signup flow.
3. Login flow.
4. Logged-in user dashboard and booking ownership.
5. Logged-in admin access to `/admin`.
6. Booking creation.
7. Cancel flow and slot reopening.
8. Reschedule flow and slot transfer.
9. Waitlist and next-slot suggestions.
10. Booking confirmation email delivery state on the success page.
11. Customer WhatsApp confirmation through the Twilio sandbox.
12. Admin booking page notification status badges and last-attempt state.
13. Events discovery page, category filters, and promo sections.
14. Event detail page, ticket tier selection, and quantity controls.
15. Event booking API validation and event confirmation page.

## Notes

- Deployment is intentionally not included here.
- Supabase email confirmation should be configured to match your desired signup experience.
- The forgot-password page is still a placeholder UI until you wire the full email reset flow.
