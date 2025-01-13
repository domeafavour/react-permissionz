import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { createPermissions } from "./createPermissions";

const permissionsConsts = {
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
} as const;

describe("createPermissions", () => {
  beforeEach(() => {
    cleanup();
  });

  const { Permissions, PermissionsProvider, usePermissions } =
    createPermissions(permissionsConsts);

  it("should throw error if usePermissions is used outside of PermissionsProvider", () => {
    const TestComponent = () => {
      usePermissions();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow(
      "`Permissions.usePermissions` must be used within a `Permissions.Provider`"
    );
  });

  it("should render children if permissions match", () => {
    const TestComponent = () => (
      <PermissionsProvider permissions={["read"]}>
        <Permissions checker={(p) => p.has("read")}>
          <div data-testid="read-permission">Has Read Permission</div>
        </Permissions>
      </PermissionsProvider>
    );

    render(<TestComponent />);
    expect(screen.getByTestId("read-permission")).toBeTruthy();
  });

  it("should render fallback if permissions do not match", () => {
    const TestComponent = () => (
      <PermissionsProvider permissions={["read"]}>
        <Permissions
          checker={(p) => p.has("write")}
          fallback={
            <div data-testid="no-write-permission">No Write Permission</div>
          }
        >
          <div>Has Write Permission</div>
        </Permissions>
      </PermissionsProvider>
    );

    render(<TestComponent />);
    expect(screen.getByTestId("no-write-permission")).toBeTruthy();
  });

  it("should render children if any permission matches in Permissions.Or", () => {
    const TestComponent = () => (
      <PermissionsProvider permissions={["read"]}>
        <Permissions.Or allowed={["read", "write"]}>
          <div data-testid="read-or-write-permission">
            Has Read or Write Permission
          </div>
        </Permissions.Or>
      </PermissionsProvider>
    );

    render(<TestComponent />);
    expect(screen.getByTestId("read-or-write-permission")).toBeTruthy();
  });

  it("should render children if all permissions match in Permissions.And", () => {
    const TestComponent = () => (
      <PermissionsProvider permissions={["read", "write"]}>
        <Permissions.And allowed={["read", "write"]}>
          <div data-testid="read-and-write-permission">
            Has Read and Write Permission
          </div>
        </Permissions.And>
      </PermissionsProvider>
    );

    render(<TestComponent />);
    expect(screen.getByTestId("read-and-write-permission")).toBeTruthy();
  });

  it("should render children if single permission matches in Permissions.One", () => {
    const TestComponent = () => (
      <PermissionsProvider permissions={["read"]}>
        <Permissions.One allowed="read">
          <div data-testid="one-read-permission">Has Read Permission</div>
        </Permissions.One>
      </PermissionsProvider>
    );

    render(<TestComponent />);
    expect(screen.getByTestId("one-read-permission")).toBeTruthy();
  });
});
