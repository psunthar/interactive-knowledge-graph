---
title: FCOS / immutable-OS on industrial hardware
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# FCOS & immutable OS on industrial hardware

## Requirement: immutability
- Immutable root filesystem
- A/B atomic updates
- Reliable rollback
- Engines
  - ostree / rpm-ostree
  - btrfs snapshots + snapper
  - **bootc** — OS as an OCI image

## bootc facts
- Successor image model — FCOS & Fedora IoT converge
- Build with a `Containerfile`, push to a registry
- `bootc install` / `upgrade` / `switch` / `rollback`
- Uses ostree + composefs underneath
- **Does NOT remove the UEFI requirement**
- Can bake U-Boot + firmware into the image

## Axis 1 — architecture
- `x86_64` (Intel / AMD)
- `aarch64` (ARMv8)
- `ppc64le` / `s390x` (not SBC)

## Axis 2 — firmware class
- PC-class UEFI + ACPI
- SystemReady SR / ES
- UEFI + device-tree
- Bare vendor-boot SBC → graft U-Boot / EDK2
- No UEFI path

## Boot-chain layers
- SoC boot ROM (in silicon)
- Platform firmware / UEFI (board SPI flash)
- GRUB (ESP on disk)
- Kernel + dtb (on disk)

## Hardware tiers
- Tier 1 — x86 box-PC · effort **none**
- Tier 2 — SystemReady ARM · effort **none**
- Tier 3 — bare SBC / DIY · **= CM4 today**
- Blocked · **= Pi 5 / CM5 today**

## OS options (immutable family)
- FCOS (ostree)
- Fedora IoT — sibling; Ignition; Pi images
- openSUSE MicroOS — Pi 5 works; SUSE U-Boot
- Custom bootc image — you own the build
