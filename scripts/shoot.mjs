import { chromium } from "playwright";

const sections = [
  { id: "top", file: "01-hero" },
  { id: "house", file: "02-about" },
  { id: "services", file: "03-services" },
  { id: "salons", file: "04-salons" },
  { id: "shop", file: "05-shop" },
  { id: "faq", file: "06-faq" },
];

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

for (const s of sections) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView();
  }, s.id);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `/tmp/shots/${s.file}.png` });
}

// Footer
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1000);
await page.screenshot({ path: "/tmp/shots/07-footer.png" });

// Mobile with sticky bar
const m = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
await m.goto("http://localhost:3000", { waitUntil: "networkidle" });
await m.waitForTimeout(1200);
await m.screenshot({ path: "/tmp/shots/mobile-hero.png" });
await m.evaluate(() => window.scrollTo(0, 1600));
await m.waitForTimeout(900);
await m.screenshot({ path: "/tmp/shots/mobile-scrolled.png" });

await browser.close();
console.log("done");
