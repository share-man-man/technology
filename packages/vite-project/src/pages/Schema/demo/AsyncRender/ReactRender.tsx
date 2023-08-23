import { ReactNode, createElement, useState, useEffect } from 'react';

import { render } from './utils';
import { AnyType, SchemaObj } from './utils/type';

export interface ReactRenderProps {
  /**
   * schema字符串
   * @description 之所以是字符串，是因为useEffect相比监听对象，字符串可减少函数调用次数
   */
  schemaStr: string;
  /**
   * 包列表
   * @description
   */
  packageList: { name: string; load: () => Promise<AnyType> }[];
}

/**
 * 从packageList里异步加载组件
 * @param obj schema节点对象
 * @param packageList 包列表
 * @returns 组件函数
 */
const asyncLoadCompInPackages = async (
  obj: SchemaObj,
  packageList: ReactRenderProps['packageList']
) => {
  const { packageName, componentName, id: componentId } = obj;
  const matchPackage = packageList.find((p) => p.name === packageName)?.load;
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

const ReactRender = ({ schemaStr, packageList }: ReactRenderProps) => {
  const [dom, setDom] = useState<ReactNode>();
  const [packageListState, setPackageListState] = useState(packageList || []);

  // 监听包是否有变更，直接监听packageList，很有肯能会多次渲染
  useEffect(() => {
    if (
      !packageList.every((p) =>
        packageListState.some((_p) => _p.name === p.name)
      )
    ) {
      setPackageListState(packageList);
    }
  }, [packageList, packageListState]);

  useEffect(() => {
    render<ReactNode>({
      shcemaObj: JSON.parse(schemaStr),
      onCreateNode: (comp, props, children) => {
        return createElement(comp, props, children);
      },
      asyncLoadComp: (obj) => asyncLoadCompInPackages(obj, packageListState),
    }).then((res) => {
      setDom(res);
    });
  }, [schemaStr, packageListState]);
  return <div>{dom}</div>;
};
export default ReactRender;
