import { NodePath } from '@babel/core';
import {
  nullLiteral,
  JSXAttribute,
  JSXSpreadAttribute,
  objectProperty,
  ObjectProperty,
  identifier,
  SpreadElement,
  spreadElement,
  objectExpression,
} from '@babel/types';
import { State } from '../types';
import transformChildren from './transformChildren';
import { HelperName, StateName } from '../constants';
import transformJSXElement from './transformJSXElement';
import { renderFunction } from '../helper';

export default function transformProps(path: NodePath<JSXAttribute | JSXSpreadAttribute>[], state: State) {
  // 返回 null
  if (!path.length) {
    return nullLiteral();
  }
  const jsxRootPath = state.get(StateName.jsxRootPath);
  const properties: (ObjectProperty | SpreadElement)[] = [];

  path.forEach((attribute) => {
    // JSXAttribute
    if (attribute.isJSXAttribute()) {
      const nameLiteral = attribute.get('name').getSource();
      const value = attribute.get('value');

      // JSXElement
      // <div child=<div></div>></div>
      if (value.isJSXElement()) {
        const nodeList = transformJSXElement(value, state);
        properties.push(objectProperty(
          identifier(nameLiteral),
          renderFunction({ children: nodeList, hoist: true, rootPath: jsxRootPath }),
        ));

        // JSXFragment
        // <div child=<></>></div>
      } else if (value.isJSXFragment()) {
        const children = transformChildren(value.get('children'), state);
        properties.push(objectProperty(
          identifier(nameLiteral),
          renderFunction({ children, hoist: true, rootPath: jsxRootPath }),
        ));

        // JSXExpressionContainer
        // {expression}
      } else if (value.isJSXExpressionContainer()) {
        const expression = value.get('expression');

        // JSXElement
        // <div child={<div></div>}></div>
        if (expression.isJSXElement()) {
          const nodeList = transformJSXElement(expression, state);
          properties.push(objectProperty(
            identifier(nameLiteral),
            renderFunction({ children: nodeList, hoist: true, rootPath: jsxRootPath }),
          ));

          // JSXFragment
          // <div child={<></>}></div>
        } else if (expression.isJSXFragment()) {
          const children = transformChildren(expression.get('children'), state);
          properties.push(objectProperty(
            identifier(nameLiteral),
            renderFunction({ children, hoist: true, rootPath: jsxRootPath }),
          ));

        } else if (expression.isExpression()) {
          properties.push(objectProperty(
            identifier(nameLiteral),
            expression.node,
          ));
        }
        
        // StringLiteral
      } else if (value.isStringLiteral()) {
        properties.push(objectProperty(
          identifier(nameLiteral),
          value.node,
        ));
      }

      // JSXSpreadAttribute
    } else {
      properties.push(spreadElement((attribute.node as JSXSpreadAttribute).argument));
    }
  });

  return objectExpression(properties);
}