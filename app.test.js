const request = require('supertest');
const app = require('./app');
const tracksController = require('./controllers/tracksController');

beforeAll(async () => {
    await tracksController.getToken();
  });

describe('GET /', () => {
  it('token from Spotify', async () => {
    const response = await request(app)
      .get('/api/token')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(404);
  });
});
