import { ref } from "@lite/lite";

const state = ref<{ name: string }>({
  name: 'name',
});

export const setName = () => {
  state.name = `new name ${Math.random().toString(16).slice(2)}`;
  console.log('+++++++++', state)
}

export default state;