import { JSXElement, objectProperty, identifier } from '@babel/types';
import { getTagLiteral, isNativeTag } from '../../utils';
import { transformJSXChildren } from './transformJSXChildren';
import { transformJSX } from './transformJSX';
import { transformJSXComponentProps } from './transformJSXComponentProps';
import { anchorIdentifier, targetIdentifier } from '../../constants';
import Template from '../../template';
import { RuntimeHelper } from '../../helper';
import { TransformJSXOptions } from '../../types';
import { setParentId, getParentId } from '../parentId';

export default function transformJSXElement({ path, template, root = false }: TransformJSXOptions<JSXElement>) {
  const openingElementPath = path.get('openingElement');
  const attributesPath = openingElementPath.get('attributes');
  const childrenPath = path.get('children');
  const tag = getTagLiteral(openingElementPath);

  // native tag
  if (isNativeTag(tag)) {
    const parentId = getParentId(path);
    const id = template.rootPath.scope.generateUidIdentifier(tag);
    setParentId(path, id);
    const props = transformJSXComponentProps({ path: attributesPath, template });

    template.element({ 
      id,
      props,
      tag, 
      type: root ? RuntimeHelper.insert : RuntimeHelper.append, 
      target: root ? targetIdentifier : parentId,  
      anchor: root ? anchorIdentifier : undefined, 
    });

    
    transformJSXChildren({ path: childrenPath, template });
    return;
  }

  const props = transformJSXComponentProps({ path: attributesPath, template });
  
  if (childrenPath.length) {
    const subRender = new Template({
      rootPath: template.rootPath,
    });
    childrenPath.forEach(path => transformJSX({ path, template: subRender, root: true }));
    
    props.properties.push(
      objectProperty(
        identifier('children'),
        subRender.generate(),
      )
    );
  }
  template.component({
    tag, props
  });
}
