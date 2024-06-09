import { NodePath } from '@babel/traverse';
import { JSXElement, JSXFragment, JSXExpressionContainer, JSXSpreadChild, JSXText, identifier, Expression, stringLiteral } from '@babel/types';
import { State } from '../types';
import { StateName, anchorIdentifier } from '../constants';
import transformJSXElement from './transformJSXElement';
import transformExpression from './transformExpression';
import transformChildren from './transformChildren';
import transformLogicalExpression from './transformLogicalExpression';
import transformConditionalExpression from './transformConditionalExpression';
import transformJSXElementAttribute from './transformJSXElementAttribute';
import { getTagLiteral, getParentId, setParentId } from '../utils';
import { isNativeTag } from '../utils';
import Render from '../render';

export default function transformJSXRoot(
  path: NodePath<JSXElement | JSXFragment | JSXExpressionContainer | JSXSpreadChild | JSXText>,
  state: State,
  render: Render,
) {

  // JSXElement
  if (path.isJSXElement()) {
    transformJSXElement(path, state, render, { root: true });

    // JSXFragment
  } else if (path.isJSXFragment()) {
    path.get('children').forEach(path => transformJSXRoot(path, state, render));

    // JSXExpressionContainer
  } else if (path.isJSXExpressionContainer()) {
    const expression = path.get('expression');

     // JSXElement
     if (expression.isJSXElement()) {
      transformJSXElement(expression, state, render, { root: true });
      
      // JSXFragment
    } else if (expression.isJSXFragment()) {
      transformJSXRoot(path, state, render);

      // LogicalExpression
    } else if (expression.isLogicalExpression()) {
      transformLogicalExpression(expression, state, render);

      // ConditionalExpression
    } else if (expression.isConditionalExpression()) {
      transformConditionalExpression(expression, state, render);


      // ignore JSXEmptyExpression
    } else if (!expression.isJSXEmptyExpression()) {
      transformExpression(path, state, render);
    }
    
    // JSXSpreadChild
  }  else if (path.isJSXSpreadChild()) {
    transformExpression(path, state, render);

    // JSXText
  } else {
    const str = (path.node as JSXText).value;
    // 过滤 "\n      ..." 字符
    if (!/^\n\s+$/gi.test(str)) {
      const parentId = getParentId(path);
      render.text({
        target: parentId,
        str: stringLiteral(str),
        type: 'insert',
      });
    }
  }
}
