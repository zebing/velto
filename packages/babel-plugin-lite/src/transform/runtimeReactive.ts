import { NodePath } from '@babel/traverse';
import { Program, ImportDeclaration, Identifier } from '@babel/types';
import { HelperNameType } from '../helper';

function renameAndRemoveBinding(path: NodePath<Program>, bindingName: HelperNameType, runtimeHelperName: HelperNameType) {
  const binding = path.scope.getBinding(bindingName);
  if (binding && (binding.path.parent as ImportDeclaration)?.source.value === HelperNameType.source) {
    const runtimeIdentifier = path.state.helper.getHelperNameIdentifier(runtimeHelperName);
    path.scope.rename(bindingName, runtimeIdentifier.name);
    binding.path.remove();
  }
}

export function runtimeReactive(path: NodePath<Program>) {
  renameAndRemoveBinding(path, HelperNameType.ref, HelperNameType.runtimeRef);
  renameAndRemoveBinding(path, HelperNameType.computed, HelperNameType.runtimeComputed);
}