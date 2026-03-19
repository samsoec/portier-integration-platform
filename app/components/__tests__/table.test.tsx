import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Table } from "../ui/table";

describe("Table", () => {
  function renderTable() {
    return render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Salesforce</Table.Cell>
            <Table.Cell>Synced</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Stripe</Table.Cell>
            <Table.Cell>Error</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }

  it("renders a table element", () => {
    renderTable();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    renderTable();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders row data", () => {
    renderTable();
    expect(screen.getByText("Salesforce")).toBeInTheDocument();
    expect(screen.getByText("Stripe")).toBeInTheDocument();
  });

  it("renders the correct number of rows (excluding header)", () => {
    renderTable();
    const rows = screen.getAllByRole("row");
    // 1 header row + 2 body rows
    expect(rows).toHaveLength(3);
  });

  it("renders footer when used", () => {
    render(
      <Table>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>Total: 2</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
    expect(screen.getByText("Total: 2")).toBeInTheDocument();
  });

  it("renders caption when used", () => {
    render(
      <Table>
        <Table.Caption>Platform list</Table.Caption>
      </Table>
    );
    expect(screen.getByText("Platform list")).toBeInTheDocument();
  });

  it("applies custom className to table root", () => {
    render(<Table className="my-table" />);
    expect(screen.getByRole("table")).toHaveClass("my-table");
  });
});
