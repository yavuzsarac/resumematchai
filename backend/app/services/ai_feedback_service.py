import json
import logging
from abc import ABC, abstractmethod
from typing import Any

from app.core.config import settings
from app.schemas.analysis_schema import FeedbackResponse

logger = logging.getLogger(__name__)


class FeedbackProvider(ABC):
    @abstractmethod
    def generate(
        self,
        resume_text: str,
        job_description: str,
        matched_skills: list[str],
        missing_skills: list[str],
        ats_score: float,
        language: str = "en",
    ) -> dict[str, Any]:
        raise NotImplementedError


class RuleBasedFeedbackProvider(FeedbackProvider):
    def generate(
        self,
        resume_text: str,
        job_description: str,
        matched_skills: list[str],
        missing_skills: list[str],
        ats_score: float,
        language: str = "en",
    ) -> dict[str, Any]:
        del resume_text, job_description
        missing_preview = missing_skills[:6]
        matched_preview = matched_skills[:5]

        if language == "tr":
            if ats_score >= 80:
                summary = "Özgeçmişiniz bu pozisyonla güçlü biçimde eşleşiyor. Kanıtları daha net hale getirmeye ve ölçülebilir etki göstermeye odaklanın."
            elif ats_score >= 60:
                summary = "Özgeçmişiniz sağlam bir temele sahip; role özel anahtar kelimeler ve daha güçlü başarı ifadeleri eşleşmeyi geliştirebilir."
            else:
                summary = "Özgeçmişinizin ATS değerlendirmesinde daha iyi sonuç vermesi için role özel kanıt ve terminoloji eklenmesi gerekiyor."

            skill_action = (
                f"Şu beceriler için gerçek proje veya iş deneyimi kanıtı ekleyin: {', '.join(missing_preview)}."
                if missing_preview
                else "Eşleşen becerileri özet ve en güncel deneyim bölümünde görünür tutun."
            )
            matched_phrase = ", ".join(matched_preview) or "ilgili teknik beceriler"
            feedback = {
                "summary_feedback": summary,
                "missing_keywords": missing_skills,
                "bullet_point_suggestions": [
                    "Deneyim maddelerini eylem + görev + ölçülebilir sonuç yapısıyla yeniden yazın.",
                    f"{matched_phrase} becerilerini yalnızca beceri listesinde değil, onları kullandığınız deneyimlerde de gösterin.",
                    "Deneyiminizi doğru yansıttığı sürece iş unvanını ve ilandaki rol dilini özgeçmişinizde kullanın.",
                ],
                "action_items": [
                    skill_action,
                    "Kazanılan zaman, gelir etkisi, ölçek, doğruluk veya ekip büyüklüğü gibi ölçülebilir veriler ekleyin.",
                    "Biçimi sade tutun, standart bölüm başlıkları kullanın ve görsellere gömülü metinlerden kaçının.",
                ],
                "recommended_resume_summary": (
                    f"Sonuç odaklı, {matched_phrase} alanlarında deneyimli profesyonel. "
                    "Ölçülebilir sonuçlar üretme, ekipler arası iş birliği ve pozisyona özel "
                    "hedeflerde pratik problem çözme becerisine sahiptir."
                ),
            }
            return FeedbackResponse.model_validate(feedback).model_dump()

        if ats_score >= 80:
            summary = "Your resume is strongly aligned with this role. Focus on sharper evidence and measurable impact."
        elif ats_score >= 60:
            summary = "Your resume has a solid foundation, but targeted keywords and stronger achievement statements can improve the match."
        else:
            summary = "Your resume needs more role-specific evidence and terminology before it is likely to perform well in an ATS review."

        skill_action = (
            f"Add truthful project or work evidence for: {', '.join(missing_preview)}."
            if missing_preview
            else "Keep the matched skills visible in the summary and most recent experience."
        )
        matched_phrase = ", ".join(matched_preview) or "relevant technical skills"

        feedback = {
            "summary_feedback": summary,
            "missing_keywords": missing_skills,
            "bullet_point_suggestions": [
                "Rewrite experience bullets using action + task + measurable result.",
                f"Show where you applied {matched_phrase}, not only in a standalone skills list.",
                "Mirror the job title and role language when it accurately reflects your experience.",
            ],
            "action_items": [
                skill_action,
                "Add metrics such as time saved, revenue influenced, scale, accuracy, or team size.",
                "Keep formatting simple, use standard section headings, and avoid text embedded in images.",
            ],
            "recommended_resume_summary": (
                f"Results-oriented professional with experience in {matched_phrase}. "
                "Skilled at delivering measurable outcomes, collaborating across teams, "
                "and applying practical problem-solving to role-specific goals."
            ),
        }
        return FeedbackResponse.model_validate(feedback).model_dump()


class OpenAIFeedbackProvider(FeedbackProvider):
    def __init__(self, fallback: FeedbackProvider) -> None:
        from openai import OpenAI

        self.client = OpenAI(api_key=settings.openai_api_key)
        self.fallback = fallback

    def generate(
        self,
        resume_text: str,
        job_description: str,
        matched_skills: list[str],
        missing_skills: list[str],
        ats_score: float,
        language: str = "en",
    ) -> dict[str, Any]:
        prompt = {
            "resume_text": resume_text[:12000],
            "job_description": job_description[:8000],
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "ats_score": ats_score,
            "response_language": "Turkish" if language == "tr" else "English",
        }
        try:
            response = self.client.chat.completions.create(
                model=settings.openai_model,
                temperature=0.2,
                response_format={"type": "json_object"},
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a precise resume coach. Return JSON with exactly these keys: "
                            "summary_feedback (string), missing_keywords (string array), "
                            "bullet_point_suggestions (string array), action_items (string array), "
                            "recommended_resume_summary (string). Never invent experience. "
                            "Write every human-readable value in the requested response_language."
                        ),
                    },
                    {"role": "user", "content": json.dumps(prompt)},
                ],
            )
            content = response.choices[0].message.content or "{}"
            return FeedbackResponse.model_validate_json(content).model_dump()
        except Exception:
            logger.exception("LLM feedback failed; returning rule-based feedback.")
            return self.fallback.generate(
                resume_text,
                job_description,
                matched_skills,
                missing_skills,
                ats_score,
                language,
            )


def get_feedback_provider() -> FeedbackProvider:
    fallback = RuleBasedFeedbackProvider()
    if not settings.openai_api_key:
        return fallback
    try:
        return OpenAIFeedbackProvider(fallback)
    except Exception:
        logger.exception("OpenAI provider could not be initialized.")
        return fallback


feedback_provider = get_feedback_provider()


def generate_feedback(
    resume_text: str,
    job_description: str,
    matched_skills: list[str],
    missing_skills: list[str],
    ats_score: float,
    language: str = "en",
) -> dict[str, Any]:
    return feedback_provider.generate(
        resume_text,
        job_description,
        matched_skills,
        missing_skills,
        ats_score,
        language,
    )
