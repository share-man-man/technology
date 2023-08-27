import { AnyType, SchemaObj } from 'render';
import ReactRender from '../ReactRender';

import { v4 as id } from 'uuid';

const testObj: Partial<SchemaObj> = {
  id: id(),
  packageName: 'antd',
  componentName: 'Card',
  props: {
    title: '112233',
  },
  children: [],
};

function App() {
  return (
    <div>
      <ReactRender
        schemaStr={JSON.stringify(testObj)}
        // 有些打包器（如vite），默认不能通过import($param)动态加载包名，需要提前写好放到异步函数里去
        packageList={[
          {
            name: 'antd',
            load: async () =>
              Promise.resolve({
                Card: (p: AnyType) => <h1>{p?.title}</h1>,
              }),
          },
        ]}
        noMatchPackageRender={({ id: componentId, packageName }) => (
          <div
            key={`nomatch-package-${componentId}`}
            style={{
              color: 'red',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: 'red',
              padding: 12,
            }}
          >
            没有找到包:{packageName}
          </div>
        )}
        noMatchCompRender={({
          id: componentId,
          componentName,
          packageName,
        }) => (
          <div
            key={`nomatch-package-component-${componentId}`}
            style={{
              color: 'red',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: 'red',
              padding: 12,
            }}
          >
            包:{packageName}里没有找到组件:{componentName}
          </div>
        )}
      />
    </div>
  );
}

export default App;
