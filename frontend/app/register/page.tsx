"use client";

import { ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { ApiError, apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import { AuthResponse } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const { text } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (form.password !== form.confirm_password) {
      setError(text("Passwords do not match.", "Şifreler eşleşmiyor."));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setToken(response.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : text("Unable to create your account.", "Hesabınız oluşturulamadı."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-page grid min-h-[calc(100vh-4rem)] place-items-center py-12">
      <div className="surface w-full max-w-lg p-7 sm:p-9">
        <span className="inline-flex rounded-xl bg-brand-50 p-3 text-brand-600">
          <UserPlus size={22} />
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">{text("Create your free account", "Ücretsiz hesabınızı oluşturun")}</h1>
        <p className="mt-2 text-sm text-slate-500">{text("Analyze resumes for free and keep every report in your history.", "Özgeçmişlerinizi ücretsiz analiz edin ve tüm raporları geçmişinizde saklayın.")}</p>
        <form onSubmit={submit} className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">{text("Name", "Ad soyad")}</span>
            <input
              required
              minLength={2}
              className="input"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder={text("Your name", "Adınız ve soyadınız")}
            />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">{text("Email", "E-posta")}</span>
            <input
              required
              type="email"
              autoComplete="email"
              className="input"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">{text("Password", "Şifre")}</span>
            <input
              required
              minLength={8}
              type="password"
              autoComplete="new-password"
              className="input"
              value={form.password}
              onChange={(event) => update("password", event.target.value)}
              placeholder={text("At least 8 characters", "En az 8 karakter")}
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">{text("Confirm password", "Şifreyi doğrula")}</span>
            <input
              required
              minLength={8}
              type="password"
              autoComplete="new-password"
              className="input"
              value={form.confirm_password}
              onChange={(event) => update("confirm_password", event.target.value)}
              placeholder={text("Repeat password", "Şifreyi tekrar girin")}
            />
          </label>
          {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 sm:col-span-2">{error}</p>}
          <button disabled={loading} className="btn-primary w-full sm:col-span-2">
            {loading ? text("Creating account...", "Hesap oluşturuluyor...") : text("Create account", "Hesap oluştur")} {!loading && <ArrowRight size={17} />}
          </button>
        </form>
        <p className="mt-7 text-center text-sm text-slate-500">
          {text("Already have an account?", "Zaten hesabınız var mı?")}{" "}
          <Link href="/login" className="font-semibold text-brand-600">{text("Login", "Giriş yap")}</Link>
        </p>
      </div>
    </section>
  );
}
