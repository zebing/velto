import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed, ref,
} from "@lite/lite"

import styles from "./styles.module.scss";

export default function Test() {
  const style = ref(styles.blue)
  const state = ref({
    name: 'name',
  })
  const name: string = 'name';
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
    state.value = {
      name: 'new name'
    };
    style.value = styles.yellow;
  }
  return (
    <div name="name" state={name} class={style.value}>
      <div onClick={click}>change name</div>
      <div>name: {state.value?.name}</div>
    </div>
  )
}