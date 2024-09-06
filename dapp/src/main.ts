import { createApp } from 'vue';
// import { pinia } from '@/pinia';
import App from '@/App.vue';
import * as components from '@/components/components';
// import ElementPlus from 'element-plus';
// import ruRu from 'element-plus/es/locale/lang/ru';
import router from '@/router/index';
// import { VueQueryPlugin } from '@tanstack/vue-query';
import { removeDappAsyncHideIfNoTemplates } from '@/utils/dapp';
import '@/assets/main.css';

removeDappAsyncHideIfNoTemplates();

const isDevMode = import.meta.env.DEV;

async function start() {
  const app = createApp(App, {
    dev: isDevMode,
  });

//   app.use(pinia);
  app.use(router);
//   app.use(VueQueryPlugin, {
//     enableDevtoolsV6Plugin: true,
//   });
//   app.use(ElementPlus, {
//     locale: ruRu,
//   });

  if (isDevMode) {
    await import('@/mocks/browser').then(async ({ worker }) => {
      console.info('starting MSW ...');
      await worker.start({
        onUnhandledRequest(req, print) {
          if (!req.url.startsWith('/api/')) {
            return;
          }

          print.warning();
        },
      });
    });
  }

  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component);
  });

  app.mount('#dapp-mount-root');
}

start();
