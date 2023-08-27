<script setup lang="ts">
import { ref } from 'vue';
import { VueRender, SlotPrefix } from '../../index';
import Test from './Test.vue';
import Button from './Button.vue';

const packageList = ref([
  {
    name: 'element-plus',
    load: async () => import('element-plus'),
  },
  {
    name: '@ant-design/pro-components',
    load: async () => ({
      PageContainer: () => '1231123',
    }),
  },
  {
    name: 'test',
    load: async () => ({
      Test,
      Button,
    }),
  },
]);

const schemaStr = ref(
  JSON.stringify({
    id: 'el-config-provider-1',
    packageName: 'element-plus',
    componentName: 'ElConfigProvider',
    props: {},
    children: [
      {
        id: 'element-plus-button',
        packageName: 'element-plus',
        componentName: 'ElButton',
        props: {
          type: 'primary',
          loading: true,
          [SlotPrefix]: {
            loading: {
              type: 'JSFunction',
              params: [],
              children: [
                {
                  id: 'loading',
                  packageName: 'element-plus',
                  componentName: 'ElTag',
                  props: {
                    type: 'success',
                  },
                  children: ['加载插槽'],
                },
              ],
            },
          },
        },
        children: ['asdsa'],
      },
      {
        id: 'Test',
        packageName: 'test',
        componentName: 'Button',
        props: {
          [SlotPrefix]: {
            default: {
              type: 'JSFunction',
              params: [],
              children: [
                {
                  id: 'element-plus-button',
                  packageName: 'element-plus',
                  componentName: 'ElButton',
                  children: ['default插槽'],
                },
              ],
            },
            test: {
              type: 'JSFunction',
              params: ['value'],
              children: [
                {
                  id: 'element-plus-button',
                  packageName: 'element-plus',
                  componentName: 'ElButton',
                  props: {
                    type: 'primary',
                  },
                  children: [
                    {
                      type: 'JSExpression',
                      paramns: [],
                      value:
                        '`test插槽-${JSON.stringify(this.scope.value.list)}`',
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    ],
  })
);
</script>

<template>
  <div>页面首页</div>
  <!-- <Test /> -->
  <VueRender :schema-str="schemaStr" :package-list="packageList" />
</template>

<style scoped></style>
