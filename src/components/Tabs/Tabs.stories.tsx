import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabList, Tab, TabPanel } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
    onValueChange: { control: false },
    children: { control: false },
    className: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    defaultValue: "account",
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList>
        <Tab value="account">Account</Tab>
        <Tab value="password">Password</Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>
      <TabPanel value="account">
        <p>Manage your account details and profile information here.</p>
      </TabPanel>
      <TabPanel value="password">
        <p>Update your password and security preferences here.</p>
      </TabPanel>
      <TabPanel value="settings">
        <p>Configure general application settings here.</p>
      </TabPanel>
    </Tabs>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("account");

    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Selected tab: <span className="font-medium text-foreground">{value}</span>
        </p>
        <Tabs value={value} onValueChange={setValue}>
          <TabList>
            <Tab value="account">Account</Tab>
            <Tab value="password">Password</Tab>
            <Tab value="settings">Settings</Tab>
          </TabList>
          <TabPanel value="account">
            <p>Manage your account details and profile information here.</p>
          </TabPanel>
          <TabPanel value="password">
            <p>Update your password and security preferences here.</p>
          </TabPanel>
          <TabPanel value="settings">
            <p>Configure general application settings here.</p>
          </TabPanel>
        </Tabs>
      </div>
    );
  },
};

export const WithDisabledTab: Story = {
  args: {
    defaultValue: "account",
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList>
        <Tab value="account">Account</Tab>
        <Tab value="password" disabled>
          Password
        </Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>
      <TabPanel value="account">
        <p>Manage your account details and profile information here.</p>
      </TabPanel>
      <TabPanel value="password">
        <p>Update your password and security preferences here.</p>
      </TabPanel>
      <TabPanel value="settings">
        <p>Configure general application settings here.</p>
      </TabPanel>
    </Tabs>
  ),
};

export const ManyTabs: Story = {
  args: {
    defaultValue: "tab1",
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList className="max-w-md flex-wrap">
        <Tab value="tab1">Overview</Tab>
        <Tab value="tab2">Analytics</Tab>
        <Tab value="tab3">Reports</Tab>
        <Tab value="tab4">Notifications</Tab>
        <Tab value="tab5">Integrations</Tab>
        <Tab value="tab6">Billing</Tab>
      </TabList>
      <TabPanel value="tab1">
        <p>Overview content.</p>
      </TabPanel>
      <TabPanel value="tab2">
        <p>Analytics content.</p>
      </TabPanel>
      <TabPanel value="tab3">
        <p>Reports content.</p>
      </TabPanel>
      <TabPanel value="tab4">
        <p>Notifications content.</p>
      </TabPanel>
      <TabPanel value="tab5">
        <p>Integrations content.</p>
      </TabPanel>
      <TabPanel value="tab6">
        <p>Billing content.</p>
      </TabPanel>
    </Tabs>
  ),
};
