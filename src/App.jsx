import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createContext } from "react";

import LoginPage from "./pages/LoginPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import WelcomePage from "./pages/WelcomePage";
import UserPage from "./pages/UserPage";
import ProjectsPage from "./pages/ProjectsPage";
import TaskPage from "./pages/TaskPage";
export const UserContext = createContext(null);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/welcome",
    element: (
      <ProtectedRoutes>
        <WelcomePage/>
      </ProtectedRoutes>
    )
  },
  {
    path: "/users",
    element: (
      <ProtectedRoutes>
        <UserPage />
      </ProtectedRoutes>
    )
  },
  {
    path: "/projects",
    element: (
      <ProtectedRoutes>
        <ProjectsPage />
      </ProtectedRoutes>
    )
  },
  {
    path: "/projects/:project_id/task",
    element: 
        <TaskPage />
  }
]);

function App() {

  return (
    <>
        <RouterProvider router={router} />
    </>
  );
}

export default App;
