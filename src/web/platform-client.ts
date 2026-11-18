import {createPlatformBrowserClient} from '@workspace/sdk/platform-browser-client';
export const platform=createPlatformBrowserClient('automation');
export const appFetch=platform.fetch;
