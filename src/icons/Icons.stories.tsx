import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "./icons";

const meta: Meta = {
  title: "Foundations/Icons",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:grid-cols-6">
      {Object.entries(Icons).map(([name, Icon]) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-md border border-border p-4 text-foreground"
        >
          <Icon size={24} />
          <span className="text-xs text-muted-foreground">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-foreground">
      <Icons.StarIcon size={16} />
      <Icons.StarIcon size={24} />
      <Icons.StarIcon size={32} />
      <Icons.StarIcon size={48} />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icons.AlertCircleIcon size={24} className="text-destructive" />
      <Icons.AlertTriangleIcon size={24} className="text-warning" />
      <Icons.CheckCircleIcon size={24} className="text-success" />
      <Icons.InfoIcon size={24} className="text-info" />
    </div>
  ),
};
