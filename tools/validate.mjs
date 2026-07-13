#!/usr/bin/env node
/*
 * Validate a knowledge-graph dataset (window.KG) — structure + referential integrity.
 * Zero dependencies; needs Node.js.
 *
 *   node tools/validate.mjs [path-to-data.js]      # default: examples/fcos/data.js
 *
 * Exit code 1 if there are errors, 0 otherwise. Warnings never fail the run.
 *
 * It catches the STRUCTURAL class of fault (a bad category, a dangling edge, a
 * facet value outside its allowed set). It does NOT find missing DOMAIN edges —
 * that is the job of the pairwise sweep in METHOD.md Step 5.
 */
import { readFileSync } from 'node:fs';

const path = process.argv[2] || 'examples/fcos/data.js';

let KG;
try {
  const src = readFileSync(path, 'utf8');
  const window = {};
  // eslint-disable-next-line no-new-func
  new Function('window', src)(window);      // dataset assigns window.KG = {...}
  KG = window.KG;
} catch (e) {
  console.error(`Cannot load ${path}: ${e.message}`);
  process.exit(2);
}
if (!KG || typeof KG !== 'object') {
  console.error(`${path} did not assign window.KG to an object`);
  process.exit(2);
}

const errors = [];
const warns = [];
const E = (m) => errors.push(m);
const W = (m) => warns.push(m);

for (const k of ['groups', 'nodes', 'edges']) if (!KG[k]) E(`missing top-level "${k}"`);

const groups = KG.groups || {};
const facets = KG.facets || {};
const layers = KG.layers || {};
const nodes = Array.isArray(KG.nodes) ? KG.nodes : [];
const edges = Array.isArray(KG.edges) ? KG.edges : [];

// nodes: unique ids, declared group, declared facets/values, declared layers
const ids = new Set();
for (const n of nodes) {
  if (!n.id) { E(`node with no id: ${JSON.stringify(n).slice(0, 60)}`); continue; }
  if (ids.has(n.id)) E(`duplicate node id: ${n.id}`);
  ids.add(n.id);
  if (!n.label) E(`node ${n.id}: missing label`);
  if (!n.group) E(`node ${n.id}: missing group`);
  else if (!(n.group in groups)) E(`node ${n.id}: group "${n.group}" not declared in groups{}`);
  for (const [fk, fv] of Object.entries(n.facets || {})) {
    if (!(fk in facets)) E(`node ${n.id}: facet "${fk}" not declared in facets{}`);
    else if (!(fv in (facets[fk].values || {}))) E(`node ${n.id}: facet ${fk} value "${fv}" not in its allowed values`);
  }
  for (const ly of (n.layers || [])) if (!(ly in layers)) E(`node ${n.id}: layer "${ly}" not declared in layers{}`);
}

// edges: referential integrity, label present
edges.forEach((e, i) => {
  if (!e.source || !e.target) { E(`edge #${i}: missing source/target`); return; }
  if (!ids.has(e.source)) E(`edge #${i}: source "${e.source}" is not a node id`);
  if (!ids.has(e.target)) E(`edge #${i}: target "${e.target}" is not a node id`);
  if (!e.label) W(`edge ${e.source}->${e.target}: missing label`);
  if (e.source === e.target) W(`edge #${i}: self-loop on ${e.source}`);
});

// orphans (degree 0)
const deg = Object.fromEntries([...ids].map((id) => [id, 0]));
edges.forEach((e) => { if (deg[e.source] != null) deg[e.source]++; if (deg[e.target] != null) deg[e.target]++; });
for (const [id, d] of Object.entries(deg)) if (d === 0) W(`orphan node (no edges): ${id}`);

// facet coverage — a report, not an error (a facet may not apply to every node)
for (const fk of Object.keys(facets)) {
  const missing = nodes.filter((n) => !(n.facets && fk in n.facets)).map((n) => n.id);
  if (missing.length) W(`facet "${fk}" unset on ${missing.length} node(s): ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? ' …' : ''}`);
}

// report
console.log(`Dataset: ${path}`);
console.log(`  ${nodes.length} nodes · ${edges.length} edges · ${Object.keys(groups).length} categories · ${Object.keys(facets).length} facets · ${Object.keys(layers).length} layers`);
if (warns.length) { console.log(`\nWARNINGS (${warns.length}):`); warns.forEach((w) => console.log('  ! ' + w)); }
if (errors.length) {
  console.log(`\nERRORS (${errors.length}):`);
  errors.forEach((m) => console.log('  x ' + m));
  console.log('\nFAILED');
  process.exit(1);
}
console.log('\nOK — no structural errors.');
