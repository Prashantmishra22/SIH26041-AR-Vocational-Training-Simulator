"""
Seed data — 20+ realistic demo workers, modules, questions, attempts, and certificates.
All data is Jharkhand-specific: mining/steel/mica sectors, real district names.
"""

import random
import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.models.user import User, UserRole
from app.models.module import Module
from app.models.question import Question
from app.models.attempt import TrainingAttempt
from app.models.certificate import Certificate, CertificateStatus
from app.utils.security import hash_password
from app.services.certificate_service import generate_certificate_id


# ──────────────────────────────────────────────
# WORKERS
# ──────────────────────────────────────────────
DEMO_WORKERS = [
    {"name": "Rahul Kumar", "worker_id": "DEMO-001", "sector": "Mining", "district": "Dhanbad", "lang": "hi"},
    {"name": "Suman Kumari", "worker_id": "W-1002", "sector": "Steel", "district": "Bokaro", "lang": "hi"},
    {"name": "Amit Kumar", "worker_id": "W-1003", "sector": "Mica", "district": "Koderma", "lang": "hi"},
    {"name": "Priya Devi", "worker_id": "W-1004", "sector": "Mining", "district": "Hazaribagh", "lang": "hi"},
    {"name": "Suresh Mahto", "worker_id": "W-1005", "sector": "Steel", "district": "Jamshedpur", "lang": "hi"},
    {"name": "Ravi Oraon", "worker_id": "W-1006", "sector": "Mining", "district": "Ramgarh", "lang": "sat"},
    {"name": "Sunita Munda", "worker_id": "W-1007", "sector": "Mica", "district": "Giridih", "lang": "sat"},
    {"name": "Deepak Singh", "worker_id": "W-1008", "sector": "Mining", "district": "Dhanbad", "lang": "hi"},
    {"name": "Meena Kumari", "worker_id": "W-1009", "sector": "Steel", "district": "Bokaro", "lang": "hi"},
    {"name": "Rakesh Yadav", "worker_id": "W-1010", "sector": "Mining", "district": "Hazaribagh", "lang": "en"},
    {"name": "Anita Devi", "worker_id": "W-1011", "sector": "Steel", "district": "Jamshedpur", "lang": "hi"},
    {"name": "Manoj Tudu", "worker_id": "W-1012", "sector": "Mica", "district": "Koderma", "lang": "sat"},
    {"name": "Kavita Kumari", "worker_id": "W-1013", "sector": "Mining", "district": "Ramgarh", "lang": "hi"},
    {"name": "Vikram Soren", "worker_id": "W-1014", "sector": "Mining", "district": "Dhanbad", "lang": "sat"},
    {"name": "Pooja Devi", "worker_id": "W-1015", "sector": "Steel", "district": "Bokaro", "lang": "hi"},
    {"name": "Santosh Kumar", "worker_id": "W-1016", "sector": "Mining", "district": "Hazaribagh", "lang": "hi"},
    {"name": "Geeta Mahto", "worker_id": "W-1017", "sector": "Mica", "district": "Giridih", "lang": "hi"},
    {"name": "Ajay Munda", "worker_id": "W-1018", "sector": "Mining", "district": "Dhanbad", "lang": "sat"},
    {"name": "Nisha Kumari", "worker_id": "W-1019", "sector": "Steel", "district": "Jamshedpur", "lang": "en"},
    {"name": "Birsa Oraon", "worker_id": "W-1020", "sector": "Mining", "district": "Ramgarh", "lang": "sat"},
    {"name": "Lakshmi Devi", "worker_id": "W-1021", "sector": "Steel", "district": "Bokaro", "lang": "hi"},
    {"name": "Ramesh Hansda", "worker_id": "W-1022", "sector": "Mica", "district": "Koderma", "lang": "sat"},
]


