import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import sharp from 'sharp';

const ASSETS_DIR = join(process.cwd(), 'public/assets');

const JOBS: Array<{ input: string; output: string; maxWidth: number; quality: number }> = [
  { input: 'ph-arch-1.png', output: 'ph-arch-1.webp', maxWidth: 1920, quality: 82 },
  { input: 'ph-arch-2.png', output: 'ph-arch-2.webp', maxWidth: 1920, quality: 82 },
  { input: 'ph-arch-3.png', output: 'ph-arch-3.webp', maxWidth: 1920, quality: 82 },
  { input: 'ph-arch-4.png', output: 'ph-arch-4.webp', maxWidth: 1920, quality: 82 },
  { input: 'quality-layers-house.jpg', output: 'quality-layers-house.webp', maxWidth: 1600, quality: 82 },
];

async function optimize(input: string, output: string, maxWidth: number, quality: number) {
  const inputPath = join(ASSETS_DIR, input);
  const outputPath = join(ASSETS_DIR, output);
  mkdirSync(dirname(outputPath), { recursive: true });

  const info = await sharp(inputPath)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath);

  console.log(`${input} → ${output} (${(info.size / 1024).toFixed(0)} KB, ${info.width}×${info.height})`);
}

for (const job of JOBS) {
  await optimize(job.input, job.output, job.maxWidth, job.quality);
}

console.log('Asset optimization complete.');
