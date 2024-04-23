import { isString, isArray, camelize, capitalize, hyphenate } from "../../utils";
export type Style = string | Record<string, string | string[]> | null

export function setStyle(el: Element, value: Style) {
  if (!value) {
    return el.removeAttribute('style');
  }

  const style = (el as HTMLElement).style;

  if (isString(value)) {
    style.cssText = value;
  } else {
    for (const key in value) {
      resolveStyle(style, key, value[key])
    }
  }
}

function resolveStyle(
  style: CSSStyleDeclaration,
  name: string,
  val: string | string[]
) {
  if (isArray(val)) {
    val.forEach(v => resolveStyle(style, name, v));
  } else {
    if (val == null) val = '';

    if (name.startsWith('--')) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      const importantRE = /\s*!important$/;
      if (importantRE.test(val)) {
        // !important
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ''),
          'important'
        );
      } else {
        style[prefixed as any] = val;
      }
    }
  }
}

const prefixCache: Record<string, string> = {};

function autoPrefix(style: CSSStyleDeclaration, rawName: string): string {
  const prefixes = ['Webkit', 'Moz', 'ms'];
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== 'filter' && name in style) {
    return (prefixCache[rawName] = name);
  }
  name = capitalize(name)
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return (prefixCache[rawName] = prefixed);
    }
  }
  return rawName;
}