# ──────────────────────────────────────────────
# MODULES
# ──────────────────────────────────────────────
MODULES = [
    {
        "module_id": "FIRE-001",
        "title": "Fire & Explosion Response",
        "title_hi": "आग और विस्फोट प्रतिक्रिया",
        "title_sat": "ᱥᱮᱸᱜᱮᱞ ᱟᱨ ᱯᱷᱚᱴᱠᱟ ᱡᱚᱦᱟᱨ",
        "description": "Learn fire hazard identification, emergency exits, extinguisher selection, and evacuation procedures.",
        "description_hi": "आग के खतरों की पहचान, आपातकालीन निकास, अग्निशामक चयन और निकासी प्रक्रियाएं सीखें।",
        "icon": "🔥",
        "coming_soon": False,
    },
    {
        "module_id": "GAS-001",
        "title": "Gas Leak & Confined Space Protocol",
        "title_hi": "गैस रिसाव और सीमित स्थान प्रोटोकॉल",
        "title_sat": "ᱜᱮᱥ ᱞᱤᱠ ᱟᱨ ᱠᱚᱸᱰᱟ ᱡᱟᱭᱜᱟ",
        "description": "Learn gas hazard recognition, PPE selection, confined-space entry, and buddy-system procedures.",
        "description_hi": "गैस खतरे की पहचान, PPE चयन, सीमित स्थान प्रवेश और बडी-सिस्टम प्रक्रियाएं सीखें।",
        "icon": "☠️",
        "coming_soon": False,
    },
    {
        "module_id": "MACH-001",
        "title": "Machinery Safety",
        "title_hi": "मशीनरी सुरक्षा",
        "icon": "⚙️",
        "coming_soon": True,
    },
    {
        "module_id": "PPE-001",
        "title": "PPE & Workplace Safety",
        "title_hi": "PPE और कार्यस्थल सुरक्षा",
        "icon": "🦺",
        "coming_soon": True,
    },
    {
        "module_id": "EMER-001",
        "title": "Emergency Response",
        "title_hi": "आपातकालीन प्रतिक्रिया",
        "icon": "🚨",
        "coming_soon": True,
    },
]


