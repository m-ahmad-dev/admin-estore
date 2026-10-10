import { useEffect, useMemo, useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import ImageDropzone from "./ImageDropzone.jsx";
import ProductImageCard from "./ProductImageCard.jsx";
import ImageAltTextDialog from "./ImageAltTextDialog.jsx";

import useProductImages from "../hooks/useProductImages.js";
import {
  useAddProductImages,
  useDeleteProductImage,
  useSetProductImagePrimary,
  useUpdateProductImage,
  useReorderProductImages,
} from "../hooks/useProductImageMutations.js";

import { uploadProductImage } from "../utils/imageUpload.js";
import { getApiErrorMessage } from "../../../../lib/apiError.js";

function createLocalImage(file, index) {
  return {
    id: `local-${crypto.randomUUID()}`,
    local: true,
    file,
    url: URL.createObjectURL(file),
    key: "",
    alt_text: "",
    is_primary: index === 0,
    sort_order: index,
  };
}

function normalizeLocalImages(images) {
  return images.map((image, index) => ({
    ...image,
    sort_order: index,
    is_primary: Boolean(image.is_primary),
  }));
}

export default function ProductImagesManager({
  productId = null,
  canEdit = false,
  canDelete = false,
  mode = "edit",
  value = [],
  onChange,
  disabled = false,
}) {
  const isCreate = mode === "create";

  const {
    data: serverImages = [],
    isLoading,
    isError,
    error,
  } = useProductImages(productId, {
    enabled: Boolean(productId) && !isCreate,
  });

  const addImagesMutation = useAddProductImages();
  const deleteImageMutation = useDeleteProductImage();
  const setPrimaryMutation = useSetProductImagePrimary();
  const updateImageMutation = useUpdateProductImage();
  const reorderMutation = useReorderProductImages();

  const [editingImage, setEditingImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const images = isCreate ? value : serverImages;
  const sortedImages = useMemo(
    () => [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [images],
  );

  // Prevent browser from opening dropped files outside dropzone
  useEffect(() => {
    if (!isCreate && !canEdit) return undefined;

    const isFileDrag = (event) =>
      Array.from(event.dataTransfer?.items ?? []).some(
        (item) => item.kind === "file",
      );

    const handleWindowDragOver = (event) => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
    };

    const handleWindowDrop = (event) => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
    };

    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("drop", handleWindowDrop);

    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, [isCreate, canEdit]);

  // Cleanup local object URLs
  useEffect(() => {
    return () => {
      if (!isCreate) return;
      value.forEach((image) => {
        if (image?.local && image?.url?.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [isCreate, value]);

  const updateLocalImages = (nextImages) => {
    onChange?.(normalizeLocalImages(nextImages));
  };

  const handleFiles = async (files) => {
    if (!canEdit || disabled || !files?.length) return;

    if (isCreate) {
      const currentImages = [...value];
      const newImages = files.map((file, index) =>
        createLocalImage(file, currentImages.length + index),
      );
      let nextImages = [...currentImages, ...newImages];
      if (!nextImages.some((img) => img.is_primary)) {
        nextImages = nextImages.map((img, idx) => ({
          ...img,
          is_primary: idx === 0,
        }));
      }
      updateLocalImages(nextImages);
      return;
    }

    // Edit: upload and create DB records
    setIsUploading(true);
    try {
      const uploadedImages = [];
      for (const file of files) {
        try {
          const result = await uploadProductImage(file);
          uploadedImages.push({
            key: result.fileKey,
            alt_text: "",
            is_primary:
              sortedImages.length === 0 && uploadedImages.length === 0,
            sort_order: null,
          });
        } catch (uploadError) {
          toast.error(
            `${file.name}: ${uploadError.message || "Upload failed"}`,
          );
        }
      }
      if (!uploadedImages.length) return;
      await addImagesMutation.mutateAsync({
        productId,
        images: uploadedImages,
      });
      toast.success(
        uploadedImages.length === 1
          ? "Image uploaded successfully"
          : `${uploadedImages.length} images uploaded successfully`,
      );
    } catch (mutationError) {
      toast.error(
        getApiErrorMessage(mutationError, "Failed to add product images"),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = async (image) => {
    if (!canEdit || disabled) return;
    if (isCreate) {
      updateLocalImages(
        value.map((item) => ({
          ...item,
          is_primary: item.id === image.id,
        })),
      );
      return;
    }
    try {
      await setPrimaryMutation.mutateAsync({ productId, imageId: image.id });
      toast.success("Primary image updated");
    } catch (mutationError) {
      toast.error(
        getApiErrorMessage(mutationError, "Failed to set primary image"),
      );
    }
  };

  const handleUpdateAltText = async (values) => {
    if (!editingImage || disabled) return;
    if (isCreate) {
      updateLocalImages(
        value.map((img) =>
          img.id === editingImage.id
            ? { ...img, alt_text: values.alt_text.trim() }
            : img,
        ),
      );
      setEditingImage(null);
      return;
    }
    try {
      await updateImageMutation.mutateAsync({
        productId,
        imageId: editingImage.id,
        payload: { alt_text: values.alt_text.trim() },
      });
      toast.success("Image updated successfully");
      setEditingImage(null);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to update image"));
    }
  };

  const handleDelete = async (image) => {
    if (!canDelete || disabled) return;
    if (isCreate) {
      const nextImages = value.filter((item) => item.id !== image.id);
      if (image.is_primary && nextImages.length > 0) {
        nextImages[0] = { ...nextImages[0], is_primary: true };
      }
      if (image?.local && image?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(image.url);
      }
      updateLocalImages(nextImages);
      return;
    }
    if (!window.confirm("Delete this product image?")) return;
    try {
      await deleteImageMutation.mutateAsync({ productId, imageId: image.id });
      toast.success("Image deleted successfully");
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to delete image"));
    }
  };

  const handleDragStart = (event, index) => {
    if (!canEdit || disabled || isUploading) return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-product-image", String(index));
    setDraggedIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!canEdit || draggedIndex === null) return;
    const types = Array.from(event.dataTransfer?.types ?? []);
    if (!types.includes("application/x-product-image")) return;
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (event, targetIndex) => {
    event.preventDefault();
    event.stopPropagation();
    if (
      !canEdit ||
      disabled ||
      draggedIndex === null ||
      !Array.from(event.dataTransfer?.types ?? []).includes(
        "application/x-product-image",
      )
    ) {
      setDraggedIndex(null);
      return;
    }
    if (draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }
    const nextImages = [...sortedImages];
    const [movedImage] = nextImages.splice(draggedIndex, 1);
    nextImages.splice(targetIndex, 0, movedImage);
    const normalizedImages = nextImages.map((img, idx) => ({
      ...img,
      sort_order: idx,
    }));
    setDraggedIndex(null);

    if (isCreate) {
      updateLocalImages(normalizedImages);
      return;
    }
    try {
      await reorderMutation.mutateAsync({
        productId,
        imageIds: normalizedImages.map((img) => img.id),
      });
      toast.success("Image order updated");
    } catch (mutationError) {
      toast.error(
        getApiErrorMessage(mutationError, "Failed to reorder images"),
      );
    }
  };

  if (!isCreate && isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isCreate && isError) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
        {getApiErrorMessage(error, "Failed to load product images")}
      </div>
    );
  }

  const mutationsPending =
    setPrimaryMutation.isPending ||
    updateImageMutation.isPending ||
    deleteImageMutation.isPending ||
    reorderMutation.isPending;

  return (
    <>
      <section className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ImageIcon size={18} className="text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Product Images
              </h3>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Upload images, choose the primary image, edit alt text, and
              arrange display order.
            </p>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {sortedImages.length}{" "}
            {sortedImages.length === 1 ? "image" : "images"}
          </div>
        </div>

        {/* Show dropzone only if canEdit is true */}
        {canEdit && (
          <ImageDropzone
            onFiles={handleFiles}
            disabled={disabled || isUploading || addImagesMutation.isPending}
          />
        )}

        {isUploading && (
          <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
            <Loader2 size={16} className="animate-spin" />
            Uploading images...
          </div>
        )}

        {!sortedImages.length ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <ImageIcon size={30} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              No product images
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {canEdit
                ? "Use the upload area above to add images."
                : "No images available."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedImages.map((image, index) => (
              <ProductImageCard
                key={image.id}
                image={image}
                index={index}
                draggable={canEdit && !disabled}
                isDragging={draggedIndex === index}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={() => setDraggedIndex(null)}
                onSetPrimary={handleSetPrimary}
                onEditAlt={setEditingImage}
                onDelete={handleDelete}
                disabled={disabled || mutationsPending || isUploading}
              />
            ))}
          </div>
        )}
        {canEdit && (
          <p className="text-[11px] leading-5 text-slate-400">
            Drag existing cards to reorder them.
          </p>
        )}
      </section>

      <ImageAltTextDialog
        image={editingImage}
        open={Boolean(editingImage)}
        onClose={() => setEditingImage(null)}
        onSubmit={handleUpdateAltText}
        isSubmitting={updateImageMutation.isPending}
      />
    </>
  );
}
