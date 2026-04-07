from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import joblib
import os


app = FastAPI(title="SchemeConnect ML Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5000",
        "http://127.0.0.1:3000",
        "http://192.168.9.73:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")


def load_model(filename):
    path = os.path.join(MODEL_DIR, filename)
    if os.path.exists(path):
        return joblib.load(path)
    return None


eligibility_model = load_model("eligibility_model.pkl")
fraud_model = load_model("fraud_model.pkl")
le_gender = load_model("le_gender.pkl")
le_caste = load_model("le_caste.pkl")
le_state = load_model("le_state.pkl")
le_occupation = load_model("le_occupation.pkl")

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
        "state": "National",
        "benefits": "Rs. 6,000 per year direct income support to farmers",
        "documents_required": ["Aadhaar", "Land record", "Bank passbook"],
        "next_steps": ["Confirm land ownership", "Validate bank linkage", "Submit through PM-Kisan portal"],
        "requires_bank_account": True,
        "prefers_landowners": True,
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
        "state": "National",
        "benefits": "Financial assistance for construction of pucca house",
        "documents_required": ["Aadhaar", "Income certificate", "Residence proof"],
        "next_steps": ["Verify housing category", "Upload residence documents", "Track local body verification"],
        "requires_bank_account": True,
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
        "state": "National",
        "benefits": "Health coverage up to Rs. 5 lakh per family per year",
        "documents_required": ["Aadhaar", "Family ID", "Ration card"],
        "next_steps": ["Check empanelled hospitals", "Verify family details", "Carry scheme ID for treatment"],
        "requires_bank_account": False,
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
        "state": "National",
        "benefits": "Scholarships for students from minority and SC/ST communities",
        "documents_required": ["Student ID", "Income certificate", "Caste certificate"],
        "next_steps": ["Collect academic records", "Check scholarship window", "Submit institution details"],
        "requires_bank_account": True,
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
        "state": "National",
        "benefits": "Loans up to Rs. 10 lakh for small businesses without collateral",
        "documents_required": ["Aadhaar", "Business proof", "Bank statement"],
        "next_steps": ["Prepare business summary", "Choose a lending partner", "Submit enterprise documents"],
        "requires_bank_account": True,
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
        "state": "National",
        "benefits": "Savings scheme for girl child with high interest rate",
        "documents_required": ["Birth certificate", "Guardian ID", "Bank or post office account"],
        "next_steps": ["Open account", "Provide guardian details", "Start yearly contribution"],
        "requires_bank_account": True,
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
        "state": "National",
        "benefits": "Guaranteed 100 days of wage employment per year",
        "documents_required": ["Aadhaar", "Residence proof", "Job card request"],
        "next_steps": ["Request job card", "Visit gram panchayat if needed", "Track work allocation"],
        "requires_bank_account": True,
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
        "state": "National",
        "benefits": "Guaranteed minimum pension of Rs. 1,000 to Rs. 5,000 per month",
        "documents_required": ["Aadhaar", "Savings account details", "Mobile number"],
        "next_steps": ["Choose pension amount", "Enable auto debit", "Confirm contributions"],
        "requires_bank_account": True,
    },
    {
        "id": "9",
        "name": "Karnataka Gruha Lakshmi",
        "category": "Social Security",
        "min_income": 0,
        "max_income": 500000,
        "min_age": 18,
        "max_age": 100,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Homemaker"],
        "state": "Karnataka",
        "benefits": "Rs. 2,000 monthly financial assistance to women heads of family",
        "documents_required": ["Aadhaar", "State residence proof", "Family ID"],
        "next_steps": ["Confirm family head status", "Verify Aadhaar seeding", "Apply on state scheme portal"],
        "requires_bank_account": True,
    },
    {
        "id": "10",
        "name": "UP Mukhyamantri Samaj Sewa",
        "category": "Social Security",
        "min_income": 0,
        "max_income": 200000,
        "min_age": 18,
        "max_age": 60,
        "caste": ["SC", "ST"],
        "occupation": ["Daily Wage Worker", "Unemployed", "Self Employed"],
        "state": "Uttar Pradesh",
        "benefits": "Monthly pension of Rs. 500 for SC and ST citizens",
        "documents_required": ["Aadhaar", "Caste certificate", "Income certificate"],
        "next_steps": ["Validate caste certificate", "Confirm Uttar Pradesh residence", "Submit social welfare application"],
        "requires_bank_account": True,
    },
    {
        "id": "11",
        "name": "West Bengal Lakshmi Bhandar",
        "category": "Social Security",
        "min_income": 0,
        "max_income": 500000,
        "min_age": 25,
        "max_age": 60,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Homemaker", "Self Employed", "Daily Wage Worker"],
        "state": "West Bengal",
        "benefits": "Rs. 500 to Rs. 1,000 per month to eligible women beneficiaries",
        "documents_required": ["Aadhaar", "Residence proof", "Income certificate"],
        "next_steps": ["Confirm family income details", "Validate gender and age", "Apply through state welfare portal"],
        "requires_bank_account": True,
    },
    {
        "id": "12",
        "name": "Gujarat Mukhyamantri Amrutam Yojana",
        "category": "Health",
        "min_income": 0,
        "max_income": 600000,
        "min_age": 0,
        "max_age": 100,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Daily Wage Worker", "Self Employed", "Farmer", "Unemployed"],
        "state": "Gujarat",
        "benefits": "Free health coverage up to Rs. 5 lakh per family per year",
        "documents_required": ["Aadhaar", "Income proof", "Family ID"],
        "next_steps": ["Verify family card", "Locate empanelled hospital", "Generate scheme approval card"],
        "requires_bank_account": False,
    },
    {
        "id": "13",
        "name": "Gruha Lakshmi Scheme",
        "category": "Women Welfare",
        "min_income": 0,
        "max_income": 200000,
        "min_age": 18,
        "max_age": 60,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Farmer", "Daily Wage Worker", "Self Employed", "Unemployed", "Homemaker"],
        "state": "Karnataka",
        "benefits": "Rs. 2,000 per month to the woman head of family",
        "documents_required": ["Aadhaar", "Ration card", "Bank account details"],
        "next_steps": ["Confirm woman head of household status", "Verify family card details", "Submit through Karnataka Seva Sindhu"],
        "requires_bank_account": True,
    },
    {
        "id": "14",
        "name": "Yuva Nidhi Scheme",
        "category": "Employment",
        "min_income": 0,
        "max_income": 300000,
        "min_age": 18,
        "max_age": 35,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Unemployed", "Student"],
        "state": "Karnataka",
        "benefits": "Rs. 3,000 per month for degree holders and Rs. 1,500 for diploma holders",
        "documents_required": ["Degree or diploma certificate", "Aadhaar", "Bank account details"],
        "next_steps": ["Verify graduation status", "Confirm unemployment declaration", "Apply through state employment portal"],
        "requires_bank_account": True,
    },
    {
        "id": "15",
        "name": "Anna Bhagya Scheme",
        "category": "Food Security",
        "min_income": 0,
        "max_income": 150000,
        "min_age": 18,
        "max_age": 80,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Farmer", "Daily Wage Worker", "Unemployed", "Homemaker"],
        "state": "Karnataka",
        "benefits": "10 kg free rice per month for eligible families",
        "documents_required": ["Ration card", "Aadhaar", "Residence proof"],
        "next_steps": ["Verify ration card category", "Confirm Karnataka residence", "Track food distribution status"],
        "requires_bank_account": False,
    },
    {
        "id": "16",
        "name": "Shakti Scheme",
        "category": "Transport",
        "min_income": 0,
        "max_income": 500000,
        "min_age": 18,
        "max_age": 80,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Farmer", "Daily Wage Worker", "Self Employed", "Salaried", "Unemployed", "Student", "Homemaker"],
        "state": "Karnataka",
        "benefits": "Free bus travel for women in Karnataka state-run buses",
        "documents_required": ["Aadhaar", "Karnataka ID", "Seva Sindhu registration"],
        "next_steps": ["Register on Seva Sindhu", "Verify identity details", "Use approved travel pass"],
        "requires_bank_account": False,
    },
    {
        "id": "17",
        "name": "Arogya Karnataka",
        "category": "Health",
        "min_income": 0,
        "max_income": 200000,
        "min_age": 0,
        "max_age": 100,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Farmer", "Daily Wage Worker", "Unemployed", "Homemaker"],
        "state": "Karnataka",
        "benefits": "Free healthcare support up to Rs. 5 lakh for eligible families",
        "documents_required": ["Aadhaar", "BPL card", "Family ID"],
        "next_steps": ["Check empanelled hospitals", "Verify BPL eligibility", "Generate state health card"],
        "requires_bank_account": False,
    },
    {
        "id": "18",
        "name": "Raitha Siri Scheme",
        "category": "Agriculture",
        "min_income": 0,
        "max_income": 200000,
        "min_age": 18,
        "max_age": 70,
        "caste": ["General", "OBC", "SC", "ST"],
        "occupation": ["Farmer"],
        "state": "Karnataka",
        "benefits": "Rs. 5,000 financial assistance to drought-affected farmers",
        "documents_required": ["Aadhaar", "Land record", "Bank passbook"],
        "next_steps": ["Confirm drought-affected area status", "Validate land ownership", "Submit through agriculture department"],
        "requires_bank_account": True,
        "prefers_landowners": True,
    },
]

