import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
await p.goto("http://localhost:3000", { waitUntil: "networkidle" });

// Star treatment: scroll to the marquee text
await p.evaluate(() => {
  const el = [...document.querySelectorAll("h2")].find((h) =>
    h.textContent.includes("Everyone leaves")
  );
  if (el) el.scrollIntoView({ block: "center" });
});
await p.waitForTimeout(1200);
await p.screenshot({ path: "/tmp/shots/star.png" });

// Footer CTA — step-scroll to bottom so reveals trigger
await p.evaluate(async () => {
  await new Promise((res) => {
    let y = window.scrollY;
    const t = setInterval(() => {
      y += 400;
      window.scrollTo(0, y);
      if (y >= document.body.scrollHeight) {
        clearInterval(t);
        res();
      }
    }, 80);
  });
});
await p.waitForTimeout(1400);
await p.screenshot({ path: "/tmp/shots/footer.png", fullPage: false });
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 980));
await p.waitForTimeout(700);
await p.screenshot({ path: "/tmp/shots/footer2.png" });

await b.close();
console.log("ok");
