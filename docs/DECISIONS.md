# Architectural Decisions and Rationale

This document captures the architectural decisions, trade-offs, and security guardrails established during the design and implementation of this portfolio.

---

## 1. Context and Problem Statement

The objective is to create a personal portfolio site that showcases technical backend capabilities (specifically targeting a Backend Intern/Junior role by March 2027 with Java 21, Spring Boot 3.5, PostgreSQL, Redis, RabbitMQ, Docker).
A core requirement is the ability to upload and store images easily without paying infrastructure costs.

### The Storage Paradox on Free Platforms

Free deployment platforms (Vercel, Netlify, Cloudflare Pages) run serverless workloads with **ephemeral filesystems**.
- Any file written to local disk (e.g. `/tmp` or public directories) is destroyed when the serverless function cold-starts or redeploys.
- Directly hotlinking Google Drive links (`drive.google.com/uc?export=view&id=...`) is brittle: Google serves HTML interstitials, lacks CORS headers, and imposes aggressive rate limits (HTTP 429) that will cause images to fail during recruiter review.
- Supabase Storage free tier pauses projects after 7 days of inactivity, introducing risk of site failure.
- Cloudflare R2 offers generous free storage (10GB) and zero egress fees, but requires custom backend APIs or signed presigned URLs.

---

## 2. Chosen Architecture: Google Drive as CMS, CDN as Origin

Instead of runtime uploads through a custom server, the site uses a **build-time / on-demand sync pattern**:

```
[ Developer ]
      │
      ▼ (Drop screenshots / photos)
[ Google Drive Folder ]
      │
      ▼ `npm run sync` (scripts/sync-drive.mjs)
  - Google Drive API v3 (Service Account JWT)
  - Magic bytes validation (JPEG, PNG, WebP, AVIF)
  - Automatic EXIF stripping (GPS & metadata removal)
  - Sharp pipeline -> Dual AVIF + WebP encoding
  - Content-hashed filenames (cache-busting)
  - Manifest generation (src/generated/image-manifest.json)
      │
      ▼
[ public/images/ + Manifest ]
      │
      ▼ `git push` or Vercel Build Hook
[ Vercel CDN Global Edge Cache ]
```

### Why this is the optimal trade-off:
1. **Zero cost forever:** 0 VND hosting on Vercel Hobby + free Google Drive storage + static CDN delivery.
2. **Rock-solid reliability:** Recruiter visits serve static images directly from edge cache. No reliance on third-party uptime or API rate limits at view time.
3. **Familiar upload UX:** Uploading images is as simple as dragging files into a Google Drive folder on your phone or desktop.
4. **Bandwidth optimization:** Sharp converts source images to modern AVIF (52 quality) and WebP (78 quality), cutting file sizes by 60-75% with zero visible degradation.
5. **No CLS (Cumulative Layout Shift):** Intrinsic pixel dimensions are recorded in the JSON manifest at sync time, so browser layouts reserve exact dimensions before bytes download.

---

## 3. Image Security Checklist (Backend Invariant Enforcement)

Even though images originate from your own Drive, the sync script enforces production-grade security invariants that tech leads look for during code review:

1. **Magic bytes verification:** The script reads the first 12 bytes of every file buffer. File extensions and MIME headers from Google Drive are treated as untrusted metadata.
2. **SVG restriction (`ALLOW_SVG=false`):** SVG is XML and can execute arbitrary `<script>` tags, making it a stored-XSS vector. It is rejected by default.
3. **EXIF metadata stripping:** Phone photos embed GPS coordinates, device models, and timestamps. `sharp.rotate().withMetadata({})` drops all private tags while preserving orientation.
4. **Deterministic slug hashing:** Local filenames are constructed via `slug(name) + shortHash(folder + name + fileId)`. This prevents path traversal (`../`), special-character URL breakage, and collision overwrites.
5. **Two-way sync / orphan pruning:** If an image is removed from Drive, the sync script automatically deletes the corresponding static files from `public/images/` and updates the manifest.

---

## 4. Design Read and Aesthetic Dials

In accordance with frontend engineering standards, the UI adheres to the following specification:

- **Design Read:** "A developer portfolio for technical recruiters and engineering managers screening a Java-Spring backend intern candidate, with a restrained dark-tech-editorial language, leaning toward Tailwind v4 + zinc neutrals with a single burnt-orange accent, Motion for scroll reveal."
- **Core Dials:**
  - `DESIGN_VARIANCE: 7` (Asymmetric 12-column bento grid, offset hero elements, responsive single-column mobile collapse)
  - `MOTION_INTENSITY: 6` (Fluid spring physics, scroll-triggered reveals via `whileInView`, progress bar via `useScroll`, full graceful degradation under `prefers-reduced-motion`)
  - `VISUAL_DENSITY: 4` (Generous section breathing room `py-24 md:py-32`, max width container `1400px`, line length capped at 65 characters)
- **Palette Lock:**
  - Background: Off-white `#fafafa` (light) / Off-black `#09090b` (dark). Pure `#000000` and `#ffffff` are banned.
  - Accent: Burnt Orange `#c2410c` (light) / `#fb923c` (dark).
  - Contrast AA/AAA verified: `#c2410c` on `#fafafa` = 5.3:1 (AA), `#fb923c` on `#09090b` = 8.3:1 (AAA).
- **Prohibited Patterns Enforced:**
  - Zero em-dashes (`—`) or en-dashes (`–`) anywhere in visible copy. Regular hyphens (`-`) are used exclusively.
  - Zero generic AI purple/blue glows.
  - Zero fake-precise metrics or startup-slop buzzwords ("seamless", "elevate", "next-gen").
  - Zero fake version footers or decorative locale strips.
  - Exactly one eyebrow utilized across the entire page (rationed budget).
  - One CTA label per intent ("Get in touch" used consistently across nav, hero, and contact).

---

## 5. Domain and Deployment Resolution

During initial exploration, the user selected both "Next.js + Vercel" and "Pages subdomain free".
- Cloudflare Pages provides `*.pages.dev`.
- Vercel provides `*.vercel.app`.

**Resolution:** Because the project is scaffolded as a native Next.js 16 App Router application with Turbopack and server components, **Vercel** (`*.vercel.app`) is the primary deployment target to ensure 100% zero-configuration compatibility. Custom domains (e.g. yourname.dev) can be mapped anytime on Vercel for free.
