import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed, ref,
} from "@lite/runtime"
import styles from './styles.module.scss';

export default function ConditionalExpression(props: Record<string, unknown>) {
  let state = ref(true)
  let state1 = ref(false)
  
  const click = () => {
    state.setValue(!state.value);
  }
  const click1 = () => {
    state1.setValue(!state1.value);
  }
  return (
    <div class={styles.wrap}>
      <div>Conditional start</div>
      <button onClick={click}>{state.value ? 'consequent' : 'alternate'}</button>
      <button onClick={click1}>{state1.value ? 'consequent' : 'alternate'}</button>
      {state.value ? <div>true value</div> : <div>false value</div>}
      {state1.value ? <div>true value</div> : <div>false value</div>}
      <div>Conditional object: {
        state.value ? {test: true} : {test: false}
      }</div>
      <div>Conditional number: {state.value ? 1 : 0}</div>
      嵌套 {state.value ? (state1.value ? 'consequent1' : 'alternate1') : 'alternate0'}
      <div>{state.value ? props.children : null}</div>
      <div>Conditional end</div>
    </div>
  )
}