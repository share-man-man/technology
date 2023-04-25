import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <div>
          <h1>Hello World</h1>
          <Link to="/about">did-kit</Link>
        </div>
      ),
    },
    {
      path: 'about',
      element: <div>About</div>,
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
