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
  JSXIdentifier,
  JSXOpeningElement,
} from '@babel/types';
import { getTagLiteral, getParentId, getReactives } from '../../utils';
import transformChildren from './transformChildren';
import transformJSXElement from './transformJSXElement';
import transformJSXRoot from './transformJSXRoot';
import Render from '../../render';

export default function transformJSXElementAttribute(
  path: NodePath<JSXAttribute | JSXSpreadAttribute>[], 
  render: Render,
) {
  if (!path.length) {
    return;
  }
  const target = getParentId(path[0]);


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
        render.attr({
          target,
          name: nameLiteral, 
          value: subRender.generateFunctionDeclaration(),
          reactiveList: [],
        });

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
          render.attr({
            target,
            name: nameLiteral, 
            value: subRender.generateFunctionDeclaration(),
            reactiveList: [],
          });

        } else if (expression.isExpression()) {
          const reactiveList = getReactives(value);

          render.attr({
            target,
            name: nameLiteral, 
            value: expression.node,
            reactiveList,
          });
        }
        
        // StringLiteral
      } else if (value.isStringLiteral()) {
        render.attr({
          target,
          name: nameLiteral, 
          value: value.node,
          reactiveList: [],
        });
      }

      // JSXSpreadAttribute
    } else {
      render.spreadAttr({
        target,
        express: (attribute.node as JSXSpreadAttribute).argument,
      });
    }
  });
}