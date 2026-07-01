# CanonRegistry V2

A GenLayer canonical-public-record registry.

This repository is a public registry system: records are submitted with sources, normalized on-chain, and exposed through a clean frontend for review.

## CanonRegistry Brief

- Project folder: `projects/19-canon`
- Frontend: static browser app
- Contract package: `contracts/` plus `deployment.json`
- Build status: Schema-valid (43321 bytes, 17 write + 22 view); deployed + 17 write smoke txs finalized incl 3 GenLayer reasoning calls; 38/38 read tests passed; legacy backward-compat verified; frontend repointed (no redesign).
- QA notes: Upgraded from a 5.5KB register/seal MVP to CanonRegistry V2. Smoke: set_canon_standard / create_record / 3 add_citation calls plus initial source citation / propose_revision / add_contradiction / open_review / review_with_genlayer / open_challenge_window /...

## Network Record

- Network: studionet (61999)
- Contract: [0x2043619F63E7123474206d1114d58099d4221A13](https://explorer-studio.genlayer.com/contracts/0x2043619F63E7123474206d1114d58099d4221A13)
- Deploy tx: [0xfb21fe4c...857e7d](https://explorer-studio.genlayer.com/tx/0xfb21fe4ca2158fc7804baa5a5021e2d3e20ed87daf8a6bfd8a4cadda11857e7d)
- Deployed at: 2026-06-23T15:40:10.766Z
- Smoke writes recorded: 17

## Registry Mechanics

- Primary source: `contracts/canon_v2.py` (43,321 bytes)
- Public write/action methods: 18
- Read methods: 22
- GenLayer features: live web rendering, LLM adjudication, validator-comparative consensus, indexed storage, append-only collections

Typical flow: `create_record` -> `open_review` -> `submit_challenge` -> `review_with_genlayer` -> `resolve_challenge_with_genlayer` -> `open_challenge_window` -> `submit_appeal` -> `archive_record`

Useful reads: `get_record`, `get_work_count`, `get_work`, `get_recent_records`, `get_records_by_status`, `get_records_by_author`, `get_record_by_canon_no`, `get_citation`

The contract is deliberately larger than a one-method demo. It keeps lifecycle state, evidence records and read endpoints so the UI can show real project state instead of static copy.

## Local Review Path

```powershell
cd <private-workspace-root>
npm run preview:start
npm run preview:project -- 19-canon
```

Open http://localhost:8080/19-canon/.

## Smoke Transactions

- set_canon_standard: [0xf0d753bc...6297ac](https://explorer-studio.genlayer.com/tx/0xf0d753bc2a39e899be96452bd62d5c57bffa0493e10a7f06ce7334c3406297ac)
- create_record: [0x360740be...6f0c7d](https://explorer-studio.genlayer.com/tx/0x360740be357a025c672ad4ebf19442617939431df795a7306f3b0be8fc6f0c7d)
- add_citation_docs: [0xbdae1ff5...ac2de2](https://explorer-studio.genlayer.com/tx/0xbdae1ff532d7bd3000f35895f550ff429a911f0de99f0d0532bb1fab11ac2de2)
- add_citation_whitepaper: [0x725f3c65...74bebb](https://explorer-studio.genlayer.com/tx/0x725f3c6508a2fa2d2a8a1a2be0355213eb8715bf79da9c89ea87e3265a74bebb)
- add_citation_security: [0x80bc0573...531030](https://explorer-studio.genlayer.com/tx/0x80bc0573bbfd443d0e61483e6a8260d420559f20de7bcea891619a8e89531030)
- propose_revision: [0x802dee71...aa08d9](https://explorer-studio.genlayer.com/tx/0x802dee7142b5db20b650f06d930d80b23c5b0028324dc30778d451dbfcaa08d9)
- add_contradiction: [0xdae5fb15...4ba60c](https://explorer-studio.genlayer.com/tx/0xdae5fb1585f67bc366f0144366270108b9a1f63d349d9eab4b44956eea4ba60c)
- open_review: [0xbc469c6f...ca0f85](https://explorer-studio.genlayer.com/tx/0xbc469c6fc4d2b5ddc33f01d7657593d68e0a326b6d0e0750a5fdb1cd42ca0f85)

## GitHub And Vercel

```powershell
cd <private-workspace-root>
npm run publish:project -- -Project 19-canon -Repo https://github.com/aspro45/<repo-name>.git
```

Replace `<repo-name>` with the GitHub repository name before publishing.

## Secret Handling

- Private keys and local vault files are not part of this repository.
- Public addresses, contract source, deployment metadata and frontend code are safe to publish.
- Vercel should receive only this project folder, never the workspace dashboard or vault data.
