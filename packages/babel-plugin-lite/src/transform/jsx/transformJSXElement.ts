import { JSXElement, objectProperty, identifier } from '@babel/types';
import { getTagLiteral, isNativeTag } from '../../utils';
import { transformJSXChildren } from './transformJSXChildren';
import transformJSXElementAttribute from './transformJSXElementAttribute';
import { transformJSX } from './transformJSX';
import { transformJSXComponentProps } from './transformJSXComponentProps';
import { anchorIdentifier, targetIdentifier } from '../../constants';
import Render from '../../render';
import { HelperNameType } from '../../helper';
import { TransformJSXOptions } from '../../types';
import { setParentId, getParentId } from '../parentId';

export default function transformJSXElement({ path, render, root = false }: TransformJSXOptions<JSXElement>) {
  const openingElementPath = path.get('openingElement');
  const attributesPath = openingElementPath.get('attributes');
  const childrenPath = path.get('children');
  const tag = getTagLiteral(openingElementPath);

  // native tag
  if (isNativeTag(tag)) {
    const parentId = getParentId(path);
    const id = render.element({ 
      tag, 
      type: root ? HelperNameType.insert : HelperNameType.append, 
      target: root ? targetIdentifier : parentId,  
      anchor: root ? anchorIdentifier : undefined, 
    });

    setParentId(path, id);
    transformJSXElementAttribute({ path: attributesPath, render });
    transformJSXChildren({ path: childrenPath, render });
    return;
  }

  const props = transformJSXComponentProps({ path: attributesPath, render });
  
  if (childrenPath.length) {
    const subRender = new Render({
      rootPath: render.rootPath,
    });
    childrenPath.forEach(path => transformJSX({ path, render: subRender, root: true }));
    
    props.properties.push(
      objectProperty(
        identifier('children'),
        subRender.generate(),
      )
    );
  }
  render.component(tag, props);
}
