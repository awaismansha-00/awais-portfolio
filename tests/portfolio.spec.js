import { expect, test } from "@playwright/test";

async function canvasSignal(page) {
  await page.waitForSelector(".canvas-probe canvas", { state: "visible" });
  await page.waitForTimeout(1200);

  return page.locator(".canvas-probe canvas").evaluate((canvas) => {
    const canvasRect = canvas.getBoundingClientRect();
    const frameRect = canvas.closest("[data-canvas-frame]")?.getBoundingClientRect();
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

    if (!gl) {
      return {
        width: canvasRect.width,
        height: canvasRect.height,
        frameWidth: frameRect?.width ?? 0,
        frameHeight: frameRect?.height ?? 0,
        litPixels: 0,
      };
    }

    gl.finish();

    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    const data = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

    let litPixels = 0;

    for (let index = 0; index < data.length; index += 16) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];
      const brightness = red + green + blue;

      if (alpha > 12 && brightness > 40) {
        litPixels += 1;
      }
    }

    return {
      width: canvasRect.width,
      height: canvasRect.height,
      frameWidth: frameRect?.width ?? 0,
      frameHeight: frameRect?.height ?? 0,
      litPixels,
    };
  });
}

test("portfolio renders hero, sections, and active contact path", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Awais Mansha builds resilient delivery platforms/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /View Projects/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Project stories shaped/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Need a DevOps engineer/i })).toBeVisible();

  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-portfolio.png`),
    fullPage: true,
  });

  const signal = await canvasSignal(page);
  expect(signal.width).toBeGreaterThanOrEqual(300);
  expect(signal.height).toBeGreaterThan(400);
  expect(signal.frameWidth).toBeGreaterThanOrEqual(300);
  expect(signal.frameHeight).toBeGreaterThan(400);
  expect(signal.litPixels).toBeGreaterThan(250);
});
