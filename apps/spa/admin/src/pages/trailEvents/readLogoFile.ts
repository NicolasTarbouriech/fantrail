const LOGO_MAX_SIDE = 256;
// Same limit as the API: above it, the event is refused.
const LOGO_MAX_BYTES = 100 * 1024;
const SUPPORTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
];

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('Impossible de lire le fichier.'));
    reader.onerror = () => reject(new Error('Impossible de lire le fichier.'));
    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Ce fichier n’est pas une image.'));
    image.src = src;
  });
}

function toBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, 0.9));
}

/** Shrinks the logo to 256 px at most, in WebP (PNG where the browser cannot encode WebP); an SVG goes as is. */
export async function readLogoFile(file: File): Promise<string> {
  if (!SUPPORTED_TYPES.includes(file.type)) {
    throw new Error('Choisis une image PNG, JPEG, WebP ou SVG.');
  }
  if (file.type === 'image/svg+xml') {
    if (file.size > LOGO_MAX_BYTES) {
      throw new Error('Le SVG dépasse 100 Ko.');
    }
    return readAsDataUrl(file);
  }
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(
      1,
      LOGO_MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight),
    );
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Ton navigateur ne sait pas réduire cette image.');
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const webp = await toBlob(canvas, 'image/webp');
    const blob =
      webp?.type === 'image/webp' ? webp : await toBlob(canvas, 'image/png');
    if (!blob) {
      throw new Error('Impossible de convertir cette image.');
    }
    if (blob.size > LOGO_MAX_BYTES) {
      throw new Error('Le logo dépasse 100 Ko même réduit.');
    }
    return readAsDataUrl(blob);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
