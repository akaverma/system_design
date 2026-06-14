import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    delay: { control: "number" },
    disabled: { control: "boolean" },
    content: { control: false },
    children: { control: false },
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: "Tooltip text",
    position: "top",
    children: <Button>Hover me</Button>,
  },
};

export const Positions: Story = {
  render: () => (
    <div className="flex items-center gap-12 p-12">
      <Tooltip content="Top tooltip" position="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" position="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" position="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" position="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
};

export const WithDelay: Story = {
  args: {
    content: "Appears after 600ms",
    delay: 600,
    children: <Button>Hover and wait</Button>,
  },
};

export const Disabled: Story = {
  args: {
    content: "You will never see this",
    disabled: true,
    children: <Button>Disabled tooltip</Button>,
  },
};

export const LongContent: Story = {
  args: {
    content:
      "This is a much longer tooltip message that demonstrates how the bubble handles extra content.",
    className: "whitespace-normal max-w-xs",
    children: <Button>Hover for details</Button>,
  },
};
