import { usePage } from "@inertiajs/react";
import { type ReactElement, useRef, useState } from "react";
import { columnDef, emptyCar } from "@/model";
import type { SharedData, Car } from "@/types";
import PrimaryButton from "./PrimaryButton";
import Spinner from "./Spinner";
import axiosInstance from "@/bootstrap";

function formValidation(state: Car){///, setter: (state: any)=>void){
    const required = columnDef.filter((col) => col.required);
    const number = columnDef.filter((col) => col.type === "number");

    if( // Required fields are not set
        required.some((col) => {
            const status = (state[col.type] === "number" ? state[col.key] < 0 : state[col.key] === "") || state[col.key] === null;
            // console.log(status, col.header, state[col.key] )
            // setter((val: any) => {
            //     return {
            //         ...val,
            //         [col.key]: !status
            //     }
            // });
            return status;
        })
    ) return false;

    if( // Number fields are below 0
        number.some((col) => {
            const status = state[col.key] < 0;
            // setter(
            //     (val: any) => {
            //         return {
            //             ...val,
            //             [col.key]: !status
            //         }
            //     }
            // )
            return status;
        })
    ) return false;

    return true;
}

export default function FormCar({car, onCancel=()=>{}, onSubmit= ()=>{}}: {car?: Car, onCancel?: ()=>void, onSubmit?: ()=>void}){
    const { props } = usePage<SharedData>();

    const [data, setData] = useState<Car>(car ? car : emptyCar);
    const [processing, setPost] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const errorMsg = useRef<ReactElement | null>(null);

    // const delayRef = useRef<any>(null);
    const abortController = useRef<AbortController>(null);

    const handleSubmit = (e: MouseEvent) => {
        e.preventDefault();
        setIsError(false);
        if(!formValidation(data)){
            setIsError(true);
            errorMsg.current = <span>Form Validaiton Error!!
                    <br />[Name, Origin and Model Year] are required fields!!
                    <br /> Numeric values must not be less than 0.</span>;
            return;
        }
        if(processing) return;

        const endpiont = !!car ? route('api.cars.edit', {id: data?.id ?? -1}) : route('api.cars.add');
        setPost(true);

        if (abortController.current) {
            abortController.current.abort();
        }

        abortController.current = new AbortController();

        if(!car){
            axiosInstance.post(endpiont, data, {
                headers:{
                    Authorization: `Bearer ${props.auth.apiToken}`
                },
                signal: abortController.current.signal
            }).then((res) => {
                setPost(false);
                abortController.current = null;
                if(res.data.status == 'success'){
                    onCancel();
                    return;
                }

                setIsError(true);
                throw new Error("Server didn't return success");
            }).catch((err) => {
                setPost(false);
                setIsError(true);
                errorMsg.current = <span>Could not save data!!!</span>;
                abortController.current = null;
            });
        }
        else{
            axiosInstance.patch(endpiont, data, {
                headers:{
                    Authorization: `Bearer ${props.auth.apiToken}`
                },
                signal: abortController.current.signal
            }).then((res) => {
                setPost(false);
                abortController.current = null;
                if(res.data.status == 'success'){
                    onSubmit();
                    return;
                }

                setIsError(true);
                throw new Error("Server didn't return success");
            }).catch((err) => {
                setPost(false);
                setIsError(true);
                errorMsg.current = <span>Could not save data!!!</span>;
                abortController.current = null;
            });
        }
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
                                <input id={col.key} key={col.key} className="rounded w-full border h-10 px-2 dark:border-slate-700"
                                    type={col.type}
                                    value={data[col.key] == -1 ? null : data[col.key]}
                                    required={col.required}
                                    onChange={(e)=> setData({
                                        ...data,
                                        [col.key]: e.target.value
                                    })
                                }/>
                            </div>
                    )
                }

                {isError && <span className="text-red-500 bg-red-100 p-4 w-full rounded">{errorMsg.current}</span>}

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
                                if (abortController.current) {
                                    abortController.current.abort();
                                }
                                onCancel();
                            }}
                        >Cancel</PrimaryButton>
                </div>
                <span></span>
            </form>
        </div>
    );
}
