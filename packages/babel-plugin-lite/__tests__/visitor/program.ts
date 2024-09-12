import { ref, computed } from '@lite/lite';

// transform
const stateRef = ref({});
const stateComputed = computed(() => true);
console.log(stateRef, stateComputed)