import { useRef, useState } from "react";
import { ImagePlus, UploadCloud } from "lucide-react";
import { toast } from "sonner";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function validateFiles(fileList) {
  const files = Array.from(fileList ?? []);
  const validFiles = [];

  for (const file of files) {
    if (!ACCEPTED_TYPES.has(file.type)) {
      toast.error(
        `${file.name}: Only JPG, PNG, and WebP images are supported.`,
      );
      continue;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${file.name}: Image size cannot exceed 10 MB.`);
      continue;
    }
    validFiles.push(file);
  }
  return validFiles;
}

export default function ImageDropzone({ onFiles, disabled = false }) {
  const inputRef = useRef(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const handleFiles = (fileList) => {
    if (disabled) return;
    const files = validateFiles(fileList);
    if (!files.length) return;
    onFiles?.(files);
  };

  const handleInputChange = (event) => {
    handleFiles(event.target.files);
    event.target.value = "";
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    const hasFiles = Array.from(event.dataTransfer?.items ?? []).some(
      (item) => item.kind === "file",
    );
    if (hasFiles) setIsDraggingFile(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) {
      event.dataTransfer.dropEffect = "none";
      return;
    }
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget === event.target) {
      setIsDraggingFile(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingFile(false);
    if (disabled) return;
    handleFiles(event.dataTransfer?.files);
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleKeyDown = (event) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        "relative flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition",
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
          : isDraggingFile
            ? "border-indigo-500 bg-indigo-50"
            : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={disabled}
        onChange={handleInputChange}
        className="hidden"
      />
      <div
        className={[
          "mb-3 flex h-12 w-12 items-center justify-center rounded-xl",
          isDraggingFile
            ? "bg-indigo-100 text-indigo-700"
            : "bg-white text-indigo-600 shadow-sm",
        ].join(" ")}
      >
        {isDraggingFile ? <UploadCloud size={24} /> : <ImagePlus size={24} />}
      </div>
      <p className="text-sm font-bold text-slate-800">
        {isDraggingFile
          ? "Drop images here"
          : "Drag & drop product images here"}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        or click to select images from your computer
      </p>
      <p className="mt-2 text-[11px] text-slate-400">
        JPG, PNG, WebP • Maximum 10 MB per image
      </p>
    </div>
  );
}
