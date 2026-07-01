# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""
CANON - On-Chain Priority & Authorship Registry
================================================
Creators register a work by citing the public URL where it is published, who
authored it, and what it is. To seal it, the contract reads that source and a
validator set agrees (Equivalence Principle) whether the page genuinely hosts
the described work as claimed. Sealed works receive a permanent canon number and
an on-chain record of authorship and priority - a notarization anyone can verify
and nobody can backdate. Unconfirmed claims are rejected with a reason.

Status:  PENDING(0) -> SEALED(1) | REJECTED(2)
"""

from genlayer import *
from dataclasses import dataclass
import json
import typing


W_PENDING = 0
W_SEALED = 1
W_REJECTED = 2


@allow_storage
@dataclass
class Work:
    author: Address
    title: str
    work_url: str
    description: str
    status: u8
    rationale: str
    canon_no: u256


class Canon(gl.Contract):
    works: DynArray[Work]
    sealed_total: u256

    def __init__(self) -> None:
        self.sealed_total = u256(0)

    @gl.public.write
    def register(self, title: str, work_url: str, description: str) -> int:
        if len(title.strip()) == 0:
            raise gl.vm.UserError("a title is required")
        if len(work_url.strip()) == 0:
            raise gl.vm.UserError("a work URL is required")
        if len(description.strip()) == 0:
            raise gl.vm.UserError("a description is required")
        w = self.works.append_new_get()
        w.author = gl.message.sender_address
        w.title = title
        w.work_url = work_url
        w.description = description
        w.status = u8(W_PENDING)
        w.rationale = ""
        w.canon_no = u256(0)
        return len(self.works) - 1

    @gl.public.write
    def seal(self, work_id: int) -> None:
        """Read the cited source; validators agree whether it genuinely hosts the
        described work. If so, the work is sealed with a canon number."""
        w = self._get(work_id)
        if w.status != W_PENDING:
            raise gl.vm.UserError("work already processed")

        title = w.title
        desc = w.description
        url = w.work_url

        def leader_fn() -> str:
            page = ""
            try:
                page = gl.nondet.web.get(url).body.decode("utf-8")[:6000]
            except Exception:
                page = "(work page unreachable)"
            prompt = (
                f"Claimed work title: {title}\n"
                f"What it should be: {desc}\n\n"
                f"Page content at the cited URL:\n{page}\n\n"
                "Judge strictly on the page. Does this page genuinely host or "
                "contain the described work, consistent with the claim? Reply with "
                "ONLY JSON: {\"authentic\": true} if it does, {\"authentic\": false} "
                "if it does not, plus a short \"reason\"."
            )
            return gl.nondet.exec_prompt(prompt)

        def validator_fn(leader_res) -> bool:
            if not isinstance(leader_res, gl.vm.Return):
                return False
            return self._decision_of(leader_res.calldata)[0] == self._decision_of(leader_fn())[0]

        result = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
        authentic, reason = self._decision_of(result)
        w.rationale = reason[:300]
        if authentic:
            self.sealed_total = self.sealed_total + u256(1)
            w.canon_no = self.sealed_total
            w.status = u8(W_SEALED)
        else:
            w.status = u8(W_REJECTED)

    # ------------------------------------------------------------------ views
    @gl.public.view
    def get_work_count(self) -> int:
        return len(self.works)

    @gl.public.view
    def get_work(self, work_id: int) -> dict:
        w = self._get(work_id)
        return {
            "author": w.author.as_hex,
            "title": w.title,
            "work_url": w.work_url,
            "description": w.description,
            "status": int(w.status),
            "rationale": w.rationale,
            "canon_no": int(w.canon_no),
        }

    @gl.public.view
    def sealed_count(self) -> int:
        return int(self.sealed_total)

    # -------------------------------------------------------------- internals
    def _get(self, work_id: int) -> Work:
        if work_id < 0 or work_id >= len(self.works):
            raise gl.vm.UserError("no such work")
        return self.works[work_id]

    def _decision_of(self, result: typing.Any) -> tuple:
        data = result
        if isinstance(data, str):
            data = self._extract_json(data)
        if not isinstance(data, dict):
            return (False, "")
        raw = data.get("authentic", None)
        reason = str(data.get("reason", ""))
        if isinstance(raw, bool):
            return (raw, reason)
        if isinstance(raw, str):
            return (raw.strip().lower() == "true", reason)
        return (False, reason)

    def _extract_json(self, text: str) -> typing.Any:
        try:
            return json.loads(text)
        except (ValueError, TypeError):
            pass
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start:end + 1])
            except (ValueError, TypeError):
                return None
        return None
