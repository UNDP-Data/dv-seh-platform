import { React } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import Landing from './routes/landing';
import Search from './routes/ai_search';
import Chat from './routes/ai_chat';
import './i18n';

import 'reset-css';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/',
          element: <Search />,
        },
        {
          path: '/search',
          element: <Search />,
        },
        {
          path: '/landing',
          element: <Landing />,
        },
        {
          path: '/chat',
          element: <Chat />,
        },
      ],
    },
  ],
  // { basename: '/energy-hub-demo' },
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />,
);
