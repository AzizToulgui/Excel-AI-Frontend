"use client";

import { useRef, useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import {
  formatFileSize,
  parseSpreadsheetFile,
  type ImportedFileInfo,
} from "@/lib/spreadsheet";
import { api } from "@/lib/api";

type FileUploadProps = {
  onSuccess?: () => void;
};

export default function FileUpload({ onSuccess }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [fileInfo, setFileInfo] = useState<ImportedFileInfo | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: api.saveUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      setFileInfo(null);
      setError(null);

      onSuccess?.();

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    setIsImporting(true);
    setError(null);

    try {
      const result = await parseSpreadsheetFile(file);

      setFileInfo(result.fileInfo);

      saveMutation.mutate(result.rows);
    } catch (uploadError) {
      setFileInfo(null);

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to read the uploaded file.",
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      {!fileInfo && (
        <div className="flex justify-center">
          <label
            htmlFor="spreadsheet-upload"
            className="group relative flex cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full border border-white/20 bg-white/10 px-8 py-4 font-medium text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Upload className="h-5 w-5" />
              <span>Upload Spreadsheet</span>
            </span>

            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <input
              ref={inputRef}
              id="spreadsheet-upload"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        </div>
      )}

      {fileInfo && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
              <FileSpreadsheet className="h-6 w-6 text-white" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-white sm:text-base">
                  {fileInfo.name}
                </p>

                <Badge
                  variant="secondary"
                  className="border border-white/10 bg-white/10 text-white"
                >
                  Imported
                </Badge>
              </div>

              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                {formatFileSize(fileInfo.size)} · {fileInfo.rows} rows loaded
              </p>
            </div>
          </div>
        </div>
      )}

      {isImporting && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80 backdrop-blur-xl">
          Reading spreadsheet and normalizing rows...
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 backdrop-blur-xl">
          {error}
        </div>
      )}
    </div>
  );
}
