// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "login", element: <LoginPage /> },
    ],
  },
]);
