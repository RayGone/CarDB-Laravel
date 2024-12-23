import React, { useState, useRef } from 'react';
import {  CarResponse, DataFilterModel } from '@/types';
import { columnDef, getFilter } from '@/model';
import TableHead from './TableHead';

interface TableComponentProps {
    data: CarResponse; // Optional prop
    onFilter: (f: DataFilterModel) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    loading: boolean;
}

export default function Table({data, onFilter, onEdit, onDelete, loading=false}: TableComponentProps){
    const f = useRef<DataFilterModel>(getFilter());
    const from = f.current.page*f.current.limit;
    const to = from+data.cars.length;
    const maxPage = Math.ceil(data.total/f.current.limit) - 1;

    return (
        <>
            <table className="bg-white min-w-full table-auto text-sm lg:text-base border-collapse">
                <TableHead headDef={columnDef} action={true}
                    sort={{order: f.current.order, orderBy:f.current.orderBy}}
                    onSort={
                        (sort) => {
                            f.current.order = sort.order;
                            f.current.orderBy = sort.orderBy;
                            onFilter(f.current);
                        }
                    }/>

                <tbody>
                    {
                        !loading && (data.total==0 || data.cars.length==0) && <tr>
                            <td colSpan={7} className='font-bold px-4 py-2'>No Data</td>
                        </tr>
                    }
                    {
                        // Loading screen
                        loading && <tr>
                            <td colSpan={7} className='font-bold px-4 py-2'>
                                <div role="status">
                                    <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 size-10" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </td>
                        </tr>
                    }
                    {
                        data.cars.map((car: any)=>{
                            return <tr key={car.id}>
                                {
                                    columnDef.map((col) => <td key={col.key} className="border px-4 py-2">
                                        {car[col.key]}
                                    </td>)

                                }
                                <td className="border px-4 py-2 bg-white sticky-right">
                                    <div className='flex flex-row'>
                                        <button key='Edit' className='hover:bg-blue-50 text-gray font-bold py-3 px-3 rounded-full' onClick={()=>{onEdit(car.id)}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                        <button key='Delete' className='hover:bg-blue-50 text-red-500 font-bold py-3 px-3 rounded-full'  onClick={()=>{onDelete(car.id)}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        })
                    }
                </tbody>
                <tfoot className='sticky-foot bg-white'>
                    <tr className='shadow-up'>
                        <td colSpan={12} >
                            <div className="flex justify-end mt-1">
                                <nav aria-label="Page navigation" className="px-4 py-2 sticky-right md:inline-flex items-center">
                                    <div className='mb-1'>
                                        <span className='px-3 text-sm font-light'>Rows Per Page</span>
                                        <select id="options"
                                            value={f.current.limit}
                                            className="w-20 mt-1 p-2 bg-white border border-gray-300 rounded-md
                                                    shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            onChange={(e)=>{
                                                f.current.limit = parseInt(e.target.value);
                                                onFilter(f.current);
                                            }}
                                            >
                                                <option value={10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                        </select>
                                    </div>
                                    <div className='px-3 text-sm font-light mb-1'>Showing: {from} to {to} of {data.total}</div>
                                    <div className='float-right lg:float-clear mb-1'>
                                        <ul className="inline-flex items-center -space-x-px">
                                            <li>
                                                <a href="#"
                                                    onClick={()=>{
                                                        if(f.current.page == 0) return;
                                                        f.current.page--;
                                                        onFilter(f.current);
                                                    }}
                                                    className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">Previous</a>
                                            </li>
                                            <li>
                                                <input className="px-3 max-w-72 min-w-20 h-fit py-1.5 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                                                    style={{width:"60px"}} value={f.current.page} max={maxPage} min={0} type={'number'}
                                                    onChange={(e)=>{
                                                        f.current.page = parseInt(e.target.value);
                                                        onFilter(f.current);
                                                    }}
                                                />
                                            </li>
                                            <li>
                                                <a href="#"
                                                    onClick={()=>{
                                                        if(f.current.page == maxPage) return;
                                                        f.current.page++;
                                                        onFilter(f.current);
                                                    }}
                                                    className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">Next</a>
                                            </li>
                                        </ul>
                                    </div>
                                </nav>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </>
    )
}