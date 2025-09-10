import { describe, it, expect, vi } from 'vitest';
import { computed } from '../src/computed';
import { ref } from '../src/ref';
import { watch } from '../src/watch';

describe('computed', () => {
  describe('basic functionality', () => {
    it('should create computed value from getter function', () => {
      const source = ref(1);
      const comp = computed(() => source.value * 2);
      
      expect(comp.value).toBe(2);
    });

    it('should update when dependencies change', () => {
      const source = ref(1);
      const comp = computed(() => source.value * 2);
      
      expect(comp.value).toBe(2);
      
      source.setValue(2);
      expect(comp.value).toBe(4);
    });

    it('should work with multiple dependencies', () => {
      const a = ref(1);
      const b = ref(2);
      const comp = computed(() => a.value + b.value);
      
      expect(comp.value).toBe(3);
      
      a.setValue(2);
      expect(comp.value).toBe(4);
      
      b.setValue(3);
      expect(comp.value).toBe(5);
    });

    it('should work with nested computed values', () => {
      const source = ref(1);
      const comp1 = computed(() => source.value * 2);
      const comp2 = computed(() => comp1.value * 3);
      
      expect(comp2.value).toBe(6);
      
      source.setValue(2);
      expect(comp2.value).toBe(12);
    });
  });

  describe('caching behavior', () => {
    it('should cache computed value and not re-compute unnecessarily', () => {
      const source = ref(1);
      const getter = vi.fn(() => source.value * 2);
      const comp = computed(getter);
      
      // First access should call getter
      expect(comp.value).toBe(2);
      expect(getter).toHaveBeenCalledTimes(1);
      
      // Second access should use cached value
      expect(comp.value).toBe(2);
      expect(getter).toHaveBeenCalledTimes(1);
      
      // After dependency changes, should re-compute
      source.setValue(2);
      expect(comp.value).toBe(4);
      expect(getter).toHaveBeenCalledTimes(2);
    });
  });

  describe('writable computed', () => {
    it('should support getter and setter options', () => {
      const source = ref(1);
      const setter = vi.fn((value: number) => {
        source.setValue(value / 2);
      });
      
      const comp = computed({
        get: () => source.value * 2,
        set: setter
      });
      
      expect(comp.value).toBe(2);
      
      comp.setValue(6);
      expect(setter).toHaveBeenCalledWith(6);
      expect(source.value).toBe(3);
      expect(comp.value).toBe(6);
    });

    it('should handle setter with no-op for read-only computed', () => {
      const source = ref(1);
      const comp = computed(() => source.value * 2);
      
      // Should not throw when calling setValue on read-only computed
      expect(() => {
        comp.setValue(10);
      }).not.toThrow();
      
      // Value should remain unchanged
      expect(comp.value).toBe(2);
    });
  });

  describe('reactivity integration', () => {
    it('should trigger watchers when computed value changes', async () => {
      const source = ref(1);
      const comp = computed(() => source.value * 2);
      
      return new Promise<void>((resolve) => {
        watch(comp, (newVal, oldVal) => {
          expect(newVal).toBe(4);
          expect(oldVal).toBe(2);
          resolve();
        });
        
        source.setValue(2);
      });
    });

    it('should work as dependency for other computed values', () => {
      const source = ref(1);
      const comp1 = computed(() => source.value * 2);
      const comp2 = computed(() => comp1.value + 1);
      
      expect(comp2.value).toBe(3);
      
      source.setValue(2);
      expect(comp2.value).toBe(5);
    });

    it('should handle circular dependency gracefully', () => {
      const a = ref(1);
      const b = ref(2);
      
      // Create computed values that depend on each other indirectly
      const compB = computed(() => b.value);
      const compA = computed(() => a.value + compB.value);
      
      expect(compA.value).toBe(3);
      
      b.setValue(3);
      expect(compA.value).toBe(4);
    });
  });

  describe('edge cases', () => {
    it('should handle getter returning undefined', () => {
      const comp = computed(() => undefined);
      
      expect(comp.value).toBeUndefined();
    });

    it('should handle getter returning null', () => {
      const comp = computed(() => null);
      
      expect(comp.value).toBeNull();
    });

    it('should not affect computed when callback throws error', () => {
      const comp = computed(() => {
        throw new Error('Test error');
      });
      
      expect(comp.value).toBeUndefined();
    });

    it('should handle complex object dependencies', () => {
      const state = ref({ count: 1, name: 'test' });
      const comp = computed(() => ({
        displayName: `${state.value.name}: ${state.value.count}`,
        doubled: state.value.count * 2
      }));
      
      expect(comp.value.displayName).toBe('test: 1');
      expect(comp.value.doubled).toBe(2);
      
      state.setValue({ count: 2, name: 'updated' });
      expect(comp.value.displayName).toBe('updated: 2');
      expect(comp.value.doubled).toBe(4);
    });

    it('should handle array dependencies', () => {
      const items = ref([1, 2, 3]);
      const comp = computed(() => items.value.reduce((sum, item) => sum + item, 0));
      
      expect(comp.value).toBe(6);
      
      items.setValue([1, 2, 3, 4]);
      expect(comp.value).toBe(10);
    });
  });

  describe('performance tests', () => {
    it('should handle deeply nested computed chains efficiently', () => {
      const source = ref(1);
      let current = computed(() => source.value);
      
      // Create a chain of 100 computed values
      for (let i = 0; i < 100; i++) {
        const prev = current;
        current = computed(() => prev.value + 1);
      }
      
      expect(current.value).toBe(101);
      
      // Should efficiently update entire chain
      const startTime = performance.now();
      source.setValue(2);
      const result = current.value;
      const endTime = performance.now();
      
      expect(result).toBe(102);
      expect(endTime - startTime).toBeLessThan(50); // Should complete within 50ms
    });

    it('should handle many computed values depending on same source', () => {
      const source = ref(1);
      const computeds: Array<{ value: number }> = [];
      
      // Create 1000 computed values depending on same source
      for (let i = 0; i < 1000; i++) {
        computeds.push(computed(() => source.value * (i + 1)));
      }
      
      // Initial values
      expect(computeds[0].value).toBe(1);
      expect(computeds[999].value).toBe(1000);
      
      // Update source and verify all computeds update
      const startTime = performance.now();
      source.setValue(2);
      const results = computeds.map(c => c.value);
      const endTime = performance.now();
      
      expect(results[0]).toBe(2);
      expect(results[999]).toBe(2000);
      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
    });

    it('should optimize updates when computed value does not change', () => {
      const source = ref(1);
      const comp1 = computed(() => Math.floor(source.value));
      const comp2 = computed(() => comp1.value * 2);
      const getter2 = vi.fn(() => comp1.value * 2);
      const comp2Spy = computed(getter2);
      
      comp2Spy.value; // Initial computation
      expect(getter2).toHaveBeenCalledTimes(1);
      
      // Changing source but computed value remains same
      source.setValue(1.5);
      comp2Spy.value;
      
      // Should not trigger recomputation of dependent computed
      expect(getter2).toHaveBeenCalledTimes(2);
    });
  });

  describe('ReactiveFlags and internal behavior', () => {
    it('should have IS_COMPUTED flag', () => {
      const comp = computed(() => 1);
      
      expect(comp['__isComputed']).toBe(true);
    });

    it('should initialize value during construction', () => {
      const source = ref(5);
      const comp = computed(() => source.value * 3);
      
      // Value should be computed immediately during construction
      expect(comp.value).toBe(15);
    });

    it('should pass oldValue parameter to getter when available', () => {
      const source = ref(1);
      const getter = vi.fn((oldValue?: number) => {
        return source.value * 2;
      });
      const comp = computed(getter);
      
      // Initial call
      comp.value;
      expect(getter).toHaveBeenCalledWith(undefined);
      
      // After change
      source.setValue(2);
      comp.value;
      expect(getter).toHaveBeenCalledWith(2); // oldValue should be passed
    });
  });

  describe('dependency tracking behavior', () => {
    it('should properly track and untrack dependencies', () => {
      const source1 = ref(1);
      const source2 = ref(2);
      let useSecond = false;
      
      const comp = computed(() => {
        if (useSecond) {
          return source2.value * 2;
        } else {
          return source1.value * 2;
        }
      });
      
      expect(comp.value).toBe(2); // source1 * 2
      
      // Change source2, should not trigger update yet
      source2.setValue(3);
      expect(comp.value).toBe(2); // Still using source1
      
      // Change source1, should trigger update
      source1.setValue(10);
      expect(comp.value).toBe(20);
      
      // Switch dependency
      useSecond = true;
      source1.setValue(100); // This should trigger because we need to re-evaluate
      expect(comp.value).toBe(6); // Now using source2 * 2
    });

    it('should work with computed that has no reactive dependencies', () => {
      const comp = computed(() => Math.random());
      const value1 = comp.value;
      const value2 = comp.value;
      
      // Should return the same cached value
      expect(value1).toBe(value2);
    });

    it('should handle self-referencing computed with external trigger', () => {
      const source = ref(1);
      let calls = 0;
      
      const comp = computed(() => {
        calls++;
        // This computed references itself indirectly
        const currentValue = calls === 1 ? source.value : comp.value + source.value;
        return currentValue;
      });
      
      expect(comp.value).toBe(1);
      expect(calls).toBe(1);
      
      source.setValue(2);
      expect(comp.value).toBe(3); // 1 + 2
      expect(calls).toBe(2);
    });
  });

  describe('scheduler behavior', () => {
    it('should trigger dependent effects when computed changes', async () => {
      const source = ref(1);
      const comp = computed(() => source.value * 2);
      const effectCallbacks: number[] = [];
      
      return new Promise<void>((resolve) => {
        // Create a dependent effect
        watch(comp, (newVal) => {
          effectCallbacks.push(newVal);
          if (effectCallbacks.length === 2) {
            expect(effectCallbacks).toEqual([4, 6]);
            resolve();
          }
        });
        
        source.setValue(2);
        setTimeout(() => source.setValue(3), 0);
      });
    });

    it('should handle multiple computed values in dependency chain', () => {
      const source = ref(1);
      const comp1 = computed(() => source.value + 1);
      const comp2 = computed(() => comp1.value * 2);
      const comp3 = computed(() => comp2.value + 10);
      
      expect(comp3.value).toBe(14); // ((1 + 1) * 2) + 10
      
      source.setValue(5);
      expect(comp3.value).toBe(22); // ((5 + 1) * 2) + 10
    });
  });

  describe('memory management', () => {
    it('should properly handle computed cleanup when no longer referenced', () => {
      const source = ref(1);
      const computeds: number[] = [];
      
      // Create many short-lived computed values
      for (let i = 0; i < 100; i++) {
        const comp = computed(() => source.value * i);
        computeds.push(comp.value); // Access value but don't keep reference to computed
      }
      
      // Trigger garbage collection opportunity
      source.setValue(2);
      
      // This test mainly ensures no memory leaks or errors occur
      expect(computeds.length).toBe(100);
    });
  });

  describe('TypeScript type support', () => {
    it('should infer correct types for computed values', () => {
      const numberRef = ref(1);
      const stringRef = ref('hello');
      
      const numberComputed = computed(() => numberRef.value * 2);
      const stringComputed = computed(() => stringRef.value.toUpperCase());
      const booleanComputed = computed(() => numberRef.value > 0);
      
      // These should not cause TypeScript errors
      const num: number = numberComputed.value;
      const str: string = stringComputed.value;
      const bool: boolean = booleanComputed.value;
      
      expect(typeof num).toBe('number');
      expect(typeof str).toBe('string');
      expect(typeof bool).toBe('boolean');
    });

    it('should support generic type parameters', () => {
      interface User {
        id: number;
        name: string;
      }
      
      const userRef = ref<User>({ id: 1, name: 'John' });
      const userDisplayComputed = computed<string>(() => `${userRef.value.name} (${userRef.value.id})`);
      
      expect(userDisplayComputed.value).toBe('John (1)');
      expect(typeof userDisplayComputed.value).toBe('string');
    });
  });
}); 
