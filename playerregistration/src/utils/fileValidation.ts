// Upload rules shared by every file input: only PNG, JPEG and (for
// documents) PDF are accepted. HEIC, WebP, GIF, etc. are rejected.
import { MAX_INPUT_BYTES, MAX_UPLOAD_BYTES } from "./imageCompression";

const IMAGE_TYPES = ["image/png", "image/jpeg"];
const PDF_TYPE = "application/pdf";

/** `accept` value for picture-only inputs (profile photo, post/hero image). */
export const IMAGE_ACCEPT = "image/png,image/jpeg,.png,.jpg,.jpeg";
/** `accept` value for document inputs (ID card, slip, letters). */
export const DOCUMENT_ACCEPT = `${IMAGE_ACCEPT},application/pdf,.pdf`;

// PDFs can't be compressed in the browser, so they must already be small
export const MAX_PDF_BYTES = MAX_UPLOAD_BYTES; // 2 MB

export const isPdfFile = (file: File) => file.type === PDF_TYPE;

/** Returns an error message, or null if the file is acceptable. */
export const validateUploadFile = (
  file: File,
  { allowPdf }: { allowPdf: boolean }
): string | null => {
  if (allowPdf && isPdfFile(file)) {
    return file.size > MAX_PDF_BYTES
      ? "PDF size should be less than 2MB"
      : null;
  }
  if (!IMAGE_TYPES.includes(file.type)) {
    return allowPdf
      ? "Please select a PNG, JPEG or PDF file"
      : "Please select a PNG or JPEG image";
  }
  if (file.size > MAX_INPUT_BYTES) {
    return "File size should be less than 20MB";
  }
  return null;
};

/** Placeholder image (data URL) shown in place of a preview for PDFs. */
export const pdfPlaceholder = (fileName: string): string => {
  const name = fileName.length > 34 ? `${fileName.slice(0, 31)}...` : fileName;
  const escaped = name.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
<rect width="400" height="300" fill="#f3f4f6"/>
<rect x="160" y="70" width="80" height="100" rx="8" fill="#dc2626"/>
<text x="200" y="130" font-family="sans-serif" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle">PDF</text>
<text x="200" y="210" font-family="sans-serif" font-size="16" fill="#374151" text-anchor="middle">${escaped}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const isPdfUrl = (url?: string | null) =>
  !!url && /\.pdf(\?|#|$)/i.test(url);

/**
 * Image URL for displaying an uploaded file. For a Cloudinary PDF this is
 * a JPG render of its first page; other URLs are returned unchanged.
 */
export const toDisplayImageUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  if (isPdfUrl(url) && url.includes("res.cloudinary.com")) {
    return url.replace(/\.pdf(?=(\?|#|$))/i, ".jpg");
  }
  return url;
};
