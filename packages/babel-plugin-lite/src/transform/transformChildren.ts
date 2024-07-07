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
import { State } from '../types';
import transformJSXElement from './transformJSXElement';
import { StateName } from '../constants';
import Render from '../render';
import transformLogicalExpression from './transformLogicalExpression';
import transformConditionalExpression from './transformConditionalExpression';
import transformExpression from './transformExpression';
import { getParentId } from '../utils';

export default function transformChildren(
  path: NodePath<JSXElement | JSXExpressionContainer | JSXFragment | JSXSpreadChild | JSXText>[],
  state: State,
  render: Render,
){
  path.forEach((children) => {
    // JSXElement
    if (children.isJSXElement()) {
      transformJSXElement(children, state, render);
      
      // JSXFragment
    } else if (children.isJSXFragment()) {
      transformChildren(children.get('children'), state, render);

      // JSXExpressionContainer
    } else if (children.isJSXExpressionContainer()) {
      const expression = children.get('expression');

      // JSXElement
      if (expression.isJSXElement()) {
        transformJSXElement(expression, state, render);
        
        // JSXFragment
      } else if (expression.isJSXFragment()) {
        transformChildren(expression.get('children'), state, render);

        // LogicalExpression
        // expression && <div></div>
      } else if (expression.isLogicalExpression()) {
        transformLogicalExpression(expression, state, render);

        // ConditionalExpression
        // expression ? <div></div> : null
      } else if (expression.isConditionalExpression()) {
        transformConditionalExpression(expression, state, render);


        // ignore JSXEmptyExpression
      } else if (!expression.isJSXEmptyExpression()) {
        transformExpression(children, state, render);
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
            type: 'append',
          });
        }
    }
 });
}