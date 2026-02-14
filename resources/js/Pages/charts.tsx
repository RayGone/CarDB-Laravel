import { Head, usePage } from "@inertiajs/react";
import type { FC, PropsWithChildren } from "react";

import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, LabelList, ResponsiveContainer } from "recharts";
import { PieChart, Pie } from "recharts";
// import {} from "@recharts/devtools";

import Spinner from "@/components/custom/Spinner";
import {useFetchCarAttributesChartData, useFetchCarModelCountChartData} from "@/hooks";

import AppLayout from "@/layouts/app-layout";

import { charts } from "@/routes";

import type { ApiChartResponse, BreadcrumbItem, SharedData } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Charts',
        href: charts().url,
    },
];

function getBarChartData(data: ApiChartResponse[]){
    const unique_origins: string[] = [...new Set(data.map((row)=> row['origin']))];
    const unique_dates: string[] = [...new Set(data.map((row)=> row['model_year']))];

    const stackedData = data.map(row => {
        return {
            model_year: row['model_year'],
            [row['origin']]: row['count']
        }
     });

    const chartData = unique_dates.map(date => stackedData.
                                                filter(row => row['model_year'] == date).
                                                reduce((acc, item) =>  ({ ...acc, ...item }), {})).
                                        map(row => (
                                            {
                                                ...row,
                                                total: Object.entries(row).
                                                                filter(entry => unique_origins.includes(entry[0])).
                                                                reduce((acc, entry) => acc + (entry[1] as number), 0)
                                            }));

    return [unique_origins, chartData]
}

function getPieChartData(data:ApiChartResponse[]){
    const colors = colorGenerator();

    const unique_origins: string[] = [...new Set(data.map((row)=> row['origin']))];
    const pieChartData = unique_origins.map(origin => (
        {
            "origin": origin,
            count: data.
                    filter(row => row['origin']==origin).
                    reduce( (acc, row) => (acc+row.count), 0),
            fill: colors.next().value
        }
    ));

    return pieChartData;
}

const colors = [
    '#8884d8',
    '#1bb1cb',
    '#067a53',
    '#d884d4',
    '#05b77b',
    '#2cb50d',
    '#939f16',
    '#bd21b6',
    '#1b4a3a',
    '#6f2e6c',
    '#d88484'
]

function* colorGenerator() {
    for(const color of colors){
        yield color;
    }
    return '#afd847';
}

const ChartTitle: FC<PropsWithChildren> = ({children}: PropsWithChildren) =>
                        <div className="w-full text-2xl font-bold self-center text-center text-shadow-sm underline">{children}</div>

