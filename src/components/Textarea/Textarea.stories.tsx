import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    resize: {
      control: "select",
      options: ["none", "vertical", "horizontal", "both"],
    },
    className: { control: false },
    containerClassName: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: "Bio",
    placeholder: "Tell us about yourself",
    rows: 4,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Bio",
    placeholder: "Tell us about yourself",
    helperText: "Maximum 200 characters.",
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    label: "Bio",
    placeholder: "Tell us about yourself",
    defaultValue: "x",
    error: "Bio must be at least 10 characters.",
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    label: "Bio",
    placeholder: "Tell us about yourself",
    disabled: true,
    rows: 4,
  },
};

export const NoLabel: Story = {
  args: {
    placeholder: "No label, only placeholder",
    rows: 4,
  },
};

export const ResizeNone: Story = {
  args: {
    label: "Comments",
    placeholder: "This textarea cannot be resized",
    resize: "none",
    rows: 4,
  },
};
