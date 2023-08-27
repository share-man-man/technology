import { AsyncRender } from 'render';
import type { SchemaObj } from 'render';

import { h, ref, defineComponent, watch, isVNode } from 'vue';
import type { PropType, SlotsType, VNode } from 'vue';
import { SlotPrefix, VueRenderProps, asyncLoadCompInPackages } from './utils';

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
          onCreateNode(comp, originProps = {}, children) {
            const { [SlotPrefix]: compSlots = {}, ...props } =
              originProps || {};
            return h(comp, props, {
              // 支持vue的具名插槽，默认children为default插槽
              default: isVNode(children) ? children : () => children,
              ...Object.fromEntries(
                Object.keys(compSlots).map((k) => [k, compSlots?.[k]])
              ),
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
