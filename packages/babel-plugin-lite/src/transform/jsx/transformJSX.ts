import { NodePath } from '@babel/traverse';
import { JSXElement, JSXFragment, JSXExpressionContainer, JSXSpreadChild, JSXText, identifier, Expression, stringLiteral } from '@babel/types';
import transformJSXElement from './transformJSXElement';
// import transformExpression from './transformExpression';
// import transformChildren from './transformChildren';
// import transformLogicalExpression from './transformLogicalExpression';
// import transformConditionalExpression from './transformConditionalExpression';
// import transformJSXElementAttribute from './transformJSXElementAttribute';
import { getTagLiteral } from '../../utils';
import { isNativeTag } from '../../utils';
import Render from '../../render';
import { HelperNameType } from '../../helper';
import { TransformJSXOptions } from '../../types';
import { getParentId, setParentId } from '../parentId';

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
      // transformLogicalExpression(expression, render);

      // ConditionalExpression
    } else if (expression.isConditionalExpression()) {
      // transformConditionalExpression(expression, render);


      // ignore JSXEmptyExpression
    } else if (!expression.isJSXEmptyExpression()) {
      // transformExpression(path, render);
    }
    
    // JSXSpreadChild
  }  else if (path.isJSXSpreadChild()) {
    // transformExpression(path, render);

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
