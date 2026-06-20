# three-book-demo

Next.js (App Router, Turbopack) documentation site + live demo for
[`@objectifthunes/three-book`](https://www.npmjs.com/package/@objectifthunes/three-book) — a realistic 3D
page-turning book for Three.js.

Live at https://objectifthunes.github.io/three-book-demo/.

Every export is documented with source-paired examples, and the library's full interactive studio runs in the
browser at `/full/editor/` (plus a minimal book at `/full/minimal/`).

## Local dev

`@objectifthunes/three-book` is a **private** npm package, so you need read access. Authenticate once:

```bash
echo "//registry.npmjs.org/:_authToken=YOUR_NPM_TOKEN" >> ~/.npmrc
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Build / static export

```bash
pnpm build
```

`next build` runs with `output: 'export'` and emits a static site to `out/`. CI deploys that folder to GitHub
Pages.

## CI / deployment

`.github/workflows/pages.yml` builds and deploys to GitHub Pages on every push to `main`. Because the package
is private, the workflow writes an npm auth line to `~/.npmrc` from the **`NPM_TOKEN`** repository secret before
installing. Set that secret to an npm automation token with read access to `@objectifthunes/*`.

## Updating the three-book version

Bump `@objectifthunes/three-book` in `package.json` and `pnpm install`. Every release of the library should be
exercised here.

## Layout

- `src/components/exports.ts` — the page registry that drives the sidebar and landing grid.
- `src/app/(docs)/**` — one documentation page per export group.
- `src/app/full/**` + `src/demo/three-book/**` — the client-only live demos (the library's own Vite demo,
  ported to mount/unmount cleanly inside a route).
