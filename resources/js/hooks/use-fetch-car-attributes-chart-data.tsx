import { useEffect, useRef, useState, useTransition } from 'react';
import axiosInstance from '@/bootstrap';

import { carAttributes } from '@/routes/api/charts';
import type { ApiChartResponse } from '@/types';
import { useFetchApiToken } from '.';

const useFetchAttributeChartData = (order: 'asc' | 'desc' = 'desc') => {
    const [apiToken] = useFetchApiToken();
    const [attributeData, setData] = useState<Array<ApiChartResponse>>([]);
    const [valueOrder, setAttributeValueOrder] = useState<typeof order>(order);
    const [attributeLoading, startAttributeFetchTransition] = useTransition();

    const abortController = useRef<{ control: AbortController | null }>({
        control: new AbortController(),
    });

    useEffect(() => {
        if (abortController?.current?.control) {
            abortController.current.control.abort();
        }

        abortController.current.control = new AbortController();

        startAttributeFetchTransition(async ()=>{
            const fetchAttributeData = await axiosInstance
                        .post(
                            carAttributes().url,
                            { order: valueOrder },
                            {
                                headers: {
                                    Authorization: `Bearer ${apiToken}`,
                                },
                                signal: abortController.current.control?.signal,
                            },
                        );

            if (fetchAttributeData.status == 200) {
                const response: typeof attributeData = fetchAttributeData.data;
                setData(response);
            }
        });
    }, [apiToken, valueOrder]);

    return { attributeData, attributeLoading, setAttributeValueOrder };
};

export default useFetchAttributeChartData;
