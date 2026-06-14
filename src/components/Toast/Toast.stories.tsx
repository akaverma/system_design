import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Toast, ToastProvider, useToast } from "./Toast";
import { Button } from "../Button";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  tags: ["autodocs"],
  args: {
    onDismiss: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "danger", "info"],
    },
    title: { control: "text" },
    description: { control: "text" },
    onDismiss: { control: false },
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    variant: "default",
    title: "Notification",
    description: "This is a default toast notification.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success",
    description: "Your changes have been saved.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    description: "Your subscription is about to expire.",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    title: "Error",
    description: "Something went wrong. Please try again.",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    title: "Heads up",
    description: "A new version is available.",
  },
};

export const WithoutDismiss: Story = {
  args: {
    variant: "info",
    title: "No dismiss button",
    description: "This toast cannot be manually dismissed.",
    onDismiss: undefined,
  },
};

function ToastDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="primary"
        onClick={() =>
          toast({
            variant: "success",
            title: "Success",
            description: "Your changes have been saved.",
          })
        }
      >
        Show success toast
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          toast({
            variant: "danger",
            title: "Error",
            description: "Something went wrong. Please try again.",
          })
        }
      >
        Show error toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            variant: "warning",
            title: "Warning",
            description: "Your subscription is about to expire.",
          })
        }
      >
        Show warning toast
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          toast({
            variant: "info",
            title: "Heads up",
            description: "A new version is available.",
            duration: 0,
          })
        }
      >
        Show persistent info toast
      </Button>
    </div>
  );
}

export const Interactive: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};
