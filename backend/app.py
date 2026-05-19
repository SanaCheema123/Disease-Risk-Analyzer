from flask import Flask, request, jsonify
from flask_cors import CORS
import os, json, csv, io
from groq import Groq

app = Flask(__name__)
CORS(app)

def get_api_key():
    key = os.environ.get("GROQ_API_KEY", "").strip()
    if not key:
        env_path = os.path.join(os.path.dirname(__file__), ".env")
        if os.path.exists(env_path):
            with open(env_path) as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("GROQ_API_KEY="):
                        k = line.split("=", 1)[1].strip()
                        if k and k != "your_groq_api_key_here":
                            key = k
                            break
    return key

SYSTEM_PROMPT = """You are the CHILD-SAFE Pakistan AI engine — a climate-health risk analysis expert for Pakistan.

Analyze district climate and disease surveillance data. Identify outbreak-triggering thresholds and generate risk scores.

Risk levels: 0-30=Low, 31-60=Moderate, 61-80=High, 81-100=Critical

Key disease triggers for Pakistan:
- Dengue: temp >30°C + rainfall 10-50mm + humidity >70% + lag 2-3 weeks
- Malaria: post-flood, temp 20-30°C, stagnant water, lag 1-2 weeks
- Diarrheal: temp >35°C + flooding + poor sanitation signals, lag 1 week
- Respiratory: temp drops, AQI >150, cold-humid, lag 1-2 weeks
- Heat-related: temp >40°C for 5+ days, heat index >45, immediate

Write all text naturally and clearly — like a professional public health report. No robotic or template language.

Respond ONLY with valid JSON matching this exact structure:
{
  "summary": "2-3 sentence professional overview",
  "analysis_date": "date string",
  "total_districts": number,
  "high_risk_count": number,
  "critical_count": number,
  "districts": [
    {
      "name": "district name",
      "risks": [
        {
          "disease": "disease name",
          "score": 0-100,
          "level": "Low|Moderate|High|Critical",
          "trigger_factors": ["factor"],
          "lag_weeks": number,
          "recommendation": "specific plain-language action"
        }
      ],
      "top_threat": "disease name",
      "climate_anomalies": ["anomaly description"],
      "priority_actions": ["action 1", "action 2", "action 3"]
    }
  ],
  "climate_thresholds": {
    "dengue": "description",
    "malaria": "description",
    "diarrheal": "description",
    "respiratory": "description",
    "heat": "description"
  },
  "top_districts": ["district1", "district2", "district3"]
}"""

@app.route("/api/health", methods=["GET"])
def health():
    key = get_api_key()
    return jsonify({"status": "running", "api_configured": bool(key)})

@app.route("/api/analyze", methods=["POST"])
def analyze():
    try:
        key = get_api_key()
        if not key:
            return jsonify({"error": "Groq API key not found. Please add it to backend/.env file as GROQ_API_KEY=your_key"}), 500

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received."}), 400

        district_data = data.get("district_data", [])
        config = data.get("config", {})

        msg = f"""Analyze this district data for Pakistan:

Settings:
- Period: {config.get('period', 'Last 12 months')}
- Forecast: {config.get('forecast', '4 weeks ahead')}
- Focus: {config.get('disease', 'All diseases')}

Data:
{json.dumps(district_data, indent=2)}

Generate comprehensive risk scores for all districts. Write recommendations in clear, actionable language."""

        client = Groq(api_key=key)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": msg}
            ],
            temperature=0.25,
            max_tokens=4000,
            response_format={"type": "json_object"}
        )

        result = json.loads(response.choices[0].message.content)
        return jsonify({"success": True, "data": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/analyze/text", methods=["POST"])
def analyze_text():
    try:
        key = get_api_key()
        if not key:
            return jsonify({"error": "Groq API key not found. Please add it to backend/.env file."}), 500

        data = request.get_json()
        text = data.get("text", "").strip()
        if not text:
            return jsonify({"error": "No text provided."}), 400

        client = Groq(api_key=key)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": f"Extract climate and disease data from this description, then generate a full risk analysis:\n\n{text}"}
            ],
            temperature=0.25,
            max_tokens=3000,
            response_format={"type": "json_object"}
        )

        result = json.loads(response.choices[0].message.content)
        return jsonify({"success": True, "data": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/parse-csv", methods=["POST"])
def parse_csv():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        content = request.files["file"].read().decode("utf-8")
        reader = csv.DictReader(io.StringIO(content))
        rows = list(reader)
        return jsonify({"success": True, "districts": rows, "total": len(rows)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    key = get_api_key()
    print("=" * 52)
    print("  CHILD-SAFE Pakistan — Risk Analyzer API")
    print("  Created by Aivonex Technologies")
    print("=" * 52)
    if key:
        print(f"  API key loaded — ...{key[-6:]}")
    else:
        print("  WARNING: No API key found!")
        print("  Add to backend/.env: GROQ_API_KEY=gsk_...")
    print("  Running on http://localhost:5000")
    print("=" * 52 + "\n")
    app.run(debug=True, host="0.0.0.0", port=5000)
