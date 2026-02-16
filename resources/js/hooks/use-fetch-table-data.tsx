import { useEffect, useRef, useState, useTransition } from 'react';
import axiosInstance from '@/bootstrap';
import { getFilter, isInitFilter } from '@/model';

import { getbyfilter } from '@/routes/api/cars';
import type { CarResponse, DataFilterModel } from '@/types';
import { useFetchApiToken } from '.';

const emptyResponse = { cars: [], total: 0 };

const useFetchTableData = () => {
    const [apiToken] = useFetchApiToken();
    const [cars, setCars] = useState<CarResponse>(emptyResponse);
    const [loading, startDataFetchTransition] = useTransition();
    const [pageFilter, setPageFilter] = useState<DataFilterModel>(getFilter());

    const abortController = useRef<{ control: AbortController | null }>({
        control: new AbortController(),
    });

    useEffect(() => {
        if (isInitFilter(pageFilter)) {
            // setCars(carData);
            // return;
        }

        if (abortController.current?.control) {
            abortController.current.control.abort();
        }

        abortController.current.control = new AbortController();
        startDataFetchTransition(async () => {
            const fetchData = await axiosInstance
                .post(getbyfilter().url, pageFilter, {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                    },
                    signal: abortController.current.control?.signal,
                });

            if (fetchData.status == 200 && fetchData.data.status == 'success') {
                    const response: CarResponse = fetchData.data.data;
                    setCars(response);
                }
        });
    }, [apiToken, pageFilter]);

    return { cars, loading, pageFilter, setPageFilter };
};

export default useFetchTableData;
