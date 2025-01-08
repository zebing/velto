import state, { setName } from "./state";
import Child from "./Child";

export default function Parent() {
  return (
    <div style={{ border: '1px solid red'}}>
      <button onClick={setName}>set name</button>
      <div>Parent</div>
      <div>state: {state.value.name}</div>
      <div>
        <Child />
      </div>
    </div>
  )
}