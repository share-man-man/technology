import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import About from './pages/About';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <div>
          <Link to="/about">about</Link>
          <br />
          <Link to="/app">app</Link>
        </div>
      ),
    },
    {
      path: 'about',
      element: <About />,
    },
    {
      path: 'app',
      lazy: async () => ({
        Component: (await import('./pages/App')).default,
      }),
      children: [
        {
          index: true,
          path: 'page1',
          lazy: async () => ({
            Component: (await import('./pages/App/Page1')).default,
          }),
        },
        {
          path: 'page2',
          lazy: async () => ({
            Component: (await import('./pages/App/Page2')).default,
          }),
        },
      ],
    },
  ],
  {
    basename: '/vite-project',
  }
);

const Index = () => (
  <RouterProvider router={router} fallbackElement={<span>加载中...</span>} />
);

export default Index;
