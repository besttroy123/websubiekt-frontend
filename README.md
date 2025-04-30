This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## PostgreSQL Integration

This application uses PostgreSQL for database operations. Follow these steps to set up:

1. Make sure PostgreSQL is installed on your system
2. Create a database named `websubiekt` (or use your preferred name)
3. Configure your database connection in the `.env.local` file

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=websubiekt
PGPORT=5432
```

Adjust these values according to your PostgreSQL setup.

### Database Schema

The application expects a table named `stan_magazynowy` in your PostgreSQL database. You can create it with:

```sql
CREATE TABLE stan_magazynowy (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit VARCHAR(50),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO stan_magazynowy (product_name, quantity, unit) VALUES
('Product A', 100, 'pcs'),
('Product B', 50, 'kg'),
('Product C', 75, 'pcs');
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
