# FCOS / immutable-OS: a worked knowledge graph

This is the example implementation for the interactive-knowledge-graph toolkit.
It models the decision space of running an immutable, atomically-rollback-able OS
(Fedora CoreOS and its relatives) on industrial single-board hardware.

Contents:

- `data.js` — the dataset (38 nodes, 99 edges): the labelled property graph built
  and audited by following [`../../METHOD.md`](../../METHOD.md).
- `mindmap.html` / `mindmap.mm.md` — a collapsible markmap (tree) view of the same
  concepts.
- `diagrams/` — static Mermaid diagrams (concept mindmap, decision flowchart,
  boot-chain, bootc layers) and a short reading guide.

## View

- Interactive graph: open [`../../src/graph.html`](../../src/graph.html); it
  defaults to this dataset.
- Markmap: open `mindmap.html`.
- Static diagrams: `../../tools/render-mermaid.sh examples/fcos/diagrams`, or paste
  a `.mmd` into <https://mermaid.live>.

## Domain context

The subject-matter background — why the Pi 5 / CM5 is currently blocked, the
hardware tiers, the boot chain, U-Boot versus EDK2 — lives in the CalTon EMS
provisioning repository (`ems-fcos-provisioning`), where this knowledge
originated. That repository keeps the provisioning procedures; this example keeps
the graph.

## Modelling decisions worth noting (see METHOD.md)

- **States are edges, not nodes.** "Blocked" and "No UEFI path" were removed; the
  block is carried by the edge `BCM2712 → no mainline → U-Boot`.
- **Tier is a facet, not three nodes.** Effort tier 1/2/3 is a colour-by lens on
  the hardware and firmware nodes.
- **The pairwise-audit edges.** The 25 edges under the "pairwise audit" comment in
  `data.js` were found by an exhaustive pair-by-pair sweep, not by intuition. That
  sweep recovered the `GRUB → UEFI` edge, which an earlier intuition pass had
  missed.
