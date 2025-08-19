import streamlit as st
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# =========================
# Custom Page Theme
# =========================
st.set_page_config(page_title="Pregnancy Diet & Baby Impact Analyzer", page_icon="🍼", layout="wide")

# =========================
# Modern CSS
# =========================
st.markdown("""
    <style>
    body {
        background: #faf7ff;
        font-family: 'Segoe UI', sans-serif;
        color: #333;
    }
    .header {
        text-align: center;
        padding: 50px 20px 35px 20px;
        background: linear-gradient(135deg, #f3e8ff, #fdf4ff);
        border-radius: 0 0 30px 30px;
    }
    .header h1 {
        font-size: 38px;
        color: #7f56da;
        margin-bottom: 8px;
    }
    .header p {
        font-size: 17px;
        color: #6b7280;
        margin-top: 0;
    }
    .suggestion {
        background: #f3e8ff;
        border-left: 6px solid #7f56da;
        padding: 10px 14px;
        border-radius: 10px;
        margin: 6px 0;
    }
    .section-title {
        color:#7f56da;
        margin-bottom:8px;
        margin-top:20px;
        text-align:center;
        font-size:22px;
    }
    </style>
""", unsafe_allow_html=True)

# =========================
# WHO Targets
# =========================
WHO = {
    "Calories": 2250,
    "Protein": 78,
    "Iron": 30,
    "Folate": 600,
    "Calcium": 1200,
    "VitaminD": 15,
    "Zinc": 15
}

# =========================
# Fake Food DB
# =========================
FOOD_DB = {
    "Protein": [
        ("Eggs", "2 eggs", {"Protein": 12}),
        ("Paneer / Tofu", "100 g", {"Protein": 16}),
        ("Chicken (cooked)", "100 g", {"Protein": 27}),
        ("Lentils (dal, cooked)", "1 cup", {"Protein": 18}),
        ("Greek Yogurt", "200 g", {"Protein": 20})
    ],
    "Iron": [
        ("Spinach (cooked)", "1 cup", {"Iron": 6}),
        ("Chana/Rajma (cooked)", "1 cup", {"Iron": 4}),
        ("Red Meat (cooked)", "100 g", {"Iron": 3}),
        ("Fortified Cereal", "1 serving", {"Iron": 8})
    ],
    "Calories": [
        ("Whole grains (roti/rice/oats)", "2 servings", {"Calories": 250}),
        ("Nuts", "30 g", {"Calories": 180}),
        ("Banana + milk", "1 banana + 1 cup", {"Calories": 250}),
    ]
}

# =========================
# Synthetic Data Generator
# =========================
def generate_synthetic(n=600, seed=42):
    rng = np.random.default_rng(seed)
    cols = list(WHO.keys())
    X, y = [], []
    for _ in range(n):
        row, deficits = {}, 0
        for k in cols:
            base = WHO[k]
            factor = rng.uniform(0.6, 1.6)
            val = base * factor + rng.normal(0, base * 0.03)
            row[k] = round(val, 2)
            if val < base:
                deficits += 1
        label = "Healthy" if deficits == 0 else "Needs Improvement" if deficits <= 2 else "Deficient"
        X.append([row[c] for c in cols])
        y.append(label)
    df = pd.DataFrame(X, columns=cols)
    df["Label"] = y
    return df

@st.cache_data
def train_model():
    df = generate_synthetic()
    X = df.drop(columns=["Label"])
    y = df["Label"]
    scaler = StandardScaler()
    Xs = scaler.fit_transform(X)
    from sklearn.model_selection import train_test_split
    Xtr, Xte, ytr, yte = train_test_split(Xs, y, test_size=0.2, random_state=7, stratify=y)
    from sklearn.ensemble import RandomForestClassifier
    clf = RandomForestClassifier(n_estimators=300, random_state=7)
    clf.fit(Xtr, ytr)
    return clf, scaler, clf.score(Xte, yte)

clf, scaler, acc = train_model()

# =========================
# HEADER
# =========================
st.markdown("""
<div class="header">
    <h1>🍼 Pregnancy Diet & Baby Impact Analyzer</h1>
    <p>Your personalized companion for optimal nutrition during pregnancy</p>
</div>
""", unsafe_allow_html=True)

