<div align="center">

<img src="./public/branding/logo.png" alt="Resolvr AI" width="320" />

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=800&color=00C2FF&center=true&vCenter=true&width=700&lines=AI+Simulation+Engine+%E2%80%94+Debug+Real+Incidents;Adaptive+Career+Pathways;Employability+Intelligence+Platform;Bridge+Education+%E2%86%92+Industry+Readiness" alt="Typing animation" />

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-0ea5e9?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

<br/>

[![Live Demo](https://img.shields.io/badge/%F0%9F%9A%80%20Live%20Demo-Click%20Here-00C2FF?style=for-the-badge)](https://your-link.vercel.app)
&nbsp;&nbsp;
[![View Code](https://img.shields.io/badge/%F0%9F%93%81%20Source%20Code-GitHub-7c3aed?style=for-the-badge)](https://github.com/your-username/resolvr-ai)

</div>

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:00c2ff,100:7c3aed&height=3&section=header" width="100%"/>

---

## 🎯 What is Resolvr AI?

> **Students don't fail to get jobs because they lack degrees. They fail because they've never debugged a production Kubernetes outage at 2am.**

Resolvr puts you inside that moment — before it matters. You pick a career goal, get a real readiness score, and work through actual P0/P1 production incidents in a live terminal. Every command you run, every hint you take, every escalation you handle (or miss) updates your employability score in real time.

**No static quizzes. No fake career advice. Real incident scenarios, real skill gaps, real paths forward.**

<br/>

---

## ✨ Platform at a Glance

<div align="center">

| | Feature | What it does |
|:---:|:---|:---|
| 🧠 | **AI Readiness Engine** | Scores you 0–100 based on skill level, simulations completed, pathway progress, and skill-interest alignment |
| ⚡ | **Incident Simulations** | 5 production-grade scenarios — type real `kubectl`, `systemctl`, `curl` commands in a live terminal |
| 🧭 | **Career Pathways** | ML → Cybersecurity → Cloud → Frontend — adaptive roadmap that unlocks as your score grows |
| 🔍 | **Skill Gap Analysis** | Current vs target proficiency per skill, with AI-generated improvement actions |
| 💼 | **Opportunity Matching** | AI-ranked internships and roles scored against your actual skill profile |
| 📈 | **Progress Analytics** | Timeline of milestones, AI confidence, recommendation strength over time |

</div>

<br/>

---

## ⚡ Simulation Engine

The core of the platform. Five production-grade incidents, each running through 4 stages:

```
IDENTIFY  ──▶  DIAGNOSE  ──▶  RESOLVE  ──▶  DOCUMENT
```

You get a live terminal. Real logs streaming. An AI co-pilot watching your moves.

<br/>

<div align="center">

### 🔴 Active Scenarios

| Severity | Scenario | The Situation |
|:---:|:---|:---|
| ![P0](https://img.shields.io/badge/P0-Critical-red?style=flat-square) | **Kubernetes Regional Failure** | us-east-1 control plane down. Etcd quorum lost — 2/3 nodes unreachable. 40% error rate. Failover breaking. |
| ![P1](https://img.shields.io/badge/P1-Critical-orange?style=flat-square) | **CI/CD Pipeline Meltdown** | Build times +400%. 200 jobs queued. All runners exhausted. Security hotfix blocked in queue. |
| ![P1](https://img.shields.io/badge/P1-Critical-orange?style=flat-square) | **Production AI Incident** | Rec engine latency p99 > 2400ms post-rollout. Confidence scores collapsing. Conversion dropping live. |
| ![P1](https://img.shields.io/badge/P1-Critical-orange?style=flat-square) | **Recommendation Engine Drift** | 15% conversion drop over 72h traced to embedding space drift. Model accurate — business metrics not. |
| ![P0](https://img.shields.io/badge/P0-Critical-red?style=flat-square) | **Security Token Breach** | GitHub admin token leaked. 500+ API calls/hour. Active exfiltration. Every second costs. |

</div>

<br/>

### 🎮 How Scoring Works

Every action you take changes your score (0–1000 scale):

```
✅  Step completed correctly    +50 pts
✅  Escalation handled          +40 pts
⏱️  Time bonus (per min left)   +2  pts
❌  Hint used                   -10 pts
❌  Step skipped                -30 pts
❌  Escalation missed           -25 pts
```

Score feeds directly back into your **Readiness Score** — completing simulations is the fastest way to level up.

<br/>

---

## 🧠 Readiness Score Formula

Your employability score (0–100) is computed deterministically from `lib/readiness-engine.ts`:

<div align="center">

| Input | Points |
|:---|:---:|
| Skill level — Beginner | 20 |
| Skill level — Intermediate | 45 |
| Skill level — Advanced | 65 |
| Each simulation completed | +8 |
| Every 10% of pathway progress | +2 |
| Each matched skill–interest pair | +2 |

</div>

Score updates in real time. No black box — you always know exactly how to move it.

<br/>

---

## 🧭 Career Pathways

Four pathways, each a structured roadmap from **Foundation → Intermediate → Specialization**:

<div align="center">

| Pathway | For | Unlocked by |
|:---|:---|:---|
| 🤖 Machine Learning | AI Engineer, Data Scientist | Default for AI/ML goal |
| 🔐 Cybersecurity | DevOps Engineer | Default for DevOps goal |
| ☁️ Cloud Computing | Cloud Engineer | Default for Cloud goal |
| 💻 Frontend Engineering | Backend Developer | Default for Backend goal |

</div>

Nodes lock/unlock based on your readiness score threshold — finishing simulations is what moves the path forward.

<br/>

---

## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/your-username/resolvr-ai.git
cd resolvr-ai

# 2. Install
pnpm install          # or: npm install

# 3. Run
pnpm dev              # → http://localhost:3000
```

> ✅ **Zero config required.** No `.env` file, no API keys, no database. Runs fully on client-side mock data + `localStorage`. Just clone and go.

<br/>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|:---|:---|
| **Framework** | Next.js 16.2 (App Router) + React 19 |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS v4 + Framer Motion |
| **Components** | Radix UI + shadcn/ui + Lucide React |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **State** | React Context — `UserContext` + `AppStateContext` |
| **Persistence** | `localStorage` via typed wrappers (`lib/storage/`) |
| **Deployment** | Vercel |

</div>

<br/>

---

## 📁 Project Structure

```
Resolvr-main/
│
├── app/                        ← Next.js App Router
│   ├── dashboard/              ← Main dashboard
│   ├── onboarding/             ← 5-step onboarding flow
│   ├── simulation/             ← Live incident runner
│   ├── simulations/            ← Scenario browser
│   ├── pathway/                ← Career roadmap
│   ├── opportunities/          ← Ranked job matches
│   ├── readiness/              ← Score & analytics
│   └── skills/                 ← Skill gap analysis
│
├── lib/
│   ├── readiness-engine.ts     ← computeReadinessScore()
│   ├── simulation/
│   │   ├── scoring-engine.ts   ← Per-event score deltas
│   │   ├── command-parser.ts   ← kubectl / systemctl / curl
│   │   └── incident-engine.ts  ← Incident lifecycle
│   ├── scenarios/              ← 5 incident scenario configs
│   ├── pathways/               ← Pathway engine + recommendations
│   ├── ai/scoring-engine.ts    ← SimulationMemory, riskProfile
│   └── storage/                ← Typed localStorage wrappers
│
├── context/
│   ├── user-context.tsx        ← UserProfile + UserProgress
│   └── app-state.tsx           ← Simulations, AI insights, filters
│
└── components/
    ├── simulation/             ← Terminal, logs, incident UI
    ├── dashboard/              ← Widgets, pathway graph
    ├── landing/                ← Hero, features, CTA
    └── ui/                     ← Radix/shadcn primitives
```

<br/>

---

## 🔄 How Data Flows

```
  Onboarding (5 steps)
       │
       ▼
  UserProfile  ──────────────────────────────────────────────────┐
       │                                                          │
       ▼                                                          │
  computeReadinessScore()  →  score: 0–100                       │
       │                                                          │
       ▼                                                          │
  pathway-engine  →  CareerPathway + locked/unlocked nodes        │
       │                                                          │
       ▼                                                          │
  Simulations + Opportunities + Skill gaps (all adaptive)         │
       │                                                          │
       ▼                                                          │
  User completes simulation  →  score deltas applied  ────────────┘
                                  (loop repeats, score grows)
```

State lives in two React contexts — `UserContext` (profile + progress) and `AppStateContext` (active sim run, filters, notifications) — both persisted to `localStorage`.

<br/>

---

## 🗺️ Roadmap

- [ ] 🔐 Authentication + persistent cloud accounts
- [ ] 🤖 Real LLM responses (replace mock AI feedback)
- [ ] 📡 Backend API for live opportunity data
- [ ] 💻 Live coding assessments inside simulation steps
- [ ] 🎮 Gamification — XP, badges, streak tracking
- [ ] 🏆 Multi-user leaderboards and peer comparison
- [ ] 📱 Mobile-optimized simulation terminal
- [ ] 🌩️ New scenarios — cloud cost incidents, DB outages, data pipeline failures
- [ ] 📊 Exportable career readiness reports

<br/>

---

## 👥 Team

<div align="center">

| | Name | Role | |
|:---:|:---|:---|:---:|
| 👨‍💻 | **Tanay Jain** | Backend Engineer & Infrastructure Lead | [![LinkedIn](https://img.shields.io/badge/-LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/tanay-jain-321617375) |
| 🎨 | **Devang Bhawan** | Frontend Engineering Lead | [![LinkedIn](https://img.shields.io/badge/-LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/devang-bhawan-8248193a1) |
| 🚀 | **Chahak Agarwal** | Design & Product Lead | [![LinkedIn](https://img.shields.io/badge/-LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/chahak-agarwal-9a7ab8366) |

</div>

<br/>

---

## 📸 Screenshots

> Drop real screenshots into `./public/screenshots/` and replace the src attributes below.
> **Priority:** record a 15s simulation terminal GIF first — that one asset alone will make the repo stand out.

### Simulation Terminal
<!-- Record: open a scenario → type kubectl get nodes → watch score change → resolve incident -->
<!-- Export at 800px wide, under 5MB. Tool: ScreenToGif (Windows) or Kap (Mac) -->
![Simulation Terminal — GIF coming soon](https://via.placeholder.com/900x450/0d1117/00c2ff?text=⚡+Simulation+Terminal+GIF+—+coming+soon)

### Dashboard
![Dashboard](https://via.placeholder.com/900x450/0d1117/7c3aed?text=📊+Dashboard+—+screenshot+coming+soon)

### Pathway Explorer & Opportunity Intelligence

| Pathway Explorer | Opportunity Intelligence |
|:---:|:---:|
| ![Pathway](https://via.placeholder.com/430x260/0d1117/00c2ff?text=🧭+Pathway+Explorer) | ![Opportunities](https://via.placeholder.com/430x260/0d1117/7c3aed?text=💼+Opportunity+Intelligence) |

<br/>

---

## 🤝 Contributing

```bash
git checkout -b feat/your-feature
git commit -m "feat: describe your change"
git push origin feat/your-feature
# → open a pull request
```

<br/>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:7c3aed,50:00c2ff,100:0d1117&height=80&section=footer" width="100%"/>

**Built with ambition. Designed for the next generation of engineers.**

[![Star this repo](https://img.shields.io/github/stars/your-username/resolvr-ai?style=social)](https://github.com/your-username/resolvr-ai)

</div>
