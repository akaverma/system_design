import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "./Drawer";
import { Button } from "../Button";

const meta: Meta<typeof Drawer> = {
  title: "Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "full"],
    },
    closeOnOverlayClick: { control: "boolean" },
    closeOnEsc: { control: "boolean" },
    showCloseButton: { control: "boolean" },
    isOpen: { control: false },
    onClose: { control: false },
    title: { control: false },
    children: { control: false },
    footer: { control: false },
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Right: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          position="right"
          title="Drawer Title"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save</Button>
            </>
          }
        >
          <p className="text-sm text-foreground">
            This is the drawer body content. It can contain any elements, such as forms or
            navigation links.
          </p>
        </Drawer>
      </div>
    );
  },
};

export const Left: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Left Drawer</Button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          position="left"
          title="Navigation"
        >
          <nav className="flex flex-col gap-2 text-sm text-foreground">
            <button type="button" className="text-left hover:underline">
              Home
            </button>
            <button type="button" className="text-left hover:underline">
              About
            </button>
            <button type="button" className="text-left hover:underline">
              Contact
            </button>
          </nav>
        </Drawer>
      </div>
    );
  },
};

export const Top: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Top Drawer</Button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          position="top"
          title="Notifications"
        >
          <p className="text-sm text-foreground">You have no new notifications.</p>
        </Drawer>
      </div>
    );
  },
};

export const Bottom: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Bottom Drawer</Button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          position="bottom"
          title="Cookie Preferences"
          footer={<Button onClick={() => setIsOpen(false)}>Accept</Button>}
        >
          <p className="text-sm text-foreground">
            We use cookies to improve your experience on our site.
          </p>
        </Drawer>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: (args) => {
    const [size, setSize] = React.useState<"sm" | "md" | "lg" | null>(null);
    return (
      <div className="flex items-center gap-4">
        <Button onClick={() => setSize("sm")}>Small</Button>
        <Button onClick={() => setSize("md")}>Medium</Button>
        <Button onClick={() => setSize("lg")}>Large</Button>
        <Drawer
          {...args}
          isOpen={size !== null}
          onClose={() => setSize(null)}
          position="right"
          size={size ?? "md"}
          title={`Size: ${size ?? "md"}`}
        >
          <p className="text-sm text-foreground">
            This drawer is sized using the <code>size</code> prop.
          </p>
        </Drawer>
      </div>
    );
  },
};

export const WithoutFooter: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          position="right"
          title="No Footer"
        >
          <p className="text-sm text-foreground">
            This drawer has no footer section.
          </p>
        </Drawer>
      </div>
    );
  },
};

export const PersistentNoOverlayClose: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Persistent Drawer</Button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          position="right"
          title="Persistent Drawer"
          closeOnOverlayClick={false}
          closeOnEsc={false}
          footer={<Button onClick={() => setIsOpen(false)}>Close</Button>}
        >
          <p className="text-sm text-foreground">
            This drawer can only be closed via the close button or the footer button. Clicking
            the overlay or pressing Escape will not close it.
          </p>
        </Drawer>
      </div>
    );
  },
};
