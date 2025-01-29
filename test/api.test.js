import request from 'supertest';
import { app } from '../server.js';

describe('Artist API', () => {
  it('should return 400 if no MBID is provided', async () => {
    const res = await request(app).get('/artist/');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'MBID is required');
  });

  it('should return 400 for a malformed MBID', async () => {
    const res = await request(app).get('/artist/12345');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'error',
      'This is not a correct MBID, it must be in the type of: xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-12) all digits or letters.'
    );
  });
});
