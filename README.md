# Awais Portfolio Website

A modern DevOps engineer portfolio built with Vite, React, Tailwind CSS, Three.js, and a generated cloud infrastructure hero asset.

## Files

- `src/App.jsx` - React portfolio UI, Three.js scene, sections, content, and interactions
- `src/index.css` - Tailwind entry point and global CSS
- `vite.config.js` - Vite config with React and Tailwind plugins
- `public/assets/devops-hero.png` - generated hero image for production builds
- `public/assets/profile.png` - profile picture used in the header and hero
- `public/assets/favicon.svg` - browser icon
- `public/_headers` - security headers for hosts that support Netlify/Cloudflare-style headers
- `.tools/node/` - project-local Node.js runtime, useful when Node is not installed system-wide

## Customize

Update these first:

- Your email, GitHub, and LinkedIn are stored in the `profile` object near the top of `src/App.jsx`.
- Add, edit, remove, or reorder projects in `src/content/projects.json`.
- Add, edit, remove, or reorder blog posts in `src/content/blogs.json`.
- Add, edit, remove, or reorder certifications in `src/content/certifications.json`.
- Update the skills list in `src/App.jsx` if you want to add or reorder tools.
- Add your resume PDF to `public/assets/` and link it from the hero or contact section if you want a download button.
- The profile picture is currently loaded from `public/assets/profile.png`.

## Edit Projects and Blogs

Projects render in the same order as `src/content/projects.json`. Use this shape:

```json
{
  "title": "AWS 3-Tier Architecture with Terraform",
  "summary": "Short website description here.",
  "github": "https://github.com/awaismansha-00/aws_terraform_3tier",
  "image": "/assets/projects/3-Tier AWS Architecture.png",
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
  "image": "/assets/blog/example.png"
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

If Node is not available globally, use the local runtime:

```powershell
$env:Path = "$(Get-Location)\.tools\node;$env:Path"
.\.tools\node\npm.cmd install
.\.tools\node\npm.cmd run dev
```

If Node is available globally:

```powershell
npm install
npm run dev
```

## Deploy

Build and upload the `dist/` folder to GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, or any static web host.

```powershell
$env:Path = "$(Get-Location)\.tools\node;$env:Path"
.\.tools\node\npm.cmd run build
```

## Verify

```powershell
$env:Path = "$(Get-Location)\.tools\node;$env:Path"
.\.tools\node\npm.cmd run build
.\.tools\node\npm.cmd run test:visual
```