export default () => {
    const modelCount = useFetchCarModelCountChartData();
    const {attributeData, attributeLoading, setAttributeValueOrder} = useFetchCarAttributesChartData();
    // console.log({attributeData, attributeLoading})
    const [origins, barChartData] = getBarChartData(modelCount.data);
    const pieChartData = getPieChartData(modelCount.data);

    const color = colorGenerator();
    return <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Charts" />

            <div className="w-full flex flex-row flex-wrap gap-1 justify-between">
                <div className="flex flex-col w-full md:w-[49%] min-h-[300px] col-span-1 p-2 bg-gray-200 dark:bg-gray-800">
                    <ChartTitle>Number of New Models / Year</ChartTitle>

                    {modelCount.loading && <Spinner className="self-center justify-self-center"></Spinner>}

                    <ResponsiveContainer width="100%" aspect={1.618} maxHeight={400}>
                            <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="model_year" />
                            <YAxis width="auto" />
                            <Tooltip labelClassName="text-shadow-sm dark:text-gray-900 underline" />
                            <Legend />
                            <Bar style={{width: '100%'}} dataKey={'total'} fill={colors[0]} isAnimationActive={true} >
                                    <LabelList dataKey={'total'} position="top" className="text-sm"/>
                            </Bar>
                        {/* <RechartsDevtools /> */}
                        </BarChart>
                    </ResponsiveContainer>

                </div>
                <div className="flex flex-col w-full md:w-[49%] min-h-[300px] col-span-1 p-2 bg-gray-200 dark:bg-gray-800">
                    <ChartTitle>Car Model Share / Origin</ChartTitle>

                    {modelCount.loading && <Spinner className="self-center justify-self-center"></Spinner>}

                    <ResponsiveContainer width="100%" aspect={1.618} maxHeight={400}>
                        <PieChart>
                                {/* style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }} responsive> */}

                            <Tooltip labelClassName="text-shadow-sm dark:text-gray-900 underline" />
                            <Legend />
                            <Pie
                                data={pieChartData}
                                dataKey="count"
                                nameKey="origin"
                                cx="50%"
                                cy="50%"
                                fill="#8884d8"
                                isAnimationActive={true}>
                                <LabelList fill="#222" dataKey="origin" position="inside" className="text-sm text-shadow-sm"/>
                            </Pie>
                            {/* <RechartsDevtools /> */}
                        </PieChart>
                    </ResponsiveContainer>

                </div>

                <div className="w-full flex flex-col min-h-[300px] p-2 bg-gray-200 dark:bg-gray-800">
                    <ChartTitle>New Car Model / Year / Origin</ChartTitle>

                    {modelCount.loading && <Spinner className="self-center justify-self-center"></Spinner>}
                    <ResponsiveContainer width="100%" aspect={1} maxHeight={400}>
                        <BarChart title="New Car Model / Year / Origin"  data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="model_year" />
                            <YAxis width="auto" />
                            <Tooltip labelClassName="text-shadow-sm dark:text-gray-900 underline" />
                            <Legend />
                            {origins.map(origin => {
                                return <Bar style={{width: '100%'}} key={origin} dataKey={origin} fill={color.next().value} isAnimationActive={true} >
                                    <LabelList dataKey={origin} position="top" className="text-sm"/>
                                </Bar>
                            })}
                        {/* <RechartsDevtools /> */}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>


            <br />
            <hr />
            <br />

            <div className="w-full flex flex-row flex-wrap gap-1 justify-between">
                <ChartTitle>Car Attributes</ChartTitle>
                <div className="w-full flex flex-row justify-end items-center gap-2 bg-background shadow-xs px-5">
                    <label htmlFor="order" className="font-bold underline">Attribute Value: </label>
                    <select id="order" className="dark:bg-slate-800 rounded-md px-5 py-2" onChange={(e) => {const direction=e.target.value == "asc"? "asc" : "desc"; setAttributeValueOrder(direction)}}>
                        <option value='desc' selected>High</option>
                        <option value='asc'>Low</option>
                    </select>
                </div>
                <div className="flex flex-col w-full md:w-[49%] min-h-[300px] col-span-1 p-2 bg-gray-200 dark:bg-gray-800">
                    <ChartTitle>Acceleration</ChartTitle>

                    {attributeLoading && <Spinner className="self-center justify-self-center"></Spinner>}
                    <ResponsiveContainer width="100%" aspect={1.618} maxHeight={400}>
                            <BarChart data={attributeData['acceleration']}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis width="auto" />
                            <Tooltip labelClassName="text-shadow-sm dark:text-gray-900 underline" />
                            <Legend />
                            <Bar style={{width: '100%'}} dataKey={'acceleration'} fill={colors[0]} isAnimationActive={true} >
                                    <LabelList dataKey={'acceleration'} position="top" className="text-sm"/>
                            </Bar>
                        {/* <RechartsDevtools /> */}
                        </BarChart>
                    </ResponsiveContainer>

                </div>
                <div className="flex flex-col w-full md:w-[49%] min-h-[300px] col-span-1 p-2 bg-gray-200 dark:bg-gray-800">
                    <ChartTitle>Horsepower</ChartTitle>

                    {attributeLoading && <Spinner className="self-center justify-self-center"></Spinner>}
                    <ResponsiveContainer width="100%" aspect={1.618} maxHeight={400}>
                            <BarChart data={attributeData['power']}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name"/>
                            <YAxis width="auto" />
                            <Tooltip labelClassName="text-shadow-sm dark:text-gray-900 underline" />
                            <Legend />
                            <Bar style={{width: '100%'}} dataKey={'horsepower'} fill={colors[0]} isAnimationActive={true} >
                                    <LabelList dataKey={'horsepower'} position="top" className="text-sm"/>
                            </Bar>
                        {/* <RechartsDevtools /> */}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-col w-full md:w-[49%] min-h-[300px] col-span-1 p-2 bg-gray-200 dark:bg-gray-800">
                    <ChartTitle>Mileage</ChartTitle>

                    {attributeLoading && <Spinner className="self-center justify-self-center"></Spinner>}

                    <ResponsiveContainer width="100%" aspect={1.618} maxHeight={400}>
                            <BarChart data={attributeData['mileage']}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name"/>
                            <YAxis width="auto" />
                            <Tooltip labelClassName="text-shadow-sm dark:text-gray-900 underline" />
                            <Legend />
                            <Bar style={{width: '100%'}} dataKey={'mpg'} fill={colors[0]} isAnimationActive={true} >
                                    <LabelList dataKey={'mpg'} position="top" className="text-sm"/>
                            </Bar>
                        {/* <RechartsDevtools /> */}
                        </BarChart>
                    </ResponsiveContainer>

                </div>
                <div className="flex flex-col w-full md:w-[49%] min-h-[300px] col-span-1 p-2 bg-gray-200 dark:bg-gray-800">
                    <ChartTitle>Engine Size (Cylinders)</ChartTitle>
                    <ResponsiveContainer width="100%" aspect={1.618} maxHeight={400}>
                        <PieChart>
                                {/* style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }} responsive> */}

                            <Tooltip labelClassName="text-shadow-sm dark:text-gray-900 underline" />
                            <Legend />
                            <Pie
                                data={attributeData['engine']?.map(row => ({...row, 'cylinders': `Cylinders(${row['cylinders']})`, fill: color.next().value}))}
                                dataKey="count"
                                nameKey="cylinders"
                                cx="50%"
                                cy="50%"
                                fill="#8884d8"
                                isAnimationActive={true}>
                                {/* <LabelList fill="#222" dataKey="cylinders" position="inside" className="text-sm text-shadow-sm"/> */}
                            </Pie>
                            {/* <RechartsDevtools /> */}
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>


        </AppLayout>;
}
