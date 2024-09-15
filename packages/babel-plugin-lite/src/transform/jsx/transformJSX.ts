import { JSXText, stringLiteral } from '@babel/types';
import transformJSXElement from './transformJSXElement';
import { transformJSXExpression } from './transformJSXExpression';
import { transformJSXLogicalExpression } from './transformJSXLogicalExpression';
import { transformJSXConditionalExpression } from './transformJSXConditionalExpression';
import { HelperNameType } from '../../helper';
import { TransformJSXOptions } from '../../types';
import { getParentId } from '../parentId';

export function transformJSX({ path, render, root }: TransformJSXOptions) {

  // JSXElement
  if (path.isJSXElement()) {
    transformJSXElement({ path, render, root });

    // JSXFragment
  } else if (path.isJSXFragment()) {
    path.get('children').forEach(path => transformJSX({ path, render, root }));

    // JSXExpressionContainer
  } else if (path.isJSXExpressionContainer()) {
    const expression = path.get('expression');

     // JSXElement
     if (expression.isJSXElement()) {
      transformJSXElement({ path: expression, render, root });
      
      // JSXFragment
    } else if (expression.isJSXFragment()) {
      expression.get('children').forEach(path => transformJSX({ path, render, root }));

      // LogicalExpression
    } else if (expression.isLogicalExpression()) {
      transformJSXLogicalExpression({ path: expression, render });

      // ConditionalExpression
    } else if (expression.isConditionalExpression()) {
      transformJSXConditionalExpression({ path: expression, render });


      // ignore JSXEmptyExpression
    } else if (!expression.isJSXEmptyExpression()) {
      transformJSXExpression({ path, render });
    }
    
    // JSXSpreadChild
  }  else if (path.isJSXSpreadChild()) {
    transformJSXExpression({ path, render });

    // JSXText
  } else {
    const str = (path.node as JSXText).value;
    // 过滤 "\n      ..." 字符
    if (!/^\n\s+$/gi.test(str)) {
      const parentId = getParentId(path);
      render.text({
        target: parentId,
        str: stringLiteral(str),
        type: root ? HelperNameType.insert : HelperNameType.append,
      });
    }
  }
}
