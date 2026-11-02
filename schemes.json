import json

def load_schemes(path="schemes.json"):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def retrieve(question, schemes, top_k=2):
    """Return the schemes whose keywords appear in the question, best match first."""
    q = question.lower()
    scored = []
    for s in schemes:
        score = sum(1 for kws in s["keywords"].values() for kw in kws if kw.lower() in q)
        if score > 0:
            scored.append((score, s))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [s for _, s in scored[:top_k]]

def pick(field, code):
    """Get text in the user's language, fall back to English."""
    return field.get(code) or field.get("en", "")

def build_context(schemes, code):
    blocks = []
    for s in schemes:
        blocks.append(
            f"SCHEME: {pick(s['name'], code)}\n"
            f"PURPOSE: {pick(s['purpose'], code)}\n"
            f"ELIGIBILITY: {pick(s['eligibility'], code)}\n"
            f"DOCUMENTS: {pick(s['documents'], code)}\n"
            f"PROCESS: {pick(s['process'], code)}\n"
            f"SOURCE: {s['source']}\n"
            f"LAST VERIFIED: {s['last_verified']}"
        )
    return "\n\n".join(blocks)