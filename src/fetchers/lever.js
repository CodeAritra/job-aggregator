import axios from "axios";

export const fetchLever = async (company) => {
  try {
    const url = `https://api.lever.co/v0/postings/${company}?mode=json`;
    const { data } = await axios.get(url);

    return data.map(job => ({
      title: job.text,
      company,
      location: job.categories.location || "",
      url: job.hostedUrl,
      source: "lever"
    }));
  } catch {
    return [];
  }
};