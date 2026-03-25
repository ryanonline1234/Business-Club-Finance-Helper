# Treasury Club Dashboard

A simple, secure way to track club finances, manage budgets, and monitor spending on activities, prizes, and snacks.

## Setup

### 1. Create Supabase Database

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Create a new project
3. Copy your project URL and anon key
4. In the SQL Editor, run the schema from `../supabase-schema.sql`

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# NextAuth Secret
NEXTAUTH_SECRET=change-this-to-a-random-secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional - for easier login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Features

- **Budget Tracking** - Track club budgets by category
- **Activity Log** - View all transactions with filtering
- **Member Management** - Role-based access control
- **Receipt Uploads** - Link receipts to transactions
- **Categories** - Budget, Activities, Prizes, Snacks

## Project Structure

```
treasury-club-dashboard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── transactions/route.ts
│   │   │   └── categories/route.ts
│   │   ├── dashboard/page.tsx
│   │   ├── transactions/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── AuthButton.tsx
│   │   └── dashboard/
│   │       ├── TransactionForm.tsx
│   │       ├── TransactionList.tsx
│   │       ├── StatCard.tsx
│   │       └── CategoryBadge.tsx
│   └── lib/
│       ├── supabase.ts
│       └── utils.ts
└── .env.local
```

## Deploy on Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add environment variables in Vercel dashboard
4. Deploy!
