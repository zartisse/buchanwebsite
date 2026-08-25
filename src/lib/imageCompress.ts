export type ImageCompressPreset = 'hero' | 'card' | 'thumb';

const PRESETS: Record<ImageCompressPreset, { maxWidth: number; maxHeight: number; quality: number }> = {
  hero: { maxWidth: 2400, maxHeight: 1600, quality: 0.82 },
  card: { maxWidth: 1600, maxHeight: 1200, quality: 0.82 },
  thumb: { maxWidth: 800, maxHeight: 800, quality: 0.8 },
};

function inferPreset(folder: string): ImageCompressPreset {
  const f = folder.toLowerCase();
  if (f.includes('hero') || f.includes('closing') || f.includes('band') || f.includes('preconstruction')) {
    return 'hero';
  }
  if (f.includes('badge') || f.includes('award') || f.includes('team')) {
    return 'thumb';
  }
  return 'card';
}

export async function compressImageForUpload(file: File, folder: string): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  const preset = inferPreset(folder);
  const { maxWidth, maxHeight, quality } = PRESETS[preset];

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', quality);
  });
  if (!blob) return file;

  const base = file.name.replace(/\.[^.]+$/, '') || 'upload';
  return new File([blob], `${base}.webp`, { type: 'image/webp' });
}
