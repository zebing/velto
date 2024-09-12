import { ref } from '@lite/lite';

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
    </div>
  )
}
