import { NodePath } from '@babel/traverse';
import { Program, ImportDeclaration, isCallExpression, CallExpression } from '@babel/types';
import { HelperNameType } from '../helper';
import { runtimeReactiveValue } from './runtimeReactiveValue';

function renameAndRemoveBinding(path: NodePath<Program>, bindingName: HelperNameType, runtimeHelperName: HelperNameType) {
  const binding = path.scope.getBinding(bindingName);
  if (binding && (binding.path.parent as ImportDeclaration)?.source.value === HelperNameType.source) {
    const runtimeIdentifier = path.state.helper.getHelperNameIdentifier(runtimeHelperName);
    path.scope.rename(bindingName, runtimeIdentifier.name);

    const newBinding = path.scope.getBinding(runtimeIdentifier.name);
    const { referenced, referencePaths = [] } = newBinding || {};
    if (referenced) {
      referencePaths.forEach((path) => {
        if (isCallExpression(path.parentPath?.node)) {
          runtimeReactiveValue(path.parentPath as NodePath<CallExpression>);
        }
      })
    }

    binding.path.remove();
  }
}

// ref => runtimeRef
// computed => runtimeComputed
export function runtimeReactive(path: NodePath<Program>) {
  renameAndRemoveBinding(path, HelperNameType.ref, HelperNameType.runtimeRef);
  renameAndRemoveBinding(path, HelperNameType.computed, HelperNameType.runtimeComputed);
}