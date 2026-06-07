"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

import AnalysisResult from "@/components/AnalysisResult";
import { ApiError, apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { Analysis } from "@/lib/types";

export default function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { text, formatDate } = useLanguage();
  const { id } = use(params);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    apiFetch<Analysis>(`/analysis/${id}`)
      .then(setAnalysis)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) router.replace("/login");
        else setError(err instanceof Error ? err.message : text("Unable to load this report.", "Bu rapor yüklenemedi."));
      });
  }, [id, router]);

  return (
    <section className="container-page py-12">
      <Link href="/history" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-600">
        <ArrowLeft size={17} /> {text("Back to history", "Geçmişe dön")}
      </Link>
      {!analysis ? (
        <div className="surface mt-7 p-8 text-sm text-slate-500">{error || text("Loading report...", "Rapor yükleniyor...")}</div>
      ) : (
        <>
          <div className="my-7">
            <p className="eyebrow">{text("SAVED REPORT", "KAYITLI RAPOR")}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">{analysis.resume_filename}</h1>
            <p className="mt-2 text-sm text-slate-500">
              {text("Analyzed", "Analiz tarihi")}: {formatDate(analysis.created_at, true)}
            </p>
          </div>
          <AnalysisResult analysis={analysis} />
        </>
      )}
    </section>
  );
}
