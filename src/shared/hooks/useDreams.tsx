import { DreamProps } from "../models/dream";
import useSWR from "swr";

const headers = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

const fetcher = (url: string) => fetch(url, headers).then(r => r.json());

export function useDreams() {
    const { data, error, isLoading } = useSWR<DreamProps[]>('../mock/home/dreams.json', fetcher);

    return {
        dreams: data,
        isLoading,
        isError: error
    };
}

