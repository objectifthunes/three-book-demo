# Hardcover binding — demo plan

Companion branch to `three-book#feat/hardcover-binding` (see
`three-book/docs/hardcover-binding-design.md` for the binding design itself).
Nothing here ships until the library publishes `HardcoverBookBinding`.

## Pages to add (catalog-driven, `src/components/exports.ts`)

- **`binding` group, slug `hardcover-book-binding`** — `HardcoverBookBinding`
  class page: `HardcoverSetup` prop table (`spineStyle`, `hingeGap`,
  `glueFlexWidth`, `spineColor`, `spineMaterial`), the tight-back model
  explained in one paragraph, code block.
- **Update `binding/binding`** (the Bindings overview) — from "StapleBookBinding
  out of the box" to a two-binding comparison: magazine (staple) vs hardcover
  (glued + rigid case), with a when-to-use line each.
- **Update `binding/paper-setup`** — document the new `rigid` flag.

## Live example

One `LiveStage` example: hardcover with visible board overhang (squares),
cloth-textured rounded spine, rigid board turn vs floppy page turn in the same
book — that contrast is the whole selling point, make it the hero shot.

## Checklist when the library lands

- [ ] bump `@objectifthunes/three-book` to the version exporting `HardcoverBookBinding`
- [ ] catalog entries + routes (`src/app/(docs)/binding/hardcover-book-binding/`)
- [ ] live example in `src/components/live/examples.tsx`
- [ ] README + `docs/images` screenshot (Playwright capture, as usual)
