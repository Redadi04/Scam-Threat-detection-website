import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  FileCode,
  Mail,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import type { UploadedFileInfo } from "../types.js";

interface FileUploadZoneProps {
  onFileLoaded: (fileInfo: UploadedFileInfo) => void;
  onClearFile: () => void;
  currentFile: UploadedFileInfo | null;
  disabled?: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileLoaded,
  onClearFile,
  currentFile,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setIsProcessing(true);

    // Size limit check (max 15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage("File exceeds 15MB limit. Please upload a smaller file.");
      setIsProcessing(false);
      return;
    }

    try {
      const fileName = file.name;
      const fileExt = fileName.split(".").pop()?.toLowerCase() || "";
      const isImage = file.type.startsWith("image/") || ["png", "jpg", "jpeg", "webp"].includes(fileExt);
      const isPdf = file.type === "application/pdf" || fileExt === "pdf";
      const isTextReadable =
        file.type.startsWith("text/") ||
        ["txt", "eml", "msg", "json", "csv", "md", "html", "rtf", "log"].includes(fileExt);

      if (isTextReadable) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onFileLoaded({
            name: fileName,
            size: file.size,
            mimeType: file.type || "text/plain",
            extractedText: content,
          });
          setIsProcessing(false);
        };
        reader.onerror = () => {
          setErrorMessage("Failed to read text file.");
          setIsProcessing(false);
        };
        reader.readAsText(file);
      } else if (isImage || isPdf) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          // Extract base64 part
          const base64Data = dataUrl.split(",")[1] || "";
          const mime = file.type || (isPdf ? "application/pdf" : "image/png");

          onFileLoaded({
            name: fileName,
            size: file.size,
            mimeType: mime,
            dataBase64: base64Data,
            previewUrl: isImage ? dataUrl : undefined,
          });
          setIsProcessing(false);
        };
        reader.onerror = () => {
          setErrorMessage("Failed to read image or document file.");
          setIsProcessing(false);
        };
        reader.readAsDataURL(file);
      } else {
        // Fallback: try reading as text
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onFileLoaded({
            name: fileName,
            size: file.size,
            mimeType: file.type || "application/octet-stream",
            extractedText: content,
          });
          setIsProcessing(false);
        };
        reader.onerror = () => {
          setErrorMessage("Unsupported file format. Please upload PDF, images, or text documents.");
          setIsProcessing(false);
        };
        reader.readAsText(file);
      }
    } catch {
      setErrorMessage("An error occurred while loading the file.");
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    // reset input value so re-uploading the same file triggers change
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (mimeType: string, name: string) => {
    if (mimeType.startsWith("image/") || name.match(/\.(png|jpe?g|webp)$/i)) {
      return <ImageIcon className="w-5 h-5 text-indigo-500" />;
    }
    if (name.endsWith(".eml") || name.endsWith(".msg")) {
      return <Mail className="w-5 h-5 text-amber-500" />;
    }
    if (name.endsWith(".json") || name.endsWith(".csv")) {
      return <FileCode className="w-5 h-5 text-emerald-500" />;
    }
    return <FileText className="w-5 h-5 text-rose-500" />;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        id="scam-file-upload-input"
        name="scam_file_upload"
        accept=".txt,.pdf,.png,.jpg,.jpeg,.webp,.eml,.msg,.docx,.doc,.json,.csv,.rtf"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Drag & Drop Area when no file is active */}
      {!currentFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none ${
            isDragging
              ? "border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 scale-[1.01] shadow-md ring-2 ring-rose-200 dark:ring-rose-900/50"
              : "border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
            {isDragging ? "Drop your file right here" : "Click to upload or drag & drop file"}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-3">
            Upload a job offer letter, rental agreement, fake check screenshot, chat screenshot, or scam email.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">PDF</span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">PNG / JPG</span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">TXT / DOCX</span>
            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">EML / MSG</span>
            <span>· Max 15MB</span>
          </div>

          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 rounded-xl flex items-center justify-center backdrop-blur-xs">
              <span className="text-xs font-semibold text-rose-600 animate-pulse">Reading file data...</span>
            </div>
          )}
        </div>
      ) : (
        /* File Card when file is loaded */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              {currentFile.previewUrl ? (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={currentFile.previewUrl}
                    alt={currentFile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                  {getFileIcon(currentFile.mimeType, currentFile.name)}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate" title={currentFile.name}>
                    {currentFile.name}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    File Ready
                  </span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {formatFileSize(currentFile.size)} · {currentFile.mimeType}
                </div>

                {currentFile.extractedText && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1 italic font-mono">
                    "{currentFile.extractedText.slice(0, 100)}..."
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer"
              >
                Change
              </button>
              <button
                type="button"
                onClick={onClearFile}
                disabled={disabled}
                title="Remove file"
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
