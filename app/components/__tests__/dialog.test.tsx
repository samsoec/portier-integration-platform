import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Dialog } from "../ui/dialog";

describe("Dialog", () => {
  it("renders nothing when open is false", () => {
    render(
      <Dialog open={false} onClose={() => {}} title="Title">
        Body
      </Dialog>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title and children when open", () => {
    render(
      <Dialog open onClose={() => {}} title="My Dialog">
        Content here
      </Dialog>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("My Dialog")).toBeInTheDocument();
    expect(screen.getByText("Content here")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <Dialog open onClose={() => {}} title="T" footer={<button>Save</button>}>
        Body
      </Dialog>
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="T">
        Body
      </Dialog>
    );
    // The close button is the one with the X icon inside the header
    const buttons = screen.getAllByRole("button");
    await userEvent.click(buttons[0]);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when the backdrop is clicked", async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="T">
        Body
      </Dialog>
    );
    const backdrop = document.querySelector("[aria-hidden='true']")!;
    await userEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when Escape key is pressed", async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} title="T">
        Body
      </Dialog>
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("sets body overflow to hidden when open", () => {
    render(
      <Dialog open onClose={() => {}} title="T">
        Body
      </Dialog>
    );
    expect(document.body.style.overflow).toBe("hidden");
  });
});
