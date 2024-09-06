<template>
  <TemplatesRenderer :dev="dev" @ready="removeDappAsyncHide" />
  <RouterView v-slot="{ Component }">
    <Teleport :to="`.${spaTeleportNodeClass}`">
      <div class="dapp-template">
        <component :is="Component" />
      </div>
    </Teleport>
  </RouterView>
</template>

<script setup lang="ts">
import TemplatesRenderer from '@/components/TemplatesRenderer.vue';
// import { useUserStore } from '@/stores/user';
import { removeDappAsyncHide, createSpaDevRootNode, spaTeleportNodeClass } from '@/utils/dapp';

const props = defineProps<{
  dev: boolean;
}>();

// init user store
// useUserStore().getUser();

if (props.dev) {
  // create root container for "npm run dev" mode
  createSpaDevRootNode();
}
</script>
