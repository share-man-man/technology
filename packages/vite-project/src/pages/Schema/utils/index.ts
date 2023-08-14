import { FunctionComponent, ReactNode, createElement } from 'react';

import { v4 as uuidv4 } from 'uuid';
import {
  AnyType,
  ComponentListItem,
  JSONValue,
  isBasicType,
  isExpression,
  isFunction,
  isSchemaObj,
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
  ext: {
    scope?: Record<string, AnyType>;
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
  // 排除null、undefined类型
  if (!(obj instanceof Object)) {
    return obj;
  }
  // schema节点，从ComponentList里匹配组件
  if (isSchemaObj(obj)) {
    // 处理组件的子组件，比如antd的：Collapse.Panel、Typography.Text等
    const compPath = obj.componentName.split('.');
    let matchComp = ComponentList.find(
      (c) => c.packageName === obj.packageName
    )?.packageLib;
    compPath.forEach((name) => {
      matchComp = (matchComp || {})[name];
    });
    if (!matchComp) {
      // TODO 匹配不到组件，应该上抛错误
      return createElement(
        'div',
        { key: uuidv4(), style: { color: 'red' } },
        `找不到组件:${obj.packageName}-${obj.componentName}`
      );
    }
    // 组件参数，参数可能深层嵌套schema节点
    const props = {
      key: obj.id,
      ...Object.fromEntries(
        Object.keys(obj.props || {}).map((k) => [
          k,
          reactRender(obj.props[k], ext),
        ])
      ),
    };
    // 解析children，children可能是单一节点，可能是数组节点
    const children = !Array.isArray(obj.children)
      ? reactRender(obj.children || null, ext)
      : ((obj.children || []).map((c) => reactRender(c, ext)) as ReactNode[]);

    return createElement(matchComp as FunctionComponent, props, children);
  }
  // 表达式节点
  if (isExpression(obj)) {
    const func = new Function(`return ${obj?.value}`).bind({
      ...ext,
    });
    return func();
  }
  // 函数节点
  if (isFunction(obj)) {
    // 普通函数节点
    if (!obj?.children) {
      return new Function(...(obj?.params || []), obj?.value || '').bind({
        ...ext,
      });
    }
    // 返回schema组件的函数节点
    return new Function('...params', 'return this.render(params);').bind({
      render: (params: AnyType[]) => {
        if (!obj.children) {
          return;
        }
        const funcExt: typeof ext = {
          ...ext,
          // 透传函数的参数到children里，使此函数包裹的组件或表达式可通过this.scope获取
          scope: {
            ...ext.scope,
            ...Object.fromEntries(
              obj.params.map((k, index) => [k, params[index]])
            ),
          },
        };
        // 处理children是否为数组或单schema的情况
        if (Array.isArray(obj.children)) {
          return obj.children.map((o) => reactRender(o, { ...funcExt }));
        }
        return reactRender(obj.children, { ...funcExt });
      },
    });
  }

  return Object.fromEntries(
    Object.keys(obj).map((k) => [k, reactRender(obj[k], ext)])
  ) as unknown as ReactNode;
};
