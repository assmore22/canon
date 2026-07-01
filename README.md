# Canon

Canonical records for source-backed facts and revisions.

Canon treats a fact record like a living registry entry. Citations, contradictions and proposed revisions are stored with the record before GenLayer decides whether the entry should become canonical.

## Review Links

| Surface | Link |
| --- | --- |
| Live app | https://assmore22-canon.vercel.app |
| GitHub | https://github.com/assmore22/canon |
| Contract | https://explorer-bradbury.genlayer.com/address/0x4BF07B4F4B2ba811adDaDD716fCf061D53903f44 |

## Chain Record

- Network: GenLayer Bradbury
- Chain ID: 4221
- Contract: `0x4BF07B4F4B2ba811adDaDD716fCf061D53903f44`
- Deploy transaction: [0xcec61239...605043](https://explorer-bradbury.genlayer.com/tx/0xcec6123953c342a667a57f8b7c9f3fd6f58e0877aba13cbd0d13aa2269605043)
- Deployed: `2026-07-01T15:43:46.471Z`
- Source: `contracts/canon_v2.py` (43,321 bytes)

## Protocol Path

1. Create a record.
2. Attach citations.
3. Propose a revision or contradiction.
4. Open review.
5. Seal the accepted version.

The frontend reads record counts, revision lists, citation lists and canonical status views. Contract state is public; write actions still require a connected wallet on GenLayer Bradbury.

## Bradbury Smoke

| Action | Transaction |
| --- | --- |
| `create_record` | [0x7f194204...f87633](https://explorer-bradbury.genlayer.com/tx/0x7f194204dd34c5548ad2b30fb6004f861750f6460c5d8f92d014fd9a6df87633) |

Read verification passed on Bradbury after deploy. The public app points at this contract address and reads accepted state.

## Local Run

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Release Hygiene

The public package is static and has no install step. Vercel receives only frontend, contract source and public deployment metadata.

Keep wallet private keys, vault exports, `.env` files, Vercel project state and dashboard data out of Git. This repository is for public source, UI, tests and deployment receipts only.
