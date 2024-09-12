import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

export function useAxiosIntance() {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const instance: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (config) => {
      const response = config.data;
      if (response && typeof response === 'object' && 'redirect' in response) {
        <Navigate to={response.redirect} replace />;
      }
      if (response && typeof response === 'object' && 'success' in response) {
        if (!response.success) {
          setIsError(!response.success);
          setError(response.message);
        }
      }
      setIsLoading(false);
      return config;
    },
    (error) => {
      const Unauthorized = 401;
      if (error && error.response && error.response.status === Unauthorized) {
        return <Navigate to={error.response.data.redirect} replace />;
      }
      return Promise.reject(error);
    }
  );
  return { instance, isLoading, isError, error };
}

export function useApi() {
  const { instance, isLoading, isError, error } = useAxiosIntance();

  const httpGet = async <T,>(url: string, query = '', config?: AxiosRequestConfig): Promise<T> => {
    try {
      return await instance.get(url + query, config).then((res) => res.data);
    } catch (error) {
      throw new Error('An HTTP GET request error occured: ' + error);
    }
  };

  const httpPost = async <T,>(url: string, payload: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      return await instance.post(url, payload, config).then((res) => res.data);
    } catch (error) {
      throw new Error('An HTTP POST request error occured: ' + error);
    }
  };

  const httpPut = async <T,>(url: string, payload: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      return await instance.put(url, payload, config).then((res) => res.data);
    } catch (error) {
      throw new Error('An HTTP PUT request error occured: ' + error);
    }
  };

  const httpDelete = async <T,>(url: string, query = '', config?: AxiosRequestConfig): Promise<T> => {
    return await instance
      .delete(url + query, config)
      .then((res) => res.data)
      .catch((error) => handleError(error));
    // try {
    //   return await instance.delete(url + query, config).then((res) => res.data);
    // } catch (error) {
    //   throw new Error('An HTTP DELETE request error occured: ' + error);
    // }
  };

  const handleError = async (error: any) => {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status} \n Message: ${error.message}`;
    }
    return errorMessage;
  };

  return { instance, isLoading, isError, error, httpGet, httpPost, httpPut, httpDelete };
}
