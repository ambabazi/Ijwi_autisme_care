const { query } = require('../database/db');

const REFERRAL_THRESHOLD = 3;

function calculateAgeInMonths(dob) {
  const birth = new Date(dob);
  const now = new Date();
  return Math.floor((now - birth) / (1000 * 60 * 60 * 24 * 30));
}

function determineStatus(noCount) {
  if (noCount >= REFERRAL_THRESHOLD) return 'refer';
  if (noCount === 1 || noCount === 2) return 'monitor';
  return 'pass';
}

async function submitScreening(req, res) {
  try {
    const { child_id, responses, notes } = req.body;

    if (!child_id || !responses || !Array.isArray(responses)) {
      return res.status(400).json({ error: 'child_id and responses array are required' });
    }

    const childResult = await query('SELECT * FROM children WHERE id = $1', [child_id]);
    const child = childResult.rows[0];
    if (!child) return res.status(404).json({ error: 'Child not found' });

    const ageInMonths = calculateAgeInMonths(child.date_of_birth);
    const noCount = responses.filter(r => r.response === 0).length;
    const status = determineStatus(noCount);

    // Insert the screening record
    const screeningResult = await query(
      `INSERT INTO screenings (child_id, conducted_by, age_in_months, result_status, no_count, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [child_id, req.user.id, ageInMonths, status, noCount, notes || null]
    );
    const screeningId = screeningResult.rows[0].id;

    // Insert all milestone responses
    for (const r of responses) {
      await query(
        `INSERT INTO milestone_responses (screening_id, milestone_id, domain, response)
         VALUES ($1,$2,$3,$4)`,
        [screeningId, r.milestone_id, r.domain, r.response]
      );
    }

    // Auto-generate referral if threshold met
    let referral = null;
    if (status === 'refer') {
      const failedMilestones = responses
        .filter(r => r.response === 0)
        .map(r => `- ${r.domain}: ${r.milestone_id}`)
        .join('\n');

      const referralNote =
        `REFERRAL NOTE — Ijwi Autism Care\n` +
        `Child: ${child.full_name} | Age: ${ageInMonths} months\n` +
        `Screening Date: ${new Date().toISOString().split('T')[0]}\n` +
        `Result: ${noCount} milestone(s) not met (threshold: ${REFERRAL_THRESHOLD})\n\n` +
        `Milestones not met:\n${failedMilestones}\n\n` +
        `Please conduct a full professional assessment.`;

      const refResult = await query(
        `INSERT INTO referrals (screening_id, child_id, referral_note) VALUES ($1,$2,$3) RETURNING id`,
        [screeningId, child_id, referralNote]
      );

      referral = { id: refResult.rows[0].id, note: referralNote };
    }

    res.status(201).json({
      message: 'Screening submitted',
      screening_id: screeningId,
      status,
      no_count: noCount,
      age_in_months: ageInMonths,
      referral
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getScreeningsByChild(req, res) {
  try {
    const result = await query(
      'SELECT * FROM screenings WHERE child_id = $1 ORDER BY screening_date DESC',
      [req.params.child_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getScreeningDetail(req, res) {
  try {
    const screeningResult = await query(
      'SELECT * FROM screenings WHERE id = $1', [req.params.id]
    );
    const screening = screeningResult.rows[0];
    if (!screening) return res.status(404).json({ error: 'Screening not found' });

    const milestonesResult = await query(
      'SELECT * FROM milestone_responses WHERE screening_id = $1', [req.params.id]
    );
    res.json({ ...screening, milestones: milestonesResult.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// District health officer stats
async function getStats(req, res) {
  try {
    const totals = await query(`
      SELECT
        COUNT(DISTINCT c.id) AS total_children,
        COUNT(DISTINCT s.id) AS total_screenings,
        COUNT(DISTINCT r.id) AS total_referrals,
        COUNT(DISTINCT CASE WHEN s.result_status = 'refer' THEN s.id END) AS refer_count,
        COUNT(DISTINCT CASE WHEN s.result_status = 'monitor' THEN s.id END) AS monitor_count,
        COUNT(DISTINCT CASE WHEN s.result_status = 'pass' THEN s.id END) AS pass_count
      FROM children c
      LEFT JOIN screenings s ON s.child_id = c.id
      LEFT JOIN referrals r ON r.child_id = c.id
    `);

    const byDistrict = await query(`
      SELECT c.district, COUNT(DISTINCT c.id) AS children,
             COUNT(DISTINCT r.id) AS referrals
      FROM children c
      LEFT JOIN referrals r ON r.child_id = c.id
      GROUP BY c.district
      ORDER BY referrals DESC
    `);

    res.json({ totals: totals.rows[0], by_district: byDistrict.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  submitScreening,
  getScreeningsByChild,
  getScreeningDetail,
  getStats
};