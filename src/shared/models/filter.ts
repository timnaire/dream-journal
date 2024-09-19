export interface Filter {
  name: string;
  value: string | boolean;
}

export enum FilterType {
  Favorite = 'favorite',
  Recurrent = 'recurrent',
  Nightmare = 'nightmare',
  Paralysis = 'paralysis',
  FromDate = 'fromDate',
  ToDate = 'toDate',
}
