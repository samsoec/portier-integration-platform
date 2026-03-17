import { createMachine } from "xstate";

export type FetchContext = {
  data: unknown | null;
  error: string | null;
};

export type FetchEvent =
  | { type: "FETCH" }
  | { type: "RESOLVE"; data: unknown }
  | { type: "REJECT"; error: string }
  | { type: "RETRY" };

export const fetchMachine = createMachine<FetchContext, FetchEvent>({
  id: "fetch",
  initial: "idle",
  context: {
    data: null,
    error: null,
  },
  states: {
    idle: {
      on: { FETCH: "loading" },
    },
    loading: {
      on: {
        RESOLVE: {
          target: "success",
          actions: (context, event) => {
            context.data = event.data;
          },
        },
        REJECT: {
          target: "failure",
          actions: (context, event) => {
            context.error = event.error;
          },
        },
      },
    },
    success: {
      on: { FETCH: "loading" },
    },
    failure: {
      on: { RETRY: "loading" },
    },
  },
});
