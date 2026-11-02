import sys
from rag import load_schemes

REQUIRED_TEXT = ["name", "purpose", "eligibility", "documents", "process"]
LANGS = ["mr", "hi", "en"]
problems = []

for s in load_schemes():
    sid = s.get("id", "?")
    for field in REQUIRED_TEXT:
        for lang in LANGS:
            value = s.get(field, {}).get(lang, "")
            if not value or value == "TO_VERIFY":
                problems.append(f"{sid}: {field}.{lang} is missing or unverified")
    if not s.get("source", "").startswith("https://"):
        problems.append(f"{sid}: source must be an https link")
    if s.get("last_verified", "TO_VERIFY") == "TO_VERIFY":
        problems.append(f"{sid}: last_verified not set")

if problems:
    print("\n".join(problems))
    sys.exit(1)
print("All schemes look complete.")