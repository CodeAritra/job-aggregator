import axios from "axios";
import fs from "fs";
import { COMPANIES as companies } from "./companies.js";

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const checkGreenhouse = async (company) => {
    try {
        const url = `https://boards-api.greenhouse.io/v1/boards/${company}/jobs`;
        const res = await axios.get(url);
        return res.data.jobs?.length > 0;
    } catch {
        return false;
    }
};

const checkLever = async (company) => {
    try {
        const url = `https://api.lever.co/v0/postings/${company}?mode=json`;
        const res = await axios.get(url);
        return res.data?.length > 0;
    } catch {
        return false;
    }
};

const checkAshby = async (company) => {
    try {
        const url = `https://jobs.ashbyhq.com/api/non-user-graphql?op=GetJobs`;
        const res = await axios.post(url, {
            query: `
        query {
          jobs(organizationName: "${company}") {
            title
          }
        }
      `
        });
        return res.data?.data?.jobs?.length > 0;
    } catch {
        return false;
    }
};

const checkWorkable = async (company) => {
    try {
        const url = `https://${company}.workable.com/spi/v3/jobs`;
        const res = await axios.get(url);
        return res.data?.jobs?.length > 0;
    } catch {
        return false;
    }
};

const checkSmartRecruiters = async (company) => {
    try {
        const url = `https://api.smartrecruiters.com/v1/companies/${company}/postings`;
        const res = await axios.get(url);

        return res.data?.content?.length > 0;
    } catch {
        return false;
    }
};

const checkCompany = async (company) => {
    const results = await Promise.all([
        checkGreenhouse(company),
        checkLever(company),
        checkAshby(company),
        checkWorkable(company),
        checkSmartRecruiters(company)
    ]);

    const boards = ["Greenhouse", "Lever", "Ashby", "Workable", "SmartRecruiters"];
    const validBoards = boards.filter((_, i) => results[i]);

    return {
        company,
        valid: validBoards.length > 0,
        boards: validBoards
    };
};

const run = async () => {
    const validCompanies = [];

    for (const company of companies) {
        console.log(`Checking: ${company}`);

        const result = await checkCompany(company);

        if (result.valid) {
            console.log(`✅ ${company} → ${result.boards.join(", ")}`);
            validCompanies.push(result);
        } else {
            console.log(`❌ ${company} → no supported boards`);
        }

        await sleep(500); // prevent rate limiting
    }

    console.log("\n🔥 VALID COMPANIES:\n");
    console.log(validCompanies);

    fs.writeFileSync(
        "validCompanies.json",
        JSON.stringify(validCompanies, null, 2)
    );
};

run();



