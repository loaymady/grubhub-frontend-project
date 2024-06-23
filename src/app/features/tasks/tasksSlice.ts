import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ITask } from "../../../interface";
import {
  addTaskToTasks,
  removeTaskFromTask,
  toggleTaskCompletedStatus,
  updateTaskInTasks,
} from "../../../utils/functions";
import { RootState } from "../../store";

interface TasksState {
  tasks: ITask[];
}

const initialState: TasksState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, actionPayload: PayloadAction<ITask>) => {
      state.tasks = addTaskToTasks(state.tasks, actionPayload.payload);
    },
    removeTask: (state, actionPayload: PayloadAction<ITask>) => {
      state.tasks = removeTaskFromTask(state.tasks, actionPayload.payload);
    },
    updateTask: (state, action: PayloadAction<ITask>) => {
      state.tasks = updateTaskInTasks(state.tasks, action.payload);
    },
    toggleTaskCompleted: (state, action: PayloadAction<string>) => {
      state.tasks = toggleTaskCompletedStatus(state.tasks, action.payload);
    },
    reorderTasks(state, action) {
      state.tasks = action.payload;
    },
  },
});

export const {
  addTask,
  removeTask,
  updateTask,
  toggleTaskCompleted,
  reorderTasks,
} = tasksSlice.actions;
export const selectTasks = (state: RootState) => state.tasks;

export default tasksSlice.reducer;
