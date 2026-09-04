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
# Dark products with a pale part below the dark body that is product, not shadow
# (Dutch Treat's white pump base). Everything else pale under the base is shadow.
PALE_BASE = {"40042"}


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

    # ---- contact shadow → soft transparent shadow ----
    if pid in DARK:
        # Body = clearly bright or dark pixels (label text holes filled). Mid-grey
        # pixels outside it near the base are the backdrop's contact shadow.
        core = ndimage.binary_closing(mn < 90, iterations=6)
        core = ndimage.binary_fill_holes(core) & fg
        body = core.copy()
        # Keep large bright parts that belong to the product (e.g. a white
        # pump base) but not small bright patches of backdrop near the base.
        cols = np.flatnonzero(core.any(axis=0))
        c0, c1 = (int(cols.min()), int(cols.max())) if cols.size else (0, w)
        core_w = c1 - c0
        labels, n = ndimage.label(fg & (mn >= 220) & ~core) if pid in PALE_BASE else (np.zeros_like(fg, dtype=int), 0)
        touch = ndimage.binary_dilation(core, iterations=3)
        for i in range(1, n + 1):
            comp = labels == i
            if comp.sum() < 2500 or not (comp & touch).any():
                continue
            ccols = np.flatnonzero(comp.any(axis=0))
            wide_enough = (ccols.max() - ccols.min()) >= 0.4 * core_w
            # a real product part sits within the product's own column span;
            # backdrop highlights spill out sideways
            inside = ccols.min() >= c0 - 6 and ccols.max() <= c1 + 6
            if wide_enough and inside:
                body |= comp
        body = ndimage.binary_fill_holes(ndimage.binary_closing(body, iterations=3)) & fg
        # below the dark body nothing outside its column span is product
        crow = np.flatnonzero(core.any(axis=1))
        if crow.size:
            body[crow.max() + 1 :, : max(0, c0 - 4)] = False
            body[crow.max() + 1 :, c1 + 5 :] = False
        rows = np.flatnonzero(body.any(axis=1))
        base = int(rows.max()) if rows.size else h
        zone = np.zeros_like(fg)
        zone[max(0, base - 140) :, :] = True
        shadow = fg & ~body & zone
    else:
        # White packaging is the same brightness as its shadow, so use geometry:
        # the body keeps a constant width row after row; the shadow below it
        # spreads wider then tapers. Base = last row still at body width.
        widths = fg.sum(axis=1)
        valid = np.flatnonzero(widths > 0)
        base = h
        if valid.size:
            lo = valid[int(valid.size * 0.6)]
            band = widths[lo : valid.max() + 1]
            band = band[band > 0]
            body_w = int(np.median(band))
            for y in range(valid.max(), lo, -1):
                if abs(int(widths[y]) - body_w) <= max(6, int(body_w * 0.03)):
                    base = y
                    break
        shadow = fg.copy()
        shadow[: base + 1, :] = False
    strength = np.clip((255 - mn) / (255 - 150), 0, 1)
    strength[~shadow] = 0
    strength = ndimage.gaussian_filter(strength.astype(np.float32), 5)
    sh_alpha = np.clip(strength * 170, 0, 110).astype(np.uint8)
    alpha[shadow] = sh_alpha[shadow]
    rgb[shadow] = (40, 35, 30)
    if pid in DARK:
        m2 = flood(mn >= 255 - tol2, inset)
        soft = m2 & ~m1 & ~fg
        t = np.clip((255 - tol - mn) / (tol2 - tol), 0, 1)
        alpha[soft] = np.minimum((t[soft] * 140), 110).astype(np.uint8)
        rgb[soft] = (40, 35, 30)

    # ---- edge decontamination: kill the white fringe left by the backdrop ----
    solid = alpha == 255
    inner = ndimage.binary_erosion(solid, iterations=3)
    rim = solid & ~inner
    fringe = rim & (mn >= 232)
    alpha[fringe] = 0
    rim2 = ndimage.binary_erosion(solid, iterations=1) & ~ndimage.binary_erosion(solid, iterations=2)
    alpha[rim2 & (mn >= 232)] = 90
    al = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.8))
    return Image.fromarray(np.dstack([rgb, np.array(al)]), "RGBA")


if __name__ == "__main__":
    for f in sorted(glob.glob(f"{SRC}/*.jpg")):
        out = cutout(f)
        dest = f[:-4] + ".png"
        out.save(dest, optimize=True)
        print(dest, os.path.getsize(dest) // 1024, "KB")
