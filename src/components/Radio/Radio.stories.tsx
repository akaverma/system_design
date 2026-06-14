import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "./Radio";

const meta: Meta<typeof Radio> = {
  title: "Components/Radio",
  component: Radio,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    label: { control: "text" },
    className: { control: false },
    containerClassName: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  render: () => (
    <RadioGroup name="plan" label="Choose a plan" defaultValue="free">
      <Radio value="free" label="Free" />
      <Radio value="pro" label="Pro" />
      <Radio value="enterprise" label="Enterprise" />
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [plan, setPlan] = React.useState("pro");

    return (
      <div className="flex flex-col gap-3">
        <RadioGroup name="plan-controlled" label="Choose a plan" value={plan} onChange={setPlan}>
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
          <Radio value="enterprise" label="Enterprise" />
        </RadioGroup>
        <p className="text-sm text-muted-foreground">Selected: {plan}</p>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup name="plan-disabled" label="Choose a plan" defaultValue="free">
      <Radio value="free" label="Free" />
      <Radio value="pro" label="Pro" disabled />
      <Radio value="enterprise" label="Enterprise" />
    </RadioGroup>
  ),
};

export const Standalone: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);

    return (
      <Radio
        label="Subscribe to newsletter"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  },
};