INTENTS = {
    "eligibility": {
        "keywords": ["eligible", "qualify", "eligibility", "check", "criteria", "requirements"],
        "response": "To check eligibility, provide age, annual income, caste category, state, occupation, family size and bank account status."
    },
    "apply": {
        "keywords": ["apply", "application", "register", "enroll", "sign up"],
        "response": "First confirm eligibility, then review the strongest match, prepare documents, submit the application, and track verification status."
    },
    "documents": {
        "keywords": ["documents", "papers", "required", "aadhaar", "income certificate", "caste certificate"],
        "response": "Common documents include Aadhaar, income certificate, caste certificate where applicable, residence proof, and bank account details."
    },
    "status": {
        "keywords": ["status", "track", "progress", "pending", "approved"],
        "response": "Track your application from submission through verification, review, approval, or rejection in the application tracker."
    },
}

DEFAULT_RESPONSE = "I can help with eligibility checks, documents, application guidance, status tracking, and scheme discovery."


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


FEATURES = [
    "age",
    "annual_income",
    "family_size",
    "land_owned",
    "has_bank_account",
    "gender_enc",
    "caste_enc",
    "state_enc",
    "occupation_enc",
]

MIN_ELIGIBILITY_SCORE = 90


def normalize_gender(value: str) -> str:
    lowered = value.strip().lower()
    if lowered in {"male", "m"}:
        return "male"
    if lowered in {"female", "f"}:
        return "female"
    return "other"


