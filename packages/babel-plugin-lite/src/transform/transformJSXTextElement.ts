import { NodePath } from '@babel/core';
import { variableDeclaration, JSXElement, callExpression, Expression, SpreadElement, JSXText, JSXNamespacedName, stringLiteral, identifier, StringLiteral, variableDeclarator } from '@babel/types';
import { State } from '../types';
import { HelperName, StateName } from '../constants';
import { getParentId, createVariableDeclaration } from '../helper';

export default function transformJSXTextElement(path: NodePath<JSXText | Expression | SpreadElement>, state: State) {
  const jsxRootPath = state.get(StateName.jsxRootPath);
  const argument: (StringLiteral | Expression)[] = [];

  if (path.isJSXText()) {
    argument.push(stringLiteral(path.node.value));
  } else {
    argument.push(path.node as Expression);
  }

  const id = createVariableDeclaration({
    name: 'text',
    argument,
    callee: state.get(HelperName.createText),
    rootPath: jsxRootPath,
  });

  return callExpression(
    state.get(HelperName.appendChild),
    [
      getParentId(path),
      id,
    ],
  )
}