const PEXELS_HOST = "images.pexels.com";

const buildPexelsUrl = (source) => {
  const url = new URL(source);
  if (url.hostname !== PEXELS_HOST) return null;
  url.searchParams.set("auto", "compress");
  url.searchParams.set("cs", "tinysrgb");
  url.searchParams.set("fm", "webp");
  url.searchParams.set("w", "1200");
  url.searchParams.set("q", "82");
  url.searchParams.delete("h");
  url.searchParams.delete("dpr");
  return url;
};

export default async function handler(request, response) {
  try {
    const requestUrl = new URL(request.url, `https://${request.headers.host}`);
    const source = requestUrl.searchParams.get("src");
    if (!source) {
      response.status(400).send("Missing image source");
      return;
    }

    const pexelsUrl = buildPexelsUrl(source);
    if (!pexelsUrl) {
      response.status(400).send("Unsupported image source");
      return;
    }

    const imageResponse = await fetch(pexelsUrl, {
      headers: { Accept: "image/webp,image/*;q=0.8" },
      signal: AbortSignal.timeout(8000),
    });

    if (!imageResponse.ok || !imageResponse.body) {
      response.status(502).send("Image fetch failed");
      return;
    }

    response.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800");
    response.setHeader("Content-Disposition", "inline; filename=\"dubai-time-image.webp\"");
    response.setHeader("Content-Type", imageResponse.headers.get("content-type") || "image/webp");
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    response.status(200).send(buffer);
  } catch {
    response.status(500).send("Image proxy error");
  }
}
