import { Column, OP, CarResponse, DataFilterModel } from "@/types";

export const columnDef: Column[] = [
  {
    key: 'id',
    header: "ID",
    type: "number"
  },
  {
    key: 'name',
    header: "Car Name",
    type: "string"
  },
  {
    key: 'origin',
    header: "Origin",
    type: "string"
  },
  {
    key: 'model_year',
    header: "Model Year",
    type: "number"
  },
  {
    key: 'acceleration',
    header: "Acceleration",
    type: "number"
  },
  {
    key: 'horsepower',
    header: "Horsepower",
    type: "number"
  },
  {
    key: 'mpg',
    header: "MPG",
    type: "number"
  },
  {
    key: 'weight',
    header: "Weight",
    type: "number"
  },
  {
    key: 'cylinders',
    header: "Cylinders",
    type: "number"
  },
  {
    key: 'displacement',
    header: "Displacement",
    type: "number"
  },
];

export const filterAttributes = columnDef.filter((col) => col.key != 'id').filter( col => col.key != 'name').filter(col=> col.key != 'origin');
export const filterOps: OP[] = [
  {
    key: '==',
    value: 'Equals'
  },
  {
    key: '!=',
    value: 'Not Equals'
  },
  {
    key: '>',
    value: 'Greater Than'
  },
  {
    key: '<',
    value: 'Less Than'
  },
  {
    key: '>=',
    value: 'Greater Than or Equals'
  },
  {
    key: '<=',
    value: 'Less Than or Equals'
  },
];

export const emptyCarResponse: CarResponse = {
    cars: [],
    total: 0
}

export const initFilter: DataFilterModel = {
    filter: [],
    limit: 20,
    order: 'asc',
    orderBy: 'id',
    search: '',
    page: 0,
}

export const setFilter = (filter: DataFilterModel) => {
    localStorage.setItem("filter", JSON.stringify(filter));
}

export const getFilter = () => {
    const fs = localStorage.getItem('filter')
    if(fs)
        return JSON.parse(fs)
    return initFilter
}
