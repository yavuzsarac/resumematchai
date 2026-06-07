"use client";

import { ArrowRight, Calendar, FileText, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ApiError, apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { HistoryResponse } from "@/lib/types";

export default function HistoryPage() {
  const router = useRouter();
  const { text, formatDate } = useLanguage();
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    apiFetch<HistoryResponse>("/analysis/history?limit=100")
      .then(setHistory)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) router.replace("/login");
        else setError(err instanceof Error ? err.message : text("Unable to load history.", "Analiz geçmişi yüklenemedi."));
      });
  }, [router]);

  const items = useMemo(
    () =>
      history?.items.filter((item) =>
        item.resume_filename.toLowerCase().includes(query.toLowerCase()),
      ) || [],
    [history, query],
  );

  return (
    <section className="container-page py-12">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">{text("ANALYSIS HISTORY", "ANALİZ GEÇMİŞİ")}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{text("Your previous reports", "Önceki raporlarınız")}</h1>
          <p className="mt-2 text-slate-500">{text("Revisit every role comparison saved to your account.", "Hesabınıza kaydedilen tüm pozisyon karşılaştırmalarını yeniden inceleyin.")}</p>
        </div>
        <Link href="/analyze" className="btn-primary">{text("New analysis", "Yeni analiz")}</Link>
      </div>

      <div className="surface mt-8 overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <label className="relative block max-w-sm">
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
            <input
              className="input !pl-11"
              placeholder={text("Search by filename", "Dosya adına göre ara")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        {!history ? (
          <div className="p-10 text-center text-sm text-slate-500">{error || text("Loading history...", "Geçmiş yükleniyor...")}</div>
        ) : items.length ? (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/history/${item.id}`}
                className="grid gap-5 p-6 transition hover:bg-slate-50 md:grid-cols-[1fr_auto_auto_auto_auto] md:items-center"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span className="rounded-xl bg-brand-50 p-3 text-brand-600"><FileText size={19} /></span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{item.resume_filename}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={13} />
                      {formatDate(item.created_at, true)}
                    </p>
                  </div>
                </div>
                {[
                  ["ATS", item.ats_score],
                  [text("Skills", "Beceriler"), item.skill_match_score],
                  [text("Semantic", "Anlamsal"), item.semantic_similarity_score],
                ].map(([label, score]) => (
                  <div key={String(label)} className="min-w-20">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 font-bold">{Math.round(Number(score))}/100</p>
                  </div>
                ))}
                <ArrowRight className="text-slate-400" size={18} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-500">
              {query
                ? text("No reports match that filename.", "Bu dosya adıyla eşleşen rapor bulunamadı.")
                : text("No analyses saved yet.", "Henüz kaydedilmiş analiz yok.")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
