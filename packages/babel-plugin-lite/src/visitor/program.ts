import { NodePath } from '@babel/traverse';
import { Program } from '@babel/types';
import { runtimeReactive } from '../transform';
import { Helper } from '../helper';
import { NodePathState } from '../types';

export default {
  enter(path: NodePath<Program>) {
    debugger
    path.state = {} as NodePathState;
    path.state.helper = new Helper({ rootPath: path });
    runtimeReactive(path);
  },
  exit(path: NodePath<Program>) {
    const state = path.state as NodePathState;
    if (state.helper.hasSpecifier) {
      path.node.body.unshift(state.helper.helperImportDeclaration);
    }
  }
}