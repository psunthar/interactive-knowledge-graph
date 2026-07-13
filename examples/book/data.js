/*
 * EXAMPLE book graph — a non-exhaustive starter built from the table of contents
 * of a Computational Flow Modelling course (17 chapters, 4 parts).
 *
 * It demonstrates the book pattern from METHOD.md:
 *   - categories: Part, Chapter, Concept, Tool, Canonical
 *   - facets (colour-by lenses): part (I..IV), level (foundation..capstone)
 *   - layers (highlightable subgraphs): one per Part (scope), plus three
 *     narrative threads that span parts (V&V, the canonical problem, scaling)
 *   - edges: contains, prerequisite-for, introduces, needs, recurs-in
 *
 * It is deliberately partial. A full build would tag every node with its chapter
 * (one scope layer per chapter) and add the remaining concepts. Open with
 *   ../../src/graph.html?data=examples/book/data.js
 */
window.KG = {
  title: 'Computational Flow Modelling — example book graph',
  groups: {
    Part: '#37474f', Chapter: '#1565c0', Concept: '#00838f', Tool: '#6a1b9a', Canonical: '#b71c1c',
  },
  facets: {
    part:  { name: 'Part',  values: { I: '#5e35b1', II: '#00897b', III: '#ef6c00', IV: '#c62828' } },
    level: { name: 'Level', values: { foundation: '#78909c', core: '#1565c0', advanced: '#8e24aa', capstone: '#b71c1c' } },
  },
  layers: {
    part1:     { name: 'Part I: Foundations',       color: '#5e35b1' },
    part2:     { name: 'Part II: Transport',        color: '#00897b' },
    part3:     { name: 'Part III: Complex flows',   color: '#ef6c00' },
    part4:     { name: 'Part IV: Cornerstone',      color: '#c62828' },
    vv:        { name: 'V&V thread',                color: '#c62828' },
    canonical: { name: 'Canonical packed-bed thread', color: '#00897b' },
    scaling:   { name: 'Scaling / dimensionless thread', color: '#5e35b1' },
  },

  nodes: [
    // Parts
    { id: 'p1', label: 'Part I', group: 'Part', facets: { part: 'I', level: 'foundation' }, layers: ['part1'],
      short: 'Foundations and Tools', desc: 'Part I: Foundations and Tools (Chapters 1–6).' },
    { id: 'p2', label: 'Part II', group: 'Part', facets: { part: 'II', level: 'core' }, layers: ['part2'],
      short: 'Transport Build-up', desc: 'Part II: Transport Build-up (Chapters 7–11).' },
    { id: 'p3', label: 'Part III', group: 'Part', facets: { part: 'III', level: 'advanced' }, layers: ['part3'],
      short: 'Complex Flows', desc: 'Part III: Complex Flows (Chapters 12–16).' },
    { id: 'p4', label: 'Part IV', group: 'Part', facets: { part: 'IV', level: 'capstone' }, layers: ['part4'],
      short: 'Cornerstone', desc: 'Part IV: Cornerstone (Chapter 17).' },

    // Chapters
    { id: 'ch1', label: 'Ch1 Orientation', group: 'Chapter', facets: { part: 'I', level: 'foundation' }, layers: ['part1'],
      short: 'What computational flow modelling is; how the course works.', desc: 'Chapter 1: Orientation.' },
    { id: 'ch2', label: 'Ch2 Canonical Problem', group: 'Chapter', facets: { part: 'I', level: 'foundation' }, layers: ['part1', 'canonical'],
      short: 'Poses the packed-bed reactor that recurs through the book.', desc: 'Chapter 2: The Canonical Problem.' },
    { id: 'ch3', label: 'Ch3 CFD Workflow', group: 'Chapter', facets: { part: 'I', level: 'foundation' }, layers: ['part1'],
      short: 'The workflow and a first OpenFOAM run.', desc: 'Chapter 3: The CFD Workflow and First OpenFOAM Run.' },
    { id: 'ch4', label: 'Ch4 Case & ParaView', group: 'Chapter', facets: { part: 'I', level: 'foundation' }, layers: ['part1'],
      short: 'Case anatomy and the ParaView pipeline.', desc: 'Chapter 4: Case Anatomy and the ParaView Pipeline.' },
    { id: 'ch5', label: 'Ch5 Numerics', group: 'Chapter', facets: { part: 'I', level: 'foundation' }, layers: ['part1', 'scaling'],
      short: 'FVM, grids, discretisation; the numerical foundations.', desc: 'Chapter 5: Numerical Foundations — FVM, Grids, Discretisation.' },
    { id: 'ch6', label: 'Ch6 V&V', group: 'Chapter', facets: { part: 'I', level: 'foundation' }, layers: ['part1', 'vv'],
      short: 'Verification and Validation; the error taxonomy and GCI.', desc: 'Chapter 6: Verification and Validation.' },
    { id: 'ch7', label: 'Ch7 Steady Diffusion', group: 'Chapter', facets: { part: 'II', level: 'core' }, layers: ['part2', 'canonical', 'scaling'],
      short: 'Conduction and diffusion; properties and geometry.', desc: 'Chapter 7: Steady Diffusion.' },
    { id: 'ch8', label: 'Ch8 Transient Diffusion', group: 'Chapter', facets: { part: 'II', level: 'core' }, layers: ['part2', 'canonical', 'scaling'],
      short: 'Time marching to steady; Fourier and Biot numbers.', desc: 'Chapter 8: Transient Diffusion.' },
    { id: 'ch9', label: 'Ch9 Laminar Momentum', group: 'Chapter', facets: { part: 'II', level: 'core' }, layers: ['part2', 'canonical', 'scaling'],
      short: 'Internal and external laminar flows; the Reynolds number.', desc: 'Chapter 9: Laminar Momentum.' },
    { id: 'ch10', label: 'Ch10 Porous Momentum', group: 'Chapter', facets: { part: 'II', level: 'core' }, layers: ['part2', 'canonical'],
      short: 'Developing flow and porous-media momentum (the bed closure).', desc: 'Chapter 10: Developing Flow and Porous-Media Momentum.' },
    { id: 'ch11', label: 'Ch11 Convection–Diffusion', group: 'Chapter', facets: { part: 'II', level: 'core' }, layers: ['part2'],
      short: 'Convection–diffusion of a scalar; Péclet-driven schemes.', desc: 'Chapter 11: Convection–Diffusion of a Scalar.' },
    { id: 'ch12', label: 'Ch12 Buoyancy & COMSOL', group: 'Chapter', facets: { part: 'III', level: 'advanced' }, layers: ['part3'],
      short: 'Convective heat transfer, buoyancy, a COMSOL comparison.', desc: 'Chapter 12: Convective Heat Transfer, Buoyancy, and a COMSOL Comparison.' },
    { id: 'ch13', label: 'Ch13 Turbulence', group: 'Chapter', facets: { part: 'III', level: 'advanced' }, layers: ['part3'],
      short: 'RANS, wall functions, y+.', desc: 'Chapter 13: Turbulence Modelling.' },
    { id: 'ch14', label: 'Ch14 Species & Reaction', group: 'Chapter', facets: { part: 'III', level: 'advanced' }, layers: ['part3'],
      short: 'Species transport and Arrhenius reaction sources.', desc: 'Chapter 14: Species Transport and Reaction.' },
    { id: 'ch15', label: 'Ch15 VOF', group: 'Chapter', facets: { part: 'III', level: 'advanced' }, layers: ['part3'],
      short: 'Moving boundaries: VOF and interface tracking.', desc: 'Chapter 15: Moving Boundaries.' },
    { id: 'ch16', label: 'Ch16 Two-Fluid', group: 'Chapter', facets: { part: 'III', level: 'advanced' }, layers: ['part3', 'canonical'],
      short: 'Euler–Euler two-fluid multiphase (the fluidised bed).', desc: 'Chapter 16: Multiphase Euler–Euler Two-Fluid Flow.' },
    { id: 'ch17', label: 'Ch17 Cornerstone', group: 'Chapter', facets: { part: 'IV', level: 'capstone' }, layers: ['part4', 'vv', 'canonical'],
      short: 'Complete analysis of the packed-bed reactor.', desc: 'Chapter 17: Complete Analysis of Packed-Bed Reactor.' },

    // Recurring concepts
    { id: 'c_fvm', label: 'FVM', group: 'Concept', facets: { part: 'I', level: 'foundation' }, layers: ['part1'],
      short: 'Finite-volume method: integrate, do not differentiate.', desc: 'The finite-volume method — conservation holds cell by cell.' },
    { id: 'c_courant', label: 'Courant number', group: 'Concept', facets: { part: 'I', level: 'foundation' }, layers: ['part1'],
      short: 'CFL number: sets the stable time step.', desc: 'The Courant (CFL) number governing explicit time-step stability.' },
    { id: 'c_scaling', label: 'Dimensionless scaling', group: 'Concept', facets: { part: 'I', level: 'foundation' }, layers: ['part1', 'scaling'],
      short: 'Non-dimensionalisation; each scaling leaves a group.', desc: 'Scaling and dimensionless form; recurs in every transport chapter.' },
    { id: 'c_vv', label: 'V&V', group: 'Concept', facets: { part: 'I', level: 'foundation' }, layers: ['part1', 'vv'],
      short: 'Verification (solving right) vs validation (right equations).', desc: 'Verification and Validation; the discipline that recurs in every homework.' },
    { id: 'c_gci', label: 'GCI', group: 'Concept', facets: { part: 'I', level: 'foundation' }, layers: ['part1', 'vv'],
      short: 'Grid Convergence Index from a refinement study.', desc: 'The Grid Convergence Index — a reported measure of discretisation error.' },
    { id: 'c_diffusion', label: 'Diffusion balance', group: 'Concept', facets: { part: 'II', level: 'core' }, layers: ['part2'],
      short: 'The steady/unsteady diffusion (conduction) equation.', desc: 'The diffusion balance underlying Chapters 7 and 8.' },
    { id: 'c_bc', label: 'Boundary conditions', group: 'Concept', facets: { part: 'II', level: 'core' }, layers: ['part2'],
      short: 'Dirichlet/Neumann/Robin and well-posedness.', desc: 'Boundary conditions and well-posedness.' },
    { id: 'c_fourier', label: 'Fourier number', group: 'Concept', facets: { part: 'II', level: 'core' }, layers: ['part2', 'scaling'],
      short: 'Dimensionless time for a transient.', desc: 'The Fourier number governing transient-diffusion collapse.' },
    { id: 'c_biot', label: 'Biot number', group: 'Concept', facets: { part: 'II', level: 'core' }, layers: ['part2', 'scaling'],
      short: 'Lumped vs distributed body.', desc: 'The Biot number separating lumped from distributed behaviour.' },
    { id: 'c_momentum', label: 'Momentum balance', group: 'Concept', facets: { part: 'II', level: 'core' }, layers: ['part2'],
      short: 'Incompressible Navier–Stokes.', desc: 'The incompressible momentum balance.' },
    { id: 'c_reynolds', label: 'Reynolds number', group: 'Concept', facets: { part: 'II', level: 'core' }, layers: ['part2', 'scaling'],
      short: 'Inertia vs viscosity; the flow-regime group.', desc: 'The Reynolds number.' },
    { id: 'c_peclet', label: 'Péclet number', group: 'Concept', facets: { part: 'II', level: 'core' }, layers: ['part2', 'scaling'],
      short: 'Convection vs diffusion; drives scheme choice.', desc: 'The Péclet number.' },
    { id: 'c_porous', label: 'Porous closure', group: 'Concept', facets: { part: 'II', level: 'core' }, layers: ['part2', 'canonical'],
      short: 'Darcy–Forchheimer–Ergun packed-bed closure.', desc: 'The porous-media momentum closure (Darcy, Forchheimer, Ergun).' },

    // Tools
    { id: 't_openfoam', label: 'OpenFOAM', group: 'Tool', facets: { level: 'foundation' }, layers: ['part1'],
      short: 'The primary CFD solver used throughout.', desc: 'OpenFOAM — the finite-volume CFD toolkit used across the course.' },
    { id: 't_paraview', label: 'ParaView', group: 'Tool', facets: { level: 'foundation' }, layers: ['part1'],
      short: 'Post-processing and visualisation.', desc: 'ParaView — the visualisation pipeline.' },
    { id: 't_comsol', label: 'COMSOL', group: 'Tool', facets: { level: 'advanced' }, layers: ['part3'],
      short: 'A second tool, used for a comparison in Ch12.', desc: 'COMSOL — used for a tool comparison.' },

    // Canonical problem
    { id: 'canon', label: 'Packed-bed reactor', group: 'Canonical', facets: { part: 'I', level: 'capstone' }, layers: ['canonical'],
      short: 'The canonical problem posed in Ch2, solved fully in Ch17.', desc: 'The canonical packed-bed reactor problem that threads the whole book.' },
  ],

  edges: [
    // parts contain chapters
    { source: 'p1', target: 'ch1', label: 'contains' }, { source: 'p1', target: 'ch2', label: 'contains' },
    { source: 'p1', target: 'ch3', label: 'contains' }, { source: 'p1', target: 'ch4', label: 'contains' },
    { source: 'p1', target: 'ch5', label: 'contains' }, { source: 'p1', target: 'ch6', label: 'contains' },
    { source: 'p2', target: 'ch7', label: 'contains' }, { source: 'p2', target: 'ch8', label: 'contains' },
    { source: 'p2', target: 'ch9', label: 'contains' }, { source: 'p2', target: 'ch10', label: 'contains' },
    { source: 'p2', target: 'ch11', label: 'contains' },
    { source: 'p3', target: 'ch12', label: 'contains' }, { source: 'p3', target: 'ch13', label: 'contains' },
    { source: 'p3', target: 'ch14', label: 'contains' }, { source: 'p3', target: 'ch15', label: 'contains' },
    { source: 'p3', target: 'ch16', label: 'contains' },
    { source: 'p4', target: 'ch17', label: 'contains' },

    // chapter prerequisite chain (reading order)
    { source: 'ch1', target: 'ch2', label: 'prerequisite for' }, { source: 'ch2', target: 'ch3', label: 'prerequisite for' },
    { source: 'ch3', target: 'ch4', label: 'prerequisite for' }, { source: 'ch4', target: 'ch5', label: 'prerequisite for' },
    { source: 'ch5', target: 'ch6', label: 'prerequisite for' }, { source: 'ch6', target: 'ch7', label: 'prerequisite for' },
    { source: 'ch7', target: 'ch8', label: 'prerequisite for' }, { source: 'ch8', target: 'ch9', label: 'prerequisite for' },
    { source: 'ch9', target: 'ch10', label: 'prerequisite for' }, { source: 'ch10', target: 'ch11', label: 'prerequisite for' },
    { source: 'ch11', target: 'ch12', label: 'prerequisite for' }, { source: 'ch12', target: 'ch13', label: 'prerequisite for' },
    { source: 'ch13', target: 'ch14', label: 'prerequisite for' }, { source: 'ch14', target: 'ch15', label: 'prerequisite for' },
    { source: 'ch15', target: 'ch16', label: 'prerequisite for' }, { source: 'ch16', target: 'ch17', label: 'prerequisite for' },

    // cornerstone integrates earlier chapters
    { source: 'ch17', target: 'ch7', label: 'integrates' }, { source: 'ch17', target: 'ch9', label: 'integrates' },
    { source: 'ch17', target: 'ch10', label: 'integrates' }, { source: 'ch17', target: 'ch6', label: 'applies' },

    // chapters introduce concepts
    { source: 'ch5', target: 'c_fvm', label: 'introduces' }, { source: 'ch5', target: 'c_courant', label: 'introduces' },
    { source: 'ch5', target: 'c_scaling', label: 'introduces' }, { source: 'ch6', target: 'c_vv', label: 'introduces' },
    { source: 'ch6', target: 'c_gci', label: 'introduces' }, { source: 'ch7', target: 'c_diffusion', label: 'introduces' },
    { source: 'ch7', target: 'c_bc', label: 'introduces' }, { source: 'ch8', target: 'c_fourier', label: 'introduces' },
    { source: 'ch8', target: 'c_biot', label: 'introduces' }, { source: 'ch9', target: 'c_momentum', label: 'introduces' },
    { source: 'ch9', target: 'c_reynolds', label: 'introduces' }, { source: 'ch10', target: 'c_porous', label: 'introduces' },
    { source: 'ch11', target: 'c_peclet', label: 'introduces' },

    // concept relations
    { source: 'c_gci', target: 'c_vv', label: 'part of' },
    { source: 'c_reynolds', target: 'c_scaling', label: 'a' }, { source: 'c_fourier', target: 'c_scaling', label: 'a' },
    { source: 'c_peclet', target: 'c_scaling', label: 'a' }, { source: 'c_biot', target: 'c_fourier', label: 'pairs with' },
    { source: 'c_peclet', target: 'c_reynolds', label: 'relates to' }, { source: 'c_reynolds', target: 'c_momentum', label: 'governs' },
    { source: 'c_porous', target: 'c_momentum', label: 'reduces' },

    // tools
    { source: 'ch3', target: 't_openfoam', label: 'uses' }, { source: 'ch5', target: 't_openfoam', label: 'uses' },
    { source: 'ch4', target: 't_paraview', label: 'uses' }, { source: 'ch12', target: 't_comsol', label: 'compares with' },

    // canonical problem
    { source: 'ch2', target: 'canon', label: 'poses' }, { source: 'ch17', target: 'canon', label: 'solves fully' },
    { source: 'canon', target: 'c_porous', label: 'needs' }, { source: 'canon', target: 'c_diffusion', label: 'needs' },
    { source: 'canon', target: 'c_momentum', label: 'needs' },

    // recurrence (the payoff view: recurring ideas across chapters)
    { source: 'c_vv', target: 'ch17', label: 'recurs in' }, { source: 'c_scaling', target: 'ch7', label: 'recurs in' },
    { source: 'c_scaling', target: 'ch8', label: 'recurs in' }, { source: 'c_scaling', target: 'ch9', label: 'recurs in' },
  ],
};
