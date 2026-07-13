# interactive-knowledge-graph

A small, dependency-light toolkit for building and exploring **interactive
knowledge graphs** of a subject: its concepts, artefacts and claims, and the
relationships among them.

Two parts:

- **A method** (`METHOD.md`) for discovering the categories, facets, layers,
  nodes and edges, so connections are not missed.
- **A renderer** (`src/graph.html`) that draws any dataset as an interactive
  Cytoscape.js graph: hover notes, a details side-panel, colour-by-facet,
  show-layer, directional focus (in/out edges), search, force-tuning and PNG
  export.

The FCOS / immutable-OS graph under `examples/fcos/` is a worked implementation.

## Layout

```
METHOD.md                 the discovery method — start here
src/graph.html            generic interactive renderer (data-driven)
tools/render-mermaid.sh   render *.mmd diagrams to PNG/SVG (podman or mmdc)
examples/fcos/            a worked implementation
  data.js                 the dataset (assigns window.KG = {...})
  README.md               what the FCOS graph models
  mindmap.html            an alternative collapsible markmap view
  mindmap.mm.md           markmap source
  diagrams/*.mmd          static Mermaid diagrams + a reading guide
```

## View it

Open `src/graph.html` in a browser. It loads the FCOS example by default (needs
internet for the Cytoscape CDN). To view a different dataset:

```
src/graph.html?data=<path-to-your-data.js>
```

## Build your own graph

1. Follow `METHOD.md`, Steps 0 to 7.
2. Copy `examples/fcos/data.js` to `examples/<topic>/data.js` and replace the
   contents.
3. Open `src/graph.html?data=examples/<topic>/data.js`.

## Data model

A dataset assigns `window.KG`:

- `title` — heading shown in the control panel.
- `groups` — `{ Category: '#colour' }`, the primary-category palette.
- `facets` — `{ facet: { name, values: { value: '#colour' } } }`, the extra
  colour-by perspectives.
- `layers` — `{ layerId: { name, color } }`, the highlightable subgraphs.
- `nodes` — `[{ id, label, group, short, desc, facets: {...}, layers: [...] }]`.
- `edges` — `[{ source, target, label }]`, directed.

## Provenance

This began as diagrams inside the CalTon EMS provisioning repository, and was
extracted here so the tool and the method are reusable across topics. See
`examples/fcos/README.md`.
