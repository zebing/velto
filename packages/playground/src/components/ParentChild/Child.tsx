import state from "./state";

export default function Child() {
  return (
    <div style={{ border: '1px solid blue'}}>
      <div>child</div>
      <div>state: {state.value.name}</div>
    </div>
  )
}