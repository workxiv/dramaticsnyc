#!/usr/bin/env python3
"""
Give a clean product cutout (transparent PNG, no baked-in shadow) the same soft
floor shadow the Ocean Beach Sea Salt Spray photo (42263.png) has: the base
ellipse of the product, pushed to the lower left and heavily blurred, so most of
it peeks out on the left of the base with a little under the bottom edge.

Usage:
  python3 scripts/product-shadows.py <cutout.png> <out.png>

Only run this on cutouts WITHOUT an existing shadow. Products whose original
photo already carries a real shadow (the Healthy Color line, Quantum Leap,
Forever Young, Color Protect Shampoo) are left untouched.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

SHADOW_RGB = (50, 46, 43)   # sampled from 42263.png
PEAK_ALPHA = 0.55           # centre of the ellipse (42263 peaks ~0.43 next to the body)


def add_shadow(src: str, dst: str) -> None:
    im = Image.open(src).convert("RGBA")
    alpha = np.array(im)[..., 3]
    ys, xs = np.where(alpha > 128)
    top, bottom = ys.min(), ys.max()
    h = bottom - top + 1

    # base span: widest rows in the bottom 5% of the body
    base_rows = alpha[bottom - int(h * 0.05):bottom + 1]
    cols = np.where(base_rows.max(axis=0) > 128)[0]
    bl, br = cols.min(), cols.max()
    bw = br - bl + 1
    cx = (bl + br) / 2

    # Ocean Beach proportions (bottle 250 wide, 916 tall):
    # shadow reaches ~0.44 bw left of the body, spans ~0.055 h vertically,
    # sits mostly above the bottom edge with ~0.012 h showing below it.
    ew = 1.0 * bw                    # ellipse width
    eh = max(24, 0.055 * h)          # ellipse height
    ecx = cx - 0.42 * bw             # pushed left
    ecy = bottom - 0.28 * eh         # a little below the base line
    blur = float(max(6, 0.014 * h))

    pad = int(0.6 * bw + blur * 4)
    W, H = im.width + pad, im.height + int(blur * 4)
    yy, xx = np.mgrid[0:H, 0:W]
    r2 = ((xx - (ecx + pad)) / (ew / 2)) ** 2 + ((yy - ecy) / (eh / 2)) ** 2
    sh = np.clip(1 - r2, 0, 1) ** 0.7 * PEAK_ALPHA
    mask = Image.fromarray((sh * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(blur))

    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    layer = Image.new("RGBA", (W, H), SHADOW_RGB + (255,))
    layer.putalpha(mask)
    out.alpha_composite(layer)
    out.alpha_composite(im, (pad, 0))

    oa = np.array(out)[..., 3]
    ys, xs = np.where(oa > 2)
    p = 16
    out = out.crop((max(0, xs.min() - p), max(0, ys.min() - p),
                    min(W, xs.max() + p + 1), min(H, ys.max() + p + 1)))
    out.save(dst, optimize=True)


if __name__ == "__main__":
    add_shadow(sys.argv[1], sys.argv[2])
