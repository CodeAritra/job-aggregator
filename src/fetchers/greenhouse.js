import axios from "axios";

export const fetchGreenhouse = async (company) => {
  try {
    const url = `https://boards-api.greenhouse.io/v1/boards/${company}/jobs`;
    const { data } = await axios.get(url);

    return data.jobs.map(job => ({
      title: job.title,
      company,
      location: job.location.name || "",
      url: job.absolute_url,
      source: "greenhouse"
    }));
  } catch {
    return [];
  }
};