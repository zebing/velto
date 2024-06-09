import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed, ref,
} from "@lite/lite"
import Test from "../Test";

export default function LogicalExpression() {
  const state = ref(true)
  
  const click = () => {
    state.value = !state.value;
  }
  return (
    <div name="name" state={name}>
      <div onClick={click}>change name</div>
      {state.value && <div>test</div>}
      {state.value && <div><Test /></div>}
    </div>
  )
}