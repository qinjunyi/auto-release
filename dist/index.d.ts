declare module '@junyiqin/auto-release/index' {
  import type { ReleaseParams } from '@junyiqin/auto-release/typings/index';
  const main: (params: ReleaseParams) => Promise<void>;
  export type { ReleaseParams };
  export default main;
}
declare module '@junyiqin/auto-release/lib/index' {
  export const waitFnLoading: (
    fn: Function,
    messageStart: string,
    messageEnd: string
  ) => (...args: any) => Promise<any>;
  export const printLogo: (logo: string) => void;
}
declare module '@junyiqin/auto-release' {
  import main = require('@junyiqin/auto-release/index');
  export = main;
}
