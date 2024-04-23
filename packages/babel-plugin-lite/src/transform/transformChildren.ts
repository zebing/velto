import { NodePath } from '@babel/core';
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
  Identifier,
  stringLiteral,
  expressionStatement,
  nullLiteral,
  callExpression,
  ExpressionStatement,
  IfStatement,
} from '@babel/types';
import { State } from '../types';
import transformJSXElement from './transformJSXElement';
import transformJSXTextElement from './transformJSXTextElement';
import { HelperName } from '../constants';
import { getParentId } from '../helper';
import transformConditionalExpression from './transformConditionalExpression';
import transformLogicalExpression from './transformLogicalExpression';

export default function transformChildren(
  path: NodePath<JSXElement | JSXExpressionContainer | JSXFragment | JSXSpreadChild | JSXText>[],
  state: State)
{
  const childrenList: (CallExpression | ExpressionStatement | IfStatement)[] = [];
  path.forEach((children) => {
     // JSXElement
     // <div></div> => appendElement()
    if (children.isJSXElement()) {
      childrenList.push(...transformJSXElement(children, state));
      
      // JSXFragment
      // <></>
    } else if (children.isJSXFragment()) {
      childrenList.push(...transformChildren(children.get('children'), state));

      // JSXExpressionContainer
      // {expression} => (container, cache) => expression
    } else if (children.isJSXExpressionContainer()) {
      const expression = children.get('expression');

      // JSXElement
      // <div></div> => appendElement()
      if (expression.isJSXElement()) {
        childrenList.push(...transformJSXElement(expression, state));
        
        // JSXFragment
        // <></>
      } else if (expression.isJSXFragment()) {
        childrenList.push(...transformChildren(expression.get('children'), state));

        // LogicalExpression
        // expression && <div></div>
      } else if (expression.isLogicalExpression()) {
        childrenList.push(...transformLogicalExpression(expression, state));

        // ConditionalExpression
        // expression ? <div></div> : null
      } else if (expression.isConditionalExpression()) {
        childrenList.push(...transformConditionalExpression(expression, state));


        // ignore JSXEmptyExpression
      } else if (!expression.isJSXEmptyExpression()) {
        childrenList.push(callExpression(
          state.get(HelperName.append),
          [
            getParentId(expression as NodePath<Expression>),
            expression.node as Expression,
          ],
        ));
      }
      
      // JSXSpreadChild
      // {...expression}
    }  else if (children.isJSXSpreadChild()) {
      const expression = children.get('expression');
      childrenList.push(callExpression(
        state.get(HelperName.append),
        [
          getParentId(expression as NodePath<Expression>),
          expression.node as Expression,
        ],
      ));

      // JSXText
      // string
    } else {
      const str = (children.node as JSXText).value;
      // 过滤 "\n      ..." 字符
      if (!/^\n\s+$/gi.test(str)) {
        childrenList.push(transformJSXTextElement(children as NodePath<JSXText>, state));
      }
    }
  })
 
  return childrenList;
}