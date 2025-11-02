import { NodePath } from '@babel/traverse';
import { Program } from '@babel/types';
import { Helper } from '../helper';
import { NodePathState } from '../types';
import { idGenerator } from '@velto/shared';
import { PluginPass } from '@babel/core';

export default {
  enter(path: NodePath<Program>, state: PluginPass) {
    idGenerator.setFilename(state.filename || '');
    path.state = {} as NodePathState;
    path.state.helper = new Helper(path);
  },
  exit(path: NodePath<Program>) {
    const state = path.state as NodePathState;
    if (state.helper.hasSpecifier) {
      path.node.body.unshift(state.helper.helperImportDeclaration);
    }
  }
}