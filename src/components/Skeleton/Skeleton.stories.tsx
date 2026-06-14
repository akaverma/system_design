import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "circular", "rectangular"],
    },
    width: { control: "text" },
    height: { control: "text" },
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    variant: "rectangular",
    width: 240,
    height: 120,
  },
};

export const Text: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-2">
      <Skeleton {...args} variant="text" width="100%" />
      <Skeleton {...args} variant="text" width="100%" />
      <Skeleton {...args} variant="text" width="60%" />
    </div>
  ),
};

export const Circular: Story = {
  args: {
    variant: "circular",
    width: 48,
    height: 48,
  },
};

export const Rectangular: Story = {
  args: {
    variant: "rectangular",
    width: 240,
    height: 120,
  },
};

export const CardPlaceholder: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4 rounded-md border border-input p-4">
      <Skeleton variant="rectangular" width="100%" height={140} />
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  ),
};
