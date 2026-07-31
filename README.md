# Digital Pearls

Marketing site + lightweight backend for **Digital Pearls**, a precision technology advisory firm. Built with Next.js (App Router), Tailwind CSS v4, MongoDB, Brevo (email), and Calendly (scheduling).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment & setup

All configuration lives in `.env.local` (gitignored). In production, set the same keys in the Vercel dashboard. See `.env.example` for the full list.

| Variable | What it is | Where to get it |
| --- | --- | --- |
| `MONGODB_URI` | Connection string | MongoDB Atlas → Connect → Drivers (free tier is fine) |
| `MONGODB_DB` | Database name | Defaults to `digitalpearls` |
| `BREVO_API_KEY` | Transactional email key | Brevo → SMTP & API → API Keys |
| `BREVO_SENDER_EMAIL` | Verified "from" address | Brevo → Senders (must be verified) |
| `BREVO_SENDER_NAME` | Display name on emails | e.g. `Digital Pearls` |
| `OWNER_NOTIFY_EMAIL` | Inbox for new enquiries | Your address |
| `ADMIN_PASSWORD` | Password for `/admin` | Choose a strong one |
| `AUTH_SECRET` | Signs the admin session cookie | Any random 32+ char string |
| `NEXT_PUBLIC_CALENDLY_URL` | Your Calendly booking link | Calendly → your event → Share |

## Features

- **Contact form → real email.** On submit, the enquiry is stored in MongoDB (`submissions` collection) and two emails go out via Brevo: a notification to `OWNER_NOTIFY_EMAIL` (with reply-to set to the client) and a branded confirmation to the client.
- **Scheduling via Calendly.** The contact page embeds your Calendly widget. **Reminder emails to both you and the client are configured in the Calendly dashboard** (Event → Notifications & Cancellation Policy), not in code — set the reminder timing there.
- **Admin panel at `/admin`.** Password-protected (single admin, JWT cookie). Manage the "Engagement of interest" options shown on the contact form: add, rename, reorder, hide/show, or delete. Also lists the most recent enquiries. Log in at `/admin/login`.

### Engagement options seeding

The `engagements` collection is **seeded automatically** on first access with the original default options, so nothing is lost. After that, everything is managed from `/admin`. The public form reads active options from `GET /api/engagements`; if the DB is unreachable it falls back to a built-in list so the form never breaks.

## Deployment (Vercel)

1. Push to a Git repo and import it into Vercel.
2. Add every variable from `.env.example` under Project → Settings → Environment Variables.
3. Deploy. Set `NEXT_PUBLIC_CALENDLY_URL` and the Brevo sender to your production values.

## Notes

- API routes run on the Node.js runtime (MongoDB driver requirement) and are `force-dynamic`.
- Admin routes are guarded by `middleware.ts`; the write APIs also re-check the session server-side.
