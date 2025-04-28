import { NodePath } from "@babel/traverse";
import { CallExpression} from "@babel/types";
import { getRenderList } from "../utils";

export default function CallExpression(path: NodePath<CallExpression>) {
  const renderList = getRenderList(path.node, path);

  if (renderList) {
    path.replaceWith(renderList);
  }
}