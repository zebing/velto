// input a,b,c
// a,b,c => {a: true, b: true, c: true}
// return val => map[val]
export function stringCurrying(
  str: string,
  lowerCase?: boolean
): (key: string) => boolean {
  const map: Record<string, boolean> = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return lowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val]
}