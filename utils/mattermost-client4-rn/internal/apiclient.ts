export type ClientHeaders = Record<string, string>;
export type RequestOptions = {
  headers?: ClientHeaders;
  body?: Record<string, unknown> | string;
};
export type ClientResponse = {
  headers?: Headers;
  data?: Record<string, unknown>;
  code: number;
  ok: boolean;
};

export function getOrCreateAPIClient(url: string) {
  return { client: new APIClient(url), created: true };
}
export interface APIClientInterface {
  baseUrl: string;

  head(endpoint: string, options?: RequestOptions): Promise<ClientResponse>;
  get(endpoint: string, options?: RequestOptions): Promise<ClientResponse>;
  put(endpoint: string, options?: RequestOptions): Promise<ClientResponse>;
  post(endpoint: string, options?: RequestOptions): Promise<ClientResponse>;
  patch(endpoint: string, options?: RequestOptions): Promise<ClientResponse>;
  delete(endpoint: string, options?: RequestOptions): Promise<ClientResponse>;
}

export class APIClient {
  baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  head(endpoint: string, options?: RequestOptions): Promise<ClientResponse> {
    return this.runFetch("head", endpoint, options);
  }
  get(endpoint: string, options?: RequestOptions): Promise<ClientResponse> {
    return this.runFetch("get", endpoint, options);
  }
  put(endpoint: string, options?: RequestOptions): Promise<ClientResponse> {
    return this.runFetch("put", endpoint, options);
  }
  post(endpoint: string, options?: RequestOptions): Promise<ClientResponse> {
    return this.runFetch("post", endpoint, options);
  }
  patch(endpoint: string, options?: RequestOptions): Promise<ClientResponse> {
    return this.runFetch("patch", endpoint, options);
  }
  delete(endpoint: string, options?: RequestOptions): Promise<ClientResponse> {
    return this.runFetch("delete", endpoint, options);
  }
  private async runFetch(
    method: string,
    endpoint: string,
    options?: RequestOptions,
  ): Promise<ClientResponse> {
    let body: RequestInit["body"];
    let headers = { ...options?.headers };
    switch (typeof options?.body) {
      case "string":
        body = options.body;
        headers["Content-Type"] = "text/plain";
        break;
      case "object":
        if (options.body instanceof FormData) {
          body = options.body;
          headers["Content-Type"] = "multipart/form-data";
        } else if (options.body !== null) {
          body = JSON.stringify(options.body);
          headers["Content-Type"] = "application/json";
        }
        break;
    }
    const res = await fetch(endpoint, {
      method,
      headers: options?.headers,
      body,
    });
    const resContentType = res.headers.get("Content-Type");
    let data: ClientResponse["data"];
    if (resContentType == "application/json") {
      data = await res.json();
    }

    return {
      headers: res.headers,
      data,
      code: res.status,
      ok: res.ok,
    };
  }
}
