"""
Turns the white-background product photos in public/img/products/{id}.jpg into
transparent PNG cutouts at public/img/products/{id}.png so the site can place
them on tinted backgrounds without any blend-mode tricks (which tint white
bottles). Dark products also keep a soft, semi-transparent contact shadow.

Run:  python3 scripts/cutout-products.py           (needs Pillow, numpy, scipy)
"""
from collections import deque
import glob
import os

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = "public/img/products"
# Products photographed as dark packaging (safe to keep a soft shadow pass).
DARK = {"38403", "38421", "38422", "38423", "38424", "38425", "40040", "41152", "41158", "42263", "21988"}


def flood(near: np.ndarray, inset: int) -> np.ndarray:
    """Background = near-white pixels reachable from an inset border ring."""
    h, w = near.shape
    mask = np.zeros((h, w), bool)
    q: deque = deque()
    seeds = (
        [(inset, x) for x in range(w)] + [(h - 1 - inset, x) for x in range(w)]
        + [(y, inset) for y in range(h)] + [(y, w - 1 - inset) for y in range(h)]
    )
    for y, x in seeds:
        if near[y, x] and not mask[y, x]:
            mask[y, x] = True
            q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and not mask[ny, nx] and near[ny, nx]:
                mask[ny, nx] = True
                q.append((ny, nx))
    mask[: inset + 1, :] = True
    mask[-inset - 1 :, :] = True
    mask[:, : inset + 1] = True
    mask[:, -inset - 1 :] = True
    return mask


def fill_gaps(fg: np.ndarray, mn: np.ndarray, maxgap_row: int, maxgap_col: int, bright=170) -> np.ndarray:
    """Close narrow background intrusions bounded by light runs on both sides
    (white-bottle highlights that match the backdrop). Runs must be light on
    average so gaps next to dark parts (spray triggers, pumps) stay open."""
    fg = fg.copy()
    for arr, br, maxgap in ((fg, mn, maxgap_row), (fg.T, mn.T, maxgap_col)):
        for i in range(arr.shape[0]):
            row, b = arr[i], br[i]
            idx = np.flatnonzero(np.diff(np.concatenate(([0], row.astype(np.int8), [0]))))
            starts, ends = idx[0::2], idx[1::2]
            for k in range(len(starts) - 1):
                gap = starts[k + 1] - ends[k]
                if 0 < gap < maxgap:
                    la = b[starts[k] : ends[k]].mean()
                    rb = b[starts[k + 1] : ends[k + 1]].mean()
                    if la > bright and rb > bright:
                        row[ends[k] : starts[k + 1]] = True
    return fg


def drop_dark_bounded_holes(fg: np.ndarray, near: np.ndarray, mn: np.ndarray, min_area=300) -> np.ndarray:
    """Enclosed near-white pockets (e.g. inside a spray trigger) whose border is
    mostly dark are background, not product."""
    holes = near & fg
    labels, n = ndimage.label(holes)
    if n == 0:
        return fg
    fg = fg.copy()
    for i in range(1, n + 1):
        comp = labels == i
        if comp.sum() < min_area:
            continue
        ring = ndimage.binary_dilation(comp, iterations=3) & ~comp
        if ring.any() and (mn[ring] < 110).mean() > 0.6:
            fg[comp] = False
    return fg


def cutout(path: str, tol=12, tol2=34, inset=4) -> Image.Image:
    pid = os.path.basename(path).split(".")[0]
    a = np.array(Image.open(path).convert("RGB")).astype(np.int16)
    h, w, _ = a.shape
    mn = a.min(axis=2)
    near = mn >= 255 - tol
    m1 = flood(near, inset)
    fg = ~m1
    if pid not in DARK:
        fg = fill_gaps(fg, mn, 200, 60)
        fg = fill_gaps(fg, mn, 200, 60)
    fg = drop_dark_bounded_holes(fg, near, mn)
    fgi = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    fg = np.array(fgi) > 127
    fg[: inset + 1, :] = False
    fg[-inset - 1 :, :] = False
    fg[:, : inset + 1] = False
    fg[:, -inset - 1 :] = False
    alpha = np.where(fg, 255, 0).astype(np.uint8)
    rgb = a.astype(np.uint8).copy()
    if pid in DARK:
        m2 = flood(mn >= 255 - tol2, inset)
        soft = m2 & ~m1 & ~fg
        t = np.clip((255 - tol - mn) / (tol2 - tol), 0, 1)
        alpha[soft] = (t[soft] * 150).astype(np.uint8)
        rgb[soft] = (40, 35, 30)
    al = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.7))
    return Image.fromarray(np.dstack([rgb, np.array(al)]), "RGBA")


if __name__ == "__main__":
    for f in sorted(glob.glob(f"{SRC}/*.jpg")):
        out = cutout(f)
        dest = f[:-4] + ".png"
        out.save(dest, optimize=True)
        print(dest, os.path.getsize(dest) // 1024, "KB")
