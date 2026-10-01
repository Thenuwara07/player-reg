// Client-side image compression so uploads stay small but readable.
// Phone photos (often 5–12 MB) are resized and re-encoded as JPEG in the
// browser before upload, targeting < 2 MB while keeping text on ID cards
// and payment slips sharp.

/** Size every uploaded image is reduced to (or below). */
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MB

/** Largest original file a user may pick; it is compressed before upload. */
export const MAX_INPUT_BYTES = 20 * 1024 * 1024; // 20 MB

// Long-side cap in pixels. 2560px keeps fine print legible on documents.
const MAX_DIMENSION = 2560;
// Quality range: start near-lossless, never go below "clearly good".
const START_QUALITY = 0.92;
const MIN_QUALITY = 0.7;
const QUALITY_STEP = 0.08;
// When quality alone is not enough, shrink dimensions by this factor.
const SCALE_STEP = 0.85;
const MAX_SCALE_STEPS = 8;

type Decoded = {
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
};

const decodeImage = async (file: File): Promise<Decoded> => {
  // createImageBitmap applies EXIF rotation so phone photos stay upright
  if ("createImageBitmap" in window) {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        release: () => bitmap.close(),
      };
    } catch {
      // fall through to <img> decoding
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
};

const encodeJpeg = (
  source: CanvasImageSource,
  width: number,
  height: number,
  quality: number
): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");

  // JPEG has no transparency: paint white so transparent PNGs don't turn black
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Image compression failed")),
      "image/jpeg",
      quality
    );
  });
};

const toJpegName = (name: string) =>
  `${name.replace(/\.[^.]+$/, "") || "image"}.jpg`;

/**
 * Returns an image no larger than `maxBytes`, as clear as possible.
 * Files that are already small enough are returned unchanged.
 */
export const compressImage = async (
  file: File,
  maxBytes: number = MAX_UPLOAD_BYTES
): Promise<File> => {
  if (!file.type.startsWith("image/")) return file;

  let decoded: Decoded;
  try {
    decoded = await decodeImage(file);
  } catch {
    // e.g. HEIC in browsers that can't read it
    if (file.size <= maxBytes) return file;
    throw new Error(
      "This image format can't be processed. Please choose a JPG or PNG image."
    );
  }

  try {
    const { source, width, height } = decoded;
    const longSide = Math.max(width, height);

    // Already small and not oversized: upload as-is to avoid any quality loss
    if (file.size <= maxBytes && longSide <= MAX_DIMENSION) return file;

    let scale = Math.min(1, MAX_DIMENSION / longSide);
    let best: Blob | null = null;

    for (let step = 0; step <= MAX_SCALE_STEPS; step++) {
      const w = Math.max(1, Math.round(width * scale));
      const h = Math.max(1, Math.round(height * scale));

      for (
        let quality = START_QUALITY;
        quality >= MIN_QUALITY - 1e-9;
        quality -= QUALITY_STEP
      ) {
        const blob = await encodeJpeg(source, w, h, quality);
        if (!best || blob.size < best.size) best = blob;
        if (blob.size <= maxBytes) {
          return new File([blob], toJpegName(file.name), {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
        }
      }
      scale *= SCALE_STEP;
    }

    // Practically unreachable; return the smallest version produced
    return new File([best!], toJpegName(file.name), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } finally {
    decoded.release();
  }
};
