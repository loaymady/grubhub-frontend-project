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
  // Find the task that needs to be updated
  const existingTask = tasks.find((task) => task.id === updatedTask.id);

  // If the task is not found, return the original list
  if (!existingTask) {
    return tasks;
  }

  // If the order is not changing, update the task directly
  if (existingTask.order === updatedTask.order) {
    return tasks.map((task) =>
      task.id === updatedTask.id ? { ...task, ...updatedTask } : task
    );
  }

  // If the order is changing, adjust the order of other tasks
  const updatedTasks = tasks
    .filter((task) => task.id !== updatedTask.id)
    .map((task) => {
      if (existingTask.order < updatedTask.order) {
        // Order is moving down
        if (
          task.order > existingTask.order &&
          task.order <= updatedTask.order
        ) {
          return { ...task, order: task.order - 1 };
        }
      } else {
        // Order is moving up
        if (
          task.order < existingTask.order &&
          task.order >= updatedTask.order
        ) {
          return { ...task, order: task.order + 1 };
        }
      }
      return task;
    });

  // Add the updated task with the new order
  updatedTasks.push({ ...updatedTask });

  // Sort the tasks by order
  return updatedTasks.sort((a, b) => a.order - b.order);
};

export const toggleTaskCompletedStatus = (
  tasks: ITask[],
  taskId: string
): ITask[] => {
  return tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
};
