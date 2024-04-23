import { NullLiteral, ObjectExpression, Identifier, variableDeclaration, variableDeclarator, callExpression, Statement, Expression } from "@babel/types";
import { NodePath } from "@babel/core";

export function createVariableDeclaration(options: {
  kind?: "const" | "var" | "let" | "using" | "await using";
  name: string;
  argument: (NullLiteral | ObjectExpression | Expression)[];
  rootPath: NodePath<Statement>;
  callee: Identifier,
}) {
  const { name, argument, rootPath, callee, kind = 'const' } = options;
  const id = rootPath.scope.generateUidIdentifier(name);
  const el = variableDeclaration(
    kind,
    [
      variableDeclarator(
        id,
        callExpression(
          callee,
          argument,
        )
      )
    ]
  );
  
  rootPath?.insertBefore(el);
  return id;
}