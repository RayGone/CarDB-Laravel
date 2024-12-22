import { HTMLAttributes, useReducer, useState } from "react";
import ActionButton from "./ActionButton"
import { FilterModel } from "@/types";
import PrimaryButton from "./PrimaryButton";
import { filterAttributes, filterOps, initOps } from "@/model";



/**
 * FilterComponent Component
 * @returns React.FunctionalComponent
 */
export function FilterComponent({filter, onRemove}: {filter: FilterModel, onRemove: ()=>void}){
    return <div className='inline-flex items-center justify-center p-2 w-full border rounded my-2'>
        <div className='flex flex-col justify-center items-center mr-2 pr-4 border-r'>
            <span className="text-lg font-bold">{filterAttributes.filter((f) => f.key == filter.field).map((f)=>f.header)}</span>
            <span className="text-base font-thin">{filterOps.filter((f) => f.key == filter.ops).map((f)=>f.value)}</span>
            <div className="rounded-full bg-gray-100 p-2 w-8 h-8 flex items-center justify-center"><span className="text-sm font-thinner">{filter.value}</span></div>
        </div>
        <div className='flex flex-col justify-around m-2'>
            <ActionButton onClick={()=>onRemove()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-red-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </ActionButton>
        </div>
    </div>;
}

/**
 * AddFilter Component
 * @returns React.FunctionalComponent
 */
export function AddFilter({onClose, onAdd}: {onAdd: (f: FilterModel)=>void, onClose: (e?: any)=>void}){
    function filterAddReducer(state: FilterModel, action: Partial<FilterModel>): FilterModel{
        return {
            ...state,
            ...action
        }
    }
    const [addFilterState, addFilterDispatcher] = useReducer<typeof filterAddReducer>(filterAddReducer, initOps);

    function handleAdd(){
        if(addFilterState.field == "-1" || addFilterState.ops == "-1"){
            return;
        }

        if(addFilterState.value == '' || parseInt(addFilterState.value) < 0){
            addFilterDispatcher({value:'0'})
            return;
        }
        onAdd(addFilterState)
    }

    return <div className='inline-flex items-center p-2 w-full'>
        <div className='flex flex-col w-5/6'>
            Add Filter
            <hr /><br />

            <label htmlFor="attribute" className="text-sm font-thin">Attribute:</label>
            <select id="attribute" className='rounded py-2 mb-3' value={addFilterState.field} aria-placeholder='Attribute' onChange={(e)=>{addFilterDispatcher({field: e.target.value})}}>
                <option value={'-1'} className="text-sm font-thin">Select Attribute</option>
                {
                    filterAttributes.map((attr)=><option key={attr.key} value={attr.key}>
                        {attr.header}
                    </option>)
                }
            </select>

            <label htmlFor='ops'  className="text-sm font-thin">Condition</label>
            <select id="ops" className='rounded py-2 mb-3' aria-placeholder='Conditions' value={addFilterState.ops} onChange={(e)=>{addFilterDispatcher({ops: e.target.value})}}>
                <option value={'-1'} className="text-sm font-thin">Select Condition</option>
                {
                    filterOps.map((op)=><option key={op.key} value={op.key}>
                        {op.value}
                    </option>)
                }
            </select>

            <label htmlFor='value'  className="text-sm font-thin">Value</label>
            <input id='value' value={addFilterState.value} min={0} type='number' className='rounded py-2 mb-3' placeholder='Value' aria-placeholder='Value' onChange={(e)=>{addFilterDispatcher({value: e.target.value})}}/>
        </div>
        <div className='flex flex-col justify-around ml-2'>
            <ActionButton onClick={()=>handleAdd()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-green-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            </ActionButton>

            <ActionButton onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </ActionButton>
        </div>
    </div>;
}

/**
 * FilterView Component
 * @returns React.FunctionalComponent
 */
export default function FilterView(
        { className = '', children, onFilter, onRemove, model, ...props }: HTMLAttributes<HTMLDivElement> &
            {model: FilterModel[], onFilter: (f: FilterModel)=> void, onRemove: (f:FilterModel)=>void}){

    const [openAddFilter, setOpenAddFilter] = useState<boolean>(true);

    return <div className={"bg-white shadow-sm sm:rounded-lg p-2 flex flex-col " + className} {...props}>
        <div className='inline-flex items-center justify-between p-2 w-full'>
            <span className='title font-bold text-xl'>Filters</span>
            <ActionButton className='active:bg-transparent' onClick={()=>{setOpenAddFilter(true)}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </ActionButton>
        </div>
        <hr className='border-t-2' />

        {
            openAddFilter && <>
                <AddFilter onClose={(e)=>{setOpenAddFilter(false)}} onAdd={(f)=>{onFilter(f); setOpenAddFilter(false);}} />
                <hr className='border-t-2' />
            </>
        }

        {
            model.length > 0 && model.map((f)=>{
                return <FilterComponent key={f.field+f.value} filter={f} onRemove={()=>{onRemove(f)}}/>
            })
        }

        {model.length <= 0 && children}
    </div>;
}
