import { callUnstableFunc } from "../utils";
import { Reactive } from "./types";

export interface Scheduler extends Function {
  id: number;
  ref: Reactive;
  active?: boolean;
  computed?: boolean;
}

let isFlushPending = false;
let flushIndex = 0;
const queue: Scheduler[] = [];
const resolvedPromise = Promise.resolve() as Promise<any>;

export function enqueueScheduler(schedule: Scheduler) {
  // No queue exists, or is preceded by fromIndex.
  // Inserted after an id smaller than it. Ensure that updates from parent to child components.
  let insertIndex = 0;
  const existInQueue = queue.some((item, index) => {
    if (item.id < schedule.id) {
      insertIndex = index + 1;
    }
    
    return item.id === schedule.id && item.ref === schedule.ref;
  });

  if (!queue.length || !existInQueue) {
    queue.splice(insertIndex, 0, schedule);
  }

  flushMicrotasks();
}

function flushMicrotasks() {
  if (!isFlushPending) {
    isFlushPending = true;
    resolvedPromise.then(flushQueue);
  }
}

function flushQueue() {
  isFlushPending = false;

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
  }
}
