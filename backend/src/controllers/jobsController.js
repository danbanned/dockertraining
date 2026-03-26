import { query } from "../config/db.js";

export async function createJobApplication(userId, payload) {
  const { rows } = await query(
    `INSERT INTO job_applications (user_id, company, position, date_applied, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, payload.company, payload.position, payload.dateApplied, payload.status || "Applied", payload.notes || null],
  );
  return rows[0];
}

export async function listJobApplications(userId) {
  const { rows } = await query(
    "SELECT * FROM job_applications WHERE user_id = $1 ORDER BY date_applied DESC NULLS LAST, created_at DESC",
    [userId],
  );
  return rows;
}

export async function updateJobApplication(userId, id, payload) {
  const { rows } = await query(
    `UPDATE job_applications
     SET status = COALESCE($3, status),
         notes = COALESCE($4, notes),
         company = COALESCE($5, company),
         position = COALESCE($6, position)
     WHERE user_id = $1 AND id = $2
     RETURNING *`,
    [userId, id, payload.status || null, payload.notes || null, payload.company || null, payload.position || null],
  );
  return rows[0] || null;
}
