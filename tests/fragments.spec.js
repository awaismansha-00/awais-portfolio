import { expect, test } from "@playwright/test";

test("malformed fragments do not interrupt initial or same-page navigation", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const hash of ["#[", "#%E0%A4%A", "#missing-section"]) {
    await page.goto(`/${hash}`);
    await expect(page.getByRole("heading", { name: /BUILD WITH PURPOSE/i })).toBeVisible();
    await page.evaluate(() => history.replaceState({}, "", "/"));
    const link = page.getByRole("link", { name: /View All Projects/i });
    await link.evaluate((element, href) => element.setAttribute("href", href), `/${hash}`);
    await link.click();
    await expect.poll(() => new URL(page.url()).hash).toBe(hash);
    await expect(page.getByRole("heading", { name: /BUILD WITH PURPOSE/i })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("encoded fragments reach their section on load and internal navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const expectWorkScroll = () => expect.poll(() => page.locator("#work").evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(200);
  await page.goto("/#%77ork");
  await expectWorkScroll();
  await page.goto("/");
  const link = page.getByRole("link", { name: /View All Projects/i });
  await link.evaluate((element) => element.setAttribute("href", "/#%77ork"));
  await link.click();
  await expectWorkScroll();
  await page.goto("/projects");
  const back = page.getByRole("link", { name: /Back to homepage/i });
  await back.evaluate((element) => element.setAttribute("href", "/#%77ork"));
  await back.click();
  await expect(page).toHaveURL(/\/#%77ork$/);
  await expectWorkScroll();
});
