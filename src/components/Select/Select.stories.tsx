import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const fruitOptions = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian", disabled: true },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    options: { control: false },
    children: { control: false },
    className: { control: false },
    containerClassName: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: "Favorite fruit",
    options: fruitOptions,
  },
};

export const WithPlaceholder: Story = {
  args: {
    label: "Favorite fruit",
    placeholder: "Select a fruit",
    options: fruitOptions,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Favorite fruit",
    options: fruitOptions,
    helperText: "Choose the fruit you enjoy the most.",
  },
};

export const WithError: Story = {
  args: {
    label: "Favorite fruit",
    options: fruitOptions,
    error: "Please select a fruit.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Favorite fruit",
    options: fruitOptions,
    disabled: true,
  },
};

export const WithChildren: Story = {
  args: {
    label: "Favorite fruit",
  },
  render: (args) => (
    <Select {...args}>
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="cherry">Cherry</option>
    </Select>
  ),
};

export const NoLabel: Story = {
  args: {
    options: fruitOptions,
  },
};
