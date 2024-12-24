import { columnDef, emptyCar } from "@/model";
import { Car } from "@/types";
import PrimaryButton from "./PrimaryButton";
import { useRef, useState } from "react";
import Spinner from "./Spinner";
import { usePage } from "@inertiajs/react";

export default function FormCar({car, onCancel=()=>{}}: {car?: Car, onCancel?: ()=>void}){
    const { auth }: any = usePage().props;

    const [data, setData] = useState<any>(car ? car : emptyCar);
    const [processing, setPost] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    // const delayRef = useRef<any>(null);
    const abortController = useRef<any>(null);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setIsError(false);
        if(processing) return;

        const endpiont = car ? route('api.cars.add') : route('api.cars.edit', {id: data?.id ?? -1});
        setPost(true);

        if (abortController.current) {
            abortController.current.abort();
        }

        abortController.current = new AbortController();

        abortController.current = window.axios.post(endpiont, data, {
            headers:{
                Authorization: `Bearer ${auth.apiToken}`
            },
            signal: abortController.current.signal
        }).then((res) => {
            if(res.data.status == 'success'){
                onCancel();
            }
        }).catch((err) => {
            setIsError(true);
        });
    };

    return (
        <div className="min-w-72 w-full px-8 py-4 h-full text-xs md:text-sm my-2">
            <div className="mb-4 text-xl font-bold">
                    {car && <h2>Edit Car</h2>}
                    {!car && <h2>Add Car</h2>}
                <hr />
            </div>
            <form className="flex flex-col items-start justify-start space-y-2 w-full my-2" onSubmit={handleSubmit}>
                {
                    columnDef.map((col)=>
                        (col.key in data && col.key!='id') && <div key={col.key} className="flex flex-col space-y-1 pb-3 w-full">
                                <label htmlFor={col.key}>{col.header}:</label>
                                <input id={col.key} key={col.key} className="rounded w-full"
                                    value={data[col.key]}
                                    onChange={(e)=> setData({
                                        ...data,
                                        [col.key]: e.target.value
                                    })
                                }/>
                            </div>
                    )
                }

                {isError && <span className="text-red-500 bg-red-100 p-4 w-full rounded">Could not save data!!!</span>}

                <div className="self-end">
                    <PrimaryButton type='submit' onSubmit={handleSubmit}>
                        Submit
                        {
                            processing && <>&nbsp;&nbsp;<Spinner size="size-4" /></>
                        }
                    </PrimaryButton>
                    &nbsp;&nbsp;
                    <PrimaryButton type='button'
                        onSubmit={(e)=>e.preventDefault()}
                        onClick={()=>{
                                abortController.current.abort()
                                onCancel();
                            }}
                        >Cancel</PrimaryButton>
                </div>
                <span></span>
            </form>
        </div>
    );
}
