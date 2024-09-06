import { fileURLToPath, URL } from 'node:url'
// import { defineConfig, type PluginOption, loadEnv } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import { configDefaults } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import { resolve, join } from 'node:path'
import vueDevTools from 'vite-plugin-vue-devtools'
// import cleanPlugin from 'vite-plugin-clean';

// Directory where the apps are located
const dappTemplatesDirName = 'templates'

const buildDir = '../build/dapp/'

function findAppBuilderPartsHTMLFiles(dir = dappTemplatesDirName, prefix = '') {
  const appDir = resolve(__dirname, dir)
  const apps = <Record<string, string>>{}

  fs.readdirSync(appDir).forEach((fileOrDir) => {
    const path = join(appDir, fileOrDir)
    if (fs.statSync(path).isDirectory()) {
      const subApps = findAppBuilderPartsHTMLFiles(join(dir, fileOrDir), `${prefix}${fileOrDir}/`)
      Object.assign(apps, subApps)
    } else if (fileOrDir.endsWith('.html')) {
      apps[`${prefix}${fileOrDir}`] = path
    }
  })

  return apps
}

const appBuilderPartsBuildHTMLFiles = findAppBuilderPartsHTMLFiles()
const buildHTMLFiles = {}
Object.assign(buildHTMLFiles, { 'index.html': './index.html' })
Object.assign(buildHTMLFiles, appBuilderPartsBuildHTMLFiles)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      vueDevTools(),
      // cleanPlugin({ targetFiles: [buildDir] }) as PluginOption
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    define: {
      __VUE_PROD_DEVTOOLS__: env.__VUE_PROD_DEVTOOLS__ ?? 'false'
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: `@use "@/assets/_colors" as *; @use "@/assets/_mixins" as *;`
        }
      }
    },
    test: {
      environment: 'happy-dom',
      include: ['src/**/*.{test,spec}.{js,ts}', 'src/**/__tests__/**/*.{js,ts}'],
      exclude: [...configDefaults.exclude, './e2e/'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['./vitest.setup.ts'],
      css: {
        include: new RegExp('.+/'),
        modules: {
          classNameStrategy: 'non-scoped'
        }
      }
    },
    build: {
      outDir: buildDir,
      assetsDir: 'assets',
      chunkSizeWarningLimit: 1024,
      reportCompressedSize: true,
      rollupOptions: {
        input: buildHTMLFiles,
        output: {
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name?.split('.').at(1) || ''
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img'
            }
            return `dapp/assets/${extType}/[name]-[hash][extname]` // remove 'dapp/' by postbuild.js
          },
          chunkFileNames: 'dapp/assets/js/[name]-[hash].js', // remove 'dapp/' by postbuild.js
          entryFileNames: 'dapp/assets/js/[name]-[hash].js' // remove 'dapp/' by postbuild.js
        }
      }
    }
  }
})
