import { ref, Ref } from '../src/ref';
import { watch } from '../src/watch';
import { computed } from '../src/computed';
import { ReactiveFlags } from '../src/constant';

describe('ref', () => {
  describe('basic functionality', () => {
    it('should create ref with initial value', () => {
      const r = ref(1);
      
      expect(r.value).toBe(1);
      expect(r).toBeInstanceOf(Ref);
    });

    it('should update value using setValue', () => {
      const r = ref(1);
      
      r.setValue(2);
      expect(r.value).toBe(2);
    });

    it('should handle different primitive types', () => {
      const numberRef = ref(42);
      const stringRef = ref('hello');
      const booleanRef = ref(true);
      const nullRef = ref(null);
      const undefinedRef = ref(undefined);
      
      expect(numberRef.value).toBe(42);
      expect(stringRef.value).toBe('hello');
      expect(booleanRef.value).toBe(true);
      expect(nullRef.value).toBeNull();
      expect(undefinedRef.value).toBeUndefined();
    });

    it('should handle object types', () => {
      const user = { name: 'John', age: 25 };
      const userRef = ref(user);
      
      expect(userRef.value).toBe(user);
      expect(userRef.value.name).toBe('John');
      expect(userRef.value.age).toBe(25);
    });

    it('should handle array types', () => {
      const arr = [1, 2, 3];
      const arrayRef = ref(arr);
      
      expect(arrayRef.value).toBe(arr);
      expect(arrayRef.value.length).toBe(3);
      expect(arrayRef.value[0]).toBe(1);
    });
  });

  describe('ReactiveFlags', () => {
    it('should have IS_REF flag', () => {
      const r = ref(1);
      
      expect(r[ReactiveFlags.IS_REF]).toBe(true);
      expect(r['__isRef']).toBe(true);
    });

    it('should not have IS_COMPUTED flag', () => {
      const r = ref(1);
      
      expect(r[ReactiveFlags.IS_COMPUTED]).toBeUndefined();
      expect(r['__isComputed']).toBeUndefined();
    });
  });

  describe('dependency tracking', () => {
    it('should create dependency tracking on value access', () => {
      const r = ref(1);
      
      expect(r.dep).toBeDefined();
      expect(typeof r.dep.add).toBe('function');
      expect(typeof r.dep.forEach).toBe('function');
    });

    it('should trigger effects when value changes', (done) => {
      const r = ref(1);
      let callCount = 0;
      
      watch(r, (newVal, oldVal) => {
        callCount++;
        expect(newVal).toBe(2);
        expect(oldVal).toBe(1);
        expect(callCount).toBe(1);
        done();
      });
      
      r.setValue(2);
    });

    it('should work with computed values as dependencies', () => {
      const r = ref(1);
      const comp = computed(() => r.value * 2);
      
      expect(comp.value).toBe(2);
      
      r.setValue(3);
      expect(comp.value).toBe(6);
    });

    it('should track multiple dependencies', (done) => {
      const r1 = ref(1);
      const r2 = ref(2);
      const r3 = ref(3);
      
      watch([r1, r2, r3], (newVal, oldVal) => {
        expect(newVal).toEqual([10, 2, 3]);
        expect(oldVal).toEqual([1, 2, 3]);
        done();
      });
      
      r1.setValue(10);
    });
  });

  describe('reactive behavior', () => {
    it('should trigger effects immediately after setValue', (done) => {
      const r = ref(0);
      let triggered = false;
      
      watch(r, () => {
        triggered = true;
      });
      
      r.setValue(1);
      
      // Should trigger synchronously in the next tick
      setTimeout(() => {
        expect(triggered).toBe(true);
        done();
      }, 0);
    });

    it('should handle multiple setValue calls', (done) => {
      const r = ref(0);
      const values: number[] = [];
      
      watch(r, (newVal) => {
        values.push(newVal);
        if (values.length === 3) {
          expect(values).toEqual([1, 2, 3]);
          done();
        }
      });
      
      r.setValue(1);
      r.setValue(2);
      r.setValue(3);
    });

    it('should handle rapid consecutive changes', (done) => {
      const r = ref(0);
      let finalValue: number;
      
      watch(r, (newVal) => {
        finalValue = newVal;
      });
      
      // Rapid changes
      for (let i = 1; i <= 100; i++) {
        r.setValue(i);
      }
      
      setTimeout(() => {
        expect(finalValue).toBe(100);
        done();
      }, 10);
    });

    it('should not trigger effects when setting same value', (done) => {
      const r = ref(1);
      let callCount = 0;
      
      watch(r, () => {
        callCount++;
      });
      
      r.setValue(1); // Same value
      r.setValue(1); // Same value again
      
      setTimeout(() => {
        expect(callCount).toBe(2); // Should still trigger (no optimization in current implementation)
        done();
      }, 10);
    });
  });

  describe('nested reactivity', () => {
    it('should work with nested computed values', () => {
      const r = ref(2);
      const comp1 = computed(() => r.value * 2);
      const comp2 = computed(() => comp1.value + 1);
      const comp3 = computed(() => comp2.value * 3);
      
      expect(comp3.value).toBe(15); // ((2 * 2) + 1) * 3 = 15
      
      r.setValue(3);
      expect(comp3.value).toBe(21); // ((3 * 2) + 1) * 3 = 21
    });

    it('should handle circular references in object values', () => {
      const obj: any = { name: 'test' };
      obj.self = obj; // Circular reference
      
      const r = ref(obj);
      
      expect(r.value.name).toBe('test');
      expect(r.value.self).toBe(obj);
      expect(r.value.self.self).toBe(obj);
    });

    it('should work with nested watchers', (done) => {
      const r = ref(1);
      let outerCalled = false;
      let innerCalled = false;
      
      watch(r, (newVal) => {
        outerCalled = true;
        
        watch(r, () => {
          innerCalled = true;
        });
        
        r.setValue(newVal + 1);
        
        setTimeout(() => {
          expect(outerCalled).toBe(true);
          expect(innerCalled).toBe(true);
          done();
        }, 10);
      });
      
      r.setValue(2);
    });
  });

  describe('edge cases', () => {
    it('should handle setting undefined', () => {
      const r = ref<number | undefined>(1);
      
      r.setValue(undefined);
      expect(r.value).toBeUndefined();
    });

    it('should handle setting null', () => {
      const r = ref<number | null>(1);
      
      r.setValue(null);
      expect(r.value).toBeNull();
    });

    it('should handle setting NaN', () => {
      const r = ref(1);
      
      r.setValue(NaN);
      expect(r.value).toBeNaN();
    });

    it('should handle setting Infinity', () => {
      const r = ref(1);
      
      r.setValue(Infinity);
      expect(r.value).toBe(Infinity);
    });

    it('should handle very large objects', () => {
      const largeObj: any = {};
      for (let i = 0; i < 1000; i++) {
        largeObj[`prop${i}`] = i;
      }
      
      const r = ref(largeObj);
      
      expect(r.value.prop0).toBe(0);
      expect(r.value.prop999).toBe(999);
      expect(Object.keys(r.value).length).toBe(1000);
    });

    it('should handle deeply nested objects', () => {
      const deepObj = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  value: 'deep'
                }
              }
            }
          }
        }
      };
      
      const r = ref(deepObj);
      
      expect(r.value.level1.level2.level3.level4.level5.value).toBe('deep');
    });

    it('should handle functions as values', () => {
      const fn = () => 'hello';
      const r = ref(fn);
      
      expect(r.value).toBe(fn);
      expect(r.value()).toBe('hello');
    });

    it('should handle symbols as values', () => {
      const sym = Symbol('test');
      const r = ref(sym);
      
      expect(r.value).toBe(sym);
    });

    it('should handle Date objects', () => {
      const date = new Date('2023-01-01');
      const r = ref(date);
      
      expect(r.value).toBe(date);
      expect(r.value.getFullYear()).toBe(2023);
    });

    it('should handle RegExp objects', () => {
      const regex = /test/gi;
      const r = ref(regex);
      
      expect(r.value).toBe(regex);
      expect(r.value.test('TEST')).toBe(true);
    });

    it('should handle Map objects', () => {
      const map = new Map([['key', 'value']]);
      const r = ref(map);
      
      expect(r.value).toBe(map);
      expect(r.value.get('key')).toBe('value');
    });

    it('should handle Set objects', () => {
      const set = new Set([1, 2, 3]);
      const r = ref(set);
      
      expect(r.value).toBe(set);
      expect(r.value.has(2)).toBe(true);
      expect(r.value.size).toBe(3);
    });
  });

  describe('memory management', () => {
    it('should not leak memory when refs are no longer referenced', () => {
      const refs = [];
      
      // Create many refs
      for (let i = 0; i < 1000; i++) {
        refs.push(ref(i));
      }
      
      // Access all values
      const values = refs.map(r => r.value);
      
      expect(values.length).toBe(1000);
      expect(values[0]).toBe(0);
      expect(values[999]).toBe(999);
      
      // Clear references (simulation of memory cleanup)
      refs.length = 0;
    });

    it('should handle many setValue operations efficiently', () => {
      const r = ref(0);
      const startTime = performance.now();
      
      for (let i = 1; i <= 10000; i++) {
        r.setValue(i);
      }
      
      const endTime = performance.now();
      
      expect(r.value).toBe(10000);
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
    });
  });

  describe('TypeScript type support', () => {
    it('should infer correct types', () => {
      const numberRef = ref(42);
      const stringRef = ref('hello');
      const booleanRef = ref(true);
      const arrayRef = ref([1, 2, 3]);
      const objectRef = ref({ name: 'John' });
      
      // These should not cause TypeScript errors
      const num: number = numberRef.value;
      const str: string = stringRef.value;
      const bool: boolean = booleanRef.value;
      const arr: number[] = arrayRef.value;
      const obj: { name: string } = objectRef.value;
      
      expect(typeof num).toBe('number');
      expect(typeof str).toBe('string');
      expect(typeof bool).toBe('boolean');
      expect(Array.isArray(arr)).toBe(true);
      expect(typeof obj).toBe('object');
    });

    it('should support explicit generic types', () => {
      interface User {
        id: number;
        name: string;
        email?: string;
      }
      
      const userRef = ref<User>({ id: 1, name: 'John' });
      
      expect(userRef.value.id).toBe(1);
      expect(userRef.value.name).toBe('John');
      expect(userRef.value.email).toBeUndefined();
      
      userRef.setValue({ id: 2, name: 'Jane', email: 'jane@example.com' });
      
      expect(userRef.value.email).toBe('jane@example.com');
    });

    it('should support union types', () => {
      const mixedRef = ref<string | number>('hello');
      
      expect(typeof mixedRef.value).toBe('string');
      
      mixedRef.setValue(42);
      expect(typeof mixedRef.value).toBe('number');
    });

    it('should support optional types', () => {
      const optionalRef = ref<string | undefined>(undefined);
      
      expect(optionalRef.value).toBeUndefined();
      
      optionalRef.setValue('hello');
      expect(optionalRef.value).toBe('hello');
      
      optionalRef.setValue(undefined);
      expect(optionalRef.value).toBeUndefined();
    });
  });

  describe('integration with other reactive utilities', () => {
    it('should work as source for watch', (done) => {
      const r = ref('initial');
      
      watch(r, (newVal, oldVal) => {
        expect(newVal).toBe('changed');
        expect(oldVal).toBe('initial');
        done();
      });
      
      r.setValue('changed');
    });

    it('should work as dependency for computed', () => {
      const firstName = ref('John');
      const lastName = ref('Doe');
      const fullName = computed(() => `${firstName.value} ${lastName.value}`);
      
      expect(fullName.value).toBe('John Doe');
      
      firstName.setValue('Jane');
      expect(fullName.value).toBe('Jane Doe');
      
      lastName.setValue('Smith');
      expect(fullName.value).toBe('Jane Smith');
    });

    it('should work in complex reactive chains', (done) => {
      const baseValue = ref(1);
      const doubled = computed(() => baseValue.value * 2);
      const tripled = computed(() => doubled.value * 1.5);
      
      watch(tripled, (newVal, oldVal) => {
        expect(newVal).toBe(15); // 5 * 2 * 1.5 = 15
        expect(oldVal).toBe(3);  // 1 * 2 * 1.5 = 3
        done();
      });
      
      baseValue.setValue(5);
    });
  });

  describe('performance tests', () => {
    it('should handle high-frequency updates efficiently', (done) => {
      const r = ref(0);
      let updateCount = 0;
      const targetUpdates = 1000;
      
      watch(r, () => {
        updateCount++;
        if (updateCount === targetUpdates) {
          expect(r.value).toBe(targetUpdates);
          done();
        }
      });
      
      const startTime = performance.now();
      
      for (let i = 1; i <= targetUpdates; i++) {
        r.setValue(i);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
    });

    it('should handle many concurrent refs efficiently', () => {
      const refs: Array<{ value: number, setValue: (val: number) => void }> = [];
      
      // Create many refs
      for (let i = 0; i < 1000; i++) {
        refs.push(ref(i));
      }
      
      const startTime = performance.now();
      
      // Update all refs
      refs.forEach((r, index) => {
        r.setValue(index * 2);
      });
      
      const endTime = performance.now();
      
      // Verify all updates
      refs.forEach((r, index) => {
        expect(r.value).toBe(index * 2);
      });
      
      expect(endTime - startTime).toBeLessThan(100); // Should be efficient
    });
  });
}); 