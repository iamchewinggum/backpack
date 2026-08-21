const request = require('supertest');
const app = require('../app');


const pool = require('../db');

// unique email each run so signup doesn't collide with an existing row
const testEmail = `test-${Date.now()}@example.com`;
const testPassword = 'testpassword123';


//container that groups related tests
describe('Backpack API', () => {


  afterAll(async () => {
    await pool.end();
  });





    //async because HTTP request take time
  test('GET / returns the health check', async () => {

    const res = await request(app).get('/');

    expect(res.statusCode).toBe(200);

    expect(res.text).toContain('alive');
  });






  test('GET /backpack without a token returns 401', async () => {
    const res = await request(app).get('/backpack');

    expect(res.statusCode).toBe(401);
  });





  test('POST /signup creates a new user', async () => {
    const res = await request(app)
      .post('/signup')

      .send({ email: testEmail, password: testPassword });

    expect(res.statusCode).toBe(201);
  });







  test('POST /login returns a token', async () => {
    const res = await request(app)
      .post('/login')

      .send({ email: testEmail, password: testPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});