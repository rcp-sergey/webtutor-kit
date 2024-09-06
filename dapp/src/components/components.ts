import { defineAsyncComponent } from 'vue';

export { default as TheWelcome } from '@/components/TheWelcome.vue';
export const HelloWorld = defineAsyncComponent(() => import('@/components/HelloWorld.vue'));
export const DemoComponent = defineAsyncComponent(() => import('@/components/DemoComponent.vue'));