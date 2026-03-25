import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# ─── PATHS ────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(__file__)
MODEL_DIR  = os.path.join(BASE_DIR, "..", "models")
DATA_PATH  = os.path.join(BASE_DIR, "citizen_data.csv")
os.makedirs(MODEL_DIR, exist_ok=True)

# ─── STEP 1: GENERATE SYNTHETIC DATA ─────────────────────────────────────────
print("=" * 50)
print("STEP 1: Generating synthetic citizen data...")
print("=" * 50)

np.random.seed(42)
N = 2000

castes      = ["General", "OBC", "SC", "ST"]
occupations = ["Farmer", "Daily Wage Worker", "Self Employed",
               "Salaried", "Student", "Unemployed", "Small Business Owner"]
states      = ["Maharashtra", "Karnataka", "Uttar Pradesh", "Bihar",
               "Rajasthan", "Tamil Nadu", "Gujarat", "West Bengal",
               "Madhya Pradesh", "Andhra Pradesh"]
genders     = ["Male", "Female", "Other"]

data = {
    "age":            np.random.randint(18, 75, N),
    "gender":         np.random.choice(genders, N),
    "annual_income":  np.random.randint(50000, 800000, N),
    "caste":          np.random.choice(castes, N),
    "state":          np.random.choice(states, N),
    "occupation":     np.random.choice(occupations, N),
    "family_size":    np.random.randint(1, 10, N),
    "land_owned":     np.random.uniform(0, 10, N).round(2),
    "has_bank_account": np.random.choice([0, 1], N, p=[0.2, 0.8]),
}

df = pd.DataFrame(data)

# ─── STEP 2: GENERATE ELIGIBILITY LABELS ─────────────────────────────────────
print("\nSTEP 2: Generating eligibility labels...")

def is_eligible(row):
    score = 0
    # Low income -> more eligible
    if row["annual_income"] < 300000:
        score += 2
    elif row["annual_income"] < 500000:
        score += 1
    # SC/ST/OBC -> more eligible
    if row["caste"] in ["SC", "ST"]:
        score += 2
    elif row["caste"] == "OBC":
        score += 1
    # Farmer / daily wage -> eligible for more schemes
    if row["occupation"] in ["Farmer", "Daily Wage Worker", "Unemployed"]:
        score += 2
    elif row["occupation"] in ["Self Employed", "Small Business Owner"]:
        score += 1
    # Has bank account -> required for most schemes
    if row["has_bank_account"] == 1:
        score += 1
    # Age range 25–60 -> highest eligibility
    if 25 <= row["age"] <= 60:
        score += 1
    return 1 if score >= 4 else 0

df["eligible"] = df.apply(is_eligible, axis=1)
df.to_csv(DATA_PATH, index=False)
print(f"  [OK] Generated {N} citizen records -> saved to {DATA_PATH}")
print(f"  Eligible: {df['eligible'].sum()} | Not eligible: {(df['eligible']==0).sum()}")

# ─── STEP 3: ENCODE FEATURES ──────────────────────────────────────────────────
print("\nSTEP 3: Encoding categorical features...")

le_gender     = LabelEncoder()
le_caste      = LabelEncoder()
le_state      = LabelEncoder()
le_occupation = LabelEncoder()

df["gender_enc"]     = le_gender.fit_transform(df["gender"])
df["caste_enc"]      = le_caste.fit_transform(df["caste"])
df["state_enc"]      = le_state.fit_transform(df["state"])
df["occupation_enc"] = le_occupation.fit_transform(df["occupation"])

# Save encoders
joblib.dump(le_gender,     os.path.join(MODEL_DIR, "le_gender.pkl"))
joblib.dump(le_caste,      os.path.join(MODEL_DIR, "le_caste.pkl"))
joblib.dump(le_state,      os.path.join(MODEL_DIR, "le_state.pkl"))
joblib.dump(le_occupation, os.path.join(MODEL_DIR, "le_occupation.pkl"))
print("  [OK] Label encoders saved")

FEATURES = [
    "age", "annual_income", "family_size", "land_owned",
    "has_bank_account", "gender_enc", "caste_enc",
    "state_enc", "occupation_enc"
]

X = df[FEATURES]
y = df["eligible"]

# ─── STEP 4: TRAIN ELIGIBILITY CLASSIFIER ────────────────────────────────────
print("\nSTEP 4: Training eligibility classifier (Random Forest)...")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

clf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    class_weight="balanced"
)
clf.fit(X_train, y_train)

y_pred    = clf.predict(X_test)
accuracy  = accuracy_score(y_test, y_pred)

print(f"  [OK] Accuracy: {accuracy * 100:.2f}%")
print("\n  Classification Report:")
print(classification_report(y_test, y_pred, target_names=["Not Eligible", "Eligible"]))

