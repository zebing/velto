import { NodePath } from "@babel/traverse";
import { NodePathState } from "../types";
import { HelperNameType } from "../helper";

export function isReactive(path: NodePath) {
  const state = path.state as NodePathState;

  if (path.isVariableDeclarator()) {
    const initPath = path.get('init');

    if (initPath.isCallExpression()) {
      const calleePath = initPath.get('callee');

      if (
        calleePath.isIdentifier() &&
        [
          state?.helper?.getHelperNameIdentifier(HelperNameType.runtimeRef).name,
          state?.helper?.getHelperNameIdentifier(HelperNameType.runtimeComputed).name,
        ].includes(calleePath.node.name)
      ) {
        return true;
      }
    }
  }

  return false;
}
