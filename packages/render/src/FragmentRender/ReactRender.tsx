import { ReactNode, createElement, useState, useEffect } from 'react';

import { render } from './utils';
import { SchemaObj } from './utils/type';

const packageMap = new Map();
packageMap.set('antd', async () => await import('antd'));
packageMap.set(
  '@ant-design/pro-components',
  async () => await import('@ant-design/pro-components')
);

/**
 * 异步加载组件
 * @param param0
 * @returns
 */
const asyncLoad = async ({ obj }: { obj: SchemaObj }) => {
  const { packageName, componentName, id: componentId } = obj;
  // vite默认不能通过import($param)动态加载包名，需要提前写好放到异步函数里去
  const matchPackage = packageMap.get(packageName);

  if (!matchPackage) {
    const NoMatchComp = () => (
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
    );
    return NoMatchComp;
  }

  // 组件可能包含子组件
  const compPath = componentName.split('.');
  let matchComp = await matchPackage();

  compPath.forEach((name) => {
    matchComp = (matchComp || {})[name];
  });
  if (!matchComp) {
    const NoMatchComp = () => (
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
    );
    return NoMatchComp;
  }

  return matchComp;
};

const ReactRender = ({ schemaStr }: { schemaStr: string }) => {
  const [dom, setDom] = useState<ReactNode>();
  useEffect(() => {
    render<ReactNode>({
      shcemaObj: JSON.parse(schemaStr),
      onCreateNode: (comp, props, children) => {
        return createElement(comp, props, children);
      },
      asyncLoadComp(obj, loadSuccess) {
        asyncLoad({ obj }).then((res) => {
          loadSuccess(res);
        });
        return () => (
          <div key={`loading-${obj.id}`}>组件{obj.componentName}加载中</div>
        );
      },
      onRender(d) {
        setDom(d);
      },
    });
  }, [schemaStr]);
  return <div>{dom}</div>;
};
export default ReactRender;