# ──────────────────────────────────────────────
# QUESTIONS — Fire & Explosion (10 questions)
# ──────────────────────────────────────────────
FIRE_QUESTIONS = [
    {
        "question_type": "mcq",
        "question": "What should a worker do FIRST after discovering a fire?",
        "question_hi": "आग का पता लगने पर कर्मचारी को सबसे पहले क्या करना चाहिए?",
        "options": ["Try to extinguish it alone", "Raise the alarm", "Run away immediately", "Call family"],
        "options_hi": ["अकेले बुझाने की कोशिश करें", "अलार्म बजाएं", "तुरंत भाग जाएं", "परिवार को कॉल करें"],
        "correct_answer": "Raise the alarm",
        "explanation": "The first priority is to raise the alarm to alert all workers and initiate the emergency response plan.",
        "explanation_hi": "पहली प्राथमिकता अलार्म बजाना है ताकि सभी कर्मचारी सतर्क हो जाएं।",
    },
    {
        "question_type": "mcq",
        "question": "Which type of fire extinguisher is most appropriate for an electrical fire?",
        "question_hi": "बिजली की आग के लिए कौन सा अग्निशामक सबसे उपयुक्त है?",
        "options": ["Water", "Foam", "CO2", "Sand"],
        "options_hi": ["पानी", "फोम", "CO2", "रेत"],
        "correct_answer": "CO2",
        "explanation": "CO2 extinguishers are safe for electrical fires because they don't conduct electricity.",
        "explanation_hi": "CO2 अग्निशामक बिजली की आग के लिए सुरक्षित है क्योंकि यह बिजली का संचालन नहीं करता।",
    },
    {
        "question_type": "true_false",
        "question": "A worker should use a lift/elevator during a fire evacuation.",
        "question_hi": "आग में निकासी के दौरान कर्मचारी को लिफ्ट का उपयोग करना चाहिए।",
        "options": ["True", "False"],
        "options_hi": ["सही", "गलत"],
        "correct_answer": "False",
        "explanation": "Never use elevators during fire — always use stairs.",
        "explanation_hi": "आग के दौरान लिफ्ट का उपयोग कभी न करें — हमेशा सीढ़ियों का उपयोग करें।",
    },
    {
        "question_type": "mcq",
        "question": "What does the assembly point serve during evacuation?",
        "question_hi": "निकासी के दौरान असेंबली पॉइंट का क्या उद्देश्य है?",
        "options": ["Rest area", "Head-count and safety confirmation", "Equipment storage", "First aid only"],
        "options_hi": ["विश्राम क्षेत्र", "गणना और सुरक्षा पुष्टि", "उपकरण भंडारण", "केवल प्राथमिक चिकित्सा"],
        "correct_answer": "Head-count and safety confirmation",
        "explanation": "The assembly point is where all workers gather so supervisors can confirm everyone is accounted for.",
    },
    {
        "question_type": "mcq",
        "question": "What should you do if your escape route is blocked by smoke?",
        "question_hi": "अगर आपका निकास मार्ग धुएं से अवरुद्ध हो तो क्या करना चाहिए?",
        "options": ["Run through the smoke", "Stay low and find alternate route", "Wait in place", "Open windows"],
        "options_hi": ["धुएं से होकर भागें", "नीचे रहें और वैकल्पिक मार्ग खोजें", "वहीं रुकें", "खिड़कियां खोलें"],
        "correct_answer": "Stay low and find alternate route",
        "explanation": "Smoke rises, so staying low gives you cleaner air. Always look for an alternate route.",
    },
    {
        "question_type": "sequence",
        "question": "Arrange the evacuation steps in correct order.",
        "question_hi": "निकासी चरणों को सही क्रम में व्यवस्थित करें।",
        "options": ["Raise alarm", "Stop unsafe activity", "Move to exit", "Avoid smoke areas", "Reach assembly point"],
        "options_hi": ["अलार्म बजाएं", "असुरक्षित गतिविधि रोकें", "निकास की ओर बढ़ें", "धुएं से बचें", "असेंबली पॉइंट पहुंचें"],
        "correct_answer": "Raise alarm,Stop unsafe activity,Move to exit,Avoid smoke areas,Reach assembly point",
        "explanation": "The correct evacuation sequence ensures safety for everyone.",
    },
    {
        "question_type": "true_false",
        "question": "Water extinguishers can be used on oil/grease fires.",
        "question_hi": "तेल/ग्रीस की आग पर पानी वाले अग्निशामक का उपयोग किया जा सकता है।",
        "options": ["True", "False"],
        "options_hi": ["सही", "गलत"],
        "correct_answer": "False",
        "explanation": "Water can spread oil fires and cause splashing. Use foam or dry chemical extinguishers.",
    },
    {
        "question_type": "mcq",
        "question": "What is the PASS technique for using a fire extinguisher?",
        "question_hi": "अग्निशामक उपयोग करने की PASS तकनीक क्या है?",
        "options": [
            "Pull, Aim, Squeeze, Sweep",
            "Push, Aim, Spray, Stop",
            "Pull, Adjust, Spray, Stop",
            "Push, Alert, Squeeze, Sweep"
        ],
        "correct_answer": "Pull, Aim, Squeeze, Sweep",
        "explanation": "PASS: Pull the pin, Aim at the base, Squeeze the handle, Sweep side to side.",
    },
    {
        "question_type": "mcq",
        "question": "How often should fire drills be conducted in a mining facility?",
        "question_hi": "खनन सुविधा में अग्नि अभ्यास कितनी बार होना चाहिए?",
        "options": ["Once a year", "Every 6 months", "Every 3 months", "Only when required by law"],
        "options_hi": ["साल में एक बार", "हर 6 महीने", "हर 3 महीने", "केवल कानून द्वारा आवश्यक होने पर"],
        "correct_answer": "Every 3 months",
        "explanation": "Regular quarterly drills ensure workers are prepared for emergencies.",
    },
    {
        "question_type": "true_false",
        "question": "A worker should try to collect personal belongings before evacuating during a fire.",
        "question_hi": "आग के दौरान निकासी से पहले कर्मचारी को अपना सामान इकट्ठा करना चाहिए।",
        "options": ["True", "False"],
        "options_hi": ["सही", "गलत"],
        "correct_answer": "False",
        "explanation": "Never delay evacuation for personal belongings. Safety comes first.",
    },
]


