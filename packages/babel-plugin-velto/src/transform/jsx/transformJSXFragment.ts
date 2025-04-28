import { JSXFragment } from "@babel/types";
import { transformJSXChildren } from "./transformJSXChildren";
import { TransformJSXOptions } from "../../types";

export function transformJSXFragment({
  path,
  template,
  target,
  anchor,
}: TransformJSXOptions<JSXFragment>) {
  transformJSXChildren({
    path: path.get("children"),
    template,
    target,
    anchor,
  });
}
