import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    className: { control: false },
    children: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">
          Fill in the details below to get your project up and running.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithoutFooter: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">Check your inbox to see what&apos;s new.</p>
      </CardContent>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardContent>
        <p className="text-sm text-foreground">
          This card has no header or footer, just content.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithCustomClassName: Story = {
  render: (args) => (
    <Card {...args} className="w-[500px] border-2 border-primary">
      <CardHeader>
        <CardTitle>Custom width</CardTitle>
        <CardDescription>This card uses a custom className for sizing and border.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">
          The <code>className</code> prop is merged with the default styles via <code>cn()</code>.
        </p>
      </CardContent>
    </Card>
  ),
};
