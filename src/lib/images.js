import blogPosts from "../content/blogs.json";
import projects from "../content/projects.json";
import { getFeaturedItems } from "./content.js";

export const FEATURED_IMAGE_URLS = [
  ...getFeaturedItems(projects).map((project) => project.image),
  ...getFeaturedItems(blogPosts).map((post) => post.image),
].filter(Boolean);

export const ROUTE_IMAGE_PRELOAD_TIMEOUT = 900;

export const imagePreloadPromises = new Map();

export function preloadImage(src) {
  if (!src) return Promise.resolve();

  const imageUrl = new URL(src, window.location.origin).href;
  if (imagePreloadPromises.has(imageUrl)) return imagePreloadPromises.get(imageUrl);

  const preloadPromise = new Promise((resolve) => {
    const image = new Image();
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const decode = () => {
      if (typeof image.decode === "function") {
        image.decode().catch(() => undefined).then(finish);
        return;
      }
      finish();
    };

    image.onload = decode;
    image.onerror = finish;
    image.src = imageUrl;

    if (image.complete) decode();
  });

  imagePreloadPromises.set(imageUrl, preloadPromise);
  return preloadPromise;
}

export function getRouteImageUrls(page) {
  if (page === "projects") return projects.map((project) => project.image).filter(Boolean);
  if (page === "blogs") return blogPosts.map((post) => post.image).filter(Boolean);
  return FEATURED_IMAGE_URLS;
}

export function preloadRouteImages(page) {
  const imageUrls = [...new Set(getRouteImageUrls(page))];
  if (!imageUrls.length) return Promise.resolve();

  return Promise.race([
    Promise.all(imageUrls.map((imageUrl) => preloadImage(imageUrl))),
    new Promise((resolve) => window.setTimeout(resolve, ROUTE_IMAGE_PRELOAD_TIMEOUT)),
  ]).then(() => undefined);
}
