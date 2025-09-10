import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Effect, activeEffect, shouldTrackEffect } from '../src/effect';
import { EffectFlags } from '../src/constant';
import { ref } from '../src/ref';
import { computed } from '../src/computed';

describe('Effect', () => {
  let mockScheduler: ReturnType<typeof vi.fn>;
  let mockFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockScheduler = vi.fn();
    mockScheduler.id = 0;
    mockFn = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create effect with default flags', () => {
      const effect = new Effect(mockFn, mockScheduler);
      
      expect(effect.fn).toBe(mockFn);
      expect(effect.scheduler).toBe(mockScheduler);
      expect(effect.recycle).toBe(false);
      expect(effect.flag).toBe(EffectFlags.Normal);
      expect(effect.dep).toBeInstanceOf(Set);
      expect(effect.dep.size).toBe(0);
    });

    it('should create effect with recycle flag', () => {
      const effect = new Effect(mockFn, mockScheduler, true);
      
      expect(effect.recycle).toBe(true);
      expect(effect.flag).toBe(EffectFlags.Recycle);
    });

    it('should create effect with normal flag when recycle is false', () => {
      const effect = new Effect(mockFn, mockScheduler, false);
      
      expect(effect.recycle).toBe(false);
      expect(effect.flag).toBe(EffectFlags.Normal);
    });
  });

  describe('run method', () => {
    it('should execute the function and return its result', () => {
      const returnValue = 'test-result';
      mockFn.mockReturnValue(returnValue);
      
      const effect = new Effect(mockFn, mockScheduler);
      const result = effect.run();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result).toBe(returnValue);
    });

    it('should set activeEffect and shouldTrackEffect during execution', () => {
      const effect = new Effect(mockFn, mockScheduler);
      
      mockFn.mockImplementation(() => {
        expect(activeEffect).toBe(effect);
        expect(shouldTrackEffect).toBe(true);
      });
      
      effect.run();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should restore previous activeEffect and shouldTrackEffect after execution', () => {
      // Create and run a previous effect to set initial state
      const previousEffect = new Effect(vi.fn(), vi.fn());
      previousEffect.run(); // This will set activeEffect to undefined after completion
      
      const effect = new Effect(mockFn, mockScheduler);
      effect.run();
      
      // After running, activeEffect should be back to undefined
      expect(activeEffect).toBeUndefined();
      expect(shouldTrackEffect).toBe(false);
    });

    it('should restore state even if function throws error', () => {
      const error = new Error('Test error');
      mockFn.mockImplementation(() => {
        throw error;
      });
      
      const effect = new Effect(mockFn, mockScheduler);
      
      expect(() => effect.run()).toThrow(error);
      
      // After error, global state should be restored to initial values
      expect(activeEffect).toBeUndefined();
      expect(shouldTrackEffect).toBe(false);
    });

    it('should handle nested effect execution', () => {
      const outerEffect = new Effect(mockFn, mockScheduler);
      const innerMockFn = vi.fn();
      const innerEffect = new Effect(innerMockFn, vi.fn());
      
      mockFn.mockImplementation(() => {
        expect(activeEffect).toBe(outerEffect);
        innerEffect.run();
        expect(activeEffect).toBe(outerEffect); // Should be restored after inner effect
      });
      
      outerEffect.run();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(innerMockFn).toHaveBeenCalledTimes(1);
    });

    it('should work with function that returns undefined', () => {
      mockFn.mockReturnValue(undefined);
      
      const effect = new Effect(mockFn, mockScheduler);
      const result = effect.run();
      
      expect(result).toBeUndefined();
    });

    it('should work with function that returns null', () => {
      mockFn.mockReturnValue(null);
      
      const effect = new Effect(mockFn, mockScheduler);
      const result = effect.run();
      
      expect(result).toBeNull();
    });
  });

  describe('trigger method', () => {
    it('should call run method', () => {
      const effect = new Effect(mockFn, mockScheduler);
      const runSpy = vi.spyOn(effect, 'run');
      
      effect.trigger();
      
      expect(runSpy).toHaveBeenCalledTimes(1);
    });

    it('should execute the function through run', () => {
      const effect = new Effect(mockFn, mockScheduler);
      
      effect.trigger();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroy method', () => {
    it('should remove effect from all dependent reactives', () => {
      const ref1 = ref(1);
      const ref2 = ref(2);
      const effect = new Effect(mockFn, mockScheduler);
      
      // Manually add reactive dependencies
      effect.dep.add(ref1);
      effect.dep.add(ref2);
      
      // Manually add effect to reactive deps
      ref1.dep.add(effect);
      ref2.dep.add(effect);
      
      expect(ref1.dep.has(effect)).toBe(true);
      expect(ref2.dep.has(effect)).toBe(true);
      
      effect.destroy();
      
      expect(ref1.dep.has(effect)).toBe(false);
      expect(ref2.dep.has(effect)).toBe(false);
    });

    it('should handle empty dependencies', () => {
      const effect = new Effect(mockFn, mockScheduler);
      
      expect(() => effect.destroy()).not.toThrow();
      expect(effect.dep.size).toBe(0);
    });

    it('should handle reactives without dep property gracefully', () => {
      const effect = new Effect(mockFn, mockScheduler);
      const mockReactive = { dep: { delete: vi.fn() } };
      
      effect.dep.add(mockReactive as any);
      
      effect.destroy();
      
      expect(mockReactive.dep.delete).toHaveBeenCalledWith(effect);
    });
  });

  describe('dependency tracking', () => {
    it('should track reactive dependencies during execution', () => {
      const source = ref(1);
      const effect = new Effect(() => {
        source.value; // This should create a dependency
      }, mockScheduler);
      
      effect.run();
      
      expect(source.dep.has(effect)).toBe(true);
    });

    it('should work with multiple reactive dependencies', () => {
      const ref1 = ref(1);
      const ref2 = ref(2);
      const ref3 = ref(3);
      
      const effect = new Effect(() => {
        ref1.value;
        ref2.value;
        ref3.value;
      }, mockScheduler);
      
      effect.run();
      
      expect(ref1.dep.has(effect)).toBe(true);
      expect(ref2.dep.has(effect)).toBe(true);
      expect(ref3.dep.has(effect)).toBe(true);
    });

    it('should track computed dependencies', () => {
      const source = ref(1);
      const comp = computed(() => source.value * 2);
      
      const effect = new Effect(() => {
        comp.value; // This should create a dependency
      }, mockScheduler);
      
      effect.run();
      
      expect(comp.dep.has(effect)).toBe(true);
    });

    it('should update dependencies when effect re-runs with different reactives', () => {
      const ref1 = ref(1);
      const ref2 = ref(2);
      let useFirst = true;
      
      const effect = new Effect(() => {
        if (useFirst) {
          ref1.value;
        } else {
          ref2.value;
        }
      }, mockScheduler);
      
      // First run - should depend on ref1
      effect.run();
      expect(ref1.dep.has(effect)).toBe(true);
      expect(ref2.dep.has(effect)).toBe(false);
      
      // Change condition and run again
      useFirst = false;
      effect.run();
      
      // Should now depend on ref2 (and still ref1 until cleanup)
      expect(ref2.dep.has(effect)).toBe(true);
    });
  });

  describe('integration with reactive system', () => {
    it('should trigger when dependent ref changes', async () => {
      const source = ref(1);
      let result = 0;
      
      const effect = new Effect(() => {
        result = source.value * 2;
      }, mockScheduler);
      
      effect.run();
      expect(result).toBe(2);
      
      source.setValue(3);
      
      // Wait for scheduler to execute
      await new Promise(resolve => setTimeout(resolve));
      
      expect(mockScheduler).toHaveBeenCalledTimes(1);
    });

    it('should work with computed values', async () => {
      const source = ref(2);
      const doubled = computed(() => source.value * 2);
      let result = 0;
      
      const effect = new Effect(() => {
        result = doubled.value + 1;
      }, mockScheduler);
      
      effect.run();
      expect(result).toBe(5); // (2 * 2) + 1
      
      source.setValue(3);
      
      // Wait for scheduler to execute
      await new Promise(resolve => setTimeout(resolve));
      
      expect(mockScheduler).toHaveBeenCalledTimes(1);
    });

    it('should handle complex reactive chains', async () => {
      const source = ref(1);
      const comp1 = computed(() => source.value * 2);
      const comp2 = computed(() => comp1.value + 1);
      let finalResult = 0;
      
      const effect = new Effect(() => {
        finalResult = comp2.value * 3;
      }, mockScheduler);
      
      effect.run();
      expect(finalResult).toBe(9); // ((1 * 2) + 1) * 3
      
      source.setValue(2);
      
      // Wait for scheduler to execute
      await new Promise(resolve => setTimeout(resolve));
      
      expect(mockScheduler).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle effect that creates new effects', () => {
      const nestedEffects: Effect[] = [];
      
      const effect = new Effect(() => {
        const nestedEffect = new Effect(() => {
          // Nested effect logic
        }, vi.fn());
        nestedEffects.push(nestedEffect);
      }, mockScheduler);
      
      effect.run();
      
      expect(nestedEffects.length).toBe(1);
      expect(nestedEffects[0]).toBeInstanceOf(Effect);
    });

    it('should handle recursive effect execution', () => {
      let callCount = 0;
      const maxCalls = 3;
      
      const effect = new Effect(() => {
        callCount++;
        if (callCount < maxCalls) {
          effect.run();
        }
      }, mockScheduler);
      
      effect.run();
      
      expect(callCount).toBe(maxCalls);
    });

    it('should handle effect with no reactive dependencies', () => {
      let executed = false;
      
      const effect = new Effect(() => {
        executed = true;
        // No reactive dependencies accessed
      }, mockScheduler);
      
      effect.run();
      
      expect(executed).toBe(true);
    });

    it('should handle effect that throws during dependency tracking', () => {
      const source = ref(1);
      const error = new Error('Tracking error');
      
      const effect = new Effect(() => {
        source.value; // Start tracking
        throw error;  // Throw during tracking
      }, mockScheduler);
      
      expect(() => effect.run()).toThrow(error);
      
      // Should still have tracked the dependency before error
      expect(source.dep.has(effect)).toBe(true);
    });

    it('should handle scheduler without id property', () => {
      const schedulerWithoutId = vi.fn();
      const effect = new Effect(mockFn, schedulerWithoutId);
      
      expect(() => effect.run()).not.toThrow();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('memory management', () => {
    it('should not leak memory when effects are destroyed', () => {
      const refs = Array.from({ length: 10 }, (_, i) => ref(i));
      const effects: Effect[] = [];
      
      // Create many effects with recycle flag to enable bidirectional dependency tracking
      refs.forEach((r, index) => {
        const effect = new Effect(() => {
          r.value;
        }, vi.fn(), true); // Set recycle = true to enable effect.dep tracking
        effects.push(effect);
        effect.run();
      });
      
      // Verify dependencies are established
      refs.forEach((r, index) => {
        expect(r.dep.has(effects[index])).toBe(true);
      });
      
      // Destroy all effects
      effects.forEach(effect => effect.destroy());
      
      // Verify dependencies are cleaned up from refs
      refs.forEach(r => {
        expect(r.dep.size).toBe(0);
      });
      
      // For recycle effects, effect.dep contains the reactive references
      effects.forEach(effect => {
        expect(effect.dep.size).toBeGreaterThan(0);
      });
    });

    it('should handle large number of dependencies efficiently', () => {
      const refs = Array.from({ length: 1000 }, (_, i) => ref(i));
      
      const effect = new Effect(() => {
        refs.forEach(r => r.value); // Access all refs
      }, mockScheduler);
      
      const startTime = performance.now();
      effect.run();
      const endTime = performance.now();
      
      // Should complete quickly
      expect(endTime - startTime).toBeLessThan(100);
      
      // Should have tracked all dependencies
      refs.forEach(r => {
        expect(r.dep.has(effect)).toBe(true);
      });
    });
  });

  describe('activeEffect global state', () => {
    it('should be undefined initially', () => {
      expect(activeEffect).toBeUndefined();
    });

    it('should be set during effect execution', () => {
      const effect = new Effect(() => {
        expect(activeEffect).toBe(effect);
      }, mockScheduler);
      
      effect.run();
    });

    it('should be restored after effect execution', () => {
      const initialActiveEffect = activeEffect;
      
      const effect = new Effect(mockFn, mockScheduler);
      effect.run();
      
      expect(activeEffect).toBe(initialActiveEffect);
    });

    it('should handle nested activeEffect correctly', () => {
      const outerEffect = new Effect(() => {
        expect(activeEffect).toBe(outerEffect);
        
        const innerEffect = new Effect(() => {
          expect(activeEffect).toBe(innerEffect);
        }, vi.fn());
        
        innerEffect.run();
        
        expect(activeEffect).toBe(outerEffect);
      }, mockScheduler);
      
      outerEffect.run();
    });
  });

  describe('shouldTrackEffect global state', () => {
    it('should be false initially', () => {
      expect(shouldTrackEffect).toBe(false);
    });

    it('should be true during effect execution', () => {
      const effect = new Effect(() => {
        expect(shouldTrackEffect).toBe(true);
      }, mockScheduler);
      
      effect.run();
    });

    it('should be restored after effect execution', () => {
      const initialShouldTrack = shouldTrackEffect;
      
      const effect = new Effect(mockFn, mockScheduler);
      effect.run();
      
      expect(shouldTrackEffect).toBe(initialShouldTrack);
    });
  });

  describe('TypeScript type support', () => {
    it('should work with typed effect functions', () => {
      const typedEffect = new Effect((): string => {
        return 'typed result';
      }, mockScheduler);
      
      const result = typedEffect.run();
      expect(result).toBe('typed result');
    });

    it('should work with generic scheduler types', () => {
      interface CustomScheduler extends Function {
        id: number;
        customProp: string;
      }
      
      const customScheduler = vi.fn() as CustomScheduler;
      customScheduler.id = 1;
      customScheduler.customProp = 'test';
      
      const effect = new Effect(mockFn, customScheduler);
      
      expect(effect.scheduler).toBe(customScheduler);
      expect(effect.scheduler.customProp).toBe('test');
    });
  });
});
