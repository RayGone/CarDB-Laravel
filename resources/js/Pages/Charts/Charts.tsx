import { useEffect, useRef, useState } from 'react';
// import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Label, Field } from '@headlessui/react';
// import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { ChartsWrapper } from './Charts.styled';

import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Plot from 'react-plotly.js';
import { Data } from 'plotly.js';

type modelCountPerYear = {model_year: string[], count: number[]}
type dictionary = {[index: string]: number | string | boolean}
type array_dictionary = {[index: string]: (number | string | boolean)[]}

export default function Charts({ auth, years, brands }: PageProps<{"years": string[], "brands": string[]}>) {
    // console.log({years, brands})
    brands.sort()

    const abortController = useRef<any>({control: null});
    abortController.current.control = new AbortController();

    // Controls ---
    const [selectedBrand, setSelectedBrand] = useState("all")

    // Data ---
    const [mpyUpdate, setMpyUpdate] = useState<number>(0);
    const [modelPerYear, setModelPerYear] = useState<modelCountPerYear>({"model_year":[], "count": []});
    const [countModelOriginPerYear, setCountModelOriginPerYear] = useState<dictionary[]>([{"model_year":"1995-1-1", "count": 0, "origin": 'somewhere'}]);
    const barChart: Data[] = [{
                        type: 'bar',
                        x: modelPerYear['model_year'],
                        y: modelPerYear['count'],
                    }];

    const d: {[index: string]: array_dictionary} = {};
    let stackedChart: any = [];
    let originPieChartData: any = {};

    for(let i=0; i<countModelOriginPerYear.length; i++){
        let key = countModelOriginPerYear[i]['origin'] as string;
        if(key in d){
            d[key]['count'].push(countModelOriginPerYear[i]['count'])
            d[key]['model_year'].push(countModelOriginPerYear[i]['model_year'])
        }else{
            d[key] = {'count': [], 'model_year': []}
            d[key]['count'] = [countModelOriginPerYear[i]['count']]
            d[key]['model_year'] = [countModelOriginPerYear[i]['model_year']]
        }
    }
    for(let k in d){
        stackedChart.push({
            type: 'bar',
            x: d[k]['model_year'],
            y: d[k]['count'],
            name: k
        });

        originPieChartData[k] = (d[k]['count'] as number[]).reduce((total, current) => total + current, 0)
    }
    const originPieChart: Data[] = [{type: "pie", values: Object.values(originPieChartData), labels: Object.keys(originPieChartData)}];

    useEffect(() => {
        console.log({selectedBrand});
        window.axios.post(route('api.cars.countPerYear'), {"brand": selectedBrand}, {
            headers:{
                Authorization: `Bearer ${auth.apiToken}`
            },
            signal: abortController.current.control.signal,
        }).then((res) => {
            if(res.statusText == "OK"){
                let mpy: dictionary = {};
                for(const e of res.data){
                    let year = (e as any)['model_year'];
                    if(year in mpy)
                        mpy[year] += (e as any)['count']
                    else
                        mpy[year] = (e as any)['count']
                }

                var dt: modelCountPerYear = {"model_year": [], "count": []};
                for(const k in mpy){
                    dt['model_year'].push(k)
                    dt['count'].push(mpy[k] as number)
                }
                setModelPerYear(dt);
                setCountModelOriginPerYear(res.data);
            }
        }).catch((error)=>{
            console.log({error})
        })
    }, [auth, selectedBrand])

    return (
        <>
        <Head title="Charts" />
        <AuthenticatedLayout
            user={auth.user}
            className='hidden md:block'
            header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'><span>Charts</span></h2>}
        >
            <div className='w-[99vw] h-[85vh] block'>
                {/* <div className='hidden flex w-full content-center gap-2 bg-orange-50 p-2'>
                    <div className='bg-gray-50 p-1 rounded w-150'>
                        <Field className={"flex items-center gap-2 no-wrap text-center my-auto text-gray-800"}>
                            <Label>Brand: </Label>
                            <Listbox value={selectedBrand} onChange={setSelectedBrand}>
                                <ListboxButton
                                    className={"relative w-full rounded-lg bg-blue-400 py-1.5 pr-8 pl-3 text-left text-sm/6 text-gray-900 \
                                            'focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-blue/25"}
                                    >
                                        {selectedBrand.toUpperCase()}
                                    <ChevronDownIcon
                                        className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-blue/60"
                                        aria-hidden="true"
                                    />
                                </ListboxButton>
                                <ListboxOptions anchor="bottom" className={"h-200 rounded-xl border border-white-50 bg-blue-400 p-1 focus:outline-none \
                                        transition duration-100 ease-in data-leave:data-closed:opacity-0"}>

                                    <ListboxOption
                                        key={"all"}
                                        value={"all"}
                                        className="group flex cursor-pointer border-solid border-black border-b-2 items-center gap-2 px-3 py-1.5 hover:bg-blue-300"
                                    >
                                        <div className="text-sm/6 text-black">{"ALL"}</div>
                                    </ListboxOption>
                                    {
                                        brands.map((brand) => (
                                            <ListboxOption
                                                key={brand}
                                                value={brand}
                                                className="group flex cursor-pointer border-solid border-black border-b-2 items-center gap-2 px-3 py-1.5 hover:bg-blue-300"
                                            >
                                                <div className="text-sm/6 text-black">{brand.toUpperCase()}</div>
                                            </ListboxOption>
                                        ))
                                    }
                                </ListboxOptions>
                            </Listbox>
                        </Field>
                    </div>
                </div> */}

                {/* =====Charts Below====== */}
                <div className="grid grid-cols-2">
                    <ChartsWrapper className='md:col-span-1 col-span-2'>
                        <Plot
                            data={barChart}
                            layout={{title: {text: 'Car Models / year'}, height: 400}}
                            config={{responsive: true}}
                            className='w-full block'
                            revision={mpyUpdate}
                        />
                    </ChartsWrapper>
                    <ChartsWrapper className='md:col-span-1 col-span-2'>
                        <Plot
                            data={originPieChart}
                            layout={{title: {text: 'Car Models / Origin'}, height: 400}}
                            config={{responsive: true}}
                            className="w-full block"
                            revision={mpyUpdate}
                        />
                    </ChartsWrapper>
                </div>

                <ChartsWrapper className=''>
                    <Plot
                        data={stackedChart}
                        layout={{title: {text: 'New Car Model / Year / Origin'},
                            barmode: 'group', height: 400}}
                        config={{responsive: true}}
                        className="w-full"
                    />
                </ChartsWrapper>
            </div>
        </AuthenticatedLayout>
        </>
    );
}

