import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Toggle } from "./Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  args: {
    onCheckedChange: fn(),
    "aria-label": "Toggle",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    size: "md",
  },
};

export const Checked: Story = {
  args: {
    size: "md",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    size: "md",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    size: "md",
    disabled: true,
    defaultChecked: true,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Toggle {...args} size="sm" aria-label="Small toggle" />
      <Toggle {...args} size="md" aria-label="Medium toggle" />
      <Toggle {...args} size="lg" aria-label="Large toggle" />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(false);
    return (
      <div className="flex items-center gap-3">
        <Toggle
          {...args}
          checked={checked}
          onCheckedChange={(next) => {
            setChecked(next);
            args.onCheckedChange?.(next);
          }}
        />
        <span className="text-sm text-foreground">{checked ? "On" : "Off"}</span>
      </div>
    );
  },
};
