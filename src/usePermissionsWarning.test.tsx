import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePermissionsWarning } from "./usePermissionsWarning";

describe("usePermissionsWarning", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should not warn when permissions are null", () => {
    renderHook(() => usePermissionsWarning(["read", "write"], null));
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("should not warn when all permissions are provided", () => {
    renderHook(() => usePermissionsWarning(["read", "write"], ["read"]));
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("should warn when there are unexpected permissions", () => {
    renderHook(() => usePermissionsWarning(["read"], ["read", "write"]));
    expect(console.warn).toHaveBeenCalledWith("Unexpected permissions: write.");
  });

  it("should warn with multiple unexpected permissions", () => {
    renderHook(() =>
      usePermissionsWarning(["read"], ["read", "write", "execute"])
    );
    expect(console.warn).toHaveBeenCalledWith(
      "Unexpected permissions: write, execute."
    );
  });
});
