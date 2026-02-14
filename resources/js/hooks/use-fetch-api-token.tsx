import { useEffect, useState } from "react";

import axiosInstance from "@/bootstrap";
import { getApiToken } from "@/routes";

export default (force=false) => {
    const [apiToken, setApiToken] = useState(window.sessionStorage.getItem("apiToken"));

    useEffect(()=>{
        if(!apiToken || force){
            axiosInstance.post(getApiToken().url, {}, {withCredentials: true}).then((res) => {
                if(res.status == 200){
                    window.sessionStorage.setItem("apiToken", res.data.apiToken);
                    setApiToken(res.data.apiToken);
                }
                console.log(res);
            });
        }
    }, []);

    return [apiToken];
}
