import { NodePath } from '@babel/traverse';
import { memberExpression, CallExpression, ArrowFunctionExpression, FunctionDeclaration, Identifier, identifier, Expression, MemberExpression } from '@babel/types';
// import transformJSXRoot from '../transform/jsx/transformJSXRoot';
import Render from '../render';
import { getReactives, setArrayMapCalleeNameRef, isArray } from '../utils';
import { runtimeReactiveValue } from '../transform';

export default function CallExpression(path: NodePath<CallExpression>) {
  runtimeReactiveValue(path);
  const callee = path.get('callee');
  const callbackPath = path.get('arguments')[0] as unknown as NodePath<ArrowFunctionExpression | FunctionDeclaration>;

  // list.map(() => {})
  if (callee.isMemberExpression() && callbackPath) {
    const property = callee.get('property');
    const object = callee.get('object');

    // property is map
    if (property.isIdentifier() && property.node.name === 'map' && object.isIdentifier()) {
      const callbackParams = callbackPath.get('params');
      const callbackBody = callbackPath.get('body');

      if (isJSXBody(callbackBody)) {
        
        if (callbackParams[0].isIdentifier()) {
          const reactiveList = getReactives(callee);
          const binding = callbackParams[0].scope.getBinding(callbackParams[0].node.name);
  
          if (reactiveList.length && binding) {
            setArrayMapCalleeNameRef<typeof binding.path.node>(binding.path, reactiveList)
          }
          if (binding && binding.referenced) {
            let index = identifier('index');
            
            if (callbackParams.length < 2) {
              callbackPath.pushContainer('params', index);

            } else {
              index = callbackParams[1].node as Identifier;
            }

            const referencePaths = binding.referencePaths;
            referencePaths.forEach((referencePath) => {
              referencePath.replaceWith(
                memberExpression(object.node, index, true),
              )
            })
          }
        }
      }
    }
  }
}

function isJSXBody(path: NodePath<unknown>) {
  if (path.isJSXElement() || path.isJSXFragment()) {
    return true;
  }

  if (path.isReturnStatement()) {
    const argument = path.get('argument');
    return argument.isJSXElement() || argument.isJSXFragment()
  }

  return false;
}
