import { useEffect, useRef, useState, useTransition } from 'react';
import axiosInstance from '@/bootstrap';

import { countPerYear } from '@/routes/api/charts';
import type { ApiChartResponse } from '@/types';
import { useFetchApiToken } from '.';

const useFetchChartData = () => {
    const [apiToken] = useFetchApiToken();
    const [data, setData] = useState<Array<ApiChartResponse>>([]);
    const [loading, startDataFetchTransition] = useTransition();

    const abortController = useRef<{ control: AbortController | null }>({
        control: new AbortController(),
    });

    useEffect(() => {
        if (abortController?.current?.control) {
            abortController.current.control.abort();
        }

        abortController.current.control = new AbortController();

        startDataFetchTransition(async ()=>{
            const fetchData = await axiosInstance
                        .post(
                            countPerYear().url,
                            {},
                            {
                                headers: {
                                    Authorization: `Bearer ${apiToken}`,
                                },
                                signal: abortController.current.control?.signal,
                            },
                        );


            if (fetchData.status == 200) {
                const response: typeof data = fetchData.data;
                setData(response);
            }
        });
    }, [apiToken]);

    return { data, loading };
};

export default useFetchChartData;
