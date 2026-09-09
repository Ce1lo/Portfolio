# Portfolio Setup and Deployment Guide

This guide walks you through connecting your Google Drive folder, running the image sync pipeline, and deploying your portfolio to Vercel for free.

---

## Part 1: Google Drive API & Service Account Setup

You already have a Google Service Account created:
- Email: `drive-sync@code-434415.iam.gserviceaccount.com`
- Key file placed at: `services-account.json`

If setting up from scratch on another machine, follow these steps:

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Select or create your project (e.g. `code-434415`).
3. Go to **APIs & Services > Library**, search for **Google Drive API**, and click **Enable**.
   *(If not enabled, requests fail with `403 accessNotConfigured`).*
4. Go to **IAM & Admin > Service Accounts**, click **Create Service Account**, name it `drive-sync`.
5. Click into the new service account > **Keys > Add Key > Create new key > JSON**.
6. Download the key file and save it in the project root as `services-account.json`.
   *(Note: This file is already ignored in `.gitignore`. Never commit it to GitHub).*

---

## Part 2: Folder Sharing & Folder ID

1. Open [Google Drive](https://drive.google.com/).
2. Create a new folder for your portfolio assets (e.g. `Portfolio Assets`).
3. Inside this folder, you can optionally create subfolders to map directly to sections:
   - `hero/` -> Portrait or workspace photo for the top hero section
   - `about/` -> Secondary photo for the about section
   - `projects/ticket-booking/` -> Screenshots of your booking system
   - `projects/order-analytics/` -> Stream pipeline benchmarks
   - `projects/product-sorter/` -> Modern Java code snippets
   - `gallery/` -> Any general screenshots, diagrams, and logs
4. **Critical Step:** Right click the main parent folder > **Share** > paste the service account email:
   ```text
   drive-sync@code-434415.iam.gserviceaccount.com
   ```
   Grant permission: **Viewer**. Click **Send**.
   *(If this is not done, requests return empty lists or `404 Not Found`).*
5. Open the folder in your browser and copy the folder ID from the URL bar:
   ```text
   https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^
                                          This is your DRIVE_FOLDER_ID
   ```

---

## Part 3: Local Configuration and Sync

1. Create your local `.env` file from the example template:
   ```powershell
   copy .env.example .env
   ```
2. Open `.env` and set your `DRIVE_FOLDER_ID`:
   ```bash
   DRIVE_FOLDER_ID=your_actual_folder_id_here
   GOOGLE_SERVICE_ACCOUNT_FILE=./services-account.json
   ```
3. Run the sync command:
   ```powershell
   npm run sync
   ```
4. You will see console output detailing files found, magic bytes detection, AVIF/WebP encoding, and manifest generation:
   ```text
   [sync] listing folder 1AbCdEf...
   [sync] 4 entries found, 4 declared as images
      + hero.jpg [1920x1080] -> avif 84.2 KB (saved ~812 KB)
   [sync] manifest: src/generated/image-manifest.json (4 images)
   ```
5. Start your local development server:
   ```powershell
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to review your portfolio with live synced images.

---

## Part 4: Deploying to Vercel (Free)

There are two deployment workflows available. **Workflow A** is recommended for ease of setup.

### Workflow A: Commit Synced Assets (Recommended)

Because the sync script produces static AVIF and WebP files inside `public/images/` and updates `src/generated/image-manifest.json`, you can simply commit the generated assets directly to git:

1. Sync locally:
   ```powershell
   npm run sync
   ```
2. Commit and push to GitHub:
   ```powershell
   git add public/images src/generated/image-manifest.json src/content/portfolio.ts
   git commit -m "feat: sync images and update portfolio content"
   git push origin main
   ```
3. Go to [Vercel Dashboard](https://vercel.com/new) > Import your repository.
4. Framework Preset: **Next.js** (auto-detected).
5. Click **Deploy**. No environment variables are required on Vercel with this workflow.

---

### Workflow B: Automated Sync During Vercel Build

If you prefer Vercel to fetch fresh assets from Drive automatically on every deployment:

1. Convert your `services-account.json` into a single-line string. In PowerShell:
   ```powershell
   (Get-Content .\services-account.json -Raw) -replace "`r`n","" -replace "`n","" | Set-Clipboard
   ```
2. In your Vercel Project Settings > **Environment Variables**, add:
   - `DRIVE_FOLDER_ID`: Your Google Drive folder ID
   - `GOOGLE_SERVICE_ACCOUNT_JSON`: Paste the single-line string from your clipboard
3. In Vercel Project Settings > **Build & Development Settings**:
   - Change **Build Command** to:
     ```bash
     npm run build:sync
     ```
4. Trigger a deployment. Vercel will run the sync script prior to building the static site.
