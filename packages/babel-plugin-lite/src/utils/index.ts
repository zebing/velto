
import { stringCurrying } from './stringCurrying';
import { HTML_TAGS, SVG_TAGS } from '../constants';
import { JSXOpeningElement, isJSXIdentifier, isJSXMemberExpression, isJSXNamespacedName } from '@babel/types';
import { NodePath } from '@babel/traverse';

export * from './parentId';
export * from './getRefs';

export const isHTMLTag = stringCurrying(HTML_TAGS, true);
export const isSVGTag = stringCurrying(SVG_TAGS, true);
export const isNativeTag = (name: string) => isHTMLTag(name) || isSVGTag(name);
export const isString = (value: any) => Object.prototype.toString.call(value) === '[object String]';
export const isArray = (value: any) => Array.isArray(value);
export const isObject = (value: any) => Object.prototype.toString.call(value) === '[object Object]';
export const isUndefined = (value: any) => Object.prototype.toString.call(value) === '[object Undefined]';

export function getTagLiteral(path: NodePath<JSXOpeningElement>) {
  const namePath = path.get('name');
  return namePath.getSource();
}