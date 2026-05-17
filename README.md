# Nurzhan Portfolio

Full-stack portfolio built with Next.js, Prisma, Postgres, TailwindCSS, shadcn-style components, TanStack Query, and Vercel Blob uploads.

## Getting Started

For local development with the Next.js dev server, keep Postgres running in Docker and use `.env.local` for the host app:

```bash
docker compose up db
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

The dev server runs on [http://localhost:3000](http://localhost:3000). The default local database URL is:

```env
DATABASE_URL="postgresql://portfolio:portfolio_password@localhost:5433/nurzhan_portfolio"
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker

For local Docker testing or a VPS-style deployment, copy the Docker env template and edit secrets:

```bash
cp .env.docker.example .env
```

Start Postgres and the app:

```bash
docker compose up --build
```

The app runs on [http://localhost:3000](http://localhost:3000). On first boot, migrations run automatically. Set `SEED_DATABASE=true` for the first run if you want starter content.

For a VPS, run this stack behind a reverse proxy such as nginx. A starter config is available at `deploy/nginx.conf.example`.

Important production settings:

```env
ADMIN_PASSWORD=change-this-admin-password
AUTH_SECRET=replace-with-a-long-random-secret
BLOB_READ_WRITE_TOKEN=optional-vercel-blob-token
```

`BLOB_READ_WRITE_TOKEN` is only needed for direct image uploads; external image URLs still work without it.
When `BLOB_READ_WRITE_TOKEN` is empty, admin uploads are saved locally under `public/uploads`.
In Docker, that folder is backed by the `uploads-data` volume.
