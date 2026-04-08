# 🚀 Job Aggregator

A robust Node.js-based job aggregator that periodically fetches job postings from top companies across various Applicant Tracking Systems (ATS) and notifies you of new, relevant opportunities in real-time.

## features
- **Multi-ATS Integration**: Scrapes and fetches job postings from high-quality platforms including:
  - Greenhouse
  - Lever
  - Ashby
  - Workable
  - SmartRecruiters
- **Company Tracking**: Automatically curates and tracks top product companies (Big Tech, SaaS, Unicorns, FinTech, early-stage YC startups).
- **Automated Scheduling**: Utilizes `node-cron` to periodically pull fresh jobs in the background.
- **Smart Filtering**: Filters out noise to only save jobs that are truly relevant based on custom criteria.
- **Deduplication**: Saves jobs to a PostgreSQL database with an `ON CONFLICT` strategy to ensure you never get notified for the same job twice.
- **Telegram Notifications**: Instantly alerts you via Telegram as soon as a new compatible job goes live.

## Code Structure
- **`src/index.js`**: Express server entry point that also exposes a local `/run` trigger for testing.
- **`src/cron.js`**: Core aggregator loop that schedules fetches for validated companies.
- **`src/fetchers/`**: Domain-specific logic pulling correctly formatted data from each ATS API.
- **`src/utils/`**: Utilities for Telegram notifications, message formatting, job filtering (`isRelevant`), and validating companies against ATS endpoints.

## Prerequisites
- Node.js (v20+)
- PostgreSQL Database
- Telegram Bot Token & Chat ID

## Setup & Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CodeAritra/job-aggregator.git
   cd job-aggregator
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and supply your tokens:
   ```env
   PORT=5000
   DATABASE_URL=postgres://...
   BOT_TOKEN=your_telegram_bot_token
   CHAT_ID=your_telegram_chat_id
   ```

4. **Initialize Companies:**
   Run the utilities to validate which companies exist on which boards.
   ```bash
   node src/utils/checkCompanies.js
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

You can manually trigger a job fetch by navigating to `http://localhost:5000/run`!
