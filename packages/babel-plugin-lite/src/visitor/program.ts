import { NodePath,  } from '@babel/traverse';
import { Program, ImportDeclaration, jSXElement, jSXOpeningElement, jSXIdentifier, jSXAttribute, jSXExpressionContainer, expressionStatement } from '@babel/types';
import { State } from '../types';
import { StateName } from '../constants';

export default {
  enter(path: NodePath<Program>, state: State) {
    // (Object.keys(HelperName) as HelperName[]).forEach((key: HelperName) => {
    //   state.set(key, path.scope.generateUidIdentifier(key));
    // });
  },
  exit(path: NodePath<Program>, state: State) {
    if (state.get(StateName.importHelper)) {
      path.node.body.unshift(state.get<ImportDeclaration>(StateName.importHelper));
    }

    // const test = jSXElement(
    //   jSXOpeningElement(
    //     jSXIdentifier('div'),
    //     [
    //       jSXAttribute(jSXIdentifier('id'), jSXExpressionContainer(jSXEmptyExpression())),
    //     ],
    //   ),
    //   null,
    //   [],
    // )

    // path.node.body.push(expressionStatement(test))
  }
}