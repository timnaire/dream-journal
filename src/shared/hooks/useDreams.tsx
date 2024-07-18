import { useEffect, useState } from "react";
import { DreamProps } from "../models/dream";

const headers = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

export function useDreams() {
    const [dreams, setDreams] = useState<DreamProps[]>([]);
    useEffect(() => {
        let mounted = true;

        if (mounted) {
            try {
                const getDreams = async () => {
                    const response = await fetch('../mock/home/dreams.json', headers);
                    const data = await response.json();
                    setDreams(data);
                }

                getDreams();
            } catch (error) {
                console.error('Error', error);
            }
        }

        return () => {
            mounted = false;
        }
    }, []);

    return { dreams };
}

