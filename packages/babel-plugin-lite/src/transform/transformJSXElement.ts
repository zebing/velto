import { NodePath } from '@babel/core';
import { arrowFunctionExpression, JSXElement, callExpression, Expression, SpreadElement, ArgumentPlaceholder, JSXNamespacedName, stringLiteral, isObjectExpression, ObjectProperty, ObjectMethod } from '@babel/types';
import { State } from '../types';
import { getTagLiteral, isNativeTag } from '../utils';
import transformChildren from './transformChildren';
import transformProps from './transformProps';
import { HelperName, StateName } from '../constants';
import { RenderFunctionParamsName, createVariableDeclaration, renderFunction, setParentId, getParentId } from '../helper';
import transformComponent from './transformComponent';

export default function transformJSXElement(path: NodePath<JSXElement>, state: State) {
  const jsxRootPath = state.get(StateName.jsxRootPath);
  const tag = getTagLiteral(path.get('openingElement'));
  const isNative = isNativeTag(tag);

  if (!isNative) {
    return transformComponent(path, state);
  }
  const id = jsxRootPath.scope.generateUidIdentifier(tag)
  setParentId(path, id);
  
  const props = transformProps(path.get('openingElement').get('attributes'), state);
  const children = transformChildren(path.get('children'), state);

  createVariableDeclaration({
    id,
    name: tag,
    callee: state.get(HelperName.createElement),
    argument: [
      stringLiteral(tag),
      arrowFunctionExpression([], props),
    ],
    rootPath: jsxRootPath,
  });

  return [
    ...children,
    callExpression(
      state.get(HelperName.appendChild),
      [
        getParentId(path),
        id,
      ],
    )
  ]
}