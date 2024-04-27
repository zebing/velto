import {
  onCreated, onBeforeRender, onRendered, onBeforeUpdate, onUpdated,
  onBeforeUnMount, onUnMounted,
} from "@lite/lite"
import Test from "./components/Test";

export default function App() {
  const name: string = 'name';
  onCreated(() => {
    console.log('+++++onCreated')
  })
  onBeforeRender(() => {
    console.log('+++++onBeforeRender')
  })
  onRendered(() => {
    console.log('+++++onRendered')
  })
  onBeforeUpdate(() => {
    console.log('+++++onBeforeUpdate')
  })
  onUpdated(() => {
    console.log('+++++onUpdated')
  })
  onBeforeUnMount(() => {
    console.log('+++++onBeforeUnMount')
  })
  onUnMounted(() => {
    console.log('+++++onUnMounted')
  })
  return (
    <div>
      <Test />
    </div>
  )
}