import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed, ref, watch, computed, Reactive, PropsWithRef
} from "velto"

import styles from "./styles.module.scss";

export default function Test(props: PropsWithRef<{ state?: Reactive<boolean> }>) {
  const computedRef = ref('computed');
  const style = ref<string>(styles.blue)
  const state = ref<{name: string}>({
    name: 'name',
  })
  console.log(style.value, state.value.name)
  const name: string = 'name';
  const hasEvent = ref(false);

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
      <button onClick={() => hasEvent.setValue(!hasEvent.value)}>
        { hasEvent.value ? 'hasEvent' : 'noEvent'}
      </button>
      <div onClick={hasEvent.value ? click : undefined}>change name</div>
      <div onClick={() =>{
        computedRef.setValue('new computed' + Math.random())
        console.log('++++computedRef', compuedValue)
      }}>change computed</div>
      <div>{style.value}</div>
      <div>{compuedValue.value}</div>
      <div>{props.state?.value ? 'true' : false}</div>
    </div>
  ) 
}