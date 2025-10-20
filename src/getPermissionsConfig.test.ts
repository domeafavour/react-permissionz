import { describe, it, expect } from "vitest";
import { getPermissionsConfig } from "./getPermissionsConfig";
import { PermissionsSettings } from "./typings";

describe("getPermissionsConfig", () => {
  it("should handle string input", () => {
    const result = getPermissionsConfig("read");

    expect(result).toEqual({
      allowed: ["read"],
      strategy: "and",
    });
  });

  it("should handle array input", () => {
    const settings: PermissionsSettings<string> = ["read", "write", "delete"];
    const result = getPermissionsConfig(settings);

    expect(result).toEqual({
      allowed: ["read", "write", "delete"],
      strategy: "and",
    });
  });

  it("should handle object input with strategy", () => {
    const settings: PermissionsSettings<string> = {
      allowed: ["read", "write"],
      strategy: "or",
    };
    const result = getPermissionsConfig(settings);

    expect(result).toEqual({
      allowed: ["read", "write"],
      strategy: "or",
    });
  });

  it("should handle object input without strategy (use default)", () => {
    const settings: PermissionsSettings<string> = {
      allowed: ["read", "write"],
    };
    const result = getPermissionsConfig(settings);

    expect(result).toEqual({
      allowed: ["read", "write"],
      strategy: "and",
    });
  });

  it("should handle empty array", () => {
    const settings: PermissionsSettings<string> = [];
    const result = getPermissionsConfig(settings);

    expect(result).toEqual({
      allowed: [],
      strategy: "and",
    });
  });

  it("should preserve generic type", () => {
    type CustomPermission = "READ_USER" | "WRITE_USER" | "DELETE_USER";
    const settings: PermissionsSettings<CustomPermission> = [
      "READ_USER",
      "WRITE_USER",
    ];
    const result = getPermissionsConfig<CustomPermission>(settings);

    expect(result).toEqual({
      allowed: ["READ_USER", "WRITE_USER"],
      strategy: "and",
    });
  });
});
