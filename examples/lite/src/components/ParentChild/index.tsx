import state, { setName } from "./state";
import Child from "./Child";
import { ref } from "@lite/runtime";

export default function Parent() {
  const jsxProps = ref('jsx')
  const slot = (
    <div>jsx prop {jsxProps.value}</div>
  )
  const click = () => {
    jsxProps.setValue('new jsx prop' + Math.random());
  }
  return (
    <div style={{ border: '1px solid red'}}>
      <button onClick={setName}>set name</button>
      <button onClick={click}>jsx props click</button>
      <div>Parent</div>
      <div>state: {state.value.name}</div>
      <div>
        <Child slot={slot}>
          <div>slot {jsxProps.value}</div>
        </Child>
      </div>
    </div>
  )
}