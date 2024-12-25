import { columnDef, emptyCar } from "@/model";
import { Car } from "@/types";
import PrimaryButton from "./PrimaryButton";
import { ReactElement, useRef, useState } from "react";
import Spinner from "./Spinner";
import { usePage } from "@inertiajs/react";

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

export default function FormCar({car, onCancel=()=>{}}: {car?: Car, onCancel?: ()=>void}){
    const { auth }: any = usePage().props;

    const [data, setData] = useState<any>(car ? car : emptyCar);
    const [processing, setPost] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const errorMsg = useRef<ReactElement | null>(null);

    // const delayRef = useRef<any>(null);
    const abortController = useRef<any>(null);

    const handleSubmit = (e: any) => {
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
            errorMsg.current = <span>Could not save data!!!</span>;
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
