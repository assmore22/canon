"""Seed CANON with real on-chain data on studionet."""
from pathlib import Path

from gltest_cli.config.general import get_general_config
from gltest_cli.config.user import load_user_config
from gltest import get_contract_factory, get_default_account

ROOT = Path(__file__).resolve().parents[1]
ADDR = "0x501c55CC99333B89AD0D7344E0351753179fB21D"
URL = "https://example.com"

cfg = load_user_config(str(ROOT / "gltest.config.yaml"))
get_general_config().user_config = cfg
c = get_contract_factory(contract_file_path=str(ROOT / "contracts" / "canon.py")).build_contract(
    ADDR, account=get_default_account())

WORKS = [
    ("The Example Domain notice", URL,
     "The reserved-domain notice published at example.com stating the domain is for use in illustrative examples in documents, with a link to more information."),
    ("Embergard - a fantasy novel", URL,
     "The full 320-page manuscript of an original epic fantasy novel titled Embergard."),
]


def main():
    if c.get_work_count().call() == 0:
        for (title, url, desc) in WORKS:
            c.register(args=[title, url, desc]).transact()
            print("registered:", title)
    for wid in range(c.get_work_count().call()):
        w = c.get_work(args=[wid]).call()
        if int(w["status"]) == 0:
            print("sealing", wid, "(AI)...")
            try:
                c.seal(args=[wid]).transact()
            except Exception as e:
                print("seal", wid, "->", e)
    for wid in range(c.get_work_count().call()):
        w = c.get_work(args=[wid]).call()
        print(wid, ["PENDING", "SEALED", "REJECTED"][int(w["status"])], "canon#", w["canon_no"], "|", (w["rationale"] or "")[:56])
    print("sealed_count=", c.sealed_count().call())


if __name__ == "__main__":
    main()
