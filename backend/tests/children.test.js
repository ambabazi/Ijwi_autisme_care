const request = require('supertest');
const app = require('../server');

describe('Children API', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Parent Tester',
      email: `parent${Date.now()}@ijwi.rw`,
      password: 'password123',
      role: 'parent',
      district: 'Gasabo'
    });
    token = res.body.token;
  });

  test('POST /api/children — should register a child with consent', async () => {
    const res = await request(app)
      .post('/api/children')
      .set('Authorization', `Bearer ${token}`)
      .send({
        full_name: 'Amina Test',
        gender: 'female',
        date_of_birth: '2023-06-01',
        district: 'Gasabo',
        consent_given: true
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('child_id');
  });

  test('POST /api/children — should reject missing consent', async () => {
    const res = await request(app)
      .post('/api/children')
      .set('Authorization', `Bearer ${token}`)
      .send({
        full_name: 'No Consent Child',
        gender: 'male',
        date_of_birth: '2023-01-01',
        district: 'Kicukiro',
        consent_given: false
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/consent/i);
  });

  test('GET /api/children — should return list of children', async () => {
    const res = await request(app)
      .get('/api/children')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/children — should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/children');
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/children — should reject child older than 72 months', async () => {
    const res = await request(app)
      .post('/api/children')
      .set('Authorization', `Bearer ${token}`)
      .send({
        full_name: 'Too Old Child',
        gender: 'male',
        date_of_birth: '2015-01-01',
        district: 'Huye',
        consent_given: true
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/72 months/i);
  });
});