import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * ApiClient wraps Playwright's APIRequestContext with clean, reusable
 * methods for REST API interactions and assertions.
 */
export class ApiClient {
  readonly request: APIRequestContext;
  readonly baseURL: string;

  constructor(request: APIRequestContext, baseURL: string = 'https://reqres.in/api') {
    this.request = request;
    this.baseURL = baseURL;
  }

  async get(endpoint: string, params?: Record<string, string | number>): Promise<APIResponse> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    return await this.request.get(url, { params });
  }

  async post(endpoint: string, data?: unknown): Promise<APIResponse> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    return await this.request.post(url, { data });
  }

  async put(endpoint: string, data?: unknown): Promise<APIResponse> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    return await this.request.put(url, { data });
  }

  async delete(endpoint: string): Promise<APIResponse> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    return await this.request.delete(url);
  }
}
