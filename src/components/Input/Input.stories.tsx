import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Username",
    placeholder: "jane.doe",
    helperText: "This will be visible to other users.",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    defaultValue: "not-an-email",
    error: "Please enter a valid email address.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    disabled: true,
  },
};

const MailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeWidth="2"
      d="M4 4h16v16H4V4Zm0 0 8 8 8-8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" strokeWidth="2" />
    <path d="M21 21l-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const WithPrefixIcon: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    prefix: <MailIcon />,
  },
};

export const WithSuffixIcon: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    suffix: <SearchIcon />,
  },
};

export const NoLabel: Story = {
  args: {
    placeholder: "No label, only placeholder",
  },
};
