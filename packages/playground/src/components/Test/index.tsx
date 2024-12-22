import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed, ref,
  RefImpl,
} from "@lite/lite"

import styles from "./styles.module.scss";

export default function Test() {
  const style = ref<string>(styles.blue)
  const refStyle = ref<RefImpl<string>>(style)
  const state = ref<{name: string}>({
    name: 'name',
  })
  const refState = ref<{name: string}>(state)
  console.log(style, state.name)
  const name: string = 'name';
  onCreated(() => {
    console.log('+++style', style === refStyle, refState === state)
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
    state.name = 'new name';
    style = styles.green;
  }
  return (
    <div name="name" state={name} class={style}>
      <div onClick={click}>change name</div>
      <div>name: {refState.name}</div>
      <div>{style}</div>
      <div>{refStyle}</div>
    </div>
  )
}