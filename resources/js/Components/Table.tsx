import React, { useState, useRef } from 'react';
import {  CarResponse, DataFilterModel } from '@/types';
import { columnDef, getFilter } from '@/model';
import TableHead from './TableHead';
import Spinner from './Spinner';

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
            <table className="bg-white min-w-full table-auto text-xs md:text-sm lg:text-base border-collapse">
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
                                <Spinner />
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
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>
                                        <button key='Delete' className='hover:bg-blue-50 text-red-500 font-bold py-3 px-3 rounded-full'  onClick={()=>{onDelete(car.id)}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-5">
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
                                        <span className='px-3 font-light'>Rows Per Page</span>
                                        <select id="options"
                                            value={f.current.limit}
                                            className="w-20 mt-1 p-2 bg-white border border-gray-300 rounded-md text-xs md:text-sm
                                                    shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            onChange={(e)=>{
                                                f.current.limit = parseInt(e.target.value);
                                                onFilter(f.current);
                                            }}
                                            >
                                                <option value={10} className='text-xs md:text-sm'>10</option>
                                                <option value={20} className='text-xs md:text-sm'>20</option>
                                                <option value={50} className='text-xs md:text-sm'>50</option>
                                                <option value={100} className='text-xs md:text-sm'>100</option>
                                        </select>
                                    </div>
                                    <div className='float-right lg:float-clear mb-1'>
                                        &nbsp;&nbsp; Showing: {from} to {to} of {data.total} &nbsp;&nbsp;
                                        <ul className="inline-flex items-center -space-x-px">
                                            <li>
                                                <a href="#"
                                                    onClick={()=>{
                                                        if(f.current.page == 0) return;
                                                        f.current.page--;

                                                        if(f.current.page > maxPage) f.current.page = maxPage;
                                                        onFilter(f.current);
                                                    }}
                                                    className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">Previous</a>
                                            </li>
                                            <li>
                                                <input className="px-3 min-w-16 md:min-w-20 py-1.5 text-gray-500 bg-white border border-gray-300
                                                                    hover:bg-gray-100 hover:text-gray-700 text-xs md:text-sm"
                                                    style={{width:"60px"}} value={f.current.page} max={maxPage} min={0} type={'number'}
                                                    onChange={(e)=>{
                                                        const v = e.target.value ? parseInt(e.target.value) : 0
                                                        const value = v > maxPage ? maxPage: v;

                                                        f.current.page = value;
                                                        onFilter(f.current);
                                                    }}
                                                />
                                            </li>
                                            <li>
                                                <a href="#"
                                                    onClick={()=>{
                                                        f.current.page++;
                                                        if(f.current.page > maxPage) f.current.page = maxPage;
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
