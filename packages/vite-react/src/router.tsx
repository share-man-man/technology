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
            <br />
            <Link to="/vtable/gannt-default">gannt-default</Link>
            <br />
            <Link to="/joda">joda</Link>
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
    {
      path: 'vtable',
      lazy: async () => ({
        Component: (await import('./pages/VTable')).default,
      }),
      children: [
        {
          path: 'gannt-default',
          lazy: async () => ({
            Component: (await import('./pages/VTable/Default')).default,
          }),
        },
        {
          path: 'gannt-day1',
          lazy: async () => ({
            Component: (await import('./pages/VTable/Day1')).default,
          }),
        },
      ],
    },

    {
      path: 'vtable/table-list',
      lazy: async () => ({
        Component: (await import('./pages/VTable/TableList')).default,
      }),
    },
    {
      path: '/joda',
      lazy: async () => ({ Component: (await import('./pages/Joda')).default }),
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
