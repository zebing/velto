import { ref, computed } from '@lite/runtime';

// transform
const stateRef = ref({});
const stateComputed = computed(() => true);
console.log(stateRef, stateComputed)