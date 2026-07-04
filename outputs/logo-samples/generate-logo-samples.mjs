import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = process.cwd();
const outputDir = path.join(root, "outputs/logo-samples");
const sourcePath = path.join(root, "packages/ui/src/assets/logo-icon-source.png");

const options = [
  {
    id: "option-1-trust-blue",
    name: "Option 1",
    title: "Trust Blue",
    summary: "Closest to current: stable, SaaS, dependable.",
    primary: "#0F3E7C",
    darkMark: "#F8FAFC",
    darkSurface: "#07111F",
    appSurface: "#F8FAFC",
    appRing: "#D6E4F7",
    accent: "#38BDF8",
    devAccent: "#F59E0B",
  },
  {
    id: "option-2-land-growth",
    name: "Option 2",
    title: "Land + Growth",
    summary: "More estate/land focused, calmer and organic.",
    primary: "#14532D",
    darkMark: "#ECFDF5",
    darkSurface: "#052E16",
    appSurface: "#F0FDF4",
    appRing: "#BBF7D0",
    accent: "#84CC16",
    devAccent: "#A3E635",
  },
  {
    id: "option-3-premium-property",
    name: "Option 3",
    title: "Premium Property",
    summary: "Investor-ready, polished, more premium.",
    primary: "#16324F",
    darkMark: "#F7F1E3",
    darkSurface: "#0B1726",
    appSurface: "#FBF7EF",
    appRing: "#E8D8B8",
    accent: "#C9A227",
    devAccent: "#D6AE2D",
  },
  {
    id: "option-4-builder-tech",
    name: "Option 4",
    title: "Builder Tech",
    summary: "Sharper product/ops feel with construction energy.",
    primary: "#172554",
    darkMark: "#E0F2FE",
    darkSurface: "#0F172A",
    appSurface: "#EFF6FF",
    appRing: "#BFDBFE",
    accent: "#F97316",
    devAccent: "#F97316",
  },
];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function dataUri(buffer) {
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

async function tintedLogo({ color, height, width }) {
  const resizedSource = sharp(sourcePath)
    .ensureAlpha()
    .resize(width, height, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    });
  const alpha = await resizedSource.clone().extractChannel("alpha").toBuffer();

  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: color,
    },
  })
    .joinChannel(alpha)
    .png()
    .toBuffer();
}

function swatch(x, y, color, label) {
  return `<g>
    <rect x="${x}" y="${y}" width="56" height="56" rx="14" fill="${color}"/>
    <text x="${x + 70}" y="${y + 23}" fill="#111827" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700">${escapeXml(label)}</text>
    <text x="${x + 70}" y="${y + 48}" fill="#64748B" font-family="Inter, Arial, sans-serif" font-size="15">${color}</text>
  </g>`;
}

function appIconSvg({ option, markUri, dev = false }) {
  const badge = dev
    ? `<g>
      <rect x="326" y="64" width="122" height="58" rx="29" fill="#111827"/>
      <circle cx="356" cy="93" r="9" fill="#22C55E"/>
      <path d="M392 79 377 94l15 15" fill="none" stroke="#F8FAFC" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M414 79 429 94l-15 15" fill="none" stroke="#F8FAFC" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="104" fill="${dev ? option.devAccent : option.appSurface}"/>
    <rect x="28" y="28" width="456" height="456" rx="86" fill="none" stroke="${dev ? "#FDE68A" : option.appRing}" stroke-width="16"/>
    <circle cx="418" cy="110" r="52" fill="${dev ? "#111827" : option.accent}" opacity="${dev ? "0.18" : "0.2"}"/>
    <image href="${markUri}" x="86" y="74" width="340" height="365" preserveAspectRatio="xMidYMid meet"/>
    ${badge}
  </svg>`;
}

