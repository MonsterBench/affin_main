import QRCode from "qrcode";
import { appUrl } from "@/lib/urls";

// Returns an SVG QR code that links to the recipient's magic experience page.
// Printed on the physical letter so the child can scan it for their Santa video.
export async function GET(_req: Request, ctx: RouteContext<"/api/magic/[token]/qr">) {
  const { token } = await ctx.params;
  const svg = await QRCode.toString(appUrl(`/magic/${token}`), {
    type: "svg",
    margin: 1,
    color: { dark: "#18432b", light: "#00000000" },
  });
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=3600" },
  });
}
