# Personal Portfolio (GitHub Pages)

This is a minimal, fast, and clean portfolio site you can host on GitHub Pages.

## Quick start

1. Replace placeholders in `index.html`:
   - "Your Name"
   - Summary paragraph
   - Email, LinkedIn, and CV links
2. Add your photo at `assets/profile.jpg` (JPEG or PNG; 512×512+ recommended).
3. Add your CV at `assets/cv.pdf`.
4. (Optional) Update the GitHub username by changing the `data-github-username` value on the `<body>` tag.

The site will automatically list your public GitHub repositories (excluding forks and archived repos) and sort them by recent activity. If a repo has a `homepage` set, a Demo button will appear.

## Local preview

Open `index.html` in your browser. No build step or dependencies required.

## Publish to GitHub Pages

Commit and push these files to your `USERNAME.github.io` repository's default branch (usually `main`). Pages will deploy automatically.

### Example commands

```bash
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/USERNAME/USERNAME.github.io.git
git push -u origin main
```

Replace `USERNAME` with your GitHub handle.

## Theming

- Light/dark theme toggles and persists via `localStorage`.
- Update colors in `styles.css` by editing CSS variables under `:root`, `.theme-light`, and `.theme-dark`.


