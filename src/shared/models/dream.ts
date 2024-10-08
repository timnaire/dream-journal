import { MediaModel } from './media';
import { UserModel } from './user';

export interface Dream {
  id?: string;
  title: string;
  dream: string;
  recurrent: boolean;
  nightmare: boolean;
  paralysis: boolean;
  favorite: boolean;
  user?: UserModel;
  image?: MediaModel;
  audio?: MediaModel;
  createdAt?: string;
  updatedAt?: string;
}

export interface DreamRequest extends Dream {
  image?: MediaModel;
  audio?: MediaModel;
}

export interface DreamResponse {
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  items: Dream[];
}
