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
import transformJSXElement from './transformJSXElement';
import { transformJSX } from './transformJSX';
import Render from '../../render';
import { TransformJSXChildrenOptions } from '../../types';

export function transformJSXComponentProps({ path, render }: TransformJSXChildrenOptions) {
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
          rootPath: render.rootPath,
        });
        transformJSX({ path: value, render: subRender, root: true });
        properties.push(objectProperty(
          identifier(nameLiteral),
          subRender.generate(),
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
            rootPath: render.rootPath,
          });
          transformJSX({ path: expression, render: subRender, root: true });
          properties.push(objectProperty(
            identifier(nameLiteral),
            subRender.generate(),
          ));

        } else {
          properties.push(
            objectProperty(
              identifier(nameLiteral),
              expression.node as Expression,
            )
          );
        }
        
        // StringLiteral
      } else if (value.isStringLiteral()) {
        properties.push(
          objectProperty(
            identifier(nameLiteral),
            value.node,
          )
        );
      }

      // JSXSpreadAttribute
    } else {
      properties.push(spreadElement((attribute.node as JSXSpreadAttribute).argument));
    }
  });


  return objectExpression(properties);
}