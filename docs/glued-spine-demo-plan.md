# Glued spine demo

The glued-spine documentation is catalog-driven and uses the same live-book
architecture as the staple demo.

## Routes

- `/play/glued-spine/` is the full-screen playground.
- `/binding/glued-book-binding/` documents `GluedBookBinding` and
  `GluedSetup`.
- `/binding/paper-setup/` documents shared `stiffness` and the optional
  `rigid` override.

The old glued-spine playground name and route were removed rather than kept as
a second book variant.

## Playground contract

The playground creates one `Book` and one `GluedBookBinding`. Its cover
controls are:

- cover softness, mapped to `coverPaperSetup.stiffness`
- optional rigid-cover override
- cover thickness
- hinge gap and page glue-flex width
- spine colour and spine title texture

Front, inner-front, inner-back, and back artwork still come from the normal
four cover content slots. The binding combines those surfaces and the spine
into one live cover mesh.
