<div align="center">

<img src="./public/branding/logo.png" alt="Resolvr AI" width="380" />

<br/><br/>

**AI-Powered Employability Intelligence Platform**

*Bridging the gap between education and industry readiness.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-0ea5e9?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

</div>

---

## Overview

Resolvr AI helps students discover where they stand, what they're missing, and how to close the gap. Rather than generic career advice, it combines an adaptive readiness engine with production-grade incident simulations to give each user an honest picture of their employability and a concrete path forward.

A new user completes a five-step onboarding (career goal → interests → skill level → learning style → weekly commitment), which seeds a personal readiness score and unlocks a tailored career pathway. From there, everything — the simulations recommended, the skill gaps surfaced, and the opportunities ranked — adapts to their specific profile.

---

## Features

### Readiness Score Engine
A deterministic scoring model (`lib/readiness-engine.ts`) computes a 0–100 employability score from four inputs:

| Input | Weight |
|---|---|
| Skill level baseline (Beginner / Intermediate / Advanced) | 20 / 45 / 65 pts |
| Each completed simulation | +8 pts |
| Pathway progress (per 10%) | +2 pts |
| Skill-interest alignment | +2 pts per matched pair |

The score caps at 100 and updates in real time as the user completes activities.

### Career Pathways
Four supported pathways: **Machine Learning**, **Cybersecurity**, **Cloud Computing**, **Frontend Engineering**. Each maps to a structured roadmap of foundation → intermediate → specialization nodes. Onboarding answers determine which pathway is recommended and which nodes are unlocked vs. locked based on current score thresholds.

### AI Simulations
A terminal-based incident simulation engine where users debug real production-style scenarios. Each scenario runs through four stages: **Identify → Diagnose → Resolve → Document**. Scoring is tracked on a 0–1000 scale with per-event deltas:

| Event | Delta |
|---|---|
| Step completed | +50 |
| Relevant command | positive |
| Irrelevant / incorrect command | negative |
| Hint used | −10 |
| Step skipped | −30 |
| Escalation handled correctly | +40 |
| Escalation missed | −25 |
| Time bonus | +2 per minute remaining |

The terminal accepts `kubectl`, `systemctl`, `journalctl`, `curl`, and `network` (ping) commands. Each command is parsed, categorized, and evaluated against the active scenario's expected resolution path.

**Available scenarios:**

| Scenario | Severity | Summary |
|---|---|---|
| **Kubernetes Regional Failure** | P0 — Critical | us-east-1 control plane down, etcd quorum lost (2/3 nodes), cross-region failover failing, 40% error rate |
| **CI/CD Pipeline Meltdown** | P1 — Critical | Build times up 400%, 200+ jobs queued, runner pool exhausted, critical security hotfix blocked |
| **Production AI Incident** | P1 — Critical | Recommendation engine latency p99 > 2400ms after model rollout, confidence scores collapsing, conversion dropping |
| **Recommendation Engine Drift** | P1 — Critical | 15% conversion drop over 72 hours traced to embedding space drift from incompatible feature pipeline update |
| **Security Token Breach** | P0 — Critical | GitHub admin token leaked, 500+ API calls/hour, active data exfiltration in progress |

### Skill Gap Analysis
Tracks current vs. target proficiency for each skill in the user's profile. The AI layer (`lib/ai/`) generates improvement actions specific to the gap size and the user's pathway.

### Opportunity Matching
AI-ranked list of internships and roles scored against the user's current skill profile. Includes filtering, saved/applied tracking, and match percentage per opportunity.

### Progress & Analytics
Career timeline visualization showing completed milestones, current position, and forecasted next milestones. Tracks `aiConfidence`, `recommendationStrength`, `simulationsCompleted`, `skillsTracked`, and `opportunitiesMatched` over time.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| UI Runtime | React 19 |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Components | Radix UI + shadcn/ui architecture |
| Icons | Lucide React |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| State | React Context API (UserContext + AppStateContext) |
| Persistence | `localStorage` via typed wrappers in `lib/storage/` |
| Deployment | Vercel |

---

## Project Structure

