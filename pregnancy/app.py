# from flask import Flask, render_template, request
# import difflib  # for suggestions

# app = Flask(__name__)

# # ===============================
# # Food database
# # ===============================
# foods = {
#     # Fruits
#     "apple": "✅ Good - Provides fiber and vitamins.",
#     "banana": "✅ Good - Rich in potassium, helps digestion.",
#     "orange": "✅ Good - Vitamin C boosts immunity.",
#     "grapes": "⚠️ Eat in moderation - May cause acidity.",
#     "papaya": "❌ Avoid - Unripe papaya may trigger contractions.",
#     "pineapple": "❌ Avoid - May increase risk of contractions.",
#     "mango": "✅ Good - Rich in vitamins, but avoid excess (sugar).",
#     "watermelon": "✅ Good - Hydrating and safe.",
#     "guava": "✅ Good - Rich in fiber and vitamin C.",
#     "pomegranate": "✅ Good - Boosts hemoglobin.",
#     "strawberry": "✅ Good - Antioxidants and vitamin C.",
#     "cherry": "✅ Good - Safe and nutritious.",
#     "kiwi": "✅ Good - High in vitamin C and folate.",
#     "dates": "⚠️ Eat in moderation - High in sugar, good in last trimester.",
#     "dry fruits": "✅ Good - Almonds, walnuts, cashews provide healthy fats.",
#     "coconut water": "✅ Good - Hydrating, maintains electrolytes.",

#     # Vegetables
#     "carrot": "✅ Good - Rich in vitamin A.",
#     "spinach": "✅ Good - Iron and folic acid.",
#     "broccoli": "✅ Good - Rich in calcium and vitamins.",
#     "potato": "✅ Good - Carbohydrate source, eat in moderation.",
#     "sweet potato": "✅ Good - High in fiber and beta carotene.",
#     "tomato": "✅ Good - Vitamin C and antioxidants.",
#     "onion": "✅ Good - Safe in moderation.",
#     "garlic": "✅ Good - Helps immunity, but avoid excess.",
#     "brinjal": "⚠️ Eat rarely - Some suggest limiting in pregnancy.",
#     "cabbage": "✅ Good - Cook well before eating.",
#     "cauliflower": "✅ Good - Nutritious, may cause gas.",
#     "mushroom": "⚠️ Only safe if well-cooked - Avoid raw.",
#     "lettuce": "✅ Good - Wash properly before eating.",
#     "beetroot": "✅ Good - Helps increase hemoglobin.",

#     # Dairy
#     "milk": "✅ Good - Calcium and protein source.",
#     "curd": "✅ Good - Probiotics and calcium.",
#     "buttermilk": "✅ Good - Helps digestion.",
#     "cheese": "⚠️ Only pasteurized cheese is safe - avoid soft cheese.",
#     "paneer": "✅ Good - Rich in protein (must be fresh).",
#     "ice cream": "⚠️ Eat occasionally - High sugar, risk of infection if unhygienic.",

#     # Protein foods
#     "egg": "✅ Good - Protein-rich, but cook well.",
#     "chicken": "✅ Good - Lean protein, but must be well-cooked.",
#     "mutton": "⚠️ Safe in moderation, well-cooked only.",
#     "fish": "⚠️ Choose low-mercury fish like salmon, sardine. Avoid shark/tuna in excess.",
#     "prawns": "⚠️ Eat occasionally, only well-cooked.",
#     "soybean": "✅ Good - Protein source, but eat in moderation.",
#     "tofu": "✅ Good - Safe vegetarian protein.",

#     # Grains & pulses
#     "rice": "✅ Good - Easy to digest.",
#     "brown rice": "✅ Good - More fiber than white rice.",
#     "wheat roti": "✅ Good - Staple and healthy.",
#     "oats": "✅ Good - High fiber, good for digestion.",
#     "dal": "✅ Good - Rich in protein and iron.",
#     "chickpeas": "✅ Good - Protein and fiber rich.",
#     "rajma": "⚠️ Eat in moderation - May cause gas.",
#     "chana": "✅ Good - Nutritious legume.",
#     "corn": "✅ Good - Rich in fiber, easy snack.",

