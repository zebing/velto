import {
  onCreated, onBeforeRender, onRendered, onBeforeUpdate, onUpdated,
  onBeforeUnMount, onUnMounted, ref,
} from "@lite/lite"

export default function Test() {
  const state = ref({
    name: 'name',
  })
  const name: string = 'name';
  onCreated(() => {
    console.log('+++++Test onCreated')
  })
  onBeforeRender(() => {
    console.log('+++++Test onBeforeRender')
  })
  onRendered(() => {
    console.log('+++++Test onRendered')
  })
  onBeforeUpdate(() => {
    console.log('+++++Test onBeforeUpdate')
  })
  onUpdated(() => {
    console.log('+++++Test onUpdated')
  })
  onBeforeUnMount(() => {
    console.log('+++++Test onBeforeUnMount')
  })
  onUnMounted(() => {
    console.log('+++++Test onUnMounted')
  })
  const click = () => {
    console.log('+++++++click')
    state.value = {
      name: 'new name'
    };
  }
  return (
    <div name="name" state={name}>
      <div onClick={click}>change name</div>
      <div>name: {state.value?.name}</div>
    </div>
  )
}