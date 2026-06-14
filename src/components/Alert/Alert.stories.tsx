import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "danger", "info"],
    },
    title: { control: "text" },
    showIcon: { control: "boolean" },
    onDismiss: { control: false },
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    variant: "default",
    title: "Heads up",
    children: "This is a general informational message.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success",
    children: "Your changes have been saved successfully.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    children: "Your subscription will expire in 3 days.",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    title: "Error",
    children: "There was a problem processing your request.",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    title: "Did you know?",
    children: "You can customize this alert using the variant prop.",
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: "success",
    title: "Success",
    showIcon: false,
    children: "Your changes have been saved successfully.",
  },
};

export const WithDismiss: Story = {
  render: (args) => {
    const [visible, setVisible] = React.useState(true);

    if (!visible) {
      return <p className="text-sm text-muted-foreground">Alert dismissed.</p>;
    }

    return <Alert {...args} onDismiss={() => setVisible(false)} />;
  },
  args: {
    variant: "info",
    title: "Heads up",
    children: "You can dismiss this alert by clicking the close button.",
  },
};

export const TitleOnly: Story = {
  args: {
    variant: "success",
    title: "Profile updated successfully.",
  },
};

export const DescriptionOnly: Story = {
  args: {
    variant: "warning",
    children: "Please verify your email address to continue.",
  },
};