# ──────────────────────────────────────────────
# QUESTIONS — Gas Leak & Confined Space (10 questions)
# ──────────────────────────────────────────────
GAS_QUESTIONS = [
    {
        "question_type": "mcq",
        "question": "What is the first sign that a gas leak may be present?",
        "question_hi": "गैस रिसाव का पहला संकेत क्या हो सकता है?",
        "options": ["Unusual smell or hissing sound", "Change in room color", "Increased temperature", "Loud explosion"],
        "options_hi": ["असामान्य गंध या सिसकारी", "कमरे के रंग में बदलाव", "तापमान में वृद्धि", "तेज विस्फोट"],
        "correct_answer": "Unusual smell or hissing sound",
        "explanation": "Gas leaks often produce a distinct smell (like rotten eggs for H2S) or hissing sounds.",
    },
    {
        "question_type": "true_false",
        "question": "A worker can enter a confined space alone if they have proper PPE.",
        "question_hi": "एक कर्मचारी उचित PPE होने पर अकेले सीमित स्थान में प्रवेश कर सकता है।",
        "options": ["True", "False"],
        "options_hi": ["सही", "गलत"],
        "correct_answer": "False",
        "explanation": "Never enter a confined space alone. The buddy system requires at least one attendant outside.",
    },
    {
        "question_type": "mcq",
        "question": "Which PPE is MOST critical for gas leak situations?",
        "question_hi": "गैस रिसाव के लिए कौन सा PPE सबसे महत्वपूर्ण है?",
        "options": ["Safety shoes", "Hard hat", "Respirator/gas mask", "Reflective vest"],
        "options_hi": ["सुरक्षा जूते", "हार्ड हैट", "रेस्पिरेटर/गैस मास्क", "रिफ्लेक्टिव वेस्ट"],
        "correct_answer": "Respirator/gas mask",
        "explanation": "A respirator protects against inhaling toxic gases, which is the primary danger in gas leaks.",
    },
    {
        "question_type": "sequence",
        "question": "Arrange the confined space entry procedure in correct order.",
        "question_hi": "सीमित स्थान प्रवेश प्रक्रिया को सही क्रम में व्यवस्थित करें।",
        "options": ["Gas testing", "Ventilation", "PPE donning", "Buddy/Attendant ready", "Authorization", "Entry"],
        "options_hi": ["गैस परीक्षण", "वेंटिलेशन", "PPE पहनना", "बड/अटेंडेंट तैयार", "प्राधिकरण", "प्रवेश"],
        "correct_answer": "Gas testing,Ventilation,PPE donning,Buddy/Attendant ready,Authorization,Entry",
        "explanation": "This sequence ensures the space is tested and safe before anyone enters.",
    },
    {
        "question_type": "mcq",
        "question": "What should the attendant do if the worker inside becomes unresponsive?",
        "question_hi": "अगर अंदर का कर्मचारी अनुत्तरदायी हो जाए तो अटेंडेंट को क्या करना चाहिए?",
        "options": ["Enter immediately to help", "Call emergency services and initiate rescue", "Wait for the worker to respond", "Leave the area"],
        "options_hi": ["तुरंत अंदर जाएं", "आपातकालीन सेवाओं को कॉल करें", "कर्मचारी के जवाब की प्रतीक्षा करें", "क्षेत्र छोड़ दें"],
        "correct_answer": "Call emergency services and initiate rescue",
        "explanation": "The attendant must NOT enter — they should call for trained rescue teams.",
    },
    {
        "question_type": "mcq",
        "question": "What does LEL stand for in gas detection?",
        "question_hi": "गैस डिटेक्शन में LEL का क्या मतलब है?",
        "options": ["Low Energy Level", "Lower Explosive Limit", "Liquid Emission Level", "Light Exposure Limit"],
        "correct_answer": "Lower Explosive Limit",
        "explanation": "LEL is the minimum concentration of gas in air that can form an explosive mixture.",
    },
    {
        "question_type": "true_false",
        "question": "Ventilation must be maintained continuously while workers are in a confined space.",
        "question_hi": "सीमित स्थान में कर्मचारियों के रहते हुए वेंटिलेशन लगातार बनाए रखना चाहिए।",
        "options": ["True", "False"],
        "options_hi": ["सही", "गलत"],
        "correct_answer": "True",
        "explanation": "Continuous ventilation ensures breathable air and prevents gas buildup.",
    },
    {
        "question_type": "mcq",
        "question": "Which gas is commonly known as the 'silent killer' in mines?",
        "question_hi": "खदानों में कौन सी गैस 'साइलेंट किलर' के रूप में जानी जाती है?",
        "options": ["Oxygen", "Carbon Monoxide", "Nitrogen", "Helium"],
        "options_hi": ["ऑक्सीजन", "कार्बन मोनोऑक्साइड", "नाइट्रोजन", "हीलियम"],
        "correct_answer": "Carbon Monoxide",
        "explanation": "CO is odorless and colorless, making it extremely dangerous without detection equipment.",
    },
    {
        "question_type": "mcq",
        "question": "When should gas testing be performed in a confined space?",
        "question_hi": "सीमित स्थान में गैस परीक्षण कब किया जाना चाहिए?",
        "options": ["Only at entry", "Before and continuously during work", "Only when smell is detected", "Once a day"],
        "correct_answer": "Before and continuously during work",
        "explanation": "Gas conditions can change rapidly. Continuous monitoring is essential.",
    },
    {
        "question_type": "true_false",
        "question": "A gas detector only needs calibration once a year.",
        "question_hi": "गैस डिटेक्टर को साल में केवल एक बार कैलिब्रेशन की आवश्यकता होती है।",
        "options": ["True", "False"],
        "options_hi": ["सही", "गलत"],
        "correct_answer": "False",
        "explanation": "Gas detectors should be calibrated according to manufacturer guidelines, typically monthly.",
    },
]


