import axios from "axios";

export const fetchWorkable = async (company) => {
  try {
    const url = `https://apply.workable.com/api/v3/accounts/${company}/jobs`;
    const { data } = await axios.post(url, {
      query: "", location: [], department: [], worktype: [], remote: []
    });

    return (data.results || []).map(job => ({
      title: job.title,
      company,
      location: job.location?.city ? `${job.location.city}, ${job.location.country}` : (job.location?.country || ""),
      url: job.shortlink,
      source: "workable"
    }));
  } catch {
    return [];
  }
};
