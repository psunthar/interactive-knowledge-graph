# Building a knowledge graph: a method for discovering categories, facets, layers, nodes and edges

## 1. Purpose

This note records a repeatable method for building a knowledge graph of a
subject: the concepts, artefacts and claims of a field, and the relationships
among them. It is written for green-field use on a new topic, such as the
chapters and ideas of a book.

A worked example is the FCOS / immutable-OS graph in this repository. Read its
data model in `examples/fcos/data.js` and view it with the generic renderer
`src/graph.html`. That graph was first built in an ad-hoc way and
later corrected against an exhaustive audit. Those corrections are the reason for
writing this method.

## 2. The target model, and the principles it rests on

We build a **labelled property graph** (LPG). This is a standard model, used by
graph databases and expressible as one data file. It has three parts.

- **Nodes** are the things that exist in the subject. Each node has one primary
  **category** and a set of **facets**.
- **Edges** are directed, typed relationships between nodes. The type is a verb.
- **Layers** are named subgraphs that cut across categories.

The category gives each node its default colour. Facets are further
classifications, used for recolouring and filtering. Layers are the sub-stories
you highlight. Keep the data in one file, separate from the renderer, so the same
graph can be drawn, queried or validated by different tools.

None of these terms is invented. Each step below rests on an established method:
competency questions from ontology engineering; faceted classification from
library science (Ranganathan); entity–relationship modelling (Chen); the
distinction between things that persist and processes that unfold, from
foundational ontologies; and the property-graph model itself. The value of naming
them is that each has a known discipline you can follow instead of improvising.

## 3. Step 0: Frame the graph with competency questions

Before listing a single node, write the **questions the graph must answer**.
These are the competency questions. They decide which nodes, facets and edges are
worth having. Anything that answers none of them is noise.

Examples for a book:

- What must a reader understand before Chapter 7?
- Which ideas recur across more than three chapters?
- Which claims are stated but never supported?
- What is the shortest path from the opening premise to the final conclusion?

Write six to twelve such questions. Return to them at the end (Step 6) to check
coverage.

## 4. Step 1: Discover the node categories

A **category** is the primary kind of a node. Every node has exactly one. The set
of categories is a small taxonomy of node types.

Discover them by listing candidate nodes from the material and grouping like with
like. In this project the categories were Requirement, Engine, OS, Architecture,
Firmware class, Concept, Boot component, Hardware, SoC and Storage.

Keep the count small, roughly eight to twelve. If a category holds a single node,
merge it into a neighbour. If a category is two kinds of thing, split it.

## 5. Step 2: Discover the facets

A **facet** is an independent axis of classification. A node carries a value on
each facet that applies to it. Facets come from faceted classification: rather
than force one hierarchy, we classify along several orthogonal dimensions at once.

The test for a facet is a question. Can two nodes share a category, yet differ on
this property, and differ on it independently of every other property? If yes, it
is a separate facet, not part of the category.

In this project the facets were tier, ecosystem, status, abstraction and stack
layer. Consider one node, U-Boot. It is a Concept by category. It is also
ecosystem "Arm-firmware", status "works today", abstraction "implementation", and
stack "bootloader". One field could not carry all of that. Five facets do.

For each facet, list its allowed values. These become a legend and a "colour by"
control.

## 6. Step 3: Discover the layers

A **layer** is a named subgraph: a subset of nodes, and the edges among them, that
tells one sub-story. Layers reveal a connection pattern that the category
colouring hides.

Three kinds of layer recur:

- **Process layers**: an ordered chain of steps. The boot sequence in this
  project is one.
- **Narrative layers**: a cluster of nodes that together explain one problem or
  decision. The Pi 5 blocker was one.
- **Scope layers**: everything belonging to one part of the work.

For a book, **each chapter is a scope layer**. Tag every node with the chapter or
chapters in which it appears. The graph then answers two things at once: the
concept map of a single chapter, by highlighting that layer; and which concepts
recur across chapters, shown by nodes that carry many chapter tags. A "colour by
chapter of first appearance" facet complements this.

Discover layers by asking which processes, arguments and running examples span
several nodes.

## 7. Step 4: Discover nodes, not states or relations

A node must be a thing that exists on its own in the subject: a concept, a
technology, a person, a source, a claim, a chapter. This rests on
entity–relationship modelling, and on the distinction between things that persist
and processes that unfold.

Two failure modes must be avoided. Both occurred in this project and were
corrected.

1. **A state is not a node.** The nodes "Blocked" and "No UEFI path" were removed.
   A state or an outcome is a property of a node, or the consequence of a missing
   edge, not an entity of its own. The test: can you point at it independent of
   the two things it relates? If not, it is an edge or a property.
2. **A process is a layer, not one node.** The boot sequence is the ordered set of
   its steps, plus the edges between them, tagged as a layer.

