import type { SSRRender} from "../types";

export function ssrRenderList(list: unknown[] = [], renderCallback: (value: any, index: number, array: any[]) => SSRRender): string {
  return list.map((...params) => {
    const render = renderCallback(...params);
    return render();
  }).join('\n');
  
}
