from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
import joblib
import os
import nltk
from nltk.tokenize import word_tokenize

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)

app = FastAPI(title="SchemeConnect ML Service", version="1.0.0")

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000", "http://127.0.0.1:3000", "http://192.168.9.73:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── LOAD MODELS (if they exist) ─────────────────────────────────────────────
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

def load_model(filename):
    path = os.path.join(MODEL_DIR, filename)
    if os.path.exists(path):
        return joblib.load(path)
    return None

eligibility_model   = load_model("eligibility_model.pkl")
recommender_data    = load_model("recommender_data.pkl")
fraud_model         = load_model("fraud_model.pkl")
le_gender           = load_model("le_gender.pkl")
le_caste            = load_model("le_caste.pkl")
le_state            = load_model("le_state.pkl")
le_occupation       = load_model("le_occupation.pkl")

# ─── SCHEMES DATA (used for recommendation) ──────────────────────────────────
SCHEMES = [
    {
        "id": "1",
        "name": "PM Kisan Samman Nidhi",
        "category": "Agriculture",
        "min_income": 0,
        "max_income": 200000,
        "min_age": 18,
        "max_age": 80,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Farmer"],
        "benefits": "₹6,000 per year direct income support to farmers",
        "state": "National"
    },
    {
        "id": "2",
        "name": "PM Awas Yojana",
        "category": "Housing",
        "min_income": 0,
        "max_income": 300000,
        "min_age": 18,
        "max_age": 70,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Farmer", "Daily Wage Worker", "Self Employed", "Unemployed"],
        "benefits": "Financial assistance for construction of pucca house",
        "state": "National"
    },
    {
        "id": "3",
        "name": "Ayushman Bharat",
        "category": "Health",
        "min_income": 0,
        "max_income": 500000,
        "min_age": 0,
        "max_age": 100,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Farmer", "Daily Wage Worker", "Self Employed", "Unemployed"],
        "benefits": "Health coverage up to ₹5 lakh per family per year",
        "state": "National"
    },
    {
        "id": "4",
        "name": "National Scholarship Portal",
        "category": "Education",
        "min_income": 0,
        "max_income": 250000,
        "min_age": 5,
        "max_age": 30,
        "caste": ["SC", "ST", "OBC"],
        "occupation": ["Student"],
        "benefits": "Scholarships for students from minority and SC/ST communities",
        "state": "National"
    },
    {
        "id": "5",
        "name": "PM Mudra Yojana",
        "category": "Finance",
        "min_income": 0,
        "max_income": 1000000,
        "min_age": 18,
        "max_age": 65,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Self Employed", "Small Business Owner"],
        "benefits": "Loans up to ₹10 lakh for small businesses without collateral",
        "state": "National"
    },
    {
        "id": "6",
        "name": "Sukanya Samriddhi Yojana",
        "category": "Finance",
        "min_income": 0,
        "max_income": 1000000,
        "min_age": 18,
        "max_age": 60,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Farmer", "Daily Wage Worker", "Self Employed", "Salaried"],
        "benefits": "Savings scheme for girl child with high interest rate",
        "state": "National"
    },
    {
        "id": "7",
        "name": "MGNREGA",
        "category": "Employment",
        "min_income": 0,
        "max_income": 150000,
        "min_age": 18,
        "max_age": 60,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Daily Wage Worker", "Farmer", "Unemployed"],
        "benefits": "Guaranteed 100 days of wage employment per year",
        "state": "National"
    },
    {
        "id": "8",
        "name": "Atal Pension Yojana",
        "category": "Pension",
        "min_income": 0,
        "max_income": 500000,
        "min_age": 18,
        "max_age": 40,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Farmer", "Daily Wage Worker", "Self Employed"],
        "benefits": "Guaranteed minimum pension of ₹1,000 to ₹5,000 per month",
        "state": "National"
    },
    # ─── STATE-SPECIFIC SCHEMES ─────────────────────────────────────────────
    {
        "id": "9",
        "name": "Maharashtra Rajshri Yojana",
        "category": "Social Security",
        "min_income": 0,
        "max_income": 750000,
        "min_age": 18,
        "max_age": 60,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Farmer", "Self Employed", "Salaried", "Business Owner"],
        "benefits": "₹10,00,000 life insurance cover for female citizens",
        "state": "Maharashtra"
    },
    {
        "id": "10",
        "name": "Maharashtra Mazgaon Sheli Yojana",
        "category": "Agriculture",
        "min_income": 0,
        "max_income": 150000,
        "min_age": 18,
        "max_age": 65,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Farmer"],
        "benefits": "Subsidy on purchase of sheep and goats for farmers",
        "state": "Maharashtra"
    },
    {
        "id": "11",
        "name": "Karnataka Raitha Belaku",
        "category": "Agriculture",
        "min_income": 0,
        "max_income": 200000,
        "min_age": 18,
        "max_age": 70,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Farmer"],
        "benefits": "₹10,000 annual input subsidy for farmers",
        "state": "Karnataka"
    },
    {
        "id": "12",
        "name": "Karnataka Gruha Lakshmi",
        "category": "Social Security",
        "min_income": 0,
        "max_income": 500000,
        "min_age": 18,
        "max_age": 100,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Homemaker"],
        "benefits": "₹2,000 monthly financial assistance to women heads of family",
        "state": "Karnataka"
    },
    {
        "id": "13",
        "name": "Tamil Nadu Kalaignar Muthulam",
        "category": "Education",
        "min_income": 0,
        "max_income": 250000,
        "min_age": 5,
        "max_age": 25,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Student"],
        "benefits": "Free education scheme for economically weaker students",
        "state": "Tamil Nadu"
    },
    {
        "id": "14",
        "name": "Tamil Nadu Uzhavar Paththu",
        "category": "Agriculture",
        "min_income": 0,
        "max_income": 200000,
        "min_age": 18,
        "max_age": 70,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Farmer"],
        "benefits": "₹10,000 per year input subsidy for farmers",
        "state": "Tamil Nadu"
    },
    {
        "id": "15",
        "name": "UP Kanya Vidhan",
        "category": "Education",
        "min_income": 0,
        "max_income": 300000,
        "min_age": 5,
        "max_age": 22,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Student"],
        "benefits": "Scholarship of ₹300 per month for girl students",
        "state": "Uttar Pradesh"
    },
    {
        "id": "16",
        "name": "UP Mukhyamantri Samaj Sewa",
        "category": "Social Security",
        "min_income": 0,
        "max_income": 200000,
        "min_age": 18,
        "max_age": 60,
        "caste": ["SC", "ST"],
        "occupation": ["Daily Wage Worker", "Unemployed", "Self Employed"],
        "benefits": "Monthly pension of ₹500 for SC/ST citizens",
        "state": "Uttar Pradesh"
    },
    {
        "id": "17",
        "name": "West Bengal Lakshmi Bhandar",
        "category": "Social Security",
        "min_income": 0,
        "max_income": 500000,
        "min_age": 25,
        "max_age": 60,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Homemaker", "Self Employed", "Daily Wage Worker"],
        "benefits": "₹500-1000 per month to women of BPL families",
        "state": "West Bengal"
    },
    {
        "id": "18",
        "name": "Rajasthan Bhamashah Yojana",
        "category": "Social Security",
        "min_income": 0,
        "max_income": 400000,
        "min_age": 18,
        "max_age": 100,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Homemaker", "Unemployed", "Daily Wage Worker"],
        "benefits": "₹500-1000 per month to women from Below Poverty Line families",
        "state": "Rajasthan"
    },
    {
        "id": "19",
        "name": "Gujarat Mukhyamantri Amrutam Yojana",
        "category": "Health",
        "min_income": 0,
        "max_income": 600000,
        "min_age": 0,
        "max_age": 100,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Daily Wage Worker", "Self Employed", "Farmer", "Unemployed"],
        "benefits": "Free health coverage up to ₹5 lakh per family per year",
        "state": "Gujarat"
    },
    {
        "id": "20",
        "name": "Bihar Mukhyamantri Kanya Vivah",
        "category": "Social Security",
        "min_income": 0,
        "max_income": 200000,
        "min_age": 18,
        "max_age": 30,
        "caste": ["SC", "ST"],
        "occupation": ["Unemployed", "Daily Wage Worker", "Farmer"],
        "benefits": "₹10,000 financial assistance for marriage of SC/ST girls",
        "state": "Bihar"
    },
]

