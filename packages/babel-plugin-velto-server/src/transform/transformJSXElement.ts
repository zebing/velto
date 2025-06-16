import {
  JSXElement,
  objectProperty,
  identifier,
  memberExpression,
  stringLiteral,
  callExpression,
} from "@babel/types";
import { isNativeTag } from "@velto/shared";
import { getTagLiteral } from "../utils";
import { transformJSXChildren } from "./transformJSXChildren";
import { transformJSXElementAttribute } from "./transformJSXElementAttribute";
import { transformJSXComponentProps } from "./transformJSXComponentProps";
import { TransformJSXOptions } from "../types";
import TemplateLiteralContext from "../TemplateLiteralContext";
import { getVariableDeclaration } from "../utils";
import { RuntimeHelper } from "../helper";

export function transformJSXElement({
  path,
  context,
}: TransformJSXOptions<JSXElement>) {
  const openingElementPath = path.get("openingElement");
  const attributesPath = openingElementPath.get("attributes");
  const childrenPath = path.get("children");
  const tag = getTagLiteral(openingElementPath);
  
  
  if (isNativeTag(tag)) {
    context.indent();
    context.newline();
    context.pushStringLiteral(
        stringLiteral(`<${tag}`)
    );
    transformJSXElementAttribute({
      path: attributesPath,
      context,
    });
    context.pushStringLiteral(
      stringLiteral(`>`)
    );
    
    transformJSXChildren({
      path: childrenPath,
      context,
    });

    context.newline();
    context.pushStringLiteral(
      stringLiteral(`</${tag}>`)
    );
    context.deindent();
  } else {
    const props = transformJSXComponentProps({
        path: attributesPath,
        context,
      });
    if (childrenPath.length) {
      const subContext = new TemplateLiteralContext(context.indentLevel, context);
      transformJSXChildren({
        path: childrenPath,
        context: subContext,
      });
  
      props.properties.push(
        objectProperty(identifier("children"), subContext.generateTemplateLiteral())
      );
    }
  
    const id = path.state.helper.rootPath.scope.generateUidIdentifier(`render${tag}`);
    context.pushHoistExpressions(
      getVariableDeclaration(
        id,
        path.state.helper.getHelperNameIdentifier(RuntimeHelper.ssrComponent),
        [identifier(tag), props]
      )
    );

    context.indent();
    context.newline();

    context.pushExpression(
      callExpression(
        id,
        [],
      )
    );

    context.deindent();
  }
}
