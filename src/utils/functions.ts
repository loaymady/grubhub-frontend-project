import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ITask } from "../interface";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const addTaskToTasks = (
  tasks: ITask[],
  actionPayload: ITask
): ITask[] => {
  // Check if there same order
  const updatedTasks = tasks.map((task) =>
    task.order >= actionPayload.order
      ? { ...task, order: task.order + 1 }
      : task
  );

  // Add the new task with the corrected order
  updatedTasks.push({ ...actionPayload });

  // Sort the tasks by order
  return updatedTasks.sort((a, b) => a.order - b.order);
};

export const removeTaskFromTask = (tasks: ITask[], actionPayload: ITask) => {
  return tasks.filter((item: ITask) => item.id !== actionPayload.id);
};

export const updateTaskInTasks = (
  tasks: ITask[],
  updatedTask: ITask
): ITask[] => {
  return tasks.map((task) =>
    task.id === updatedTask.id ? { ...task, ...updatedTask } : task
  );
};

export const toggleTaskCompletedStatus = (
  tasks: ITask[],
  taskId: string
): ITask[] => {
  return tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
};
