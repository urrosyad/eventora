import { useState, useRef } from "react";
import { Upload, File, X, AlertCircle } from "lucide-react";

interface FileUploadProps {
  label: string;
  accept: "pdf" | "image";
  onChange: (file: File | null) => void;
  error?: string;
  required?: boolean;
}

export function FileUpload({
  label,
  accept,
  onChange,
  error,
  required = false,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sizeError, setSizeError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileTypeLabel = accept === "pdf" ? "PDF document" : "Image (JPG, PNG, WEBP)";
  const acceptedTypesString = accept === "pdf" ? "application/pdf" : "image/jpeg,image/png,image/webp";
  const limitLabel = "Maximum file size is 10MB";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSizeError("");
    const file = e.target.files?.[0] || null;

    if (file) {
      // 10MB size check (10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setSizeError("File size exceeds the 10MB limit.");
        setSelectedFile(null);
        onChange(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Basic type validation fallback
      if (accept === "pdf" && file.type !== "application/pdf") {
        setSizeError("Invalid file type. Please upload a PDF.");
        setSelectedFile(null);
        onChange(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      } else if (accept === "image" && !file.type.startsWith("image/")) {
        setSizeError("Invalid file type. Please upload a JPG, PNG or WEBP image.");
        setSelectedFile(null);
        onChange(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setSelectedFile(file);
      onChange(file);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setSizeError("");
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-ink">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      {selectedFile ? (
        // File selected preview
        <div className="flex items-center justify-between p-3 border border-border bg-surface-soft/60 rounded-xl">
          <div className="flex items-center space-x-3 overflow-hidden">
            <File className="w-5 h-5 text-accent-blue flex-shrink-0" />
            <div className="truncate">
              <p className="text-sm font-medium text-ink truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-ink">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-muted-ink hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // Drag and drop zone / select button
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer hover:bg-surface-soft/40 transition-all ${
            error || sizeError ? "border-danger bg-danger/5" : "border-border hover:border-border-strong bg-white"
          }`}
        >
          <Upload className={`w-6 h-6 mb-2 ${error || sizeError ? "text-danger" : "text-silver"}`} />
          <p className="text-sm font-medium text-ink">Click to upload or drag file</p>
          <p className="text-xs text-muted-ink mt-1">
            {fileTypeLabel} &bull; {limitLabel}
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={acceptedTypesString}
            className="hidden"
          />
        </div>
      )}

      {(error || sizeError) && (
        <div className="flex items-center space-x-1.5 text-xs text-danger font-medium mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{sizeError || error}</span>
        </div>
      )}
    </div>
  );
}
