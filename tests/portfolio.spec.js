import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

const projects = JSON.parse(readFileSync(new URL("../src/content/projects.json", import.meta.url), "utf8"));
const blogPosts = JSON.parse(readFileSync(new URL("../src/content/blogs.json", import.meta.url), "utf8"));
const certificationGroups = JSON.parse(readFileSync(new URL("../src/content/certifications.json", import.meta.url), "utf8"));

test("portfolio renders hero, sections, and active contact path", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /BUILD WITH PURPOSE/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /View Projects/i })).toBeVisible();
  const workTogether = page.getByRole("link", { name: /LET'S WORK TOGETHER/i });
  await expect(workTogether).toHaveAttribute("href", "/#contact");
  await expect(workTogether).toHaveClass(/hero-contact-nav/);
  await expect(page.getByRole("link", { name: /Email Awais/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Download CV.*CV coming soon/i })).toBeDisabled();
  await expect(page.locator(".hero-section__image")).toHaveAttribute("src", "/assets/awais-hero-portrait.png");
  await expect(page.getByText("Devops engineer, cloud security and platform engineering", { exact: true })).toBeVisible();
  await expect(page.getByText("I’m Awais Mansha — a DevOps and Cloud Engineer focused on reusable infrastructure, secure cloud platforms, and automated delivery systems built to evolve.", { exact: true })).toBeVisible();
  const rotatingWord = page.locator(".hero-rotating-word__value");
  await expect(rotatingWord).toHaveText("PURPOSE");
  await page.waitForTimeout(3000);
  await expect(rotatingWord).toHaveText("IMPACT");
  await page.waitForTimeout(3000);
  await expect(rotatingWord).toHaveText("INTENT");
  await expect(page.locator("header img")).toBeVisible();
  await expect(page.getByAltText("Awais Mansha, DevOps Engineer")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /DevOps projects built around cloud/i })).toHaveCount(0);
  await expect(page.locator("#work article")).toHaveCount(Math.min(projects.length, 3));
  await expect(page.getByRole("link", { name: /View All Projects/i })).toHaveAttribute("href", "/projects");
  await expect(page.locator("#work article h3").first()).toHaveText(projects[0].title);
  await expect(page.locator("#work article").first().getByRole("link", { name: /GitHub/i })).toHaveAttribute("href", projects[0].github);
  await expect(page.locator("#work article").first().getByRole("img", { name: /AWS 3-Tier Architecture.*architecture/i })).toHaveAttribute(
    "src",
    projects[0].image,
  );
  const carousel = page.getByTestId("project-carousel");
  const firstProjectCard = page.locator("#work article").first();
  const firstProjectControls = firstProjectCard.getByTestId("project-carousel-controls");
  await expect(firstProjectCard.getByRole("button", { name: "Scroll projects left" })).toHaveCount(0);
  await expect(firstProjectCard.getByRole("button", { name: "Scroll projects right" })).toBeVisible();
  await expect(firstProjectControls).toHaveCSS("opacity", "0");
  if (testInfo.project.name.includes("mobile")) {
    await firstProjectCard.getByRole("button", { name: "Scroll projects right" }).focus();
  } else {
    await firstProjectCard.hover();
  }
  await expect(firstProjectControls).toHaveCSS("opacity", "1");
  const carouselWidth = await carousel.evaluate((element) => element.clientWidth);
  const firstProjectCardWidth = await firstProjectCard.evaluate((element) => element.getBoundingClientRect().width);
  expect(Math.abs(firstProjectCardWidth - carouselWidth)).toBeLessThanOrEqual(2);
  const scrollBefore = await carousel.evaluate((element) => element.scrollLeft);
  const expectedCardScroll = firstProjectCardWidth * 0.75;
  await firstProjectCard.getByRole("button", { name: "Scroll projects right" }).click();
  await expect
    .poll(async () => carousel.evaluate((element) => element.scrollLeft), { timeout: 3000 })
    .toBeGreaterThan(scrollBefore + expectedCardScroll);
  await expect(firstProjectCard.getByRole("button", { name: "Scroll projects left" })).toBeVisible();
  await expect(firstProjectCard.getByRole("button", { name: "Scroll projects right" })).toBeVisible();
  await carousel.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });
  await expect(firstProjectCard.getByRole("button", { name: "Scroll projects left" })).toBeVisible();
  await expect(firstProjectCard.getByRole("button", { name: "Scroll projects right" })).toHaveCount(0);
  await carousel.evaluate((element) => {
    element.scrollLeft = 0;
  });
  const carouselBox = await carousel.boundingBox();
  expect(carouselBox).not.toBeNull();
  await page.mouse.move(carouselBox.x + carouselBox.width * 0.58, carouselBox.y + carouselBox.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(carouselBox.x + carouselBox.width * 0.42, carouselBox.y + carouselBox.height * 0.5, { steps: 6 });
  await page.mouse.up();
  await expect
    .poll(async () => carousel.evaluate((element) => element.scrollLeft), { timeout: 3000 })
    .toBeGreaterThan(expectedCardScroll);
  await firstProjectCard.hover();
  await expect(firstProjectCard.getByLabel(`${projects[0].title} tools`).getByText(projects[0].tags[0], { exact: true })).toBeVisible();
  await expect(page.locator("#work article").nth(1).getByText("Repository project")).toBeVisible();
  await expect(page.locator("[data-skill-icon]")).toHaveCount(17);
  const certifiedItems = certificationGroups.find((group) => group.status === "Certified").items;
  const preparingItems = certificationGroups.find((group) => group.status === "Preparing").items;
  await expect(page.getByRole("link", { name: /AWS Certified Solutions Architect - Associate/i })).toHaveAttribute("href", certifiedItems[0].href);
  await expect(page.getByRole("link", { name: /Certified Kubernetes Administrator/i })).toHaveAttribute("href", certifiedItems[1].href);
  await expect(page.getByRole("link", { name: /AWS Certified Solutions Architect - Associate/i }).locator("img")).toHaveAttribute("src", certifiedItems[0].image);
  await expect(page.getByRole("link", { name: /Certified Kubernetes Administrator/i }).locator("img")).toHaveAttribute("src", certifiedItems[1].image);
  await expect(page.locator("[data-certification-icon='certified']")).toHaveCount(certifiedItems.length);
  await expect(page.getByText(preparingItems[0].title)).toBeVisible();
  await expect(page.getByText(preparingItems[0].title).locator("xpath=ancestor::li[1]//img")).toHaveCount(0);
  const blogCarousel = page.getByTestId("blog-carousel");
  const firstBlogCard = page.locator("#blog article").first();
  await expect(page.getByRole("heading", { name: /Writing in public about DevOps practice/i })).toHaveCount(0);
  await expect(firstBlogCard.getByRole("button", { name: "Scroll blogs left" })).toHaveCount(0);
  await expect(firstBlogCard.getByRole("button", { name: "Scroll blogs right" })).toHaveCount(0);
  await expect(page.getByTestId("blog-carousel-controls")).toHaveCount(0);
  const blogCanScroll = await blogCarousel.evaluate((element) => element.scrollWidth > element.clientWidth + 2);
  if (blogCanScroll) {
    const blogBox = await blogCarousel.boundingBox();
    expect(blogBox).not.toBeNull();
    await page.mouse.move(blogBox.x + blogBox.width * 0.58, blogBox.y + blogBox.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(blogBox.x + blogBox.width * 0.42, blogBox.y + blogBox.height * 0.5, { steps: 6 });
    await page.mouse.up();
    await expect
      .poll(async () => blogCarousel.evaluate((element) => element.scrollLeft), { timeout: 3000 })
      .toBeGreaterThan(20);
  }
  await expect(page.locator("#blog article")).toHaveCount(Math.min(blogPosts.length, 3));
  await expect(page.getByRole("link", { name: /View All Blogs/i })).toHaveAttribute("href", "/blogs");
  await expect(page.locator("#blog article h3").first()).toHaveText(blogPosts[0].title);
  await expect(page.getByRole("heading", { name: /OpenID Connect vs EKS Pod Identity/i })).toBeVisible();
  await expect(page.getByRole("img", { name: /OpenID Connect vs EKS Pod Identity.*architecture guide/i })).toHaveAttribute(
    "src",
    blogPosts[0].image,
  );
  await expect(page.getByRole("link", { name: /Read on Medium/i })).toHaveAttribute(
    "href",
    blogPosts[0].href,
  );
  await expect(page.getByRole("heading", { name: "How I Work" })).toBeVisible();
  await expect(page.getByText("Professional Signal")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /Need a DevOps engineer/i })).toBeVisible();

  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-portfolio.png`),
    fullPage: true,
  });

  const heroImage = page.locator(".hero-section__image");
  await expect(heroImage).toBeVisible();
  await expect(heroImage).toHaveAttribute("src", "/assets/awais-hero-portrait.png");
  const heroImageSize = await heroImage.evaluate((image) => ({ width: image.naturalWidth, height: image.naturalHeight }));
  expect(heroImageSize.width).toBeGreaterThanOrEqual(2000);
  expect(heroImageSize.height).toBeGreaterThanOrEqual(1500);
});

test("portfolio renders full project and blog pages at real URLs", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /View All Projects/i }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { name: "All DevOps projects" })).toBeVisible();
  await expect(page.locator("#content article")).toHaveCount(projects.length);
  await expect(page.locator("#content article h3").first()).toHaveText(projects[0].title);
  await expect(page.getByTestId("project-carousel-controls")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Back to homepage/i })).toHaveAttribute("href", "/#work");

  await page.goto("/projects");
  await expect(page.getByRole("heading", { name: "All DevOps projects" })).toBeVisible();
  await expect(page.locator("#content article")).toHaveCount(projects.length);
  await expect(page.getByTestId("project-carousel-controls")).toHaveCount(0);

  await page.goto("/blogs");
  await expect(page.getByRole("heading", { name: "All technical writing" })).toBeVisible();
  await expect(page.locator("#content article")).toHaveCount(blogPosts.length);
  await expect(page.locator("#content article h3").first()).toHaveText(blogPosts[0].title);
  await expect(page.getByTestId("blog-carousel-controls")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Back to homepage/i })).toHaveAttribute("href", "/#blog");
});

test("first-load loader persists across client-side internal navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("status", { name: "Loading portfolio" })).toBeVisible();
  await expect(page.getByRole("status", { name: "Loading portfolio" })).toBeHidden({ timeout: 3000 });

  await page.getByRole("link", { name: /View All Projects/i }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { name: "All DevOps projects" })).toBeVisible();
  await expect(page.getByRole("status", { name: "Loading portfolio" })).toHaveCount(0);

  await page.getByRole("link", { name: /Back to homepage/i }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.getByRole("heading", { name: /BUILD WITH PURPOSE/i })).toBeVisible();
  await expect(page.getByRole("status", { name: "Loading portfolio" })).toHaveCount(0);

  await page.goBack();
  await expect(page).toHaveURL(/\/projects$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/#work$/);
});

test("reduced motion uses the simple loader and route fallback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /BUILD WITH PURPOSE/i })).toBeVisible();
  await expect(page.getByRole("status", { name: "Loading portfolio" })).toBeHidden({ timeout: 1000 });

  await page.getByRole("link", { name: /View All Blogs/i }).click();
  await expect(page).toHaveURL(/\/blogs$/);
  await expect(page.getByRole("heading", { name: "All technical writing" })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});

test("remaining sections expose progressive animation states without blocking content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /BUILD WITH PURPOSE/i })).toBeVisible();

  const background = page.locator(".global-background");
  await expect(background).toHaveCSS("pointer-events", "none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));

  const progress = page.getByRole("progressbar", { name: "Project carousel progress" });
  await expect(progress).toBeVisible();
  const carousel = page.getByTestId("project-carousel");
  await carousel.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
    element.dispatchEvent(new Event("scroll", { bubbles: true }));
  });
  await expect(progress).toHaveAttribute("aria-valuenow", /[1-9][0-9]?|100/);
  await expect(page.locator("#work article[data-card-focus='true']")).toHaveCount(1);

  await page.locator("#process").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-process-active='true']").first()).toBeVisible();
  await expect(page.locator(".process-path__progress")).toBeVisible();

  await page.locator("#skills").scrollIntoViewIfNeeded();
  await expect(page.locator("#skills .skill-group").first()).toBeVisible();
  await expect(page.locator("[data-skill-icon]")).toHaveCount(17);
});
