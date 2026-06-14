import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger", "link"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "md",
    children: "Secondary Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    size: "md",
    children: "Ghost Button",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    size: "md",
    children: "Danger Button",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    size: "md",
    children: "Link Button",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
  args: { variant: "primary" },
};

export const Loading: Story = {
  args: {
    variant: "primary",
    isLoading: true,
    children: "Saving...",
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
    children: "Disabled",
  },
};

const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
  </svg>
);

export const WithIconLeft: Story = {
  args: {
    variant: "primary",
    iconLeft: <IconStar />,
    children: "Favorite",
  },
};

export const WithIconRight: Story = {
  args: {
    variant: "secondary",
    iconRight: <IconStar />,
    children: "Favorite",
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Danger
      </Button>
      <Button {...args} variant="link">
        Link
      </Button>
    </div>
  ),
};
