import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabList, Tab, TabPanel } from "./Tabs";

function BasicTabs(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return (
    <Tabs defaultValue="account" {...props}>
      <TabList>
        <Tab value="account">Account</Tab>
        <Tab value="password">Password</Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>
      <TabPanel value="account">Account content</TabPanel>
      <TabPanel value="password">Password content</TabPanel>
      <TabPanel value="settings">Settings content</TabPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("renders a tablist with tabs and the default selected panel", () => {
    render(<BasicTabs />);

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Account" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Password" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Settings" })).toBeInTheDocument();

    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account content");
    expect(screen.queryByText("Password content")).not.toBeInTheDocument();
    expect(screen.queryByText("Settings content")).not.toBeInTheDocument();
  });

  it("marks the default tab as selected with correct ARIA attributes", () => {
    render(<BasicTabs />);

    const accountTab = screen.getByRole("tab", { name: "Account" });
    const passwordTab = screen.getByRole("tab", { name: "Password" });

    expect(accountTab).toHaveAttribute("aria-selected", "true");
    expect(accountTab).toHaveAttribute("tabIndex", "0");
    expect(accountTab).toHaveAttribute("id", "tab-account");
    expect(accountTab).toHaveAttribute("aria-controls", "tabpanel-account");

    expect(passwordTab).toHaveAttribute("aria-selected", "false");
    expect(passwordTab).toHaveAttribute("tabIndex", "-1");
  });

  it("associates the panel with its tab via aria-labelledby/id", () => {
    render(<BasicTabs />);

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("id", "tabpanel-account");
    expect(panel).toHaveAttribute("aria-labelledby", "tab-account");
    expect(panel).toHaveAttribute("tabIndex", "0");
  });

  it("selects a tab on click and shows its panel (uncontrolled)", async () => {
    render(<BasicTabs />);

    await userEvent.click(screen.getByRole("tab", { name: "Password" }));

    expect(screen.getByRole("tab", { name: "Password" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Password content");
  });

  it("supports controlled selection via value and onValueChange", async () => {
    function ControlledTabs() {
      const [value, setValue] = React.useState("account");
      return <BasicTabs value={value} onValueChange={setValue} />;
    }

    render(<ControlledTabs />);

    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account content");

    await userEvent.click(screen.getByRole("tab", { name: "Settings" }));

    expect(screen.getByRole("tab", { name: "Settings" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Settings content");
  });

  it("does not change selection internally when value is controlled and onValueChange is not provided", async () => {
    render(<BasicTabs value="account" />);

    await userEvent.click(screen.getByRole("tab", { name: "Password" }));

    // value prop stays "account" since nothing updates it
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account content");
  });

  it("calls onValueChange when a tab is selected", async () => {
    const handleChange = jest.fn();
    render(<BasicTabs value="account" onValueChange={handleChange} />);

    await userEvent.click(screen.getByRole("tab", { name: "Password" }));

    expect(handleChange).toHaveBeenCalledWith("password");
  });

  it("does not select a disabled tab on click", async () => {
    render(
      <Tabs defaultValue="account">
        <TabList>
          <Tab value="account">Account</Tab>
          <Tab value="password" disabled>
            Password
          </Tab>
        </TabList>
        <TabPanel value="account">Account content</TabPanel>
        <TabPanel value="password">Password content</TabPanel>
      </Tabs>,
    );

    const passwordTab = screen.getByRole("tab", { name: "Password" });
    expect(passwordTab).toBeDisabled();

    await userEvent.click(passwordTab);

    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Account content");
  });

  it("navigates to the next tab with ArrowRight and wraps around", async () => {
    render(<BasicTabs />);

    const accountTab = screen.getByRole("tab", { name: "Account" });
    const passwordTab = screen.getByRole("tab", { name: "Password" });
    const settingsTab = screen.getByRole("tab", { name: "Settings" });

    accountTab.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(passwordTab).toHaveFocus();
    expect(passwordTab).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{ArrowRight}");
    expect(settingsTab).toHaveFocus();
    expect(settingsTab).toHaveAttribute("aria-selected", "true");

    // wraps around back to the first tab
    await userEvent.keyboard("{ArrowRight}");
    expect(accountTab).toHaveFocus();
    expect(accountTab).toHaveAttribute("aria-selected", "true");
  });

  it("navigates to the previous tab with ArrowLeft and wraps around", async () => {
    render(<BasicTabs />);

    const accountTab = screen.getByRole("tab", { name: "Account" });
    const settingsTab = screen.getByRole("tab", { name: "Settings" });

    accountTab.focus();
    await userEvent.keyboard("{ArrowLeft}");

    // wraps around to the last tab
    expect(settingsTab).toHaveFocus();
    expect(settingsTab).toHaveAttribute("aria-selected", "true");
  });

  it("moves focus to the first tab on Home and last tab on End", async () => {
    render(<BasicTabs />);

    const accountTab = screen.getByRole("tab", { name: "Account" });
    const settingsTab = screen.getByRole("tab", { name: "Settings" });

    accountTab.focus();

    await userEvent.keyboard("{End}");
    expect(settingsTab).toHaveFocus();
    expect(settingsTab).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{Home}");
    expect(accountTab).toHaveFocus();
    expect(accountTab).toHaveAttribute("aria-selected", "true");
  });

  it("skips disabled tabs during keyboard navigation", async () => {
    render(
      <Tabs defaultValue="account">
        <TabList>
          <Tab value="account">Account</Tab>
          <Tab value="password" disabled>
            Password
          </Tab>
          <Tab value="settings">Settings</Tab>
        </TabList>
        <TabPanel value="account">Account content</TabPanel>
        <TabPanel value="password">Password content</TabPanel>
        <TabPanel value="settings">Settings content</TabPanel>
      </Tabs>,
    );

    const accountTab = screen.getByRole("tab", { name: "Account" });
    const settingsTab = screen.getByRole("tab", { name: "Settings" });

    accountTab.focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(settingsTab).toHaveFocus();
    expect(settingsTab).toHaveAttribute("aria-selected", "true");
  });

  it("ignores other keys", async () => {
    render(<BasicTabs />);

    const accountTab = screen.getByRole("tab", { name: "Account" });
    accountTab.focus();

    await userEvent.keyboard("{ArrowDown}");

    expect(accountTab).toHaveFocus();
    expect(accountTab).toHaveAttribute("aria-selected", "true");
  });

  it("calls a custom onKeyDown handler passed to TabList", async () => {
    const handleKeyDown = jest.fn();
    render(
      <Tabs defaultValue="account">
        <TabList onKeyDown={handleKeyDown}>
          <Tab value="account">Account</Tab>
          <Tab value="password">Password</Tab>
        </TabList>
        <TabPanel value="account">Account content</TabPanel>
        <TabPanel value="password">Password content</TabPanel>
      </Tabs>,
    );

    screen.getByRole("tab", { name: "Account" }).focus();
    await userEvent.keyboard("{ArrowRight}");

    expect(handleKeyDown).toHaveBeenCalled();
  });

  it("calls a custom onClick handler passed to Tab", async () => {
    const handleClick = jest.fn();
    render(
      <Tabs defaultValue="account">
        <TabList>
          <Tab value="account">Account</Tab>
          <Tab value="password" onClick={handleClick}>
            Password
          </Tab>
        </TabList>
        <TabPanel value="account">Account content</TabPanel>
        <TabPanel value="password">Password content</TabPanel>
      </Tabs>,
    );

    await userEvent.click(screen.getByRole("tab", { name: "Password" }));

    expect(handleClick).toHaveBeenCalled();
  });

  it("merges a custom className on Tabs, TabList, Tab, and TabPanel", () => {
    render(
      <Tabs defaultValue="account" className="tabs-custom">
        <TabList className="tablist-custom">
          <Tab value="account" className="tab-custom">
            Account
          </Tab>
        </TabList>
        <TabPanel value="account" className="panel-custom">
          Account content
        </TabPanel>
      </Tabs>,
    );

    expect(screen.getByRole("tablist").className).toContain("tablist-custom");
    expect(screen.getByRole("tab").className).toContain("tab-custom");
    expect(screen.getByRole("tabpanel").className).toContain("panel-custom");

    const tabsRoot = screen.getByRole("tablist").parentElement;
    expect(tabsRoot?.className).toContain("tabs-custom");
  });

  it("forwards refs for TabList, Tab, and TabPanel", () => {
    const tabListRef = React.createRef<HTMLDivElement>();
    const tabRef = React.createRef<HTMLButtonElement>();
    const panelRef = React.createRef<HTMLDivElement>();

    render(
      <Tabs defaultValue="account">
        <TabList ref={tabListRef}>
          <Tab value="account" ref={tabRef}>
            Account
          </Tab>
        </TabList>
        <TabPanel value="account" ref={panelRef}>
          Account content
        </TabPanel>
      </Tabs>,
    );

    expect(tabListRef.current).toBeInstanceOf(HTMLDivElement);
    expect(tabRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(panelRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("throws when Tab is rendered outside of Tabs", () => {
    // Suppress the expected React error boundary console output for this test.
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Tab value="account">Account</Tab>)).toThrow(
      "<Tab /> must be used within a <Tabs> component.",
    );

    consoleErrorSpy.mockRestore();
  });

  it("throws when TabPanel is rendered outside of Tabs", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TabPanel value="account">Account content</TabPanel>)).toThrow(
      "<TabPanel /> must be used within a <Tabs> component.",
    );

    consoleErrorSpy.mockRestore();
  });
});
