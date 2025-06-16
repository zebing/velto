import { JSXFragment } from "@babel/types";
import { transformJSXChildren } from "./transformJSXChildren";
import { TransformJSXOptions } from "../types";

export function transformJSXFragment({
  path,
  context,
}: TransformJSXOptions<JSXFragment>) {
  transformJSXChildren({
    path: path.get("children"),
    context,
  });
}
