import { NodePath } from '@babel/core';
import { memberExpression, expressionStatement, forOfStatement, variableDeclaration, arrowFunctionExpression, blockStatement, JSXElement, callExpression, stringLiteral, identifier, variableDeclarator, isObjectExpression } from '@babel/types';
import { State } from '../../types';
import { getTagLiteral } from '../../utils';
import transformChildren from '../transformChildren';
import transformProps from '../transformProps';
import { HelperName, StateName } from '../../constants';
import {  createElementExpression, setParentId, getParentId } from '../../helper';

export default function element(path: NodePath<JSXElement>, state: State) {
  const jsxRootPath = state.get(StateName.jsxRootPath);
  const tag = getTagLiteral(path.get('openingElement'));
  const parentId = getParentId(path);

  const id = createElementExpression({
    state, name: tag, rootPath: jsxRootPath,
    argument: [
      stringLiteral(tag),
    ],
  });

  setParentId(path, id);
  
  const props = transformProps(path.get('openingElement').get('attributes'), state);
  const children = transformChildren(path.get('children'), state);

  const nodeList = [
    ...children,
  ];

  if (isObjectExpression(props)) {
    const propsIdentifier = identifier('props');
    const keyIdentifier = identifier('key');

    // demo
    // effect(() => {
    //   const props = {};
    //   for(const key of props) {
    //     setProp(div, key, props[key])
    //   }
    // })
    nodeList.push(
      callExpression(
        state.get(HelperName.effect),
        [
          arrowFunctionExpression(
            [], blockStatement([

            variableDeclaration('const', [
              variableDeclarator(propsIdentifier, props)
            ]),

            forOfStatement(
              variableDeclaration('const', [
                variableDeclarator(keyIdentifier)
              ]),
              propsIdentifier,
              expressionStatement(
                callExpression(
                  state.get(HelperName.setProp),
                  [
                    id,
                    keyIdentifier,
                    memberExpression(propsIdentifier, keyIdentifier)
                  ],
                )
              ),
            )
          ]))
        ],
      )
    )
  }

  nodeList.push(
    callExpression(
      state.get(HelperName.appendChild),
      [parentId, id],
    )
  );

  return nodeList;
}