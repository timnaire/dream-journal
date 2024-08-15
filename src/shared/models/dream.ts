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
  createdAt?: string;
  updatedAt?: string;
}
