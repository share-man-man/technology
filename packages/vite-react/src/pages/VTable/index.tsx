import * as VTableGantt from '@visactor/vtable-gantt';
import 'antd/dist/antd.css';
import { Card, Row, Segmented } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export const getTitleString = (title: VTableGantt.ColumnDefine['title']) => {
  if (typeof title === 'string') {
    return title;
  }
  return title?.();
};

const Index = () => {
  const location = useLocation();
  // react-router 获取嵌套路由当前地址
  const mode = location.pathname.split('/').pop();

  const navigate = useNavigate();

  return (
    <>
      <Card title="甘特图">
        <Row justify="center" style={{ marginBottom: 32 }}>
          <Segmented
            value={mode}
            options={['gannt-default', 'gannt-day1']}
            onChange={(v) => {
              // ReactRouter 跳转页面
              navigate(`/vtable/${v}`);
            }}
          />
        </Row>
        {/* ReactRouter子路由 */}
        <Outlet />
      </Card>
    </>
  );
};

export default Index;