def seed_database(db: Session):
    """Seed the database with demo data. Idempotent — skips if data already exists."""

    # Check if already seeded
    if db.query(User).first():
        print("Database already seeded. Skipping.")
        return

    print("Seeding database...")

    # ─── Admin user ───
    admin = User(
        name="Admin",
        worker_id="ADMIN-001",
        password_hash=hash_password("admin123"),
        sector="Admin",
        district="Ranchi",
        language="en",
        role=UserRole.ADMIN,
    )
    db.add(admin)

    # ─── Workers ───
    workers = []
    for w in DEMO_WORKERS:
        user = User(
            name=w["name"],
            worker_id=w["worker_id"],
            password_hash=hash_password("demo123"),
            sector=w["sector"],
            district=w["district"],
            language=w["lang"],
            phone=f"+91-{random.randint(7000000000, 9999999999)}",
        )
        db.add(user)
        workers.append(user)

    db.flush()  # Get IDs

    # ─── Modules ───
    modules = []
    for m_data in MODULES:
        m = Module(**m_data)
        db.add(m)
        modules.append(m)

    db.flush()

    fire_module = modules[0]
    gas_module = modules[1]

    # ─── Questions ───
    for q_data in FIRE_QUESTIONS:
        q = Question(module_id=fire_module.id, **q_data)
        db.add(q)

    for q_data in GAS_QUESTIONS:
        q = Question(module_id=gas_module.id, **q_data)
        db.add(q)

    db.flush()

    # ─── Attempts & Certificates ───
    now = datetime.now(timezone.utc)

    for i, worker in enumerate(workers):
        # ~80% of workers have attempted fire module
        if random.random() < 0.8:
            score = random.randint(55, 100)
            passed = score >= 70
            attempt = TrainingAttempt(
                attempt_id=f"AT-{uuid.uuid4().hex[:8].upper()}",
                user_id=worker.id,
                module_id=fire_module.id,
                score=score,
                passed=passed,
                duration_seconds=random.randint(180, 600),
                correct_answers=score // 10,
                incorrect_answers=10 - (score // 10),
                ar_score=random.randint(60, 100),
                knowledge_score=score,
                completed_at=now - timedelta(days=random.randint(1, 60)),
            )
            db.add(attempt)

            if passed:
                cert_id = generate_certificate_id()
                cert = Certificate(
                    certificate_id=cert_id,
                    user_id=worker.id,
                    module_id=fire_module.id,
                    score=score,
                    issue_date=attempt.completed_at,
                    status=CertificateStatus.VALID,
                    qr_data=f"http://localhost:8000/api/certificates/verify/{cert_id}",
                )
                db.add(cert)

        # ~50% of workers have attempted gas module
        if random.random() < 0.5:
            score = random.randint(50, 100)
            passed = score >= 70
            attempt = TrainingAttempt(
                attempt_id=f"AT-{uuid.uuid4().hex[:8].upper()}",
                user_id=worker.id,
                module_id=gas_module.id,
                score=score,
                passed=passed,
                duration_seconds=random.randint(200, 700),
                correct_answers=score // 10,
                incorrect_answers=10 - (score // 10),
                ar_score=random.randint(55, 100),
                knowledge_score=score,
                completed_at=now - timedelta(days=random.randint(1, 45)),
            )
            db.add(attempt)

            if passed:
                cert_id = generate_certificate_id()
                cert = Certificate(
                    certificate_id=cert_id,
                    user_id=worker.id,
                    module_id=gas_module.id,
                    score=score,
                    issue_date=attempt.completed_at,
                    status=CertificateStatus.VALID,
                    qr_data=f"http://localhost:8000/api/certificates/verify/{cert_id}",
                )
                db.add(cert)

    db.commit()
    print(f"Seeded {len(workers)} workers, {len(modules)} modules, questions, attempts, and certificates.")
