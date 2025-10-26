import { NodePath } from '@babel/core';
import { Expression, callExpression, isNullLiteral, isIdentifier, MemberExpression, conditionalExpression, stringLiteral } from '@babel/types';
import  { transformJSXElement } from './transformJSXElement';
import  { transformJSXFragment } from './transformJSXFragment';
import { transformJSXConditionalExpression } from './transformJSXConditionalExpression';
import { transformJSXLogicalExpression } from './transformJSXLogicalExpression';
import TemplateLiteralContext from '../TemplateLiteralContext';
import { RuntimeHelper } from '../helper';

export function transformJSXConsequentExpression(options: {
  test: Expression;
  consequent: NodePath<Expression>;
  context: TemplateLiteralContext;
}) {
  const { test, consequent, context } = options;
  if (consequent.isJSXElement()) {
    const subContext = new TemplateLiteralContext(context);
    transformJSXElement({ path: consequent, context: subContext });
    context.pushExpression(
      conditionalExpression(test, subContext.generateTemplateLiteral(), stringLiteral(''))
    );
    
  } else if (consequent.isJSXFragment()) {
    const subContext = new TemplateLiteralContext(context);
    transformJSXFragment({ path: consequent, context: subContext });
    context.pushExpression(
      conditionalExpression(test, subContext.generateTemplateLiteral(), stringLiteral(''))
    );

    // ConditionalExpression
    // expression ? <div></div> : null
  } else if (consequent.isConditionalExpression()) {
    transformJSXConditionalExpression({ 
      path: consequent,
      test,
      context,
    });

    // LogicalExpression
    // expression && <div></div>
  } else if (consequent.isLogicalExpression()) {
    transformJSXLogicalExpression({ 
      path: consequent,
      test,
      context,
    });

  } else if (
    !isNullLiteral(consequent.node) && 
    !(isIdentifier(consequent.node) && consequent.node.name === 'undefined')
  ) {

    context.pushExpression(
      callExpression(
        consequent.state.helper.getHelperNameIdentifier(RuntimeHelper.ssrExpression),
        [consequent.node],
      ),
    );
  }
}