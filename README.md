# Awais Portfolio

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
- Swap the project case studies in `src/App.jsx` with your real project names, outcomes, tools, and metrics.
- Update the skills list in `src/App.jsx` if you want to add or reorder tools.
- Update `profile.medium` and the `blogPosts` list in `src/App.jsx` when your Medium profile or article URLs are ready.
- Add your resume PDF to `public/assets/` and link it from the hero or contact section if you want a download button.
- The profile picture is currently loaded from `public/assets/profile.png`.

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
