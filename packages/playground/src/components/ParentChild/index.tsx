import originState, { setName } from "./state";
import Child from "./Child";
import { ref } from "@lite/lite";

const state = ref(originState);

export default function Parent() {
  return (
    <div style={{ border: '1px solid red'}}>
      <button onClick={setName}>set name</button>
      <div>Parent</div>
      <div>state: {state.name}</div>
      <div>
        <Child />
      </div>
    </div>
  )
}