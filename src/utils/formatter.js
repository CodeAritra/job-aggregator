export const formatMessage = (job) => {
  return `
🚀 ${job.title}
🏢 ${job.company}
📍 ${job.location}

👉 ${job.url}
`;
};