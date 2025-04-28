import { NodePath } from '@babel/core';
import { Expression, Identifier, isNullLiteral, isIdentifier, MemberExpression } from '@babel/types';
import  { transformJSXElement } from './transformJSXElement';
import  { transformJSXFragment } from './transformJSXFragment';
import Template from '../../template';
import { transformJSXConditionalExpression } from './transformJSXConditionalExpression';
import { transformJSXLogicalExpression } from './transformJSXLogicalExpression';
import { targetIdentifier, anchorIdentifier } from '../../constants';

export function transformJSXConsequentExpression(options: {
  test: Expression;
  consequent: NodePath<Expression>;
  template: Template;
  target: Identifier | MemberExpression;
  anchor?: Identifier;
}) {
  const { test, consequent, template, target, anchor } = options;
  if (consequent.isJSXElement()) {
    const subRender = new Template({
      rootPath: template.rootPath,
    });
    
    transformJSXElement({ path: consequent, template: subRender, target: targetIdentifier, anchor: anchorIdentifier });
    template.condition({
      express: subRender.generate(),
      target,
      test,
      anchor,
    });
  } else if (consequent.isJSXFragment()) {
    const subRender = new Template({
      rootPath: template.rootPath,
    });
    
    transformJSXFragment({ path: consequent, template: subRender, target: targetIdentifier, anchor: anchorIdentifier });
    template.condition({
      express: subRender.generate(),
      target,
      test,
      anchor,
    });

    // ConditionalExpression
    // expression ? <div></div> : null
  } else if (consequent.isConditionalExpression()) {
    transformJSXConditionalExpression({ 
      path: consequent,
      template,
      test,
      target,
      anchor,
    });

    // LogicalExpression
    // expression && <div></div>
  } else if (consequent.isLogicalExpression()) {
    transformJSXLogicalExpression({ 
      path: consequent,
      template,
      test,
      target,
      anchor,
    });

  } else if (
    !isNullLiteral(consequent.node) && 
    !(isIdentifier(consequent.node) && consequent.node.name === 'undefined')
  ) {
    template.condition({
      express: consequent.node,
      target,
      test,
      anchor,
    });
  }
}