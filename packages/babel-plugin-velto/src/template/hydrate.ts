import { ObjectExpression, objectExpression, objectProperty, Identifier, NumericLiteral, ObjectProperty, arrayExpression, ArrayExpression, stringLiteral, identifier } from "@babel/types";
import { nodeIdentifier, typeIdentifier, childrenIdentifier, tagIdentifier } from "../constants";

export default class Hydrate {
  private root: ObjectExpression[] = [];
  private parentQueue: ObjectExpression[] = [];
  private current: ObjectExpression | undefined = undefined;

  public get statement() {
    return arrayExpression(this.root);
  }

  public node({ id, type, tag }: { 
    id: Identifier, type: NumericLiteral, tag?: string;
  }) { 
    const tagProperty = tag ? [objectProperty(tagIdentifier, stringLiteral(tag))] : [];
    const node = objectExpression([
      objectProperty(nodeIdentifier, id),
      objectProperty(typeIdentifier, type),
      ...tagProperty,
      objectProperty(childrenIdentifier, arrayExpression([])),
    ]);

    if (!this.current) {
      this.root.push(node);

    } else {
      const children = this.current?.properties.find(property => (property as ObjectProperty).key === childrenIdentifier);
      ((children as ObjectProperty).value as ArrayExpression).elements.push(node);
      this.parentQueue.push(this.current);
    }

    this.current = node;
  }

  public parent() {
    this.current = this.parentQueue.pop();
  }
}