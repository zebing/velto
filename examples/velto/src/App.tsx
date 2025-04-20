import {
  onCreated, onBeforeMount, onMounted, onBeforeUpdate, onUpdated,
  onBeforeDestroy, onDestroyed,
} from "@velto/runtime"
import Test from "./components/Test";
import LogicalExpression from "./components/LogicalExpression";
import ConditionalExpression from "./components/ConditionalExpression";
import List from "./components/List";
import ParentChild from "./components/ParentChild";
import AsyncComponent from "./components/AsyncComponent";
import ElementAttribute from './components/ElementAttribute'



export default function App() {
  const name: string = 'name';
  onCreated(() => {
    console.log('+++++onCreated')
  })
  onBeforeMount(() => {
    console.log('+++++onBeforeMount')
  })
  onMounted(() => {
    console.log('+++++onMounted')
  })
  onBeforeUpdate(() => {
    console.log('+++++onBeforeUpdate')
  })
  onUpdated(() => {
    console.log('+++++onUpdated')
  })
  onBeforeDestroy(() => {
    console.log('+++++onBeforeDestroy')
  })
  onDestroyed(() => {
    console.log('+++++onDestroyed')
  })
  return (
    <div name={'name'}>
      <ElementAttribute />
      {/* {true ? <Test /> : null}
      <div>test</div>
      <AsyncComponent />
      <LogicalExpression>
        <Test />
      </LogicalExpression>
      <ConditionalExpression>
        <Test />
      </ConditionalExpression> */}
      <List />
      {/* <ParentChild /> */}
    </div>
  )
}