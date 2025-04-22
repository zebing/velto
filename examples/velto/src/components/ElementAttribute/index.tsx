import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed, ref, watch, computed
} from "@velto/runtime"

import styles from "./styles.module.scss";
import Test from '../Test';

export default function ElementAttribute() {
  const hasAttr = ref(true);
  const dom = ref(null);
  const comp = ref(null);
  const html = `
  <div>
  test html
  <span style="color: green;border: 1px solid blue;">test html</span>
  </div>
  `

  onCreated(() => {
    console.log('++++++onCreated', dom.value, comp.value)
  })

  onBeforeMount(() => {
    console.log('++++++onBeforeMount', dom.value, comp.value)
  })

  onMounted(() => {
    console.log('++++++onMounted', dom.value, comp.value)
  })

  return (
    <div class={styles.blue} ref={dom}>
      <div innerHTML={html}></div>
      <div textContent={html}></div>
      <button onClick={() => hasAttr.setValue(!hasAttr.value)}>
        { hasAttr.value ? 'hasAttr' : 'noAttr'}
      </button>
      <div>
        <button disabled={hasAttr.value} onClick={() => console.log('disabled')}>disabled</button>
      </div>
      <div><input type="checkbox" checked={hasAttr.value}/></div>
      <Test ref={comp} />
    </div>
  ) 
}