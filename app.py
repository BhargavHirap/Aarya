import streamlit as st
import json
from pathlib import Path
import warnings
warnings.filterwarnings("ignore")

# Your core logic
from core import answer as core_answer, DATA, assess, NOTICE, PORTAL, NEW_PORTAL

# OFFICIAL QWEN FAST MODEL - WITH TOKEN
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

st.set_page_config(page_title="आर्या मराठी AI", page_icon="🌼", layout="centered")

@st.cache_resource
def load_qwen():
    # Use token from Streamlit secrets
    hf_token = st.secrets.get("HF_TOKEN", None)
    model_id = "Qwen/Qwen2.5-0.5B-Instruct"  # OFFICIAL FASTEST
    tokenizer = AutoTokenizer.from_pretrained(model_id, token=hf_token)
    model = AutoModelForCausalLM.from_pretrained(
        model_id, 
        device_map="auto", 
        dtype=torch.float16,
        token=hf_token
    )
    model.eval()
    model.generation_config.max_length = None  # No warning
    return tokenizer, model

st.title("🌼 आर्या मराठी AI")
st.caption("तुमच्या भाषेत, तुमच्या मदतीला.")
st.info(NOTICE)

# Try to load fast model
try:
    tokenizer, model = load_qwen()
    USE_AI = True
    st.success("⚡ Qwen 0.5B FAST Model Ready - WITH TOKEN")
except Exception as e:
    USE_AI = False
    st.warning(f"AI model not loaded, using bundled info only. Error: {e}")

# Chat
if "messages" not in st.session_state:
    st.session_state.messages = []

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

user_q = st.chat_input("तुमचा प्रश्न लिहा... उदा. ST शिष्यवृत्तीसाठी कागदपत्रे?")

if user_q:
    st.session_state.messages.append({"role": "user", "content": user_q})
    with st.chat_message("user"):
        st.markdown(user_q)
    
    # 1. Get core answer (scholarship)
    base_ans = core_answer(user_q)
    
    # 2. Enhance with fast Qwen if available
    if USE_AI and len(base_ans) < 300:  # If core has no answer, use AI
        with st.chat_message("assistant"):
            with st.spinner("आर्या विचार करते..."):
                messages = [
                    {"role": "system", "content": "You are Aarya, helpful Marathi AI for Maharashtra students. Answer in Marathi. Be friendly, short (3-4 sentences). For scholarship, guide to MahaDBT portal."},
                    {"role": "user", "content": user_q}
                ]
                prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
                inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
                with torch.no_grad():
                    outputs = model.generate(
                        **inputs,
                        max_new_tokens=150,
                        temperature=0.7,
                        do_sample=True,
                        pad_token_id=tokenizer.eos_token_id,
                        max_length=None
                    )
                ai_reply = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True).strip()
                final_ans = ai_reply + f"\n\n---\n[अधिकृत MahaDBT]({PORTAL}) | [MahaDBT 2.0]({NEW_PORTAL})"
                st.markdown(final_ans)
    else:
        with st.chat_message("assistant"):
            st.markdown(base_ans)
        final_ans = base_ans

    st.session_state.messages.append({"role": "assistant", "content": final_ans})

# Sidebar - Eligibility checker
with st.sidebar:
    st.header("📋 पात्रता तपासणी")
    scheme_idx = st.selectbox("योजना", [0,1], format_func=lambda i: DATA[i]['name'])
    category = st.selectbox("प्रवर्ग", ["माहित नाही", "SC", "ST", "नवबौद्ध"])
    income = st.number_input("वार्षिक उत्पन्न (₹)", value=None, placeholder="उदा. 150000")
    ssc = st.selectbox("दहावी उत्तीर्ण?", ["माहित नाही", "होय", "नाही"])
    residence = st.selectbox("महाराष्ट्र रहिवासी?", ["माहित नाही", "होय", "नाही"])
    if st.button("तपासा"):
        status, checks = assess(DATA[scheme_idx], category, income, ssc, residence)
        st.write(f"**{status}**")
        for name, val in checks:
            st.write(f"- {name}: {'✅' if val else '❌' if val==False else '❓'}")