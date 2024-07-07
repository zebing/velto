import { NodePath } from '@babel/traverse';
import { memberExpression, CallExpression, ArrowFunctionExpression, FunctionDeclaration, Identifier, identifier } from '@babel/types';
import { State } from '../types';
import { NodePathDataKey } from '../constants';
import transformJSXRoot from '../transform/transformJSXRoot';
import Render from '../render';
import { getRefs, setArrayMapCalleeNameRef } from '../utils';

export default function CallExpression(path: NodePath<CallExpression>, state: State) {
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
          const refList = getRefs(callee);
          const binding = callbackParams[0].scope.getBinding(callbackParams[0].node.name);
  
          if (refList.length && binding) {
            setArrayMapCalleeNameRef<typeof binding.path.node, Identifier[]>(binding.path, NodePathDataKey.refList, refList)
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