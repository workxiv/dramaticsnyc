import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
await p.goto("http://localhost:3000", { waitUntil: "networkidle" });
await p.evaluate(() => document.getElementById("shop").scrollIntoView());
await p.waitForTimeout(1500);
await p.screenshot({ path: "/tmp/shots/shop2.png" });
await b.close();
console.log("ok");
