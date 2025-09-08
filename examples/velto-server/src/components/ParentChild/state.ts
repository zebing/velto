import { ref } from "velto";

const state = ref<{ name: string }>({
  name: 'name1',
});

export const setName = () => {
  state.setValue({
    name: `new name ${Math.random().toString(16).slice(2)}`
  });
  console.log('+++++++++', state)
}

export default state;