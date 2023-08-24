import { render } from './utils';
import { AnyType, SchemaObj } from './utils/type';

import { h, onMounted, ref, watchEffect } from 'vue';

// import HelloWorld from "./components/HelloWorld.vue";

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

const packageListState = [
  {
    name: '@ant-design/pro-components',
    load: async () => ({
      PageContainer: () => 'PageContainer123123',
    }),
  },
];

/**
 * 从packageList里异步加载组件
 * @param obj schema节点对象
 * @param packageList 包列表
 * @returns 组件函数
 */
const asyncLoadCompInPackages = async (
  obj: SchemaObj,
  packageList: VueRenderProps['packageList']
) => {
  const { packageName, componentName, id: componentId } = obj;
  const matchPackage = packageList.find((p) => p.name === packageName)?.load;
  if (!matchPackage) {
    const NoMatchComp = () =>
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
    const NoMatchComp = () =>
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
      );
    return NoMatchComp;
  }

  return matchComp;
};
export default {
  props: [],
  setup() {
    const dom = ref();

    onMounted(() => {
      render({
        shcemaObj: {
          id: '111',
          packageName: '@ant-design/pro-components',
          componentName: 'PageContainer',
          props: {
            msg: '111',
            // footer: "aaa",
          },
          children: [
            {
              id: '222',
              packageName: '@ant-design/pro-components',
              componentName: 'PageContainer',
              props: {
                msg: '222',
                // footer: "aaa",
              },
              children: [],
            },
          ],
        },
        onCreateNode(comp, props, children) {
          return h(comp, props, {
            default: () => children,
            footer: () => h('div', 'foot'),
          });
        },
        asyncLoadComp: (obj) => asyncLoadCompInPackages(obj, packageListState),
      }).then((res) => {
        dom.value = res;
        // dom.value = h('div','res===')
      });
    });

    return () => dom.value || h('div', 'loading');
  },
};
