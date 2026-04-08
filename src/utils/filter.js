export const isRelevant = (job) => {
  const text = `${job.title} ${job.location}`.toLowerCase();

  const isIntern = /intern|internship/.test(text);
  const isRole = /software|sde|frontend|backend|full.?stack/.test(text);
  const isLocation = /india|remote/.test(text);

  return isIntern && isRole && isLocation;
};