st.markdown(f"✅ Model validation accuracy on synthetic data: **{acc:.2f}**")

# =========================
# INPUT FORM
# =========================
st.markdown("<h2 class='section-title'>🔎 Enter Today's Intake</h2>", unsafe_allow_html=True)

with st.form("diet_form"):
    cals = st.number_input("Calories (kcal)", 0.0, 4000.0, 2000.0, 50.0)
    protein = st.number_input("Protein (g)", 0.0, 200.0, 55.0, 1.0)
    iron = st.number_input("Iron (mg)", 0.0, 50.0, 18.0, 0.5)
    folate = st.number_input("Folate (mcg)", 0.0, 1000.0, 400.0, 10.0)
    calcium = st.number_input("Calcium (mg)", 0.0, 2000.0, 800.0, 10.0)
    vitd = st.number_input("Vitamin D (mcg)", 0.0, 50.0, 10.0, 0.5)
    zinc = st.number_input("Zinc (mg)", 0.0, 50.0, 8.0, 0.5)

    submitted = st.form_submit_button("✨ Analyze Diet ✨")

# =========================
# HELPER FUNCTIONS
# =========================
def analyze(user):
    df = pd.DataFrame([user])
    Xs = scaler.transform(df)
    pred = clf.predict(Xs)[0]
    gaps, flags = {}, {}
    for k, target in WHO.items():
        val = user[k]
        if val < target:
            gaps[k], flags[k] = round(target - val, 2), "Low"
        elif val > target * 1.6:
            gaps[k], flags[k] = round(val - target, 2), "High"
        else:
            gaps[k], flags[k] = 0.0, "OK"
    return pred, gaps, flags

def close_gaps(nutrient, gap_value):
    if nutrient not in FOOD_DB: return []
    plan, remaining = [], gap_value
    for food, unit, contrib in FOOD_DB[nutrient]:
        if remaining <= 0: break
        plan.append((food, unit))
        remaining -= list(contrib.values())[0]
    return plan

# =========================
# ANALYSIS
# =========================
if submitted:
    user = {
        "Calories": float(cals),
        "Protein": float(protein),
        "Iron": float(iron),
        "Folate": float(folate),
        "Calcium": float(calcium),
        "VitaminD": float(vitd),
        "Zinc": float(zinc)
    }

    pred, gaps, flags = analyze(user)

    st.success(f"💡 Model Verdict: **{pred}**")

    # Chart
    st.markdown("<h2 class='section-title'>📊 Intake vs Target</h2>", unsafe_allow_html=True)
    st.bar_chart(pd.DataFrame({"Your Intake": user, "Target": WHO}))

    # Status Table
    st.markdown("<h2 class='section-title'>📋 Nutrient Status</h2>", unsafe_allow_html=True)
    st.dataframe(pd.DataFrame([
        {"Nutrient": k, "Your Intake": user[k], "Target": WHO[k], "Status": flags[k], "Gap": gaps[k]}
        for k in WHO.keys()
    ]))

    # Suggestions
    st.markdown("<h2 class='section-title'>🍎 Personalized Food Suggestions</h2>", unsafe_allow_html=True)
    for k in WHO.keys():
        if flags[k] == "Low":
            st.markdown(f"<div class='suggestion'>**{k}** is below target by **{gaps[k]}**</div>", unsafe_allow_html=True)
            for food, unit in close_gaps(k, gaps[k]):
                st.write(f"- {food} — {unit}")

    highs = [k for k in WHO if flags[k] == "High"]
    if highs:
        st.warning("⚠️ Some nutrients are too high: " + ", ".join(highs))

# =========================
# EXTRA SECTION – Embed Food Checker
# =========================
st.markdown("<h2 class='section-title'>🥗 Pregnancy Food Checker</h2>", unsafe_allow_html=True)
st.info("Use this tool to quickly check whether a specific food is safe during pregnancy.")

# Iframe to Flask app
st.components.v1.iframe("http://127.0.0.1:5001", height=600, scrolling=True)
