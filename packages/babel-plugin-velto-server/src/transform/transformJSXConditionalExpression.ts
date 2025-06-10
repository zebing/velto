// import { NodePath } from '@babel/core';
// import { Identifier, MemberExpression, ConditionalExpression, unaryExpression, Expression, binaryExpression } from '@babel/types';
// import { transformJSXConsequentExpression } from './transformJSXConsequentExpression';
// import Template from '../template';

// export function transformJSXConditionalExpression({ path, template, test, target, anchor }: {
//   path: NodePath<ConditionalExpression>;
//   template: Template;
//   test?: Expression;
//   target: Identifier | MemberExpression;
//   anchor?: Identifier;
// }) {
//   const subTest = path.get('test');
//   const consequent = path.get('consequent');
//   const alternate = path.get('alternate');

//   transformJSXConsequentExpression({
//     test: test ? binaryExpression('&', test, subTest.node) : subTest.node, 
//     consequent, 
//     template,
//     target,
//     anchor,
//   });

//   transformJSXConsequentExpression({
//     test: test ? binaryExpression('&', test, unaryExpression('!', subTest.node)) : unaryExpression('!', subTest.node), 
//     consequent: alternate, 
//     template,
//     target,
//     anchor,
//   });
// }