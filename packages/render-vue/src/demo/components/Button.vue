<script setup lang="ts">
import { ref } from 'vue';

const list = ref([1, 2, 3, 4]);
</script>

<template>
  <div>
    Button
    <div>
      <slot></slot>
    </div>
    <slot name="test" :list="list"></slot>
  </div>
</template>
