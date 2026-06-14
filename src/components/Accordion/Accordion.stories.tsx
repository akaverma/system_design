import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
    },
    collapsible: { control: "boolean" },
    value: { control: false },
    defaultValue: { control: false },
    onValueChange: { control: false },
    children: { control: false },
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const SingleCollapsible: Story = {
  args: {
    type: "single",
    collapsible: true,
    defaultValue: "item-1",
  },
  render: (args) => (
    <Accordion {...args} className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA accordion pattern, with `aria-expanded` triggers and
          `role=&quot;region&quot;` content panels.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that match the rest of the design system and can be
          customized via `className`.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I open multiple items?</AccordionTrigger>
        <AccordionContent>
          Not in &quot;single&quot; mode, but you can switch to `type=&quot;multiple&quot;` to allow
          multiple items to be open at once.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const SingleNonCollapsible: Story = {
  args: {
    type: "single",
    collapsible: false,
    defaultValue: "item-1",
  },
  render: (args) => (
    <Accordion {...args} className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Section one</AccordionTrigger>
        <AccordionContent>
          With `collapsible=false`, the currently open item cannot be closed by clicking it
          again&mdash;only by opening a different item.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section two</AccordionTrigger>
        <AccordionContent>This is the content for section two.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Section three</AccordionTrigger>
        <AccordionContent>This is the content for section three.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: {
    type: "multiple",
    defaultValue: ["item-1", "item-3"],
  },
  render: (args) => (
    <Accordion {...args} className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>First item</AccordionTrigger>
        <AccordionContent>
          In &quot;multiple&quot; mode, any number of items can be open at the same time.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second item</AccordionTrigger>
        <AccordionContent>This item starts closed.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Third item</AccordionTrigger>
        <AccordionContent>This item starts open, along with the first item.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Controlled: Story = {
  args: {
    type: "single",
  },
  render: (args) => {
    const [value, setValue] = React.useState<string | string[]>("item-2");

    return (
      <div className="flex w-96 flex-col gap-4">
        <p className="text-sm text-muted-foreground">Open item: {JSON.stringify(value)}</p>
        <Accordion
          {...args}
          value={value}
          onValueChange={setValue}
          className="w-full"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>First item</AccordionTrigger>
            <AccordionContent>The open item is controlled by parent state.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Second item</AccordionTrigger>
            <AccordionContent>This item is open by default in this story.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Third item</AccordionTrigger>
            <AccordionContent>Click a trigger to update the controlled state.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
};

export const WithDisabledItem: Story = {
  args: {
    type: "single",
    defaultValue: "item-1",
  },
  render: (args) => (
    <Accordion {...args} className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>First item</AccordionTrigger>
        <AccordionContent>This item is enabled and starts open.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Second item (disabled)</AccordionTrigger>
        <AccordionContent>This content cannot be reached because the trigger is disabled.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Third item</AccordionTrigger>
        <AccordionContent>This item is enabled.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
