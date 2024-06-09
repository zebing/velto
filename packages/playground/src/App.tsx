import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed,
} from "@lite/lite"
import Test from "./components/Test";

export default function App() {
  const name: string = 'name';
  onCreated(() => {
    console.log('+++++onCreated')
  })
  onBeforeMount(() => {
    console.log('+++++onBeforeMount')
  })
  onMounted(() => {
    console.log('+++++onMounted')
  })
  onBeforeUpdate(() => {
    console.log('+++++onBeforeUpdate')
  })
  onUpdated(() => {
    console.log('+++++onUpdated')
  })
  onBeforeDestroy(() => {
    console.log('+++++onBeforeDestroy')
  })
  onDestroyed(() => {
    console.log('+++++onDestroyed')
  })
  return (
    <div name={'name'}>
      <Test />
    </div>
  )
}