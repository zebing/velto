import { NodePath } from '@babel/traverse';
import { memberExpression, CallExpression, identifier, Expression, Identifier, VariableDeclarator } from '@babel/types';
import { isReactive } from '../utils';

export function runtimeReactiveValue(path: NodePath<CallExpression>) {
  const parentPath = path.parentPath as NodePath<VariableDeclarator>;

  if (isReactive(parentPath)) {
    const idPath = parentPath.get('id');
    if (!Array.isArray(idPath) && idPath.isIdentifier()) {
      const { referencePaths = [], constantViolations = [] } = idPath.scope.getBinding(idPath.node.name) || {};
      constantViolations
        .filter(reactivePath => !(reactivePath.node?.extra?._processed))
        .forEach((reactivePath) => {
          if (reactivePath.isAssignmentExpression()) {
            const currentPath = reactivePath.get('left');
            currentPath.replaceWith(
              memberExpression(currentPath.node as Expression, identifier('value'))
            );
          }
        });
      referencePaths
        .filter(reactivePath => !(reactivePath.node?.extra?._processed))
        .forEach(reactivePath => {
          let currentPath: NodePath = reactivePath;
          
          // Traverse through MemberExpressions until finding the object
          while (currentPath.isMemberExpression()) {
            currentPath = currentPath.get('object');
          }

          // Replace with new member expression
          currentPath.replaceWith(
            memberExpression(currentPath.node as Expression, identifier('value'))
          );

          // Mark the node as processed
          currentPath.node.extra ??= {};
          currentPath.node.extra._processed = true;
        });
    }
  }
}