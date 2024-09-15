import { ref } from '@lite/lite';
import styles from './styles.module.scss';


export function ConditionalExpression() {
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

export function LogicalExpression() {
  const state = ref(true)
  const state1 = ref(true)
  
  const click = () => {
    state.value = !state.value;
  }
  return (
    <div class={styles.wrap}>
      <div>Logical start</div>
      <button onClick={click}>click</button>
      {state.value && <div>Logical jsx</div>}
      <div>Logical object: {state.value && {test: true}}</div>
      <div>Logical number: {state.value  && state1.value && 2}</div>
      <div onClick={click}>Logical end</div>
    </div>
  )
}

export function TestComponent() {
  return (
    <div>test component</div>
  )
}

export function TestJSXFragmentComponent() {
  let state1 = ref({name: 'name'});
  return (
    <>
      <div>test</div>
      <div>{state1}</div>
      {state1.name}
      <TestComponent
        {...state1}
        name="name" 
        state={state1} 
        onClick={click1}
        jsx={<div>compoenent jsx {state1}</div>}
      >
        <div>component child {state1}</div>
      </TestComponent>
    </>
  )
}

export default function JSXElement() {
  let state = ref({name: 'name'});
  const click = () => {
    state.name = 'new name';
  }

  const click1 = () => {
    state = {
      name: 'test name'
    };
  }

  return (
    <div
      {...state}
      test1={state}
      test="test1" 
      html=<div>test</div>
      html1={<div>test1</div>}
      onClick={click}
    >
      <div child={true}>{state}</div>
      <div>jsx text</div>
      <TestComponent
        {...state}
        name="name" 
        state={state} 
        onClick={click1}
        jsx={<div>compoenent jsx {state}</div>}
      >
        <div>component child {state}</div>
      </TestComponent>
      <LogicalExpression />
      <ConditionalExpression />
    </div>
  )
}
