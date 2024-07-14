import originState from "./state";
import { ref } from "@lite/lite";

const state = ref(originState);

export default function Child() {
  return (
    <div style={{ border: '1px solid blue'}}>
      <div>child</div>
      <div>state: {state.name}</div>
    </div>
  )
}