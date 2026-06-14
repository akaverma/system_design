import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
    className: { control: false },
    containerClassName: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
  },
};

export const Checked: Story = {
  args: {
    label: "Subscribe to newsletter",
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: "Select all",
    indeterminate: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Enable notifications",
    helperText: "You can change this later in settings.",
  },
};

export const WithError: Story = {
  args: {
    label: "Accept terms and conditions",
    error: "You must accept the terms to continue.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Accept terms and conditions",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Accept terms and conditions",
    disabled: true,
    defaultChecked: true,
  },
};

export const NoLabel: Story = {
  args: {
    "aria-label": "No visible label",
  },
};
