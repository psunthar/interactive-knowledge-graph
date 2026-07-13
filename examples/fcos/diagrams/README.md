# FCOS / immutable-OS on industrial hardware — concept & decision map

Two views of the same problem:
- **Concept map** — the ideas and how they relate (what UEFI is, the two axes, tiers).
- **Decision flowchart** — the actual choose-your-hardware path.

Preview: VS Code Mermaid extension, GitHub, or <https://mermaid.live>.

---

## 1. Concept map

```mermaid
mindmap
  root((FCOS and immutable OS on industrial hardware))
    Requirement immutability
      Immutable root filesystem
      A-B atomic updates
      Reliable rollback
      Engine ostree rpm-ostree
      Engine btrfs snapshots snapper
      Engine bootc future OCI image
    Axis 1 architecture
      x86_64 Intel AMD
      aarch64 ARMv8
      ppc64le s390x not SBC
    Axis 2 firmware class
      PC-class UEFI plus ACPI
      SystemReady SR ES
      UEFI plus device-tree
      Bare vendor-boot SBC graft U-Boot or EDK2
      No UEFI path
    Boot chain layers
      SoC boot ROM in silicon
      Platform firmware UEFI in board SPI flash
      GRUB in ESP on disk
      Kernel and dtb on disk
    Hardware tiers
      Tier 1 x86 box-PC effort none
      Tier 2 SystemReady ARM effort none
      Tier 3 bare SBC DIY equals CM4 today
      Blocked equals Pi5 CM5 today
    Pi5 CM5 storage
      eMMC broken under EDK2
      NVMe necessary not sufficient
      SD fragile
    OS options immutable family
      FCOS ostree
      Fedora IoT sibling Ignition Pi images
      openSUSE MicroOS Pi5 works SUSE u-boot
```

---

## 2. Decision flowchart

```mermaid
flowchart TD
    A[Need immutable OS with atomic rollback?] -->|Yes - keep this requirement| B{Is the Raspberry Pi form factor a hard requirement?}
    A -->|No| Z[Different problem - out of scope]

    B -->|No, x86 acceptable| T1
    B -->|Yes, but CM4 or Pi 4 is fine| T2
    B -->|Yes, must be Pi 5 or CM5| T3

    T1[TIER 1 - x86 industrial box-PC + FCOS<br/>keep Ignition and deploy flow<br/>real UEFI, zero firmware glue<br/>only NIC names change<br/>RECOMMENDED - highest reliability]
    T2[Fedora IoT on CM4 or Pi 4<br/>same rpm-ostree and Ignition<br/>Pi images ship boot bits, no U-Boot grafting<br/>or simply keep FCOS-on-CM4]
    T3[openSUSE MicroOS<br/>btrfs snapshots + transactional-update rollback<br/>SUSE upstreamed Pi 5 U-Boot Nov 2025<br/>different engine, bigger migration]

    T1 --> R[Reliable immutability + rollback achieved]
    T2 --> R
    T3 --> R

    classDef rec fill:#1b5e20,stroke:#66bb6a,color:#fff;
    classDef blocked fill:#7f1d1d,stroke:#ef5350,color:#fff;
    class T1 rec;
```

---

## 3. Boot chain (why the tiers differ)

```mermaid
flowchart LR
    subgraph PC["Tier 1 / 2 — built-in UEFI"]
        direction LR
        p1[SoC boot ROM] --> p2[UEFI in board flash] --> p3[GRUB on ESP] --> p4[FCOS kernel]
    end
    subgraph SBC["Tier 3 — bare SBC, you supply the UEFI"]
        direction LR
        s1[SoC boot ROM] --> s2[vendor loader<br/>EEPROM or SD] --> s3[U-Boot or EDK2<br/>you place on boot partition] --> s4[GRUB on ESP] --> s5[kernel + dtb]
    end
    subgraph BLK["Blocked — Pi 5 / CM5 today"]
        direction LR
        b1[SoC boot ROM] --> b2[vendor loader] --> b3[no mainline U-Boot for BCM2712<br/>EDK2 is WIP]
    end
```
