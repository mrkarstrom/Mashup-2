import request from 'supertest';
import { app } from '../server.js';

describe('Edge Cases', () => {
  it('should return 400 for a very long MBID', async () => {
    const longMBID = 'a'.repeat(200);
    const res = await request(app).get(`/artist/${longMBID}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'error',
      'This is not a correct MBID, it must be in the type of: xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-12) all digits or letters.'
    );
  });

  it('should return 400 for invalid characters in MBID', async () => {
    const invalidMBID = '0383dadf-2a4e-4d10-****-e9e041da8eb3';
    const res = await request(app).get(`/artist/${invalidMBID}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'error',
      'This is not a correct MBID, it must be in the type of: xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-12) all digits or letters.'
    );
  });
});
