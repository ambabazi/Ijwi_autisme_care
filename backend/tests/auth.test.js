const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  const testUser = {
    name: 'Test Parent',
    email: `test${Date.now()}@ijwi.rw`,
    password: 'password123',
    role: 'parent',
    district: 'Kigali'
  };

  test('POST /api/auth/register — should create a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.role).toBe('parent');
  });

  test('POST /api/auth/register — should reject duplicate email', async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(409);
  });

  test('POST /api/auth/login — should login with correct credentials', async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login — should reject wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword'
    });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/auth/register — should reject missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'x@x.com' });
    expect(res.statusCode).toBe(400);
  });
});