import { test, expect } from '../../fixtures/base-test';
import apiPayloads from '../../data/api-payloads.json';

test.describe('API - Authentication & Authorization Endpoints', () => {
  test('TC-API-07: POST /login - Should return authentication token on valid credentials', async ({ apiClient }) => {
    const response = await apiClient.post('/login', apiPayloads.validAuth);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
  });

  test('TC-API-08: POST /login - Should return 400 Bad Request when password is missing', async ({ apiClient }) => {
    const response = await apiClient.post('/login', apiPayloads.invalidAuth);
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toBe('Missing password');
  });
});
