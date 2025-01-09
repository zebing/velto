import {
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXSpreadChild,
  JSXText,
} from '@babel/types';
import { transformJSX } from './transformJSX';
import { TransformJSXChildrenOptions } from '../../types';

export function transformJSXChildren(
  { path, template }: TransformJSXChildrenOptions<JSXElement | JSXExpressionContainer | JSXFragment | JSXSpreadChild | JSXText>
){
  path.forEach((children) => {
    transformJSX({ path: children, template });
  });
}