/*
 * Shared knowledge graph for the FCOS / immutable-OS on industrial hardware topic.
 * Synthesised from this repo's docs and the design conversation.
 *
 * The FCOS example dataset for the interactive-knowledge-graph renderer.
 * Open ../../src/graph.html (which defaults to loading this file), or
 *   ../../src/graph.html?data=examples/fcos/data.js
 * A dataset assigns window.KG = { title, groups, facets, layers, nodes, edges }.
 *
 * MULTI-FACET MODEL
 *   node.group   = primary CATEGORY (one; default colour)
 *   node.facets  = { tier, ecosystem, status, abstraction, stack }  (many lenses)
 *   node.layers  = [ ...layer ids ]   (cross-cutting subgraphs, e.g. the boot sequence)
 *   node.short / node.desc            (hover tooltip / side-box detail)
 * edge = { source, target, label }    (directed; label is the relationship verb)
 *
 * `groups` colours the category facet; `facets` colours the other lenses;
 * `layers` names the highlightable subgraphs. A node participates in as many
 * facets/layers as apply — that is what lets us bring out different layers.
 */
window.KG = {
  title: 'FCOS immutable-OS graph',
  groups: {
    Requirement: '#b71c1c', Engine: '#6a1b9a', OS: '#1b5e20', Architecture: '#ef6c00',
    FirmwareClass: '#0277bd', Concept: '#00838f', BootComponent: '#455a64',
    Hardware: '#4527a0', SoC: '#37474f', Storage: '#7b6f00',
  },

  // colour palettes for the other "colour by" lenses
  facets: {
    tier:        { name: 'Effort tier',  values: { '1': '#2e7d32', '2': '#00838f', '3': '#ef6c00' } },
    ecosystem:   { name: 'Ecosystem',    values: { Fedora: '#294172', SUSE: '#30ba78', 'Arm-firmware': '#6d4c41', 'Broadcom-Pi': '#c51a4a', 'Intel-AMD': '#ef6c00', generic: '#78909c' } },
    status:      { name: 'Status',       values: { 'works-today': '#2e7d32', blocked: '#c62828', WIP: '#f9a825', general: '#78909c' } },
    abstraction: { name: 'Abstraction',  values: { standard: '#1565c0', implementation: '#6a1b9a', product: '#2e7d32', goal: '#b71c1c' } },
    stack:       { name: 'Stack layer',  values: { requirement: '#b71c1c', arch: '#ef6c00', os: '#1b5e20', engine: '#8e24aa', bootloader: '#455a64', firmware: '#0277bd', silicon: '#37474f', hardware: '#4527a0', storage: '#7b6f00' } },
  },

  // cross-cutting layers = highlightable subgraphs
  layers: {
    'boot-seq':  { name: 'Boot sequence',      color: '#5e35b1' },
    'pi5':       { name: 'Pi 5 / CM5 blocker', color: '#c62828' },
    'immut':     { name: 'Immutability path',  color: '#00897b' },
    'appliance': { name: 'Reference appliance', color: '#ef6c00' },
  },

  nodes: [
    { id: 'req_immut', label: 'Immutability', group: 'Requirement',
      facets: { ecosystem: 'generic', status: 'general', abstraction: 'goal', stack: 'requirement' }, layers: ['immut'],
      short: 'Read-only OS with atomic, roll-back-able updates.',
      desc: 'The core goal: a read-only OS whose updates apply as an all-or-nothing swap you can instantly roll back.' },

    { id: 'eng_ostree', label: 'ostree /\nrpm-ostree', group: 'Engine',
      facets: { ecosystem: 'Fedora', status: 'works-today', abstraction: 'implementation', stack: 'engine' }, layers: ['immut', 'appliance'],
      short: 'Git-like versioned OS filesystem; atomic A/B + rollback.',
      desc: 'Git-like versioning of the whole OS filesystem; rpm-ostree layers RPM packages on top. Gives atomic A/B deployments and rollback. Basis of FCOS and Fedora IoT.' },
    { id: 'eng_btrfs', label: 'btrfs +\nsnapper', group: 'Engine',
      facets: { ecosystem: 'SUSE', status: 'works-today', abstraction: 'implementation', stack: 'engine' }, layers: ['immut'],
      short: 'Btrfs snapshots + snapper: transactional updates, auto-rollback.',
      desc: 'openSUSE approach: Btrfs (B-tree filesystem) copy-on-write snapshots managed by snapper give transactional updates and auto-rollback on a failed boot.' },
    { id: 'eng_bootc', label: 'bootc', group: 'Engine',
      facets: { ecosystem: 'Fedora', status: 'works-today', abstraction: 'implementation', stack: 'engine' }, layers: ['immut'],
      short: 'Ship the whole OS as an OCI image; transactional updates.',
      desc: 'Bootable containers: build, ship and update the whole OS as an OCI image, with transactional updates via ostree. The direction FCOS and Fedora IoT are converging on.' },
    { id: 'eng_composefs', label: 'composefs', group: 'Engine',
      facets: { ecosystem: 'Fedora', status: 'works-today', abstraction: 'implementation', stack: 'engine' }, layers: ['immut'],
      short: 'Read-only, integrity-verified filesystem under bootc/ostree.',
      desc: 'A read-only, content-addressed filesystem used under bootc/ostree to mount and integrity-verify the OS image.' },

    { id: 'os_fcos', label: 'Fedora CoreOS', group: 'OS',
      facets: { ecosystem: 'Fedora', status: 'works-today', abstraction: 'product', stack: 'os' }, layers: ['immut', 'appliance'],
      short: 'Minimal immutable auto-updating container host. Assumes UEFI.',
      desc: 'FCOS = Fedora CoreOS: a minimal, immutable, auto-updating container host. Provisioned by Ignition. Assumes standard UEFI boot.' },
    { id: 'os_iot', label: 'Fedora IoT', group: 'OS',
      facets: { ecosystem: 'Fedora', status: 'works-today', abstraction: 'product', stack: 'os' }, layers: ['immut'],
      short: "FCOS's edge sibling; ships ready-made Raspberry Pi images.",
      desc: "Fedora's edge/IoT sibling of FCOS — same rpm-ostree and Ignition, but ships ready-made Raspberry Pi images with the boot firmware integrated (no manual U-Boot grafting)." },
    { id: 'os_microos', label: 'MicroOS', group: 'OS',
      facets: { ecosystem: 'SUSE', status: 'works-today', abstraction: 'product', stack: 'os' }, layers: ['immut', 'pi5'],
      short: 'Immutable openSUSE; runs on Pi 5 today (SUSE U-Boot).',
      desc: 'openSUSE MicroOS: immutable openSUSE using Btrfs snapshots + transactional-update. SUSE upstreamed Raspberry Pi 5 U-Boot (Nov 2025), so it runs on Pi 5 today.' },
    { id: 'os_bootcimg', label: 'bootc image', group: 'OS',
      facets: { ecosystem: 'Fedora', status: 'WIP', abstraction: 'product', stack: 'os' }, layers: ['immut'],
      short: 'Your own OCI OS image; can bake in the Pi boot firmware.',
      desc: 'A custom OS built as an OCI image with bootc — you can bake the Pi boot firmware (U-Boot, .dtb, config.txt) into a versioned, rollback-managed image.' },

    { id: 'arch_x86', label: 'amd64', group: 'Architecture',
      facets: { ecosystem: 'Intel-AMD', status: 'works-today', abstraction: 'standard', stack: 'arch' }, layers: [],
      short: '64-bit Intel/AMD ISA (a.k.a. x86_64); boards ship real UEFI.',
      desc: 'amd64 (a.k.a. x86_64): the 64-bit Intel/AMD instruction set (ISA). Industrial box-PCs use it; boards ship with real UEFI firmware built in.' },
    { id: 'arch_arm', label: 'aarch64', group: 'Architecture',
      facets: { ecosystem: 'generic', status: 'works-today', abstraction: 'standard', stack: 'arch' }, layers: [],
      short: '64-bit ARM; boot-firmware support varies by board.',
      desc: '64-bit ARM (ARMv8 and later). Raspberry Pi, Rockchip, Ampere, NXP. Boot-firmware support varies enormously by board.' },

    { id: 'fw_pcuefi', label: 'PC-class UEFI', group: 'FirmwareClass',
      facets: { tier: '1', ecosystem: 'Intel-AMD', status: 'works-today', abstraction: 'standard', stack: 'firmware' }, layers: [],
      short: 'Built-in UEFI + ACPI; the OS just boots.',
      desc: 'Standard PC firmware permanently in a board flash chip, describing hardware via ACPI. The OS "just boots" — no glue.' },
    { id: 'fw_sr', label: 'SystemReady', group: 'FirmwareClass',
      facets: { tier: '2', ecosystem: 'Arm-firmware', status: 'works-today', abstraction: 'standard', stack: 'firmware' }, layers: [],
      short: 'Arm-certified UEFI + ACPI; stock image boots like a PC.',
      desc: 'Arm SystemReady certification (SR = Server, ES = Embedded Server): UEFI + ACPI in firmware, so a stock OS image boots like a PC.' },
    { id: 'fw_uefidt', label: 'UEFI +\ndevice-tree', group: 'FirmwareClass',
      facets: { tier: '2', ecosystem: 'Arm-firmware', status: 'works-today', abstraction: 'standard', stack: 'firmware' }, layers: [],
      short: 'UEFI firmware, but hardware described by device tree.',
      desc: 'Board ships UEFI firmware but describes hardware with a Device Tree (.dtb) instead of ACPI.' },
    { id: 'fw_bare', label: 'Bare SBC', group: 'FirmwareClass',
      facets: { tier: '3', ecosystem: 'Arm-firmware', status: 'works-today', abstraction: 'standard', stack: 'firmware' }, layers: ['appliance'],
      short: 'No UEFI; you graft on U-Boot/EDK2 yourself (e.g. Pi).',
      desc: 'A bare SBC (Single-Board Computer) has no UEFI: the SoC ROM runs a vendor loader and you must graft on U-Boot or EDK2 yourself (e.g. Raspberry Pi). If no U-Boot exists for the SoC yet, the board is effectively unbootable — a state, not a class.' },

    { id: 'c_uefi', label: 'UEFI', group: 'Concept',
      facets: { ecosystem: 'generic', status: 'works-today', abstraction: 'standard', stack: 'firmware' }, layers: ['boot-seq'],
      short: 'Standard firmware→bootloader contract FCOS assumes.',
      desc: 'UEFI = Unified Extensible Firmware Interface: the standard firmware→bootloader contract (ESP, boot variables, ACPI). What FCOS assumes exists.' },
    { id: 'c_acpi', label: 'ACPI', group: 'Concept',
      facets: { ecosystem: 'generic', status: 'works-today', abstraction: 'standard', stack: 'firmware' }, layers: [],
      short: "Tables letting one kernel discover any board's hardware.",
      desc: 'ACPI = Advanced Configuration and Power Interface: standardized tables letting one generic kernel discover a board’s hardware without per-board code.' },
    { id: 'c_dtb', label: 'Device tree', group: 'Concept',
      facets: { ecosystem: 'generic', status: 'works-today', abstraction: 'standard', stack: 'firmware' }, layers: ['boot-seq'],
      short: 'File describing hardware to the kernel (when no ACPI).',
      desc: 'DTB = Device Tree Blob: a data file describing hardware to the kernel on boards that lack ACPI (most ARM SBCs).' },
    { id: 'c_uboot', label: 'U-Boot', group: 'Concept',
      facets: { ecosystem: 'Arm-firmware', status: 'works-today', abstraction: 'implementation', stack: 'bootloader' }, layers: ['boot-seq', 'pi5', 'appliance'],
      short: 'Open bootloader; can present UEFI. No mainline Pi 5 support.',
      desc: 'Das U-Boot, the universal open-source bootloader. Built with EFI support it presents a UEFI-like interface to load GRUB. No mainline support for the Pi 5 SoC.' },
    { id: 'c_edk2', label: 'EDK2', group: 'Concept',
      facets: { ecosystem: 'Arm-firmware', status: 'WIP', abstraction: 'implementation', stack: 'bootloader' }, layers: ['boot-seq', 'pi5'],
      short: 'Reference UEFI firmware. Pi 5 port is work-in-progress.',
      desc: 'EDK2 = EFI Development Kit II (TianoCore): the reference implementation of real UEFI firmware. The Pi 5 port (rpi5-uefi) is work-in-progress.' },
    { id: 'c_ignition', label: 'Ignition /\nButane', group: 'Concept',
      facets: { ecosystem: 'Fedora', status: 'works-today', abstraction: 'implementation', stack: 'os' }, layers: ['appliance'],
      short: 'FCOS first-boot config: Butane YAML → Ignition JSON.',
      desc: "First-boot provisioning for FCOS/Fedora IoT: you write human-friendly Butane YAML, compile it to an Ignition JSON that configures the machine on first boot." },
    { id: 'c_oci', label: 'OCI image', group: 'Concept',
      facets: { ecosystem: 'generic', status: 'works-today', abstraction: 'standard', stack: 'engine' }, layers: ['immut'],
      short: 'Standard container-image format bootc ships the OS as.',
      desc: 'OCI = Open Container Initiative: the standard container-image format bootc uses to package and ship the whole OS.' },

    { id: 'bc_rom', label: 'boot ROM', group: 'BootComponent',
      facets: { ecosystem: 'generic', status: 'works-today', abstraction: 'implementation', stack: 'silicon' }, layers: ['boot-seq'],
      short: 'Immutable loader in the SoC silicon; runs first.',
      desc: 'A tiny immutable loader burned into the CPU/SoC (System-on-Chip) silicon; the first code to run, it finds and starts the next boot stage.' },
    { id: 'bc_fw', label: 'Platform firmware', group: 'BootComponent',
      facets: { ecosystem: 'generic', status: 'works-today', abstraction: 'implementation', stack: 'firmware' }, layers: ['boot-seq'],
      short: 'UEFI in a board flash chip — not the CPU, not the disk.',
      desc: 'The UEFI firmware living in a dedicated SPI (Serial Peripheral Interface) flash chip on the board — separate from the CPU and the OS disk.' },
    { id: 'bc_vendor', label: 'Vendor loader', group: 'BootComponent',
      facets: { ecosystem: 'Broadcom-Pi', status: 'works-today', abstraction: 'implementation', stack: 'firmware' }, layers: ['boot-seq', 'appliance'],
      short: 'SBC board loader (Pi: GPU firmware) before any UEFI.',
      desc: "On SBCs, the board-specific loader the SoC ROM runs (on the Pi, GPU firmware from an SPI EEPROM) before any UEFI exists." },
    { id: 'bc_grub', label: 'GRUB', group: 'BootComponent',
      facets: { ecosystem: 'generic', status: 'works-today', abstraction: 'implementation', stack: 'bootloader' }, layers: ['boot-seq'],
      short: 'UEFI app that loads the kernel; lives on the ESP.',
      desc: 'GRUB = GRand Unified Bootloader: the UEFI application that loads the OS kernel. Lives on the ESP.' },
    { id: 'bc_esp', label: 'ESP', group: 'BootComponent',
      facets: { ecosystem: 'generic', status: 'works-today', abstraction: 'standard', stack: 'bootloader' }, layers: ['boot-seq'],
      short: 'FAT partition holding .efi bootloaders UEFI looks for.',
      desc: 'ESP = EFI System Partition: a small FAT partition holding bootloaders (.efi files) that UEFI knows to look for.' },
    { id: 'bc_kernel', label: 'Kernel + dtb', group: 'BootComponent',
      facets: { ecosystem: 'generic', status: 'works-today', abstraction: 'implementation', stack: 'os' }, layers: ['boot-seq'],
      short: 'OS kernel (+ device tree on ARM); the final stage.',
      desc: 'The OS kernel (plus a Device Tree blob on ARM) — the final stage the bootloader hands control to.' },

    { id: 'hw_x86', label: 'amd64 box-PC', group: 'Hardware',
      facets: { tier: '1', ecosystem: 'Intel-AMD', status: 'works-today', abstraction: 'product', stack: 'hardware' }, layers: [],
      short: 'Fanless Intel/AMD PC; real UEFI, full drivers.',
      desc: 'amd64 industrial box-PC: fanless Intel/AMD PC (OnLogic, Advantech, Kontron…). Real UEFI and full driver support — the low-risk hardware.' },
    { id: 'hw_sr', label: 'SystemReady\nboard', group: 'Hardware',
      facets: { tier: '2', ecosystem: 'Arm-firmware', status: 'works-today', abstraction: 'product', stack: 'hardware' }, layers: [],
      short: 'Arm board certified to boot stock images.',
      desc: 'An ARM board certified to Arm SystemReady (Ampere, SolidRun HoneyComb, NXP LX2160…) that boots stock images.' },
    { id: 'hw_cm4', label: 'CM4', group: 'Hardware',
      facets: { tier: '3', ecosystem: 'Broadcom-Pi', status: 'works-today', abstraction: 'product', stack: 'hardware' }, layers: ['appliance'],
      short: 'A deployed appliance board; boots FCOS from eMMC.',
      desc: 'RPi CM4 = Raspberry Pi Compute Module 4: a deployed appliance board; boots FCOS from eMMC via a grafted U-Boot.' },
    { id: 'hw_pi4', label: 'RPi 4', group: 'Hardware',
      facets: { tier: '3', ecosystem: 'Broadcom-Pi', status: 'works-today', abstraction: 'product', stack: 'hardware' }, layers: [],
      short: 'Tier-3 SBC; Fedora IoT reference platform.',
      desc: 'Raspberry Pi 4 — a Tier-3 bare SBC and Fedora IoT’s reference platform.' },
    { id: 'hw_pi5', label: 'RPi 5', group: 'Hardware',
      facets: { tier: '3', ecosystem: 'Broadcom-Pi', status: 'blocked', abstraction: 'product', stack: 'hardware' }, layers: ['pi5'],
      short: 'Tier-3 SBC, currently blocked: no mainline U-Boot (BCM2712).',
      desc: 'Raspberry Pi 5 — a Tier-3 bare SBC, but currently blocked: its BCM2712 SoC has no mainline U-Boot yet, so a generic immutable OS can’t boot (openSUSE MicroOS is the exception).' },
    { id: 'hw_cm5', label: 'CM5', group: 'Hardware',
      facets: { tier: '3', ecosystem: 'Broadcom-Pi', status: 'blocked', abstraction: 'product', stack: 'hardware' }, layers: ['pi5'],
      short: 'Tier-3 CM; blocked (no U-Boot); eMMC boot broken, needs NVMe.',
      desc: 'CM5 = Compute Module 5: Pi 5 silicon (BCM2712) as a Tier-3 SBC — blocked like the Pi 5, and eMMC boot doesn’t work under EDK2 yet, so NVMe/USB is required.' },

    { id: 'soc_bcm2712', label: 'BCM2712', group: 'SoC',
      facets: { tier: '3', ecosystem: 'Broadcom-Pi', status: 'blocked', abstraction: 'product', stack: 'silicon' }, layers: ['pi5'],
      short: 'Broadcom SoC in Pi 5/CM5; lacks mainline U-Boot.',
      desc: 'BCM2712: the Broadcom system-on-chip in the Pi 5 and CM5. Lacks mainline U-Boot — the root blocker for booting a generic OS.' },

    { id: 'st_emmc', label: 'eMMC', group: 'Storage',
      facets: { ecosystem: 'generic', status: 'works-today', abstraction: 'product', stack: 'storage' }, layers: ['appliance', 'pi5'],
      short: 'Soldered flash. OK on CM4; not bootable under Pi5 EDK2.',
      desc: 'eMMC = embedded MultiMediaCard: soldered flash storage. Works on CM4; not reliably bootable under the Pi 5/CM5 EDK2 UEFI yet.' },
    { id: 'st_nvme', label: 'NVMe', group: 'Storage',
      facets: { ecosystem: 'generic', status: 'works-today', abstraction: 'product', stack: 'storage' }, layers: ['pi5'],
      short: 'Fast PCIe SSD; the working Pi 5/CM5 boot medium.',
      desc: 'NVMe = Non-Volatile Memory express: fast PCIe SSD storage. The working boot medium on Pi 5/CM5 (needs an M.2 HAT or carrier).' },
    { id: 'st_sd', label: 'SD card', group: 'Storage',
      facets: { ecosystem: 'generic', status: 'works-today', abstraction: 'product', stack: 'storage' }, layers: ['pi5'],
      short: 'Bootable but slow and wear-prone; poor for 24/7.',
      desc: 'SD = Secure Digital card: bootable but slow and wear-prone; a poor choice for a 24/7 appliance.' },
  ],

  edges: [
    // requirement -> engines
    { source: 'req_immut', target: 'eng_ostree', label: 'satisfied by' },
    { source: 'req_immut', target: 'eng_btrfs',  label: 'satisfied by' },
    { source: 'req_immut', target: 'eng_bootc',  label: 'satisfied by' },

    // bootc internals + cross-links
    { source: 'eng_bootc', target: 'eng_ostree',    label: 'built on' },
    { source: 'eng_bootc', target: 'eng_composefs', label: 'uses' },
    { source: 'eng_bootc', target: 'c_oci',         label: 'ships OS as' },
    { source: 'eng_bootc', target: 'c_uefi',        label: 'does NOT remove' },
    { source: 'eng_bootc', target: 'c_uboot',       label: 'can bake in' },
    { source: 'eng_bootc', target: 'c_dtb',         label: 'can bake in' },

    // OS -> engine
    { source: 'os_fcos',     target: 'eng_ostree', label: 'uses' },
    { source: 'os_iot',      target: 'eng_ostree', label: 'uses' },
    { source: 'os_microos',  target: 'eng_btrfs',  label: 'uses' },
    { source: 'os_bootcimg', target: 'eng_bootc',  label: 'uses' },
    { source: 'os_fcos',     target: 'eng_bootc',  label: 'converging to' },
    { source: 'os_iot',      target: 'eng_bootc',  label: 'converging to' },

    // OS relations + provisioning
    { source: 'os_iot',  target: 'os_fcos',    label: 'sibling of' },
    { source: 'os_fcos', target: 'c_ignition', label: 'provisioned by' },
    { source: 'os_iot',  target: 'c_ignition', label: 'provisioned by' },
    { source: 'os_bootcimg', target: 'c_uboot', label: 'bakes in' },
    { source: 'os_bootcimg', target: 'fw_bare', label: 'mitigates' },
    { source: 'os_iot',  target: 'fw_bare', label: 'removes grafting' },
    { source: 'os_iot',  target: 'c_uboot', label: 'ships integrated' },

    // firmware class -> concepts
    { source: 'fw_pcuefi', target: 'c_uefi', label: 'provides' },
    { source: 'fw_pcuefi', target: 'c_acpi', label: 'uses' },
    { source: 'fw_sr',     target: 'c_uefi', label: 'provides' },
    { source: 'fw_sr',     target: 'c_acpi', label: 'uses' },
    { source: 'fw_uefidt', target: 'c_uefi', label: 'provides' },
    { source: 'fw_uefidt', target: 'c_dtb',  label: 'uses' },
    { source: 'fw_bare',   target: 'c_uefi', label: 'lacks' },
    { source: 'fw_bare',   target: 'c_uboot',label: 'you graft' },
    { source: 'fw_bare',   target: 'c_edk2', label: 'you graft' },

    // concept relations
    { source: 'c_uboot', target: 'c_uefi', label: 'provides UEFI-like' },
    { source: 'c_edk2',  target: 'c_uefi', label: 'implements' },
    { source: 'c_uefi',  target: 'c_acpi', label: 'pairs with' },
    { source: 'c_uboot', target: 'c_dtb',  label: 'hands kernel' },

    // architecture -> firmware class
    { source: 'arch_x86', target: 'fw_pcuefi', label: 'ships with' },
    { source: 'arch_arm', target: 'fw_sr',     label: 'can have' },
    { source: 'arch_arm', target: 'fw_bare',   label: 'often has' },
    { source: 'arch_arm', target: 'c_dtb',     label: 'usually needs' },

    // hardware -> its architecture, firmware class, and recommended OS
    // (Tier is now a facet/tag on these nodes, not a node.)
    { source: 'hw_x86', target: 'arch_x86',  label: 'is' },
    { source: 'hw_x86', target: 'fw_pcuefi', label: 'firmware' },
    { source: 'hw_x86', target: 'os_fcos',   label: 'runs (recommended)' },
    { source: 'hw_sr',  target: 'arch_arm',  label: 'is' },
    { source: 'hw_sr',  target: 'fw_sr',     label: 'firmware' },
    { source: 'hw_sr',  target: 'os_fcos',   label: 'runs stock' },
    { source: 'hw_cm4', target: 'arch_arm',  label: 'is' },
    { source: 'hw_cm4', target: 'fw_bare',   label: 'firmware' },
    { source: 'hw_cm4', target: 'os_fcos',   label: 'runs today' },
    { source: 'hw_pi4', target: 'arch_arm',  label: 'is' },
    { source: 'hw_pi4', target: 'fw_bare',   label: 'firmware' },
    { source: 'hw_pi4', target: 'os_iot',    label: 'reference platform' },
    { source: 'hw_pi5', target: 'arch_arm',  label: 'is' },
    { source: 'hw_pi5', target: 'fw_bare',   label: 'firmware' },
    { source: 'hw_cm5', target: 'arch_arm',  label: 'is' },
    { source: 'hw_cm5', target: 'fw_bare',   label: 'firmware' },
    { source: 'hw_pi5', target: 'soc_bcm2712', label: 'SoC' },
    { source: 'hw_cm5', target: 'soc_bcm2712', label: 'SoC' },

    // SoC / the blocker — this missing-U-Boot edge IS the "blocked" state
    { source: 'soc_bcm2712', target: 'c_uboot', label: 'no mainline (blocker)' },
    { source: 'c_edk2',      target: 'soc_bcm2712', label: 'WIP for' },
    { source: 'os_microos',  target: 'soc_bcm2712', label: 'SUSE upstreamed U-Boot' },
    { source: 'os_microos',  target: 'hw_pi5',      label: 'unblocks / runs on' },

    // storage (board -> the medium it boots, or the medium that fails on it)
    { source: 'hw_cm4', target: 'st_emmc', label: 'boots from' },
    { source: 'hw_cm5', target: 'st_emmc', label: 'eMMC boot unsupported' },
    { source: 'hw_cm5', target: 'st_nvme', label: 'must boot from' },
    { source: 'hw_pi5', target: 'st_sd',   label: 'SD boot (slow, fragile)' },

    // boot chain — Tier 1/2 path
    { source: 'bc_rom', target: 'bc_fw',    label: 'then' },
    { source: 'bc_fw',  target: 'bc_grub',  label: 'then' },
    { source: 'bc_grub',target: 'bc_kernel',label: 'then' },
    { source: 'bc_grub',target: 'bc_esp',   label: 'lives on' },
    { source: 'bc_fw',  target: 'c_uefi',   label: 'is' },

    // boot chain — Tier 3 path (bare SBC)
    { source: 'bc_rom',    target: 'bc_vendor', label: 'then (SBC)' },
    { source: 'bc_vendor', target: 'c_uboot',   label: 'loads' },
    { source: 'c_uboot',   target: 'bc_grub',   label: 'then' },

    // fleet provisioning
    { source: 'c_ignition', target: 'hw_cm4', label: 'configures' },

    // ---- added from the exhaustive pairwise audit (workflow: 25 verified edges) ----
    // high confidence
    { source: 'eng_ostree',  target: 'eng_composefs', label: 'uses' },
    { source: 'os_fcos',     target: 'c_uefi',        label: 'assumes' },
    { source: 'os_bootcimg', target: 'c_oci',         label: 'packaged as' },
    { source: 'arch_arm',    target: 'fw_uefidt',     label: 'can have' },
    { source: 'c_uefi',      target: 'bc_esp',        label: 'requires' },
    { source: 'bc_grub',     target: 'c_uefi',        label: 'is a UEFI app' },
    { source: 'c_acpi',      target: 'c_dtb',         label: 'alternative to' },
    { source: 'c_dtb',       target: 'bc_kernel',     label: 'describes hardware to' },
    { source: 'c_edk2',      target: 'st_emmc',       label: 'eMMC boot not yet supported' },
    { source: 'hw_pi4',      target: 'st_sd',         label: 'SD boot (slow, fragile)' },
    { source: 'hw_pi5',      target: 'st_nvme',       label: 'boots from (M.2 HAT)' },
    { source: 'os_microos',  target: 'c_uboot',       label: 'ships U-Boot' },
    { source: 'hw_cm4',      target: 'c_uboot',       label: 'boots via grafted U-Boot' },
    // medium confidence
    { source: 'eng_btrfs',   target: 'eng_ostree',    label: 'alternative to' },
    { source: 'arch_arm',    target: 'arch_x86',      label: 'alternative ISA to' },
    { source: 'fw_uefidt',   target: 'c_acpi',        label: 'does NOT use' },
    { source: 'bc_kernel',   target: 'c_acpi',        label: 'discovers hardware via' },
    { source: 'c_ignition',  target: 'hw_x86',        label: 'configures' },
    { source: 'os_microos',  target: 'fw_bare',       label: 'mitigates' },
    { source: 'os_bootcimg', target: 'c_dtb',         label: 'bakes in' },
    { source: 'arch_x86',    target: 'c_acpi',        label: 'uses' },
    { source: 'os_microos',  target: 'c_ignition',    label: 'provisioned by' },
    { source: 'bc_vendor',   target: 'c_edk2',        label: 'loads' },
    // low confidence
    { source: 'os_microos',  target: 'os_fcos',       label: 'alternative to' },
    { source: 'hw_cm4',      target: 'st_sd',         label: 'can boot from (Lite)' },
  ],
};
