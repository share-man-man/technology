import { Button, Card, Select } from 'antd';
import { useEffect, useState } from 'react';

const Index = () => {
  const [name] = useState('');

  useEffect(() => {
    // console.log(name);
  }, [name]);
  return (
    <Card>
      <Select options={[{ label: 'a', value: 'a' }]}></Select>
      <Button>a</Button>
    </Card>
  );
};

export default Index;