def normalize_caste(value: str) -> str:
    mapping = {
        "obc (other backward classes)": "OBC",
        "sc (scheduled caste)": "SC",
        "st (scheduled tribe)": "ST",
        "ews (economically weaker section)": "General",
        "general": "General",
        "obc": "OBC",
        "sc": "SC",
        "st": "ST",
    }
    return mapping.get(value.strip().lower(), value.strip())


def normalize_occupation(value: str) -> str:
    mapping = {
        "self-employed": "Self Employed",
        "self employed": "Self Employed",
        "salaried employee": "Salaried",
        "government employee": "Salaried",
        "business owner": "Small Business Owner",
        "daily wage worker": "Daily Wage Worker",
        "homemaker": "Homemaker",
        "student": "Student",
        "farmer": "Farmer",
        "retired": "Retired",
        "unemployed": "Unemployed",
    }
    return mapping.get(value.strip().lower(), value.strip())


def normalized_profile(profile: CitizenProfile) -> CitizenProfile:
    return CitizenProfile(
        age=profile.age,
        gender=normalize_gender(profile.gender),
        annual_income=profile.annual_income,
        caste=normalize_caste(profile.caste),
        state=profile.state.strip(),
        occupation=normalize_occupation(profile.occupation),
        family_size=profile.family_size or 1,
        land_owned=profile.land_owned or 0.0,
        has_bank_account=bool(profile.has_bank_account),
    )


