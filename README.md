# thaqicore Hub

Agent Marketplace — discover, share, and install cognitive agents for thaqicore.

## Quick Start

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

```bash
cd frontend
npm install
npm run dev
```

## Features

- Browse agents by category, search, and sort
- Publish your own agents with markdown definitions
- Install agents (copies definition to clipboard)
- Rate and review agents
- User authentication (register/login)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | Create account |
| POST | /auth/login | Login |
| GET | /marketplace/agents | Browse agents |
| GET | /marketplace/agents/:slug | Agent detail |
| POST | /marketplace/agents/:slug/install | Install agent |
| POST | /publish/agent | Publish new agent |
| PUT | /publish/agent/:slug | Update agent |
| DELETE | /publish/agent/:slug | Delete agent |
| POST | /reviews/ | Submit review |
| GET | /reviews/agent/:id | Get reviews |

## Agent Categories

cognitive, coding, research, devops, writing, data, creative, productivity, security, other

## License

MIT
