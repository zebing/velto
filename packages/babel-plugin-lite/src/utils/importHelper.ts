import { NodePath } from '@babel/core';
import { Program, importDeclaration, stringLiteral, importSpecifier, identifier } from '@babel/types';
import { State } from '../types';
import { HelperName } from '../constants';

export function importHelper(path: NodePath<Program>, state: State) {
  const importHelper = importDeclaration(
    (Object.keys(HelperName) as HelperName[]).map((key: HelperName) => {
      return importSpecifier(state.get(key), identifier(key))
    }),
    stringLiteral(HelperName.source),
  );
  path.node.body.unshift(importHelper);
}
