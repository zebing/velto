import { NodePath } from '@babel/core';
import { JSXElement } from '@babel/types';
import { State } from '../../types';
import { getTagLiteral, isNativeTag } from '../../utils';
import { StateName } from '../../constants';
import component from './component';
import element from './element';

export default function transformJSXElement(path: NodePath<JSXElement>, state: State) {
  const tag = getTagLiteral(path.get('openingElement'));

  if (!isNativeTag(tag)) {
    return component(path, state);
  }
  
  return element(path, state);
}