# Portfolio Website

A DevOps engineer portfolio built with Vite, React, Tailwind CSS, and Motion, with a hand-rolled client-side router for `/`, `/projects`, and `/blogs`.

## Files

- `src/App.jsx` - page composition and route transition state
- `src/components/` - portfolio sections, cards, header, and animation components
- `src/pages/ListingPage.jsx` - complete project and blog pages
- `src/hooks/` - navigation, carousel, loader, and visibility hooks
- `src/lib/` - featured-content selection, image loading, animation settings, and safe fragment navigation
- `src/content/` - editable profile, skills, process, projects, blogs, and certifications
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

- Your email, GitHub, and LinkedIn are stored in `src/content/profile.js`.
- Add, edit, remove, or reorder projects in `src/content/projects.json`.
- Add, edit, remove, or reorder blog posts in `src/content/blogs.json`.
- Add, edit, remove, or reorder certifications in `src/content/certifications.json`.
- Update the skills list in `src/content/skills.js` to add or reorder tools. Skill icons use `react-icons`.
- Update `src/content/process.js` to edit the process steps.
- The CV served by the hero "Download CV" button lives at `public/assets/cv/` and is set by `CV_URL` in `src/content/profile.js`.
- The profile picture is currently loaded from `public/assets/profile.webp`.
- Site URL is hardcoded in `index.html` (canonical + Open Graph), `public/sitemap.xml`, and `public/robots.txt`. Update all three if the domain changes.

## Edit Projects and Blogs

New entries appear on `/projects` or `/blogs` only by default. The homepage shows up to three entries per section with `"featured": true`. Existing homepage entries are explicitly marked, so adding unfeatured content anywhere in either JSON array will not change the homepage.

To add content only to its listing page, use `"featured": false` (or omit the field). To feature an entry later, change it to `true`; featured entries follow their order in the JSON array.

Add each object inside the existing `[...]` array, separated by commas. Do not leave a trailing comma after the last object. Save and visit `/projects` or `/blogs` on the dev server to see your changes. When using production preview, rebuild first.

Projects render in the same order as `src/content/projects.json`. Use this shape:

```json
{
  "title": "AWS 3-Tier Architecture with Terraform",
  "featured": false,
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
  "featured": false,
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

On Windows, if `npm` is not recognized and the bundled `.tools/node/` runtime is present, run these from the project folder:

```powershell
$env:Path = "$PWD\.tools\node;$env:Path"
.\.tools\node\npm.cmd run dev
```

Open the URL printed in the terminal. The same PATH setting lets the build and test commands use the bundled runtime in that terminal session.

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
