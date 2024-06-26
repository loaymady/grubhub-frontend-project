import { DraggableProvided } from "react-beautiful-dnd";
import { ITask } from "../interface";
import { truncateText } from "../utils/functions";
import Button from "./ui/Button";
import { memo, useCallback } from "react";

interface IProps {
  task: ITask;
  index: number;
  onOpenEditModal: () => void;
  onOpenConfirmModal: () => void;
  setTaskToEdit(task: ITask): void;
  setTaskIdClicked(id: string): void;
  toggleTaskCompletion: (id: string) => void;
  provided: DraggableProvided;
}

const Task = memo(
  ({
    task,
    index,
    onOpenEditModal,
    onOpenConfirmModal,
    setTaskToEdit,
    setTaskIdClicked,
    toggleTaskCompletion,
    provided,
  }: IProps) => {
    const onEdit = useCallback(() => {
      setTaskToEdit(task);
      onOpenEditModal();
    }, [onOpenEditModal, setTaskToEdit, task]);

    const onRemove = useCallback(() => {
      setTaskIdClicked(task.id);
      onOpenConfirmModal();
    }, [onOpenConfirmModal, setTaskIdClicked, task.id]);

    return (
      <tr
        ref={provided.innerRef}
        {...provided.draggableProps}
        className={`bg-white border-b ${
          task.completed
            ? "dark:bg-green-900 dark:border-gray-900"
            : "dark:bg-gray-800 dark:border-gray-700"
        }`}
      >
        {!task.completed ? (
          <td
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            {...provided.dragHandleProps}
          >
            <svg
              className="h-8 w-8 text-gray-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M16 8v-4h-12v12.01h4" strokeDasharray=".001 4" />{" "}
              <rect x="8" y="8" width="12" height="12" rx="2" />
            </svg>
          </td>
        ) : (
          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"></td>
        )}

        <td
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {index + 1}
        </td>
        <td
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {task.name}
        </td>
        <td
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {truncateText(task.description, 10)}
        </td>
        <td className="px-6 py-4">
          <input
            type="checkbox"
            id="completed"
            checked={task.completed}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 cursor-pointer focus:ring-indigo-600"
            onChange={() => toggleTaskCompletion(task.id)}
          />
        </td>
        <td className="px-6 py-4">
          <div className="flex space-x-2">
            <td className="flex space-x-2">
              <Button className=" px-4 py-2" onClick={onEdit}>
                Edit
              </Button>
              <Button variant={"danger"} size={"sm"} onClick={onRemove}>
                Remove
              </Button>
            </td>
          </div>
        </td>
      </tr>
    );
  }
);

export default Task;
