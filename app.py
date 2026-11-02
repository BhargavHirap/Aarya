import json
import streamlit as st

st.set_page_config(page_title="MahaSahayak AI", page_icon="🇮🇳", layout="centered")

LANGUAGES = {"मराठी": "mr", "हिन्दी": "hi", "English": "en"}

TEXT = {
    "mr": {"title": "महा सहाय्यक AI", "subtitle": "सरकारी योजनांची माहिती, आपल्या भाषेत.",
           "question": "तुमचा प्रश्न लिहा", "button": "माहिती शोधा",
           "empty": "कृपया प्रश्न लिहा.",
           "not_found": "या प्रश्नासाठी सध्या माहिती उपलब्ध नाही. कृपया अधिकृत सरकारी वेबसाइट तपासा.",
           "large": "मोठे अक्षर", "source": "अधिकृत स्रोत"},
    "hi": {"title": "महा सहायक AI", "subtitle": "सरकारी योजनाओं की जानकारी, आपकी भाषा में।",
           "question": "अपना सवाल लिखें", "button": "जानकारी खोजें",
           "empty": "कृपया सवाल लिखें।",
           "not_found": "इस सवाल के लिए अभी जानकारी उपलब्ध नहीं है। कृपया आधिकारिक वेबसाइट देखें।",
           "large": "बड़े अक्षर", "source": "आधिकारिक स्रोत"},
    "en": {"title": "MahaSahayak AI", "subtitle": "Government scheme information in your language.",
           "question": "Type your question", "button": "Find information",
           "empty": "Please enter a question.",
           "not_found": "Information is not available for this question yet. Please check the official government website.",
           "large": "Large text", "source": "Official source"},
}

@st.cache_data
def load_schemes():
    with open("schemes.json", "r", encoding="utf-8") as f:
        return json.load(f)

language = st.selectbox("Choose language / भाषा निवडा", list(LANGUAGES.keys()))
code = LANGUAGES[language]
words = TEXT[code]

if st.toggle(words["large"]):
    st.markdown("<style>html, body, [class*='css'] {font-size: 22px !important;}</style>",
                unsafe_allow_html=True)

st.title(words["title"])
st.write(words["subtitle"])
st.divider()

question = st.text_input(words["question"])

if st.button(words["button"], use_container_width=True):
    if not question.strip():
        st.warning(words["empty"])
    else:
        found = False
        for s in load_schemes():
            if any(k.lower() in question.lower() for k in s["keywords"].get(code, [])):
                st.subheader(s["name"][code])
                st.write(s["description"][code])
                st.markdown(f"[{words['source']}]({s['source']})")
                found = True
                break
        if not found:
            st.info(words["not_found"])

st.divider()
st.caption("MahaSahayak AI is an independent information project, not a government website.")