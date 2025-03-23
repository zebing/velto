export const svgNS = 'http://www.w3.org/2000/svg'

const doc = (typeof document !== 'undefined' ? document : null) as Document

export const append = (parent: Element, child: Element | Text, anchor?: any) => {
  if (anchor) {
    return insert(parent, child, anchor);
  }
  parent.appendChild(child);
}

export const insert = (parent: Element, child: Element | Text, anchor: any) => {
  parent.insertBefore(child, anchor || null)
}

export const remove = (child: Element | Text) => {
  const parent = child.parentNode
  if (parent) {
    parent.removeChild(child)
  }
}

export const createElement = (tag: string, isSVG?: boolean, is?: string): Element => {
  const el = isSVG
    ? doc.createElementNS(svgNS, tag)
    : doc.createElement(tag, is ? { is } : undefined)

  return el
}

export const text = (text: string) => doc.createTextNode(text);

export const comment = (text: string) => doc.createComment(text);

export const setText = (node: Element, text: string) => {
  node.nodeValue = text
}

export const setElementText = (el: Element, text: string) => {
  el.textContent = text
}

export const parentNode = (node: Element) => node.parentNode as Element | null;

export const nextSibling = (node: Element) => node.nextSibling;

export const querySelector = (selector: string) => doc.querySelector(selector);
