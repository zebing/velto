import { NodePath, Binding, Scope } from "@babel/traverse";
import { Identifier, VariableDeclarator, CallExpression, MemberExpression } from "@babel/types";
import { NodePathDataKey } from "../constants";
import { getArrayMapCalleeNameRef } from "./arrayMap";

export function getRefs(expressPath: NodePath<any>) {
  const refList: Identifier[] = [];

  const memberExpressionHelper = (path: NodePath<MemberExpression>) => {
    const object = path.get('object');

      if (object.isIdentifier()) {
        const binding = getBinding(path.scope, object.node.name);

        if (binding) {
          const stateRefList = getArrayMapCalleeNameRef<typeof binding.path.node>(binding.path, NodePathDataKey.refList) || [];
          refList.push(...stateRefList);

          const ref = getRefFromBinding(binding);

          if (ref) {
            refList.push(ref);
          }
        }
      }
  }

  if (expressPath.isMemberExpression()) {
    memberExpressionHelper(expressPath);
  }

  expressPath.traverse({
    MemberExpression(path, state) {
      memberExpressionHelper(path);
    }
  });

  return refList;
}

export function getRefFromBinding(binding: Binding) {
  if (binding && ["var", "let", "const"].includes(binding.kind)) {

    if (binding.path.isVariableDeclarator()) {
      const init = binding.path.get('init');

      if (init.isCallExpression()) {
        const callee = init.get('callee');

        if (callee.isIdentifier()) {
          return binding.identifier;
        }
      }
    } 
  }
}

export function getBinding(scope: Scope, name: string) {
  

  while (scope) {
    const binding = scope.getBinding(name);

    if (binding) {
      return binding;

    } else {
      scope = scope.parent;
    }
  }
}