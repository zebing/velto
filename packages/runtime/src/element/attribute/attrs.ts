import { isBooleanAttribute } from "@velto/shared";

export const xlinkNS = 'http://www.w3.org/1999/xlink'

export default function attr(
  el: Element,
  key: string,
  value: any,
  isSVG: boolean,
) {
  if (isSVG && key.startsWith('xlink:')) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isBooleanAttribute(key)
    if (value == null || (isBoolean && !(value || value === ''))) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, isBoolean ? '' : value)
    }
  }
}
