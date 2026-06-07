import re

# Patterns are explicit so punctuation-heavy names such as C++, C#, and .NET
# are not damaged by generic word-boundary matching.
SKILL_PATTERNS: dict[str, str] = {
    "Python": r"\bpython\b",
    "Java": r"\bjava\b(?!\s*script)",
    "C": r"(?<![\w+#.])c(?![\w+#.])",
    "C++": r"(?<!\w)c\+\+(?!\w)",
    "C#": r"(?<!\w)c#(?!\w)",
    "JavaScript": r"\b(?:javascript|java\s*script)\b",
    "TypeScript": r"\btypescript\b",
    "React": r"\breact(?:\.js)?\b",
    "Next.js": r"\bnext\.?js\b",
    "Node.js": r"\bnode\.?js\b",
    "Express.js": r"\bexpress(?:\.js)?\b",
    "FastAPI": r"\bfastapi\b",
    "Django": r"\bdjango\b",
    "Flask": r"\bflask\b",
    "SQL": r"\bsql\b",
    "PostgreSQL": r"\b(?:postgresql|postgres)\b",
    "MySQL": r"\bmysql\b",
    "MongoDB": r"\bmongodb\b",
    "Redis": r"\bredis\b",
    "Docker": r"\bdocker\b",
    "Kubernetes": r"\bkubernetes\b|\bk8s\b",
    "Git": r"\bgit\b",
    "Linux": r"\blinux\b",
    "AWS": r"\baws\b|\bamazon web services\b",
    "Azure": r"\bazure\b",
    "GCP": r"\bgcp\b|\bgoogle cloud(?: platform)?\b",
    "TensorFlow": r"\btensorflow\b",
    "Keras": r"\bkeras\b",
    "PyTorch": r"\bpytorch\b",
    "Scikit-learn": r"\bscikit[\s-]?learn\b|\bsklearn\b",
    "Machine Learning": r"\bmachine learning\b",
    "Deep Learning": r"\bdeep learning\b",
    "NLP": r"\bnlp\b|\bnatural language processing\b",
    "Computer Vision": r"\bcomputer vision\b",
    "Data Analysis": r"\bdata analys(?:is|tics)\b",
    "REST API": r"\brest(?:ful)?\s+api(?:s)?\b",
    "GraphQL": r"\bgraphql\b",
    "HTML": r"\bhtml5?\b",
    "CSS": r"\bcss3?\b",
    "Tailwind CSS": r"\btailwind(?:\s+css)?\b",
}


def extract_skills(text: str) -> list[str]:
    matches = {
        skill
        for skill, pattern in SKILL_PATTERNS.items()
        if re.search(pattern, text, flags=re.IGNORECASE)
    }
    return sorted(matches, key=str.casefold)

