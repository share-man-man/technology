<script setup lang="ts">
import MyButton from './Button.vue';
</script>

<template>
  <div>Test</div>
  <my-button>
    <template #test="list">
      list:
      <div>{{ JSON.stringify(list) }}</div>
    </template>
  </my-button>
</template>
