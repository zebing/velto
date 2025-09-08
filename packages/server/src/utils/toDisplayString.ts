import {
  isArray,
  isMap,
  isObject,
  isFunction,
  isPlainObject,
  isSet,
  isString
} from '@velto/shared';

export const toDisplayString = (val: unknown): string => {
  return isString(val)
    ? val
    : val == null
    ? ''
    : isArray(val) ||
      (isObject(val) &&
        (val.toString === Object.prototype.toString || !isFunction(val.toString)))
    ? JSON.stringify(val, replacer, 2)
    : String(val)
}

const replacer = (_key: string, val: any): any => {
  if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val]) => {
        ;(entries as any)[`${key} =>`] = val
        return entries
      }, {})
    }
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    }
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val)
  }
  return val
}