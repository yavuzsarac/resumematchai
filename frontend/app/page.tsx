"use client";

import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  FileSearch,
  ShieldCheck,
  Sparkles,
  Target,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/lib/i18n";

export default function HomePage() {
  const { text } = useLanguage();
  const features = [
    {
      icon: Target,
      title: text("Skill gap analysis", "Beceri açığı analizi"),
      copy: text(
        "See matched, missing, and additional skills at a glance for every application.",
        "Her başvuruda eşleşen, eksik ve ek becerileri tek bakışta görün.",
      ),
    },
    {
      icon: BarChart3,
      title: text("ATS-style scoring", "ATS uyum puanı"),
      copy: text(
        "Understand how skills, keywords, relevance, formatting, and contact details affect your score.",
        "Becerilerin, anahtar kelimelerin, uygunluğun, biçimin ve iletişim bilgilerinin puanınızı nasıl etkilediğini anlayın.",
      ),
    },
    {
      icon: BrainCircuit,
      title: text("Semantic matching", "Anlamsal eşleşme"),
      copy: text(
        "Go beyond exact keywords with contextual similarity between your resume and the role.",
        "Özgeçmişiniz ile pozisyon arasındaki bağlamsal benzerliği ölçerek anahtar kelimelerin ötesine geçin.",
      ),
    },
    {
      icon: Sparkles,
      title: text("Actionable feedback", "Uygulanabilir geri bildirim"),
      copy: text(
        "Get structured suggestions, action items, and a tailored professional summary.",
        "Yapılandırılmış öneriler, eylem adımları ve role özel profesyonel özet alın.",
      ),
    },
  ];
  return (
    <>
      <section className="overflow-hidden pb-20 pt-20 sm:pt-28">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
              <Sparkles size={14} />
              {text("AI-POWERED APPLICATION INTELLIGENCE", "YAPAY ZEKA DESTEKLİ BAŞVURU ANALİZİ")}
            </div>
            <h1 className="mt-7 max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl">
              {text("Make every resume feel", "Her özgeçmişi")}
              <span className="text-brand-600">
                {text(" made for the role.", " pozisyona özel hale getirin.")}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {text(
                "Analyze your resume against any job description with AI. Get ATS score, missing skills, keyword analysis, and personalized improvement suggestions.",
                "Özgeçmişinizi istediğiniz iş ilanıyla yapay zeka kullanarak karşılaştırın. ATS puanı, eksik beceriler, anahtar kelime analizi ve kişiselleştirilmiş geliştirme önerileri alın.",
              )}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="btn-primary">
                {text("Analyze your resume", "Özgeçmişini analiz et")} <ArrowRight size={17} />
              </Link>
              <Link href="/login" className="btn-secondary">
                {text("Login to your account", "Hesabına giriş yap")}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              {[
                text("Unlimited free analyses", "Sınırsız ücretsiz analiz"),
                text("No credit card", "Kredi kartı gerekmez"),
                text("Private by design", "Gizlilik odaklı"),
              ].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-brand-200/30 blur-3xl" />
            <div className="surface relative overflow-hidden p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-brand-100 p-2.5 text-brand-700">
                    <FileSearch size={21} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{text("product-designer-resume.pdf", "urun-tasarimcisi-ozgecmis.pdf")}</p>
                    <p className="text-xs text-slate-400">{text("Analysis complete", "Analiz tamamlandı")}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {text("STRONG MATCH", "GÜÇLÜ EŞLEŞME")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 py-6">
                {[
                  [text("ATS score", "ATS puanı"), "82"],
                  [text("Skill match", "Beceri eşleşmesi"), "88"],
                  [text("Semantic", "Anlamsal"), "79"],
                ].map(([label, score]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4 text-center">
                    <p className="text-2xl font-bold text-slate-950">{score}</p>
                    <p className="mt-1 text-[11px] font-medium text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="mb-3 flex justify-between text-xs font-semibold">
                  <span>{text("Role alignment", "Pozisyona uygunluk")}</span>
                  <span className="text-brand-600">82%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-brand-500 to-emerald-400" />
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <p className="text-xs font-bold text-emerald-700">{text("MATCHED SKILLS", "EŞLEŞEN BECERİLER")}</p>
                  <p className="mt-2 text-sm text-slate-700">{text("Figma · Research · Prototyping", "Figma · Araştırma · Prototipleme")}</p>
                </div>
                <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-4">
                  <p className="text-xs font-bold text-rose-700">{text("MISSING KEYWORDS", "EKSİK ANAHTAR KELİMELER")}</p>
                  <p className="mt-2 text-sm text-slate-700">{text("Design systems · Analytics", "Tasarım sistemleri · Analitik")}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3 rounded-xl border border-brand-100 bg-brand-50 p-4">
                <Sparkles className="mt-0.5 shrink-0 text-brand-600" size={18} />
                <p className="text-sm leading-6 text-slate-600">
                  {text(
                    "Lead with your design-system impact and quantify the adoption improvement.",
                    "Tasarım sistemi üzerindeki etkinizi öne çıkarın ve kullanım artışını sayısal verilerle gösterin.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-slate-200 bg-white py-24">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">{text("A BETTER APPLICATION LOOP", "DAHA İYİ BİR BAŞVURU SÜRECİ")}</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
              {text("Know what to improve before you apply.", "Başvurmadan önce neyi geliştirmeniz gerektiğini bilin.")}
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              {text(
                "One focused report brings the signals scattered across generic resume tools into a clear plan.",
                "Odaklı tek bir rapor, farklı özgeçmiş araçlarına dağılmış sinyalleri net bir plana dönüştürür.",
              )}
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-2xl border border-slate-200 p-6">
                <span className="inline-flex rounded-xl bg-brand-50 p-3 text-brand-600">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="container-page">
          <div className="text-center">
            <p className="eyebrow">{text("HOW IT WORKS", "NASIL ÇALIŞIR?")}</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              {text("From upload to action plan in minutes.", "Yüklemeden eylem planına dakikalar içinde ulaşın.")}
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              [UploadCloud, "01", text("Upload your resume", "Özgeçmişinizi yükleyin"), text("Use a PDF, DOCX, or TXT file. The original file is not stored.", "PDF, DOCX veya TXT dosyası kullanın. Orijinal dosya saklanmaz.")],
              [FileSearch, "02", text("Add the job description", "İş ilanını ekleyin"), text("Paste the role you want and let the analysis pipeline compare both texts.", "İlgilendiğiniz iş ilanını yapıştırın; analiz sistemi iki metni karşılaştırsın.")],
              [Sparkles, "03", text("Improve with confidence", "Güvenle geliştirin"), text("Review scores, missing skills, and a prioritized set of concrete edits.", "Puanları, eksik becerileri ve önceliklendirilmiş düzenleme önerilerini inceleyin.")],
            ].map(([Icon, step, title, copy]) => {
              const StepIcon = Icon as typeof UploadCloud;
              return (
                <div key={String(step)} className="surface p-7">
                  <div className="flex items-center justify-between">
                    <span className="rounded-xl bg-slate-950 p-3 text-white"><StepIcon size={21} /></span>
                    <span className="text-sm font-bold text-slate-300">{String(step)}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold">{String(title)}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{String(copy)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-24 text-white">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow !text-brand-300">{text("FREE FOR EVERY JOB SEARCH", "HER İŞ ARAMA SÜRECİ İÇİN ÜCRETSİZ")}</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              {text("No plans, quotas, or paywalls.", "Plan, kota veya ödeme duvarı yok.")}
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              {text(
                "Create an account to keep your reports private and run as many resume analyses as you need.",
                "Raporlarınızı kişisel tutmak için hesap oluşturun ve ihtiyaç duyduğunuz kadar özgeçmiş analizi yapın.",
              )}
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
            {[
              [text("Unlimited analysis", "Sınırsız analiz"), text("Compare different resumes and roles without a usage limit.", "Farklı özgeçmiş ve pozisyonları kullanım sınırı olmadan karşılaştırın.")],
              [text("Complete reports", "Eksiksiz raporlar"), text("ATS score, skill gaps, semantic matching, and improvement suggestions are included.", "ATS puanı, beceri açıkları, anlamsal eşleşme ve geliştirme önerileri dahildir.")],
              [text("Private history", "Kişisel geçmiş"), text("Every report is saved to your account and visible only to you.", "Her rapor hesabınıza kaydedilir ve yalnızca sizin tarafınızdan görüntülenir.")],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
                <ShieldCheck className="text-emerald-400" size={22} />
                <h3 className="mt-5 font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <div className="rounded-3xl bg-brand-600 px-7 py-14 text-center text-white sm:px-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {text("Your next application deserves better evidence.", "Bir sonraki başvurunuz daha güçlü kanıtları hak ediyor.")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-brand-100">
              {text(
                "Create a free account and turn one job description into a focused resume improvement plan.",
                "Ücretsiz hesap oluşturun ve bir iş ilanını odaklı bir özgeçmiş geliştirme planına dönüştürün.",
              )}
            </p>
            <Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-700">
              {text("Start your first analysis", "İlk analizini başlat")} <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