async function renderOption(option) {
  const lightLogo = await tintedLogo({
    color: option.primary,
    height: 512,
    width: 512,
  });
  const darkLogo = await tintedLogo({
    color: option.darkMark,
    height: 512,
    width: 512,
  });
  const appMark = await tintedLogo({
    color: option.primary,
    height: 365,
    width: 340,
  });
  const lightUri = dataUri(lightLogo);
  const darkUri = dataUri(darkLogo);
  const appUri = dataUri(appMark);
  const appIcon = await sharp(Buffer.from(appIconSvg({ option, markUri: appUri })))
    .png()
    .toBuffer();
  const devIcon = await sharp(
    Buffer.from(appIconSvg({ dev: true, option, markUri: appUri })),
  )
    .png()
    .toBuffer();

  const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="760" viewBox="0 0 1100 760">
    <rect width="1100" height="760" rx="36" fill="#FFFFFF"/>
    <rect x="1" y="1" width="1098" height="758" rx="35" fill="none" stroke="#E5E7EB" stroke-width="2"/>
    <text x="54" y="78" fill="#0F172A" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="800">${escapeXml(option.name)}: ${escapeXml(option.title)}</text>
    <text x="54" y="116" fill="#64748B" font-family="Inter, Arial, sans-serif" font-size="18">${escapeXml(option.summary)}</text>

    <rect x="54" y="156" width="206" height="206" rx="28" fill="#FFFFFF" stroke="#E2E8F0"/>
    <image href="${lightUri}" x="82" y="184" width="150" height="150" preserveAspectRatio="xMidYMid meet"/>
    <text x="54" y="405" fill="#0F172A" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700">Light mark</text>

    <rect x="300" y="156" width="206" height="206" rx="28" fill="${option.darkSurface}"/>
    <image href="${darkUri}" x="328" y="184" width="150" height="150" preserveAspectRatio="xMidYMid meet"/>
    <text x="300" y="405" fill="#0F172A" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700">Dark mark</text>

    <rect x="546" y="156" width="206" height="206" rx="28" fill="#FFFFFF" stroke="#E2E8F0"/>
    <image href="${dataUri(appIcon)}" x="581" y="191" width="136" height="136" preserveAspectRatio="xMidYMid meet"/>
    <text x="546" y="405" fill="#0F172A" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700">App icon</text>

    <rect x="792" y="156" width="206" height="206" rx="28" fill="#FFFFFF" stroke="#E2E8F0"/>
    <image href="${dataUri(devIcon)}" x="827" y="191" width="136" height="136" preserveAspectRatio="xMidYMid meet"/>
    <text x="792" y="405" fill="#0F172A" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700">Dev icon</text>

    ${swatch(54, 470, option.primary, "Primary")}
    ${swatch(54, 548, option.darkSurface, "Dark surface")}
    ${swatch(380, 470, option.accent, "Accent")}
    ${swatch(380, 548, option.devAccent, "Dev accent")}
    ${swatch(706, 470, option.appSurface, "App surface")}
    ${swatch(706, 548, option.appRing, "App ring")}
  </svg>`;

  const file = path.join(outputDir, `${option.id}.png`);
  await sharp(Buffer.from(card)).png().toFile(file);
  return { file, png: await sharp(Buffer.from(card)).png().toBuffer() };
}

await mkdir(outputDir, { recursive: true });

const rendered = [];
for (const option of options) {
  rendered.push(await renderOption(option));
}

const boardImages = rendered
  .map(
    ({ png }, index) =>
      `<image href="${dataUri(png)}" x="${index % 2 === 0 ? 40 : 1180}" y="${index < 2 ? 116 : 916}" width="1100" height="760"/>`,
  )
  .join("");

const board = `<svg xmlns="http://www.w3.org/2000/svg" width="2320" height="1720" viewBox="0 0 2320 1720">
  <rect width="2320" height="1720" fill="#F8FAFC"/>
  <text x="40" y="66" fill="#0F172A" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="850">PlotKeys logo color redesign samples</text>
  <text x="40" y="98" fill="#64748B" font-family="Inter, Arial, sans-serif" font-size="18">Preview only. Generated from packages/ui/src/assets/logo-icon-source.png.</text>
  ${boardImages}
</svg>`;

await sharp(Buffer.from(board))
  .png()
  .toFile(path.join(outputDir, "plotkeys-logo-sample-board.png"));

console.log(`Generated ${rendered.length} logo sample cards in ${outputDir}`);
