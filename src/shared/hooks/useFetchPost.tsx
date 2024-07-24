import { useEffect, useState } from "react";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export function useFetchPost<T>(url: string, values: any) {
    const [data, setData] = useState<T | null>(null);

    useEffect(() => {
        let mounted = true;

        if (mounted) {
            try {
                const getData = async () => {
                    const response = await fetch(BASE_URL + url, {
                        method: 'POST',
                        body: JSON.stringify(values),
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    });
                    const data = await response.json();
                    setData(data);
                }

                getData();
            } catch (error) {
                console.error('Error', error);
            }
        }

        return () => {
            mounted = false;
        };
    }, []);

    return { data };
}
