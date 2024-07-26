import axios, { AxiosInstance } from 'axios';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message: string;
}

export function useApi() {
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState('');
    const instance: AxiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        withCredentials: true
    });

    instance.interceptors.request.use((config) => {
        setIsError(false);
        setError('');
        return config;
    });

    instance.interceptors.response.use((config) => {
        const response = config.data;
        if (response && typeof response === 'object' && ('redirect' in response)) {
            <Navigate to={response.redirect} replace />;
        }
        if (response && typeof response === 'object' && ('success' in response)) {
            setIsError(!response.success);
            setError(response.message);
        }
        return config;
    }, (error) => {
        const Unauthorized = 401;
        if (error.response.status === Unauthorized) {
            localStorage.removeItem('isAuthenticated');
            return <Navigate to={error.response.data.redirect} replace />;
        }
        return Promise.reject(error);
    });

    const httpGet = async <T,>(url: string, query = ''): Promise<T> => {
        try {
            return await instance.get(url + query).then(res => res.data);
        } catch (error) {
            throw new Error('An HTTP GET request error occured: ' + error);
        }
    }

    const httpPost = async <T,>(url: string, payload: any): Promise<T> => {
        try {
            return await instance.post(url, payload).then(res => res.data);
        } catch (error) {
            throw new Error('An HTTP POST request error occured: ' + error);
        }
    }

    const httpPut = async <T,>(url: string, payload: any): Promise<T> => {
        try {
            return await instance.put(url, payload).then(res => res.data);
        } catch (error) {
            throw new Error('An HTTP PUT request error occured: ' + error);
        }
    }

    const httpDelete = async <T,>(url: string, query = ''): Promise<T> => {
        try {
            return await instance.delete(url + query).then(res => res.data);
        } catch (error) {
            throw new Error('An HTTP DELETE request error occured: ' + error);
        }
    }

    return { isError, error, httpGet, httpPost, httpPut, httpDelete }
}
