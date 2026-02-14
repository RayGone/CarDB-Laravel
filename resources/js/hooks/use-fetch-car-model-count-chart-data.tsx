import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/bootstrap";

import { countPerYear } from "@/routes/api/charts";
import type { ApiChartResponse } from "@/types";
import { useFetchApiToken } from ".";

const useFetchChartData =  () => {
    const [apiToken] = useFetchApiToken();
    const [data, setData] = useState<Array<ApiChartResponse>>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const abortController = useRef<{control: AbortController | null}>({control: null});

    useEffect(() => {

        if (abortController?.current?.control) {
            abortController.current.control.abort();
        }

        abortController.current.control = new AbortController();

        setTimeout(() => {
            setLoading(true);
        }, 10);

        axiosInstance.post(countPerYear().url, {}, {
            headers:{
                Authorization: `Bearer ${apiToken}`
            },
            signal: abortController.current.control.signal
        }).then((res) => {
            // console.log({res})
            if(res.status == 200){
                const response: (typeof data) = res.data;
                setData(response);
            }
            setTimeout(() => {
                setLoading(false);
            }, 20);
        }).catch((err) => {
            console.log({err})
            setTimeout(() => {
                setLoading(false);
            }, 20);
        });
    },[apiToken]);

    return { data, loading }
}

export default useFetchChartData;
