import { JSXAttribute, JSXSpreadAttribute, Expression, stringLiteral } from '@babel/types';
import { getReactives } from '../../utils';
import { getParentId } from '../parentId';
import { TransformJSXChildrenOptions } from '../../types';

export default function transformJSXElementAttribute(
  { path, render }: TransformJSXChildrenOptions<JSXAttribute | JSXSpreadAttribute>
) {
  const target = getParentId(path[0]);

  path.forEach((attribute) => {
    // JSXAttribute
    if (attribute.isJSXAttribute()) {
      const nameLiteral = attribute.get('name').getSource();
      const value = attribute.get('value');

      if (
        value.isJSXElement() // JSXElement <div child={<div></div>}></div>
        || value.isJSXFragment() // JSXFragment <div child={<></>}></div>
      ) {
        render.attr({
          target,
          name: nameLiteral, 
          value: stringLiteral(value.getSource()),
          reactiveList: [],
        });
        value.skip();

        // JSXExpressionContainer
        // {expression}
      } else if (value.isJSXExpressionContainer()) {
        const expression = value.get('expression');

        if (
          expression.isJSXElement() // JSXElement <div child={<div></div>}></div>
          || expression.isJSXFragment() // JSXFragment <div child={<></>}></div>
        ) {
          render.attr({
            target,
            name: nameLiteral, 
            value: stringLiteral(expression.getSource()),
            reactiveList: [],
          });
          value.skip();

        } else {
          const reactiveList = getReactives(value);

          render.attr({
            target,
            name: nameLiteral, 
            value: expression.node as Expression,
            reactiveList,
          });
        }
        
        // StringLiteral
      } else {
        render.attr({
          target,
          name: nameLiteral, 
          value: value.node as Expression,
          reactiveList: [],
        });
      }

      // JSXSpreadAttribute
    } else {
      const reactiveList = getReactives(attribute);
      render.spreadAttr({
        target,
        express: (attribute.node as JSXSpreadAttribute).argument,
        reactiveList,
      });
    }
  });
}