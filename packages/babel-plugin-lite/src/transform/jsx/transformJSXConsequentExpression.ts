import { NodePath } from '@babel/core';
import { Expression, Identifier, unaryExpression, logicalExpression, isNullLiteral, is, isIdentifier } from '@babel/types';
import  { transformJSX } from './transformJSX';
import Template from '../../template';
import { getParentId } from '../parentId';
import { transformJSXConditionalExpression } from './transformJSXConditionalExpression';
import { transformJSXLogicalExpression } from './transformJSXLogicalExpression';

export function transformJSXConsequentExpression(options: {
  test: Expression;
  consequent: NodePath<Expression>;
  template: Template;
}) {
  const { test, consequent, template } = options;
  const target = getParentId(consequent);
  const spaceAnchor = template.space(target as Identifier);

  if (consequent.isJSXElement() || consequent.isJSXFragment()) {
    const subRender = new Template({
      rootPath: template.rootPath,
    });
    
    transformJSX({ path: consequent, template: subRender, root: true });
    template.expression({
      express: subRender.generate(),
      target,
      anchor: spaceAnchor,
      test,
    });

    // ConditionalExpression
    // expression ? <div></div> : null
  } else if (consequent.isConditionalExpression()) {
    transformJSXConditionalExpression({ 
      path: consequent,
      template,
      test,
    });

    // LogicalExpression
    // expression && <div></div>
  } else if (consequent.isLogicalExpression()) {
    transformJSXLogicalExpression({ 
      path: consequent,
      template,
      test,
    });

  } else if (
    !isNullLiteral(consequent.node) && 
    !(isIdentifier(consequent.node) && consequent.node.name === 'undefined')
  ) {
    template.expression({
      express: consequent.node,
      target,
      anchor: spaceAnchor,
      test,
    });
  }
}