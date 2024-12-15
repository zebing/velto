import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed, ref,
} from "@lite/lite"
import styles from './styles.module.scss';

export default function ConditionalExpression() {
  let state = ref(false)
  let state1 = ref(false)
  
  const click = () => {
    state = !state;
  }
  const click1 = () => {
    state1 = !state1;
  }
  return (
    <div class={styles.wrap}>
      <div>Conditional start</div>
      <button onClick={click}>{state ? 'consequent' : 'alternate'}</button>
      <button onClick={click1}>{state1 ? 'consequent' : 'alternate'}</button>
      {state ? <div>true value</div> : <div>false value</div>}
      <div>Conditional object: {
        state ? {test: true} : {test: false}
      }</div>
      <div>Conditional number: {state ? 1 : 0}</div>
      嵌套 {state ? (state1 ? 'consequent1' : 'alternate1') : 'alternate0'}
      <div>Conditional end</div>
    </div>
  )
}