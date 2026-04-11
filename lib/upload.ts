export async function uploadImage(
  file: File,
  bucket: "blog-images" | "gallery-images"
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Upload failed: ${errorDetails}`);
  }

  const data = await response.json();
  return data.url;
}
