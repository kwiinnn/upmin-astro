// Usage: npm run qr -- https://your-site.vercel.app
// Writes qr-code.png (1200px, for slides) and qr-code.svg to the project root.
import QRCode from "qrcode";

const url = process.argv[2];
if (!url || !/^https?:\/\//.test(url)) {
  console.error("Usage: npm run qr -- https://your-site.vercel.app");
  process.exit(1);
}
const opts = { margin: 2, errorCorrectionLevel: "M", color: { dark: "#060a18", light: "#ffffff" } };
await QRCode.toFile("qr-code.png", url, { ...opts, width: 1200 });
await QRCode.toFile("qr-code.svg", url, { ...opts, type: "svg" });
console.log(`QR code for ${url} written to qr-code.png and qr-code.svg`);
