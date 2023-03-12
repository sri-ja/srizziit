import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';

import Landing from './components/Landing';
import ErrorPage from './components/error-page'
import Home from './components/Home'
import Subs from './components/Subs'
import Mysubs from './components/Mysubs'
import Bookmarks from './components/Bookmarks';

import Submoduser from './components/Submoduser';
import Submodjoins from './components/Submodjoins';
import Submodstats from './components/Submodstats';
import Submodreports from './components/Submodreports';

import Subuser from './components/Subuser';


const router = createBrowserRouter([
  {
  path: "/",
  element: <Landing />,
  errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: <Home />,
    errorElement: <ErrorPage />
  },
  {
    path: "/subs",
    element: <Subs />,
    errorElement: <ErrorPage />
  },
  {
    path: "/mysubs",
    element: <Mysubs />,
    errorElement: <ErrorPage />
  },
  {
    path: "/bookmarks",
    element: <Bookmarks />,
    errorElement: <ErrorPage />
  }, 
  {
    path: "/sub/:subName",
    element: <Subuser />,
    errorElement: <ErrorPage />
  },
  {
    path: "/mod/:subName/users",
    element: <Submoduser />,
    errorElement: <ErrorPage />
  },
  {
    path: "/mod/:subName/joins",
    element: <Submodjoins />,
    errorElement: <ErrorPage />
  },
  {
    path: "/mod/:subName/stats",
    element: <Submodstats />,
    errorElement: <ErrorPage />
  },
  {
    path: "/mod/:subName/reports",
    element: <Submodreports />,
    errorElement: <ErrorPage />
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
)
