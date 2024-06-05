import { React } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import Landing from './routes/landing';
import Search from './routes/ai_search';
import Chat from './routes/ai_chat';
import RouteError from './components/RouteError';
import './i18n';

import 'reset-css';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      errorElement: <RouteError />,
      children: [
        {
          path: '/',
          element: <Search />,
          errorElement: <RouteError />,
        },
        {
          path: '/search',
          element: <Search />,
          errorElement: <RouteError />,
        },
        {
          path: '/landing',
          element: <Landing />,
          errorElement: <RouteError />,
        },
        {
          path: '/chat',
          element: <Chat />,
          errorElement: <RouteError />,
        },
      ],
    },
  ],
  // { basename: '/energy-hub-demo' },
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />,
);
