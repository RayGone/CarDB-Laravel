import SecondaryButton from '@/Components/SecondaryButton';
import ActionButton from '@/Components/ActionButton';
import Dropdown from '@/Components/Dropdown';
import SearchBox from '@/Components/Searchbox';
import {getFilter} from "@/model";

export default function DashboardHeader({onSearch, onAdd=()=>{}, onOpenFilter=()=>{}}: {onSearch?: (s: string)=>void, onAdd?: ()=>void, onOpenFilter?: ()=>void}){
    const f = getFilter();
    return <>
        <h2 className="font-semibold text-xl text-gray-800 leading-tight"><span className='hidden md:block'>Dashboard</span></h2>

        <div className='flex flex-row items-center justify-end'>
            <SearchBox onSearch={onSearch} value={f.search}/>
            <div className='mr-2' onClick={()=>onAdd()}>
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

            <div className='mr-2 block lg:hidden' onClick={()=>onOpenFilter()} >
                <SecondaryButton className='hidden md:block lg:hidden'>Filters</SecondaryButton>

                <ActionButton className='block md:hidden' title={"Filters"}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                    </svg>
                </ActionButton>
            </div>

        </div>

    </>;
}
