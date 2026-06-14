import * as React from "react";
import { render, screen } from "@testing-library/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./Table";

describe("Table", () => {
  it("renders a table element", () => {
    render(
      <Table data-testid="table">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const table = screen.getByTestId("table");
    expect(table.tagName).toBe("TABLE");
    expect(table.className).toContain("w-full");
    expect(table.className).toContain("caption-bottom");
  });

  it("wraps the table in a scrollable container", () => {
    render(
      <Table data-testid="table">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const table = screen.getByTestId("table");
    const wrapper = table.parentElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper?.className).toContain("relative");
    expect(wrapper?.className).toContain("w-full");
    expect(wrapper?.className).toContain("overflow-auto");
  });

  it("merges a custom className with default styles on Table", () => {
    render(
      <Table data-testid="table" className="my-custom-class">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByTestId("table").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying table element", () => {
    const ref = React.createRef<HTMLTableElement>();
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it("spreads additional props onto the table element", () => {
    render(
      <Table data-testid="table" aria-label="Demo table">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByTestId("table")).toHaveAttribute("aria-label", "Demo table");
  });
});

describe("TableHeader", () => {
  it("renders a thead element with default styles", () => {
    render(
      <Table>
        <TableHeader data-testid="thead">
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    const thead = screen.getByTestId("thead");
    expect(thead.tagName).toBe("THEAD");
    expect(thead.className).toContain("[&_tr]:border-b");
  });

  it("merges a custom className with default styles", () => {
    render(
      <Table>
        <TableHeader data-testid="thead" className="my-custom-class">
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    expect(screen.getByTestId("thead").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying thead element", () => {
    const ref = React.createRef<HTMLTableSectionElement>();
    render(
      <Table>
        <TableHeader ref={ref}>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    expect(ref.current).toBeInstanceOf(HTMLTableSectionElement);
    expect(ref.current?.tagName).toBe("THEAD");
  });
});

describe("TableBody", () => {
  it("renders a tbody element with default styles", () => {
    render(
      <Table>
        <TableBody data-testid="tbody">
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const tbody = screen.getByTestId("tbody");
    expect(tbody.tagName).toBe("TBODY");
    expect(tbody.className).toContain("[&_tr:last-child]:border-0");
  });

  it("merges a custom className with default styles", () => {
    render(
      <Table>
        <TableBody data-testid="tbody" className="my-custom-class">
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByTestId("tbody").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying tbody element", () => {
    const ref = React.createRef<HTMLTableSectionElement>();
    render(
      <Table>
        <TableBody ref={ref}>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(ref.current).toBeInstanceOf(HTMLTableSectionElement);
    expect(ref.current?.tagName).toBe("TBODY");
  });
});

describe("TableFooter", () => {
  it("renders a tfoot element with default styles", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter data-testid="tfoot">
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const tfoot = screen.getByTestId("tfoot");
    expect(tfoot.tagName).toBe("TFOOT");
    expect(tfoot.className).toContain("border-t");
    expect(tfoot.className).toContain("bg-muted/50");
    expect(tfoot.className).toContain("font-medium");
  });

  it("merges a custom className with default styles", () => {
    render(
      <Table>
        <TableFooter data-testid="tfoot" className="my-custom-class">
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    expect(screen.getByTestId("tfoot").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying tfoot element", () => {
    const ref = React.createRef<HTMLTableSectionElement>();
    render(
      <Table>
        <TableFooter ref={ref}>
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    expect(ref.current).toBeInstanceOf(HTMLTableSectionElement);
    expect(ref.current?.tagName).toBe("TFOOT");
  });
});

describe("TableRow", () => {
  it("renders a tr element with default styles", () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row">
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const row = screen.getByTestId("row");
    expect(row.tagName).toBe("TR");
    expect(row.className).toContain("border-b");
    expect(row.className).toContain("hover:bg-muted/50");
    expect(row.className).toContain("data-[state=selected]:bg-muted");
  });

  it("merges a custom className with default styles", () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row" className="my-custom-class">
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByTestId("row").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying tr element", () => {
    const ref = React.createRef<HTMLTableRowElement>();
    render(
      <Table>
        <TableBody>
          <TableRow ref={ref}>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(ref.current).toBeInstanceOf(HTMLTableRowElement);
    expect(ref.current?.tagName).toBe("TR");
  });

  it("spreads additional props such as data-state", () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row" data-state="selected">
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByTestId("row")).toHaveAttribute("data-state", "selected");
  });
});

describe("TableHead", () => {
  it("renders a th element with default styles", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead data-testid="head">Column</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    const head = screen.getByTestId("head");
    expect(head.tagName).toBe("TH");
    expect(head.className).toContain("h-10");
    expect(head.className).toContain("text-left");
    expect(head.className).toContain("text-muted-foreground");
  });

  it("renders its children text", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    expect(screen.getByText("Invoice")).toBeInTheDocument();
  });

  it("merges a custom className with default styles", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead data-testid="head" className="my-custom-class">
              Column
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    expect(screen.getByTestId("head").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying th element", () => {
    const ref = React.createRef<HTMLTableCellElement>();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead ref={ref}>Column</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
    expect(ref.current?.tagName).toBe("TH");
  });
});

describe("TableCell", () => {
  it("renders a td element with default styles", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell data-testid="cell">Value</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const cell = screen.getByTestId("cell");
    expect(cell.tagName).toBe("TD");
    expect(cell.className).toContain("p-2");
    expect(cell.className).toContain("align-middle");
  });

  it("renders its children text", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>INV001</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByText("INV001")).toBeInTheDocument();
  });

  it("merges a custom className with default styles", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell data-testid="cell" className="my-custom-class">
              Value
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByTestId("cell").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying td element", () => {
    const ref = React.createRef<HTMLTableCellElement>();
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell ref={ref}>Value</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
    expect(ref.current?.tagName).toBe("TD");
  });

  it("supports colSpan and other td attributes", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell data-testid="cell" colSpan={3}>
              Total
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByTestId("cell")).toHaveAttribute("colspan", "3");
  });
});

describe("TableCaption", () => {
  it("renders a caption element with default styles", () => {
    render(
      <Table>
        <TableCaption data-testid="caption">A list of recent invoices.</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const caption = screen.getByTestId("caption");
    expect(caption.tagName).toBe("CAPTION");
    expect(caption.className).toContain("mt-4");
    expect(caption.className).toContain("text-muted-foreground");
    expect(caption).toHaveTextContent("A list of recent invoices.");
  });

  it("merges a custom className with default styles", () => {
    render(
      <Table>
        <TableCaption data-testid="caption" className="my-custom-class">
          Caption
        </TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByTestId("caption").className).toContain("my-custom-class");
  });

  it("forwards refs to the underlying caption element", () => {
    const ref = React.createRef<HTMLTableCaptionElement>();
    render(
      <Table>
        <TableCaption ref={ref}>Caption</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(ref.current).toBeInstanceOf(HTMLTableCaptionElement);
    expect(ref.current?.tagName).toBe("CAPTION");
  });
});

describe("Table composition", () => {
  it("renders a full table with header, body, footer, and caption", () => {
    render(
      <Table>
        <TableCaption>A list of recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV001</TableCell>
            <TableCell>Paid</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>INV002</TableCell>
            <TableCell>Pending</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>2 invoices</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    expect(screen.getByText("A list of recent invoices.")).toBeInTheDocument();
    expect(screen.getByText("Invoice")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("INV001")).toBeInTheDocument();
    expect(screen.getByText("INV002")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("2 invoices")).toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(4);
  });
});
