import api from "../../../../lib/axios.js";

export const getProductImagePresignedUrlApi = async ({
  fileName,
  fileType,
}) => {
  const response = await api.get("/admin/uploads/presigned-url", {
    params: { fileName, fileType },
  });
  return response.data;
};
