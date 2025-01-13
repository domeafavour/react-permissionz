import React from "react";
import type { PermissionsWrapper } from "./typings";

export function createPermissionsContext<V extends string>() {
  return React.createContext<PermissionsWrapper<V> | null>(null);
}
