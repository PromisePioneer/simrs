import axios from "axios";

const apiCall = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    withXSRFToken: true,
});

export const asset = (path) => {
    return `${import.meta.env.VITE_ASSET_URL}/${path}`;
};

export const assets = (path) =>
    axios.create({
        baseURL: `${import.meta.env.VITE_ASSET_URL}/${path}`,
        withCredentials: true,
        withXSRFToken: true,
    });


apiCall.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem("loggedIn");

            if (!window.location.pathname.includes('/auth/login')) {
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);
export default apiCall;
