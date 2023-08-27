import type { AnyType, SchemaObj } from 'render';

import { h } from 'vue';
import type { Slot } from 'vue';

export interface VueRenderProps {
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

export interface VueRenderSlots {
  noMatchComp: Slot<SchemaObj>;
  noMatchPackage: Slot<SchemaObj>;
}

export const SlotPrefix = '_vue_slots';

export const defaultNoMatchPackageRender: VueRenderSlots['noMatchComp'] = ({
  id: componentId,
  packageName,
}) => {
  return [
    h(
      'div',
      {
        key: `nomatch-package-${componentId}`,
        style: {
          color: 'red',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'red',
          padding: 12,
        },
      },

      `没有找到包:${packageName}`
    ),
  ];
};

export const defaultNoMatchCompRender: VueRenderSlots['noMatchPackage'] = ({
  id: componentId,
  componentName,
  packageName,
}) => {
  return [
    h(
      'div',
      {
        key: `nomatch-package-component-${componentId}`,
        style: {
          color: 'red',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'red',
          padding: 12,
        },
      },

      `包:${packageName}里没有找到组件:${componentName}`
    ),
  ];
};

/**
 * 从packageList里异步加载组件
 * @param obj schema节点对象
 * @param packageList 包列表
 * @returns 组件函数
 */
export const asyncLoadCompInPackages = async ({
  obj,
  packageList,
  noMatchComp = defaultNoMatchCompRender,
  noMatchPackage = defaultNoMatchPackageRender,
}: { obj: SchemaObj } & Pick<VueRenderProps, 'packageList'> &
  VueRenderSlots) => {
  const { packageName, componentName } = obj;
  const matchPackage = packageList.find((p) => p.name === packageName)?.load;
  if (!matchPackage) {
    const NoMatchComp = () => noMatchPackage(obj);
    return NoMatchComp;
  }

  // 组件可能包含子组件
  const compPath = componentName.split('.');
  let matchComp = await matchPackage();
  compPath.forEach((name) => {
    matchComp = (matchComp || {})[name];
  });
  if (!matchComp) {
    const NoMatchComp = () => noMatchComp(obj);
    return NoMatchComp;
  }

  return matchComp;
};
