# Developer Portfolio (Next.js 16 + Google Drive CMS)

A high-performance personal portfolio built for a backend engineering student (Java 21, Spring Boot 3.5, PostgreSQL, Redis, Docker).
Uses Google Drive as a free, headless asset CMS, automatically synchronising, verifying, and encoding images into modern AVIF/WebP assets served via edge CDN.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19, Server Components)
- **Styling:** Tailwind CSS v4 (Design tokens via CSS variables, dark mode attribute toggle)
- **Motion:** Motion (`motion/react`) with spring physics and full reduced-motion accessibility
- **Icons:** Phosphor Icons (`@phosphor-icons/react`)
- **Asset Pipeline:** Sharp + Google Drive API v3 (`scripts/sync-drive.mjs`)
- **Type Safety:** TypeScript strict mode + Zod-free zero-overhead typed JSON manifest

---

## Project Structure

```text
Portfolio/
├── docs/
│   ├── DECISIONS.md          # Architectural decisions & security checklist
│   ├── SETUP.md              # Step-by-step Google Drive & Vercel deployment guide
│   └── AI-TRANSCRIPT.md      # Auto-exported record of development prompts & choices
├── public/
│   └── images/               # Auto-populated with optimised AVIF and WebP files
├── scripts/
│   ├── sync-drive.mjs        # Main Drive pull, magic-bytes check & sharp encode pipeline
│   └── ensure-manifest.mjs   # Prebuild guard ensuring empty manifest exists on fresh clone
├── src/
│   ├── app/                  # Next.js App Router (layout, page, sitemap, robots, not-found)
│   ├── components/           # UI components (Hero, Projects, About, Skills, Gallery, Nav, etc.)
│   ├── content/
│   │   └── portfolio.ts      # SINGLE EDIT SURFACE: your name, bio, projects, links, skills
│   ├── generated/
│   │   └── image-manifest.json # Generated list of images with intrinsic width/height & sizes
│   └── lib/                  # Utilities (manifest reader, z-index constants, cx joiner)
├── .env.example              # Environment variable template
└── services-account.json     # Google Cloud Service Account key (git-ignored)
```

---

## Quickstart

### 1. Install Dependencies
```powershell
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```
Fill in `DRIVE_FOLDER_ID` and ensure `services-account.json` exists in project root.

### 3. Sync Images from Drive
```powershell
npm run sync
```

### 4. Start Development Server
```powershell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 5. Production Build
```powershell
npm run build
```

---

## Editing Content

You do **not** need to modify any TSX component to update your text.
Open **`src/content/portfolio.ts`** and edit:
- Your name, role, email, and social links
- Hero headline and value proposition
- Technical skills and roadmap timeline
- Project descriptions and highlights

Search for `EDIT:` inside `src/content/portfolio.ts` to find all placeholders.
Detailed deployment instructions can be found in `docs/SETUP.md`.
