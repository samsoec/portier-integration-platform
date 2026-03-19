import { describe, it, expect } from "vitest";
import { interpret } from "xstate";
import { syncMachine } from "../sync.machine";
import type { SyncResponse } from "~/entities/types";

const mockSyncResponse: SyncResponse = {
  code: "200",
  message: "Success",
  data: {
    sync_approval: {
      application_name: "salesforce",
      changes: [
        {
          id: "1",
          field_name: "User.email",
          change_type: "UPDATE",
          current_value: "old",
          new_value: "new",
        },
      ],
    },
    metadata: {},
  },
};

function createTestMachine(options?: {
  syncResult?: SyncResponse;
  syncError?: Error;
  isConflict?: boolean;
}) {
  return syncMachine.withConfig({
    services: {
      sync: () =>
        options?.syncError
          ? Promise.reject(options.syncError)
          : Promise.resolve(options?.syncResult ?? mockSyncResponse),
      syncConflict: () => Promise.resolve() as Promise<never>,
      syncChanges: () => Promise.resolve() as Promise<never>,
    },
    guards: {
      isConflict: () => options?.isConflict ?? false,
    },
  });
}

describe("syncMachine", () => {
  it('starts in "idle" state', () => {
    const service = interpret(createTestMachine()).start();
    expect(service.getSnapshot().value).toBe("idle");
    service.stop();
  });

  it("transitions from idle to syncing on SYNC event", () => {
    const service = interpret(createTestMachine()).start();
    service.send({ type: "SYNC", applicationId: "test" });
    expect(service.getSnapshot().value).toBe("syncing");
    service.stop();
  });

  it("transitions to previewingChanges when sync succeeds without conflict", async () => {
    const machine = createTestMachine({ isConflict: false });
    const service = interpret(machine).start();

    service.send({ type: "SYNC", applicationId: "test" });

    await new Promise<void>((resolve) => {
      service.onTransition((state) => {
        if (typeof state.value === "object" && "previewingChanges" in state.value) {
          resolve();
        }
      });
    });

    expect(service.getSnapshot().value).toEqual({ previewingChanges: "selecting" });
    service.stop();
  });

  it("transitions to previewingConflict when sync succeeds with conflict", async () => {
    const machine = createTestMachine({ isConflict: true });
    const service = interpret(machine).start();

    service.send({ type: "SYNC", applicationId: "test" });

    await new Promise<void>((resolve) => {
      service.onTransition((state) => {
        if (typeof state.value === "object" && "previewingConflict" in state.value) {
          resolve();
        }
      });
    });

    expect(service.getSnapshot().value).toEqual({ previewingConflict: "selecting" });
    service.stop();
  });

  it("transitions to error when sync fails", async () => {
    const machine = createTestMachine({ syncError: new Error("Network error") });
    const service = interpret(machine).start();

    service.send({ type: "SYNC", applicationId: "test" });

    await new Promise<void>((resolve) => {
      service.onTransition((state) => {
        if (state.value === "error") {
          resolve();
        }
      });
    });

    expect(service.getSnapshot().value).toBe("error");
    service.stop();
  });

  it("transitions from previewingChanges.selecting to previewingChanges.submitting on CONFIRM", async () => {
    const machine = createTestMachine({ isConflict: false });
    const service = interpret(machine).start();

    service.send({ type: "SYNC", applicationId: "test" });

    await new Promise<void>((resolve) => {
      service.onTransition((state) => {
        if (typeof state.value === "object" && "previewingChanges" in state.value) {
          resolve();
        }
      });
    });

    service.send({ type: "CONFIRM" });
    expect(service.getSnapshot().value).toEqual({ previewingChanges: "submitting" });
    service.stop();
  });

  it("transitions from previewingConflict.selecting to previewingConflict.submitting on CONFIRM", async () => {
    const machine = createTestMachine({ isConflict: true });
    const service = interpret(machine).start();

    service.send({ type: "SYNC", applicationId: "test" });

    await new Promise<void>((resolve) => {
      service.onTransition((state) => {
        if (typeof state.value === "object" && "previewingConflict" in state.value) {
          resolve();
        }
      });
    });

    service.send({ type: "CONFIRM" });
    expect(service.getSnapshot().value).toEqual({ previewingConflict: "submitting" });
    service.stop();
  });

  it("returns to idle on CLOSE from any state", async () => {
    const machine = createTestMachine({ isConflict: false });
    const service = interpret(machine).start();

    service.send({ type: "SYNC", applicationId: "test" });

    await new Promise<void>((resolve) => {
      service.onTransition((state) => {
        if (typeof state.value === "object" && "previewingChanges" in state.value) {
          resolve();
        }
      });
    });

    service.send({ type: "CLOSE" });
    expect(service.getSnapshot().value).toBe("idle");
    service.stop();
  });

  it("transitions from error to syncing on RETRY", async () => {
    const machine = createTestMachine({ syncError: new Error("fail") });
    const service = interpret(machine).start();

    service.send({ type: "SYNC", applicationId: "test" });

    await new Promise<void>((resolve) => {
      service.onTransition((state) => {
        if (state.value === "error") {
          resolve();
        }
      });
    });

    service.send({ type: "RETRY", applicationId: "test" });
    expect(service.getSnapshot().value).toBe("syncing");
    service.stop();
  });
});
