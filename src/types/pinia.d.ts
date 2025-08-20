// types/pinia.d.ts
import 'pinia';

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?:
      | boolean
      | {
          key?: string;
          storage?: Storage;
          paths?: string[];
        };
  }
}
