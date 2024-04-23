export const xlinkNS = 'http://www.w3.org/1999/xlink'
export const isSpecialBooleanAttr = (value: string) => 
  ['itemscope', 'allowfullscreen', 'formnovalidate', 'ismap', 'nomodule', 'novalidate', 'readonly'].includes(value)

export function setAttribute(
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
    const isBoolean = isSpecialBooleanAttr(key)
    if (value == null || (isBoolean && !(value || value === ''))) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, isBoolean ? '' : value)
    }
  }
}
