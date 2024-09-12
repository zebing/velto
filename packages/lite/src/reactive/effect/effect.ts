export default class Effect {
  public parent: Effect | undefined = undefined

  constructor(public update: () => void) {}
}