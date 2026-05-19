from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "PathWeaver Backend Running"}

@app.get("/generate-pathway")
def pathway():
    return {
        "career": "Cloud Engineer",
        "timeline": "12 months",
        "skills": ["Linux", "AWS", "Docker"]
    }

@app.get("/simulate-work")
def simulation():
    return {
        "simulation": "Cloud outage troubleshooting",
        "difficulty": "Medium"
    }

@app.get("/readiness-score")
def score():
    return {
        "score": 74,
        "status": "Strong trajectory"
    }