import React, { useState } from 'react';
import { Column, CarResponse } from '@/types';

export default function TableHead({headDef, action, sort}: {headDef: Column[], action: boolean, sort?: string}){
    return <thead>
        <tr className='group sticky-head bg-white mt-2'>
            {
                headDef.map((col: Column) => {
                    return <th key={col.key} className='px-4 py-2 border-2'>{col.header}</th>
                })
            }

            {
                (action) && <th className='px-4 py-2 border-2 bg-white sticky-right'>
                    Action
                </th>
            }
        </tr>
    </thead>;
}
