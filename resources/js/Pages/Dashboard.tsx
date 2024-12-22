import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { CarResponse, DataFilterModel, PageProps } from '@/types';
import Table from '@/Components/Table';
import { useEffect, useRef, useState } from 'react';
import {emptyCarResponse, getFilter, setFilter, filterAttributes, filterOps} from "@/model";
import ActionButton from '@/Components/ActionButton';
import FilterView from '@/Components/FilterView';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Dashboard({ auth }: PageProps) {
    const [cars, setCars] = useState<CarResponse>(emptyCarResponse);
    const [pageFilter, setPageFilter] = useState<DataFilterModel>(getFilter());

    const abortController = useRef<any>({control: null});
    useEffect(() => {
        if (abortController.current.control) {
            abortController.current.control.abort();
        }

        abortController.current.control = new AbortController();

        window.axios.post("/api/cars/filterSearch",pageFilter, {
            headers:{
                Authorization: `Bearer ${auth.apiToken}`
            },
            signal: abortController.current.control.signal
        }).then((res) => {
            if(res.data.status == 'success'){
                const response: CarResponse = res.data.data;
                setCars(response);
            }
        }).catch((err) => {
            // console.log({err})
        });
    },[pageFilter]);

    console.log("Dashboard", {pageFilter})

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className='w-full overflow-auto'>
                <div className="py-3 grid lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 gap-1">
                    <div className="sm:px-2 lg:px-3 box-border lg:col-span-2 xl:col-span-3 col-span-1">
                        <div className="shadow rounded-lg relative">
                            <div className='overflow-auto max-h-[75vh]'>
                                <Table data={cars}
                                    onFilter={(f: DataFilterModel)=>{
                                        setFilter(f)
                                        f = getFilter()
                                        setPageFilter(f)
                                    }}
                                    onDelete={(id: number)=>{console.log("Delete",id)}}
                                    onEdit={(id: number)=>{console.log("Edit",id)}}/>
                            </div>
                            {/* <div className="p-6 text-gray-900">You're logged in!</div> */}
                            {/* <button className="bg-blue-500 hover:bg-blue-700 active:bg-blue-600 text-white font-bold py-2 px-4 rounded"> Call API </button> */}
                            {/* <PrimaryButton>Call Another API</PrimaryButton> */}
                        </div>
                    </div>
                    <div className='hidden lg:block box-border sticky-head h-fit mr-2'>
                        <FilterView
                            model={pageFilter.filter}
                            onFilter={(f)=>{
                                pageFilter.filter.push(f);
                                setFilter(pageFilter);
                                setPageFilter(getFilter());
                            }}

                            onRemove={(f)=>{
                                console.log("Before",pageFilter.filter)
                                pageFilter.filter = pageFilter.filter.filter((r)=> !(r.field==f.field && r.ops==f.ops && r.value==f.value));
                                console.log("OnRemove", {f}, pageFilter.filter)
                                setFilter(pageFilter);
                                setPageFilter(getFilter());
                            }}
                        >
                            <span className='p-2 text-l'>No Filter Set.</span>
                        </FilterView>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
