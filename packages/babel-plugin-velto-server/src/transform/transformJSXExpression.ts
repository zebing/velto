// import { JSXExpressionContainer, JSXSpreadChild, Expression } from '@babel/types';
// import { TransformJSXOptions } from '../types';
// import { getRenderList } from "../utils";

// export function transformJSXExpression({
//   path, template, target, anchor,
// }: TransformJSXOptions<JSXExpressionContainer | JSXSpreadChild>) {
//   const expression = path.get('expression');
//   const renderListExpression = getRenderList(expression.node as Expression, expression);

//   if (renderListExpression) {
//     return template.renderList({
//       express: renderListExpression,
//       target,
//       anchor,
//     })
//   }

//   template.expression({
//     express: expression.node as Expression,
//     target,
//     anchor,
//   });
// }
