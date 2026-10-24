export function getConfiguredAppUrl(): URL | null {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!configuredUrl) return null;

  try {
    const url = new URL(configuredUrl);
    if (
      url.username ||
      url.password ||
      (url.protocol !== "https:" &&
        !(url.protocol === "http:" && url.hostname === "localhost"))
    ) {
      return null;
    }
    return new URL("/", url);
  } catch {
    return null;
  }
}
