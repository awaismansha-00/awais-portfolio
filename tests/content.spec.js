import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { getFeaturedItems } from "../src/lib/content.js";

const projects = JSON.parse(readFileSync(new URL("../src/content/projects.json", import.meta.url), "utf8"));
const blogs = JSON.parse(readFileSync(new URL("../src/content/blogs.json", import.meta.url), "utf8"));

test("new listing entries do not displace homepage content", () => {
  for (const items of [projects, blogs]) {
    const before = getFeaturedItems(items);
    const expanded = [
      { title: "New default entry" },
      { title: "Listing only", featured: false },
      ...items,
      { title: "Another new entry" },
    ];
    expect(getFeaturedItems(expanded)).toEqual(before);
    expect(getFeaturedItems([{ title: "Opted in", featured: true }, ...expanded])[0].title).toBe("Opted in");
  }
  expect(getFeaturedItems(Array.from({ length: 5 }, (_, index) => ({ title: `${index}`, featured: true })))).toHaveLength(3);
});

test("homepage is curated and listing pages contain every entry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#work article h3")).toHaveText(getFeaturedItems(projects).map((item) => item.title));
  await expect(page.locator("#blog article h3")).toHaveText(getFeaturedItems(blogs).map((item) => item.title));
  for (const [route, items] of [["/projects", projects], ["/blogs", blogs]]) {
    await page.goto(route);
    await expect(page.locator("#content article h3")).toHaveText(items.map((item) => item.title));
  }
});
