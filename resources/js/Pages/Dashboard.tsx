import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/bootstrap';

import DashboardHeader from '@/components/custom/DashboardHeader';
import FilterView from '@/components/custom/FilterView';
import FormCar from '@/components/custom/FormCar';
import Modal from '@/components/custom/Modal';
import Table from '@/components/custom/Table';

import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import {getFilter, setFilter, isInitFilter} from "@/model";
import { dashboard } from '@/routes';
import { deleteMethod, getbyfilter } from '@/routes/api/cars';
import { type SharedData, type BreadcrumbItem, type CarResponse, type DataFilterModel } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const emptyResponse = {cars: [], total:0}

export default function Dashboard() {
    const { props } = usePage<SharedData>();

    const [cars, setCars] = useState<CarResponse>(emptyResponse);
    const [pageFilter, setPageFilter] = useState<DataFilterModel>(getFilter());
    const [loading, setLoading] = useState<boolean>(false);
    const [isFilter, setIsFilter] = useState<boolean>(false);
    const [openForm, setOpenForm] = useState<boolean>(false);

    const delayRef = useRef<any>(null);
    const abortController = useRef<any>({control: null});
    const editCar = useRef<any>(null);

    useEffect(() => {
        if(isInitFilter(pageFilter)) {
            // setCars(carData);
            // return;
        }

        setLoading(true);
        if (abortController?.current?.control) {
            abortController.current.control.abort();
        }

        abortController.current.control = new AbortController();

        console.log(getbyfilter().url)
        axiosInstance.post(getbyfilter().url ,pageFilter, {
            headers:{
                Authorization: `Bearer ${props.auth.apiToken}`
            },
            signal: abortController.current.control.signal
        }).then((res) => {
            if(res.data.status == 'success'){
                const response: CarResponse = res.data.data;
                setCars(response);
                setLoading(false);
            }
        }).catch((err) => {
            console.log({err})
            setLoading(false)
        });
    },[props.auth.apiToken, pageFilter]);

    function applyFilter(f: DataFilterModel){
        if(delayRef.current) clearTimeout(delayRef.current);

        setFilter(f);
        f = getFilter();
        delayRef.current = setTimeout(()=>{
            setPageFilter(f);
        }, 200);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <DashboardHeader
                onSearch={(s)=>{
                    const f = {
                        ...pageFilter,
                        search: s
                    };
                    applyFilter(f)
                }}

                onAdd={()=>{setOpenForm(true);}}

                onOpenFilter={()=>{
                    setIsFilter(true);
                }}

            />

            {!cars.total && <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>}

            {cars.total && <div className='flex flex-1 h-full overflow-auto'>
                <div className="py-3 grid lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 gap-1">
                    <div className="sm:px-2 lg:px-3 box-border lg:col-span-2 xl:col-span-3 col-span-1">
                        <div className="shadow rounded-lg relative">
                            <div className='overflow-auto max-h-[75vh]'>
                                <Table data={cars}
                                    onFilter={applyFilter}
                                    onDelete={(id: number)=>{
                                        const car = cars.cars.filter((c) => c.id == id);
                                        if(car.length > 0){
                                            axiosInstance.delete(deleteMethod(id).url, {
                                                headers:{
                                                    Authorization: `Bearer ${props.auth.apiToken}`
                                                },
                                                data: car[0],
                                                signal: abortController.current.control.signal
                                            }).then((res) => {
                                                console.log(res.data);
                                                if(res.data.status == 'success'){
                                                    applyFilter(getFilter());
                                                }
                                            }).catch((err) => {
                                                console.log({err})
                                            });
                                        }
                                    }}
                                    onEdit={(id: number)=>{
                                        const car = cars.cars.filter((c) => c.id == id);
                                        if(car.length > 0){
                                            editCar.current = car[0];
                                        }
                                        setOpenForm(true);
                                    }}
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
            </div>}
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

                <Modal show={openForm} maxWidth='md' onClose={()=>{setOpenForm(false);}}>
                    <div style={{height: '80vh'}} className="overflow-auto dark:bg-gray-900">
                        <FormCar
                            car={editCar.current}
                            onCancel={()=>{
                                setOpenForm(false);
                                editCar.current = null;
                            }}

                            onSubmit={()=>{
                                setOpenForm(false);
                                editCar.current = null

                                applyFilter(getFilter());
                            }}/>
                    </div>
                </Modal>
        </AppLayout>
    );
}

