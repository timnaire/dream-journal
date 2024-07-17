export interface DreamProps {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    fullName: string;
  };
  title: string;
  dream: string;
  time: string;
  categories: string[];
}
