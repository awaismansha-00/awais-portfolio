# Portfolio Website

A DevOps engineer portfolio built with Vite, React, Tailwind CSS, and Motion, with a hand-rolled client-side router for `/`, `/projects`, and `/blogs`.

## Files

- `src/App.jsx` - React portfolio UI, routing, sections, and interactions
- `src/index.css` - Tailwind entry point and global CSS
- `vite.config.js` - Vite config with React and Tailwind plugins
- `playwright.config.js` - Playwright config; builds and serves the app automatically before tests
- `public/assets/devops-hero.png` - Open Graph / social preview image
- `public/assets/awais-hero-portrait.webp` - hero portrait
- `public/assets/profile.webp` - profile picture used in the header
- `public/assets/favicon.svg` - browser icon
- `vercel.json` - SPA rewrites, cache rules, and security headers for Vercel
- `public/_headers` - the same security headers for Netlify/Cloudflare-style hosts
- `public/_redirects` - SPA fallback so `/projects` and `/blogs` work as direct URLs on supported static hosts

## Customize

Update these first:

- Your email, GitHub, and LinkedIn are stored in the `profile` object near the top of `src/App.jsx`.
- Add, edit, remove, or reorder projects in `src/content/projects.json`.
- Add, edit, remove, or reorder blog posts in `src/content/blogs.json`.
- Add, edit, remove, or reorder certifications in `src/content/certifications.json`.
- Update the skills list in `src/App.jsx` if you want to add or reorder tools. Skill icons use `react-icons`.
- The CV served by the hero "Download CV" button lives at `public/assets/cv/` and is set by `CV_URL` in `src/App.jsx`.
- The profile picture is currently loaded from `public/assets/profile.webp`.
- Site URL is hardcoded in `index.html` (canonical + Open Graph), `public/sitemap.xml`, and `public/robots.txt`. Update all three if the domain changes.

## Edit Projects and Blogs

Projects render in the same order as `src/content/projects.json`. Use this shape:

```json
{
  "title": "AWS 3-Tier Architecture with Terraform",
  "summary": "Short website description here.",
  "github": "https://github.com/awaismansha-00/aws_terraform_3tier",
  "image": "/assets/projects/aws-terraform3tier.webp",
  "tags": ["AWS", "Terraform", "VPC", "ALB", "RDS"]
}
```

The `image` field is optional. Add project images to `public/assets/projects/`.

Blogs render in the same order as `src/content/blogs.json`. Use this shape:

```json
{
  "title": "Blog title",
  "summary": "Short website version here.",
  "href": "https://medium.com/...",
  "image": "/assets/blog/example.webp"
}
```

The `image` field is optional. Add blog images to `public/assets/blog/`.

Certifications render from `src/content/certifications.json`. Completed certifications can link to Credly and use badge images:

```json
{
  "status": "Certified",
  "items": [
    {
      "title": "AWS Certified Solutions Architect - Associate",
      "href": "https://www.credly.com/badges/...",
      "image": "/assets/certifications/aws-certified-solutions-architect-associate.png"
    }
  ]
}
```

The `href` and `image` fields are optional. Add certification badge images to `public/assets/certifications/`.

## Develop

```bash
npm install
npm run dev
```

## Deploy

Build and upload the `dist/` folder to GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, or any static web host.

```bash
npm run build
```

Because routing is client-side, the host must serve `index.html` for `/projects` and `/blogs`. That is already configured in `vercel.json` (rewrites) and `public/_redirects` (Netlify/Cloudflare).

## Verify

Playwright builds the site and starts a preview server itself, so no server needs to be running first.

```bash
npx playwright install chromium   # first run only
npm run test:visual
```

Run a single project or file with the usual Playwright flags:

```bash
npm run test:visual -- --project=desktop-chromium
npm run test:visual -- tests/nav-rescroll.spec.js
```
