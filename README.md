# Canon

Canonical records for source-backed facts and revisions.

Canon treats a fact record like a living registry entry. Citations, contradictions and proposed revisions are stored with the record before GenLayer decides whether the entry should become canonical.

## Review Links

| Surface | Link |
| --- | --- |
| Live app | https://assmore22-canon.vercel.app |
| GitHub | https://github.com/assmore22/canon |
| Contract | https://explorer-bradbury.genlayer.com/address/0xF8b6C5333345c1C6BE403B1c6248a31fd4CAd337 |

## Chain Record

- Network: GenLayer Bradbury
- Chain ID: 4221
- Contract: `0xF8b6C5333345c1C6BE403B1c6248a31fd4CAd337`
- Deployer: `0x07A12871217d82ADE643Ef8c4EfC27e14F10A649`
- Deploy transaction: [0x7c948afa...7599ab](https://explorer-bradbury.genlayer.com/tx/0x7c948afae715a864d496fc2bf868df0b166ecf1236728bf6c8faabd4b27599ab)
- Deployed: `2026-07-26T19:33:58.763Z`
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
| `create_record` | [0x42ad20c9...3646e6](https://explorer-bradbury.genlayer.com/tx/0x42ad20c988b79876bd67d25c6002bce7d9520dc75d0e789f3154a65f743646e6) |

The deployment and domain smoke transaction are finalized on Bradbury. The public app is pinned to this contract address.

## Local Run

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Release Hygiene

The public package is static and has no install step. Vercel receives only frontend, contract source and public deployment metadata.

Keep wallet private keys, vault exports, `.env` files, Vercel project state and dashboard data out of Git. This repository is for public source, UI, tests and deployment receipts only.