#     # Drinks
#     "tea": "⚠️ Limit - Contains caffeine, max 1-2 cups/day.",
#     "coffee": "⚠️ Limit - Max 200mg caffeine/day.",
#     "alcohol": "❌ Avoid - Harmful for baby development.",
#     "soft drinks": "❌ Avoid - High sugar and chemicals.",
#     "energy drinks": "❌ Avoid - High caffeine and unsafe additives.",
#     "green tea": "⚠️ Limited only - Contains caffeine.",
#     "fresh juice": "✅ Good - Make fresh, avoid packed juices.",

#     # Junk / street food
#     "pizza": "⚠️ Occasionally - High in fat/salt.",
#     "burger": "⚠️ Occasionally - Not very healthy.",
#     "french fries": "⚠️ Occasionally - Oily, avoid excess.",
#     "chips": "❌ Avoid - High in salt and unhealthy oils.",
#     "street food": "⚠️ Risky - May cause infection.",
#     "chocolate": "⚠️ Small amount is okay, avoid excess caffeine & sugar."
# }

# # ===============================
# # Routes
# # ===============================
# @app.route("/", methods=["GET", "POST"])
# def index():
#     result = ""
#     suggestions = []
#     if request.method == "POST":
#         food_item = request.form["food"].lower().strip()
#         if not food_item:
#             result = "⚠️ Please enter a food name."
#         else:
#             if food_item in foods:
#                 result = foods[food_item]
#             else:
#                 result = f"ℹ️ '{food_item}' not in database. Please consult a doctor."
#                 # Suggest closest matches
#                 suggestions = difflib.get_close_matches(food_item, foods.keys(), n=3, cutoff=0.6)
#     return render_template("index.html", result=result, suggestions=suggestions)

# # ===============================
# # Run server
# # ===============================
# if __name__ == "__main__":
#     app.run(debug=True, port=5001)











from flask import Flask, render_template, request, jsonify
import difflib

app = Flask(__name__)

# ===============================
# Food database with categories
# ===============================
foods = {
    # Fruits
    "apple": {"status": "✅ Good", "message": "Provides fiber and vitamins.", "category": "Good"},
    "banana": {"status": "✅ Good", "message": "Rich in potassium, helps digestion.", "category": "Good"},
    "orange": {"status": "✅ Good", "message": "Vitamin C boosts immunity.", "category": "Good"},
    "grapes": {"status": "⚠️ Moderate", "message": "May cause acidity.", "category": "Moderate"},
    "papaya": {"status": "❌ Avoid", "message": "Unripe papaya may trigger contractions.", "category": "Avoid"},
    "pineapple": {"status": "❌ Avoid", "message": "May increase risk of contractions.", "category": "Avoid"},
    "mango": {"status": "✅ Good", "message": "Rich in vitamins, but avoid excess (sugar).", "category": "Good"},
    "watermelon": {"status": "✅ Good", "message": "Hydrating and safe.", "category": "Good"},
    # ... (tumhari baaki list same rahegi, main format bana diya hai)
}

# ===============================
# Web Route (HTML form ke liye)
# ===============================
@app.route("/", methods=["GET", "POST"])
def index():
    result = ""
    suggestions = []
    if request.method == "POST":
        food_item = request.form["food"].lower().strip()
        if not food_item:
            result = "⚠️ Please enter a food name."
        elif food_item in foods:
            f = foods[food_item]
            result = f"{f['status']} - {f['message']}"
        else:
            result = f"ℹ️ '{food_item}' not in database. Please consult a doctor."
            suggestions = difflib.get_close_matches(food_item, foods.keys(), n=3, cutoff=0.6)
    return render_template("index.html", result=result, suggestions=suggestions)

# ===============================
# API Route (Frontend fetch ke liye)
# ===============================
@app.route("/api/check_food", methods=["POST"])
def check_food():
    data = request.get_json()
    food_item = data.get("food", "").lower().strip()
    if not food_item:
        return jsonify({"result": "⚠️ Please enter a food name.", "suggestions": []})
    
    if food_item in foods:
        f = foods[food_item]
        return jsonify({
            "status": f["status"],
            "message": f["message"],
            "category": f["category"],
            "suggestions": []
        })
    else:
        suggestions = difflib.get_close_matches(food_item, foods.keys(), n=3, cutoff=0.6)
        return jsonify({
            "status": "ℹ️ Not Found",
            "message": f"'{food_item}' not in database. Please consult a doctor.",
            "category": "Unknown",
            "suggestions": suggestions
        })

# ===============================
# Run server
# ===============================
if __name__ == "__main__":
    app.run(debug=True, port=5001)
