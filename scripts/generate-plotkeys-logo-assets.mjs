import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pngToIcoModule from "png-to-ico";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const brandBlue = "#0F3E7C";
const appPublicDirs = [
  "apps/website/public",
  "apps/dashboard/public",
  "apps/tenant-site/public",
];
const appIconDirs = [
  "apps/website/src/app",
  "apps/dashboard/src/app",
  "apps/tenant-site/src/app",
];
const packageAssetsDir = "packages/ui/src/assets";
const pngToIco = pngToIcoModule.default ?? pngToIcoModule;
const wordmarkD =
  "M27.60 114.97L9.24 114.97L9.24 24.06L38.70 24.06Q55.44 24.06 60.52 25.42L60.52 25.42Q68.34 27.47 73.61 34.32Q78.88 41.18 78.88 52.03L78.88 52.03Q78.88 60.40 75.84 66.10Q72.80 71.81 68.12 75.07Q63.44 78.32 58.60 79.38L58.60 79.38Q52.03 80.68 39.56 80.68L39.56 80.68L27.60 80.68L27.60 114.97ZM36.46 39.44L27.60 39.44L27.60 65.24L37.64 65.24Q48.49 65.24 52.15 63.81Q55.81 62.38 57.89 59.35Q59.97 56.31 59.97 52.28L59.97 52.28Q59.97 47.31 57.05 44.09Q54.14 40.87 49.67 40.06L49.67 40.06Q46.38 39.44 36.46 39.44L36.46 39.44ZM111.25 114.97L93.82 114.97L93.82 24.06L111.25 24.06L111.25 114.97ZM125.08 81.11L125.08 81.11Q125.08 72.43 129.36 64.31Q133.64 56.18 141.48 51.90Q149.32 47.63 159.00 47.63L159.00 47.63Q173.94 47.63 183.49 57.33Q193.04 67.03 193.04 81.86L193.04 81.86Q193.04 96.80 183.40 106.63Q173.76 116.46 159.12 116.46L159.12 116.46Q150.07 116.46 141.85 112.37Q133.64 108.27 129.36 100.37Q125.08 92.46 125.08 81.11ZM142.94 82.04L142.94 82.04Q142.94 91.84 147.59 97.05Q152.24 102.26 159.06 102.26L159.06 102.26Q165.88 102.26 170.50 97.05Q175.12 91.84 175.12 81.92L175.12 81.92Q175.12 72.24 170.50 67.03Q165.88 61.83 159.06 61.83L159.06 61.83Q152.24 61.83 147.59 67.03Q142.94 72.24 142.94 82.04ZM224.98 49.11L236.88 49.11L236.88 63.00L224.98 63.00L224.98 89.54Q224.98 97.61 225.32 98.94Q225.66 100.27 226.87 101.14Q228.08 102.01 229.82 102.01L229.82 102.01Q232.23 102.01 236.82 100.33L236.82 100.33L238.31 113.85Q232.23 116.46 224.54 116.46L224.54 116.46Q219.83 116.46 216.05 114.88Q212.27 113.30 210.50 110.78Q208.73 108.27 208.05 103.99L208.05 103.99Q207.49 100.96 207.49 91.72L207.49 91.72L207.49 63.00L199.49 63.00L199.49 49.11L207.49 49.11L207.49 36.03L224.98 25.86L224.98 49.11ZM267.70 114.97L249.35 114.97L249.35 24.06L267.70 24.06L267.70 64.43L304.79 24.06L329.47 24.06L295.24 59.47L331.33 114.97L307.58 114.97L282.59 72.31L267.70 87.50L267.70 114.97ZM378.83 94.01L378.83 94.01L396.19 96.92Q392.84 106.47 385.62 111.47Q378.40 116.46 367.54 116.46L367.54 116.46Q350.37 116.46 342.12 105.23L342.12 105.23Q335.61 96.24 335.61 82.54L335.61 82.54Q335.61 66.17 344.17 56.90Q352.72 47.63 365.81 47.63L365.81 47.63Q380.50 47.63 389.00 57.33Q397.50 67.03 397.12 87.06L397.12 87.06L353.47 87.06Q353.65 94.82 357.68 99.13Q361.71 103.44 367.73 103.44L367.73 103.44Q371.82 103.44 374.61 101.20Q377.40 98.97 378.83 94.01ZM353.78 76.40L379.82 76.40Q379.64 68.83 375.92 64.90Q372.19 60.96 366.86 60.96L366.86 60.96Q361.16 60.96 357.44 65.11L357.44 65.11Q353.71 69.27 353.78 76.40L353.78 76.40ZM428.13 115.16L403.08 49.11L421.62 49.11L437.37 95.87L452.75 49.11L470.79 49.11L447.54 112.49L443.38 123.96Q441.09 129.73 439.01 132.77Q436.93 135.81 434.24 137.70Q431.54 139.59 427.60 140.64Q423.66 141.70 418.70 141.70L418.70 141.70Q413.68 141.70 408.84 140.64L408.84 140.64L407.29 127Q411.39 127.81 414.67 127.81L414.67 127.81Q420.75 127.81 423.66 124.24Q426.58 120.67 428.13 115.16L428.13 115.16ZM475.82 96.18L475.82 96.18L493.30 93.51Q494.42 98.60 497.83 101.23Q501.24 103.87 507.38 103.87L507.38 103.87Q514.14 103.87 517.55 101.39L517.55 101.39Q519.84 99.65 519.84 96.74L519.84 96.74Q519.84 94.75 518.60 93.45L518.60 93.45Q517.30 92.21 512.77 91.16L512.77 91.16Q491.69 86.51 486.05 82.66L486.05 82.66Q478.23 77.33 478.23 67.84L478.23 67.84Q478.23 59.28 484.99 53.45Q491.75 47.63 505.95 47.63L505.95 47.63Q519.47 47.63 526.05 52.03Q532.62 56.43 535.10 65.05L535.10 65.05L518.67 68.09Q517.61 64.24 514.67 62.20Q511.72 60.15 506.26 60.15L506.26 60.15Q499.38 60.15 496.40 62.07L496.40 62.07Q494.42 63.44 494.42 65.61L494.42 65.61Q494.42 67.47 496.16 68.77L496.16 68.77Q498.51 70.51 512.43 73.67Q526.36 76.83 531.87 81.42L531.87 81.42Q537.33 86.07 537.33 94.38L537.33 94.38Q537.33 103.44 529.77 109.95Q522.20 116.46 507.38 116.46L507.38 116.46Q493.92 116.46 486.08 111.00Q478.23 105.54 475.82 96.18Z";

