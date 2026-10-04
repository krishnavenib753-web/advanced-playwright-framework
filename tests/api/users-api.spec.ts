import { test, expect } from '../../fixtures/base-test';
import apiPayloads from '../../data/api-payloads.json';

test.describe('API - User Management Endpoints (CRUD)', () => {
  test('TC-API-01: GET /users?page=2 - Should return a paginated list of users', async ({ apiClient }) => {
    const response = await apiClient.get('/users', { page: 2 });
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.page).toBe(2);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toHaveProperty('id');
    expect(body.data[0]).toHaveProperty('email');
    expect(body.data[0]).toHaveProperty('first_name');
  });

  test('TC-API-02: GET /users/2 - Should return single user details', async ({ apiClient }) => {
    const response = await apiClient.get('/users/2');
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe(2);
    expect(body.data.email).toBe('janet.weaver@reqres.in');
  });

  test('TC-API-03: GET /users/23 - Should return 404 for non-existent user', async ({ apiClient }) => {
    const response = await apiClient.get('/users/23');
    expect(response.status()).toBe(404);
  });

  test('TC-API-04: POST /users - Should create a new user record', async ({ apiClient }) => {
    const response = await apiClient.post('/users', apiPayloads.createUser);
    
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.name).toBe(apiPayloads.createUser.name);
    expect(body.job).toBe(apiPayloads.createUser.job);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('createdAt');
  });

  test('TC-API-05: PUT /users/2 - Should update an existing user', async ({ apiClient }) => {
    const response = await apiClient.put('/users/2', apiPayloads.updateUser);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe(apiPayloads.updateUser.name);
    expect(body.job).toBe(apiPayloads.updateUser.job);
    expect(body).toHaveProperty('updatedAt');
  });

  test('TC-API-06: DELETE /users/2 - Should successfully delete user', async ({ apiClient }) => {
    const response = await apiClient.delete('/users/2');
    expect(response.status()).toBe(204);
  });
});
