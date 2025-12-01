import axios, { InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';

const baseURL =
    typeof window === 'undefined' && process.env.INTERNAL_API_BASE_URL
        ? process.env.INTERNAL_API_BASE_URL
        : process.env.NEXT_PUBLIC_APP_BASE_URL;

const path = axios.create({
    baseURL,
    headers: { Accept: 'application/json' },
});

function isFile(value: any): boolean {
    return value instanceof File || value instanceof Blob;
}

function toFormData(data: Record<string, any>): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item) => {
                formData.append(key, isFile(item) ? item : item);
            });
        } else if (isFile(value)) {
            formData.append(key, value);
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            formData.append(key, String(value));
        } else if (value !== null && value !== undefined) {
            formData.append(key, JSON.stringify(value));
        }
    });

    return formData;
}

path.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        config.headers = config.headers ?? ({} as AxiosRequestHeaders);

        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            } as AxiosRequestHeaders;
        }

        if (config.data) {
            if (config.data instanceof FormData) {
                delete (config.headers as AxiosRequestHeaders)['Content-Type'];
            } else {
                const hasFile = Object.values(config.data).some((v) =>
                    Array.isArray(v) ? v.some(isFile) : isFile(v)
                );

                if (hasFile) {
                    config.data = toFormData(config.data);
                    delete (config.headers as AxiosRequestHeaders)['Content-Type'];
                } else if (!(config.headers as AxiosRequestHeaders)['Content-Type']) {
                    config.headers['Content-Type'] = 'application/json';
                }
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

path.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('API Response Error:', error.response.status, error.response.data);
        } else {
            console.error('Network or Axios Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default path;