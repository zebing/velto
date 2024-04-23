export function setEvent(
  el: Element,
  rawName: string,
  value: EventListener,
  options?: EventListenerOptions
) {
  const name = rawName.slice(2).toLocaleLowerCase();
  addEventListener(el, name, value, options)
}

export function addEventListener(
  el: Element,
  event: string,
  handler: EventListener,
  options?: EventListenerOptions
) {
  el.addEventListener(event, handler, options)
}

export function removeEventListener(
  el: Element,
  event: string,
  handler: EventListener,
  options?: EventListenerOptions
) {
  el.removeEventListener(event, handler, options)
}
