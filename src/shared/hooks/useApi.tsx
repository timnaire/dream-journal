import axios from 'axios';

export function useApi() {
    const instance = axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'authorization': 'Bearer',
        },
        withCredentials: true
    });

    instance.interceptors.request.use((config) => {
        console.log('interceptors,', config);
        return config;
    })

    const httpGet = async (url: string, query = '') => {
        return await instance.get(url + query).then(res => res.data);
    }

    const httpPost = async (url: string, payload: any) => {
        return await instance.post(url, payload).then(res => res.data);
    }

    const httpPut = async (url: string, payload: any) => {
        await instance.put(url, payload).then(res => res.data);
    }

    const httpDelete = async (url: string, query = '') => {
        await instance.delete(url + query).then(res => res.data);
    }

    return { httpGet, httpPost, httpPut, httpDelete }
}
