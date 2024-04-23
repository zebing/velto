import { NodePath } from '@babel/core';
import { variableDeclaration, JSXElement, callExpression, Expression, SpreadElement, ArgumentPlaceholder, JSXNamespacedName, stringLiteral, identifier, variableDeclarator, isObjectExpression, objectProperty, objectExpression, booleanLiteral } from '@babel/types';
import { State } from '../types';
import { getTagLiteral, isNativeTag } from '../utils';
import transformChildren from './transformChildren';
import transformProps from './transformProps';
import { HelperName, StateName } from '../constants';
import { RenderFunctionParamsName, createVariableDeclaration, renderFunction, setParentId, getParentId } from '../helper';

export default function transformJSXElement(path: NodePath<JSXElement>, state: State) {
  const jsxRootPath = state.get(StateName.jsxRootPath);
  const tag = getTagLiteral(path.get('openingElement'));
  const isNative = isNativeTag(tag) || tag === 'div1';

  if (!isNative) {
    setParentId(path);
    let props = transformProps(path.get('openingElement').get('attributes'), state);
    const children = transformChildren(path.get('children'), state);

    if (children.length) {
      const render = renderFunction({ children, hoist: true, rootPath: jsxRootPath, path });
      
      if (isObjectExpression(props)) {
        props.properties.push(
          objectProperty(
            identifier('children'),
            render,
          )
        );
      } else {
        props = objectExpression([
          objectProperty(
            identifier('children'),
            render,
          )
        ]);
      }
    }

    const id = createVariableDeclaration({
      name: 'instance',
      callee: state.get(HelperName.createComponent),
      argument: [
        isNative ? stringLiteral(tag) : identifier(tag),
        props,
      ],
      rootPath: jsxRootPath,
    });
    return [
      callExpression(
        state.get(HelperName.renderComponent),
        [
          getParentId(path),
          id,
        ],
      )
    ];
  }

  const id = createVariableDeclaration({
    name: tag,
    callee: state.get(HelperName.createElement),
    argument: [
      isNative ? stringLiteral(tag) : identifier(tag),
    ],
    rootPath: jsxRootPath,
  });

  setParentId(path, id);

  const props = transformProps(path.get('openingElement').get('attributes'), state);
  const children = transformChildren(path.get('children'), state);

  return [
    ...children,
    callExpression(
      state.get(HelperName.appendChild),
      [
        getParentId(path),
        id,
        props,
      ],
    )
  ]
}