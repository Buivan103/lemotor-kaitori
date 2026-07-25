# セルトレ Clone — SELL AND TRADE

A clone of the car buyout / appraisal landing page at [sell.tc-v.com](https://sell.tc-v.com/), rebuilt with **Next.js (App Router)** + **Prisma** + **SQLite**.

> The original site is a Ruby on Rails app backed by a database (it persists appraisal
> "inquiries" via `POST /inquiries` and loads makers / car models / zip codes through
> ajax endpoints). **Yes, it uses a database**, so this clone includes one too.

## Features

- Orange-gradient hero + welcome modal that mirror the original design.
- Multi-step appraisal form (STEP 1 vehicle info → STEP 2 customer → STEP 3 contact).
- Live market-price estimate on submit ("独自算出した相場価格").
- **Database-backed**: makers, car models, recent-applications ticker, and captured leads.
- Simple admin view at `/admin` to confirm leads are stored.

## Tech stack

| Layer     | Choice                        |
| --------- | ----------------------------- |
| Framework | Next.js 14 (App Router)       |
| Database  | SQLite (via Prisma ORM)       |
| API       | Next.js Route Handlers        |

## Data model (`prisma/schema.prisma`)

- `Maker` — car manufacturers (国産車 / 輸入車), keyed by the real site's codes.
- `CarModel` — models belonging to a maker.
- `Inquiry` — the core lead table (vehicle + customer + contact + estimate).
- `Application` — the public "全国からお申し込みが続々" ticker.

## Getting started

```bash
# 1. install deps
npm install

# 2. set up env (SQLite file)
cp .env.example .env

# 3. create the database schema
npm run db:push

# 4. seed makers / models / demo data
npm run db:seed

# 5. run
npm run dev
```

Open http://localhost:3000 — and http://localhost:3000/admin to see stored leads.

## API endpoints

| Method | Path                          | Purpose                       |
| ------ | ----------------------------- | ----------------------------- |
| GET    | `/api/makers`                 | Makers grouped by category    |
| GET    | `/api/car-models?maker=MTOJ`  | Models for a maker            |
| GET    | `/api/applications`           | Recent applications ticker    |
| POST   | `/api/inquiries`              | Create an appraisal lead      |
| GET    | `/api/inquiries`              | List latest leads (admin)     |

## Notes

This is an educational clone. It does not send SMS, place phone calls, or share data
with third-party buyout companies like the original service does.
