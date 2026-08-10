# 🤖 AI Merge Request Reviewer

An AI-powered automated code review system that reviews GitHub Pull Requests using **GitHub Webhooks, NestJS, PostgreSQL, TypeORM, and a locally hosted LLM through Ollama**.

Whenever a Pull Request is created or updated, the system automatically receives the GitHub webhook, fetches the changed files and code patches, sends them to an AI model for review, stores the review results in PostgreSQL, and publishes the findings back to GitHub as inline Pull Request review comments.

---

## 🚀 Features

* 🔔 GitHub Pull Request webhook integration
* 📂 Automatic detection of changed files
* 🔍 GitHub Pull Request diff retrieval
* 🤖 AI-powered code review using Ollama
* 🧠 Local LLM execution without external paid AI APIs
* 📝 Structured AI review responses using JSON
* ⭐ Overall code quality score
* 🚨 Severity-based findings:

  * LOW
  * MEDIUM
  * HIGH
  * CRITICAL
* 💡 Suggested code improvements
* 🗄️ PostgreSQL database persistence
* 🔄 Automatic update handling for existing Pull Requests
* 📊 Review and review-comment persistence
* 📍 Inline comments directly on changed GitHub lines
* 📚 Swagger API documentation
* 🧩 Modular NestJS architecture
* 🔐 GitHub API authentication using access tokens

---

## 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │     GitHub       │
                    │   Pull Request   │
                    └────────┬─────────┘
                             │
                             │ Webhook
                             ▼
                    ┌──────────────────┐
                    │  Webhook Module  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Github Service  │
                    └────────┬─────────┘
                             │
              ┌──────────────┼───────────────┐
              │              │               │
              ▼              ▼               ▼
       Repository       Pull Request     GitHub API
        Service           Service       Changed Files
              │              │               │
              ▼              ▼               │
        PostgreSQL       PostgreSQL           │
                                              ▼
                                      ┌──────────────┐
                                      │  LLM Service │
                                      │    Ollama    │
                                      └──────┬───────┘
                                             │
                                             ▼
                                      AI Review Result
                                             │
                                             ▼
                                      ┌──────────────┐
                                      │Review Service│
                                      └──────┬───────┘
                                             │
                                             ▼
                                        PostgreSQL
                                             │
                                             ▼
                                      GitHub PR Review
                                             │
                                             ▼
                                    📍 Inline Comments
```

---

## 🔄 Application Flow

### 1. Pull Request Created

A developer creates or updates a Pull Request on GitHub.

The GitHub webhook sends the Pull Request event to the NestJS application.

Supported events:

```text
opened
synchronize
reopened
```

Other Pull Request events are ignored.

---

### 2. Repository Information

The application extracts repository information from the GitHub webhook payload.

The repository is checked in PostgreSQL using the GitHub repository ID.

If it does not exist, a new repository record is created.

---

### 3. Pull Request Information

The Pull Request information is stored in the `pull_requests` table.

The system checks whether the Pull Request already exists.

Existing Pull Requests are updated when new commits are pushed.

---

### 4. Fetch Changed Files

The application calls the GitHub REST API:

```text
GET /repos/{owner}/{repo}/pulls/{pull_number}/files
```

The system extracts:

```text
File name
Programming language
Git patch
Additions
Deletions
```

Only files containing a Git patch are sent for AI review.

---

### 5. AI Code Review

The changed code is sent to a locally running LLM through Ollama.

The model receives:

```text
File name
Language
Git diff
Review instructions
```

The AI evaluates the changes for:

* Bugs
* Security vulnerabilities
* Performance problems
* Error handling
* Database/query issues
* Backend/API design issues
* Runtime problems
* Meaningful maintainability issues

The AI returns structured JSON.

Example:

```json
{
  "summary": "The change introduces a potential SQL injection vulnerability.",
  "overallScore": 45,
  "status": "COMPLETED",
  "comments": [
    {
      "fileName": "src/user/user.service.ts",
      "lineNumber": 25,
      "severity": "CRITICAL",
      "comment": "User input is directly interpolated into the SQL query.",
      "suggestedCode": "Use parameterized queries instead."
    }
  ]
}
```

---

### 6. Store Review

The AI review is stored in PostgreSQL.

The application stores:

```text
Review
├── Pull Request
├── Summary
├── Overall Score
└── Status
```

Individual findings are stored separately:

```text
Review Comment
├── Review
├── File Name
├── Line Number
├── Severity
├── Comment
└── Suggested Code
```

---

### 7. GitHub Inline Review

After the review is saved, the application creates a GitHub Pull Request review.

AI findings are mapped to the corresponding changed files and lines.

The result appears directly inside GitHub's **Files changed** section.

Example:

```text
src/auth/auth.service.ts

