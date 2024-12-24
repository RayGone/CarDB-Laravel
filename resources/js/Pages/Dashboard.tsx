import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { CarResponse, DataFilterModel, PageProps } from '@/types';
import Table from '@/Components/Table';
import { useEffect, useRef, useState } from 'react';
import {emptyCarResponse, getFilter, setFilter} from "@/model";
import FilterView from '@/Components/FilterView';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import ActionButton from '@/Components/ActionButton';
import Dropdown from '@/Components/Dropdown';
import SearchBox from '@/Components/Searchbox';
import Modal from '@/Components/Modal';


function DashboardHeader({onSearch, onAdd, onOpenFilter=()=>{}}: {onSearch?: (s: string)=>void, onAdd?: ()=>void, onOpenFilter?: ()=>void}){
    const f = getFilter();
    return <>
        <h2 className="font-semibold text-xl text-gray-800 leading-tight"><span className='hidden md:block'>Dashboard</span></h2>

        <div className='flex flex-row items-center justify-end'>
            <SearchBox onSearch={onSearch} value={f.search}/>
            <div className='mr-2'>
                <SecondaryButton className='hidden md:block'>Add Car</SecondaryButton>
                <ActionButton className='block md:hidden' title='Add Car'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </ActionButton>
            </div>
            <div className="mr-2 relative">
                <Dropdown>
                    <Dropdown.Trigger>
                        <SecondaryButton className='hidden md:block'>Download</SecondaryButton>
                        <ActionButton title="Download Data" className='block md:hidden'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </ActionButton>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                        <Dropdown.Anchor href={route('api.cars.download',{"type":"csv"})}>CSV</Dropdown.Anchor>
                        <hr />
                        <Dropdown.Anchor href={route('api.cars.download',{"type":"json"})}>JSON</Dropdown.Anchor>
                    </Dropdown.Content>
                </Dropdown>
            </div>

            <ActionButton onClick={()=>onOpenFilter()} className='block lg:hidden' title={"Filters"}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                </svg>
            </ActionButton>

        </div>

    </>;
}

export default function Dashboard({ auth }: PageProps) {
    const [cars, setCars] = useState<CarResponse>(emptyCarResponse);
    const [pageFilter, setPageFilter] = useState<DataFilterModel>(getFilter());
    const [loading, setLoading] = useState<boolean>(false);
    const [isFilter, setIsFilter] = useState<boolean>(false);

    const delayRef = useRef<any>(null);

    const abortController = useRef<any>({control: null});
    useEffect(() => {
        setLoading(true);
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
                setLoading(false);
            }
        }).catch((err) => {
            // console.log({err})
            setLoading(false)
        });
    },[pageFilter]);

    function applyFilter(f: DataFilterModel){
        if(delayRef.current) clearTimeout(delayRef.current);

        setFilter(f);
        f = getFilter();
        delayRef.current = setTimeout(()=>{
            setPageFilter(f);
        }, 200);
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <DashboardHeader
                    onSearch={(s)=>{
                        const f = {
                            ...pageFilter,
                            search: s
                        };
                        applyFilter(f)
                    }}

                    onOpenFilter={()=>{
                        setIsFilter(true);
                    }}

                    />
                }
        >
            <Head title="Dashboard" />

            <div className='w-full overflow-auto'>
                <div className="py-3 grid lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 gap-1">
                    <div className="sm:px-2 lg:px-3 box-border lg:col-span-2 xl:col-span-3 col-span-1">
                        <div className="shadow rounded-lg relative">
                            <div className='overflow-auto max-h-[75vh]'>
                                <Table data={cars}
                                    onFilter={applyFilter}
                                    onDelete={(id: number)=>{console.log("Delete",id)}}
                                    onEdit={(id: number)=>{console.log("Edit",id)}}
                                    loading={loading}
                                    />
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
                                applyFilter(pageFilter);
                            }}

                            onRemove={(f)=>{
                                pageFilter.filter = pageFilter.filter.filter((r)=> !(r.field==f.field && r.ops==f.ops && r.value==f.value));
                                applyFilter(pageFilter)
                            }}
                        >
                            <span className='p-2 text-l'>No Filter Set.</span>
                        </FilterView>
                    </div>
                </div>

                {isFilter &&
                    <Modal show={isFilter} maxWidth='sm' onClose={()=>{setIsFilter(false)}}>
                        <FilterView
                            model={pageFilter.filter}
                            onFilter={(f)=>{
                                pageFilter.filter.push(f);
                                applyFilter(pageFilter);
                            }}

                            onRemove={(f)=>{
                                pageFilter.filter = pageFilter.filter.filter((r)=> !(r.field==f.field && r.ops==f.ops && r.value==f.value));
                                applyFilter(pageFilter)
                            }}
                        >
                            <span className='p-2 text-l'>No Filter Set.</span>
                        </FilterView>
                    </Modal>}
            </div>
        </AuthenticatedLayout>
    );
}
