import logging
import math
import re
from collections import Counter
from functools import lru_cache

from app.core.config import settings

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def _load_model():
    if not settings.enable_embedding_model:
        return None

    try:
        from sentence_transformers import SentenceTransformer

        return SentenceTransformer(settings.embedding_model_name)
    except Exception:
        logger.warning(
            "Sentence-transformers model unavailable; lexical similarity will be used.",
            exc_info=True,
        )
        return None


def _lexical_cosine_similarity(first: str, second: str) -> float:
    token_pattern = re.compile(r"[a-zA-Z][a-zA-Z0-9+#.]{1,}")
    first_vector = Counter(token.lower() for token in token_pattern.findall(first))
    second_vector = Counter(token.lower() for token in token_pattern.findall(second))
    shared = set(first_vector) & set(second_vector)
    numerator = sum(first_vector[token] * second_vector[token] for token in shared)
    first_norm = math.sqrt(sum(value * value for value in first_vector.values()))
    second_norm = math.sqrt(sum(value * value for value in second_vector.values()))
    if not first_norm or not second_norm:
        return 0.0
    return numerator / (first_norm * second_norm)


def calculate_semantic_similarity(resume_text: str, job_description: str) -> float:
    model = _load_model()
    if model is None:
        similarity = _lexical_cosine_similarity(resume_text, job_description)
        return round(max(0.0, min(similarity, 1.0)) * 100, 2)

    try:
        embeddings = model.encode(
            [resume_text, job_description],
            normalize_embeddings=True,
        )
        similarity = float(embeddings[0] @ embeddings[1])
    except Exception:
        logger.exception(
            "Sentence-transformers model unavailable; using lexical cosine fallback."
        )
        similarity = _lexical_cosine_similarity(resume_text, job_description)

    return round(max(0.0, min(similarity, 1.0)) * 100, 2)
