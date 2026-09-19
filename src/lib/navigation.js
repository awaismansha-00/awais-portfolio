export function scrollToHash(hash) {
  if (!hash?.startsWith("#")) return;
  let id;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    // Ignore malformed percent escapes instead of interrupting rendering.
    return;
  }
  document.getElementById(id)?.scrollIntoView({ block: "start" });
}
