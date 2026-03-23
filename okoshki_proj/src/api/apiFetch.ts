const API_URL = import.meta.env.VITE_API_URL as string;
export let csrfToken = "";

const safeMethods = {
    GET: "GET",
    OPTIONS: "OPTIONS",
} as const;

export async function fetchCSRFToken(): Promise<void> {
    const res = await fetch(`${API_URL}/auth/csrf`, {
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
    raw = false,
    skipCSRF = true // Добавьте параметр для пропуска CSRF
): Promise<ApiFetchResult<T> | Response> {
    // Проверяем, нужно ли пропускать CSRF
    if (!skipCSRF && !(options.method in safeMethods)) {
        await fetchCSRFToken();
    }

    const isFormData = options.body instanceof FormData;
    const defaultHeaders = isFormData
        ? {}
        : { "Content-Type": "application/json;charset=utf-8" };

    const finalOptions: RequestInit = {
        ...options,
        headers: {
            // ...defaultHeaders,
            ...(options.headers || {}),
            // "X-CSRF-Token": csrfToken,
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

    console.log(response.status);

    return {
        ok: response.ok,
        status: response.status,
        data,
    };
}


// export async function apiFetch(url: string, options: any) {
//     await new Promise((r) => setTimeout(r, 500));
//
//     if (url === "/auth/login") {
//         const { email, password } = JSON.parse(options.body);
//         if (email === "test@example.com" && password === "123456A") {
//             return {
//                 ok: true,
//                 status: 200,
//                 data: { user: { email, name: "Test User" } },
//             };
//         } else {
//             return {
//                 ok: false,
//                 status: 401,
//                 data: { message: "Неправильный email или пароль" },
//             };
//         }
//     }
//
//     return { ok: false, status: 404, data: {} };
// }