def encode_value(encoder, raw_value, default=0):
    try:
        return encoder.transform([raw_value])[0] if encoder else default
    except Exception:
        return default


def encode_profile(profile: CitizenProfile) -> dict:
    clean = normalized_profile(profile)
    return {
        "age": clean.age,
        "annual_income": clean.annual_income,
        "family_size": clean.family_size,
        "land_owned": clean.land_owned,
        "has_bank_account": 1 if clean.has_bank_account else 0,
        "gender_enc": encode_value(le_gender, clean.gender),
        "caste_enc": encode_value(le_caste, clean.caste),
        "state_enc": encode_value(le_state, clean.state),
        "occupation_enc": encode_value(le_occupation, clean.occupation),
    }


def encode_to_array(profile: CitizenProfile) -> list:
    encoded = encode_profile(profile)
    return [encoded[field] for field in FEATURES]


def is_scheme_available_in_state(profile_state: str, scheme_state: str) -> bool:
    return scheme_state == "National" or profile_state == scheme_state


def get_ml_probability(profile: CitizenProfile) -> Optional[float]:
    if eligibility_model is None:
        return None

    try:
        probabilities = eligibility_model.predict_proba([encode_to_array(profile)])[0]
        if len(probabilities) > 1:
            return float(probabilities[1]) * 100
        return float(probabilities[0]) * 100
    except Exception:
        return None


def confidence_label(score: float) -> str:
    if score >= 85:
        return "High"
    if score >= 65:
        return "Moderate"
    if score >= 40:
        return "Low"
    return "Very Low"


