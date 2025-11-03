Project: The Persistent Clicker App

This is a quick, working demo I built to finally wrap my head around the whole modern full-stack setup: Next.js, Vercel, and a database (Supabase) that actually keeps data safe.

The app is simple: users sign up, they click a button, and the click count persists even if they log out or switch devices.

🎯 Architecture & Technologies (My Stack)

Layer

Technology

Key Component / File

What I Learned

Frontend

Next.js (App Router) & Tailwind CSS

app/page.tsx, app/clicker/page.tsx

How to manage UI state and use Next.js routing.

Backend/Auth

Supabase (Postgres & Auth)

user_clicks table, RLS Policies

Setting up a real user database and securing it with basic RLS.

Data Layer

Supabase Client

src/lib/supabase.ts

The bridge—makes sure my Vercel secrets can talk to the Supabase database.

Deployment

Vercel & GitHub

Vercel Dashboard, .env.local

How to connect a Git repo to instant, auto-deployment.

🔒 Key Security & Persistence Features

Super Simple Login: I used Supabase's built-in Auth, so it handled all the user registration and session management.

Data Stays Put: The counter saves directly to the user_clicks table every time the button is pressed.

Security is Clutch (RLS): I implemented Row Level Security (RLS)! This is a core concept—it ensures that when User A clicks, they can only read or update their own counter row. User B can't mess with User A's clicks.

The Magic Save: The app uses Supabase's awesome .upsert() feature. This means I don't have to write separate code to check if a user is new or existing—it just knows whether to create their row or update their click count. Super clean.

⚙️ Setup Notes

Repo: Cloned from GitHub.

Database: Spun up a Supabase instance and created the user_clicks table (with user_id and click_count).

RLS Policies: Custom SQL policies defined to enforce the auth.uid() = user_id rule.

Hosting: Deployed instantly via Vercel.

Connection: Used Vercel's Environment Variables (NEXT_PUBLIC_SUPABASE_URL, etc.) to securely link the live app to the database.

Any changes pushed to GitHub automatically deploy live on Vercel. Done!
