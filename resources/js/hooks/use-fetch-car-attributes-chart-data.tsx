import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/bootstrap";

import { carAttributes } from "@/routes/api/charts";
import type { ApiChartResponse } from "@/types";
import { useFetchApiToken } from ".";

const useFetchAttributeChartData =  (order: 'asc' | 'desc' = 'desc') => {
    const [apiToken] = useFetchApiToken();
    const [attributeData, setData] = useState<Array<ApiChartResponse>>([]);
    const [valueOrder, setAttributeValueOrder] = useState<typeof order>(order);
    const [attributeLoading, setLoading] = useState<boolean>(false);

    const abortController = useRef<{control: AbortController | null}>({control: null});

    useEffect(() => {

        if (abortController?.current?.control) {
            abortController.current.control.abort();
        }

        abortController.current.control = new AbortController();

        setTimeout(() => {
            setLoading(true);
        }, 10);

        axiosInstance.post(carAttributes().url, {order: valueOrder}, {
            headers:{
                Authorization: `Bearer ${apiToken}`
            },
            signal: abortController.current.control.signal
        }).then((res) => {
            setTimeout(() => {
                setLoading(false);
            }, 20);
            // console.log({res})
            if(res.status == 200){
                const response: (typeof attributeData) = res.data;
                setData(response);
            }
        }).catch((err) => {
            console.log({err})
            setTimeout(() => {
                setLoading(false);
            }, 20);
        });
    },[apiToken, valueOrder]);

    return { attributeData, attributeLoading, setAttributeValueOrder }
}

export default useFetchAttributeChartData;
