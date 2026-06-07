import re


def clean_text(text: str) -> str:
    """Normalize whitespace while preserving punctuation useful in skill names."""
    text = text.replace("\r\n", "\n").replace("\r", "\n").replace("\x00", " ")
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.split("\n")]

    cleaned_lines: list[str] = []
    previous_blank = False
    for line in lines:
        is_blank = not line
        if is_blank and previous_blank:
            continue
        cleaned_lines.append(line)
        previous_blank = is_blank

    return "\n".join(cleaned_lines).strip()

