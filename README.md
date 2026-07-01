# Canon

Canonical records for source-backed facts and revisions.

Canon treats a fact record like a living registry entry. Citations, contradictions and proposed revisions are stored with the record before GenLayer decides whether the entry should become canonical.

## Review Links

| Surface | Link |
| --- | --- |
| Live app | https://assmore22-canon.vercel.app |
| GitHub | https://github.com/assmore22/canon |
| Contract | https://explorer-studio.genlayer.com/contracts/0x2043619F63E7123474206d1114d58099d4221A13 |

## Chain Record

- Network: GenLayer Studionet
- Chain ID: 61999
- Contract: `0x2043619F63E7123474206d1114d58099d4221A13`
- Deploy transaction: [0xfb21fe4c...857e7d](https://explorer-studio.genlayer.com/tx/0xfb21fe4ca2158fc7804baa5a5021e2d3e20ed87daf8a6bfd8a4cadda11857e7d)
- Deployed: `2026-06-23T15:40:10.766Z`
- Source: `contracts/canon_v2.py` (43,321 bytes)

## Protocol Path

1. Create a record.
2. Attach citations.
3. Propose a revision or contradiction.
4. Open review.
5. Seal the accepted version.

The frontend reads record counts, revision lists, citation lists and canonical status views. Contract state is public; write actions still require a connected wallet on GenLayer Studionet.

## Finalized Smoke

| Action | Transaction |
| --- | --- |
| `set_canon_standard` | [0xf0d753bc...6297ac](https://explorer-studio.genlayer.com/tx/0xf0d753bc2a39e899be96452bd62d5c57bffa0493e10a7f06ce7334c3406297ac) |
| `create_record` | [0x360740be...6f0c7d](https://explorer-studio.genlayer.com/tx/0x360740be357a025c672ad4ebf19442617939431df795a7306f3b0be8fc6f0c7d) |
| `add_citation_docs` | [0xbdae1ff5...ac2de2](https://explorer-studio.genlayer.com/tx/0xbdae1ff532d7bd3000f35895f550ff429a911f0de99f0d0532bb1fab11ac2de2) |
| `add_citation_whitepaper` | [0x725f3c65...74bebb](https://explorer-studio.genlayer.com/tx/0x725f3c6508a2fa2d2a8a1a2be0355213eb8715bf79da9c89ea87e3265a74bebb) |
| `add_citation_security` | [0x80bc0573...531030](https://explorer-studio.genlayer.com/tx/0x80bc0573bbfd443d0e61483e6a8260d420559f20de7bcea891619a8e89531030) |
| `propose_revision` | [0x802dee71...aa08d9](https://explorer-studio.genlayer.com/tx/0x802dee7142b5db20b650f06d930d80b23c5b0028324dc30778d451dbfcaa08d9) |

## Local Run

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Release Hygiene

The public package is static and has no install step. Vercel receives only frontend, contract source and public deployment metadata.

Keep wallet private keys, vault exports, `.env` files, Vercel project state and dashboard data out of Git. This repository is for public source, UI, tests and deployment receipts only.
