import {
  createBrowserRouter,
  RouterProvider,
  Link,
  useNavigation,
} from 'react-router-dom';
import About from './pages/About';

const Layout = ({ children }: { children: JSX.Element }) => {
  const { state } = useNavigation();

  if (state === 'loading') {
    return <div>加载中.....</div>;
  }
  return children;
};

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <Layout>
          <div>
            <Link to="/schema">schema</Link>
            <br />
            <Link to="/about">about</Link>
            <br />
            <Link to="/app">app</Link>
          </div>
        </Layout>
      ),
    },
    {
      path: 'schema',
      lazy: async () => {
        return {
          Component: (await import('./pages/Schema')).default,
        };
      },
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
    basename: '/vite-react',
  }
);

const Index = () => (
  <RouterProvider
    router={router}
    fallbackElement={
      <Layout>
        <div />
      </Layout>
    }
  />
);

export default Index;
