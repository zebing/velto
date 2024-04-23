import { NodePath } from '@babel/core';
import { Program, importDeclaration, stringLiteral, importSpecifier, identifier } from '@babel/types';
import { State } from '../types';
import { HelperName } from '../constants';

export function importHelper(path: NodePath<Program>, state: State) {
  const importHelper = importDeclaration(
    [
      importSpecifier(state.get(HelperName.createElement), identifier(HelperName.createElement))
    ],
    stringLiteral(HelperName.source),
  );
  path.node.body.unshift(importHelper);
}
