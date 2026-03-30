function validateRegistration(req, res, next) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  const validRoles = ['parent', 'chw', 'health_officer', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  next();
}

function validateChild(req, res, next) {
  const { full_name, gender, date_of_birth, district, consent_given } = req.body;
  if (!full_name || !gender || !date_of_birth || !district) {
    return res.status(400).json({ error: 'All child fields are required' });
  }
  if (!consent_given) {
    return res.status(400).json({ error: 'Guardian consent is required before proceeding' });
  }
  const dob = new Date(date_of_birth);
  const now = new Date();
  const ageMonths = (now - dob) / (1000 * 60 * 60 * 24 * 30);
  if (ageMonths < 0 || ageMonths > 72) {
    return res.status(400).json({ error: 'Child must be between 0 and 72 months (6 years)' });
  }
  next();
}

module.exports = { validateRegistration, validateChild };