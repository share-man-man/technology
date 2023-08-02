import { FunctionComponent, ReactNode, createElement } from 'react';

import { v4 as uuidv4 } from 'uuid';
import {
  ComponentListItem,
  JSONValue,
  isBasicType,
  isExpression,
  isFunction,
  isSchemaObj,
  isSlot,
} from './type';

const ComponentList: ComponentListItem[] = [];

export const injectPackage = (pack: ComponentListItem) => {
  const index = ComponentList.findIndex(
    (i) => i.packageName === pack.packageName
  );
  if (index === -1) {
    ComponentList.push(pack);
  } else {
    ComponentList.splice(index, 1, pack);
  }
};

export const reactRender = (
  obj: JSONValue,
  ext?: {
    params?: Record<string, any>;
  }
): ReactNode => {
  // 基础节点，直接返回
  if (isBasicType(obj)) {
    return obj as ReactNode;
  }
  // 数组节点遍历渲染
  if (Array.isArray(obj)) {
    return obj.map((o) => reactRender(o, ext)) as (ReactNode | ReactNode)[];
  }
  // 保证obj是对象
  if (!(obj instanceof Object)) {
    return obj;
  }
  // 组件节点
  if (isSchemaObj(obj)) {
    // 匹配组件
    const compPath = obj.componentName.split('.');
    let matchComp = ComponentList.find(
      (c) => c.packageName === obj.packageName
    )?.packageLib;
    compPath.forEach((name) => {
      matchComp = (matchComp || {})[name];
    });

    if (!matchComp) {
      return createElement(
        'div',
        { key: uuidv4(), style: { color: 'red' } },
        `找不到组件:${obj.packageName}-${obj.componentName}`
      );
    }
    //   TODO props里的属性有可能是组件，需要深度解析

    const props = {
      key: obj.id,
      ...Object.fromEntries(
        Object.keys(obj.props).map((k) => [k, reactRender(obj.props[k], ext)])
      ),
    };
    const children = (obj.children || []).map((c) =>
      reactRender(c, ext)
    ) as ReactNode[];

    return createElement(matchComp as FunctionComponent, props, children);
  }
  // 变量节点
  if (isExpression(obj)) {
    const func = new Function(`return ${obj?.value}`).bind({
      params: ext?.params,
    });
    return func();
  }
  // 函数节点
  if (isFunction(obj)) {
    const func = new Function(...(obj?.params || []), obj?.value).bind({});
    return func;
  }
  // 插槽节点
  if (isSlot(obj)) {
    return ((...params: any[]) => {
      const dom = (obj.value || []).map((o) =>
        reactRender(o, {
          ...ext,
          params: Object.fromEntries(
            obj.params.map((k, index) => [k, params[index]])
          ),
        })
      );
      return dom;
    }) as any;
  }

  return Object.fromEntries(
    Object.keys(obj).map((k) => [k, reactRender(obj[k], ext)])
  ) as unknown as ReactNode;
};
