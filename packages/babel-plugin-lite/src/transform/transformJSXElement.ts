import { NodePath } from '@babel/traverse';
import { isNullLiteral, JSXElement, objectProperty, identifier, variableDeclaration, variableDeclarator, JSXNamespacedName, stringLiteral, Identifier, isObjectExpression } from '@babel/types';
import { State } from '../types';
import { getTagLiteral, isNativeTag, setParentId, getParentId } from '../utils';
import transformChildren from './transformChildren';
import transformJSXElementAttribute from './transformJSXElementAttribute';
import transformJSXRoot from './transformJSXRoot';
import transformProps from './transformProps';
import { StateName, anchorIdentifier } from '../constants';
import Render from '../render';
import transformLogicalExpression from './transformLogicalExpression';
import transformConditionalExpression from './transformConditionalExpression';

export default function transformJSXElement(
  path: NodePath<JSXElement>, 
  state: State,
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
      id = render.element({ tag, type: 'insert',  anchor: anchorIdentifier });
      
    } else {
      const parentId = getParentId(path);
      id = render.element({ tag, type: 'append', target: parentId });
    }

    setParentId(path, id);
    transformJSXElementAttribute(path.get('openingElement').get('attributes'), state, render);
    transformChildren(path.get('children'), state, render);
  } else {
    const props = transformProps(path.get('openingElement').get('attributes'), state, render);
    
    if (path.get('children').length) {
      const subRender = new Render({
        nodePath: path,
        state,
      });
      path.get('children').forEach(path => transformJSXRoot(path, state, subRender));
      const renderFunctionDeclaration = render.hoist(
        subRender.generateFunctionDeclaration()
      );
      
      props.properties.push(
        objectProperty(
          identifier('children'),
          renderFunctionDeclaration,
        )
      );
    }
    render.component(tag, props);
  }
}