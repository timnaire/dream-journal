import { UserModel } from './user';

export interface DreamModel {
  id: string;
  title: string;
  dream: string;
  createdAt: string;
  updatedAt: string;
  // categories: string[];
  user: UserModel;
  recurrent: boolean;
  nightmare: boolean;
  paralysis: boolean;
  favorite: boolean;
}
