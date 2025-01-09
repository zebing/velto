import { JSXText, stringLiteral } from '@babel/types';
import transformJSXElement from './transformJSXElement';
import { transformJSXExpression } from './transformJSXExpression';
import { transformJSXLogicalExpression } from './transformJSXLogicalExpression';
import { transformJSXConditionalExpression } from './transformJSXConditionalExpression';
import { RuntimeHelper } from '../../helper';
import { TransformJSXOptions } from '../../types';
import { getParentId } from '../parentId';

export function transformJSX({ path, template, root }: TransformJSXOptions) {

  // JSXElement
  if (path.isJSXElement()) {
    transformJSXElement({ path, template, root });

    // JSXFragment
  } else if (path.isJSXFragment()) {
    path.get('children').forEach(path => transformJSX({ path, template, root }));

    // JSXExpressionContainer
  } else if (path.isJSXExpressionContainer()) {
    const expression = path.get('expression');

     // JSXElement
     if (expression.isJSXElement()) {
      transformJSXElement({ path: expression, template, root });
      
      // JSXFragment
    } else if (expression.isJSXFragment()) {
      expression.get('children').forEach(path => transformJSX({ path, template, root }));

      // LogicalExpression
    } else if (expression.isLogicalExpression()) {
      transformJSXLogicalExpression({ path: expression, template });

      // ConditionalExpression
    } else if (expression.isConditionalExpression()) {
      transformJSXConditionalExpression({ path: expression, template });


      // ignore JSXEmptyExpression
    } else if (!expression.isJSXEmptyExpression()) {
      transformJSXExpression({ path, template });
    }
    
    // JSXSpreadChild
  }  else if (path.isJSXSpreadChild()) {
    transformJSXExpression({ path, template });

    // JSXText
  } else {
    const str = (path.node as JSXText).value;
    // 过滤 "\n      ..." 字符
    if (!/^\n\s+$/gi.test(str)) {
      const parentId = getParentId(path);
      template.text({
        target: parentId,
        str: stringLiteral(str),
        type: root ? RuntimeHelper.insert : RuntimeHelper.append,
      });
    }
  }
}
