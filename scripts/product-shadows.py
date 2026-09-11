"""
Give every product cutout in public/img/products/{id}.png the same soft,
angled contact shadow (like the Ocean Beach spray photo) instead of whatever
the original studio shot had (white, faint, or none).

Run:  python3 scripts/product-shadows.py    (needs Pillow, numpy, scipy)
Then bump PRODUCT_IMAGE_VERSION in src/lib/shop.ts.
"""
import glob
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = "public/img/products"
SHADOW_RGB = (38, 33, 28)
SHEAR = 0.34        # how far the shadow leans to the right per unit of height
FLATTEN = 0.22      # shadow height as a fraction of product height
MAX_ALPHA = 150     # darkest point of the cast shadow
CONTACT_ALPHA = 150 # darkest point of the tight contact shadow under the base


def process(path: str) -> None:
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    alpha = arr[:, :, 3].astype(np.float32)
    h, w = alpha.shape

    # Body = the solid product. Old shadows are the semi-transparent pixels that
    # sit outside the (slightly grown) solid region; drop them.
    solid = alpha >= 250
    solid = ndimage.binary_fill_holes(solid)
    body = ndimage.binary_dilation(solid, iterations=2)
    keep = alpha.copy()
    keep[~body] = 0
    # Re-soften the cut edge so it isn't jagged.
    keep = np.where(body & (alpha > 0), np.maximum(keep, alpha * (alpha >= 40)), keep)

    ys, xs = np.where(solid)
    if ys.size == 0:
        return
    y0, y1 = ys.min(), ys.max()
    x0, x1 = xs.min(), xs.max()
    ph = int(y1 - y0)

    # Make room on the right / bottom for the cast shadow if needed.
    extra_r = int(SHEAR * ph) + 60
    extra_b = 60
    W, H = w + extra_r, h + extra_b

    # Silhouette -> flatten to FLATTEN of its height and lean it right,
    # anchored at the base line y1 (a low, angled cast shadow).
    sil = (solid[y0 : y1 + 1, x0 : x1 + 1] * 255).astype(np.uint8)
    sh_h = max(8, int(ph * FLATTEN))
    flat = np.array(Image.fromarray(sil).resize((x1 - x0 + 1, sh_h), Image.BILINEAR)).astype(np.float32) / 255.0
    cast_a = np.zeros((H, W), np.float32)
    for i in range(sh_h):
        # row i of the flattened silhouette sits (sh_h - 1 - i) rows above the base
        up = sh_h - 1 - i
        dx = int(round(SHEAR * up / FLATTEN))   # lean grows with (original) height above base
        yy = y1 - up
        xs0 = x0 + dx
        seg = flat[i]
        x_end = min(W, xs0 + seg.size)
        if 0 <= yy < H and x_end > xs0:
            cast_a[yy, xs0:x_end] = np.maximum(cast_a[yy, xs0:x_end], seg[: x_end - xs0])
    cast_img = Image.fromarray((cast_a * 255).astype(np.uint8)).filter(
        ImageFilter.GaussianBlur(radius=float(max(8, int(ph * 0.025))))
    )
    cast_a = np.array(cast_img).astype(np.float32) / 255.0
    # Fade the shadow as it stretches away from the product.
    yy, xx = np.mgrid[0:H, 0:W]
    reach = max(1.0, SHEAR * ph)
    dist = np.clip((xx - x1) / reach, 0, 1)
    cast_a *= (1.0 - 0.7 * dist)
    cast_a *= MAX_ALPHA

    # Tight contact shadow: the bottom sliver of the silhouette, barely blurred.
    contact = np.zeros((H, W), np.float32)
    band = solid.copy()
    band[: max(0, y1 - int(ph * 0.04)), :] = False
    contact[:h, :w] = band
    contact = np.array(Image.fromarray((contact * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))).astype(np.float32) / 255.0
    contact *= CONTACT_ALPHA

    shadow_a = np.clip(np.maximum(cast_a, contact), 0, 255)

    out = np.zeros((H, W, 4), np.uint8)
    out[:, :, 0] = SHADOW_RGB[0]
    out[:, :, 1] = SHADOW_RGB[1]
    out[:, :, 2] = SHADOW_RGB[2]
    out[:, :, 3] = shadow_a.astype(np.uint8)
    shadow = Image.fromarray(out, "RGBA")

    product = Image.fromarray(np.dstack([arr[:, :, :3], keep.astype(np.uint8)]), "RGBA")
    result = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    result.alpha_composite(shadow)
    result.alpha_composite(product, (0, 0))

    # Trim transparent margins but keep a small padding.
    bbox = result.getbbox()
    if bbox:
        pad = 24
        bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(W, bbox[2] + pad), min(H, bbox[3] + pad))
        result = result.crop(bbox)
    result.save(path, optimize=True)


if __name__ == "__main__":
    for p in sorted(glob.glob(f"{SRC}/*.png")):
        process(p)
        print("shadowed", p)
