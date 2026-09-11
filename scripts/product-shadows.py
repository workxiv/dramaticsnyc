#!/usr/bin/env python3
"""
Product cutout shadows, matched to the photographed shadow on the Healthy Color
line (Diesel Hayes 38421.png, Ocean Beach 42263.png): the product's footprint
ellipse cast to the lower left, soft, dark, strongest against the body.

Usage:
  python3 scripts/product-shadows.py strip <in.png> <out.png>   # remove baked shadow
  python3 scripts/product-shadows.py shadow <in.png> <out.png>  # add the house shadow
  python3 scripts/product-shadows.py measure <in.png>           # print shadow geometry

Measured on the reference photos (1024px): the shadow is offset left by about
0.13 of the product height and down by about 0.02, the footprint ellipse is
about 0.4 as tall as it is wide (camera slightly above), peak alpha about 0.43,
color about (50, 46, 43).
"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import binary_fill_holes, binary_dilation, label

SHADOW_RGB = (50, 46, 43)
PEAK_ALPHA = 0.50
LEFT = 0.125     # of body height
DOWN = 0.01      # of body height
FOOT = 0.40      # footprint ellipse height / width
BLUR = 0.012     # of body height


def body_mask(alpha: np.ndarray) -> np.ndarray:
    solid = binary_fill_holes(alpha >= 250)
    lab, n = label(solid)
    if n == 0:
        return alpha > 128
    sizes = np.bincount(lab.ravel())
    sizes[0] = 0
    return lab == sizes.argmax()


def strip(src: str, dst: str) -> None:
    """Keep the solid product (plus its 2px anti-aliased edge); drop any
    semi-transparent baked-in shadow around it."""
    im = Image.open(src).convert("RGBA")
    a = np.array(im)
    alpha = a[..., 3]
    core = body_mask(alpha)
    keep = binary_dilation(core, iterations=2)
    # feathered product pixels that blend into the shadow: keep anything whose
    # colour is clearly not the shadow colour, as long as it touches the body
    rgb = a[..., :3].astype(int)
    dist = np.abs(rgb - np.array(SHADOW_RGB)).sum(axis=2)
    candidate = (alpha > 0) & (dist > 90)
    grown = candidate & binary_dilation(core, iterations=12)
    keep |= grown
    a[..., 3] = np.where(keep, alpha, 0)
    Image.fromarray(a).save(dst, optimize=True)


def shadow(src: str, dst: str) -> None:
    im = Image.open(src).convert("RGBA")
    alpha = np.array(im)[..., 3]
    body = body_mask(alpha)
    ys, xs = np.where(body)
    top, bottom = ys.min(), ys.max()
    h = bottom - top + 1

    base_rows = body[bottom - int(h * 0.06):bottom + 1]
    cols = np.where(base_rows.any(axis=0))[0]
    bl, br = cols.min(), cols.max()
    bw = br - bl + 1
    cx = (bl + br) / 2

    # The shadow runs from LEFT*h beyond the base's left edge to just past its
    # right edge, and hangs DOWN*h below the base line, so the product sits on
    # it instead of floating next to it.
    # Cast toward 10 o'clock, like Ocean Beach and Diesel Hayes: the footprint
    # ellipse sits with its bottom edge on the base line and rises up the left
    # side of the product, so what shows is a crescent climbing the lower-left,
    # not a pool underneath.
    x_left = bl - LEFT * h
    x_right = br + 0.005 * h
    ew = x_right - x_left
    eh = max(0.07 * h, 0.19 * bw)
    ecx = (x_left + x_right) / 2
    ecy = bottom + DOWN * h - eh / 2
    blur = float(max(5, BLUR * h))

    pad = int(LEFT * h + blur * 4 + 8)
    W, H = im.width + pad, im.height + int(DOWN * h + blur * 4 + 8)
    yy, xx = np.mgrid[0:H, 0:W]
    r2 = ((xx - (ecx + pad)) / (ew / 2)) ** 2 + ((yy - ecy) / (eh / 2)) ** 2
    r = np.sqrt(np.clip(r2, 0, None))
    # darkest against the body and toward the base line, fading to the tip
    fade = np.clip((xx - (x_left + pad)) / max(1.0, LEFT * h), 0, 1)
    vert = np.clip((yy - (ecy - eh / 2)) / eh, 0, 1)
    sh = np.where(r <= 1, PEAK_ALPHA * (0.45 + 0.55 * fade) * (0.55 + 0.45 * vert), 0.0)
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


def measure(src: str) -> None:
    im = Image.open(src).convert("RGBA")
    alpha = np.array(im)[..., 3]
    body = body_mask(alpha)
    ys, xs = np.where(body)
    outside = ~binary_dilation(body, iterations=2)
    sh = np.where(outside, alpha, 0)
    sy, sx = np.where(sh > 8)
    h = ys.max() - ys.min() + 1
    print(f"{src}: body x{xs.min()}-{xs.max()} y{ys.min()}-{ys.max()} h={h}; "
          f"shadow x{sx.min()}-{sx.max()} y{sy.min()}-{sy.max()} peak={sh.max()/255:.2f}; "
          f"left={(xs.min()-sx.min())/h:.3f}h down={(sy.max()-ys.max())/h:.3f}h")


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "strip":
        strip(sys.argv[2], sys.argv[3])
    elif cmd == "shadow":
        shadow(sys.argv[2], sys.argv[3])
    elif cmd == "measure":
        measure(sys.argv[2])
