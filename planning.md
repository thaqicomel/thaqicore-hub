# thaqicore-hub — Planning

## Overview

**thaqicore-hub** (Agent Marketplace) is a SaaS platform where users discover, share, rate, and install cognitive agents for the `thaqicore` CLI. Think npm registry but for AI agent definitions.

**Core repo:** [thaqicomel/thaqicore](https://github.com/thaqicomel/thaqicore) — the Go CLI whose agents this marketplace serves.

## Tech Stack

- **Frontend:** React (Vite, JSX, react-router-dom)
- **Backend:** FastAPI (Python)
- **Database:** SQLite (aiosqlite)
- **Auth:** JWT (bcrypt for passwords)
- **No TypeScript** — plain JS/JSX only

## Architecture

```
React Frontend (port 5173)
    ↕ /api proxy
FastAPI Backend (port 8001)
    ↕
SQLite Database

Users publish agents → Marketplace stores definitions
Users install agents → CLI downloads .md definition file
```

## User Personas

### Persona 1: Agent Creator
- Power user of thaqicore who has built custom agents
- Wants to share agents publicly and get feedback
- Wants to build a reputation in the community
- May eventually monetize premium agents

### Persona 2: Agent Consumer
- Uses thaqicore but doesn't want to write agents from scratch
- Browses the marketplace for agents that solve specific tasks
- Cares about ratings, downloads, and community trust
- Wants one-click install to their local project

### Persona 3: Team/Org
- Wants to publish internal agents for their team
- Needs private/unlisted agent support
- Wants to enforce specific providers/models across agents

---

## User Stories

### Authentication
- [ ] As a user, I can register with username/email/password
- [ ] As a user, I can login and receive a JWT token
- [ ] As a user, I can view and edit my profile (display name, bio)
- [ ] As a user, I can see my public profile page with published agents

### Browsing & Discovery
- [ ] As a visitor, I can browse all published agents without logging in
- [ ] As a visitor, I can filter agents by category (cognitive, coding, research, devops, writing, data, creative, productivity, security, other)
- [ ] As a visitor, I can search agents by name, description, or tags
- [ ] As a visitor, I can sort agents by downloads, rating, or newest
- [ ] As a visitor, I can view an agent's detail page with full description, definition, reviews
- [ ] As a visitor, I can see which cognitive systems an agent uses
- [ ] As a visitor, I can see which LLM provider/model an agent targets

### Installing Agents
- [ ] As a user, I can click "Install" to copy the agent definition to clipboard
- [ ] As a user, I see instructions to save as `agents/<slug>.md` in my project
- [ ] As a user, install increments the agent's download counter
- [ ] (Future) As a CLI user, I can run `thaqicore agent install <slug>` to auto-download

### Publishing Agents
- [ ] As a user, I can publish a new agent with: name, slug, description, category, tags, definition (markdown), provider, model
- [ ] As a user, I can preview how my agent will look before publishing
- [ ] As a user, I can update my published agent (new version, updated description)
- [ ] As a user, I can delete my own agents
- [ ] As a user, I can set version numbers for my agents
- [ ] As a user, I can add a README/long description separate from the agent definition
- [ ] As a user, I can specify which cognitive systems my agent reads/writes

### Reviews & Ratings
- [ ] As a user, I can rate an agent 1-5 stars
- [ ] As a user, I can leave a text review with my rating
- [ ] As a user, I can only review each agent once (can update)
- [ ] As a visitor, I can see all reviews for an agent
- [ ] As an author, I see aggregate rating on my agent cards

### My Agents
- [ ] As a user, I can see all agents I've published
- [ ] As a user, I can see download counts and ratings for my agents
- [ ] As a user, I can quick-edit or delete from the My Agents page

---

## User Flows

### Flow 1: Browse & Install
```
Landing Page (Browse) → Search "devops"
    → Filter category: devops → Sort by downloads
    → Click "Kubernetes Expert" agent
    → Read description, reviews, definition preview
    → Click "Install" → Definition copied to clipboard
    → Paste into agents/kubernetes-expert.md locally
    → Run `thaqicore agent list` to verify
```

### Flow 2: Publish an Agent
```
Login → Click "Publish" in nav
    → Fill form:
        Name: "Code Reviewer"
        Slug: "code-reviewer"
        Category: coding
        Tags: review, quality, best-practices
        Provider: anthropic
        Model: claude-sonnet-4-6
        Definition: (paste markdown agent definition)
    → Submit → Redirected to My Agents
    → Agent now appears in marketplace
```

### Flow 3: Review an Agent
```
Browse → Click agent → Scroll to Reviews
    → Click "Write Review"
    → Select 4 stars → Write comment
    → Submit → Review appears, agent rating updates
```

### Flow 4: Update Published Agent
```
My Agents → Click agent → "Edit"
    → Update definition (new system prompt)
    → Bump version to 1.1.0
    → Save → Agent updated in marketplace
```

### Flow 5: CLI Integration (Future)
```
Terminal: thaqicore agent install code-reviewer
    → CLI calls Hub API: GET /marketplace/agents/code-reviewer
    → Downloads definition → Saves to agents/code-reviewer.md
    → "✓ Installed code-reviewer v1.1.0"
```

---

## Agent Definition Format

Agents are published as markdown with YAML frontmatter (same format as thaqicore CLI):

```markdown
---
name: Code Reviewer
role: Code quality and best practices specialist
provider: anthropic
model: claude-sonnet-4-6
parallel: true
triggers:
  keywords: [review, code quality, best practices, PR]
  manual: true
---

## System Prompt
You are a senior code reviewer focused on code quality,
best practices, and identifying potential bugs.

## Knowledge
- read: .memory/semantic/
- read: .memory/procedural/

## Skills
- Review code for bugs and anti-patterns
- Suggest performance improvements
- Enforce team coding standards
```

---

## Categories

| Category | Description | Example Agents |
|----------|-------------|----------------|
| cognitive | Memory maintenance agents | Consolidator, Decay Manager |
| coding | Code writing/review | Code Reviewer, Test Writer |
| research | Information gathering | Web Researcher, Paper Analyzer |
| devops | Infrastructure/deployment | K8s Expert, CI/CD Debugger |
| writing | Content creation | Blog Writer, Documentation |
| data | Data analysis/processing | SQL Expert, Data Visualizer |
| creative | Creative tasks | Brainstormer, Story Writer |
| productivity | Workflow optimization | Task Planner, Meeting Notes |
| security | Security analysis | Vulnerability Scanner, Audit |
| other | Everything else | Custom agents |

---

## Monetization

| Plan | Price | Limits |
|------|-------|--------|
| Free | $0/mo | Browse unlimited, publish up to 3 agents |
| Creator | $5/mo | Publish unlimited agents, analytics dashboard, featured badge |
| Pro | $15/mo | Private/unlisted agents, team sharing, priority support, API access |

### Future Revenue Streams
- Premium agents (paid, author gets 80% revenue share)
- Sponsored/featured agent placements
- Enterprise private marketplace instances

---

## Implementation Priority

### Phase 1: Core Marketplace (MVP)
1. Auth (register/login)
2. Browse page with search, filter, sort
3. Agent detail page
4. Publish form (create agent)
5. Install (copy to clipboard)

### Phase 2: Community
6. Reviews and ratings
7. My Agents management page
8. User profile pages
9. Agent versioning
10. Download tracking

### Phase 3: CLI Integration
11. `thaqicore agent install <slug>` command in core repo
12. API rate limiting
13. Agent validation (lint definitions before publish)
14. Cognitive systems tagging

### Phase 4: Monetization
15. Billing (Stripe) for Creator/Pro plans
16. Premium paid agents
17. Analytics dashboard for creators
18. Featured/sponsored placements
