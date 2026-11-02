import io
import streamlit as st
from google import genai
from google.genai import types
from gtts import gTTS

# ---------- SETTINGS ----------
MODEL = "gemini-2.0-flash"  # if this name stops working, check aistudio.google.com for the current Flash model
client = genai.Client(api_key=st.secrets["GEMINI_API_KEY"])

# ---------- KNOWLEDGE BASE (add 10-20 verified entries from OFFICIAL sites) ----------
KNOWLEDGE = [
    {
        "title": "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojana",
        "info": "Fee concession for eligible students in Maharashtra. VERIFY details on the official site before using.",
        "link": "https://mahadbt.maharashtra.gov.in",
    },
    {
        "title": "MahaDBT Scholarship Portal",
        "info": "Single portal to apply for many Maharashtra scholarships. Needs Aadhaar, income certificate, caste certificate (if applicable), marksheets, bank passbook.",
        "link": "https://mahadbt.maharashtra.gov.in",
    },
]

def find_relevant(question):
    """Very simple keyword search. Upgrade to embeddings later."""
    words = set(question.lower().split())
    scored = []
    for item in KNOWLEDGE:
        text = (item["title"] + " " + item["info"]).lower()
        score = sum(1 for w in words if w in text)
        scored.append((score, item))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [i for s, i in scored[:3]]

SYSTEM = (
    "तू MahaSahayak AI आहेस, महाराष्ट्रातील नागरिकांना सरकारी योजना समजावणारा सहाय्यक. "
    "नेहमी सोप्या मराठीत उत्तर दे. फक्त दिलेल्या माहितीवर आधारित उत्तर दे. "
    "माहिती नसेल तर तसे सांग आणि अधिकृत संकेतस्थळ तपासायला सांग. उत्तर लहान ठेव."
)

def ask_ai(question, simple_mode):
    docs = find_relevant(question)
    context = "\n".join(f"- {d['title']}: {d['info']} ({d['link']})" for d in docs)
    extra = "अतिशय सोप्या भाषेत, लहान वाक्यांत सांग." if simple_mode else ""
    prompt = f"माहिती:\n{context}\n\nप्रश्न: {question}\n{extra}"
    r = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(system_instruction=SYSTEM),
    )
    return r.text

def transcribe(audio_bytes):
    r = client.models.generate_content(
        model=MODEL,
        contents=[
            types.Part.from_bytes(data=audio_bytes, mime_type="audio/wav"),
            "हे मराठी बोलणे आहे. फक्त शब्दशः लिहून दे, दुसरे काही नको.",
        ],
    )
    return r.text.strip()

def speak(text):
    buf = io.BytesIO()
    gTTS(text=text, lang="mr").write_to_fp(buf)
    return buf.getvalue()

# ---------- UI ----------
st.set_page_config(page_title="MahaSahayak AI", page_icon="🙏")
large = st.toggle("मोठे अक्षर")
simple = st.toggle("सोपी भाषा")
if large:
    st.markdown("<style>html, body, p, div {font-size:22px !important}</style>", unsafe_allow_html=True)

st.title("🙏 MahaSahayak AI")
st.caption("तंत्रज्ञान सर्वांसाठी, आपल्या मराठी भाषेत.")

if "chat" not in st.session_state:
    st.session_state.chat = []

voice = st.audio_input("🎤 बोला")
typed = st.chat_input("तुमचा प्रश्न लिहा...")

question = None
if voice is not None and st.session_state.get("last_voice") != voice.size:
    st.session_state.last_voice = voice.size
    question = transcribe(voice.getvalue())
elif typed:
    question = typed

if question:
    answer = ask_ai(question, simple)
    st.session_state.chat.append((question, answer))

for q, a in st.session_state.chat:
    with st.chat_message("user"):
        st.write(q)
    with st.chat_message("assistant"):
        st.write(a)

if st.session_state.chat:
    if st.button("🔊 उत्तर ऐका"):
        st.audio(speak(st.session_state.chat[-1][1]), format="audio/mp3")

st.info("ही माहिती नमुना आहे. अर्ज करण्यापूर्वी अधिकृत संकेतस्थळ तपासा.")
