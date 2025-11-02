class IdGenerator {
  private count = 1000000;
  private filename: string = '';
  public map = new Map<string, string>();

  private get generateId() {
    return `data-velto-id-${this.count++}`;
  }

  private generateKey(start: number, end: number) {
    return `${this.filename ? `${this.filename}-` : ''}${start}-${end}`;
  }

  public setFilename(filename: string) {
    this.filename = filename;
  }

  public getId(start: number, end: number) {
    const key = this.generateKey(start, end);
    return this.map.get(key);
  }

  public setId(start: number, end: number) {
    const key = this.generateKey(start, end);
    this.map.set(key, this.generateId);
  }
}

export const idGenerator = new IdGenerator();