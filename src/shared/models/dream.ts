export interface DreamProps {
  id: string;
  user: {
    firstname: string;
    lastname: string;
    fullname: string;
    email: string;
  };
  title: string;
  dream: string;
  time: string;
  categories: string[];
}
