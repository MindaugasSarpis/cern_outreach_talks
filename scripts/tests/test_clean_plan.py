"""Unit tests for the pure videos:clean planner (no network, no filesystem).

Run from the repo root:  python3 -m unittest discover scripts/tests
"""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from videos import LocalFile, VideoEntry, plan_clean, reclaimed_bytes  # noqa: E402


def lf(size: int, ino: int = 1, nlink: int = 1) -> LocalFile:
    return LocalFile(size=size, inode=(0, ino), nlink=nlink)


def entry(name: str, **kw) -> VideoEntry:
    return VideoEntry(name=name, profile=kw.pop("profile", "standard"), used_in=[], **kw)


def verdicts(plan):
    return {(c.tier, c.name): c.delete for c in plan}


class PlanCleanTest(unittest.TestCase):
    def test_raw_deletable_only_on_size_match(self):
        talk = {"a.mp4": entry("a.mp4"), "b.mp4": entry("b.mp4"), "c.mp4": entry("c.mp4")}
        plan = plan_clean(
            {"raw": {"a.mp4": lf(100), "b.mp4": lf(100), "c.mp4": lf(100)}},
            talk, {},
            {"raw_remote": {"a.mp4": 100, "b.mp4": 999}},  # c missing entirely
            include_shared=False,
        )
        v = verdicts(plan)
        self.assertTrue(v[("raw", "a.mp4")])
        self.assertFalse(v[("raw", "b.mp4")])   # size mismatch
        self.assertFalse(v[("raw", "c.mp4")])   # not on remote

    def test_unavailable_inventory_blocks_deletion(self):
        talk = {"a.mp4": entry("a.mp4")}
        plan = plan_clean(
            {"raw": {"a.mp4": lf(100)}}, talk, {},
            {"raw_remote": None},  # rclone failed — absence of proof, not proof of absence
            include_shared=False,
        )
        self.assertFalse(plan[0].delete)
        self.assertIn("unavailable", plan[0].reason)

    def test_hq_from_raw_verifies_against_source_remote(self):
        talk = {"m.mov": entry("m.mov", hq_from_raw=True)}
        plan = plan_clean(
            {"hq": {"m.mov": lf(500)}}, talk, {},
            {"raw_remote": {"m.mov": 500}, "hq_release": {}},
            include_shared=False,
        )
        self.assertTrue(plan[0].delete)
        self.assertIn("source_remote", plan[0].reason)

    def test_hq_talk_owned_needs_hq_release(self):
        talk = {"m.mov": entry("m.mov")}
        plan = plan_clean(
            {"hq": {"m.mov": lf(500)}}, talk, {},
            {"raw_remote": {"m.mov": 500}, "hq_release": {}},  # published? no.
            include_shared=False,
        )
        self.assertFalse(plan[0].delete)

    def test_shared_clips_need_opt_in(self):
        shared = {"s.mp4": entry("s.mp4")}
        inv = {"shared_web_release": {"s.mp4": 100}, "web_release": {}}
        keep = plan_clean({"web": {"s.mp4": lf(100)}}, {}, shared, inv, include_shared=False)
        self.assertFalse(keep[0].delete)
        self.assertIn("--include-shared", keep[0].reason)
        go = plan_clean({"web": {"s.mp4": lf(100)}}, {}, shared, inv, include_shared=True)
        self.assertTrue(go[0].delete)

    def test_shared_raws_never_deleted(self):
        shared = {"s.mp4": entry("s.mp4")}
        plan = plan_clean(
            {"raw": {"s.mp4": lf(100)}}, {}, shared,
            {"raw_remote": {"s.mp4": 100}, "shared_raw_remote": {"s.mp4": 100}},
            include_shared=True,
        )
        self.assertFalse(plan[0].delete)

    def test_unmanaged_files_untouched(self):
        plan = plan_clean(
            {"raw": {"random.mp4": lf(1)}, "hq": {"random.mp4": lf(1)}, "web": {"random.mp4": lf(1)}},
            {}, {}, {"raw_remote": {"random.mp4": 1}, "hq_release": {"random.mp4": 1}, "web_release": {"random.mp4": 1}},
            include_shared=True,
        )
        self.assertFalse(any(c.delete for c in plan))

    def test_talk_entry_wins_over_shared_duplicate(self):
        # A talk override of a shared clip is judged as talk-owned.
        talk = {"dup.mp4": entry("dup.mp4")}
        shared = {"dup.mp4": entry("dup.mp4")}
        plan = plan_clean(
            {"web": {"dup.mp4": lf(100)}}, talk, shared,
            {"web_release": {"dup.mp4": 100}, "shared_web_release": {}},
            include_shared=False,
        )
        self.assertTrue(plan[0].delete)
        self.assertIn("videos:pull", plan[0].reason)


class ReclaimedBytesTest(unittest.TestCase):
    def _cand(self, tier, name, file, delete=True):
        from videos import CleanCandidate
        return CleanCandidate(tier=tier, name=name, file=file, delete=delete, reason="")

    def test_hard_link_counted_once_when_both_links_planned(self):
        shared_inode = LocalFile(size=500, inode=(0, 7), nlink=2)
        cands = [
            self._cand("raw", "m.mov", shared_inode),
            self._cand("hq", "m.mov", shared_inode),
        ]
        self.assertEqual(reclaimed_bytes(cands), 500)

    def test_hard_link_frees_nothing_when_other_link_stays(self):
        shared_inode = LocalFile(size=500, inode=(0, 7), nlink=2)
        cands = [self._cand("hq", "m.mov", shared_inode)]  # raw link stays
        self.assertEqual(reclaimed_bytes(cands), 0)

    def test_plain_files_sum(self):
        cands = [
            self._cand("raw", "a.mp4", lf(100, ino=1)),
            self._cand("web", "b.mp4", lf(50, ino=2)),
            self._cand("web", "kept.mp4", lf(999, ino=3), delete=False),
        ]
        self.assertEqual(reclaimed_bytes(cands), 150)


if __name__ == "__main__":
    unittest.main()
