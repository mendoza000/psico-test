// Genera public/og.png (1200×630) para los previews al compartir el link.
// Uso: node scripts/generate-og.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "../public/og.png");

const FONT = "Segoe UI, Arial, Helvetica, sans-serif";

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="1" stop-color="#1e293b"/>
    </linearGradient>
    <radialGradient id="glow" cx="88%" cy="12%" r="55%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- marco sutil -->
  <rect x="24" y="24" width="1152" height="582" rx="28" fill="none"
        stroke="#334155" stroke-width="2"/>

  <!-- barra de acento -->
  <rect x="80" y="104" width="64" height="6" rx="3" fill="#34d399"/>

  <text x="80" y="158" font-family="${FONT}" font-size="26" font-weight="600"
        letter-spacing="4" fill="#34d399">HERRAMIENTA DE ORIENTACIÓN</text>

  <text x="80" y="288" font-family="${FONT}" font-size="68" font-weight="700"
        fill="#f8fafc">Cuestionario orientativo</text>
  <text x="80" y="372" font-family="${FONT}" font-size="68" font-weight="700"
        fill="#f8fafc">del espectro autista (TEA)</text>

  <text x="80" y="446" font-family="${FONT}" font-size="34" font-weight="400"
        fill="#cbd5e1">Tamizaje basado en los criterios del DSM-5-TR.</text>

  <!-- pie -->
  <rect x="80" y="512" width="1040" height="1.5" fill="#334155"/>
  <text x="80" y="566" font-family="${FONT}" font-size="27" font-weight="500"
        fill="#94a3b8">psico-test-cuestionario.vercel.app</text>
  <text x="1120" y="566" text-anchor="end" font-family="${FONT}" font-size="27"
        font-weight="500" fill="#64748b">No diagnóstica · solo orientativa</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log("OG generada en", out);

// Favicons PNG desde el mismo motivo de marca (barras tipo "pasos").
const iconSvg = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="#0f172a"/>
  <rect x="8" y="18" width="4" height="6" rx="2" fill="#34d399"/>
  <rect x="14" y="13" width="4" height="11" rx="2" fill="#34d399"/>
  <rect x="20" y="8" width="4" height="16" rx="2" fill="#34d399"/>
</svg>`;

await sharp(Buffer.from(iconSvg))
  .resize(32, 32)
  .png()
  .toFile(resolve(__dirname, "../public/favicon-32.png"));
await sharp(Buffer.from(iconSvg))
  .resize(180, 180)
  .png()
  .toFile(resolve(__dirname, "../public/apple-touch-icon.png"));
console.log("Favicons PNG generados");
