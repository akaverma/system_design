import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "success",
        "warning",
        "danger",
        "info",
        "outline",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    variant: "default",
    size: "md",
    children: "Default",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Primary",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "md",
    children: "Secondary",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    size: "md",
    children: "Success",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    size: "md",
    children: "Warning",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    size: "md",
    children: "Danger",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    size: "md",
    children: "Info",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    size: "md",
    children: "Outline",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Badge {...args} size="sm">
        Small
      </Badge>
      <Badge {...args} size="md">
        Medium
      </Badge>
      <Badge {...args} size="lg">
        Large
      </Badge>
    </div>
  ),
  args: { variant: "primary" },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge {...args} variant="default">
        Default
      </Badge>
      <Badge {...args} variant="primary">
        Primary
      </Badge>
      <Badge {...args} variant="secondary">
        Secondary
      </Badge>
      <Badge {...args} variant="success">
        Success
      </Badge>
      <Badge {...args} variant="warning">
        Warning
      </Badge>
      <Badge {...args} variant="danger">
        Danger
      </Badge>
      <Badge {...args} variant="info">
        Info
      </Badge>
      <Badge {...args} variant="outline">
        Outline
      </Badge>
    </div>
  ),
};
