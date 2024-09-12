import { NodePath } from '@babel/core';
import { Expression, Identifier, unaryExpression, logicalExpression } from '@babel/types';
import transformJSXRoot from './transformJSXRoot';
import Render from '../../render';
import { getParentId, getReactives } from '../../utils';

export default function transformConsequentExpression(options: {
  test: Expression;
  testRefList: Identifier[];
  consequent: NodePath<Expression>;
  render: Render;
}) {
  const { test, testRefList, consequent, render } = options;
  const target = getParentId(consequent);
  const spaceAnchor = render.space(target as Identifier);

  if (consequent.isJSXElement() || consequent.isJSXFragment()) {
    const subRender = new Render({
      nodePath: consequent,
    });
    
    transformJSXRoot(consequent, subRender);

    render.expression({
      express: subRender.generateFunctionDeclaration(),
      target,
      anchor: spaceAnchor,
      reactiveList: testRefList,
      test,
    });
    // ConditionalExpression
    // expression ? <div></div> : null
  } else if (consequent.isConditionalExpression()) {
    const subTest = consequent.get('test');
    const subconsequent = consequent.get('consequent');
    const subAlternate = consequent.get('alternate');
    const subTestRefList = getReactives(subTest);

    transformConsequentExpression({
      test: logicalExpression('&&', test, subTest.node), 
      testRefList: [...testRefList, ...subTestRefList],
      consequent: subconsequent, 
      render,
    });

    transformConsequentExpression({
      test: logicalExpression('&&', test, unaryExpression('!', subTest.node)), 
      testRefList: [...testRefList, ...subTestRefList],
      consequent: subAlternate, 
      render,
    });

  } else {
    const reactiveList = getReactives(consequent);
    render.expression({
      express: consequent.node,
      target,
      anchor: spaceAnchor,
      reactiveList: [...testRefList, ...reactiveList],
      test: test,
    });
  }
}