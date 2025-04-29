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
  { path, template, target, anchor }: TransformJSXChildrenOptions<JSXElement | JSXExpressionContainer | JSXFragment | JSXSpreadChild | JSXText>
){
  path.forEach((children) => {
    // JSXElement
    if (children.isJSXElement()) {
      transformJSXElement({ path: children, template, target, anchor });

      // JSXFragment
    } else if (children.isJSXFragment()) {
      transformJSXFragment({path: children, template, target, anchor })

      // JSXExpressionContainer
    } else if (children.isJSXExpressionContainer()) {
      const expression = children.get('expression');

      // JSXElement
      if (expression.isJSXElement()) {
        transformJSXElement({ path: expression, template, target, anchor });
        
        // JSXFragment
      } else if (expression.isJSXFragment()) {
        transformJSXFragment({ path: expression, template, target, anchor })

        // LogicalExpression
      } else if (expression.isLogicalExpression()) {
        transformJSXLogicalExpression({ path: expression, template, target, anchor });

        // ConditionalExpression
      } else if (expression.isConditionalExpression()) {
        transformJSXConditionalExpression({ path: expression, template, target, anchor });

        // ignore JSXEmptyExpression
      } else if (!expression.isJSXEmptyExpression()) {
        transformJSXExpression({ path: children, template, target, anchor });
      }
      
      // JSXSpreadChild
    }  else if (children.isJSXSpreadChild()) {
      transformJSXExpression({ path: children, template, target, anchor });

      // JSXText
    } else {
      const str = (children.node as JSXText).value;
      // 过滤 "\n      ..." 字符
      if (!/^\n\s+$/gi.test(str)) {
        template.text({
          target,
          str: stringLiteral(str),
        });
      }
    }
  });
}