import { callUnstableFunc } from "../utils";

export interface Scheduler extends Function {
  id: number;
  active?: boolean;
  computed?: boolean;
}

let isFlushing = false;
let isFlushPending = false;
let flushIndex = 0;
const queue: Scheduler[] = [];
const resolvedPromise = Promise.resolve() as Promise<any>;

export function enqueueScheduler(schedule: Scheduler) {
  const fromIndex = isFlushing ? flushIndex + 1 : 0;
  const index = queue.findIndex((item, index) => {
    if (fromIndex <= index) {
      return item.id === schedule.id;
    }
    return false;
  });

  if (!queue.length || index === -1) {
    queue.splice(fromIndex, 0, schedule);
  }

  flushMicrotasks();
}

function flushMicrotasks() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    resolvedPromise.then(flushQueue);
  }
}

function flushQueue() {
  isFlushPending = false;
  isFlushing = true;

  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const schedule = queue[flushIndex];
      if (schedule) {
        callUnstableFunc(schedule);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    isFlushing = false;
  }
}
