import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { Button } from "../Button";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
    },
    closeOnOverlayClick: { control: "boolean" },
    closeOnEsc: { control: "boolean" },
    showCloseButton: { control: "boolean" },
    title: { control: false },
    description: { control: false },
    children: { control: false },
    footer: { control: false },
    className: { control: false },
    isOpen: { control: false },
    onClose: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open modal</Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Edit profile"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <p className="text-sm text-foreground">
            Make changes to your profile here. Click confirm when you&apos;re done.
          </p>
        </Modal>
      </>
    );
  },
};

export const WithoutFooter: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} title="Notice">
          <p className="text-sm text-foreground">
            This modal has no footer, just a title, body, and close button.
          </p>
        </Modal>
      </>
    );
  },
};

export const WithDescription: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open modal</Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Delete account"
          description="This action cannot be undone. This will permanently delete your account."
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setIsOpen(false)}>
                Delete
              </Button>
            </>
          }
        >
          <p className="text-sm text-foreground">All of your data will be removed.</p>
        </Modal>
      </>
    );
  },
};

export const Small: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open small modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} title="Small modal" size="sm">
          <p className="text-sm text-foreground">A compact dialog for short messages.</p>
        </Modal>
      </>
    );
  },
};

export const Large: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open large modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} title="Large modal" size="lg">
          <p className="text-sm text-foreground">A larger dialog with more room for content.</p>
        </Modal>
      </>
    );
  },
};

export const Full: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open full-screen modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} title="Full-screen modal" size="full">
          <p className="text-sm text-foreground">This modal takes up nearly the entire viewport.</p>
        </Modal>
      </>
    );
  },
};

export const NoCloseButton: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open modal</Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="No close button"
          showCloseButton={false}
          footer={
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Done
            </Button>
          }
        >
          <p className="text-sm text-foreground">
            This modal has no close (X) button. Use the footer action, overlay click, or ESC to close.
          </p>
        </Modal>
      </>
    );
  },
};

export const PersistentNoOverlayClose: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open persistent modal</Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Action required"
          closeOnOverlayClick={false}
          closeOnEsc={false}
          footer={
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Acknowledge
            </Button>
          }
        >
          <p className="text-sm text-foreground">
            This modal can only be closed using the button below — clicking the overlay or
            pressing ESC will not close it.
          </p>
        </Modal>
      </>
    );
  },
};