# ─── CHATBOT INTENTS ──────────────────────────────────────────────────────────
INTENTS = {
    "eligibility": {
        "keywords": ["eligible", "qualify", "eligibility", "check", "criteria", "who can", "requirements"],
        "response": "To check eligibility, you need to provide your age, annual income, caste category, state, and occupation. I can then match you with schemes you qualify for. Would you like to check now?"
    },
    "apply": {
        "keywords": ["apply", "application", "how to apply", "register", "enroll", "sign up"],
        "response": "To apply for a scheme: 1) Check your eligibility first, 2) Click 'Apply Now' on the scheme card, 3) Fill in the application form, 4) Upload required documents, 5) Submit and track your status."
    },
    "documents": {
        "keywords": ["documents", "papers", "required", "aadhaar", "income certificate", "caste certificate"],
        "response": "Common documents required: Aadhaar Card, Income Certificate, Caste Certificate (if applicable), Bank Account details, Passport size photo, and Address proof."
    },
    "status": {
        "keywords": ["status", "track", "update", "progress", "application status", "pending", "approved"],
        "response": "You can track your application status in the 'My Applications' section. Status stages are: Submitted → Under Review → Approved/Rejected."
    },
    "schemes": {
        "keywords": ["schemes", "benefits", "government", "list", "available", "what schemes", "all schemes"],
        "response": "We have schemes across categories: Agriculture (PM Kisan), Housing (PM Awas Yojana), Health (Ayushman Bharat), Education (NSP Scholarships), Employment (MGNREGA), and more. Check eligibility to see which ones apply to you!"
    },
    "greeting": {
        "keywords": ["hello", "hi", "hey", "good morning", "good evening", "namaste"],
        "response": "Namaste! Welcome to SchemeConnect. I can help you find government schemes you're eligible for, guide you through the application process, or answer questions about any scheme. How can I help you today?"
    },
    "help": {
        "keywords": ["help", "support", "assist", "guide", "what can you do", "how does this work"],
        "response": "I can help you with: 1) Finding schemes you're eligible for, 2) Application process guidance, 3) Document requirements, 4) Tracking application status, 5) Information about specific schemes."
    },
}

