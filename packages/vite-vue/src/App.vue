<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import { h, ref } from 'vue';
import { VueRender } from 'render-vue';

const packageList = ref([
  {
    name: '@ant-design/pro-components',
    load: async () => ({
      PageContainer: (p: { title?: string }) => {
        return h('h2', `title-${p.title}`);
      },
      HelloWorld,
    }),
  },
]);

const schemaStr = ref(
  JSON.stringify({
    id: '112233',
    packageName: '@ant-design/pro-components',
    componentName: 'HelloWorld',
    props: {
      msg: 'aaaa',
    },
    children: [
      {
        id: 'HelloWorld',
        packageName: '@ant-design/pro-components',
        componentName: 'PageContainer',
        props: {
          title: 'bbbb',
        },
      },
    ],
  })
);
</script>

<template>
  <VueRender :schema-str="schemaStr" :package-list="packageList" />
</template>

<style scoped></style>
