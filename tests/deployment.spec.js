import { expect, test } from "@playwright/test";

const routes = [
  { path: "/", heading: /BUILD WITH/i },
  { path: "/projects", heading: "Projects" },
  { path: "/blogs", heading: "Blogs" },
];

function collectBrowserErrors(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  return errors;
}

async function expectVisibleDecodedImage(locator) {
  await expect(locator).toBeVisible();
  await expect
    .poll(
      () =>
        locator.evaluate((image) => ({
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
        })),
      { timeout: 5000 },
    )
    .toEqual(expect.objectContaining({ complete: true }));
  const dimensions = await locator.evaluate((image) => ({
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
  }));
  expect(dimensions.naturalWidth).toBeGreaterThan(0);
  expect(dimensions.naturalHeight).toBeGreaterThan(0);
}

test("deployment routes refresh directly without browser errors", async ({ page }) => {
  const browserErrors = collectBrowserErrors(page);

  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.getByRole("heading", { name: route.heading })).toBeVisible();
    await expect(page.locator("#root")).not.toBeEmpty();
    await expectVisibleDecodedImage(page.locator("img").first());
  }

  expect(browserErrors).toEqual([]);
});

test("production navigation keeps route transition and images healthy", async ({ page }) => {
  const browserErrors = collectBrowserErrors(page);

  await page.goto("/");
  await expect(page.getByRole("status", { name: "Loading portfolio" })).toBeHidden({ timeout: 3000 });

  await page.getByRole("link", { name: /View All Projects/i }).click();
  await expect(page.locator(".route-svg-transition")).toBeVisible();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
  await expectVisibleDecodedImage(page.locator("#content article img").first());
  await expect(page.locator(".route-svg-transition")).toHaveCount(0, { timeout: 3000 });

  await page.getByRole("link", { name: /Back to homepage/i }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.getByRole("heading", { name: /BUILD WITH/i })).toBeVisible();
  await expectVisibleDecodedImage(page.locator("#work article img").first());
  await expect(page.locator(".route-svg-transition")).toHaveCount(0, { timeout: 3000 });

  await page.getByRole("link", { name: /View All Blogs/i }).click();
  await expect(page.locator(".route-svg-transition")).toBeVisible();
  await expect(page).toHaveURL(/\/blogs$/);
  await expect(page.getByRole("heading", { name: "Blogs" })).toBeVisible();
  await expectVisibleDecodedImage(page.locator("#content article img").first());
  await expect(page.locator(".route-svg-transition")).toHaveCount(0, { timeout: 3000 });

  expect(browserErrors).toEqual([]);
});

test("deployment metadata and static assets are published", async ({ request }) => {
  for (const path of ["/robots.txt", "/sitemap.xml", "/assets/favicon.svg", "/assets/cv/Awais-Mansha-DevOps-CV.pdf"]) {
    const response = await request.get(path);
    expect(response.ok(), `${path} should load`).toBe(true);
  }

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap:");

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("<loc>https://awais-portfolio.vercel.app/</loc>");
  expect(sitemap).toContain("<loc>https://awais-portfolio.vercel.app/projects</loc>");
  expect(sitemap).toContain("<loc>https://awais-portfolio.vercel.app/blogs</loc>");
});
