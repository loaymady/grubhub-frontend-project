# Gruhub-Frontend-Project

## Overview

This Project allows users to manage tasks through a variety of features, including adding, editing, deleting, searching, filtering, and reordering tasks via drag-and-drop. It also supports marking tasks as completed and persisting data in local storage.

## Features

### Add and Delete Items

Users can add and delete tasks through a form with proper validation and error messages.

#### Adding Items

- **Form Modal:** The `Modal` component is used to display a form for adding tasks. The form includes fields for the task name, description, and order. The `formikCreate` hook manages form state and validation.
- **Form Validation:** `Yup` validation schema ensures that the task name, description, and order meet specific criteria.
- **Dispatch Action:** Upon form submission, a new task is created with a unique ID (`uuidv4()`) and added to the state using the `addTask` action from the `tasksSlice`.

#### Deleting Items

- **Confirmation Modal:** Another `Modal` component is used to confirm the deletion of a task.
- **Delete Action:** The `handleSubmitDelete` function dispatches the `removeTask` action to remove the task from the state.

### Search

Users can search/filter the list using a search text field.

- **Search Field:** An input field (`default-search`) allows users to enter search terms.
- **Filtering:** The `handleSearchChange` function updates the `searchTerm` state, and `filteredTasks` filters the tasks based on this term.

### Drag and Drop

Users can reorder tasks via drag-and-drop.

- **Drag and Drop Context:** The `DragDropContext`, `Droppable`, and `Draggable` components from `react-beautiful-dnd` handle drag-and-drop functionality.
- **Reordering:** The `onDragEnd` function updates the order of tasks when they are dragged and dropped, and the `reorderTasks` action updates the state.

### Mark Task as Completed

Users can mark tasks as completed using a checkbox, and completed tasks are shown at the bottom of the list.

- **Completion Toggle:** Each task has a checkbox to mark it as completed. The `toggleTaskCompletion` function toggles the task's completion status using the `toggleTaskCompleted` action.
- **Sorting:** Tasks are sorted by completion status and order in `sortedTasks`.

### Data Persistence

The list of tasks is saved in local storage and loaded when the application starts.

- **Persisted State:** The `redux-persist` library is used to persist the tasks in local storage. The `persistReducer` and `persistStore` functions ensure that the task list is saved and rehydrated on application start.

### User Interface

The UI is clean and responsive, with buttons for adding and deleting tasks and visual indicators for drag-and-drop actions.

- **Responsive UI:** `Tailwind CSS` is used for styling the components, ensuring a clean and responsive design.
- **Buttons:** The `Button` component is used for actions like adding and deleting tasks.
- **Drag-and-Drop Indicators:** The `Draggable` and `Droppable` components provide visual feedback during drag-and-drop actions.

## Assumptions and Design Decisions

1. **Redux for State Management**: Chose Redux for its robustness in handling complex state logic and `redux-persist` to ensure state persistence across sessions.
2. **Drag-and-Drop with `react-beautiful-dnd`**: Implemented drag-and-drop to improve user experience in reordering tasks.
3. **Form Handling with Formik and Yup**: Used Formik for managing form state and Yup for validation to ensure a scalable and maintainable form handling approach.
4. **TypeScript**: Employed TypeScript for type safety and to reduce runtime errors, enhancing code maintainability and readability.
5. **UI Components**: Created reusable UI components like `Button` and `Modal` by `@headlessui/react` to maintain a consistent design and simplify code management.

## Installation

To run the application locally, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/loaymady/grubhub-frontend-project.git
   ```

2. Navigate to the project directory:

   ```sh
   cd grubhub-frontend-project
   ```

3. Install the dependencies:

   ```sh
   npm install
   ```

4. Start the application:
   ```sh
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.
