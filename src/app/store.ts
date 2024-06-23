import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import tasksSlice from "./features/tasks/tasksSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persisttasksConfig = {
  key: "tasks",
  storage,
};
const persistedTasks = persistReducer(persisttasksConfig, tasksSlice);

const store = configureStore({
  reducer: {
    tasks: persistedTasks,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persister = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
