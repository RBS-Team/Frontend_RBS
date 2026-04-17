const API_URL = import.meta.env.VITE_API_URL as string;
export let csrfToken = "";

const safeMethods = {
    GET: "GET",
    OPTIONS: "OPTIONS",
} as const;

export async function fetchCSRFToken(): Promise<void> {
    const res = await fetch(`${API_URL}/csrf-token`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) throw new Error("Не удалось получить CSRF токен");

    const data = await res.json();
    csrfToken = data.csrf_token;
}

interface ApiFetchOptions extends RequestInit {
    body?: any;
}

interface ApiFetchResult<T = any> {
    ok: boolean;
    status: number;
    data: T;
}

export async function apiFetch<T = any>(
    url: string,
    options: ApiFetchOptions = {},
    raw = false
): Promise<ApiFetchResult<T> | Response> {
    const isSafeMethod = options.method && options.method in safeMethods;
    const isAuthEndpoint = url.includes('/login') || url.includes('/register');
    if (!isSafeMethod && !isAuthEndpoint) {
        await fetchCSRFToken();
    }

    const isFormData = options.body instanceof FormData;
    const defaultHeaders = isFormData
        ? {}
        : { "Content-Type": "application/json;charset=utf-8" };

    const finalOptions: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {}),
            "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
    };


    const response = await fetch(API_URL + url, finalOptions);

    if (raw) return response;
    const contentType = response.headers.get("Content-Type");
    let data: any = null;

    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    return {
        ok: response.ok,
        status: response.status,
        data,
    };
}
