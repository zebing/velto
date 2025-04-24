import { Program, Identifier, importDeclaration, identifier, stringLiteral, importSpecifier, Statement } from "@babel/types";
import { NodePath } from "@babel/traverse";
import { RuntimeHelper } from './constants';

export * from './constants';

export class Helper {
  public bodyStatement: Statement[] = [];
  public rootPath: NodePath<Program>;
  private helperNameIdentifierMap = new Map<RuntimeHelper, Identifier>();
  public helperImportDeclaration = importDeclaration([], stringLiteral(RuntimeHelper.source));

  constructor(options: { rootPath: NodePath<Program> }) {
    const { rootPath } = options;
    this.rootPath = rootPath;
  }

  get hasSpecifier() {
    return !!this.helperImportDeclaration.specifiers.length;
  }

  public pushStatement(statement: Statement) {
    this.bodyStatement.push(statement);
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