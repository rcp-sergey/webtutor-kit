<template>
  <div class="demo-component">{{ demoText }}</div>
</template>

<script setup lang="ts">
defineProps<{
  demoText: string
}>()
</script>

<style scoped>
.demo-component {
  background-color: lightsteelblue;
  padding: 32px;
  border-radius: 8px;
  color: whitesmoke;
  font-size: 20px;
  font-weight: 700;
  box-shadow: 0 4px 4px rgba(0, 0, 0 / 25%);
}
</style>
