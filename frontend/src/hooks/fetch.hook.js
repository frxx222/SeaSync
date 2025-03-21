import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../states/api.js';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

/** custom hook */
export default function useFetch(query) {
    const [getData, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError: null });

    useEffect(() => {
        const fetchData = async () => {
            setData(prev => ({ ...prev, isLoading: true }));
            
            try {
                const usernameData = !query ? await getUsername() : null;
                const endpoint = !query ? `/api/user/${usernameData.username}` : `/api/${query}`;

                const response = await axios.get(endpoint);
                const { data, status } = response;

                setData(prev => ({ ...prev, isLoading: false, apiData: data, status }));
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error.message }));
            }
        };
        fetchData();

    }, [query]);

    return [getData, setData];
}
