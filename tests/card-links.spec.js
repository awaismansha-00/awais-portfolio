import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

const projects = JSON.parse(readFileSync(new URL("../src/content/projects.json", import.meta.url), "utf8"));
const blogPosts = JSON.parse(readFileSync(new URL("../src/content/blogs.json", import.meta.url), "utf8"));

async function openedUrl(page, locator) {
  const [popup] = await Promise.all([page.waitForEvent("popup", { timeout: 6000 }), locator.click()]);
  const url = popup.url();
  await popup.close();
  return url;
}

// The home carousels drag-scroll on pointer events; the card links must still activate.
test("home carousel cards open their GitHub and Medium links", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(2500);

  const projectLink = page.locator("#work article").first().getByRole("link", { name: /GitHub/i });
  await projectLink.scrollIntoViewIfNeeded();
  expect(await openedUrl(page, projectLink)).toBe(projects[0].github);

  const blogLink = page.locator("#blog article").first().getByRole("link", { name: /Read on Medium/i });
  await blogLink.scrollIntoViewIfNeeded();
  expect(await openedUrl(page, blogLink)).toBe(blogPosts[0].href);
});

test("listing page cards open their GitHub and Medium links", async ({ page }) => {
  await page.goto("/projects");
  await page.waitForTimeout(2500);
  const projectLink = page.locator("#content article").first().getByRole("link", { name: /GitHub/i });
  await projectLink.scrollIntoViewIfNeeded();
  expect(await openedUrl(page, projectLink)).toBe(projects[0].github);

  await page.goto("/blogs");
  await page.waitForTimeout(2500);
  const blogLink = page.locator("#content article").first().getByRole("link", { name: /Read on Medium/i });
  await blogLink.scrollIntoViewIfNeeded();
  expect(await openedUrl(page, blogLink)).toBe(blogPosts[0].href);
});

// Guards the other half of the trade-off: a real drag must not fire the link underneath.
test("dragging the carousel from a link does not open it", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "drag-scroll is mouse-only");
  await page.goto("/");
  await page.waitForTimeout(2500);

  const carousel = page.getByTestId("project-carousel");
  await carousel.scrollIntoViewIfNeeded();
  const link = page.locator("#work article").first().getByRole("link", { name: /GitHub/i });
  const box = await link.boundingBox();

  let popped = false;
  page.on("popup", () => { popped = true; });

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 - 160, box.y + box.height / 2, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(800);

  expect(popped, "dragging off a link must not navigate").toBe(false);
  expect(await carousel.evaluate((el) => el.scrollLeft), "drag should still scroll the track").toBeGreaterThan(20);
});
