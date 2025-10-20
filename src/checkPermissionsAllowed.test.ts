import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkPermissionsAllowed } from "./checkPermissionsAllowed";
import { PermissionsWrapper, PermissionsSettings } from "./typings";

describe("checkPermissionsAllowed", () => {
  const mockWrapper: PermissionsWrapper<string> = {
    has: vi.fn(),
    and: vi.fn(),
    or: vi.fn(),
    all: vi.fn(),
    isReady: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return fallback value when settings is undefined", () => {
    const result = checkPermissionsAllowed(mockWrapper, undefined, true);
    expect(result).toBe(true);
  });

  it("should return fallback value when settings is null", () => {
    const result = checkPermissionsAllowed(mockWrapper, null, false);
    expect(result).toBe(false);
  });

  it("should return default fallback (false) when settings is undefined and no fallback provided", () => {
    const result = checkPermissionsAllowed(mockWrapper, undefined);
    expect(result).toBe(false);
  });

  it('should call wrapper.and when strategy is "and" (default strategy)', () => {
    const settings: PermissionsSettings<string> = {
      allowed: ["read", "write"],
    };

    (mockWrapper.and as any).mockReturnValue(true);

    const result = checkPermissionsAllowed(mockWrapper, settings);

    expect(mockWrapper.and).toHaveBeenCalledWith(["read", "write"]);
    expect(result).toBe(true);
  });

  it('should call wrapper.and when strategy is explicitly set to "and"', () => {
    const settings: PermissionsSettings<string> = {
      allowed: ["read", "write"],
      strategy: "and",
    };

    (mockWrapper.and as any).mockReturnValue(true);

    const result = checkPermissionsAllowed(mockWrapper, settings);

    expect(mockWrapper.and).toHaveBeenCalledWith(["read", "write"]);
    expect(result).toBe(true);
  });

  it('should call wrapper.or when strategy is "or"', () => {
    const settings: PermissionsSettings<string> = {
      allowed: ["read", "write"],
      strategy: "or",
    };

    (mockWrapper.or as any).mockReturnValue(false);

    const result = checkPermissionsAllowed(mockWrapper, settings);

    expect(mockWrapper.or).toHaveBeenCalledWith(["read", "write"]);
    expect(result).toBe(false);
  });

  it("should handle wrapper.and returning false", () => {
    const settings: PermissionsSettings<string> = { 
      allowed: ["read"] 
    };

    (mockWrapper.and as any).mockReturnValue(false);

    const result = checkPermissionsAllowed(mockWrapper, settings);

    expect(result).toBe(false);
  });

  it("should handle wrapper.or returning true", () => {
    const settings: PermissionsSettings<string> = { 
      allowed: ["read"],
      strategy: "or"
    };

    (mockWrapper.or as any).mockReturnValue(true);

    const result = checkPermissionsAllowed(mockWrapper, settings);

    expect(result).toBe(true);
  });

  it("should handle string permission setting", () => {
    const settings: PermissionsSettings<string> = "read";

    (mockWrapper.and as any).mockReturnValue(true);

    const result = checkPermissionsAllowed(mockWrapper, settings);

    expect(mockWrapper.and).toHaveBeenCalledWith(["read"]);
    expect(result).toBe(true);
  });

  it("should handle array permission setting", () => {
    const settings: PermissionsSettings<string> = ["read", "write"];

    (mockWrapper.and as any).mockReturnValue(false);

    const result = checkPermissionsAllowed(mockWrapper, settings);

    expect(mockWrapper.and).toHaveBeenCalledWith(["read", "write"]);
    expect(result).toBe(false);
  });
});
