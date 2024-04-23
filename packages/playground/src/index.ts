// import { onBeforeUpdate,onUpdated,onUnmounted, createElement, render, onRendered, onBeforeRender, ref } from "../../dist";
// import styles from './styles.module.scss';
// const state = 0;
// const name = ref('app');
// const Test = () => {
//   onBeforeRender(() => {
//     console.log('+++++onBeforeRender')
//   })
//   onRendered(() => {
//     console.log('++++onRendered')
//   })
//   onBeforeUpdate(() => {
//     console.log('++++onBeforeUpdate')
//   })
//   onUpdated(() => {
//     console.log('++++onUpdated')
//   })
//   onUnmounted(() => {
//     console.log('++++onUnmounted')
//   })
//   console.log('+++render')
//   return createElement("div", null, createElement("name: " + name.value, {
//     effect: (e: { textContent: string; }) => () => e.textContent = "name: " + name.value
//   }));
// };
// const App = (() => {
//   onBeforeRender(() => {
//     console.log('+++++onBeforeRender app')
//   })
//   onRendered(() => {
//     console.log('++++onRendered app ')
//   })
//   onBeforeUpdate(() => {
//     console.log('++++onBeforeUpdate app')
//   })
//   onUpdated(() => {
//     console.log('++++onUpdated app')
//   })
//   onUnmounted(() => {
//     console.log('++++onUnmounted app')
//   })
//   console.log('+++render app')
//   // name.dep?.push(() => )
//   const msg = 'hello';
//   const click = () => {
//     name.value = 'new app'
//     console.log('clcik', name);
//   };
//   const helloHTML = createElement("div", null, createElement("hello"));
//   const listHTML = createElement("div", null, [1, 2].map(value => createElement("div", null, createElement(value + ''))));
//   return createElement("div", {
//     class: styles.test,
//     onClick: click
//   }, [state, createElement("div", {
//     onClick: click,
//     style: { color: 'yellow', background: 'blue' },
//   }, [createElement(" "), createElement(msg), createElement(" "), createElement("name: " + name.value, {
//     effect: (e) => () => e.textContent = "name: " + name.value
//   })]), createElement(Test), state && createElement(Test), createElement("input"), helloHTML, listHTML]);
// });

// render(App, document.getElementById('app'))