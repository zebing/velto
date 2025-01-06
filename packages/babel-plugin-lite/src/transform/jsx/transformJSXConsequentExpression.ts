import { NodePath } from '@babel/core';
import { Expression, Identifier, unaryExpression, logicalExpression, isNullLiteral, is, isIdentifier } from '@babel/types';
import  { transformJSX } from './transformJSX';
import Render from '../../render';
import { getParentId } from '../parentId';

export function transformJSXConsequentExpression(options: {
  test: Expression;
  consequent: NodePath<Expression>;
  render: Render;
}) {
  const { test, consequent, render } = options;
  const target = getParentId(consequent);
  const spaceAnchor = render.space(target as Identifier);

  if (consequent.isJSXElement() || consequent.isJSXFragment()) {
    const subRender = new Render({
      rootPath: render.rootPath,
    });
    
    transformJSX({ path: consequent, render: subRender, root: true });
    render.expression({
      express: subRender.generate(),
      target,
      anchor: spaceAnchor,
      test,
    });
    // ConditionalExpression
    // expression ? <div></div> : null
  } else if (consequent.isConditionalExpression()) {
    const subTest = consequent.get('test');
    const subconsequent = consequent.get('consequent');
    const subAlternate = consequent.get('alternate');

    transformJSXConsequentExpression({
      test: logicalExpression('&&', test, subTest.node), 
      consequent: subconsequent, 
      render,
    });

    transformJSXConsequentExpression({
      test: logicalExpression('&&', test, unaryExpression('!', subTest.node)), 
      consequent: subAlternate, 
      render,
    });

  } else if(
    !isNullLiteral(consequent.node) && 
    !(isIdentifier(consequent.node) && consequent.node.name === 'undefined')
  ) {
    render.expression({
      express: consequent.node,
      target,
      anchor: spaceAnchor,
      test: test,
    });
  }
}