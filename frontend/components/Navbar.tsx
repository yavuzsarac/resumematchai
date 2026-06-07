"use client";

import { FileSearch, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { clearToken, isAuthenticated } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, text } = useLanguage();
  const [authenticated, setAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => setAuthenticated(isAuthenticated());
    update();
    window.addEventListener("storage", update);
    window.addEventListener("resumematch-auth", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("resumematch-auth", update);
    };
  }, [pathname]);

  const publicLinks = [
    { href: "/#features", label: text("Features", "Özellikler") },
    { href: "/#how-it-works", label: text("How it works", "Nasıl çalışır?") },
  ];
  const appLinks = [
    { href: "/dashboard", label: text("Dashboard", "Kontrol paneli") },
    { href: "/analyze", label: text("Analyze", "Analiz et") },
    { href: "/history", label: text("History", "Geçmiş") },
    { href: "/account", label: text("Account", "Hesap") },
  ];
  const links = authenticated ? appLinks : publicLinks;

  function logout() {
    clearToken();
    setOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-950">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
            <FileSearch size={19} />
          </span>
          <span>ResumeMatch <span className="text-brand-600">AI</span></span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-brand-600 ${
                pathname === link.href ? "text-brand-600" : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "tr" : "en")}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
            aria-label={text("Switch to Turkish", "İngilizceye geç")}
          >
            {locale === "en" ? "TR" : "EN"}
          </button>
          {authenticated ? (
            <button onClick={logout} className="btn-secondary !px-4 !py-2">
              <LogOut size={16} />
              {text("Logout", "Çıkış yap")}
            </button>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-700">
                {text("Login", "Giriş yap")}
              </Link>
              <Link href="/register" className="btn-primary !px-4 !py-2">
                {text("Get started", "Başla")}
              </Link>
            </>
          )}
        </div>

        <button
          aria-label={text("Toggle navigation", "Menüyü aç veya kapat")}
          className="rounded-lg p-2 text-slate-700 md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setLocale(locale === "en" ? "tr" : "en")}
              className="rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-bold text-slate-700"
            >
              {locale === "en" ? "Türkçe" : "English"}
            </button>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            {authenticated ? (
              <button onClick={logout} className="btn-secondary mt-2">
                {text("Logout", "Çıkış yap")}
              </button>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Link href="/login" className="btn-secondary">{text("Login", "Giriş")}</Link>
                <Link href="/register" className="btn-primary">{text("Get started", "Başla")}</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
