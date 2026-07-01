"""Tests for CANON (direct runner). AI seal() validated live on studionet."""
from pathlib import Path

CONTRACT = str(Path(__file__).resolve().parents[1] / "contracts" / "canon.py")
W_PENDING = 0; W_SEALED = 1; W_REJECTED = 2


def _reg(c, vm, who, title="My poem", url="https://example.com", desc="An original poem"):
    vm.sender = who
    return c.register(title, url, desc)


def test_register(deploy, direct_vm, direct_alice):
    c = deploy(CONTRACT)
    wid = _reg(c, direct_vm, direct_alice)
    assert wid == 0
    w = c.get_work(0)
    assert w["status"] == W_PENDING
    assert w["canon_no"] == 0
    assert w["title"] == "My poem"


def test_register_requires_title(deploy, direct_vm, direct_alice):
    c = deploy(CONTRACT)
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("a title is required"):
        c.register("", "https://x.com", "d")


def test_register_requires_url(deploy, direct_vm, direct_alice):
    c = deploy(CONTRACT)
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("a work URL is required"):
        c.register("t", "", "d")


def test_register_requires_desc(deploy, direct_vm, direct_alice):
    c = deploy(CONTRACT)
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("a description is required"):
        c.register("t", "https://x.com", "")


def test_seal_bad_id(deploy, direct_vm, direct_alice):
    c = deploy(CONTRACT)
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("no such work"):
        c.seal(0)


def test_sealed_count_zero(deploy, direct_vm, direct_alice):
    c = deploy(CONTRACT)
    _reg(c, direct_vm, direct_alice)
    assert c.sealed_count() == 0


def test_multiple(deploy, direct_vm, direct_alice):
    c = deploy(CONTRACT)
    _reg(c, direct_vm, direct_alice, title="Work A")
    _reg(c, direct_vm, direct_alice, title="Work B")
    assert c.get_work_count() == 2
    assert c.get_work(1)["title"] == "Work B"
