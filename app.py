import streamlit as st
from google import genai
from google.genai import types
from rag import load_schemes, retrieve, build_context

st.set_page_config(page_title="MahaSahayak AI", page_icon="🇮🇳", layout="centered")

LANGUAGES = {"मराठी": "mr", "हिन्दी": "hi", "English": "en"}
LANG_NAME = {"mr": "Marathi", "hi": "Hindi", "en": "English"}

TEXT = {
    "mr": {"title": "महा सहाय्यक AI", "subtitle": "सरकारी योजनांची माहिती, आपल्या भाषेत.",
           "question": "तुमचा प्रश्न लिहा", "button": "माहिती शोधा",
           "empty": "कृपया प्रश्न लिहा.",
           "not_found": "या प्रश्नासाठी सध्या माहिती उपलब्ध नाही. कृपया अधिकृत सरकारी वेबसाइट तपासा.",
           "error": "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
           "large": "मोठे अक्षर", "source": "अधिकृत स्रोत"},
    "hi": {"title": "महा सहायक AI", "subtitle": "सरकारी योजनाओं की जानकारी, आपकी भाषा में।",
           "question": "अपना सवाल लिखें", "button": "जानकारी खोजें",
           "empty": "कृपया सवाल लिखें।",
           "not_found": "इस सवाल के लिए अभी जानकारी उपलब्ध नहीं है। कृपया आधिकारिक वेबसाइट देखें।",
           "error": "कुछ गड़बड़ हुई। कृपया फिर कोशिश करें।",
           "large": "बड़े अक्षर", "source": "आधिकारिक स्रोत"},
    "en": {"title": "MahaSahayak AI", "subtitle": "Government scheme information in your language.",
           "question": "Type your question", "button": "Find information",
           "empty": "Please enter a question.",
           "not_found": "Information is not available for this question yet. Please check the official government website.",
           "error": "Something went wrong. Please try again.",
           "large": "Large text", "source": "Official source"},
}

SYSTEM_PROMPT = """You are MahaSahayak AI.
You help citizens understand government schemes and public services in Maharashtra.
Use simple language. Reply ONLY in {language}.
Use ONLY the verified information provided to you in the CONTEXT.
Do not invent eligibility rules, deadlines, benefit amounts or required documents.
If the context does not contain the answer, say you cannot verify it and tell the user to check the official source.
Never promise that someone is eligible or will be approved.
Always mention the official source link from the context.
You are an information assistant, not a government authority."""

@st.cache_data
def get_schemes():
    return load_schemes()

@st.cache_resource
def get_client():
    return genai.Client(api_key=st.secrets["GEMINI_API_KEY"])

def answer_question(question, code):
    matches = retrieve(question, get_schemes())
    if not matches:
        return None, []          # refuse: nothing verified to answer from
    context = build_context(matches, code)
    response = get_client().models.generate_content(
        model=st.secrets.get("GEMINI_MODEL", "gemini-2.5-flash"),
        contents=f"CONTEXT:\n{context}\n\nUSER QUESTION:\n{question}",
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT.format(language=LANG_NAME[code]),
            temperature=0.2,
        ),
    )
    return response.text, [m["source"] for m in matches]

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
        try:
            with st.spinner("..."):
                answer, sources = answer_question(question, code)
            if answer is None:
                st.info(words["not_found"])
            else:
                st.write(answer)
                for src in sources:
                    st.markdown(f"[{words['source']}]({src})")
                st.caption("Verify details on the official source before applying.")
        except Exception as e:
            st.error(words["error"])
            print("ERROR:", e)

st.divider()
st.caption("MahaSahayak AI is an independent information project, not a government website.")