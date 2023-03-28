import { useEffect, useState } from "react";

export interface IProps {
  name?: string;
}

const Index = ({ name }: IProps) => {
  const [s] = useState(name);

  useEffect(() => {
    console.log(s);
  }, [s]);
  return <div>123</div>;
};

export default Index;
