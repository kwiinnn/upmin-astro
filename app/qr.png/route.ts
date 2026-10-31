import QRCode from "qrcode";

// Download-ready QR code of the site, for slides: /qr.png (or /qr.png?format=svg).
// Uses NEXT_PUBLIC_SITE_URL when set, otherwise the host this was requested on.
export async function GET(req: Request) {
  const reqUrl = new URL(req.url);
  const host = req.headers.get("x-forwarded-host") ?? reqUrl.host;
  const proto = req.headers.get("x-forwarded-proto") ?? reqUrl.protocol.replace(":", "");
  const target = process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${host}`;
  const opts = { margin: 2, errorCorrectionLevel: "M" as const, color: { dark: "#060a18", light: "#ffffff" } };
  const cache = { "Cache-Control": "public, max-age=300" };

  if (reqUrl.searchParams.get("format") === "svg") {
    const svg = await QRCode.toString(target, { ...opts, type: "svg" });
    return new Response(svg, { headers: { "Content-Type": "image/svg+xml", ...cache } });
  }
  const png = await QRCode.toBuffer(target, { ...opts, width: 1200 });
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png", ...cache } });
}