def build_confidence_factors(profile: CitizenProfile, scheme: dict, ml_probability: Optional[float]) -> dict:
    factors = []
    gender_keywords = ["women", "woman", "girl", "female", "lakshmi", "shakti", "mahila"]

    state_match = is_scheme_available_in_state(profile.state, scheme["state"])
    factors.append(
        {
            "factor": "State / Region",
            "impact": "positive" if state_match else "blocker",
            "detail": (
                f"Scheme available in {profile.state}"
                if state_match
                else f"Only available in {scheme['state']}, not {profile.state}"
            ),
            "weight": 15,
        }
    )

    income_match = scheme["min_income"] <= profile.annual_income <= scheme["max_income"]
    factors.append(
        {
            "factor": "Annual Income",
            "impact": "positive" if income_match else "blocker",
            "detail": (
                f"Rs. {int(profile.annual_income):,} is within the Rs. {scheme['min_income']:,} to Rs. {scheme['max_income']:,} band"
                if income_match
                else f"Rs. {int(profile.annual_income):,} is outside the required Rs. {scheme['min_income']:,} to Rs. {scheme['max_income']:,} band"
            ),
            "weight": 25,
        }
    )

    age_match = scheme["min_age"] <= profile.age <= scheme["max_age"]
    factors.append(
        {
            "factor": "Age",
            "impact": "positive" if age_match else "concern",
            "detail": (
                f"Age {profile.age} is within the {scheme['min_age']} to {scheme['max_age']} range"
                if age_match
                else f"Age {profile.age} is outside the {scheme['min_age']} to {scheme['max_age']} requirement"
            ),
            "weight": 12,
        }
    )

    occupation_match = profile.occupation in scheme["occupation"]
    factors.append(
        {
            "factor": "Occupation",
            "impact": "positive" if occupation_match else "concern",
            "detail": (
                f"{profile.occupation} is a target beneficiary group"
                if occupation_match
                else f"{profile.occupation} is not in the primary target group ({', '.join(scheme['occupation'][:3])}...)"
            ),
            "weight": 18,
        }
    )

    caste_match = profile.caste in scheme["caste"]
    factors.append(
        {
            "factor": "Category (Caste)",
            "impact": "positive" if caste_match else "concern",
            "detail": (
                f"{profile.caste} category is covered by this scheme"
                if caste_match
                else f"{profile.caste} is not in the preferred group for this scheme"
            ),
            "weight": 10,
        }
    )

    gender_restricted = any(
        keyword in (scheme["name"].lower() + scheme.get("benefits", "").lower())
        for keyword in gender_keywords
    )
    if gender_restricted:
        gender_ok = profile.gender.lower() in {"female", "f", "woman"}
        factors.append(
            {
                "factor": "Gender",
                "impact": "positive" if gender_ok else "concern",
                "detail": (
                    "Female applicant, which meets the gender eligibility for this scheme"
                    if gender_ok
                    else "This scheme targets women beneficiaries, so gender eligibility may apply"
                ),
                "weight": 15,
            }
        )
    else:
        factors.append(
            {
                "factor": "Gender",
                "impact": "neutral",
                "detail": "No gender restriction for this scheme, so it is open to all applicants",
                "weight": 0,
            }
        )

    if scheme.get("requires_bank_account"):
        factors.append(
            {
                "factor": "Bank Account",
                "impact": "positive" if profile.has_bank_account else "concern",
                "detail": (
                    "Linked bank account ready for DBT transfer"
                    if profile.has_bank_account
                    else "Bank account required for Direct Benefit Transfer"
                ),
                "weight": 8,
            }
        )

    if scheme.get("prefers_landowners"):
        has_land = bool(profile.land_owned and profile.land_owned > 0)
        factors.append(
            {
                "factor": "Land Ownership",
                "impact": "positive" if has_land else "concern",
                "detail": (
                    f"{profile.land_owned} acres registered, which strengthens this agriculture match"
                    if has_land
                    else "Land ownership proof may be required"
                ),
                "weight": 7,
            }
        )

    if profile.family_size >= 4 and scheme["category"] in {"Housing", "Health", "Social Security"}:
        factors.append(
            {
                "factor": "Family Size",
                "impact": "positive",
                "detail": f"Family of {profile.family_size} increases priority for household-oriented schemes",
                "weight": 5,
            }
        )

    if ml_probability is not None:
        ml_label = "positive" if ml_probability >= 65 else "neutral" if ml_probability >= 40 else "concern"
        factors.append(
            {
                "factor": "ML Model Signal",
                "impact": ml_label,
                "detail": f"Random Forest confidence: {round(ml_probability, 1)}% (trained on historical eligibility data)",
                "weight": None,
            }
        )

    return {
        "factors": factors,
        "summary": {
            "positives": sum(1 for factor in factors if factor["impact"] == "positive"),
            "concerns": sum(1 for factor in factors if factor["impact"] == "concern"),
            "blockers": sum(1 for factor in factors if factor["impact"] == "blocker"),
        },
    }