Source the nodes from the structure of the material: the index, the glossary, the
chapter and section headings, the named artefacts, and the terms defined at first
use.

## 8. Step 5: Discover the edges without missing connections

This is the step that fails silently, so it needs a defined procedure rather than
intuition. Use four passes, in order.

### 8.1 Bottom-up extraction, from the text

Read the material. Each time it asserts a relationship, record it as a candidate
edge. The relationship may be "X uses Y", "X is a Y", "X requires Y", "X causes
Y", or "X contradicts Y". The verb becomes the edge label. This pass captures the
relationships the author has already stated.

### 8.2 Top-down templates, from the schema

For each **pair of categories**, decide the relationship type that normally links
them. Hardware "has" a firmware class. An OS "uses" an engine. A claim "supports"
or "objects to" another claim. Then, for every node pair whose categories match a
template, check whether that edge is present. This pass captures the relationships
that follow from the structure.

### 8.3 The exhaustive pairwise sweep

For **every** unordered pair of nodes, ask three questions. Is there a direct
relationship? Is it present? Is it correct in direction and label? This is a
pairwise check, of order N². Perform it pair by pair, not from memory.

This pass is mandatory for one reason. Intuition skips the pairs that are already
connected by an indirect path, because they feel handled. In this project an
intuition-guided review missed the edge from GRUB to UEFI, because GRUB reached
UEFI through three other edges. A pairwise sweep treats every pair alike, so no
indirect path can hide a missing direct edge.

For a large graph, partition the work. Assign one reviewer per source node, and
have each reviewer check that node against all the others. The project ran this as
a parallel workflow, one auditor per node. The run recovered the GRUB-to-UEFI edge
and about twenty others that the intuition pass had missed.

### 8.4 Adversarial verification

For each candidate edge, try to **refute** it before accepting it. Ask whether the
relationship is direct, or an indirect path restated. Ask whether it is redundant
with an existing edge. Ask whether the direction is right. Reject by default when
the link is vague or already implied. In the project this pass removed about a
third of the proposed edges as indirect or redundant.

Record each accepted edge with its label and a one-line reason. Keep the reason as
the audit trail.

## 9. Step 6: Validate the structure

Structural validation covers a different class of fault from the edge sweep. The
sweep is for missing domain relationships. Validation is for broken structure. Run
these checks automatically:

- **Referential integrity**: every edge endpoint is a real node id.
- **Facet coverage**: report nodes that lack a value on a facet that should apply.
- **Conformance**: every node has exactly one category; every facet value is in
  the allowed set.
- **Orphans**: report nodes with no edges, and confirm that each is intended.

A JSON Schema and a short validator script perform all of this in seconds. Such a
check would have caught the missing architecture edges in this project at author
time, rather than at render time.

## 10. Step 7: Close the loop

Return to the competency questions from Step 0. For each, trace whether the graph
now answers it. A question with no answer points to a missing node, edge or facet.
Add what is missing, then re-run the pairwise sweep and the validation. Stop when
every competency question is answered, and the sweep proposes nothing new.

## 11. Representation and tooling

Author the graph as **data in one file**, kept apart from any renderer. This
project uses a single JavaScript object (`examples/fcos/data.js`) read by the
generic Cytoscape renderer (`src/graph.html`). The same data can then be:

- **rendered** for exploration, with hover notes, a details panel, colour-by-facet
  and show-layer controls;
- **validated** against a JSON Schema;
- **exported** to Cypher and loaded into a graph database (Neo4j, or the
  server-less Kùzu) for querying.

Prefer this separation over building the graph inside the drawing tool. A query
layer also automates part of the audit. The question "which chapters have no
prerequisite edge?" is one line of Cypher, not a manual sweep.

---

## Appendix: Applying the method to a book

**Node categories**, as a starting set: Concept, Term, Claim or Thesis, Person,
Source or Work, Example or Case, Chapter or Section.

**Facets**:

- chapter of first appearance, for colouring by reading order;
- part, or theme;
- status: drafted, outlined, or still to write;
- argument role: premise, conclusion, objection, or evidence;
- difficulty, or prerequisite depth.

**Layers**:

- one scope layer per chapter, with every node tagged by the chapters in which it
  appears;
- one narrative layer per running example or case study;
- argument threads that span several parts.

**Edge vocabulary**, as labels: depends-on or prerequisite, introduces, defines,
uses, exemplifies, contrasts-with, supports, objects-to, extends, recurs-in.

**Competency questions** to frame the book graph:

- What is the prerequisite chain into each chapter?
- Which concepts are introduced and never reused, and so are candidates to cut?
- Which claims have no supporting node?
- Which threads span the whole book, and which stay within one chapter?
- Where does a later chapter depend on a concept introduced much earlier, marking
  a place to add a recap?

The last two questions are the direct benefit for an author. The graph shows the
dependency structure of the book, so gaps and orphaned ideas become visible before
a reader meets them.
