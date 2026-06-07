"use client";

import { ArrowRight, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { ApiError, apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { AuthResponse } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const { text } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(response.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : text("Unable to log in.", "Giriş yapılamadı."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-page grid min-h-[calc(100vh-4rem)] place-items-center py-12">
      <div className="surface w-full max-w-md p-7 sm:p-9">
        <span className="inline-flex rounded-xl bg-brand-50 p-3 text-brand-600">
          <LockKeyhole size={22} />
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">{text("Welcome back", "Tekrar hoş geldiniz")}</h1>
        <p className="mt-2 text-sm text-slate-500">{text("Continue improving your next application.", "Bir sonraki başvurunuzu geliştirmeye devam edin.")}</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">{text("Email", "E-posta")}</span>
            <input
              type="email"
              required
              autoComplete="email"
              className="input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">{text("Password", "Şifre")}</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={text("Your password", "Şifreniz")}
            />
          </label>
          {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">
            {loading ? text("Signing in...", "Giriş yapılıyor...") : text("Login", "Giriş yap")} {!loading && <ArrowRight size={17} />}
          </button>
        </form>
        <p className="mt-7 text-center text-sm text-slate-500">
          {text("New to ResumeMatch AI?", "ResumeMatch AI'ı ilk kez mi kullanıyorsunuz?")}{" "}
          <Link href="/register" className="font-semibold text-brand-600">{text("Create an account", "Hesap oluştur")}</Link>
        </p>
      </div>
    </section>
  );
}
