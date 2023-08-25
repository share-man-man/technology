import { ReactNode, createElement, useState, useEffect, useRef } from 'react';

import { AsyncRender, SchemaObj, AnyType } from 'render';

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
  /**
   * 没有找到组件
   * @param obj
   * @returns
   */
  noMatchCompRender?: (obj: SchemaObj) => ReactNode;
  /**
   * 没有找到包
   * @param obj
   * @returns
   */
  noMatchPackageRender?: (obj: SchemaObj) => ReactNode;
}

const defaultNoMatchPackageRender: ReactRenderProps['noMatchPackageRender'] = ({
  id: componentId,
  packageName,
}) => (
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

const defaultNoMatchCompRender: ReactRenderProps['noMatchCompRender'] = ({
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
);

/**
 * 从packageList里异步加载组件
 * @param obj schema节点对象
 * @param packageList 包列表
 * @returns 组件函数
 */
const asyncLoadCompInPackages = async ({
  obj,
  packageList,
  noMatchCompRender = defaultNoMatchCompRender,
  noMatchPackageRender = defaultNoMatchPackageRender,
}: { obj: SchemaObj } & Pick<
  ReactRenderProps,
  'packageList' | 'noMatchCompRender' | 'noMatchPackageRender'
>) => {
  const { packageName, componentName } = obj;
  const matchPackage = packageList.find((p) => p.name === packageName)?.load;
  if (!matchPackage) {
    return () => noMatchPackageRender(obj);
  }
  // 组件可能包含子组件
  const compPath = componentName.split('.');
  let matchComp = await matchPackage();
  compPath.forEach((name) => {
    matchComp = (matchComp || {})[name];
  });
  if (!matchComp) {
    return () => noMatchCompRender(obj);
  }

  return matchComp;
};

const ReactRender = ({
  schemaStr,
  packageList,
  noMatchCompRender,
  noMatchPackageRender,
}: ReactRenderProps) => {
  const [dom, setDom] = useState<ReactNode>();
  const [packageListState, setPackageListState] = useState(packageList || []);
  const noMatchCompRenderRef = useRef(noMatchCompRender);
  noMatchCompRenderRef.current = noMatchCompRender;
  const noMatchPackageRenderRef = useRef(noMatchPackageRender);
  noMatchPackageRenderRef.current = noMatchPackageRender;

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
    if (!schemaStr || !packageListState) {
      setDom(undefined);
      return;
    }
    AsyncRender<ReactNode>({
      shcemaObj: JSON.parse(schemaStr),
      onCreateNode: (comp, props, children) => {
        return createElement(comp, props, children);
      },
      asyncLoadComp: (obj) =>
        asyncLoadCompInPackages({
          obj,
          packageList: packageListState,
          noMatchCompRender: noMatchCompRenderRef.current,
          noMatchPackageRender: noMatchPackageRenderRef.current,
        }),
    }).then((res) => {
      setDom(res);
    });
  }, [schemaStr, packageListState]);
  return <>{dom}</>;
};
export default ReactRender;
