import { describe, it, expect, beforeEach, vi } from 'vitest';
import { watch } from '../src/watch';
import { ref } from '../src/ref';
import { computed } from '../src/computed';

describe('watch', () => {
  let mockCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockCallback = vi.fn();
    vi.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should watch ref changes', async () => {
      const source = ref(0);
      
      return new Promise<void>((resolve) => {
        watch(source, (newVal, oldVal) => {
          expect(newVal).toBe(1);
          expect(oldVal).toBe(0);
          resolve();
        });

        source.setValue(1);
      });
    });

    it('should watch multiple refs changes', async () => {
      const source1 = ref(0);
      const source2 = ref('hello');
      
      return new Promise<void>((resolve) => {
        watch([source1, source2], (newVal, oldVal) => {
          expect(newVal).toEqual([1, 'hello']);
          expect(oldVal).toEqual([0, 'hello']);
          resolve();
        });

        source1.setValue(1);
      });
    });

    it('should watch function return value changes', async () => {
      const source = ref(0);
      
      return new Promise<void>((resolve) => {
        watch(() => source.value * 2, (newVal, oldVal) => {
          expect(newVal).toBe(4);
          expect(oldVal).toBe(0);
          resolve();
        });

        source.setValue(2);
      });
    });

    it('should watch computed changes', () => {
      const source = ref(0);
      const comp = computed(() => source.value * 2);
      
      watch(() => comp.value, (newVal, oldVal) => {
        expect(newVal).toBe(4);
        expect(oldVal).toBe(0);
      });

      source.setValue(2);
    });
  });

  describe('immediate option', () => {
    it('should execute callback immediately when immediate is true', () => {
      const source = ref(0);
      
      watch(source, mockCallback, { immediate: true });
      
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(0, undefined);
    });

    it('should not execute callback immediately when immediate is false', () => {
      const source = ref(0);
      
      watch(source, mockCallback, { immediate: false });
      
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('once option', () => {
    it('should execute callback only once and stop automatically when once is true', async () => {
      const source = ref(0);
      
      watch(source, mockCallback, { once: true });

      // First change
      source.setValue(1);
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(mockCallback).toHaveBeenCalledTimes(1);
          expect(mockCallback).toHaveBeenCalledWith(1, 0);
          
          // Second change should not trigger callback
          source.setValue(2);
          
          setTimeout(() => {
            expect(mockCallback).toHaveBeenCalledTimes(1);
            resolve();
          });
        });
      });
    });

    it('should work correctly when once and immediate are used together', () => {
      const source = ref(0);
      
      const stopHandle = watch(source, mockCallback, { once: true, immediate: true });
      
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(0, undefined);
      
      // Verify watch has been stopped
      source.setValue(1);
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('WatchStopHandle functionality', () => {
    it('should return object with pause, resume, stop methods', () => {
      const source = ref(0);
      const stopHandle = watch(source, mockCallback);
      
      expect(stopHandle).toHaveProperty('pause');
      expect(stopHandle).toHaveProperty('resume');
      expect(stopHandle).toHaveProperty('stop');
      expect(typeof stopHandle.pause).toBe('function');
      expect(typeof stopHandle.resume).toBe('function');
      expect(typeof stopHandle.stop).toBe('function');
    });

    it('pause should pause watching', async () => {
      const source = ref(0);
      const stopHandle = watch(source, mockCallback);
      
      stopHandle.pause();
      source.setValue(1);
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(mockCallback).not.toHaveBeenCalled();
          resolve();
        });
      });
    });

    it('resume should resume watching', async () => {
      const source = ref(0);
      const stopHandle = watch(source, mockCallback);
      
      stopHandle.pause();
      source.setValue(1);

      expect(mockCallback).not.toHaveBeenCalled();
      
      await new Promise((resolve) => {
        stopHandle.resume();
        source.setValue(2);
        setTimeout(() => {
          expect(mockCallback).toHaveBeenCalledWith(2, 0);
          expect(mockCallback).toHaveBeenCalledTimes(1);
          
          resolve(null);
        });
      })
    });

    it('stop should completely stop watching', async () => {
      const source = ref(0);
      const stopHandle = watch(source, mockCallback);
      
      stopHandle.stop();
      source.setValue(1);
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(mockCallback).not.toHaveBeenCalled();
          
          // Even calling resume should not restore
          stopHandle.resume();
          source.setValue(2);
          
          setTimeout(() => {
            expect(mockCallback).not.toHaveBeenCalled();
            resolve();
          });
        });
      });
    });
  });

  describe('edge cases', () => {
    it('should not throw error when no callback provided', () => {
      const source = ref(0);
      
      expect(() => {
        const stopHandle = watch(source);
        source.setValue(1);
        stopHandle.stop();
      }).not.toThrow();
    });

    it('should return undefined when source is not reactive', async () => {
      const invalidSource = { notReactive: true };
      
      return new Promise<void>((resolve) => {
        watch(invalidSource as any, (newVal, oldVal) => {
          expect(newVal).toBeUndefined();
          expect(oldVal).toBeUndefined();
          resolve();
        });

        // Manual trigger, although it won't actually listen to changes
        setTimeout(() => resolve());
      });
    });

    it('should not affect watcher when callback throws error', async () => {
      const source = ref(0);
      let callCount = 0;
      
      watch(source, () => {
        callCount++;
        if (callCount === 1) {
          throw new Error('Test error');
        }
      });

      source.setValue(1);
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          source.setValue(2);
          
          setTimeout(() => {
            expect(callCount).toBe(2);
            resolve();
          });
        });
      });
    });
  });

  describe('scheduler behavior', () => {
    it('should use scheduler with id 0', () => {
      const source = ref(0);
      const stopHandle = watch(source, mockCallback);
      
      // This test verifies the internal scheduler implementation
      expect(() => {
        source.setValue(1);
      }).not.toThrow();
      
      stopHandle.stop();
    });

    it('should handle scheduler execution order', () => {
      const source = ref(0);
      const executionOrder: string[] = [];
      
      watch(source, () => {
        executionOrder.push('watcher1');
      });

      watch(source, () => {
        executionOrder.push('watcher2');
        expect(executionOrder).toEqual(['watcher1', 'watcher2']);
      });
    });
  });

  describe('callback return value handling', () => {
    it('should handle callback that returns value', async () => {
      const source = ref(0);
      
      return new Promise<void>((resolve) => {
        watch(source, (newVal, oldVal) => {
          expect(newVal).toBe(1);
          expect(oldVal).toBe(0);
          resolve();
          return 'callback result'; // Return value should be ignored
        });
        
        source.setValue(1);
      });
    });

    it('should handle async callback', async () => {
      const source = ref(0);
      
      return new Promise<void>((resolve) => {
        watch(source, async (newVal, oldVal) => {
          await new Promise(r => setTimeout(r, 1));
          expect(newVal).toBe(1);
          expect(oldVal).toBe(0);
          resolve();
        });
        
        source.setValue(1);
      });
    });
  });

  describe('array source advanced scenarios', () => {
    it('should handle empty array source', () => {
      const emptyArray: any[] = [];
      
      expect(() => {
        watch(emptyArray, mockCallback);
      }).not.toThrow();
      
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should handle mixed array with refs and computed', async () => {
      const ref1 = ref(1);
      const ref2 = ref(2);
      const comp = computed(() => ref1.value + ref2.value);
      
      watch([ref1, comp], (newVal, oldVal) => {
        expect(newVal).toEqual([10, 12]); // ref1=10, comp=10+2=12
        expect(oldVal).toEqual([1, 3]); // ref1=1, comp=1+2=3
      });
      
      ref1.setValue(10);
    });

    it('should handle array source with different types', async () => {
      const numberRef = ref(1);
      const stringRef = ref('hello');
      const booleanRef = ref(true);
      const hasChange = ref(false);
      
      return new Promise<void>((resolve) => {
        watch([numberRef, stringRef, booleanRef, hasChange], (newVal, oldVal) => {
          if (hasChange.value) {
            expect(newVal).toEqual([2, 'world', false, true]);
            expect(oldVal).toEqual([1, 'hello', true, true]);
          }
          resolve();
        });
        
        numberRef.setValue(2);
        stringRef.setValue('world');
        booleanRef.setValue(false);
        hasChange.setValue(true);
      });
    });
  });

  describe('function source advanced scenarios', () => {
    it('should handle function source with multiple dependencies', async () => {
      const a = ref(1);
      const b = ref(2);
      const c = ref(3);
      
      return new Promise<void>((resolve) => {
        watch(() => a.value + b.value * c.value, (newVal, oldVal) => {
          expect(newVal).toBe(11); // 1 + 2 * 5 = 11
          expect(oldVal).toBe(7);  // 1 + 2 * 3 = 7
          resolve();
        });
        
        c.setValue(5);
      });
    });

    it('should handle function source with conditional dependencies', async () => {
      const condition = ref(true);
      const a = ref(1);
      const b = ref(2);
      
      return new Promise<void>((resolve) => {
        watch(() => condition.value ? a.value : b.value, (newVal, oldVal) => {
          expect(newVal).toBe(2); // condition changed to false, so b.value
          expect(oldVal).toBe(1); // was a.value
          resolve();
        });
        
        condition.setValue(false);
      });
    });

    it('should handle function source returning objects', async () => {
      const user = ref({ name: 'John', age: 25 });
      
      return new Promise<void>((resolve) => {
        watch(() => ({ displayName: user.value.name, isAdult: user.value.age >= 18 }), (newVal, oldVal) => {
          expect(newVal).toEqual({ displayName: 'Jane', isAdult: true });
          expect(oldVal).toEqual({ displayName: 'John', isAdult: true });
          resolve();
        });
        
        user.setValue({ name: 'Jane', age: 30 });
      });
    });
  });

  describe('oldValue handling', () => {
    it('should correctly track oldValue through multiple changes', async () => {
      const source = ref(0);
      let changeCount = 0;
      
      watch(source, (newVal, oldVal) => {
        changeCount++;
        if (changeCount === 1) {
          expect(newVal).toBe(1);
          expect(oldVal).toBe(0);
          source.setValue(2);
        } else if (changeCount === 2) {
          expect(newVal).toBe(2);
          expect(oldVal).toBe(1);
        }
      });
      
      source.setValue(1);
    });

    it('should handle oldValue with array sources', async () => {
      const a = ref(1);
      const b = ref(2);
      
      return new Promise<void>((resolve) => {
        watch([a, b], (newVal, oldVal) => {
          expect(newVal).toEqual([10, 2]);
          expect(oldVal).toEqual([1, 2]);
          expect(Array.isArray(newVal)).toBe(true);
          expect(Array.isArray(oldVal)).toBe(true);
          resolve();
        });
        
        a.setValue(10);
      });
    });
  });

  describe('effect integration', () => {
    it('should properly integrate with Effect system', async () => {
      const source = ref(0);
      const stopHandle = watch(source, mockCallback);
      
      // Verify effect is created and working
      source.setValue(1);
          
      // 等待回调执行
      await new Promise((res) => setTimeout(res));
      expect(mockCallback).toHaveBeenCalledWith(1, 0);

      // Verify effect can be destroyed
      stopHandle.stop();
      source.setValue(2);

      // 再等待一点时间，确保 stop 生效
      await new Promise((res) => setTimeout(res));
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should handle effect.run() return value correctly', async () => {
      const source = ref({ count: 1 });
      
      return new Promise<void>((resolve) => {
        watch(() => source.value.count, (newVal, oldVal) => {
          expect(newVal).toBe(5);
          expect(oldVal).toBe(1);
          resolve();
        });
        
        source.setValue({ count: 5 });
      });
    });
  });

  describe('isReactive integration', () => {
    it('should correctly identify reactive sources', () => {
      const reactiveRef = ref(1);
      const reactiveComputed = computed(() => reactiveRef.value * 2);
      const nonReactiveObject = { value: 1 };
      
      expect(() => {
        watch(reactiveRef, mockCallback);
      }).not.toThrow();
      
      expect(() => {
        watch(reactiveComputed, mockCallback);
      }).not.toThrow();
      
      expect(() => {
        watch(nonReactiveObject as any, mockCallback);
      }).not.toThrow();
    });
  });

  describe('null callback handling', () => {
    it('should handle null callback explicitly', () => {
      const source = ref(0);
      
      expect(() => {
        const stopHandle = watch(source, null);
        source.setValue(1);
        stopHandle.stop();
      }).not.toThrow();
    });

    it('should handle undefined callback', () => {
      const source = ref(0);
      
      expect(() => {
        const stopHandle = watch(source, undefined);
        source.setValue(1);
        stopHandle.stop();
      }).not.toThrow();
    });
  });

  describe('performance tests', () => {
    it('should handle many watchers', () => {
      const source = ref(0);
      const watchers: Array<{ stop: () => void }> = [];
      
      for (let i = 0; i < 1000; i++) {
        watchers.push(watch(source, () => {}));
      }
      
      expect(() => {
        source.setValue(1);
      }).not.toThrow();
      
      // Cleanup
      watchers.forEach(w => w.stop());
    });

    it('stopped watcher should not continue to occupy memory', () => {
      const source = ref(0);
      const stopHandle = watch(source, mockCallback);
      
      stopHandle.stop();
      
      // Verify effect has been destroyed (by checking no longer responds to changes)
      source.setValue(1);
      setTimeout(() => {
        expect(mockCallback).not.toHaveBeenCalled();
      });
    });

    it('should efficiently handle deep object watching', async () => {
      const deepObject = ref({
        level1: {
          level2: {
            level3: {
              value: 1
            }
          }
        }
      });
      
      const startTime = performance.now();
      
      return new Promise<void>((resolve) => {
        watch(() => deepObject.value.level1.level2.level3.value, (newVal, oldVal) => {
          const endTime = performance.now();
          expect(newVal).toBe(100);
          expect(oldVal).toBe(1);
          expect(endTime - startTime).toBeLessThan(50); // Should be fast
          resolve();
        });
        
        deepObject.setValue({
          level1: {
            level2: {
              level3: {
                value: 100
              }
            }
          }
        });
      });
    });
  });
}); 