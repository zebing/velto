import { NodePath } from '@babel/core';
import { Expression, Identifier, unaryExpression, logicalExpression } from '@babel/types';
import { State } from '../types';
import transformJSXRoot from './transformJSXRoot';
import Render from '../render';
import { getParentId, getRefs } from '../utils';

export default function transformConsequentExpression(options: {
  test: Expression;
  testRefList: Identifier[];
  consequent: NodePath<Expression>;
  state: State;
  render: Render;
}) {
  const { test, testRefList, consequent, state, render } = options;
  const target = getParentId(consequent);
  const spaceAnchor = render.space(target as Identifier);

  if (consequent.isJSXElement() || consequent.isJSXFragment()) {
    const subRender = new Render({
      nodePath: consequent,
      state,
    });
    
    transformJSXRoot(consequent, state, subRender);
    const renderFunctionDeclaration = render.hoist(
      subRender.generateFunctionDeclaration()
    );


    render.expression({
      express: renderFunctionDeclaration,
      target,
      anchor: spaceAnchor,
      refList: testRefList,
      test,
    });
    // ConditionalExpression
    // expression ? <div></div> : null
  } else if (consequent.isConditionalExpression()) {
    const subTest = consequent.get('test');
    const subconsequent = consequent.get('consequent');
    const subAlternate = consequent.get('alternate');
    const subTestRefList = getRefs(subTest);

    transformConsequentExpression({
      test: logicalExpression('&&', test, subTest.node), 
      testRefList: [...testRefList, ...subTestRefList],
      consequent: subconsequent, 
      state, 
      render,
    });

    transformConsequentExpression({
      test: logicalExpression('&&', test, unaryExpression('!', subTest.node)), 
      testRefList: [...testRefList, ...subTestRefList],
      consequent: subAlternate, 
      state, 
      render,
    });

  } else {
    const refList = getRefs(consequent);
    render.expression({
      express: consequent.node,
      target,
      anchor: spaceAnchor,
      refList: [...testRefList, ...refList],
      test: test,
    });
  }
}