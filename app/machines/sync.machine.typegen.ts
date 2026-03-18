// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.sync.syncing:invocation[0]": {
      type: "done.invoke.sync.syncing:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    sync: "done.invoke.sync.syncing:invocation[0]";
    syncChanges: "done.invoke.sync.previewingChanges.submitting:invocation[0]";
    syncConflict: "done.invoke.sync.previewingConflict.submitting:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: "isConflict";
    services: "sync" | "syncChanges" | "syncConflict";
  };
  eventsCausingActions: {};
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isConflict: "done.invoke.sync.syncing:invocation[0]";
  };
  eventsCausingServices: {
    sync: "RETRY" | "SYNC";
    syncChanges: "CONFIRM";
    syncConflict: "CONFIRM";
  };
  matchesStates:
    | "error"
    | "idle"
    | "previewingChanges"
    | "previewingChanges.selecting"
    | "previewingChanges.submitting"
    | "previewingChanges.success"
    | "previewingConflict"
    | "previewingConflict.selecting"
    | "previewingConflict.submitting"
    | "previewingConflict.success"
    | "syncing"
    | {
        previewingChanges?: "selecting" | "submitting" | "success";
        previewingConflict?: "selecting" | "submitting" | "success";
      };
  tags: "dialog:changes" | "dialog:conflict";
}