DEFAULT_RESPONSE = "I'm not sure I understood that. You can ask me about: checking eligibility, how to apply, required documents, tracking application status, or available schemes."

# ─── PYDANTIC MODELS ──────────────────────────────────────────────────────────
class CitizenProfile(BaseModel):
    age: int
    gender: str
    annual_income: float
    caste: str
    state: str
    occupation: str
    family_size: int
    land_owned: Optional[float] = 0.0
    has_bank_account: Optional[bool] = True

class FraudCheckRequest(BaseModel):
    citizen_id: str
    name: str
    aadhaar_hash: str
    age: int
    state: str
    annual_income: float
    application_count: Optional[int] = 1

class ChatRequest(BaseModel):
    message: str
    citizen_id: Optional[str] = None

# ─── ML HELPERS (use label encoders + trained models) ────────────────────────
FEATURES = ["age", "annual_income", "family_size", "land_owned",
            "has_bank_account", "gender_enc", "caste_enc",
            "state_enc", "occupation_enc"]

def encode_profile(profile: CitizenProfile) -> dict:
    """Encode citizen profile using label encoders for ML model."""
    try:
        gender_enc     = le_gender.transform([profile.gender])[0] if le_gender else 0
    except:
        gender_enc     = 0
    try:
        caste_enc      = le_caste.transform([profile.caste])[0] if le_caste else 0
    except:
        caste_enc      = 0
    try:
        state_enc      = le_state.transform([profile.state])[0] if le_state else 0
    except:
        state_enc      = 0
    try:
        occupation_enc = le_occupation.transform([profile.occupation])[0] if le_occupation else 0
    except:
        occupation_enc = 0

    return {
        "age":              profile.age,
        "annual_income":    profile.annual_income,
        "family_size":      profile.family_size or 1,
        "land_owned":       profile.land_owned or 0.0,
        "has_bank_account": 1 if profile.has_bank_account else 0,
        "gender_enc":       gender_enc,
        "caste_enc":        caste_enc,
        "state_enc":        state_enc,
        "occupation_enc":   occupation_enc,
    }

def encode_to_array(profile: CitizenProfile) -> list:
    """Convert encoded profile to array in correct feature order."""
    enc = encode_profile(profile)
    return [enc[f] for f in FEATURES]

# ─── HELPER: Rule-based eligibility ──────────────────────────────────────────
def rule_based_eligibility(profile: CitizenProfile):
    results = []
    for scheme in SCHEMES:
        score = 0
        reasons = []
        total_checks = 4

        # Income check
        if scheme["min_income"] <= profile.annual_income <= scheme["max_income"]:
            score += 1
        else:
            reasons.append(f"Income ₹{profile.annual_income} outside range")

        # Age check
        if scheme["min_age"] <= profile.age <= scheme["max_age"]:
            score += 1
        else:
            reasons.append(f"Age {profile.age} outside range")

        # Caste check
        if profile.caste in scheme["caste"]:
            score += 1
        else:
            reasons.append(f"Caste category not eligible")

        # Occupation check
        if profile.occupation in scheme["occupation"]:
            score += 1
        else:
            reasons.append(f"Occupation not in eligible list")

        eligibility_score = round((score / total_checks) * 100)
        eligible = eligibility_score >= 75

        results.append({
            "scheme_id": scheme["id"],
            "scheme_name": scheme["name"],
            "category": scheme["category"],
            "benefits": scheme["benefits"],
            "eligibility_score": eligibility_score,
            "eligible": eligible,
            "reasons": reasons if not eligible else [],
            "state": scheme["state"]
        })

    return sorted(results, key=lambda x: x["eligibility_score"], reverse=True)

