# Le Motor — 車買取・査定ランディング

Appraisal / buyout landing page for **Le Motor** ([lemotor.jp](https://lemotor.jp/)), built with **Next.js (App Router)**.

Vehicle catalogs live in JSON under `data/`. Inquiry leads are appended to a **Google Spreadsheet** after the customer submits and sees the estimate.

## Features

- Le Motor branded header, hero, modal, and footer
- Multi-step appraisal form (vehicle → customer → contact)
- Market-price estimate on submit
- Static makers / models / applications ticker from `data/*.json`
- Leads → Google Sheets via Apps Script webhook

## Getting started

```bash
npm install
cp .env.example .env
# Set GOOGLE_SHEETS_WEBHOOK_URL after deploying the Apps Script (optional in local dev)
npm run dev
```

Open http://localhost:3000

### Google Sheet setup

1. Create a spreadsheet (optional sheet name: `査定依頼`) with header row matching `lib/google-sheets.js`.
2. Paste `scripts/google-sheets-apps-script.js` into Extensions → Apps Script.
3. Deploy as Web app (Execute as: Me, Who has access: Anyone).
4. Put the URL in `.env` as `GOOGLE_SHEETS_WEBHOOK_URL`.

Without the URL, local `npm run dev` still shows estimates and logs the lead to the console. Production requires the webhook.

## Data files

| File | Purpose |
|------|---------|
| `data/makers.json` | Domestic / imported makers |
| `data/car-models.json` | Models keyed by maker code |
| `data/applications.json` | Recent applications ticker |

## Contact (from lemotor.jp)

- TEL: 090-9156-3524
- Email: lemotor.jp@gmail.com
- Site: https://lemotor.jp/
