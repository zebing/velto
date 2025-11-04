import { NodePath } from '@babel/traverse';
import { Program } from '@babel/types';
import { Helper } from '../helper';
import { NodePathState } from '../types';
import { PluginPass } from '@babel/core';
import idGenerator from '@velto/id-generator';

export default {
  enter(path: NodePath<Program>, state: PluginPass) {
    idGenerator.init(state.filename || '');
    path.state = {} as NodePathState;
    path.state.helper = new Helper(path);
  },
  exit(path: NodePath<Program>) {
    idGenerator.saveData();
    const state = path.state as NodePathState;
    if (state.helper.hasSpecifier) {
      path.node.body.unshift(state.helper.helperImportDeclaration);
    }
  }
}