# ─── HELPER: Chatbot intent matcher ──────────────────────────────────────────
def match_intent(message: str):
    message_lower = message.lower()
    best_intent = None
    best_count = 0

    for intent, data in INTENTS.items():
        count = sum(1 for kw in data["keywords"] if kw in message_lower)
        if count > best_count:
            best_count = count
            best_intent = intent

    if best_intent and best_count > 0:
        return INTENTS[best_intent]["response"]
    return DEFAULT_RESPONSE

# ─── ROUTES ──────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "service": "SchemeConnect ML Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": [
            "/predict-eligibility",
            "/recommend-schemes",
            "/check-fraud",
            "/chat"
        ]
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

# ── 1. Predict Eligibility ────────────────────────────────────────────────────
@app.post("/predict-eligibility")
def predict_eligibility(profile: CitizenProfile):
    try:
        results = rule_based_eligibility(profile)
        eligible_schemes = [r for r in results if r["eligible"]]

        return {
            "success": True,
            "total_schemes_checked": len(SCHEMES),
            "eligible_count": len(eligible_schemes),
            "results": results,
            "message": f"Found {len(eligible_schemes)} schemes you are eligible for!"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

# ── 2. Recommend Schemes ──────────────────────────────────────────────────────
@app.post("/recommend-schemes")
def recommend_schemes(profile: CitizenProfile):
    try:
        results = rule_based_eligibility(profile)
        top_recommendations = [r for r in results if r["eligibility_score"] >= 50][:5]

        return {
            "success": True,
            "recommendations": top_recommendations,
            "total": len(top_recommendations),
            "message": f"Top {len(top_recommendations)} recommended schemes for you"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

# ── 3. Check Fraud ────────────────────────────────────────────────────────────
@app.post("/check-fraud")
def check_fraud(request: FraudCheckRequest):
    try:
        fraud_score = 0
        flags = []

        # Flag 1: Too many applications from same citizen
        if request.application_count > 5:
            fraud_score += 40
            flags.append("High number of applications from same citizen")

        # Flag 2: Unusually high application count in short time
        if request.application_count > 10:
            fraud_score += 30
            flags.append("Suspicious application volume detected")

        # Flag 3: Income vs state mismatch check (simplified)
        high_income_states = ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu"]
        if request.annual_income < 50000 and request.state in high_income_states:
            fraud_score += 15
            flags.append("Income level unusually low for reported state")

        # Flag 4: Age anomaly
        if request.age < 5 or request.age > 120:
            fraud_score += 50
            flags.append("Invalid age detected")

        is_fraud = fraud_score >= 40
        confidence = min(fraud_score, 100)

        return {
            "success": True,
            "citizen_id": request.citizen_id,
            "is_flagged": is_fraud,
            "fraud_score": confidence,
            "confidence": f"{confidence}%",
            "flags": flags,
            "status": "Flagged for review" if is_fraud else "Clean",
            "message": "Suspicious activity detected" if is_fraud else "No fraud indicators found"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

# ── 4. Chatbot ────────────────────────────────────────────────────────────────
@app.post("/chat")
def chat(request: ChatRequest):
    try:
        if not request.message.strip():
            return {
                "success": False,
                "response": "Please enter a message."
            }

        response = match_intent(request.message)

        return {
            "success": True,
            "message": request.message,
            "response": response,
            "citizen_id": request.citizen_id
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


# ── 3b. ML-Powered Eligibility (using trained Random Forest model) ─────────────
@app.post("/ml-eligibility")
def ml_predict_eligibility(profile: CitizenProfile):
    """Uses trained Random Forest model for eligibility prediction."""
    try:
        if eligibility_model is None:
            return {"success": False, "error": "Eligibility model not loaded"}

        # Encode profile for ML model
        features = encode_to_array(profile)
        proba = eligibility_model.predict_proba([features])[0]
        prediction = eligibility_model.predict([features])[0]

        # Get rule-based scores too
        rule_results = rule_based_eligibility(profile)
        top_scheme = rule_results[0] if rule_results else None

        # Combine ML confidence with rule-based top match
        ml_confidence = round(proba[1] * 100, 2) if len(proba) > 1 else round(proba[0] * 100, 2)
        rule_score = top_scheme["eligibility_score"] if top_scheme else 0

        # Final score is weighted average
        final_score = round((ml_confidence * 0.6) + (rule_score * 0.4), 2)
        is_eligible = bool(prediction) or final_score >= 75

        return {
            "success": True,
            "ml_confidence": ml_confidence,
            "rule_score": rule_score,
            "final_eligibility_score": final_score,
            "ml_prediction": bool(prediction),
            "is_eligible": is_eligible,
            "top_matching_scheme": top_scheme["scheme_name"] if top_scheme else None,
            "total_schemes_checked": len(SCHEMES)
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

# ── 3c. ML-Powered Fraud Detection (using Isolation Forest) ───────────────────
@app.post("/ml-fraud")
def ml_check_fraud(request: FraudCheckRequest):
    """Uses trained Isolation Forest model for anomaly detection."""
    try:
        if fraud_model is None:
            return {"success": False, "error": "Fraud model not loaded"}

        # Prepare features for fraud model
        fraud_features = [[
            request.age,
            request.annual_income,
            1,  # family_size default
            0   # land_owned default
        ]]

        # Get anomaly score (-1 = anomaly, 1 = normal)
        anomaly_pred = fraud_model.predict(fraud_features)[0]
        anomaly_score = fraud_model.score_samples(fraud_features)[0]

        # Convert to 0-100 fraud score (lower anomaly_score = more anomalous)
        # Isolation Forest score is negative for anomalies
        ml_fraud_score = max(0, min(100, int(-anomaly_score * 50 + 50)))

        # Add rule-based flags
        rule_score = 0
        flags = []

        if request.application_count > 5:
            rule_score += 40
            flags.append("High number of applications")
        if request.application_count > 10:
            rule_score += 30
            flags.append("Suspicious application volume")

        # Combined fraud assessment
        combined_score = max(ml_fraud_score, rule_score)
        is_flagged = combined_score >= 40

        return {
            "success": True,
            "citizen_id": request.citizen_id,
            "ml_anomaly_score": ml_fraud_score,
            "rule_based_score": rule_score,
            "combined_fraud_score": combined_score,
            "is_flagged": is_flagged,
            "flags": flags,
            "status": "Flagged for review" if is_flagged else "Clean",
            "ml_model_used": "Isolation Forest",
            "confidence": f"{min(combined_score, 100)}%"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

# ── 4. Citizen Score ─────────────────────────────────────────────────────────
@app.post("/score-citizen")
def score_citizen(profile: CitizenProfile):
    """Returns a comprehensive citizen score based on multiple factors."""
    try:
        features = encode_to_array(profile)

        # ML eligibility probability
        ml_score = 0
        if eligibility_model:
            proba = eligibility_model.predict_proba([features])[0]
            ml_score = round(proba[1] * 100, 2) if len(proba) > 1 else round(proba[0] * 100, 2)

        # Calculate component scores
        income_score = max(0, 100 - (profile.annual_income / 10000))  # Lower income = higher score
        age_score = 100 if 25 <= profile.age <= 60 else max(0, 100 - abs(profile.age - 42) * 2)
        bank_score = 20 if profile.has_bank_account else 0

        # Priority categories
        priority_bonus = 0
        if profile.caste in ["SC", "ST"]:
            priority_bonus += 20
        if profile.occupation in ["Farmer", "Daily Wage Worker", "Unemployed"]:
            priority_bonus += 15

        composite_score = round((ml_score * 0.5) + (income_score * 0.2) + (age_score * 0.15) + bank_score + priority_bonus, 2)

        return {
            "success": True,
            "citizen_id": profile.state[:3].upper() + str(profile.age),  # generated ID
            "composite_score": min(composite_score, 100),
            "ml_eligibility_score": ml_score,
            "income_score": round(income_score, 2),
            "age_score": round(age_score, 2),
            "priority_bonus": priority_bonus,
            "score_category": "High Priority" if composite_score >= 75 else "Medium Priority" if composite_score >= 50 else "Standard",
            "recommendations": "Immediately eligible for multiple schemes" if composite_score >= 75 else "May qualify for targeted schemes" if composite_score >= 50 else "Limited eligibility"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

# ─── RUN ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)