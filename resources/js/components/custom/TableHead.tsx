import type { Column } from '@/types';

interface Sort{
    order: string;
    orderBy: string;
}

interface TableHeadPropTypes{
    headDef: Column[];
    action: boolean;
    sort?: Sort;
    onSort?: (sort: Sort)=>void;
}

export default function TableHead({headDef, action, sort={order:'asc',orderBy:'id'}, onSort=(sort: Sort)=>{}}: TableHeadPropTypes){
    return <thead className='sticky-head'>
        <tr className='group bg-white dark:bg-slate-900 shadow-down cursor-pointer border-2 dark:border-slate-700 border-separate'>
            {
                headDef.map((col: Column) => {
                    return <th key={col.key} className='px-3 py-2 text-sm'
                             onClick={()=>{
                                if(sort.orderBy == col.key){
                                    const order = sort.order == 'asc' ? 'desc' : 'asc';
                                    const key = col.key

                                    onSort({order: order, orderBy: key});
                                }else{
                                    const key = col.key
                                    const order = 'asc'

                                    onSort({order: order, orderBy: key});
                                }

                             }}>
                        <span className='flex gap-1 items-center justify-between font-thin'>
                            {col.header}
                            {
                                sort.orderBy == col.key && <span>
                                    {
                                        sort.order == 'asc' &&
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                            </svg>
                                    }
                                    {
                                        sort.order == 'desc' &&
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                            </svg>
                                    }

                                </span>
                            }
                        </span>
                    </th>
                })
            }

            {
                (action) && <th className='px-4 py-2 border-2 bg-white dark:bg-slate-900 dark:border-slate-700 sticky-right font-thin text-sm'>
                    Action
                </th>
            }
        </tr>
    </thead>;
}
