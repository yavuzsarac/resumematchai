# ResumeMatch AI

ResumeMatch AI is a full-stack resume analysis platform that compares resumes with job descriptions and generates ATS-style scores, skill-gap analysis, semantic matching results, and structured improvement suggestions.

Users can create an account, upload a PDF, DOCX, or TXT resume, paste a job description, and view their private analysis history.

The project is designed as a free resume analysis tool. There are no paid plans, payment endpoints, quotas, or premium-only features.

---

## Features

- User registration and login
- JWT-based authentication
- Protected account routes
- Private analysis history for each authenticated user
- Resume upload support for PDF, DOCX, and TXT files
- Resume parsing without permanent file storage
- Job description comparison
- Technical skill extraction
- Missing skill detection
- ATS-style score calculation
- Weighted score breakdown
- Semantic similarity scoring
- Fast rule-based fallback for analysis
- Optional OpenAI integration
- English and Turkish interface support
- Docker Compose setup with PostgreSQL

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- JWT Authentication
- Argon2 password hashing

### Database

- PostgreSQL

### Analysis

- PyMuPDF
- python-docx
- sentence-transformers
- Rule-based NLP fallback
- Optional OpenAI API integration

---

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
├── README.md
└── .env.example
How It Works
The user creates an account or logs in.
The frontend sends authenticated requests using a JWT.
The user uploads a resume and provides a job description.
The backend validates the file type and size.
The resume is parsed and cleaned in memory.
Skills are extracted from both the resume and the job description.
Matched, missing, and additional skills are calculated.
Skill match and semantic similarity scores are generated.
A weighted ATS-style score is calculated.
Feedback is generated in English or Turkish.
The analysis result is saved to the user's private history.

Uploaded resume files are not permanently stored. Files are read into memory, parsed, and discarded after analysis.

API Endpoints
Method	Endpoint	Auth Required	Description
POST	/auth/register	No	Create a new account
POST	/auth/login	No	Login and receive a JWT
GET	/auth/me	Yes	Return the current user
GET	/user/profile	Yes	Return profile details
GET	/user/stats	Yes	Return user analysis stats
POST	/analysis/analyze	Yes	Analyze a resume
GET	/analysis/history	Yes	Return the user's analysis history
GET	/analysis/{analysis_id}	Yes	Return a specific owned analysis
GET	/health	No	Backend health check

API documentation is available locally at:

http://localhost:8000/docs
Database Models
User
id
name
email
password_hash
created_at
AnalysisResult
id
user_id
resume_filename
job_description
resume_skills
job_skills
matched_skills
missing_skills
extra_resume_skills
skill_match_score
semantic_similarity_score
ats_score
ats_breakdown
ai_feedback
created_at
Environment Variables

Create a local .env file from the example file:

Copy-Item .env.example .env

Example .env.example:

APP_ENV=development
DATABASE_URL=postgresql+psycopg://resumematch:resumematch@db:5432/resumematch
JWT_SECRET_KEY=replace-with-a-long-random-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
MAX_UPLOAD_SIZE_MB=8
EMBEDDING_MODEL_NAME=all-MiniLM-L6-v2
ENABLE_EMBEDDING_MODEL=false
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

Important variables:

Variable	Description
APP_ENV	Application environment
DATABASE_URL	PostgreSQL connection string
JWT_SECRET_KEY	Secret key used for signing JWT tokens
JWT_ALGORITHM	JWT signing algorithm
ACCESS_TOKEN_EXPIRE_MINUTES	Access token lifetime
FRONTEND_URL	Frontend application URL
CORS_ORIGINS	Allowed frontend origins for CORS
MAX_UPLOAD_SIZE_MB	Maximum uploaded resume file size
EMBEDDING_MODEL_NAME	Sentence-transformers model name
ENABLE_EMBEDDING_MODEL	Enables semantic embedding model
OPENAI_API_KEY	Optional OpenAI API key
OPENAI_MODEL	OpenAI model name

Do not commit real .env files or production secrets to GitHub.

Run Locally with Docker

Start the application:

docker compose up --build

Open:

Frontend: http://localhost:3000
Backend:  http://localhost:8000
API Docs: http://localhost:8000/docs

Stop the application:

docker compose down
Run Backend Manually

From the backend folder:

cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload

Backend runs at:

http://localhost:8000
Run Frontend Manually

From the frontend folder:

cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:3000
Optional Semantic Model

By default, the application can use a fast local fallback for similarity scoring.

To enable the sentence-transformers model:

ENABLE_EMBEDDING_MODEL=true

Then install the additional ML dependencies:

cd backend
pip install -r requirements-ml.txt
Existing Database Cleanup

Older local installations may include unused freemium-related columns in the users table.

To remove them while preserving users and analysis history:

Get-Content backend/migrations/001_remove_freemium.sql |
  docker compose exec -T db psql -U resumematch -d resumematch
Deployment Status

Live deployment is currently being configured.

The planned production architecture is:

Frontend: Vercel
Backend: Render or another FastAPI-compatible hosting service
Database: PostgreSQL
Security Notes
Passwords are hashed with Argon2.
Protected routes require a valid signed JWT.
User history and reports are scoped by user_id.
Uploaded files are validated before parsing.
Uploaded resume files are not permanently stored.
API keys and secrets must stay in backend environment variables.
Real .env files must not be committed to GitHub.
Suggested Improvements
Live production deployment
Screenshots and demo video
PDF report export
Resume bullet rewriting suggestions
Side-by-side comparison for multiple job descriptions
Resume version management
Job description library and favorites
Trend charts across past analyses
OCR support for scanned PDFs
Email verification
Password reset
Account deletion
Analysis deletion controls
Project Status

This project is under active development and is intended as a full-stack AI-focused portfolio project.

The main goal is to demonstrate practical skills in:

Full-stack web development
REST API design
Authentication
PostgreSQL integration
Resume parsing
NLP-based text comparison
AI-assisted feedback generation
