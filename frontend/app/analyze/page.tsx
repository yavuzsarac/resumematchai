"use client";

import { ArrowRight, LoaderCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import AnalysisResult from "@/components/AnalysisResult";
import UploadBox from "@/components/UploadBox";
import { ApiError, apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { Analysis } from "@/lib/types";

export default function AnalyzePage() {
  const router = useRouter();
  const { locale, text } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) router.replace("/login");
  }, [router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      setError(text("Please upload your resume.", "Lütfen özgeçmişinizi yükleyin."));
      return;
    }
    if (jobDescription.trim().length < 40) {
      setError(text("Please paste a fuller job description before analyzing.", "Analizden önce lütfen daha ayrıntılı bir iş ilanı yapıştırın."));
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);
    const body = new FormData();
    body.append("resume_file", file);
    body.append("job_description", jobDescription);
    body.append("feedback_language", locale);

    try {
      const result = await apiFetch<Analysis>("/analysis/analyze", {
        method: "POST",
        body,
      });
      setAnalysis(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) router.replace("/login");
      else setError(err instanceof Error ? err.message : text("The analysis could not be completed.", "Analiz tamamlanamadı."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-page py-12">
      <div className="mx-auto max-w-5xl">
        <div>
          <p className="eyebrow">{text("NEW ANALYSIS", "YENİ ANALİZ")}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{text("Match your resume to a role", "Özgeçmişinizi pozisyonla eşleştirin")}</h1>
          <p className="mt-2 max-w-2xl text-slate-500">
            {text(
              "Upload your current resume and paste the complete job description for the clearest report.",
              "En net rapor için güncel özgeçmişinizi yükleyin ve iş ilanının tamamını yapıştırın.",
            )}
          </p>
        </div>

        {analysis ? (
          <div className="mt-9">
            <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center">
              <div>
                <p className="font-bold text-emerald-900">{text("Analysis complete", "Analiz tamamlandı")}</p>
                <p className="mt-1 text-sm text-emerald-700">{analysis.resume_filename}</p>
              </div>
              <button
                onClick={() => {
                  setAnalysis(null);
                  setFile(null);
                  setJobDescription("");
                }}
                className="btn-secondary"
              >
                {text("Analyze another resume", "Başka bir özgeçmiş analiz et")}
              </button>
            </div>
            <AnalysisResult analysis={analysis} />
          </div>
        ) : (
          <form onSubmit={submit} className="surface mt-9 p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">1</span>
                <div>
                  <h2 className="font-bold">{text("Upload your resume", "Özgeçmişinizi yükleyin")}</h2>
                  <p className="text-sm text-slate-500">{text("The original file is parsed but not permanently stored.", "Orijinal dosya işlenir ancak kalıcı olarak saklanmaz.")}</p>
                </div>
              </div>
              <div className="mt-5"><UploadBox file={file} onChange={setFile} /></div>
            </div>

            <div className="my-8 h-px bg-slate-200" />

            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">2</span>
                <div>
                  <h2 className="font-bold">{text("Paste the job description", "İş ilanını yapıştırın")}</h2>
                  <p className="text-sm text-slate-500">{text("Include responsibilities, requirements, and preferred qualifications.", "Sorumlulukları, gereksinimleri ve tercih edilen nitelikleri dahil edin.")}</p>
                </div>
              </div>
              <textarea
                required
                minLength={40}
                maxLength={30000}
                rows={13}
                className="input mt-5 resize-y leading-6"
                placeholder={text("Paste the complete job description here...", "İş ilanının tamamını buraya yapıştırın...")}
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
              />
              <p className="mt-2 text-right text-xs text-slate-400">{jobDescription.length.toLocaleString()} / 30,000</p>
            </div>

            {error && <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

            <button disabled={loading} className="btn-primary mt-7 w-full sm:w-auto">
              {loading ? (
                <><LoaderCircle className="animate-spin" size={18} /> {text("Analyzing your match...", "Eşleşmeniz analiz ediliyor...")}</>
              ) : (
                <><Sparkles size={18} /> {text("Analyze resume", "Özgeçmişi analiz et")} <ArrowRight size={17} /></>
              )}
            </button>
            {loading && (
              <p className="mt-3 text-xs text-slate-500">
                {text("Your analysis is being prepared.", "Analiziniz hazırlanıyor.")}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
