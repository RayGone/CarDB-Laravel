import { useEffect, useState } from 'react';
import { columnDef, getFilter } from '@/model';

import type { Car, CarResponse, DataFilterModel } from '@/types';
import Spinner from './Spinner';
import TableHead from './TableHead';

interface TableComponentProps {
    data: CarResponse; // Optional prop
    onFilter: (f: DataFilterModel) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    loading: boolean;
}

export default function Table({
    data,
    onFilter,
    onEdit,
    onDelete,
    loading = false,
}: TableComponentProps) {
    const f = getFilter();
    const from = f?.page * f.limit;

    const [paginationState, setPaginationState] = useState({
        from: from,
        to: from + data.cars.length,
        page: f.page,
        maxPage: Math.ceil(data.total / f.limit) - 1,
    });

    useEffect(() => {
        const f = getFilter();

        const from = f?.page * f.limit;
        setTimeout(() => {
            setPaginationState({
                from: from,
                to: from + data.cars.length,
                maxPage: Math.ceil(data.total / f.limit) - 1,
                page: f.page,
            });
        }, 1);
    }, [data]);

    return (
        <>
            <table className="min-w-full table-auto border-collapse bg-white text-xs md:text-sm lg:text-base dark:bg-slate-800">
                <TableHead
                    headDef={columnDef}
                    action={true}
                    sort={{ order: f.order, orderBy: f.orderBy }}
                    onSort={(sort) => {
                        const f = getFilter();
                        f.order = sort.order;
                        f.orderBy = sort.orderBy;
                        onFilter(f);
                    }}
                />

                <tbody className="text-xs">
                    {!loading && (data.total == 0 || data.cars.length == 0) && (
                        <tr>
                            <td colSpan={7} className="px-4 py-2 font-bold">
                                No Data
                            </td>
                        </tr>
                    )}
                    {
                        // Loading screen
                        loading && (
                            <tr>
                                <td colSpan={7} className="px-4 py-2 font-bold">
                                    <Spinner />
                                </td>
                            </tr>
                        )
                    }
                    {data.cars.map((car: Car) => {
                        return (
                            <tr
                                key={car.id}
                                className="odd:bg-background even:bg-gray-200 dark:even:bg-gray-800"
                            >
                                {columnDef.map((col) => (
                                    <td key={col.key} className="px-2 py-1">
                                        {car[col.key]}
                                    </td>
                                ))}
                                <td className="sticky-right bg-inherit px-4 py-2">
                                    <div className="flex flex-row dark:border-slate-700">
                                        <button
                                            key="Edit"
                                            className="text-gray rounded-full px-3 py-3 font-bold hover:bg-blue-50 dark:text-gray-50 dark:hover:bg-blue-900"
                                            onClick={() => {
                                                onEdit(car.id as number);
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="size-4 md:size-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            key="Delete"
                                            className="rounded-full px-3 py-3 font-bold text-red-500 hover:bg-blue-50 dark:hover:bg-blue-900"
                                            onClick={() => {
                                                onDelete(car.id as number);
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="size-4 md:size-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot className="sticky-foot border-1 bg-background">
                    <tr className="shadow-up">
                        <td colSpan={12}>
                            <div className="mt-1 flex justify-end">
                                <nav
                                    aria-label="Page navigation"
                                    className="sticky-right px-4 py-2"
                                >
                                    <div className="flex flex-col items-end justify-center lg:flex-row lg:items-center lg:justify-end">
                                        <div className="mb-1">
                                            <span className="px-3 font-light">
                                                Rows Per Page
                                            </span>
                                            <select
                                                id="options"
                                                value={f.limit}
                                                className="mt-1 w-20 rounded-md border border-gray-300 bg-white p-2 text-xs shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none md:text-sm dark:bg-gray-800"
                                                onChange={(e) => {
                                                    const f = getFilter();
                                                    f.limit = parseInt(
                                                        e.target.value,
                                                    );
                                                    onFilter(f);
                                                }}
                                            >
                                                <option
                                                    value={10}
                                                    className="text-xs md:text-sm"
                                                >
                                                    10
                                                </option>
                                                <option
                                                    value={20}
                                                    className="text-xs md:text-sm"
                                                >
                                                    20
                                                </option>
                                                <option
                                                    value={50}
                                                    className="text-xs md:text-sm"
                                                >
                                                    50
                                                </option>
                                                <option
                                                    value={100}
                                                    className="text-xs md:text-sm"
                                                >
                                                    100
                                                </option>
                                            </select>
                                        </div>
                                        <div className="mb-1">
                                            &nbsp;&nbsp; Showing:{' '}
                                            {paginationState.from} to{' '}
                                            {paginationState.to} of {data.total}{' '}
                                            &nbsp;&nbsp;
                                            <ul className="inline-flex items-center -space-x-px">
                                                <li>
                                                    <a
                                                        href="#"
                                                        onClick={() => {
                                                            const f =
                                                                getFilter();
                                                            if (f.page == 0)
                                                                return;
                                                            f.page--;

                                                            if (
                                                                f.page >
                                                                paginationState.maxPage
                                                            )
                                                                f.page =
                                                                    paginationState.maxPage;
                                                            onFilter(f);
                                                        }}
                                                        className="rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-600 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-900/30 dark:hover:text-gray-300"
                                                    >
                                                        Prev
                                                    </a>
                                                </li>
                                                <li>
                                                    <input
                                                        className="min-w-16 border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-700 md:min-w-20 md:text-sm dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-900/30 dark:hover:text-gray-300"
                                                        style={{
                                                            width: '60px',
                                                        }}
                                                        value={
                                                            paginationState.page
                                                        }
                                                        max={
                                                            paginationState.maxPage
                                                        }
                                                        min={0}
                                                        type={'number'}
                                                        onChange={(e) => {
                                                            const f =
                                                                getFilter();
                                                            const v = e.target
                                                                .value
                                                                ? parseInt(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                                : 0;
                                                            const value =
                                                                v >
                                                                paginationState.maxPage
                                                                    ? paginationState.maxPage
                                                                    : v;

                                                            f.page = value;
                                                            onFilter(f);
                                                        }}
                                                    />
                                                </li>
                                                <li>
                                                    <a
                                                        href="#"
                                                        onClick={() => {
                                                            const f =
                                                                getFilter();
                                                            f.page++;
                                                            if (
                                                                f.page >
                                                                paginationState.maxPage
                                                            )
                                                                f.page =
                                                                    paginationState.maxPage;
                                                            onFilter(f);
                                                        }}
                                                        className="rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-600 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-900/30 dark:hover:text-gray-300"
                                                    >
                                                        Next
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </>
    );
}
