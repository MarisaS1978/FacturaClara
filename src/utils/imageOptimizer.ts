/**
 * Optimizes invoice images client-side prior to uploading to avoid 
 * payload-too-large errors, timeout issues, and memory spikes on mobile devices.
 * Retains high resolution (up to 2048px) for optimal OCR quality with Gemini.
 */
export async function optimizeBillFile(file: File): Promise<{
  dataUrl: string;
  mimeType: string;
  fileName: string;
}> {
  // If it's a PDF, we cannot resize on canvas; pass directly as Base64 data URI
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          mimeType: 'application/pdf',
          fileName: file.name,
        });
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo PDF.'));
      reader.readAsDataURL(file);
    });
  }

  // If it's an image, resize to max 2048px dimension and compress to JPEG 0.85
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        try {
          const MAX_DIMENSION = 2048;
          let width = img.width;
          let height = img.height;

          // If image is huge (e.g. 48MP phone photo), downscale proportionally
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = Math.round((height * MAX_DIMENSION) / width);
              width = MAX_DIMENSION;
            } else {
              width = Math.round((width * MAX_DIMENSION) / height);
              height = MAX_DIMENSION;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            return resolve({
              dataUrl: rawDataUrl,
              mimeType: file.type || 'image/jpeg',
              fileName: file.name,
            });
          }

          // Use white background to prevent transparent PNG issues with OCR
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG 0.85 (best balance of crisp text and small payload)
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

          resolve({
            dataUrl: optimizedDataUrl,
            mimeType: 'image/jpeg',
            fileName: file.name.replace(/\.[^.]+$/, '') + '.jpg',
          });
        } catch (canvasErr) {
          console.warn('Canvas optimization error, using original:', canvasErr);
          resolve({
            dataUrl: rawDataUrl,
            mimeType: file.type || 'image/jpeg',
            fileName: file.name,
          });
        }
      };

      img.onerror = () => {
        resolve({
          dataUrl: rawDataUrl,
          mimeType: file.type || 'image/jpeg',
          fileName: file.name,
        });
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => {
      throw new Error('Error al leer el archivo de imagen.');
    };

    reader.readAsDataURL(file);
  });
}
