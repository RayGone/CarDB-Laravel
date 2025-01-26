import { Head, usePage } from '@inertiajs/react';
import { CarResponse, DataFilterModel, PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Table from '@/Components/Table';
import { useEffect, useRef, useState } from 'react';
import {getFilter, setFilter, isInitFilter} from "@/model";
import FilterView from '@/Components/FilterView';
import Modal from '@/Components/Modal';
import FormCar from '@/Components/FormCar';
import DashboardHeader from '../Components/DashboardHeader';

export default function Dashboard({ auth, carData }: PageProps<{ carData: CarResponse }>) {
    const [cars, setCars] = useState<CarResponse>(carData);
    const [pageFilter, setPageFilter] = useState<DataFilterModel>(getFilter());
    const [loading, setLoading] = useState<boolean>(false);
    const [isFilter, setIsFilter] = useState<boolean>(false);
    const [openForm, setOpenForm] = useState<boolean>(false);

    const delayRef = useRef<any>(null);
    const abortController = useRef<any>({control: null});
    const editCar = useRef<any>(null);

    useEffect(() => {
        if(isInitFilter(pageFilter)) {
            setCars(carData);
            return;
        }

        setLoading(true);
        if (abortController.current.control) {
            abortController.current.control.abort();
        }

        abortController.current.control = new AbortController();

        window.axios.post(route('api.cars.getbyfilter'),pageFilter, {
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
        <>
        <Head title="Dashboard" />
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

                    onAdd={()=>{setOpenForm(true);}}

                    onOpenFilter={()=>{
                        setIsFilter(true);
                    }}

                />}
        >

            <div className='w-full overflow-auto'>
                <div className="py-3 grid lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 gap-1">
                    <div className="sm:px-2 lg:px-3 box-border lg:col-span-2 xl:col-span-3 col-span-1">
                        <div className="shadow rounded-lg relative">
                            <div className='overflow-auto max-h-[75vh]'>
                                <Table data={cars}
                                    onFilter={applyFilter}
                                    onDelete={(id: number)=>{
                                        const car = cars.cars.filter((c) => c.id == id);
                                        if(car.length > 0){
                                            window.axios.delete(route('api.cars.delete', {id}), {
                                                headers:{
                                                    Authorization: `Bearer ${auth.apiToken}`
                                                },
                                                data: car[0],
                                                signal: abortController.current.control.signal
                                            }).then((res) => {
                                                console.log(res.data);
                                                if(res.data.status == 'success'){
                                                    applyFilter(getFilter());
                                                }
                                            }).catch((err) => {
                                                // console.log({err})
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

            <Modal show={openForm} maxWidth='md' onClose={()=>{setOpenForm(false);}}>
                <div style={{height: '80vh'}} className="overflow-auto">
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
        </AuthenticatedLayout>
        </>
    );
}
