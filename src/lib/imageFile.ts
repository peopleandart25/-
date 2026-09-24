function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 열 수 없습니다."));
    image.src = src;
  });
}

function compressDataUrl(
  image: HTMLImageElement,
  maxEdge: number,
  quality: number,
) {
  const longest = Math.max(image.width, image.height);
  const scale = longest > maxEdge ? maxEdge / longest : 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d");
  if (!context) return image.src;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

/** FileReader로 Base64를 만들고, localStorage 용량을 위해 리사이즈합니다. */
export function readImageFile(
  file: File,
  maxEdge = 1600,
  quality = 0.8,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    return Promise.reject(new Error("이미지 파일만 업로드할 수 있습니다."));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다."));
    reader.onload = async () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("파일을 읽을 수 없습니다."));
        return;
      }
      try {
        const image = await loadImage(result);
        resolve(compressDataUrl(image, maxEdge, quality));
      } catch {
        resolve(result);
      }
    };
    reader.readAsDataURL(file);
  });
}
