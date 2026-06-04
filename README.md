# Reno Notice Board

A full-stack Notice Board built with Next.js (Pages Router), Prisma, and TiDB Cloud (MySQL), deployed on Vercel.

## Live Demo

[YOUR_VERCEL_URL_HERE]

## Features

- Create, Read, Update, Delete notices
- Server-side validation on all API routes
- Urgent notices appear first (Prisma orderBy, not browser sorting)
- Red Urgent badge on urgent notices
- Confirmation dialog before deleting
- Responsive card grid (mobile + desktop)
- Optional image URL support (bonus)

## Tech Stack

- Framework: Next.js 14, Pages Router
- ORM: Prisma
- Database: TiDB Cloud (MySQL, free tier)
- Hosting: Vercel (Hobby tier)
- Styling: Tailwind CSS

## How to Run Locally

### Prerequisites
- Node.js 18+
- Free TiDB Cloud account (tidbcloud.com)

### Steps

git clone https://github.com/YOUR_USERNAME/reno-noticeboard.git
cd reno-noticeboard
npm install
cp .env.example .env.local

Add your DATABASE_URL in .env.local:
DATABASE_URL="mysql://username:password@host:4000/noticeboard?sslaccept=strict"

npx prisma db push
npm run dev

Open http://localhost:3000

## API Routes

- GET    /api/notices         - List all notices (Urgent first)
- POST   /api/notices         - Create a notice
- GET    /api/notices/[id]    - Get single notice
- PUT    /api/notices/[id]    - Update a notice
- DELETE /api/notices/[id]    - Delete a notice

## One Thing I Would Improve With More Time

Add real image upload support using Vercel Blob or Cloudinary. Currently only image URLs are supported. With more time I would let users upload images directly from their device.

## AI Usage

Claude (Anthropic) was used to scaffold this project including:
- Prisma schema design
- All API routes with server-side validation
- React components (NoticeCard, NoticeForm, Layout)
- Page files (index, new, edit)
- Tailwind CSS styling

I reviewed every file, verified against assignment requirements (correct HTTP methods, Prisma-level orderBy, Pages Router not App Router, delete confirmation), and made changes where needed.