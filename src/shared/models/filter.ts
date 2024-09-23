export interface Filter {
  name: string;
  value: string[] | boolean;
  displayName?: string;
}

export enum FilterType {
  Favorite = 'favorite',
  Recurrent = 'recurrent',
  Nightmare = 'nightmare',
  Paralysis = 'paralysis',
  Date = 'date',
}
