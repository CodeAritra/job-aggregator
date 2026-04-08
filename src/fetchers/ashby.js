import axios from "axios";

export const fetchAshby = async (company) => {
  try {
    const url = `https://api.ashbyhq.com/posting-api/job-board/${company}`;
    const { data } = await axios.get(url);

    return (data.jobs || []).map(job => ({
      title: job.title,
      company,
      location: job.location || "",
      url: job.jobUrl,
      source: "ashby"
    }));
  } catch {
    return [];
  }
};
