import {
  PermissionsCheckStrategy,
  PermissionsConfig,
  PermissionsSettings,
} from "./typings";

const DEFAULT_PERMISSION_STRATEGY: PermissionsCheckStrategy = "and";

export function getPermissionsConfig<T extends string = string>(
  settings: PermissionsSettings<T>
): PermissionsConfig<T> {
  if (typeof settings === "string") {
    return { allowed: [settings], strategy: DEFAULT_PERMISSION_STRATEGY };
  }

  if (Array.isArray(settings)) {
    return { allowed: settings as T[], strategy: DEFAULT_PERMISSION_STRATEGY };
  }

  return {
    strategy: settings.strategy || DEFAULT_PERMISSION_STRATEGY,
    allowed: settings.allowed,
  };
}
