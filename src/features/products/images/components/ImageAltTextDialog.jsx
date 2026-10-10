import { useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const imageAltSchema = z.object({
  alt_text: z.string().trim().max(255, "Alt text cannot exceed 255 characters"),
});

export default function ImageAltTextDialog({
  image,
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(imageAltSchema),
    defaultValues: { alt_text: "" },
  });

  useEffect(() => {
    if (!open || !image) return;
    reset({ alt_text: image.alt_text ?? "" });
  }, [open, image, reset]);

  if (!open || !image) return null;

  const submitHandler = handleSubmit((values) => {
    onSubmit(values);
  });

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-alt-dialog-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2
              id="image-alt-dialog-title"
              className="text-base font-bold text-slate-900"
            >
              Edit image
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Update the image alt text.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <label
            htmlFor="image-alt-text"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Alt text
          </label>
          <textarea
            id="image-alt-text"
            rows={4}
            placeholder="Describe the product image..."
            disabled={isSubmitting}
            className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            {...register("alt_text")}
          />
          {errors.alt_text && (
            <p className="mt-1.5 text-xs font-medium text-red-600">
              {errors.alt_text.message}
            </p>
          )}
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitHandler}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={15} className="animate-spin" />}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
