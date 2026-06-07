# ResumeMatch AI

ResumeMatch AI is a free, full-stack resume analysis application. Users create
an account, upload a PDF, DOCX, or TXT resume, paste a job description, and
receive ATS-style scoring, skill-gap analysis, semantic matching, and
structured improvement suggestions.

Accounts are used only for authentication and private analysis history. There
are no paid plans, analysis quotas, payment endpoints, or premium features.

## Features

- Unlimited free resume analyses
- JWT registration, login, and protected account routes
- Private analysis history scoped to the authenticated user
- PDF, DOCX, and TXT parsing without permanent file storage
- Technical skill extraction and missing-skill detection
- ATS score with a detailed weighted breakdown
- Semantic similarity with a fast local fallback
- OpenAI provider abstraction with rule-based fallback
- Persistent English and Turkish interface
- Docker Compose setup with PostgreSQL

## Stack

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS

**Backend:** FastAPI, Python 3.12, SQLAlchemy 2, Pydantic 2, JWT, Argon2

**Data:** PostgreSQL 16

**Analysis:** PyMuPDF, python-docx, sentence-transformers, rule-based NLP

## Architecture

```text
resume-match-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── migrations/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

Uploaded resume files are read into memory, parsed, and discarded. The
analysis result and submitted job description are stored for the user's
private history.

## Analysis Pipeline

1. Verify the JWT.
2. Validate the file type and size.
3. Parse and clean the resume and job description.
4. Extract skills from both texts.
5. Calculate matched, missing, and additional skills.
6. Calculate skill match and semantic similarity.
7. Build the weighted ATS score.
8. Generate English or Turkish feedback.
9. Save the report to the authenticated user's history.

## API

| Method | Endpoint | Auth | Description |
|---|---|---:|---|
| POST | `/auth/register` | No | Create an account |
| POST | `/auth/login` | No | Return a JWT |
| GET | `/auth/me` | Yes | Return the current user |
| GET | `/user/profile` | Yes | Return profile details |
| GET | `/user/stats` | Yes | Return completed analysis count |
| POST | `/analysis/analyze` | Yes | Analyze a resume |
| GET | `/analysis/history` | Yes | Return owned reports |
| GET | `/analysis/{analysis_id}` | Yes | Return one owned report |
| GET | `/health` | No | Service health check |

API documentation is available at `http://localhost:8000/docs`.

## Database Models

### User

`id`, `name`, unique `email`, `password_hash`, `created_at`

### AnalysisResult

`id`, `user_id`, `resume_filename`, `job_description`, `resume_skills`,
`job_skills`, `matched_skills`, `missing_skills`, `extra_resume_skills`,
`skill_match_score`, `semantic_similarity_score`, `ats_score`,
`ats_breakdown`, `ai_feedback`, `created_at`

## Existing Database Cleanup

Older installations may still have unused freemium columns in the `users`
table. They do not affect the application. To remove them while preserving
accounts and analysis history:

```powershell
Get-Content backend/migrations/001_remove_freemium.sql |
  docker compose exec -T db psql -U resumematch -d resumematch
```

## Environment

Copy the example file:

```powershell
Copy-Item .env.example .env
```

Important variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | SQLAlchemy database connection |
| `JWT_SECRET_KEY` | JWT signing secret |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access-token lifetime |
| `OPENAI_API_KEY` | Optional backend-only OpenAI key |
| `ENABLE_EMBEDDING_MODEL` | Enables sentence-transformers |
| `NEXT_PUBLIC_API_URL` | Browser-accessible backend URL |

## Run with Docker

```powershell
docker compose down
docker compose up --build
```

Open:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

The default configuration uses fast lexical similarity so the first analysis
does not wait for a model download. Set `ENABLE_EMBEDDING_MODEL=true` to use
sentence-transformers after installing `backend/requirements-ml.txt`.

## Production Deployment

Follow [DEPLOYMENT.md](DEPLOYMENT.md) to deploy the frontend, backend, and
PostgreSQL database on Railway.

## Security

- Passwords are hashed with Argon2.
- Protected routes require a signed JWT.
- History and report queries are always scoped by `user_id`.
- Uploaded files are validated and not permanently stored.
- AI API keys stay in backend environment variables.

## Suggested Improvements

- Side-by-side comparison of multiple job descriptions
- Resume bullet rewriter with before/after approval
- PDF report export
- Application tracker with status and notes
- Resume version management
- Job-description library and favorites
- Trend charts across past analyses
- OCR support for scanned PDFs
- Email verification and password reset
- Account and analysis deletion controls
