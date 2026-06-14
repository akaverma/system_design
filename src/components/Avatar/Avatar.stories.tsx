import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    shape: {
      control: "select",
      options: ["circle", "square"],
    },
    src: { control: "text" },
    alt: { control: "text" },
    name: { control: "text" },
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  args: {
    src: "https://avatars.githubusercontent.com/u/9919?v=4",
    alt: "GitHub avatar",
    name: "Jane Doe",
  },
};

export const WithInitials: Story = {
  args: {
    name: "Jane Doe",
  },
};

export const WithFallbackIcon: Story = {
  args: {},
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </div>
  ),
  args: { name: "Jane Doe" },
};

export const Shapes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} shape="circle" />
      <Avatar {...args} shape="square" />
    </div>
  ),
  args: { name: "Jane Doe" },
};

export const BrokenImage: Story = {
  args: {
    src: "https://example.invalid/broken.png",
    name: "Jane Doe",
  },
};
