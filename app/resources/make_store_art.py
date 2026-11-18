"""Builds store art from the game's bun PNG: icon.png 1024, icon-foreground/background.png 432, splash.png 2732.
Run: python3 resources/make_store_art.py  (from /home/claude/app)"""
from PIL import Image, ImageDraw, ImageFilter
import math, os
OUT = os.path.dirname(os.path.abspath(__file__))
BUN = Image.open('/home/claude/assets/bun_done.png').convert('RGBA')
BUN = BUN.crop(BUN.getbbox())
CENTER, EDGE = (246, 140, 52), (196, 62, 18)

def bg(n):
    """Warm orange radial, darker red-orange at the edges so the golden bun stands out at 64px."""
    g = Image.radial_gradient('L').resize((int(n * 1.5),) * 2, Image.BILINEAR)  # 0 center -> 255 at 0.75n
    g = g.crop((int(n * .25), int(n * .23), int(n * .25) + n, int(n * .23) + n))
    return Image.composite(Image.new('RGB', (n, n), EDGE), Image.new('RGB', (n, n), CENTER), g)

def steam(n, cx, top, w, h):
    """Three wavy white wisps rising above (cx, top)."""
    s = Image.new('RGBA', (n, n))
    d = ImageDraw.Draw(s)
    lw = max(3, int(w * 0.11))
    for k, dx in enumerate((-w * 0.32, 0, w * 0.32)):
        hh = h * (0.8 if k != 1 else 1.0)
        pts = [(cx + dx + math.sin(t / 10 * math.pi * 2 + k) * w * 0.07, top - t / 20 * hh) for t in range(21)]
        d.line(pts, fill=(255, 255, 255, 235), width=lw, joint='curve')
        for x, y in (pts[0], pts[-1]):
            d.ellipse([x - lw/2, y - lw/2, x + lw/2, y + lw/2], fill=(255, 255, 255, 235))
    return s.filter(ImageFilter.GaussianBlur(lw * 0.18))

def place(canvas, n, scale, cy):
    """Bun (with soft shadow) and steam, centered, bun width = scale*n."""
    w = int(n * scale); b = BUN.resize((w, int(BUN.height * w / BUN.width)), Image.LANCZOS)
    x, y = (n - b.width) // 2, int(n * cy - b.height / 2)
    sh = Image.new('RGBA', (n, n)); sh.paste((90, 30, 0, 110), (x, y + n // 40), b)
    canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(n / 60)))
    canvas.alpha_composite(b, (x, y))
    canvas.alpha_composite(steam(n, n / 2, y + b.height * 0.06, b.width * 0.42, n * 0.2))
    return canvas

# 1024 app icon: opaque, no text, square (stores round the corners)
icon = place(bg(1024).convert('RGBA'), 1024, 0.84, 0.6).convert('RGB')
icon.save(f'{OUT}/icon-only.png')
# Android adaptive: 108dp canvas, only the inner 66dp circle is always visible -> bun at ~58% width
bg(432).save(f'{OUT}/icon-background.png')
place(Image.new('RGBA', (432, 432)), 432, 0.58, 0.58).save(f'{OUT}/icon-foreground.png')
# Splash 2732: plain warm background, bun small in the center (safe for any crop/aspect)
place(bg(2732).convert('RGBA'), 2732, 0.3, 0.52).convert('RGB').save(f'{OUT}/splash.png')
# preview: icon at 64px next to 180px
pv = Image.new('RGB', (64 + 180 + 30, 190), (255, 255, 255))
pv.paste(icon.resize((64, 64), Image.LANCZOS), (10, 63)); pv.paste(icon.resize((180, 180), Image.LANCZOS), (84, 5))
pv.save(f'{OUT}/icon-preview.png')
for f in ('icon-only.png', 'icon-foreground.png', 'icon-background.png', 'splash.png'):
    im = Image.open(f'{OUT}/{f}'); print(f, im.size, im.mode)
assert Image.open(f'{OUT}/icon-only.png').mode == 'RGB' and Image.open(f'{OUT}/icon-only.png').size == (1024, 1024)
# Google Play listing: 512 hi-res icon + 1024x500 feature graphic (no text; owner may add a logo later)
icon.resize((512, 512), Image.LANCZOS).save(f'{OUT}/play-icon-512.png')
fg = place(bg(1024).convert('RGBA'), 1024, 0.4, 0.62).crop((0, 262, 1024, 762)).convert('RGB')
fg.save(f'{OUT}/play-feature-1024x500.png'); assert fg.size == (1024, 500)
