import { Link, Outlet } from 'react-router-dom';

const Index = () => {
  return (
    <div>
      <h1>Vite App</h1>
      <Link to="./page1">1</Link>
      <br />
      <Link to="./page2">2</Link>
      <Outlet />
    </div>
  );
};

export default Index;
