"use client";

import {
  ArrowRight,
  Clock3,
  FileCheck2,
  Infinity,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ApiError, apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { HistoryResponse, User, UserStats } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const { text, formatDate } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    Promise.all([
      apiFetch<User>("/auth/me"),
      apiFetch<UserStats>("/user/stats"),
      apiFetch<HistoryResponse>("/analysis/history?limit=5"),
    ])
      .then(([userData, statsData, historyData]) => {
        setUser(userData);
        setStats(statsData);
        setHistory(historyData);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) router.replace("/login");
        else setError(err instanceof Error ? err.message : text("Unable to load dashboard.", "Kontrol paneli yüklenemedi."));
      });
  }, [router]);

  if (!user || !stats || !history) {
    return (
      <section className="container-page py-16">
        <div className="surface animate-pulse p-8 text-sm text-slate-500">
          {error || text("Loading your dashboard...", "Kontrol paneliniz yükleniyor...")}
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-12">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">{text("YOUR WORKSPACE", "ÇALIŞMA ALANINIZ")}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{text("Welcome back", "Tekrar hoş geldiniz")}, {user.name.split(" ")[0]}</h1>
          <p className="mt-2 text-slate-500">{text("Track your progress and sharpen your next application.", "İlerlemenizi takip edin ve bir sonraki başvurunuzu güçlendirin.")}</p>
        </div>
        <Link href="/analyze" className="btn-primary">
          <Plus size={18} /> {text("Analyze new resume", "Yeni özgeçmiş analiz et")}
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="surface p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{text("Free access", "Ücretsiz erişim")}</p>
              <p className="mt-2 text-3xl font-bold">
                {text("Unlimited analyses", "Sınırsız analiz")}
              </p>
            </div>
            <span className="rounded-xl bg-brand-50 p-3 text-brand-600"><Infinity /></span>
          </div>
          <p className="mt-7 text-sm text-slate-500">
            {text("There is no analysis quota or paid plan.", "Analiz kotası veya ücretli plan bulunmuyor.")}
          </p>
        </div>
        <div className="surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{text("Completed analyses", "Tamamlanan analizler")}</p>
              <p className="mt-2 text-3xl font-bold">{stats.total_completed_analyses}</p>
            </div>
            <span className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><FileCheck2 /></span>
          </div>
          <p className="mt-7 text-sm text-slate-500">{text("All reports are private to your account.", "Tüm raporlar yalnızca hesabınıza özeldir.")}</p>
        </div>
      </div>

      <div className="surface mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="font-bold">{text("Recent analyses", "Son analizler")}</h2>
            <p className="mt-1 text-sm text-slate-500">{text("Your latest role comparisons.", "En son pozisyon karşılaştırmalarınız.")}</p>
          </div>
          <Link href="/history" className="text-sm font-semibold text-brand-600">{text("View all", "Tümünü gör")}</Link>
        </div>
        {history.items.length ? (
          <div className="divide-y divide-slate-100">
            {history.items.map((item) => (
              <Link
                key={item.id}
                href={`/history/${item.id}`}
                className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center"
              >
                <span className="rounded-xl bg-slate-100 p-3 text-slate-600"><FileCheck2 size={19} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{item.resume_filename}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock3 size={13} />
                    {formatDate(item.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{text("ATS score", "ATS puanı")}</p>
                    <p className="font-bold text-slate-900">{Math.round(item.ats_score)}/100</p>
                  </div>
                  <ArrowRight size={18} className="text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-500">{text("No analyses yet. Your first report will appear here.", "Henüz analiz yok. İlk raporunuz burada görünecek.")}</p>
            <Link href="/analyze" className="btn-primary mt-5">{text("Run first analysis", "İlk analizi başlat")}</Link>
          </div>
        )}
      </div>
    </section>
  );
}
