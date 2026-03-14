# MistakeCount

A community platform where developers share their real-world coding struggles, architectural blunders, and technical mistakes—anonymously and honestly—so others can learn and grow faster.

## 🚀 Vision

"Your next mistake might be someone else's breakthrough."

MistakeCount aims to strip away the "perfect dev" facade often seen on social media. By sharing mistakes instead of just successes, we build a more resilient and knowledgeable developer community.

## 🏗️ Architecture

This is a **monorepo** powered by [Turborepo](https://turbo.build/), designed for scalability and code sharing.

- **`apps/web`**: A modern Next.js frontend featuring rich GSAP animations, a responsive design system, and a seamless user experience.
- **`apps/api`**: A high-performance Express.js backend providing secure authentication and a robust API for mistake management and voting.
- **`packages/database`**: A centralized Prisma schema and client used for unified data access across the platform.
- **`packages/ui`**: A shared component library for design consistency (in progress).

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, GSAP (Animations), Tailwind CSS, Lenis (Smooth Scroll), DiceBear (Anonymous Avatars).
- **Backend**: Node.js, Express.js, JWT (Authentication), Helmet (Security).
- **Database**: PostgreSQL with Prisma ORM.
- **Tooling**: Turborepo, pnpm workspaces, TypeScript.

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)

### Setup

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd MistakeCount
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Variables**
   - Copy `.env.example` to `.env` in the root directory.
   - Update `DATABASE_URL` with your local PostgreSQL credentials.
   - Set a `JWT_SECRET` for authentication.

4. **Initialize Database**
   ```bash
   cd packages/database
   pnpx prisma db push
   # Optional: pnpx prisma db seed (to popluate initial tags)
   ```

5. **Run Development Mode**
   ```bash
   # From root
   pnpm dev
   ```
   The web app will run on [http://localhost:3000](http://localhost:3000) and the API on [http://localhost:5000](http://localhost:5000).

## 🛡️ Key Features

- **Anonymous Identity**: Every signup generates a fresh avatar and username to encourage honest sharing.
- **Interactive Feed**: Vote on mistakes and filter by categories like React, DevOps, or ML.
- **Decomposed UI**: Highly modular frontend components for better performance and maintainability.
- **Secure by Default**: JWT-based session management and protected routes.

---
Built with ❤️ for the developer community.
