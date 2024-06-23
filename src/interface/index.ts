export interface ITask {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface FormValues {
  name: string;
  description: string;
  completed: boolean;
  order: number;
}
