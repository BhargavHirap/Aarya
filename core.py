import json
import re
from pathlib import Path
DATA = json.loads(Path(__file__).with_name('schemes.json').read_text(encoding='utf-8'))
NOTICE = 'ही शैक्षणिक नमुना आवृत्ती आहे, सरकारी सेवा नाही. प्राथमिक मार्गदर्शन म्हणजे अधिकृत पात्रता / मंजुरी नाही. उपलब्ध माहिती थेट अद्ययावत होत नाही; अंतिम नियम व मुदती अधिकृत पोर्टलवर तपासा.'
PORTAL = 'https://mahadbt.maharashtra.gov.in/'
NEW_PORTAL = 'https://mahadbt2.maharashtra.gov.in/'
def retrieve(q):
    q=q.casefold()
    if re.search(r'(?<![a-z])st(?![a-z])', q) or any(x in q for x in ['जमाती','आदिवासी']): return [DATA[1]]
    if re.search(r'(?<![a-z])sc(?![a-z])', q) or any(x in q for x in ['नवबौद्ध','अनुसूचित जाती']): return [DATA[0]]
    if any(x in q for x in ['शिष्य','scholar','mahadbt','मॅट्रिक','कागदपत्र','document','अर्ज','पात्र','eligib','student','विद्यार्थ']): return DATA
    return []
def render_scheme(s):
    return ('### '+s['name']+'\n'+s['summary']+'\n\n**पात्रता व विशेष अटी**\n'+
      '\n'.join('- '+r for r in s['rules'])+'\n\n**कागदपत्रे**\n'+
      '\n'.join('- '+d for d in s['documents'])+'\n\n'+s['note']+
      '\n\n[अधिकृत नियम व स्रोत]('+s['source']+') · तपासणी: '+s['checked'])
def answer(q):
    if len(q.strip())>2000: return 'कृपया प्रश्न २००० अक्षरांमध्ये लिहा.'
    found=retrieve(q)
    if not found:
        return 'नमस्कार! मी आर्या. सध्या माझ्याकडे SC / नवबौद्ध आणि ST मॅट्रिकोत्तर शिष्यवृत्तीची मर्यादित, स्रोत-आधारित माहिती आहे. या प्रश्नाचे खात्रीशीर उत्तर माझ्याकडे नाही. उदाहरण: “ST शिष्यवृत्तीसाठी कागदपत्रे कोणती?”\n\n[अधिकृत MahaDBT पोर्टल]('+PORTAL+')'
    return '\n\n---\n\n'.join(render_scheme(s) for s in found)+'\n\n**अर्ज:** नोंदणी / लॉगिन → प्रोफाइल पूर्ण करा → लागू योजना व नियम तपासा → आवश्यक कागदपत्रांसह अर्ज करा. पोर्टलच्या सूचनेनुसार AY 2026–27 चे नवीन / नूतनीकरण अर्ज MahaDBT 2.0 वर आहेत; सध्याची सूचना पुन्हा तपासा. [MahaDBT 2.0]('+NEW_PORTAL+'). मुदत येथे पडताळलेली नाही.'
def assess(s,category,income,ssc,residence):
    checks=[('प्रवर्ग',None if category=='माहित नाही' else category in s['category']),
      ('वार्षिक उत्पन्न मर्यादा',None if income is None else income<=s['income_max']),
      ('दहावी / समकक्ष उत्तीर्ण',None if ssc=='माहित नाही' else ssc=='होय')]
    if s['residence_required']: checks.append(('महाराष्ट्र रहिवास',None if residence=='माहित नाही' else residence=='होय'))
    if any(v is False for _,v in checks): status='दिलेल्या उत्तरांनुसार काही प्राथमिक अटी जुळत नाहीत. अधिकृत नियम / अपवाद तपासा.'
    elif any(v is None for _,v in checks): status='माहिती अपुरी आहे; प्राथमिक अटी ठरवता येत नाहीत.'
    else: status='तपासलेल्या प्राथमिक अटी जुळतात; अंतिम पात्रता अजून निश्चित नाही.'
    return status,checks