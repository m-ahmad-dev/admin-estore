import { getProductImagePresignedUrlApi } from "../api/productImageUpload.api.js";

export const uploadProductImage = async (file) => {
  if (!(file instanceof File)) {
    throw new Error("Invalid image file");
  }

  const response = await getProductImagePresignedUrlApi({
    fileName: file.name,
    fileType: file.type,
  });

  const data = response?.data ?? response;
  const uploadUrl = data?.uploadUrl ?? data?.url ?? data?.presignedUrl;
  const fileKey = data?.fileKey ?? data?.key;

  if (!uploadUrl || !fileKey) {
    throw new Error("Upload URL or file key was not returned by the server");
  }

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Image upload failed (${uploadResponse.status})`);
  }

  return { fileKey, uploadUrl };
};