joblib.dump(clf, os.path.join(MODEL_DIR, "eligibility_model.pkl"))
print(f"  [OK] Eligibility model saved -> models/eligibility_model.pkl")

# ─── STEP 5: TRAIN FRAUD DETECTION MODEL ─────────────────────────────────────
print("\nSTEP 5: Training fraud detection model (Isolation Forest)...")

fraud_features = df[["age", "annual_income", "family_size", "land_owned"]].copy()

fraud_model = IsolationForest(
    n_estimators=100,
    contamination=0.05,
    random_state=42
)
fraud_model.fit(fraud_features)

joblib.dump(fraud_model, os.path.join(MODEL_DIR, "fraud_model.pkl"))
print("  [OK] Fraud detection model saved -> models/fraud_model.pkl")

# ─── STEP 6: SAVE RECOMMENDER DATA ───────────────────────────────────────────
print("\nSTEP 6: Saving recommender data...")

recommender_data = {
    "schemes": [
        {
            "id": "1", "name": "PM Kisan Samman Nidhi", "category": "Agriculture",
            "min_income": 0, "max_income": 200000, "min_age": 18, "max_age": 80,
            "caste": ["General","OBC","SC","ST"], "occupation": ["Farmer"],
            "benefits": "₹6,000 per year direct income support"
        },
        {
            "id": "2", "name": "PM Awas Yojana", "category": "Housing",
            "min_income": 0, "max_income": 300000, "min_age": 18, "max_age": 70,
            "caste": ["General","OBC","SC","ST"],
            "occupation": ["Farmer","Daily Wage Worker","Self Employed","Unemployed"],
            "benefits": "Financial assistance for construction of pucca house"
        },
        {
            "id": "3", "name": "Ayushman Bharat", "category": "Health",
            "min_income": 0, "max_income": 500000, "min_age": 0, "max_age": 100,
            "caste": ["General","OBC","SC","ST"],
            "occupation": ["Farmer","Daily Wage Worker","Self Employed","Unemployed"],
            "benefits": "Health coverage up to ₹5 lakh per family per year"
        },
        {
            "id": "4", "name": "National Scholarship Portal", "category": "Education",
            "min_income": 0, "max_income": 250000, "min_age": 5, "max_age": 30,
            "caste": ["SC","ST","OBC"], "occupation": ["Student"],
            "benefits": "Scholarships for students from SC/ST/OBC communities"
        },
        {
            "id": "5", "name": "PM Mudra Yojana", "category": "Finance",
            "min_income": 0, "max_income": 1000000, "min_age": 18, "max_age": 65,
            "caste": ["General","OBC","SC","ST"],
            "occupation": ["Self Employed","Small Business Owner"],
            "benefits": "Loans up to ₹10 lakh without collateral"
        },
        {
            "id": "6", "name": "MGNREGA", "category": "Employment",
            "min_income": 0, "max_income": 150000, "min_age": 18, "max_age": 60,
            "caste": ["General","OBC","SC","ST"],
            "occupation": ["Daily Wage Worker","Farmer","Unemployed"],
            "benefits": "Guaranteed 100 days of wage employment per year"
        },
        {
            "id": "7", "name": "Atal Pension Yojana", "category": "Pension",
            "min_income": 0, "max_income": 500000, "min_age": 18, "max_age": 40,
            "caste": ["General","OBC","SC","ST"],
            "occupation": ["Farmer","Daily Wage Worker","Self Employed"],
            "benefits": "Guaranteed pension of ₹1,000 to ₹5,000 per month"
        },
        {
            "id": "8", "name": "Sukanya Samriddhi Yojana", "category": "Finance",
            "min_income": 0, "max_income": 1000000, "min_age": 18, "max_age": 60,
            "caste": ["General","OBC","SC","ST"],
            "occupation": ["Farmer","Daily Wage Worker","Self Employed","Salaried"],
            "benefits": "Savings scheme for girl child with high interest rate"
        },
    ]
}

joblib.dump(recommender_data, os.path.join(MODEL_DIR, "recommender_data.pkl"))
print("  [OK] Recommender data saved -> models/recommender_data.pkl")

# ─── DONE ─────────────────────────────────────────────────────────────────────
print("\n" + "=" * 50)
print("ALL MODELS TRAINED SUCCESSFULLY!")
print("=" * 50)
print("\nSaved models:")
print("  [OK] models/eligibility_model.pkl")
print("  [OK] models/fraud_model.pkl")
print("  [OK] models/recommender_data.pkl")
print("  [OK] models/le_gender.pkl")
print("  [OK] models/le_caste.pkl")
print("  [OK] models/le_state.pkl")
print("  [OK] models/le_occupation.pkl")
print("\nNext step: Run 'python main.py' to start the FastAPI server!")