Line 42

🔴 CRITICAL

User-controlled input is directly used in the SQL query.

Suggested Code:
Use a parameterized query.
```

---

# 🗄️ Database Design

The application currently uses PostgreSQL with TypeORM.

### Repositories

Stores GitHub repository information.

```text
repositories
├── repo_id
├── githubrepo_id
├── owner
├── name
├── default_batch
├── is_active
├── created_at
└── updated_at
```

### Pull Requests

Stores Pull Request information.

```text
pull_requests
├── id
├── githubPrId
├── repositoryId
├── prNumber
├── title
├── description
├── author
├── sourceBranch
├── targetBranch
├── state
├── merged
├── createdAt
└── updatedAt
```

### Reviews

Stores AI review results.

```text
reviews
├── id
├── pullRequestId
├── summary
├── overallScore
├── status
└── createdAt
```

### Review Comments

Stores individual AI findings.

```text
review_comments
├── id
├── reviewId
├── fileName
├── lineNumber
├── severity
├── comment
├── suggestedCode
└── createdAt
```

---

# 🧩 Project Structure

```text
src/
│
├── auth/
│
├── common/
│   ├── messages/
│   └── utils/
│
├── config/
│
├── database/
│
├── github/
│   ├── github.controller.ts
│   ├── github.module.ts
│   └── github.service.ts
│
├── llm/
│   ├── code-review.interface.ts
│   ├── llm.module.ts
│   └── llm.service.ts
│
├── pull-request/
│   ├── entities/
│   ├── pull-request.module.ts
│   └── pull-request.service.ts
│
├── repository/
│   ├── entities/
│   ├── repository.module.ts
│   └── repository.service.ts
│
├── review/
│   ├── entities/
│   ├── review.controller.ts
│   ├── review.module.ts
│   └── review.service.ts
│
├── webhook/
│   ├── webhook.controller.ts
│   ├── webhook.module.ts
│   └── webhook.service.ts
│
├── app.module.ts
└── main.ts
```

---

# 🛠️ Tech Stack

| Technology                  | Purpose                            |
| --------------------------- | ---------------------------------- |
| NestJS                      | Backend framework                  |
| TypeScript                  | Application development            |
| PostgreSQL                  | Database                           |
| TypeORM                     | Database ORM                       |
| GitHub Webhooks             | Pull Request event handling        |
| GitHub REST API             | Pull Request and review operations |
| Ollama                      | Local LLM runtime                  |
| DeepSeek Coder / Qwen Coder | AI code review                     |
| Axios                       | HTTP requests                      |
| Swagger                     | API documentation                  |
| ngrok                       | Local webhook development          |
| Git                         | Version control                    |

---

# ⚙️ Prerequisites

Make sure the following are installed:

* Node.js
* npm
* PostgreSQL
* Git
* Ollama
* ngrok

---

# 📥 Installation

Clone the repository:

```bash
git clone https://github.com/Rahul582001/AI-Merge-Request-Reviewer.git
```

Navigate into the project:

```bash
cd AI-Merge-Request-Reviewer
```

Install dependencies:

```bash
npm install
```

---

# 🤖 Ollama Setup

Start Ollama.

If Ollama is already running in the background, no additional command is required.

Check installed models:

```bash
ollama list
```

Download the coding model if required:

```bash
ollama pull deepseek-coder:6.7b
```

Or use the model configured in your environment.

Test the model:

```bash
ollama run deepseek-coder:6.7b
```

The default Ollama API runs on:

```text
http://localhost:11434
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=ai_mrr

GITHUB_API=https://api.github.com
GITHUB_TOKEN=your_github_token

OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=deepseek-coder:6.7b
```

### Important

Never commit your actual `.env` file.

Add it to `.gitignore`:

```text
.env
```

You can provide an `.env.example` file containing placeholder values.

---

# 🐘 PostgreSQL Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE ai_mrr;
```

