import { NodePath } from '@babel/traverse';
import { isNullLiteral, JSXElement, objectProperty, identifier, variableDeclaration, variableDeclarator, JSXNamespacedName, stringLiteral, Identifier, isObjectExpression } from '@babel/types';
import { getTagLiteral, isNativeTag, setParentId, getParentId } from '../../utils';
import transformChildren from './transformChildren';
import transformJSXElementAttribute from './transformJSXElementAttribute';
import transformJSXRoot from './transformJSXRoot';
import transformProps from './transformProps';
import { anchorIdentifier } from '../../constants';
import Render from '../../render';
import transformLogicalExpression from './transformLogicalExpression';
import transformConditionalExpression from './transformConditionalExpression';
import { HelperNameType } from '../../helper';

export default function transformJSXElement(
  path: NodePath<JSXElement>, 
  render: Render,
  options?: {
    root: boolean;
  }
) {
  const { root = false } = options || {};

  const tag = getTagLiteral(path.get('openingElement'));
  if (isNativeTag(tag)) {
    let id: Identifier;
    if (root) {
      id = render.element({ tag, type: HelperNameType.insert,  anchor: anchorIdentifier });
      
    } else {
      const parentId = getParentId(path);
      id = render.element({ tag, type: HelperNameType.append, target: parentId });
    }

    setParentId(path, id);
    transformJSXElementAttribute(path.get('openingElement').get('attributes'), render);
    transformChildren(path.get('children'), render);
  } else {
    const props = transformProps(path.get('openingElement').get('attributes'), render);
    
    if (path.get('children').length) {
      const subRender = new Render({
        nodePath: path,
      });
      path.get('children').forEach(path => transformJSXRoot(path, subRender));
      
      props.properties.push(
        objectProperty(
          identifier('children'),
          subRender.generateFunctionDeclaration(),
        )
      );
    }
    render.component(tag, props);
  }
}