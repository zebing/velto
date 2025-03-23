export function markRender(fn) {
  const render = fn;
  render.__isRender = true;
  return render;
}

export default () => {
  return markRender(() => ({
     mount(element, anchor) {
      const div = document.createElement('div');
      div.innerHTML = `
        <div style="color: blue;"> async component</div>
      `
      element.insertBefore(div, anchor);
     },
     update() {

     },
     destroy() {

     }
  }))
}