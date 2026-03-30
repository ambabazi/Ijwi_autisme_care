const { getDb } = require('../database/db');

// The system shall automatically trigger a referral
// if 3 or more "No" responses are recorded in a single screening session.
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

function submitScreening(req, res) {
  const db = getDb();
  const { child_id, responses, notes } = req.body;

  if (!child_id || !responses || !Array.isArray(responses)) {
    return res.status(400).json({ error: 'child_id and responses array are required' });
  }

  const child = db.prepare('SELECT * FROM children WHERE id = ?').get(child_id);
  if (!child) return res.status(404).json({ error: 'Child not found' });

  const ageInMonths = calculateAgeInMonths(child.date_of_birth);
  const noCount = responses.filter(r => r.response === 0).length;
  const status = determineStatus(noCount);

  // Insert screening record
  const screeningResult = db.prepare(
    `INSERT INTO screenings (child_id, conducted_by, age_in_months, result_status, no_count, notes)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(child_id, req.user.id, ageInMonths, status, noCount, notes || null);

  const screeningId = screeningResult.lastInsertRowid;

  // Insert each milestone response
  const insertResponse = db.prepare(
    `INSERT INTO milestone_responses (screening_id, milestone_id, domain, response)
     VALUES (?, ?, ?, ?)`
  );
  const insertMany = db.transaction((items) => {
    for (const r of items) {
      insertResponse.run(screeningId, r.milestone_id, r.domain, r.response);
    }
  });
  insertMany(responses);

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

    const refResult = db.prepare(
      `INSERT INTO referrals (screening_id, child_id, referral_note)
       VALUES (?, ?, ?)`
    ).run(screeningId, child_id, referralNote);

    referral = { id: refResult.lastInsertRowid, note: referralNote };
  }

  res.status(201).json({
    message: 'Screening submitted',
    screening_id: screeningId,
    status,
    no_count: noCount,
    age_in_months: ageInMonths,
    referral
  });
}

function getScreeningsByChild(req, res) {
  const db = getDb();
  const screenings = db.prepare(
    'SELECT * FROM screenings WHERE child_id = ? ORDER BY screening_date DESC'
  ).all(req.params.child_id);
  res.json(screenings);
}

function getScreeningDetail(req, res) {
  const db = getDb();
  const screening = db.prepare('SELECT * FROM screenings WHERE id = ?').get(req.params.id);
  if (!screening) return res.status(404).json({ error: 'Screening not found' });

  const milestones = db.prepare(
    'SELECT * FROM milestone_responses WHERE screening_id = ?'
  ).all(req.params.id);

  res.json({ ...screening, milestones });
}

module.exports = { submitScreening, getScreeningsByChild, getScreeningDetail };