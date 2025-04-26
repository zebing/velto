import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed, ref, watch, computed
} from "@velto/runtime"

import styles from "./styles.module.scss";

export default function Event() {
  const computedRef = ref('computed');
  const style = ref<string>(styles.blue)
  const state = ref<{name: string}>({
    name: 'name',
  })
  console.log(style.value, state.value.name)
  const name: string = 'name';

  const compuedValue = computed(() => {
    return computedRef.value + ' computed';
  })

  watch([state, style], (value, oldValue) => {
    console.log('++++watch', value, oldValue)
  }, { immediate: false, once: true })

  return (
    <div name="name" state={name} class={style.value}>
      <div onClick={() =>{
        computedRef.setValue('new computed' + Math.random())
        console.log('++++computedRef', compuedValue)
      }}>change computed</div>
      <div>{style.value}</div>
      <div>{compuedValue.value}</div>
    </div>
  ) 
}