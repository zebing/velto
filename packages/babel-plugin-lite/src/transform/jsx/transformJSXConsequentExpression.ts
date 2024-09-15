import { NodePath } from '@babel/core';
import { Expression, Identifier, unaryExpression, logicalExpression } from '@babel/types';
import  { transformJSX } from './transformJSX';
import Render from '../../render';
import { getReactives } from '../../utils';
import { getParentId } from '../parentId';

export function transformJSXConsequentExpression(options: {
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
      rootPath: render.rootPath,
    });
    
    transformJSX({ path: consequent, render: subRender, root: true });

    render.expression({
      express: subRender.generate(),
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

    transformJSXConsequentExpression({
      test: logicalExpression('&&', test, subTest.node), 
      testRefList: [...testRefList, ...subTestRefList],
      consequent: subconsequent, 
      render,
    });

    transformJSXConsequentExpression({
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