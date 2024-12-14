import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import Table from '@/Components/Table';
import { columnDef } from '@/model';
import PrimaryButton from '@/Components/PrimaryButton';
import { useEffect, useState } from 'react';
import { CarResponse } from '@/types';


const emptyCarResponse: CarResponse = {
    cars: [],
    total: 0
}

export default function Dashboard({ auth }: PageProps) {
    const [cars, setCars] = useState(emptyCarResponse);
    console.log({cars})
    useEffect(() => {
        window.axios.get("/api/cars", {
            headers:{
                Authorization: `Bearer ${auth.apiToken}`
            }
        }).then((data) => {
            const response: CarResponse = data.data;
            setCars(response);
        });
    },[]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">You're logged in!</div>
                        <button className="bg-blue-500 hover:bg-blue-700 active:bg-blue-600 text-white font-bold py-2 px-4 rounded"> Call API </button>
                        <PrimaryButton>Call Another API</PrimaryButton>
                        <Table columnDef={columnDef} data={cars} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
