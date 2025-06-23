import axios from "axios";

const axiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        return config;
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error.response && error.response.data || "An error occurred")
)

export default axiosInstance;

export const fetcher = async (args:any) => {
    console.log(args)
    const [url, config] = Array.isArray(args) ? args : [args];
    console.log(url, config)
    return axiosInstance.get(url, config)
}

export const fetcherPost = async (args:any) => {
    const [url, payload] = Array.isArray(args) ? args : [args];
    console.log("anuj", url, payload)
    return axiosInstance.post(url, payload)
}