import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: {
    onPageChange: fn(),
  },
  argTypes: {
    currentPage: { control: "number" },
    totalPages: { control: "number" },
    siblingCount: { control: "number" },
    hideControls: { control: "boolean" },
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    totalPages: 10,
    currentPage: 1,
  },
  render: (args) => {
    const [page, setPage] = React.useState(args.currentPage);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(newPage) => {
          setPage(newPage);
          args.onPageChange?.(newPage);
        }}
      />
    );
  },
};

export const MiddlePage: Story = {
  args: {
    totalPages: 10,
    currentPage: 5,
  },
};

export const LastPage: Story = {
  args: {
    totalPages: 10,
    currentPage: 10,
  },
};

export const ManyPages: Story = {
  args: {
    totalPages: 50,
    currentPage: 25,
  },
};

export const FewPages: Story = {
  args: {
    totalPages: 4,
    currentPage: 2,
  },
};

export const SiblingCountTwo: Story = {
  args: {
    totalPages: 20,
    currentPage: 10,
    siblingCount: 2,
  },
};

export const HiddenControls: Story = {
  args: {
    totalPages: 10,
    currentPage: 5,
    hideControls: true,
  },
};
