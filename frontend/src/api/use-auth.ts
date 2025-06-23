import { fetcher, fetcherPost } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/api/endpoints";
import useSWR from "swr";

const useAuth = () => {
    const URL = ENDPOINTS.auth.me
    const { data, error, isLoading } = useSWR(URL, fetcher)

    return {
        user: data?.data,
        isLoading,
        error,
    }
}

const useRegister = () => {
    const URL = ENDPOINTS.auth.register
    
    const register = async (payload: any) => {
        try {
            const result = await fetcherPost([URL, payload])
            return { data: result, error: null }
        } catch (err) {
            return { data: null, error: err }
        }
    }

    return {
        register,
        isLoading: false,
        error: null,
        data: null
    }
}

const useLogin = () => {
    const URL = ENDPOINTS.auth.login
    
    const login = async (payload: any) => {
        try {
            const result = await fetcherPost([URL, payload])
            return { data: result, error: null }
        } catch (err) {
            return { data: null, error: err }
        }
    }

    return {
        login,
        isLoading: false,
        error: null,
        data: null
    }
}

const useLogout = () => {
    const URL = ENDPOINTS.auth.logout

    const logout = async () => {
        try {
            const result = await fetcherPost([URL])
            return { data: result, error: null }
        } catch (err) {
            return { data: null, error: err }
        }
    }

    return {
        logout,
        isLoading: false,
        error: null,
        data: null
    }
}

export { useAuth, useRegister, useLogin, useLogout };