import type React from "react";

export interface PermissionsWrapper<T> {
  has: (value: T) => boolean;
  and: (allowed: T[]) => boolean;
  or: (allowed: T[]) => boolean;
  all: () => T[];
  isReady: boolean;
}

export type PermissionsChecker<V extends string> = (permissions: PermissionsWrapper<V>) => boolean;

export type CreatePermissionsOptions = {
  renderFallback?: React.ReactNode;
};
