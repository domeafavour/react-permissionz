import type React from "react";
import { useContext, useMemo } from "react";
import { createPermissionsContext } from "./createPermissionsContext";
import { createPermissionsWrapper } from "./createWrapper";
import type { CreatePermissionsOptions, PermissionsChecker } from "./typings";
import { usePermissionsWarning } from "./usePermissionsWarning";

export function createPermissions<
  V extends string,
  T extends Record<string, V>
>(consts: T, options?: CreatePermissionsOptions) {
  const { renderFallback = null } = options || {};
  type PermissionValue = T[keyof T];
  const PermissionsContext = createPermissionsContext<PermissionValue>();

  function usePermissions() {
    const ctx = useContext(PermissionsContext);
    if (!ctx) {
      throw new Error(
        "`Permissions.usePermissions` must be used within a `Permissions.Provider`"
      );
    }
    return ctx;
  }

  const provided = Object.values(consts) as PermissionValue[];

  function PermissionsProvider({
    permissions,
    children,
  }: React.PropsWithChildren<{ permissions: PermissionValue[] | null }>) {
    usePermissionsWarning(provided, permissions);

    return (
      <PermissionsContext.Provider
        value={useMemo(
          () => createPermissionsWrapper<PermissionValue>(permissions),
          [permissions]
        )}
      >
        {children}
      </PermissionsContext.Provider>
    );
  }

  function Permissions({
    children,
    checker,
    fallback = renderFallback,
  }: {
    checker: PermissionsChecker<PermissionValue>;
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }): React.ReactNode {
    return checker(usePermissions()) ? children : fallback;
  }

  Permissions.Or = function PermissionsOr({
    children,
    allowed,
    fallback = renderFallback,
  }: {
    allowed: PermissionValue[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    return (
      <Permissions checker={(p) => p.or(allowed)} fallback={fallback}>
        {children}
      </Permissions>
    );
  };

  Permissions.And = function PermissionsAnd({
    children,
    allowed,
    fallback,
  }: {
    allowed: PermissionValue[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    return (
      <Permissions checker={(p) => p.and(allowed)} fallback={fallback}>
        {children}
      </Permissions>
    );
  };

  Permissions.One = function PermissionsOne({
    children,
    allowed,
    fallback,
  }: {
    allowed: PermissionValue;
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    return (
      <Permissions checker={(p) => p.has(allowed)} fallback={fallback}>
        {children}
      </Permissions>
    );
  };

  Permissions.consts = Object.freeze(consts);
  Permissions.usePermissions = usePermissions;
  Permissions.Provider = PermissionsProvider;
  Permissions.Consumer = PermissionsContext.Consumer;

  return {
    Permissions,
    usePermissions,
    PermissionsProvider,
    PermissionsConsumer: PermissionsContext.Consumer,
  };
}
