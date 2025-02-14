import { Ref } from "./ref";
import { Computed } from "./computed";

export type Reactive<T = any> = Ref<T> | Computed<T>;