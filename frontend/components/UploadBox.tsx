"use client";

import { FileText, UploadCloud, X } from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";

interface UploadBoxProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

const allowedExtensions = [".pdf", ".docx", ".txt"];

export default function UploadBox({ file, onChange }: UploadBoxProps) {
  const { text } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function acceptFile(candidate?: File) {
    if (!candidate) return;
    const extension = `.${candidate.name.split(".").pop()?.toLowerCase()}`;
    if (!allowedExtensions.includes(extension)) {
      setError(text("Please choose a PDF, DOCX, or TXT file.", "Lütfen PDF, DOCX veya TXT dosyası seçin."));
      return;
    }
    if (candidate.size > 8 * 1024 * 1024) {
      setError(text("The resume must be smaller than 8 MB.", "Özgeçmiş dosyası 8 MB'den küçük olmalıdır."));
      return;
    }
    setError("");
    onChange(candidate);
  }

  function onInput(event: ChangeEvent<HTMLInputElement>) {
    acceptFile(event.target.files?.[0]);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  }

  if (file) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-4">
          <span className="rounded-xl bg-white p-3 text-emerald-600 shadow-sm">
            <FileText />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
            <p className="mt-1 text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            aria-label={text("Remove file", "Dosyayı kaldır")}
            onClick={() => onChange(null)}
            className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-rose-600"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-9 text-center transition ${
          dragging
            ? "border-brand-500 bg-brand-50"
            : "border-slate-300 bg-slate-50/70 hover:border-brand-400 hover:bg-brand-50/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={onInput}
          className="hidden"
        />
        <UploadCloud className="mx-auto text-brand-600" size={34} />
        <p className="mt-4 text-sm font-semibold text-slate-800">
          {text("Drop your resume here or click to browse", "Özgeçmişinizi buraya bırakın veya dosya seçmek için tıklayın")}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {text("PDF, DOCX, or TXT up to 8 MB", "En fazla 8 MB boyutunda PDF, DOCX veya TXT")}
        </p>
      </div>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
