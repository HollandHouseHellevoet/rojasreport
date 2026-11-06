# Approved mockups (design source of truth)

Canvas: https://claude.ai/artifact/TDNh77Kmp8ZNiPayAvS8p7 (saved November 6, 2026, version 1793977154-5baf)

| File | Artboard | Page |
|---|---|---|
| home.dc.html | Home page, physicians first | `/` |
| system-profile.dc.html | Health system profile, subsidy ledger (CommonSpirit) | `/systems/[slug]` |
| state-dossier.dc.html | State dossier (North Carolina) | `/states/[st]` |
| committee-dossier.dc.html | Committee dossier (Senate Finance) | `/committees/[slug]` |

Each file is one self-contained artboard: the markup inside `<x-dc>` is the design. Where a mockup and `docs/BUILD_BRIEF.md` disagree, the brief wins (for example the nav item is "Committees," not "Lawmakers"). Figures in the mockups are placeholders; nothing in them is a source.