const markSymbol = `
  <g fill="${brandBlue}">
    <path d="M3.8 58.5 96.6 1.6c3.9-2.4 8.9.4 8.9 5v52.1c0 3.2-2.6 5.8-5.8 5.8H5.9c-6 0-7.2-3.2-2.1-6Z"/>
    <path d="M119.5 6.4c0-4.7 5.2-7.6 9.2-5.1l27.9 17.2c2.6 1.6 4.2 4.5 4.2 7.6v32.6c0 3.2-2.6 5.8-5.8 5.8h-29.7c-3.2 0-5.8-2.6-5.8-5.8V6.4Z"/>
    <path d="M177.2 35.5c0-4.7 5.1-7.6 9.1-5.2l67.7 41.9c2.3 1.4 3.8 4 3.8 6.7v40.2c0 3.2-2.6 5.8-5.8 5.8h-69c-3.2 0-5.8-2.6-5.8-5.8V35.5Z"/>
    <rect width="43.3" height="76.4" y="80.6" rx="5"/>
    <rect width="103.5" height="42.6" x="58.6" y="80.6" rx="4.4"/>
    <path d="M0 175.1c0-3.2 2.6-5.8 5.8-5.8h31.7c3.2 0 5.8 2.6 5.8 5.8v79.6c0 4.3-4.6 7-8.3 4.9L4.4 242.2c-2.7-1.5-4.4-4.4-4.4-7.5v-59.6Z"/>
    <path fill-rule="evenodd" d="M58.6 173.7c0-2.5 2-4.4 4.4-4.4h98.2v76.6c0 2.9-1.5 5.6-4.1 7.1l-49.6 28.9c-2.2 1.3-5 1.3-7.2 0l-37.6-21.9c-2.5-1.5-4.1-4.2-4.1-7.1v-79.2Zm74.3 24.8c-17.2 0-31.2 13.9-31.2 31s14 31 31.2 31 31.1-13.9 31.1-31-13.9-31-31.1-31Z"/>
    <path d="M177.2 173.7c0-2.5 2-4.4 4.4-4.4h70.1c3.2 0 5.8 2.6 5.8 5.8v19.4c0 3.2-2.6 5.8-5.8 5.8h-54.3v30.7h37.5v31.2h-37.5v2.8c0 3-1.6 5.7-4.2 7.2l-7.5 4.4c-3.8 2.2-8.5-.5-8.5-4.9v-98Z"/>
  </g>`;

function logoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="PlotKeys logo mark">
  <g transform="translate(75 61) scale(1.409)">
${markSymbol}
  </g>
</svg>
`;
}

function wordmarkGroup(x, y) {
  return `<g transform="translate(${x} ${y}) scale(1.0524 1)" fill="${brandBlue}">
    <path d="${wordmarkD}"/>
  </g>`;
}

function horizontalSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 968 332" role="img" aria-label="PlotKeys logo">
  <g transform="translate(36 28)">
${markSymbol}
  </g>
  ${wordmarkGroup(360, 110)}
</svg>
`;
}

function verticalSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 672 573" role="img" aria-label="PlotKeys logo">
  <g transform="translate(200 44) scale(1.058)">
${markSymbol}
  </g>
  ${wordmarkGroup(50, 385)}
</svg>
`;
}

async function ensureDir(relativePath) {
  await mkdir(path.join(root, relativePath), { recursive: true });
}

async function write(relativePath, contents) {
  const target = path.join(root, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents);
}

async function copyFileFromCanonical(name, targetDir) {
  const source = path.join(root, packageAssetsDir, name);
  const contents = await readFile(source);
  await write(path.join(targetDir, name), contents);
}

async function renderPng(svgRelativePath, pngRelativePath, width, height) {
  const source = path.join(root, svgRelativePath);
  const target = path.join(root, pngRelativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await sharp(source)
    .resize(width, height, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(target);
}

async function renderFavicon(svgRelativePath, icoRelativePath) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "plotkeys-logo-"));
  const sizes = [16, 32, 48, 64, 128, 256];

  try {
    const pngPaths = [];

    for (const size of sizes) {
      const pngPath = path.join(tempDir, `favicon-${size}.png`);
      await sharp(path.join(root, svgRelativePath))
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(pngPath);
      pngPaths.push(pngPath);
    }

    const ico = await pngToIco(pngPaths);
    await write(icoRelativePath, ico);
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
}

async function main() {
  await ensureDir(packageAssetsDir);
  await write(path.join(packageAssetsDir, "logo.svg"), logoSvg());
  await write(
    path.join(packageAssetsDir, "logo-horizontal.svg"),
    horizontalSvg(),
  );
  await write(path.join(packageAssetsDir, "logo-vertical.svg"), verticalSvg());

  for (const publicDir of appPublicDirs) {
    await ensureDir(publicDir);
    await copyFileFromCanonical("logo.svg", publicDir);
    await copyFileFromCanonical("logo-horizontal.svg", publicDir);
    await copyFileFromCanonical("logo-vertical.svg", publicDir);
    await renderPng(
      path.join(packageAssetsDir, "logo.svg"),
      path.join(publicDir, "logo.png"),
      512,
      512,
    );
    await renderPng(
      path.join(packageAssetsDir, "logo-horizontal.svg"),
      path.join(publicDir, "logo-horizontal.png"),
      968,
      332,
    );
    await renderPng(
      path.join(packageAssetsDir, "logo-vertical.svg"),
      path.join(publicDir, "logo-vertical.png"),
      672,
      573,
    );
    await renderFavicon(
      path.join(packageAssetsDir, "logo.svg"),
      path.join(publicDir, "favicon.ico"),
    );
  }

  await renderPng(
    path.join(packageAssetsDir, "logo.svg"),
    path.join(packageAssetsDir, "logo.png"),
    512,
    512,
  );
  await renderPng(
    path.join(packageAssetsDir, "logo-horizontal.svg"),
    path.join(packageAssetsDir, "logo-horizontal.png"),
    968,
    332,
  );
  await renderPng(
    path.join(packageAssetsDir, "logo-vertical.svg"),
    path.join(packageAssetsDir, "logo-vertical.png"),
    672,
    573,
  );

  for (const iconDir of appIconDirs) {
    await renderPng(
      path.join(packageAssetsDir, "logo.svg"),
      path.join(iconDir, "icon.png"),
      512,
      512,
    );
    await renderPng(
      path.join(packageAssetsDir, "logo.svg"),
      path.join(iconDir, "apple-icon.png"),
      512,
      512,
    );
    await renderFavicon(
      path.join(packageAssetsDir, "logo.svg"),
      path.join(iconDir, "favicon.ico"),
    );
  }

  console.log(
    "Generated PlotKeys logo SVG, PNG, app icon, and favicon assets.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
