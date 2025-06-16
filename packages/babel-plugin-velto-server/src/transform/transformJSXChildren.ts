import {
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXSpreadChild,
  JSXText,
  stringLiteral,
} from '@babel/types';
import { TransformJSXChildrenOptions } from '../types';
import { transformJSXElement } from './transformJSXElement';
import { transformJSXFragment } from './transformJSXFragment';
import { transformJSXExpression } from './transformJSXExpression';
import { transformJSXLogicalExpression } from './transformJSXLogicalExpression';
import { transformJSXConditionalExpression } from './transformJSXConditionalExpression';

export function transformJSXChildren(
  { path, context }: TransformJSXChildrenOptions<JSXElement | JSXExpressionContainer | JSXFragment | JSXSpreadChild | JSXText>
){
  path.forEach((children) => {
    // JSXElement
    if (children.isJSXElement()) {
      transformJSXElement({ path: children, context });

      // JSXFragment
    } else if (children.isJSXFragment()) {
      transformJSXFragment({path: children, context })

      // JSXExpressionContainer
    } else if (children.isJSXExpressionContainer()) {
      const expression = children.get('expression');

      // JSXElement
      if (expression.isJSXElement()) {
        transformJSXElement({ path: expression, context });
        
        // JSXFragment
      } else if (expression.isJSXFragment()) {
        transformJSXFragment({ path: expression, context })

        // LogicalExpression
      } else if (expression.isLogicalExpression()) {
        transformJSXLogicalExpression({ path: expression, context });

        // ConditionalExpression
      } else if (expression.isConditionalExpression()) {
        transformJSXConditionalExpression({ path: expression, context });

        // ignore JSXEmptyExpression
      } else if (!expression.isJSXEmptyExpression()) {
        transformJSXExpression({ path: children, context });
      }
      
      // JSXSpreadChild
    }  else if (children.isJSXSpreadChild()) {
      transformJSXExpression({ path: children, context });

      // JSXText
    } else {
      const str = (children.node as JSXText).value;
      // 过滤 "\n      ..." 字符
      if (!/^\n\s+$/gi.test(str)) {
        context.indent();
        context.newline();
        context.pushStringLiteral(stringLiteral(str));
        context.deindent();
      }
    }
  });
}