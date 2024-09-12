import { NodePath } from '@babel/traverse';
import {
  SpreadElement,
  spreadElement,
  CallExpression,
  arrayExpression,
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXSpreadChild,
  JSXText,
  Expression,
  identifier,
  stringLiteral
} from '@babel/types';
import transformJSXElement from './transformJSXElement';
import Render from '../../render';
import transformLogicalExpression from './transformLogicalExpression';
import transformConditionalExpression from './transformConditionalExpression';
import transformExpression from './transformExpression';
import { getParentId } from '../../utils';
import { HelperNameType } from '../../helper';

export default function transformChildren(
  path: NodePath<JSXElement | JSXExpressionContainer | JSXFragment | JSXSpreadChild | JSXText>[],
  render: Render,
){
  path.forEach((children) => {
    // JSXElement
    if (children.isJSXElement()) {
      transformJSXElement(children, render);
      
      // JSXFragment
    } else if (children.isJSXFragment()) {
      transformChildren(children.get('children'), render);

      // JSXExpressionContainer
    } else if (children.isJSXExpressionContainer()) {
      const expression = children.get('expression');

      // JSXElement
      if (expression.isJSXElement()) {
        transformJSXElement(expression, render);
        
        // JSXFragment
      } else if (expression.isJSXFragment()) {
        transformChildren(expression.get('children'), render);

        // LogicalExpression
        // expression && <div></div>
      } else if (expression.isLogicalExpression()) {
        transformLogicalExpression(expression, render);

        // ConditionalExpression
        // expression ? <div></div> : null
      } else if (expression.isConditionalExpression()) {
        transformConditionalExpression(expression, render);


        // ignore JSXEmptyExpression
      } else if (!expression.isJSXEmptyExpression()) {
        transformExpression(children, render);
      }
      
      // JSXSpreadChild
      // {...expression}
    }  else if (children.isJSXSpreadChild()) {
      const expression = children.get('expression');
      const parentId = getParentId(expression);
      render.expression({
        target: parentId,
        express: expression.node as Expression
      });

      // JSXText
      // string
    } else {
        const str = (children.node as JSXText).value;
        const parentId = getParentId(children);
        // 过滤 "\n      ..." 字符
        if (!/^\n\s+$/gi.test(str)) {
          render.text({ 
            target: parentId,
            str: stringLiteral(str), 
            type: HelperNameType.append,
          });
        }
    }
 });
}