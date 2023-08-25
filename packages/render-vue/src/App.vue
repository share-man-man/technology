<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue';
import { ref } from 'vue';
import VueRender from './VueRender';

const packageList = ref([
  {
    name: '@ant-design/pro-components',
    load: async () => ({
      PageContainer: () => '1231123',
    }),
  },
]);

const schemaStr = ref(
  JSON.stringify({
    id: '112233',
    packageName: '@ant-design/pro-components',
    componentName: 'PageContainer',
    props: {
      header: {
        title: '哈哈哈哈',
      },
    },
    children: [],
  })
);
</script>

<template>
  <div>页面首页</div>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <VueRender :schema-str="schemaStr" :package-list="packageList" />
</template>

<style scoped></style>
