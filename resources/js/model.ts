import { Column, OP, CarResponse, DataFilterModel, FilterModel, Car } from "@/types";

export const columnDef: Column[] = [
  {
    key: 'id',
    header: "ID",
    type: "number",
    required: false
  },
  {
    key: 'name',
    header: "Car Name",
    type: "text",
    required: true
  },
  {
    key: 'origin',
    header: "Origin",
    type: "text",
    required: true
  },
  {
    key: 'model_year',
    header: "Model Year",
    type: "date",
    required: true
  },
  {
    key: 'acceleration',
    header: "Acceleration",
    type: "number",
    required: false
  },
  {
    key: 'horsepower',
    header: "Horsepower",
    type: "number",
    required: false
  },
  {
    key: 'mpg',
    header: "MPG",
    type: "number",
    required: false
  },
  {
    key: 'weight',
    header: "Weight",
    type: "number",
    required: false
  },
  {
    key: 'cylinders',
    header: "Cylinders",
    type: "number",
    required: false
  },
  {
    key: 'displacement',
    header: "Displacement",
    type: "number",
    required: false
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

export const emptyCar: Car = {
    name: "",
    origin: "",
    model_year: new Date(),
    acceleration: undefined,
    horsepower: undefined,
    mpg: undefined,
    weight: undefined,
    cylinders: undefined,
    displacement: undefined
};

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

export const initOps: FilterModel = {
    field: '-1',
    ops: '-1',
    value: '0'
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


export const isInitFilter = (f: DataFilterModel) => {
    if(JSON.stringify(f.filter) == JSON.stringify(initFilter.filter) && f.limit == initFilter.limit && f.orderBy == initFilter.orderBy
        && f.order == initFilter.order && f.limit == initFilter.limit && f.page == initFilter.page && f.search == initFilter.search)
        return true;

    return false;
}

