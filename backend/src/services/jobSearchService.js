const REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs";

function normalizeRemotiveJob(job) {
  return {
    id: job.id,
    title: job.title,
    company: job.company_name,
    category: job.category,
    location: job.candidate_required_location,
    jobType: job.job_type,
    url: job.url,
    publishedAt: job.publication_date,
    salary: job.salary || "",
    tags: job.tags || [],
  };
}

export async function searchRemoteJobs(search = "") {
  const url = new URL(REMOTIVE_API_URL);

  if (search.trim()) {
    url.searchParams.set("search", search.trim());
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    const error = new Error(`Remotive request failed with ${response.status}: ${details}`);
    error.status = 502;
    throw error;
  }

  const data = await response.json();

  return {
    source: "Remotive",
    jobs: (data.jobs || []).slice(0, 12).map(normalizeRemotiveJob),
  };
}
