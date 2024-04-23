export default function setClass(el: Element, value: string | null, isSVG: boolean) {
  if (value == null) {
    el.removeAttribute('class')
  } else if (isSVG) {
    el.setAttribute('class', value)
  } else {
    el.className = value
  }
}