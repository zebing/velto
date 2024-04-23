import { NodePath,  } from '@babel/core';
import { Program, jSXEmptyExpression, jSXElement, jSXOpeningElement, jSXIdentifier, jSXAttribute, jSXExpressionContainer, expressionStatement } from '@babel/types';
import { State } from '../types';
import { StateName, HelperName } from '../constants';
import { importHelper } from '../utils';

export default {
  enter(path: NodePath<Program>, state: State) {
    (Object.keys(HelperName) as HelperName[]).forEach((key: HelperName) => {
      state.set(key, path.scope.generateUidIdentifier(key));
    });
  },
  exit(path: NodePath<Program>, state: State) {
    if (state.get(StateName.hasJSX)) {
      importHelper(path, state);
    }

    // const test = jSXElement(
    //   jSXOpeningElement(
    //     jSXIdentifier('div'),
    //     [
    //       jSXAttribute(jSXIdentifier('id'), jSXExpressionContainer(jSXEmptyExpression())),
    //       jSXAttribute(jSXIdentifier('child'), jSXElement(
    //         jSXOpeningElement(
    //           jSXIdentifier('div'),
    //           [
    //             jSXAttribute(jSXIdentifier('id'), jSXExpressionContainer(jSXEmptyExpression())),
    //             jSXAttribute(jSXIdentifier('child'), ),
    //           ],
    //         ),
    //         null,
    //         [],
    //       )),
    //     ],
    //   ),
    //   null,
    //   [],
    // )

    // path.node.body.push(expressionStatement(test))
  }
}