import { createMachine } from "xstate";
import type { SyncResponse } from "~/entities/types";

export type SyncEvent =
  | { type: "SYNC"; applicationId: string }
  | { type: "TOGGLE_CHANGE"; changeId: string }
  | { type: "CONFIRM" }
  | { type: "RETRY"; applicationId: string }
  | { type: "CLOSE" };

export type SyncService = {
  sync: { data: SyncResponse };
};

export const syncMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwJ4DsDGBiAwgQQDkcBRAGQG0AGAXUVAAcB7WASwBcXG06QAPRABwBGAHQAWAMwB2MQE55QsVICsleQBoQKRADZlYkRJ1TFQ2WOX6JAgL43NqTCJYQANmCwBlAJpEqtJBAmVg4uHn4EOQAmQ0kZSjMBSjEogTFNbQQdAWURKIlZfSEcoR0hCTsHdAwRRwwWNCgsCC4wZzQAN0YAaza62uqGqAQGrowAQ1C0f38eYPZObkCIsQEpWOkxBNkklLSMxCMBESkBWW2hKUplISEoypB+uqHm1vau3oGnZ8aRzsYJlMZkIAgxmAswstEOZjjotjpKFElFFlBJ0lpocpjsVJClKEkdAoHk9Bo0sGAAE4UxgUkT0VyTABmNIAtl8aj9hqMAZNFjMaHNwVNwogsbI8sJ8kZKAlbjoDghzDFzMoorIdAizIUxMTqnSKWAOiwwAB3LAAFQA8gBxa2kYgAfRwAAlCNbiLNAvNhVDIlEFSkYqUCqdLOq5BV7I89fQDUbTVg8DgSAAFc0OvCkCgCr1CxYirKUESo84I2S3K7mKQKiRRHQifFYgppAqUKQo3VOWOG41mgBKxAAUsQcOnM9nQUE85DQBEdEGTGt26UZKl0Zl8kWZVIrrdUqVVLYo-1u-GzThLQQAGIAST7AFlPWCQvnfUiYq354opITSgqhMk4jyIUUjnFsiImJ2NSnr2uCECQE6Ci+M58Ig76GKWUTfr+8oYggNxFgIqRtiiazGFEKhQSIGBcIyLAUiynikk0LRoG03KfP0NFoHRDFMZgQx-GMvJcPyk7eq+s6IDIogSMoshyXIahIlIEj-tcIjAeYCmUHowhGFRsAAK4YBgcCwLgpCWp4Ho5s+EJLFJCAAWI9YpMUNy7PkP4KlEKJ5HI2mSnCCT3MeeqUtSFJYAO5p9t4T5TshjmoQg6GflhSg4f+AH1hRaK3KqP6SlRkU0nBRBkIlEkoRE6WYdh5a4ZkoHrA15SUAVch2FGaCMBAcA8HUSEOQWAC0zWIBNDYyrNc2zacVEuO4I0+k5zYbDIEidecwgKsY6x6POkgKWq+I6uF3zMatkmpSoEgnMUqnXMkYjlOu0ISA92SSNcKRZRRVEwaaN21YIMTbpKjZbF9-p4aqD3vhWFElkIyhUdxvGMddubJQW0SbVsiTJGuCrCEB8hlO2hK6VihkmWZsDwLjo2+nciKGDIsiqUYIV1r5qzFq2nlza5pVUjSoMpREAExAIxjFDo1hbAIaICOphQiGcaQI0klhnD1NhAA */
  id: "sync",
  initial: "idle",
  tsTypes: {} as import("./sync.machine.typegen").Typegen0,
  schema: {
    events: {} as SyncEvent,
    services: {} as SyncService,
  },
  on: {
    CLOSE: { target: "idle" },
  },
  states: {
    idle: {
      on: {
        SYNC: {
          target: "syncing",
        },
      },
    },
    syncing: {
      invoke: {
        src: "sync",
        onDone: [
          {
            cond: "isConflict",
            target: "previewingConflict",
          },
          { target: "previewingChanges" },
        ],
        onError: {
          target: "error",
        },
      },
    },
    previewingConflict: {
      initial: "selecting",
      states: {
        selecting: {
          on: {
            CONFIRM: "submitting",
          },
        },
        submitting: {
          invoke: {
            src: "syncConflict",
            onDone: "success",
          },
        },
        success: {
          type: "final",
        },
      },
    },
    previewingChanges: {
      initial: "selecting",
      states: {
        selecting: {
          on: {
            CONFIRM: "submitting",
          },
        },
        submitting: {
          invoke: {
            src: "syncChanges",
            onDone: "success",
          },
        },
        success: {
          type: "final",
        },
      },
    },
    error: {
      on: {
        RETRY: "syncing",
      },
    },
  },
});
