"use client";

import { FileClock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ApiError, apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { User } from "@/lib/types";

export default function AccountPage() {
  const router = useRouter();
  const { text, formatDate } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    apiFetch<User>("/user/profile")
      .then(setUser)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) router.replace("/login");
        else setError(err instanceof Error ? err.message : text("Unable to load account.", "Hesap bilgileri yüklenemedi."));
      });
  }, [router]);

  if (!user) {
    return <section className="container-page py-12"><div className="surface p-8 text-sm text-slate-500">{error || text("Loading account...", "Hesap yükleniyor...")}</div></section>;
  }

  return (
    <section className="container-page py-12">
      <div>
        <p className="eyebrow">{text("ACCOUNT", "HESAP")}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">{text("Profile and privacy", "Profil ve gizlilik")}</h1>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_.8fr]">
        <div className="surface p-7">
          <h2 className="font-bold">{text("Profile details", "Profil bilgileri")}</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
              <UserRound className="text-brand-600" />
              <div><p className="text-xs text-slate-400">{text("Name", "Ad soyad")}</p><p className="font-semibold">{user.name}</p></div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
              <Mail className="text-brand-600" />
              <div><p className="text-xs text-slate-400">{text("Email", "E-posta")}</p><p className="font-semibold">{user.email}</p></div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
              <ShieldCheck className="text-brand-600" />
              <div><p className="text-xs text-slate-400">{text("Member since", "Üyelik tarihi")}</p><p className="font-semibold">{formatDate(user.created_at)}</p></div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-950 p-7 text-white shadow-soft">
          <FileClock className="text-brand-300" />
          <p className="mt-5 text-sm font-bold uppercase tracking-widest text-slate-300">
            {text("YOUR DATA", "VERİLERİNİZ")}
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {text("Private analysis history", "Kişisel analiz geçmişi")}
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-slate-200">
            {[
              text("Only you can view your saved reports", "Kayıtlı raporlarınızı yalnızca siz görebilirsiniz"),
              text("Uploaded resume files are not permanently stored", "Yüklenen özgeçmiş dosyaları kalıcı olarak saklanmaz"),
              text("Resume analysis is completely free", "Özgeçmiş analizi tamamen ücretsizdir"),
            ].map((feature) => <li key={feature}>• {feature}</li>)}
          </ul>
          {error && <p className="mt-4 rounded-lg bg-rose-500/20 p-3 text-xs text-rose-100">{error}</p>}
        </div>
      </div>
    </section>
  );
}
