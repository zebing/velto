import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed, ref, watch, computed
} from "@lite/runtime"

import styles from "./styles.module.scss";

export default function Test() {
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
  onCreated(() => {
    console.log('+++++Test onCreated')
  })
  onBeforeMount(() => {
    console.log('+++++Test onBeforeMount')
  })
  onMounted(() => {
    console.log('+++++Test onMounted')
  })
  onBeforeUpdate(() => {
    console.log('+++++Test onBeforeUpdate')
  })
  onUpdated(() => {
    console.log('+++++Test onUpdated')
  })
  onBeforeDestroy(() => {
    console.log('+++++Test onBeforeDestroy')
  })
  onDestroyed(() => {
    console.log('+++++Test onDestroyed')
  })
  const click = () => {
    console.log('+++++++click')
    state.setValue({
      name: 'new name' + Math.random()
    });
    style.setValue(styles.green);
  }

  return (
    <div name="name" state={name} class={style.value}>
      <div onClick={click}>change name</div>
      <div onClick={() =>{
        computedRef.setValue('new computed' + Math.random())
        console.log('++++computedRef', compuedValue)
      }}>change computed</div>
      <div>{style.value}</div>
      <div>{compuedValue.value}</div>
    </div>
  ) 
}