def score_scheme(profile: CitizenProfile, scheme: dict, ml_probability: Optional[float]) -> dict:
    score = 0.0
    positives = []
    concerns = []
    blockers = []
    gender_keywords = ["women", "woman", "girl", "female", "lakshmi", "shakti", "mahila"]

    state_match = is_scheme_available_in_state(profile.state, scheme["state"])
    if state_match:
        score += 15
        positives.append("Scheme is available in your state.")
    else:
        blockers.append(f"This scheme is only available in {scheme['state']}.")

    income_match = scheme["min_income"] <= profile.annual_income <= scheme["max_income"]
    if income_match:
        score += 25
        positives.append("Income is within the preferred range.")
    else:
        blockers.append(
            f"Income is outside the target band of Rs. {scheme['min_income']:,} to Rs. {scheme['max_income']:,}."
        )

    age_match = scheme["min_age"] <= profile.age <= scheme["max_age"]
    if age_match:
        score += 12
        positives.append("Age fits the scheme criteria.")
    else:
        concerns.append(f"Age should be between {scheme['min_age']} and {scheme['max_age']}.")

    occupation_match = profile.occupation in scheme["occupation"]
    if occupation_match:
        score += 18
        positives.append("Occupation matches the target beneficiary profile.")
    else:
        concerns.append("Occupation does not match the core target group.")

    caste_match = profile.caste in scheme["caste"]
    if caste_match:
        score += 10
        positives.append("Category alignment is valid.")
    else:
        concerns.append("Caste category is outside the preferred beneficiary group.")

    is_gender_restricted = any(
        keyword in (scheme["name"].lower() + scheme.get("benefits", "").lower())
        for keyword in gender_keywords
    )
    if is_gender_restricted:
        if profile.gender.lower() in {"female", "f", "woman"}:
            score += 15
            positives.append("Gender eligibility confirmed for this women-targeted scheme.")
        else:
            blockers.append("This scheme is exclusively for women beneficiaries.")
            score = min(score, 60)

    if scheme.get("requires_bank_account"):
        if profile.has_bank_account:
            score += 8
            positives.append("Bank account is ready for direct benefit transfer.")
        else:
            concerns.append("A linked bank account is usually needed for this scheme.")

    if scheme.get("prefers_landowners"):
        if profile.land_owned and profile.land_owned > 0:
            score += 7
            positives.append("Land ownership strengthens this agriculture match.")
        else:
            concerns.append("Land ownership proof may be required for this agriculture benefit.")

    if profile.family_size >= 4 and scheme["category"] in {"Housing", "Health", "Social Security"}:
        score += 5
        positives.append("Family size increases relevance for this household-oriented scheme.")

    weighted_score = (score * 0.7) + ((ml_probability or 0) * 0.3)
    eligibility_score = round(min(weighted_score, 99) if blockers else min(weighted_score, 100))
    gender_blocked = is_gender_restricted and profile.gender.lower() not in {"female", "f", "woman"}
    eligible = (
        state_match
        and income_match
        and age_match
        and occupation_match
        and not gender_blocked
        and eligibility_score >= MIN_ELIGIBILITY_SCORE
    )

    reasons = positives[:2]
    if blockers:
        reasons.extend(blockers[:2])
    elif concerns:
        reasons.extend(concerns[:2])
    else:
        reasons.append("You satisfy the strongest visible criteria for this scheme.")

    return {
        "scheme_id": scheme["id"],
        "scheme_name": scheme["name"],
        "category": scheme["category"],
        "benefits": scheme["benefits"],
        "eligibility_score": eligibility_score,
        "eligible": eligible,
        "reasons": reasons,
        "state": scheme["state"],
        "documents_required": scheme.get("documents_required", []),
        "next_steps": scheme.get("next_steps", []),
        "match_type": "eligible_now" if eligible else "review_needed",
        "ml_probability": round(ml_probability, 2) if ml_probability is not None else None,
        "confidence_label": confidence_label(eligibility_score),
        "confidence_factors": build_confidence_factors(profile, scheme, ml_probability),
    }


