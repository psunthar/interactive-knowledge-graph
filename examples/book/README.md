# Example: a book as a knowledge graph

A **non-exhaustive** starter graph built from the table of contents of a
Computational Flow Modelling course (17 chapters, 4 parts). It shows how the book
pattern in [`../../METHOD.md`](../../METHOD.md) (appendix) maps onto the data model.

- **Categories**: Part, Chapter, Concept, Tool, Canonical.
- **Facets** (colour-by): `part` (I–IV), `level` (foundation → capstone).
- **Layers** (highlightable subgraphs): one per Part (scope), plus three narrative
  threads that span parts — the V&V thread, the canonical packed-bed thread, and the
  scaling / dimensionless thread.
- **Edges**: `contains`, `prerequisite for`, `introduces`, `needs`, `recurs in`.

## View

```
../../src/graph.html?data=examples/book/data.js
```

Try **Colour by → Part** to see the four parts, and **Show layer → Canonical
packed-bed thread** to see the problem posed in Chapter 2 and solved in Chapter 17,
pulling in the chapters and concepts it needs.

## What it deliberately leaves out

It models only the *recurring* concepts (the ones worth tracking across chapters),
not every topic; chapter-specific one-offs stay as their chapter node. A full build
would add one scope layer per chapter and the remaining concepts, following the
seven steps in `METHOD.md`.
