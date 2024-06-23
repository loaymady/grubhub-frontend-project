import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="root-layout">
      <div className="container mt-4 mx-auto">
        <h1 className="text-4xl font-semibold w-fit mx-auto p-3 rounded-lg text-center bg-red-500  text-white">
          Gruhub-Frontend-Project
        </h1>
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
