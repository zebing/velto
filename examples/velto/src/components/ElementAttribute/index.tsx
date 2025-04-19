import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed, ref, watch, computed
} from "@velto/runtime"

import styles from "./styles.module.scss";

export default function ElementAttribute() {
  const hasAttr = ref(true);

  return (
    <div class={styles.blue}>
      <button onClick={() => hasAttr.setValue(!hasAttr.value)}>
        { hasAttr.value ? 'hasAttr' : 'noAttr'}
      </button>
      <div>
        <button disabled={hasAttr.value} onClick={() => console.log('disabled')}>disabled</button>
      </div>
      <div><input type="checkbox" checked={hasAttr.value}/></div>
    </div>
  ) 
}