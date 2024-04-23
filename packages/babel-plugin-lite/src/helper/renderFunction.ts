import { identifier, blockStatement, expressionStatement, functionExpression, CallExpression, Statement, variableDeclaration, variableDeclarator, ExpressionStatement, isExpressionStatement, JSXFragment, JSXElement, IfStatement, isIfStatement } from '@babel/types';
import { NodePath } from '@babel/core';
import { setParentId } from './parentId';

export enum RenderFunctionParamsName {
  container = 'container',
  cache = 'cache',
}

export function renderFunction(option: {
  children: (CallExpression | ExpressionStatement | IfStatement)[];
  path?: NodePath<Statement | JSXFragment | JSXElement>;
  hoist?: boolean,
  rootPath?: NodePath<Statement>;
}) {
  const { children, hoist, rootPath, path } = option;
  setParentId(path);

  const render = functionExpression(
    identifier('render'),
    [
      identifier(RenderFunctionParamsName.container),
      identifier(RenderFunctionParamsName.cache),
    ], 
    blockStatement(
      children.map((node) => isExpressionStatement(node) || isIfStatement(node) ? node : expressionStatement(node))
    )
  );

  if (hoist && rootPath) {
    const id = rootPath.scope.generateUidIdentifier('render');
    const el = variableDeclaration(
      "const",
      [
        variableDeclarator(
          id,
          render,
        )
      ]
    );
    rootPath?.insertBefore(el);
    return id;
  }

  return render;
}
