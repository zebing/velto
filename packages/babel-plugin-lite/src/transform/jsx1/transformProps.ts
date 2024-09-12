import { NodePath } from '@babel/traverse';
import {
  nullLiteral,
  JSXAttribute,
  JSXSpreadAttribute,
  objectProperty,
  ObjectProperty,
  identifier,
  JSXExpressionContainer,
  StringLiteral,
  Expression,
  SpreadElement,
  spreadElement,
  objectExpression,
} from '@babel/types';
import { getTagLiteral } from '../../utils';
import transformChildren from './transformChildren';
import transformJSXElement from './transformJSXElement';
import transformJSXRoot from './transformJSXRoot';
import Render from '../../render';

export default function transformProps(
  path: NodePath<JSXAttribute | JSXSpreadAttribute>[],
  render: Render,
) {
  if (!path.length) {
    return objectExpression([]);
  }

  const properties: (ObjectProperty | SpreadElement)[] = [];

  path.forEach((attribute) => {
    // JSXAttribute
    if (attribute.isJSXAttribute()) {
      const nameLiteral = attribute.get('name').getSource();
      const value = attribute.get('value');

      if (
        value.isJSXElement() // JSXElement <div child=<div></div>></div>
        || value.isJSXFragment() // JSXFragment <div child=<></>></div>
      ) {
        const subRender = new Render({
          nodePath: value,
        });
        transformJSXRoot(value, subRender);
        properties.push(objectProperty(
          identifier(nameLiteral),
          subRender.generateFunctionDeclaration(),
        ));

        // JSXExpressionContainer
        // {expression}
      } else if (value.isJSXExpressionContainer()) {
        const expression = value.get('expression');

        if (
          expression.isJSXElement() // JSXElement <div child={<div></div>}></div>
          || expression.isJSXFragment() // JSXFragment <div child={<></>}></div>
        ) {
          const subRender = new Render({
            nodePath: value,
          });
          transformJSXRoot(expression, subRender);
          properties.push(objectProperty(
            identifier(nameLiteral),
            subRender.generateFunctionDeclaration(),
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