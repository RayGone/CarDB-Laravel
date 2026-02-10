import {getFilter} from "@/model";
import { download } from "@/routes/api/cars";

import ActionButton from './ActionButton';
import Dropdown from './Dropdown';
import SearchBox from './Searchbox';
import SecondaryButton from './SecondaryButton';

export default function DashboardHeader({onSearch, onAdd=()=>{}, onOpenFilter=()=>{}}: {onSearch?: (s: string)=>void, onAdd?: ()=>void, onOpenFilter?: ()=>void}){
    const f = getFilter();
    return <>
        <div className='flex flex-row items-center justify-end mb-2 dark:text-gray-50 '>
            <SearchBox onSearch={onSearch} value={f.search}/>
            <div className='mr-2' onClick={()=>onAdd()}>
                <SecondaryButton className='hidden md:inline-flex dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600'>Add Car</SecondaryButton>
                <ActionButton className='block md:hidden dark:text-gray-50 dark:border-gray-600' title='Add Car'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </ActionButton>
            </div>
            <div className="mr-2 relative">
                <Dropdown>
                    <Dropdown.Trigger>
                        <SecondaryButton className='hidden md:inline-flex dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600'>Download</SecondaryButton>
                        <ActionButton title="Download Data" className='block md:hidden'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </ActionButton>
                    </Dropdown.Trigger>

                    <Dropdown.Content contentClasses="bg-white dark:bg-gray-700 ">
                        <Dropdown.Anchor className="dark:text-gray-50 rounded-t-md" href={download({type: 'csv'}).url}>CSV</Dropdown.Anchor>
                        <hr />
                        <Dropdown.Anchor className="dark:text-gray-50 rounded-b-md" href={download({type:"json"}).url}>JSON</Dropdown.Anchor>
                    </Dropdown.Content>
                </Dropdown>
            </div>

            <div className='mr-2' onClick={()=>onOpenFilter()} >
                <SecondaryButton className='hidden md:inline-flex lg:hidden dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600'>Filters</SecondaryButton>

                <ActionButton className='block md:hidden' title={"Filters"}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                    </svg>
                </ActionButton>
            </div>

        </div>

    </>;
}