Update the database credentials in `.env`.

The application uses TypeORM for database operations.

During development, database synchronization can automatically create the required tables.

---

# 🔗 GitHub Webhook Setup

Start the NestJS application:

```bash
npm run start:dev
```

Start ngrok:

```bash
ngrok http 3000
```

Copy the HTTPS forwarding URL generated by ngrok.

For example:

```text
https://example.ngrok-free.app
```

Configure the GitHub webhook:

```text
Repository
    ↓
Settings
    ↓
Webhooks
    ↓
Add webhook
```

Set the Payload URL to your webhook endpoint.

Example:

```text
https://example.ngrok-free.app/webhook/github
```

Set:

```text
Content type:
application/json
```

Enable:

```text
Pull requests
```

---

# ▶️ Running the Application

Start the NestJS application:

```bash
npm run start:dev
```

Start ngrok:

```bash
ngrok http 3000
```

Make sure Ollama is running locally.

The application is now ready to process Pull Requests.

---

# 📚 Swagger

Swagger documentation is available through the configured Swagger endpoint.

For local development:

```text
http://localhost:3000/api
```

> Update the path above if the Swagger path configured in `main.ts` is different.

---

# 🧪 Testing the System

Create a feature branch:

```bash
git checkout -b feature/test-ai-review
```

Make a code change.

Commit the change:

```bash
git add .
git commit -m "test AI code review"
```

Push the branch:

```bash
git push -u origin feature/test-ai-review
```

Create a Pull Request:

```text
feature/test-ai-review
        ↓
      develop
```

GitHub will send the Pull Request webhook.

The application will automatically:

```text
Receive webhook
      ↓
Save repository
      ↓
Save Pull Request
      ↓
Fetch changed files
      ↓
Send diff to Ollama
      ↓
Generate AI review
      ↓
Save review
      ↓
Save review comments
      ↓
Create GitHub Pull Request review
      ↓
Add inline comments
```

---

# 📊 Example Review

The AI can identify issues such as:

```text
🔴 CRITICAL
SQL Injection

The query directly interpolates user-controlled input.

Suggested Code:
Use a parameterized query.
```

Or:

```text
🟠 HIGH
Security Issue

Sensitive information is being stored without appropriate protection.
```

Or when the change is valid:

```text
Overall Score: 95/100

No meaningful issues were identified.
```

---

# 🔒 Security Considerations

The current project uses a GitHub access token to communicate with the GitHub API.

For production deployment, the following should be added/improved:

* GitHub webhook signature verification
* Secure secret management
* Token rotation
* Request validation
* Rate-limit handling
* Authentication and authorization
* Input validation
* LLM prompt-injection protection
* Production database migrations
* HTTPS deployment

---

# 🚧 Current Limitations

The current version is designed as an MVP and portfolio project.

Current limitations include:

* File-level AI review rather than complete repository-level understanding
* Local Ollama model performance depends on available hardware
* AI-generated line numbers can occasionally require validation against the GitHub diff
* Webhook processing is currently synchronous
* No distributed job queue
* Limited review history
* No production deployment configuration yet

---

# 🔮 Future Improvements

Possible future enhancements:

* GitHub webhook signature verification
* Background job processing using BullMQ/Redis
* Review history and analytics
* Repository-level code context
* RAG for repository documentation and coding standards
* Support for multiple LLM providers
* Automatic review status checks
* Review dashboard
* Authentication and user management
* Docker deployment
* CI/CD pipeline
* Automated unit and integration tests
* Support for multiple Git providers

---

# 🎯 Project Objective

The primary objective of this project is to automate the initial code-review process for Pull Requests using an AI model while integrating directly with the existing GitHub development workflow.

Instead of manually checking every changed file, developers receive automated feedback directly inside their Pull Request.

---

# 👨‍💻 Author

**Rahul Padidhela**

Backend Developer | NestJS | TypeScript | PostgreSQL

GitHub: `Rahul582001`

---

## ⭐ Project Highlights

> **GitHub Webhooks + NestJS + PostgreSQL + TypeORM + Ollama + AI Code Review + GitHub Inline Reviews**

This project demonstrates an event-driven backend system that integrates an AI coding model into a real-world software development workflow.
