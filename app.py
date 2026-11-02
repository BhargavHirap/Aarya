import streamlit as st
from google import genai
from google.genai import types

st.set_page_config(page_title="My AI Friend", page_icon="💬")
st.title("💬 My AI Friend")

client = genai.Client(api_key=st.secrets["GEMINI_API_KEY"])
MODEL = st.secrets.get("GEMINI_MODEL", "gemini-2.5-flash")

SYSTEM = """You are a friendly, helpful AI assistant.
Talk about anything: studies, coding, life advice, ideas, casual chat.
Reply in the same language the user writes in (Marathi, Hindi, English or a mix).
Keep answers clear and simple. If you are not sure about something, say so
instead of guessing. Be honest, kind and respectful."""

if "messages" not in st.session_state:
    st.session_state.messages = []

with st.sidebar:
    if st.button("New chat"):
        st.session_state.messages = []
        st.rerun()

# show past messages
for m in st.session_state.messages:
    with st.chat_message(m["role"]):
        st.write(m["content"])

prompt = st.chat_input("Ask me anything / काहीही विचारा")

if prompt:
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

    history = [
        types.Content(
            role="user" if m["role"] == "user" else "model",
            parts=[types.Part(text=m["content"])],
        )
        for m in st.session_state.messages
    ]

    def stream():
        try:
            for chunk in client.models.generate_content_stream(
                model=MODEL,
                contents=history,
                config=types.GenerateContentConfig(system_instruction=SYSTEM),
            ):
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            print("ERROR:", e)
            yield "Sorry, something went wrong. Please try again."

    with st.chat_message("assistant"):
        reply = st.write_stream(stream())
    st.session_state.messages.append({"role": "assistant", "content": reply})