def rule_based_eligibility(profile: CitizenProfile):
    clean = normalized_profile(profile)
    ml_probability = get_ml_probability(clean)
    results = []

    for scheme in SCHEMES:
        scored = score_scheme(clean, scheme, ml_probability)
        scored["state_match"] = is_scheme_available_in_state(clean.state, scheme["state"])
        results.append(scored)

    ordered_results = sorted(
        results,
        key=lambda item: (item["state_match"], item["eligibility_score"]),
        reverse=True,
    )

    for item in ordered_results:
        item.pop("state_match", None)

    return ordered_results


def match_intent(message: str):
    lowered = message.lower()
    best_intent = None
    best_count = 0

    for intent, data in INTENTS.items():
        count = sum(1 for keyword in data["keywords"] if keyword in lowered)
        if count > best_count:
            best_intent = intent
            best_count = count

    if best_intent and best_count > 0:
        return INTENTS[best_intent]["response"]
    return DEFAULT_RESPONSE


@app.get("/")
def root():
    return {
        "service": "SchemeConnect ML Service",
        "version": "2.0.0",
        "status": "running",
        "endpoints": [
            "/predict-eligibility",
            "/recommend-schemes",
            "/ml-eligibility",
            "/check-fraud",
            "/ml-fraud",
            "/score-citizen",
            "/chat",
        ],
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "models_loaded": {
            "eligibility_model": eligibility_model is not None,
            "fraud_model": fraud_model is not None,
        },
        "schemes_available": len(SCHEMES),
    }


@app.post("/predict-eligibility")
def predict_eligibility(profile: CitizenProfile):
    try:
        results = rule_based_eligibility(profile)
        eligible_schemes = [
            result
            for result in results
            if result["eligible"] and result["eligibility_score"] >= MIN_ELIGIBILITY_SCORE
        ]
        return {
            "success": True,
            "total_schemes_checked": len(SCHEMES),
            "eligible_count": len(eligible_schemes),
            "results": eligible_schemes,
            "message": f"Found {len(eligible_schemes)} schemes you can likely apply for right now.",
        }
    except Exception as exc:
        return {"success": False, "error": str(exc)}


@app.post("/recommend-schemes")
def recommend_schemes(profile: CitizenProfile):
    try:
        results = rule_based_eligibility(profile)
        top_recommendations = [
            result
            for result in results
            if result["eligible"] and result["eligibility_score"] >= MIN_ELIGIBILITY_SCORE
        ][:5]
        return {
            "success": True,
            "recommendations": top_recommendations,
            "total": len(top_recommendations),
            "message": f"Top {len(top_recommendations)} recommended schemes prepared.",
        }
    except Exception as exc:
        return {"success": False, "error": str(exc)}


@app.post("/check-fraud")
def check_fraud(request: FraudCheckRequest):
    try:
        fraud_score = 0
        flags = []

        if request.application_count > 5:
            fraud_score += 40
            flags.append("High number of applications from the same citizen profile.")
        if request.application_count > 10:
            fraud_score += 30
            flags.append("Unusually high application volume detected.")
        if request.annual_income < 50000 and request.state in ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu"]:
            fraud_score += 15
            flags.append("Income appears unusually low for the reported state.")
        if request.age < 5 or request.age > 120:
            fraud_score += 50
            flags.append("Invalid age detected.")

        confidence = min(fraud_score, 100)
        return {
            "success": True,
            "citizen_id": request.citizen_id,
            "is_flagged": confidence >= 40,
            "fraud_score": confidence,
            "confidence": f"{confidence}%",
            "flags": flags,
            "status": "Flagged for review" if confidence >= 40 else "Clean",
            "message": "Suspicious activity detected." if confidence >= 40 else "No major fraud indicators found.",
        }
    except Exception as exc:
        return {"success": False, "error": str(exc)}


@app.post("/chat")
def chat(request: ChatRequest):
    try:
        if not request.message.strip():
            return {"success": False, "response": "Please enter a message."}
        return {
            "success": True,
            "message": request.message,
            "response": match_intent(request.message),
            "citizen_id": request.citizen_id,
        }
    except Exception as exc:
        return {"success": False, "error": str(exc)}


