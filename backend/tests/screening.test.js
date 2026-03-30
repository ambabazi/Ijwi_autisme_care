const request = require('supertest');
const app = require('../server');

describe('Screening referral threshold logic', () => {
  let token;
  let childId;

  beforeAll(async () => {
    const user = {
      name: 'CHW Tester',
      email: `chw${Date.now()}@ijwi.rw`,
      password: 'password123',
      role: 'chw',
      district: 'Musanze'
    };
    const reg = await request(app).post('/api/auth/register').send(user);
    token = reg.body.token;

    const child = await request(app)
      .post('/api/children')
      .set('Authorization', `Bearer ${token}`)
      .send({
        full_name: 'Test Child',
        gender: 'male',
        date_of_birth: '2023-01-01',
        district: 'Musanze',
        consent_given: true
      });
    childId = child.body.child_id;
  });

  test('Should return status "pass" when 0 No responses', async () => {
    const res = await request(app)
      .post('/api/screenings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        child_id: childId,
        responses: [
          { milestone_id: 'M1', domain: 'Motor', response: 1 },
          { milestone_id: 'M2', domain: 'Social', response: 1 }
        ]
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('pass');
    expect(res.body.referral).toBeNull();
  });

  test('Should return status "monitor" when 2 No responses', async () => {
    const res = await request(app)
      .post('/api/screenings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        child_id: childId,
        responses: [
          { milestone_id: 'M1', domain: 'Motor', response: 0 },
          { milestone_id: 'M2', domain: 'Social', response: 0 },
          { milestone_id: 'M3', domain: 'Language', response: 1 }
        ]
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('monitor');
  });

  test('Should auto-generate referral when 3+ No responses', async () => {
    const res = await request(app)
      .post('/api/screenings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        child_id: childId,
        responses: [
          { milestone_id: 'M1', domain: 'Motor', response: 0 },
          { milestone_id: 'M2', domain: 'Social', response: 0 },
          { milestone_id: 'M3', domain: 'Language', response: 0 },
          { milestone_id: 'M4', domain: 'Cognitive', response: 1 }
        ]
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('refer');
    expect(res.body.referral).not.toBeNull();
    expect(res.body.referral.note).toContain('REFERRAL NOTE');
  });
});