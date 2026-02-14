import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/bootstrap";
import { getFilter, isInitFilter } from "@/model";

import { getbyfilter } from "@/routes/api/cars";
import type { CarResponse, DataFilterModel } from "@/types";
import { useFetchApiToken } from ".";

const emptyResponse = {cars: [], total:0}

const useFetchTableData =  () => {
    const [apiToken] = useFetchApiToken();
    const [cars, setCars] = useState<CarResponse>(emptyResponse);
    const [loading, setLoading] = useState<boolean>(false);
    const [pageFilter, setPageFilter] = useState<DataFilterModel>(getFilter());

    const abortController = useRef<{control: AbortController | null}>({control: null});

    useEffect(() => {
        if(isInitFilter(pageFilter)) {
            // setCars(carData);
            // return;
        }

        if (abortController?.current?.control) {
            abortController.current.control.abort();
        }

        abortController.current.control = new AbortController();

        setTimeout(() => {
            setLoading(true);
        }, 50);

        axiosInstance.post(getbyfilter().url ,pageFilter, {
            headers:{
                Authorization: `Bearer ${apiToken}`
            },
            signal: abortController.current.control.signal
        }).then((res) => {
            // console.log({res})
            if(res.data.status == 'success'){
                const response: CarResponse = res.data.data;
                setCars(response);
                setLoading(false);
            }
        }).catch((err) => {
            console.debug({err})
            setLoading(false)
        });
    },[apiToken, pageFilter]);

    return {cars, loading, pageFilter, setPageFilter}
}

export default useFetchTableData;
