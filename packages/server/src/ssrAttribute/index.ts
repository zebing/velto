import {
  escapeHtml,
  normalizeStyle,
  stringifyStyle,
  normalizeClass,
  isEvent,
  isString,
  isBooleanAttribute,
} from "@velto/shared";

import { shouldIgnoreAttribute } from "../utils";

export function ssrSpreadAttribute(
  props: Record<string, unknown>,
): string {
  let ret = ''
  for (const key in props) {
    if (
      shouldIgnoreAttribute(key) ||
      isEvent(key)
    ) {
      continue;
    }

    const value = props[key];

    if (key === 'class') {
      ret += ` class="${ssrClass(value)}"`
    } else if (key === 'style') {
      ret += ` style="${ssrStyle(value)}"`
    } else {
      const isBoolean = isBooleanAttribute(key);
      ret += ` ${key}="${ssrAttribute(isBoolean ? '' : value)}"`
    }
  }

  ret + ' ';
  return ret;
}

export function ssrAttribute(value: unknown): string {
  return escapeHtml(value);
}

export function ssrStyle(raw: unknown): string {
  if (!raw) {
    return "";
  }
  if (isString(raw)) {
    return escapeHtml(raw);
  }
  const styles = normalizeStyle(raw);
  return escapeHtml(stringifyStyle(styles));
}

export function ssrClass(raw: unknown): string {
  return escapeHtml(normalizeClass(raw));
}
