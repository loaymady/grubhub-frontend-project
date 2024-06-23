import { FormEvent, useCallback, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import Button from "./ui/Button";
import { FormValues, ITask } from "../interface";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";
import { validationSchema } from "../validation";
import Task from "./Task";
import Modal from "./ui/Modal";
import { useSelector } from "react-redux";
import {
  addTask,
  removeTask,
  selectTasks,
  toggleTaskCompleted,
  updateTask,
  reorderTasks,
} from "../app/features/tasks/tasksSlice";
import { useAppDispatch } from "../app/store";

const TasksTable = () => {
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [taskIdClicked, setTaskIdClicked] = useState("");
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const { tasks } = useSelector(selectTasks);
  const dispatch = useAppDispatch();
  const [taskToEdit, setTaskToEdit] = useState<ITask>({
    id: "",
    name: "",
    description: "",
    completed: false,
    order: 1,
  });

  /** --------- CREATING --------- */
  const onOpenAddModal = useCallback(() => setIsOpenAddModal(true), []);
  const onCloseAddModal = useCallback(() => {
    setIsOpenAddModal(false);
    formikCreate.resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formikCreate = useFormik<FormValues>({
    initialValues: {
      name: "",
      description: "",
      completed: false,
      order: 1,
    },
    onSubmit: (values) => {
      const newTask: ITask = {
        id: uuidv4(),
        name: values.name,
        description: values.description,
        completed: values.completed,
        order: values.order,
      };
      dispatch(addTask(newTask));
      onCloseAddModal();
      formikCreate.resetForm();
    },
    validationSchema: validationSchema,
  });
  /**\\ --------- CREATING --------- \\*/

  /** --------- DELETING --------- */
  const onOpenConfirmModal = useCallback(() => setIsOpenConfirmModal(true), []);

  const handleSubmitDelete = (e: FormEvent) => {
    e.preventDefault();
    const taskClicked = tasks.find((task) => task.id === taskIdClicked);
    if (taskClicked) {
      dispatch(removeTask(taskClicked));
    }
    onCloseConfirmModal();
  };

  const onCloseConfirmModal = () => {
    setIsOpenConfirmModal(false);
    setTaskIdClicked("");
  };
  /**\\ --------- DELETING --------- \\*/

  /** --------- EDITING --------- */
  const onOpenEditModal = useCallback(() => setIsOpenEditModal(true), []);
  const onCloseEditModal = useCallback(() => setIsOpenEditModal(false), []);

  const formikEdit = useFormik<FormValues>({
    initialValues: {
      name: taskToEdit.name,
      description: taskToEdit.description,
      completed: taskToEdit.completed,
      order: taskToEdit.order,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(updateTask({ ...taskToEdit, ...values }));
      onCloseEditModal();
    },
    validationSchema: validationSchema,
  });
  /**\\ --------- EDITING --------- \\*/

  /** --------- SEARCHING --------- */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  /**\\ --------- SEARCHING --------- \\*/

  // Function to toggle task completion
  const toggleTaskCompletion = (id: string) => {
    dispatch(toggleTaskCompleted(id));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    // Compare completed status first (false before true)
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;

    // If both have the same completed status, sort by order
    return a.order - b.order;
  });

  const filteredTasks = sortedTasks.filter((task) =>
    task.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(filteredTasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);

    // Update the order attribute based on the new order
    const updatedTasks = reorderedTasks.map((task, index) => ({
      ...task,
      order: index + 1,
    }));

    //reorder tasks in redux
    dispatch(reorderTasks(updatedTasks));
  };

  return (
    <>
      <div className="max-w-xl mx-auto mt-5">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
            required
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <Button className="my-4 mx-auto" size={"sm"} onClick={onOpenAddModal}>
          Add A New Task
        </Button>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <table
                className="w-full text-sm mb-6 text-left text-gray-500 dark:text-gray-400"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3">
                      id
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Task name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Task description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Completed
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <Task
                          task={task}
                          index={index}
                          provided={provided}
                          setTaskIdClicked={setTaskIdClicked}
                          onOpenConfirmModal={onOpenConfirmModal}
                          setTaskToEdit={setTaskToEdit}
                          onOpenEditModal={onOpenEditModal}
                          toggleTaskCompletion={toggleTaskCompletion}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <Modal
        isOpen={isOpenAddModal}
        closeModal={onCloseAddModal}
        title="Add A New Task"
      >
        <form className="space-y-3" onSubmit={formikCreate.handleSubmit}>
          <input
            type="text"
            id="name"
            name="name"
            className="border-[1px] border-gray-300 shadow-lg focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-lg px-3 py-3 text-md w-full bg-transparent"
            placeholder="Task Name"
            autoComplete="off"
            onChange={formikCreate.handleChange}
            value={formikCreate.values.name}
          />
          {formikCreate.touched.name && formikCreate.errors.name ? (
            <p style={{ color: "red" }}>{formikCreate.errors.name}</p>
          ) : null}
          <textarea
            id="description"
            name="description"
            className="border-[1px] border-gray-300 shadow-lg focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-lg px-3 py-3 text-md w-full bg-transparent"
            placeholder="Task description"
            autoComplete="off"
            onChange={formikCreate.handleChange}
            value={formikCreate.values.description}
          />
          {formikCreate.touched.description &&
          formikCreate.errors.description ? (
            <p style={{ color: "red" }}>{formikCreate.errors.description}</p>
          ) : null}
          <input
            type="number"
            id="order"
            name="order"
            className="border-[1px] border-gray-300 shadow-lg focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-lg px-3 py-3 text-md w-full bg-transparent"
            placeholder="Order"
            autoComplete="off"
            onChange={formikCreate.handleChange}
            value={formikCreate.values.order}
          />
          {formikCreate.errors.order ? (
            <p style={{ color: "red" }}>{formikCreate.errors.order}</p>
          ) : null}
          <div className="relative flex space-x-6 items-start pb-4">
            <div className="min-w-0  text-sm leading-6">
              <label
                htmlFor="completed"
                className="font-medium text-gray-900 cursor-pointer"
              >
                Completed
              </label>
            </div>
            <div className="ml-3 flex h-6 items-center">
              <input
                name="completed"
                id="completed"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                onChange={formikCreate.handleChange}
                value={`${formikCreate.values.completed}`}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Button className="bg-indigo-700 hover:bg-indigo-800 w-fit rounded-lg text-white px-3 py-3 duration-200 font-medium">
              Add
            </Button>
            <Button type="button" variant={"cancel"} onClick={onCloseAddModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={onCloseConfirmModal}
        title="Are you sure you want to remove this Task from your Store?"
        description="Deleting this Task will remove it permanently from your dataset. Please make sure this is the intended action."
      >
        <form className="space-y-3" onSubmit={handleSubmitDelete}>
          <div className="flex items-center space-x-2 mt-6">
            <Button variant={"danger"}>Yes, remove</Button>
            <Button
              type="button"
              variant={"cancel"}
              onClick={onCloseConfirmModal}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isOpenEditModal}
        closeModal={onCloseEditModal}
        title="Edit your Task"
      >
        <form className="space-y-3" onSubmit={formikEdit.handleSubmit}>
          <input
            type="text"
            className="border-[1px] border-gray-300 shadow-lg focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-lg px-3 py-3 text-md w-full bg-transparent"
            name="name"
            id="name"
            autoComplete="off"
            onChange={formikEdit.handleChange}
            value={formikEdit.values.name}
          />
          {formikEdit.touched.name && formikEdit.errors.name ? (
            <p style={{ color: "red" }}>{formikEdit.errors.name}</p>
          ) : null}
          <textarea
            className="border-[1px] border-gray-300 shadow-lg focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-lg px-3 py-3 text-md w-full bg-transparent"
            name="description"
            autoComplete="off"
            onChange={formikEdit.handleChange}
            value={formikEdit.values.description}
          />
          {formikEdit.touched.description && formikEdit.errors.description ? (
            <p style={{ color: "red" }}>{formikEdit.errors.description}</p>
          ) : null}
          <input
            type="number"
            id="order"
            name="order"
            className="border-[1px] border-gray-300 shadow-lg focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-lg px-3 py-3 text-md w-full bg-transparent"
            placeholder="Order"
            autoComplete="off"
            onChange={formikEdit.handleChange}
            value={formikEdit.values.order}
          />
          <div className="relative flex space-x-6 items-start pb-4 ">
            <div className="min-w-0  text-sm leading-6">
              <label
                htmlFor="completed"
                className="font-medium text-gray-900 cursor-pointer"
              >
                Completed
              </label>
            </div>
            <div className="ml-3 flex h-6 items-center">
              <input
                name="completed"
                id="completed"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                onChange={formikEdit.handleChange}
                value={`${formikEdit.values.completed}`}
                checked={formikEdit.values.completed}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Button>Update</Button>
            <Button type="button" variant={"cancel"} onClick={onCloseEditModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default TasksTable;
