#!/usr/bin/env python3
"""
Give a clean product cutout (transparent PNG, no baked-in shadow) the same soft,
angled floor shadow the Ocean Beach Sea Salt Spray photo (42263.png) has: a dark,
blurred wedge hugging the base and stretching to the lower left.

Usage:
  python3 scripts/product-shadows.py <cutout.png> <out.png>

Only run this on cutouts WITHOUT an existing shadow (the Dramatics NYC white
products were re-cut with a background remover first). The Healthy Color
products already carry their original photographed shadow and are left alone.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

SHADOW_RGB = (50, 46, 43)   # sampled from 42263.png
PEAK_ALPHA = 0.5           # next to the base
FAR_ALPHA = 0.10            # at the far tip
BLUR = 9


def add_shadow(src: str, dst: str) -> None:
    im = Image.open(src).convert("RGBA")
    a = np.array(im)
    alpha = a[..., 3]
    ys, xs = np.where(alpha > 128)
    top, bottom, left, right = ys.min(), ys.max(), xs.min(), xs.max()
    h, w = bottom - top + 1, right - left + 1

    # base span: widest rows in the bottom 6% of the body
    base_rows = alpha[bottom - int(h * 0.06):bottom + 1]
    cols = np.where(base_rows.max(axis=0) > 128)[0]
    bl, br = cols.min(), cols.max()
    bw = br - bl + 1

    # Ocean Beach proportions: the shadow is the base of the silhouette sheared
    # to the lower left: no offset at the top of the band, ~0.44 of the base
    # width at the bottom (capped by height so wide jars stay sane), band
    # ~0.05 of the height tall, alpha strongest against the body.
    ext = int(min(0.44 * bw, 0.2 * h))
    band = max(18, int(h * 0.05))
    drop = max(4, int(h * 0.01))
    pad = ext + BLUR * 4
    W, H = im.width + pad, im.height + BLUR * 4

    body = alpha > 128
    sh = np.zeros((H, W), dtype=np.float32)
    for y in range(bottom - band, bottom + drop + 1):
        sy = min(y, bottom)                       # rows below the base reuse it
        t = 1 - (bottom - sy) / band              # 0 at top of band, 1 at base
        off = int(ext * t)
        row = body[sy]
        xs_row = np.where(row)[0]
        if len(xs_row) == 0:
            continue
        xl = xs_row.min()
        # shifted silhouette row, alpha fading with distance from the body edge
        for x in range(xl - off, xl + int(0.6 * bw)):
            if x < 0 or x + off >= im.width or not row[min(im.width - 1, x + off)]:
                continue
            d = max(0, xl - x) / max(1, ext)
            wy = 0.45 + 0.55 * t
            sh[y, x + pad] = (PEAK_ALPHA - (PEAK_ALPHA - FAR_ALPHA) * d) * wy
    mask = Image.fromarray((sh * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(BLUR))

    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    layer = Image.new("RGBA", (W, H), SHADOW_RGB + (255,))
    layer.putalpha(mask)
    out.alpha_composite(layer)
    out.alpha_composite(im, (pad, 0))

    # trim to content with a small pad
    oa = np.array(out)[..., 3]
    ys, xs = np.where(oa > 2)
    p = 16
    out = out.crop((max(0, xs.min() - p), max(0, ys.min() - p),
                    min(W, xs.max() + p + 1), min(H, ys.max() + p + 1)))
    out.save(dst, optimize=True)


if __name__ == "__main__":
    add_shadow(sys.argv[1], sys.argv[2])
