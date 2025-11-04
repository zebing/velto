
import crypto from 'crypto';
import path from 'path';

class IdGenerator {
  private count = 1000000;
  private filename: string = '';
  public map = new Map<string, string>();

  private get generateId() {
    return `id-${this.count++}`;
  }

  private generateKey(start: number, end: number) {
    return `${start}-${end}`;
  }

  private getHashFromFilename(filename: string) {
    const hash = crypto.createHash('md5')
      .update(filename)
      .digest('hex');
    return hash;
  }

  public init(filename: string) {
    this.filename = filename;
    const hash = this.getHashFromFilename(filename);
    const cacheFilePath = path.resolve(process.cwd(), 'cacheIdData', `${hash}.json`);
    try {
      const data = require(cacheFilePath);
      this.map = new Map(Object.entries(data));
    } catch (e) {
      // No cached data
    }
  }

  public saveData() {
    const hash = this.getHashFromFilename(this.filename);
    const cacheFilePath = path.resolve(__dirname, '../', 'cacheIdData', `${hash}.json`);
    const fs = require('fs');
    const dir = path.dirname(cacheFilePath);
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    const obj: Record<string, string> = {};
    this.map.forEach((value, key) => {
      obj[key] = value;
    });
    fs.writeFileSync(cacheFilePath, JSON.stringify(obj, null, 2), 'utf-8');
  }

  public getId(start: number, end: number) {
    const key = this.generateKey(start, end);
    const id = this.map.get(key)

    if (id) {
      return id;
    }
    
    return this.setId(start, end);
  }

  public setId(start: number, end: number) {
    const key = this.generateKey(start, end);
    const id = this.generateId;
    this.map.set(key, id);
    return id;
  }
}

export default new IdGenerator();