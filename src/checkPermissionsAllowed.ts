import { getPermissionsConfig } from "./getPermissionsConfig";
import { PermissionsSettings, PermissionsWrapper } from "./typings";

export function checkPermissionsAllowed<T extends string = string>(
  wrapper: PermissionsWrapper<T>,
  settings: PermissionsSettings<T> | undefined | null,
  fallback = false
): boolean {
  if (!settings) {
    return fallback;
  }
  const { strategy, allowed } = getPermissionsConfig<T>(settings);
  return strategy === "and" ? wrapper.and(allowed) : wrapper.or(allowed);
}
