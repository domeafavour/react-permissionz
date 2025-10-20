import type React from "react";

export interface PermissionsWrapper<T> {
  has: (value: T) => boolean;
  and: (allowed: T[]) => boolean;
  or: (allowed: T[]) => boolean;
  all: () => T[];
  isReady: boolean;
}

export type PermissionsChecker<V extends string> = (
  permissions: PermissionsWrapper<V>
) => boolean;

export type CreatePermissionsOptions = {
  renderFallback?: React.ReactNode;
};

export type PermissionsCheckStrategy = "or" | "and";

export interface PermissionsConfig<T extends string = string> {
  allowed: T[];
  /** @default "all" */
  strategy?: PermissionsCheckStrategy;
}

export type PermissionsSettings<T extends string> =
  | T
  | T[]
  | PermissionsConfig<T>;
