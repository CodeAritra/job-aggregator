import axios from "axios";

export const fetchSmartRecruiters = async (company) => {
  try {
    const url = `https://api.smartrecruiters.com/v1/companies/${company}/postings`;
    const { data } = await axios.get(url);

    return (data.content || []).map(job => {
      const city = job.location?.city || "";
      const country = job.location?.country || "";
      const location = [city, country].filter(Boolean).join(", ");

      return {
        title: job.name,
        company,
        location,
        url: `https://jobs.smartrecruiters.com/${company}/${job.id}`,
        source: "smartrecruiters"
      };
    });
  } catch {
    return [];
  }
};
