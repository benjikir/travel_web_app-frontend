import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
// Import your LoginPage here as well when you create it

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Use the Layout component for all child routes
    children: [
      {
        index: true, // This makes HomePage the default page for "/"
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      // {
      //   path: 'login',
      //   element: <LoginPage />,
      // },
    ],
  },
]);