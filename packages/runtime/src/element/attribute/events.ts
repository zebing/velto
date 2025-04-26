const eventListenerMap = new WeakMap<Element, Record<string, EventListener>>();


export default function event(
  el: Element,
  eventName: string,
  value: EventListener,
  options?: EventListenerOptions
) {
  let elEventMap = eventListenerMap.get(el);

  if (!elEventMap) {
    elEventMap = {};
    eventListenerMap.set(el, elEventMap);
  }

  const oldEventValue = elEventMap[eventName];
  if (oldEventValue === value) {
    return;
  }

  const name = eventName.slice(2).toLocaleLowerCase();
  if (value) {
    addEventListener(el, name, value, options);
    elEventMap[eventName] = value;
  } else if (oldEventValue) {
    removeEventListener(el, name, oldEventValue, options);
    delete elEventMap[eventName];
  }
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
