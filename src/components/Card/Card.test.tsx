import * as React from "react";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies the default styles", () => {
    render(<Card data-testid="card">Card</Card>);
    expect(screen.getByTestId("card").className).toContain("rounded-lg");
    expect(screen.getByTestId("card").className).toContain("border-border");
    expect(screen.getByTestId("card").className).toContain("bg-card");
  });

  it("merges a custom className with default styles", () => {
    render(
      <Card data-testid="card" className="my-custom-class">
        Card
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card.className).toContain("my-custom-class");
    expect(card.className).toContain("rounded-lg");
  });

  it("forwards refs to the underlying div element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Card</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("CardHeader", () => {
  it("renders children", () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("applies the default styles", () => {
    render(<CardHeader data-testid="header">Header</CardHeader>);
    expect(screen.getByTestId("header").className).toContain("flex");
    expect(screen.getByTestId("header").className).toContain("flex-col");
    expect(screen.getByTestId("header").className).toContain("p-6");
  });

  it("merges a custom className with default styles", () => {
    render(
      <CardHeader data-testid="header" className="my-custom-class">
        Header
      </CardHeader>,
    );
    const header = screen.getByTestId("header");
    expect(header.className).toContain("my-custom-class");
    expect(header.className).toContain("flex");
  });

  it("forwards refs to the underlying div element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardHeader ref={ref}>Header</CardHeader>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("CardTitle", () => {
  it("renders children as a heading", () => {
    render(<CardTitle>Title text</CardTitle>);
    const title = screen.getByText("Title text");
    expect(title.tagName).toBe("H3");
  });

  it("applies the default styles", () => {
    render(<CardTitle data-testid="title">Title</CardTitle>);
    expect(screen.getByTestId("title").className).toContain("text-lg");
    expect(screen.getByTestId("title").className).toContain("font-semibold");
  });

  it("merges a custom className with default styles", () => {
    render(
      <CardTitle data-testid="title" className="my-custom-class">
        Title
      </CardTitle>,
    );
    const title = screen.getByTestId("title");
    expect(title.className).toContain("my-custom-class");
    expect(title.className).toContain("text-lg");
  });

  it("forwards refs to the underlying heading element", () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(<CardTitle ref={ref}>Title</CardTitle>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });
});

describe("CardDescription", () => {
  it("renders children as a paragraph", () => {
    render(<CardDescription>Description text</CardDescription>);
    const description = screen.getByText("Description text");
    expect(description.tagName).toBe("P");
  });

  it("applies the default styles", () => {
    render(<CardDescription data-testid="description">Description</CardDescription>);
    expect(screen.getByTestId("description").className).toContain("text-sm");
    expect(screen.getByTestId("description").className).toContain("text-muted-foreground");
  });

  it("merges a custom className with default styles", () => {
    render(
      <CardDescription data-testid="description" className="my-custom-class">
        Description
      </CardDescription>,
    );
    const description = screen.getByTestId("description");
    expect(description.className).toContain("my-custom-class");
    expect(description.className).toContain("text-sm");
  });

  it("forwards refs to the underlying paragraph element", () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(<CardDescription ref={ref}>Description</CardDescription>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});

describe("CardContent", () => {
  it("renders children", () => {
    render(<CardContent>Content text</CardContent>);
    expect(screen.getByText("Content text")).toBeInTheDocument();
  });

  it("applies the default styles", () => {
    render(<CardContent data-testid="content">Content</CardContent>);
    expect(screen.getByTestId("content").className).toContain("p-6");
    expect(screen.getByTestId("content").className).toContain("pt-0");
  });

  it("merges a custom className with default styles", () => {
    render(
      <CardContent data-testid="content" className="my-custom-class">
        Content
      </CardContent>,
    );
    const content = screen.getByTestId("content");
    expect(content.className).toContain("my-custom-class");
    expect(content.className).toContain("p-6");
  });

  it("forwards refs to the underlying div element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardContent ref={ref}>Content</CardContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("CardFooter", () => {
  it("renders children", () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("applies the default styles", () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);
    expect(screen.getByTestId("footer").className).toContain("flex");
    expect(screen.getByTestId("footer").className).toContain("items-center");
    expect(screen.getByTestId("footer").className).toContain("p-6");
  });

  it("merges a custom className with default styles", () => {
    render(
      <CardFooter data-testid="footer" className="my-custom-class">
        Footer
      </CardFooter>,
    );
    const footer = screen.getByTestId("footer");
    expect(footer.className).toContain("my-custom-class");
    expect(footer.className).toContain("flex");
  });

  it("forwards refs to the underlying div element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardFooter ref={ref}>Footer</CardFooter>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("Card composition", () => {
  it("renders a full card with header, content, and footer", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body content</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(screen.getByText("Footer actions")).toBeInTheDocument();
  });
});
