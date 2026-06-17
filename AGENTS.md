# Repository Guidelines

## Overview

PinNepal is a Nepal travel discovery platform. It surfaces hiking routes, adventures, popular destinations, and travel packages — including multi-day tours and motorbike tours. The codebase consists of a Next.js 16 storefront paired with Payload CMS 3 as the content backend and admin interface.

---

## Tech Stack

| Layer       | Technology                                    |
| ----------- | --------------------------------------------- |
| Frontend    | Next.js 16 (App Router)                       |
| CMS / Admin | Payload CMS 3                                 |
| Database    | NeonDB (PostgreSQL)                           |
| Storage     | Bunny.net via `@seshuk/payload-storage-bunny` |
| Video       | Bunny.net Stream                              |
| UI          | shadcn/ui                                     |

---

## Project Structure

```
src/
  app/
    (frontend)/   # Public-facing Next.js pages
    (payload)/    # Payload admin panel and API routes
  collections/   # Payload collection definitions (PascalCase)
```

Use `(frontend)` for all storefront routes and `(payload)` for Payload-managed routes. Keep collection files scoped to `src/collections/`.

---

## Coding Conventions

- **Language:** TypeScript only — no plain JS files.
- **Components:** React function components, PascalCase (`TripCard`, `HeroSection`).
- **Hooks / Utilities:** camelCase (`useTripData`, `formatDate`).
- **Formatting:** Prettier — single quotes, no semicolons, trailing commas, 100-char width.
- **Indentation:** 2 spaces, UTF-8, LF line endings, final newline (enforced by `.editorconfig`).
- **Linting:** ESLint with Next.js and TypeScript rules. Prefix intentionally unused variables with `_`.

---

## Media & Storage

When a file is uploaded in Payload (e.g., a trip cover image), the `@seshuk/payload-storage-bunny` adapter intercepts it, pushes the file to Bunny.net, and saves the returned CDN URL to NeonDB. **Do not write local file-handling logic** — all media flows through this adapter.

For video content, use Bunny.net Stream. Store only the stream URL or embed ID in the database.

---

## Payload CMS

This project uses a dedicated Payload skill. Before creating or modifying collections, hooks, or access control:

1. Read `.agents/skills/payload/SKILL.md` for quick reference.
2. Consult `.agents/skills/payload/reference/` for detailed Payload 3 documentation.

New collections go in `src/collections/` and must be registered in the Payload config.

---

## UI Components

Use **shadcn/ui** for all interface components. Run the shadcn CLI to add new components rather than writing them from scratch:

```bash
npx shadcn@latest add <component>
```

Do not override shadcn component internals unless strictly necessary.

---

## Environment Variables

Never commit secrets. All Bunny.net credentials, NeonDB connection strings, and Payload secret keys must be defined in `.env.local` (excluded from version control). Refer to `.env.example` for required keys.