@app.post("/ml-eligibility")
def ml_predict_eligibility(profile: CitizenProfile):
    try:
        clean = normalized_profile(profile)
        ml_confidence = get_ml_probability(clean)
        rule_results = rule_based_eligibility(clean)
        top_scheme = rule_results[0] if rule_results else None
        rule_score = top_scheme["eligibility_score"] if top_scheme else 0
        final_score = round(((ml_confidence or 0) * 0.6) + (rule_score * 0.4), 2)
        return {
            "success": True,
            "ml_confidence": round(ml_confidence, 2) if ml_confidence is not None else None,
            "rule_score": rule_score,
            "final_eligibility_score": final_score,
            "is_eligible": final_score >= MIN_ELIGIBILITY_SCORE,
            "top_matching_scheme": top_scheme["scheme_name"] if top_scheme else None,
            "top_matching_reason": top_scheme["reasons"][0] if top_scheme and top_scheme["reasons"] else None,
            "total_schemes_checked": len(SCHEMES),
        }
    except Exception as exc:
        return {"success": False, "error": str(exc)}


@app.post("/ml-fraud")
def ml_check_fraud(request: FraudCheckRequest):
    try:
        if fraud_model is None:
            return {"success": False, "error": "Fraud model not loaded"}

        fraud_features = [[request.age, request.annual_income, 1, 0]]
        anomaly_score = fraud_model.score_samples(fraud_features)[0]
        ml_fraud_score = max(0, min(100, int(-anomaly_score * 50 + 50)))

        rule_score = 0
        flags = []
        if request.application_count > 5:
            rule_score += 40
            flags.append("High number of applications")
        if request.application_count > 10:
            rule_score += 30
            flags.append("Suspicious application volume")

        combined_score = max(ml_fraud_score, rule_score)
        return {
            "success": True,
            "citizen_id": request.citizen_id,
            "ml_anomaly_score": ml_fraud_score,
            "rule_based_score": rule_score,
            "combined_fraud_score": combined_score,
            "is_flagged": combined_score >= 40,
            "flags": flags,
            "status": "Flagged for review" if combined_score >= 40 else "Clean",
            "ml_model_used": "Isolation Forest",
            "confidence": f"{min(combined_score, 100)}%",
        }
    except Exception as exc:
        return {"success": False, "error": str(exc)}


@app.post("/score-citizen")
def score_citizen(profile: CitizenProfile):
    try:
        clean = normalized_profile(profile)
        ml_score = get_ml_probability(clean) or 0
        income_score = max(0, 100 - (clean.annual_income / 10000))
        age_score = 100 if 25 <= clean.age <= 60 else max(0, 100 - abs(clean.age - 42) * 2)
        bank_score = 20 if clean.has_bank_account else 0

        priority_bonus = 0
        if clean.caste in ["SC", "ST"]:
            priority_bonus += 20
        if clean.occupation in ["Farmer", "Daily Wage Worker", "Unemployed"]:
            priority_bonus += 15

        composite_score = round(
            (ml_score * 0.5) + (income_score * 0.2) + (age_score * 0.15) + bank_score + priority_bonus,
            2,
        )
        return {
            "success": True,
            "citizen_id": clean.state[:3].upper() + str(clean.age),
            "composite_score": min(composite_score, 100),
            "ml_eligibility_score": round(ml_score, 2),
            "income_score": round(income_score, 2),
            "age_score": round(age_score, 2),
            "priority_bonus": priority_bonus,
            "score_category": "High Priority" if composite_score >= 75 else "Medium Priority" if composite_score >= 50 else "Standard",
            "recommendations": (
                "Strong candidate for multiple schemes"
                if composite_score >= 75
                else "Likely to qualify for targeted schemes"
                if composite_score >= 50
                else "Needs more targeted or state-specific support"
            ),
        }
    except Exception as exc:
        return {"success": False, "error": str(exc)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
