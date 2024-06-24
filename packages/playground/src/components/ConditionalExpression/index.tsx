import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed, ref,
} from "@lite/lite"
import styles from './styles.module.scss';

export default function ConditionalExpression() {
  const state = ref(false)
  const state1 = ref(false)
  
  const click = () => {
    state.value = !state.value;
  }
  const click1 = () => {
    state1.value = !state1.value;
  }
  return (
    <div class={styles.wrap}>
      <div>Conditional start</div>
      <button onClick={click}>{state.value ? 'consequent' : 'alternate'}</button>
      <button onClick={click1}>{state1.value ? 'consequent' : 'alternate'}</button>
      {state.value ? <div>true value</div> : <div>false value</div>}
      <div>Conditional object: {
        state.value ? {test: true} : {test: false}
      }</div>
      <div>Conditional number: {state.value ? 1 : 0}</div>
      嵌套 {state.value ? (state1.value ? 'consequent1' : 'alternate1') : 'alternate0'}
      <div>Conditional end</div>
    </div>
  )
}