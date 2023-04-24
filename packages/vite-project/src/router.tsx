import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <h1>Hello World</h1>
        <Link to="did-kit">did-kit</Link>
      </div>
    ),
  },
  {
    path: 'formily',
    element: <div>About</div>,
  },
]);

const Index = () => (
  <RouterProvider router={router} fallbackElement={<span>加载中...</span>} />
);

export default Index;
