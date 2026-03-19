import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { syncPlatform } from "../sync-platform";
import { HttpError } from "~/utils/error";

const MOCK_SUCCESS_RESPONSE = {
  code: "200",
  message: "Sync successful",
  data: {
    sync_approval: {
      application_name: "test-app",
      changes: [
        {
          id: "c1",
          field_name: "User.email",
          change_type: "UPDATE",
          current_value: "old@email.com",
          new_value: "new@email.com",
        },
      ],
    },
    metadata: {},
  },
};

describe("syncPlatform", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns parsed sync response on success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(MOCK_SUCCESS_RESPONSE), { status: 200 })
    );
    const result = await syncPlatform("test-app");
    expect(result.code).toBe("200");
    expect(result.data.sync_approval.application_name).toBe("test-app");
    expect(result.data.sync_approval.changes).toHaveLength(1);
  });

  it("includes the application_id query param in the request URL", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(MOCK_SUCCESS_RESPONSE), { status: 200 })
    );
    await syncPlatform("my-app-id");
    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain("application_id=my-app-id");
  });

  it("throws HttpError when response status is not ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Not found" }), { status: 404 })
    );
    await expect(syncPlatform("app")).rejects.toBeInstanceOf(HttpError);
  });

  it("uses the status code from the error response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Server error" }), { status: 500 })
    );
    let caught: HttpError | undefined;
    try {
      await syncPlatform("app");
    } catch (e) {
      caught = e as HttpError;
    }
    expect(caught?.code).toBe(500);
  });

  it("uses the message from the error response body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Bad request" }), { status: 400 })
    );
    let caught: HttpError | undefined;
    try {
      await syncPlatform("app");
    } catch (e) {
      caught = e as HttpError;
    }
    expect(caught?.message).toBe("Bad request");
  });

  it("falls back to generic message when body has no message field", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 503 }));
    let caught: HttpError | undefined;
    try {
      await syncPlatform("app");
    } catch (e) {
      caught = e as HttpError;
    }
    expect(caught?.message).toContain("503");
  });
});
