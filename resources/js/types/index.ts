export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        apiToken: string;
    };
};

export interface Car {
    id?: number;
    name: string;
    origin: string;
    model_year: Date;
    acceleration?: number;
    horsepower?: number;
    mpg?: number;
    weight?: number;
    cylinders?: number;
    displacement?: number;
    // [key: string]: string | number | boolean;
  }

  export interface CarResponse {
    cars: Car[];
    total: number;
  }

  export interface Column{
    key: string;
    header: string;
    type: string;
    required: boolean;
  }

  export interface OP{
    key: string;
    value: string;
  }

  export interface FilterModel{
    field: string;
    ops: string;
    value: string;
  }

  export interface DataFilterModel{
    filter: FilterModel[];
    limit: number;
    order: string;
    orderBy: string;
    search: string;
    page: number;
  }



  export interface ApiChartResponse{
      model_year: string,
      origin: string,
      count: number
  }
