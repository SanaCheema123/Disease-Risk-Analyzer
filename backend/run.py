#!/usr/bin/env python3
"""CHILD-SAFE Pakistan Backend Startup"""

import os
import sys

print("=" * 55)
print("  CHILD-SAFE Pakistan — AI Risk Analyzer API")
print("  Aivonex Technologies")
print("=" * 55)

groq_key = os.environ.get("GROQ_API_KEY", "")
if not groq_key:
    env_file = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_file):
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line.startswith("GROQ_API_KEY=") and not line.endswith("=your_groq_api_key_here"):
                    key = line.split("=", 1)[1].strip()
                    if key:
                        os.environ["GROQ_API_KEY"] = key
                        groq_key = key
                        print(f"  ✓ Groq API key loaded from .env")
                        break

if groq_key:
    print(f"  ✓ Groq API key configured (gsk_...{groq_key[-6:]})")
else:
    print("  ⚠  GROQ_API_KEY not set!")
    print("     Set it in backend/.env or as environment variable")
    print("     Get your key at: console.groq.com")

print("\n  Starting API server on http://localhost:5000")
print("  Frontend should run on http://localhost:5173")
print("=" * 55 + "\n")

from app import app
app.run(debug=True, host="0.0.0.0", port=5000)
