"use client";

import {
  AlignLeft,
  BrainCircuit,
  CheckCircle2,
  SearchCheck,
  Sparkles,
  Target,
} from "lucide-react";

import ScoreCard from "@/components/ScoreCard";
import SkillBadge from "@/components/SkillBadge";
import { Analysis } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

function SkillGroup({
  title,
  skills,
  tone,
  empty,
}: {
  title: string;
  skills: string[];
  tone: "matched" | "missing" | "extra";
  empty: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.length ? (
          skills.map((skill) => <SkillBadge key={skill} skill={skill} tone={tone} />)
        ) : (
          <p className="text-sm text-slate-500">{empty}</p>
        )}
      </div>
    </div>
  );
}

export default function AnalysisResult({ analysis }: { analysis: Analysis }) {
  const { isTurkish, text } = useLanguage();
  const matchedPhrase = analysis.matched_skills.slice(0, 5).join(", ") || "ilgili teknik beceriler";
  const missingPhrase = analysis.missing_skills.slice(0, 6).join(", ");
  const feedback = isTurkish
    ? {
        summary_feedback:
          analysis.ats_score >= 80
            ? "Özgeçmişiniz bu pozisyonla güçlü biçimde eşleşiyor. Kanıtları daha net hale getirmeye ve ölçülebilir etki göstermeye odaklanın."
            : analysis.ats_score >= 60
              ? "Özgeçmişiniz sağlam bir temele sahip; role özel anahtar kelimeler ve daha güçlü başarı ifadeleri eşleşmeyi geliştirebilir."
              : "Özgeçmişinizin ATS değerlendirmesinde daha iyi sonuç vermesi için role özel kanıt ve terminoloji eklenmesi gerekiyor.",
        bullet_point_suggestions: [
          "Deneyim maddelerini eylem + görev + ölçülebilir sonuç yapısıyla yeniden yazın.",
          `${matchedPhrase} becerilerini yalnızca beceri listesinde değil, onları kullandığınız deneyimlerde de gösterin.`,
          "Deneyiminizi doğru yansıttığı sürece iş unvanını ve ilandaki rol dilini özgeçmişinizde kullanın.",
        ],
        action_items: [
          missingPhrase
            ? `Şu beceriler için gerçek proje veya iş deneyimi kanıtı ekleyin: ${missingPhrase}.`
            : "Eşleşen becerileri özet ve en güncel deneyim bölümünde görünür tutun.",
          "Kazanılan zaman, gelir etkisi, ölçek, doğruluk veya ekip büyüklüğü gibi ölçülebilir veriler ekleyin.",
          "Biçimi sade tutun, standart bölüm başlıkları kullanın ve görsellere gömülü metinlerden kaçının.",
        ],
        recommended_resume_summary: `Sonuç odaklı, ${matchedPhrase} alanlarında deneyimli profesyonel. Ölçülebilir sonuçlar üretme, ekipler arası iş birliği ve pozisyona özel hedeflerde pratik problem çözme becerisine sahiptir.`,
      }
    : analysis.ai_feedback;

  const breakdownLabels: Record<string, [string, string]> = {
    skill_match: ["Skill match", "Beceri eşleşmesi"],
    keyword_overlap: ["Keyword overlap", "Anahtar kelime örtüşmesi"],
    semantic_similarity: ["Semantic similarity", "Anlamsal benzerlik"],
    formatting_quality: ["Formatting quality", "Biçim kalitesi"],
    contact_information: ["Contact information", "İletişim bilgileri"],
  };
  const breakdownExplanations: Record<string, [string, string]> = {
    skill_match: ["Share of required technical skills found in the resume.", "İş ilanında istenen teknik becerilerin özgeçmişte bulunan oranı."],
    keyword_overlap: ["Overlap between meaningful job-description keywords and resume text.", "İş ilanındaki anlamlı anahtar kelimeler ile özgeçmiş metni arasındaki örtüşme."],
    semantic_similarity: ["Overall contextual similarity between the resume and the role.", "Özgeçmiş ile pozisyon arasındaki genel bağlamsal benzerlik."],
    formatting_quality: ["Checks readable length, common sections, and bullet-based structure.", "Okunabilir uzunluğu, standart bölümleri ve madde işaretli yapıyı değerlendirir."],
    contact_information: ["Checks for email, phone number, and a professional profile or website.", "E-posta, telefon ve profesyonel profil veya internet sitesi bilgilerini kontrol eder."],
  };
  return (
    <div className="space-y-7">
      <div className="grid gap-4 md:grid-cols-3">
        <ScoreCard
          label={text("ATS score", "ATS puanı")}
          score={analysis.ats_score}
          icon={SearchCheck}
          description={text("Weighted score across skills, keywords, relevance, format, and contact details.", "Beceriler, anahtar kelimeler, uygunluk, biçim ve iletişim bilgilerinden oluşan ağırlıklı puan.")}
        />
        <ScoreCard
          label={text("Skill match", "Beceri eşleşmesi")}
          score={analysis.skill_match_score}
          icon={Target}
          description={text("How many technical requirements are directly represented in your resume.", "Teknik gereksinimlerin kaç tanesinin özgeçmişinizde doğrudan yer aldığını gösterir.")}
        />
        <ScoreCard
          label={text("Semantic match", "Anlamsal eşleşme")}
          score={analysis.semantic_similarity_score}
          icon={BrainCircuit}
          description={text("Contextual similarity between your experience and the role.", "Deneyiminiz ile pozisyon arasındaki bağlamsal benzerlik.")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SkillGroup
          title={text("Matched skills", "Eşleşen beceriler")}
          skills={analysis.matched_skills}
          tone="matched"
          empty={text("No direct skill matches were detected.", "Doğrudan eşleşen beceri bulunamadı.")}
        />
        <SkillGroup
          title={text("Missing skills", "Eksik beceriler")}
          skills={analysis.missing_skills}
          tone="missing"
          empty={text("No missing technical skills detected.", "Eksik teknik beceri bulunamadı.")}
        />
        <SkillGroup
          title={text("Additional strengths", "Ek güçlü yönler")}
          skills={analysis.extra_resume_skills}
          tone="extra"
          empty={text("No additional technical skills detected.", "Ek teknik beceri bulunamadı.")}
        />
      </div>

      <section className="surface overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-brand-100 p-2 text-brand-700">
              <Sparkles size={20} />
            </span>
            <div>
              <h2 className="font-bold text-slate-950">{text("Resume feedback", "Özgeçmiş geri bildirimi")}</h2>
              <p className="text-sm text-slate-500">{text("Practical next steps based on this role.", "Bu pozisyona göre uygulanabilir sonraki adımlar.")}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-8 p-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">{text("Summary", "Özet")}</h3>
            <p className="mt-3 leading-7 text-slate-700">
              {feedback.summary_feedback}
            </p>
            <h3 className="mt-7 text-sm font-bold uppercase tracking-wide text-slate-500">
              {text("Suggested professional summary", "Önerilen profesyonel özet")}
            </h3>
            <div className="mt-3 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm leading-6 text-slate-700">
              {feedback.recommended_resume_summary}
            </div>
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <AlignLeft size={18} className="text-brand-600" />
              {text("Bullet improvements", "Deneyim maddesi iyileştirmeleri")}
            </h3>
            <ul className="mt-4 space-y-3">
              {feedback.bullet_point_suggestions.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={16} />
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="mt-7 font-semibold text-slate-900">{text("Action items", "Eylem adımları")}</h3>
            <ol className="mt-4 space-y-3">
              {feedback.action_items.map((item, index) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="surface p-6">
        <h2 className="font-bold text-slate-950">{text("ATS score breakdown", "ATS puanı dağılımı")}</h2>
        <div className="mt-5 space-y-5">
          {Object.entries(analysis.ats_breakdown).map(([key, component]) => (
            <div key={key}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <div>
                  <span className="font-semibold capitalize text-slate-800">
                    {text(...(breakdownLabels[key] || [key.replaceAll("_", " "), key.replaceAll("_", " ")]))}
                  </span>
                  <span className="ml-2 text-slate-400">
                    {text(`${Math.round(component.weight * 100)}% weight`, `%${Math.round(component.weight * 100)} ağırlık`)}
                  </span>
                </div>
                <span className="font-bold text-slate-900">{Math.round(component.score)}/100</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${component.score}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {text(...(breakdownExplanations[key] || [component.explanation, component.explanation]))}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
