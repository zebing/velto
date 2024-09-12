import { NodePath, Binding, Scope } from "@babel/traverse";
import { Identifier, MemberExpression } from "@babel/types";
import { isReactive } from "./isReactive";

export function getReactives(expressPath: NodePath) {
  let reactiveList: Identifier[] = [];

  if (expressPath.isIdentifier()) {
    const reactive = getReactive(expressPath.scope, expressPath.node.name);

    if (reactive) {
      reactiveList.push(reactive);
    }
  }

  expressPath.traverse({
    Identifier(path) {
      const reactive = getReactive(path.scope, path.node.name);

      if (reactive) {
        reactiveList.push(reactive);
      }
    }
  });

  return reactiveList;
}

export function getReactive(scope: Scope, name: string) {
  let binding: Binding | undefined;
  while (scope && !binding) {
    binding = scope.getBinding(name);
    scope = scope.parent;
  }
  if (binding && ["var", "let", "const"].includes(binding.kind)) {
    if (isReactive(binding.path)) {
      return binding.identifier;
    } 
  }
}