import { developmentWebServer } from '@workspace/framework';
import { createThemeInitScript } from '@workspace/ui/design-system/bootstrap';
import { appDetails } from './contracts/app';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  server: platformWebServer({ root: fileURLToPath(new URL('./', import.meta.url)), prefix: appDetails.prefix, defaultPort: appDetails.port, defaultWebPort: appDetails.port - 5 }),
  root: fileURLToPath(new URL('./src/web', import.meta.url)),
  resolve: { dedupe: ['react', 'react-dom'] },
  plugins: [{ name: 'shared-theme-init', transformIndexHtml: { order: 'pre', handler: () => [{ tag: 'script', children: createThemeInitScript(`${appDetails.name}.ui.preferences`), injectTo: 'head-prepend' }] } }, tailwindcss()],
  build: { outDir: fileURLToPath(new URL('./dist/web', import.meta.url)), emptyOutDir: true },
});

function platformWebServer(options:Parameters<typeof developmentWebServer>[0]){const server=developmentWebServer(options);return {...server,proxy:{...server.proxy,'/platform-api':server.proxy!['/api']}};}
