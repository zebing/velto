import { Program, Identifier, importDeclaration, identifier, stringLiteral, importSpecifier } from "@babel/types";
import { NodePath } from "@babel/traverse";
import { RuntimeHelper } from './constants';

export * from './constants';

export class Helper {
  private helperNameIdentifierMap = new Map<RuntimeHelper, Identifier>();
  public helperImportDeclaration = importDeclaration([], stringLiteral(RuntimeHelper.source));

  constructor(public rootPath: NodePath<Program>) {}

  get hasSpecifier() {
    return !!this.helperImportDeclaration.specifiers.length;
  }

 public getHelperNameIdentifier(name: RuntimeHelper) {
    let value = this.helperNameIdentifierMap.get(name);

    if (!value) {
      value = this.rootPath.scope.generateUidIdentifier(name);
      this.helperNameIdentifierMap.set(name, value);
      this.helperImportDeclaration.specifiers.push(
        importSpecifier(value, identifier(name))
      );
    }

    return value;
  }
}