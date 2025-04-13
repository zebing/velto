import { ref, computed } from '@velto/runtime';

// transform
const stateRef = ref({});
const stateComputed = computed(() => true);
console.log(stateRef, stateComputed)