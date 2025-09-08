
import { isRender, toDisplayString } from "../utils";

export function ssrExpression(express: any): string {
  if (isRender(express)) return express();
  
  return toDisplayString(express)
}