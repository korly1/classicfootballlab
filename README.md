This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Prerequisites

- **Node.js >= 20.9.0** (required by Next.js 16). Check with `node -v`.
- If you use **nvm**, the repo includes [`.nvmrc`](.nvmrc) with `20`. Run `nvm install` and `nvm use` in this directory before `npm install`.
- **fnm** / **asdf** users can rely on [`.node-version`](.node-version) the same way.

### Without nvm

If `nvm` is not installed (or you see `command not found: nvm`), use one of these:

- **Homebrew:** `brew install node`, then confirm `node -v` is >= 20.9.0. If an older Node (e.g. `node@18`) still wins on your `PATH`, run `which node` and adjust PATH, or `brew unlink node@18` / `brew link node --overwrite` as [Homebrew](https://brew.sh) suggests for your formulas.
- **Official installer:** Download the **LTS** build from [nodejs.org](https://nodejs.org), install, restart Terminal, then `node -v`.

[`.npmrc`](.npmrc) sets `engine-strict=true`, so **`npm install` will fail on Node 18** until you upgrade—upgrade Node first, then `npm install`.

- If `npm run dev` or `npm run build` says your Node version is too old, upgrade Node first. After switching Node versions, if you see native module errors (e.g. Tailwind), run `rm -rf node_modules && npm install` once.

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

## GitHub Pages (static marketing site)

If the repo uses **GitHub Pages** from the **`main`** branch and **root** (`/`), the published site is the full static landing in [index.html](index.html) (for example at `https://<user>.github.io/<repo>/` or a custom domain such as **lab.football**). That single-file page is the canonical public site until the Next.js app is deployed (e.g. Vercel) and DNS is pointed at it.

The Next.js marketing routes under `src/app/(public)/` are the in-repo source to evolve toward; they are not what GitHub Pages serves unless you add a static export or CI workflow later.

After pushing, confirm in the repo **Settings → Pages** which branch/folder is published, then open the site URL in a private window to verify it loads.
