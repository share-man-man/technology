import { AsyncRender } from 'render';
import type { AnyType, SchemaObj } from 'render';

import { h, ref, defineComponent, watch } from 'vue';
import type { PropType, Slot, SlotsType, VNode } from 'vue';

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

const defaultNoMatchPackageRender: VueRenderSlots['noMatchComp'] = ({
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

const defaultNoMatchCompRender: VueRenderSlots['noMatchPackage'] = ({
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
const asyncLoadCompInPackages = async ({
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

export default defineComponent({
  props: {
    schemaStr: {
      type: String as PropType<VueRenderProps['schemaStr']>,
      default: '',
    },
    packageList: {
      type: Array as PropType<VueRenderProps['packageList']>,
      default: () => [],
    },
  },
  slots: Object as SlotsType<{
    noMatchComp: SchemaObj;
    noMatchPackage: SchemaObj;
  }>,
  setup({ schemaStr, packageList }, { slots }) {
    const dom = ref();
    // const packageListState = ref<typeof packageList>([]);
    // watchEffect(() => {
    //   if (
    //     !packageList.every((p) =>
    //       packageListState.value.some((_p) => _p.name === p.name)
    //     )
    //   ) {
    //     packageListState.value = packageList;
    //   }
    // });

    watch(
      () => [schemaStr, packageList],
      (arr) => {
        const [s, p] = arr as [typeof schemaStr, typeof packageList];

        if (!s || !p) {
          dom.value = undefined;
          return;
        }
        AsyncRender<VNode>({
          shcemaObj: JSON.parse(s),
          onCreateNode(comp, props, children) {
            return h(comp, props, {
              default: () => children,
            });
          },
          asyncLoadComp: (obj) =>
            asyncLoadCompInPackages({
              obj,
              packageList: p,
              noMatchComp: slots.noMatchComp,
              noMatchPackage: slots.noMatchPackage,
            }),
        }).then((res) => {
          dom.value = res;
        });
      },
      {
        immediate: true,
      }
    );

    return () => dom.value;
  },
});
