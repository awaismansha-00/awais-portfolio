import { expect, test } from "@playwright/test";

const sections = ["work", "skills", "blog", "process", "contact"];

const sectionTop = (page, id) => page.locator(`#${id}`).evaluate((node) => node.getBoundingClientRect().top);
const scrollY = (page) => page.evaluate(() => Math.round(window.scrollY));

// On mobile the nav lives behind the hamburger, so it has to be opened before every click.
async function clickNav(page, testInfo, href) {
  if (testInfo.project.name.includes("mobile")) {
    await page.getByRole("button", { name: /Toggle navigation/i }).click();
  }
  await page.getByRole("navigation", { name: "Primary navigation" }).locator(`a[href="${href}"]`).click();
}

// Scrolling is CSS-smooth, so sampling on a fixed delay can catch it mid-flight.
async function settledScrollY(page) {
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        let last = window.scrollY;
        let stable = 0;
        const tick = () => {
          const current = window.scrollY;
          stable = current === last ? stable + 1 : 0;
          last = current;
          if (stable >= 5) resolve(Math.round(current));
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
  );
}

test("re-clicking an already-active nav link scrolls back to its section", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.waitForTimeout(2400);

  for (const id of sections) {
    await clickNav(page, testInfo, `/#${id}`);
    // #contact is the last section, so it lands at max scroll rather than at rect.top === 0.
    const landed = await settledScrollY(page);
    expect(new URL(page.url()).hash).toBe(`#${id}`);
    expect(landed, `first click on #${id} should scroll down`).toBeGreaterThan(100);

    // Scroll away, then click the SAME link again — this used to do nothing at all.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect.poll(() => scrollY(page), { timeout: 4000 }).toBe(0);

    await clickNav(page, testInfo, `/#${id}`);
    const returned = await settledScrollY(page);
    // Tolerance, not equality: below-the-fold layout can settle by a few px between the two clicks.
    expect(Math.abs(returned - landed), `repeat click on #${id} should scroll back near ${landed}, got ${returned}`).toBeLessThanOrEqual(80);
  }
});

test("repeat clicks on the same nav link do not add history entries", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.waitForTimeout(2400);

  const before = await page.evaluate(() => window.history.length);

  await clickNav(page, testInfo, "/#skills");
  await page.waitForTimeout(900);
  const afterFirst = await page.evaluate(() => window.history.length);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await clickNav(page, testInfo, "/#skills");
  await page.waitForTimeout(900);
  const afterSecond = await page.evaluate(() => window.history.length);

  expect(afterFirst).toBe(before + 1);
  expect(afterSecond).toBe(afterFirst);

  await page.goBack();
  await page.waitForTimeout(600);
  expect(new URL(page.url()).hash).toBe("");
});

test("nav link back to a home section works from a listing page", async ({ page }, testInfo) => {
  await page.goto("/projects");
  await page.waitForTimeout(2400);

  await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
  await expect.poll(() => scrollY(page), { timeout: 4000 }).toBeGreaterThan(400);

  await clickNav(page, testInfo, "/#work");
  await expect.poll(() => new URL(page.url()).pathname, { timeout: 8000 }).toBe("/");
  await expect.poll(() => sectionTop(page, "work"), { timeout: 8000 }).toBeLessThan(140);
});
