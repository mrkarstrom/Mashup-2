import request from 'supertest';
import { app } from '../index.js';

describe('Integration Tests', () => {
  it('should handle 404 for non-existent routes', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.body).toHaveProperty('error', 'Not found');
  });
});