```
Resolvr-main/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout
│   ├── dashboard/              # Main dashboard
│   ├── onboarding/             # 5-step onboarding flow
│   ├── pathway/                # Career pathway explorer
│   ├── simulation/             # Single simulation runner
│   ├── simulations/            # Simulation browser
│   ├── opportunities/          # Opportunity intelligence
│   ├── readiness/              # Readiness score & analytics
│   ├── skills/                 # Skill gap analysis
│   ├── recommendations/        # AI recommendations
│   ├── settings/               # User settings
│   └── team/                   # Team page
│
├── components/
│   ├── landing/                # Hero, navbar, features, CTA, footer
│   ├── dashboard/              # Widgets, pathway graph, stats panels
│   ├── simulation/             # Terminal, live logs, incident UI
│   ├── pathway/                # Roadmap nodes, progress visualization
│   ├── opportunities/          # Opportunity cards, filters, modals
│   ├── onboarding/             # Step components
│   ├── common/                 # PageTransition and shared utilities
│   └── ui/                     # Radix/shadcn base primitives
│
├── context/
│   ├── user-context.tsx        # UserProfile + UserProgress global state
│   └── app-state.tsx           # Opportunities, simulations, AI insights
│
├── lib/
│   ├── ai/
│   │   └── scoring-engine.ts   # ScoringInput/Output, SimulationMemory, riskProfile
│   ├── simulation/
│   │   ├── types.ts            # LogEntry, AIFeedback, ScoreState, SimulationState
│   │   ├── scoring-engine.ts   # Per-event score deltas, score mutation helpers
│   │   ├── command-parser.ts   # kubectl / systemctl / journalctl / curl parsing
│   │   ├── incident-engine.ts  # Incident lifecycle management
│   │   ├── ai-feedback-engine.ts
│   │   └── response-evaluator.ts
│   ├── simulation-engine/
│   │   └── index.ts            # Top-level simulation orchestration
│   ├── scenarios/              # Scenario config files
│   │   ├── k8s-regional-failure.ts
│   │   ├── cicd-meltdown.ts
│   │   ├── production-ai-incident.ts
│   │   ├── rec-engine-drift.ts
│   │   └── security-token-breach.ts
│   ├── simulations/
│   │   ├── types.ts            # ScenarioConfig, AlignmentEffects
│   │   ├── simulation-scoring.ts
│   │   └── productionAIIncident.ts
│   ├── pathways/
│   │   ├── pathway-engine.ts   # CareerPathway type, node status logic
│   │   └── pathway-recommendations.ts
│   ├── onboarding/
│   │   └── options.ts          # Career goals, interests, skill levels, learning styles
│   ├── types/
│   │   ├── user-profile.ts     # UserProfile, SkillLevel, ProfileOnlyState
│   │   ├── user-state.ts       # UserProgress, SimulationRunState, Skill, Opportunity
│   │   └── enhanced-data-models.ts
│   ├── storage/
│   │   ├── local-storage.ts    # Typed localStorage read/write wrappers
│   │   └── user-state-storage.ts
│   ├── readiness-engine.ts     # computeReadinessScore()
│   ├── mock-data.ts            # Career paths, skills, opportunities seed data
│   ├── pathway-data.ts         # Static pathway node data
│   └── utils.ts
│
├── hooks/                      # Custom React hooks
├── public/
│   ├── branding/               # Logo, favicon, PWA icons (192px, 512px, apple-touch)
│   └── team/                   # Team member photos
├── styles/globals.css
├── next.config.mjs             # ignoreBuildErrors: true, images.unoptimized: true
├── vercel.json
└── tsconfig.json
```

---

## Getting Started

**Prerequisites:** Node.js 18+, pnpm (recommended) or npm.

```bash
# Clone
git clone https://github.com/your-username/resolvr-ai.git
cd resolvr-ai

# Install
pnpm install       # or: npm install

# Dev server
pnpm dev           # or: npm run dev
# → http://localhost:3000

# Build
pnpm build

# Lint
pnpm lint
```

No environment variables are required. The platform runs entirely on client-side mock data and localStorage persistence — there is no backend or database dependency for local development.

> **Note:** `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so TypeScript errors won't block production builds. If you're adding new features, run `tsc --noEmit` separately to catch type issues.

---

## Data Flow

```
Onboarding (5 steps)
  └─▶ UserProfile stored in localStorage
        └─▶ computeReadinessScore() → readinessScore (0–100)
              └─▶ pathway-engine → CareerPathway + node unlock thresholds
                    └─▶ Simulation recommendations, Skill gaps, Opportunity ranking
                          └─▶ User completes simulation
                                └─▶ Score deltas applied → readinessScore updates
                                      └─▶ New pathways / milestones may unlock
```

User state is split across two context providers:
- **UserContext** — `UserProfile` (career goal, skill level, preferences) + `UserProgress` (scores, completed simulations, skills, opportunities)
- **AppStateContext** — transient UI state (active simulation run, opportunity filters, AI insights, notifications)

Both are persisted to `localStorage` via the typed wrappers in `lib/storage/`.

---

## Onboarding Flow

The five-step onboarding captures:

1. **Career Goal** — AI Engineer / Data Scientist / Backend Developer / Cloud Engineer / DevOps Engineer
2. **Interests** — Machine Learning / System Design / Cloud / Cybersecurity / Web Development / Data Analytics
3. **Skill Level** — Beginner / Intermediate / Advanced (sets readiness score baseline: 20 / 45 / 65)
4. **Learning Style** — Hands-on simulations / Video learning / Projects / Mentorship
5. **Weekly Commitment** — 2hrs / 5hrs / 10hrs+

Career goal maps directly to a starting `CareerPathway`:

| Career Goal | Starting Pathway |
|---|---|
| AI Engineer / Data Scientist | Machine Learning |
| Cloud Engineer | Cloud Computing |
| DevOps Engineer | Cybersecurity |
| Backend Developer | Frontend Engineering |

---

## Roadmap

- [ ] Authentication and persistent cloud accounts
- [ ] Real LLM responses replacing mock AI feedback
- [ ] Backend API for live opportunity data
- [ ] Live coding assessments inside simulation steps
- [ ] Additional scenarios: cloud cost incidents, data pipeline failures, database outages
- [ ] Multi-user leaderboards and peer comparison
- [ ] Gamification layer (XP, badges, streak tracking)
- [ ] Mobile-optimized simulation terminal
- [ ] Exportable career readiness reports

---

## Team

| Name | Role | LinkedIn |
|---|---|---|
| Tanay Jain | Backend Engineer & Infrastructure Lead | [tanay-jain-321617375](https://www.linkedin.com/in/tanay-jain-321617375) |
| Devang Bhawan | Frontend Engineering Lead | [devang-bhawan-8248193a1](https://www.linkedin.com/in/devang-bhawan-8248193a1) |
| Chahak Agarwal | Design & Product Lead | [chahak-agarwal-9a7ab8366](https://www.linkedin.com/in/chahak-agarwal-9a7ab8366) |

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m "feat: describe your change"`
4. Push: `git push origin feat/your-feature`
5. Open a pull request

---

## License

This project is intended for educational use, hackathons, and portfolio demonstration.
