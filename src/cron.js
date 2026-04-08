import cron from "node-cron";
import { pool } from "./db.js";
import { fetchGreenhouse } from "./fetchers/greenhouse.js";
import { fetchLever } from "./fetchers/lever.js";
import { fetchAshby } from "./fetchers/ashby.js";
import { fetchWorkable } from "./fetchers/workable.js";
import { fetchSmartRecruiters } from "./fetchers/smartrecruiters.js";
import { isRelevant } from "./utils/filter.js";
import { sendTelegram } from "./utils/telegram.js";
import { formatMessage } from "./utils/formatter.js";
import companies from "./validCompanies.json" with { type: "json" };

// const COMPANIES = ["stripe", "notion", "razorpay"];

const saveAndNotify = async (job) => {
  const result = await pool.query(
    `INSERT INTO jobs (title, company, location, url, source)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (url) DO NOTHING
     RETURNING *`,
    [job.title, job.company, job.location, job.url, job.source]
  );

  if (result.rowCount > 0) {
    await sendTelegram(formatMessage(job));
  } else {
    console.log(`Job already exists in DB: ${job.title}`);
  }
};

const fetchJobs = async (companyData) => {
  const { company, boards } = companyData;

  let jobs = [];

  if (boards.includes("Greenhouse")) {
    jobs.push(...await fetchGreenhouse(company));
  }

  if (boards.includes("Lever")) {
    jobs.push(...await fetchLever(company));
  }

  if (boards.includes("SmartRecruiters")) {
    jobs.push(...await fetchSmartRecruiters(company));
  }

  return jobs;
};

const runAggregator = async () => {
  console.log("Running job fetch...");

  for (const company of companies) {
    const jobs = await fetchJobs(company);

    if (jobs.length === 0) {
      console.log(`No jobs found for ${company.company}`);
      continue;
    }

    for (const job of jobs) {
      if (isRelevant(job)) {
        await saveAndNotify(job);
      } else {
        console.log(`No relevant job found`);
      }
    }
  }
};

cron.schedule("0 */4 * * *", runAggregator);

export default runAggregator;