import { describe, it, expect } from "vitest";
import { createPermissionsWrapper } from "./createWrapper";

describe("createPermissionsWrapper", () => {
  it("should return an object with the correct methods and properties", () => {
    const permissions = ["read", "write"];
    const wrapper = createPermissionsWrapper(permissions);

    expect(wrapper).toHaveProperty("has");
    expect(wrapper).toHaveProperty("and");
    expect(wrapper).toHaveProperty("or");
    expect(wrapper).toHaveProperty("all");
    expect(wrapper).toHaveProperty("isReady");
  });

  it("should correctly check if a permission exists", () => {
    const permissions = ["read", "write"];
    const wrapper = createPermissionsWrapper(permissions);

    expect(wrapper.has("read")).toBe(true);
    expect(wrapper.has("write")).toBe(true);
    expect(wrapper.has("delete")).toBe(false);
  });

  it("should correctly check if all permissions are allowed", () => {
    const permissions = ["read", "write"];
    const wrapper = createPermissionsWrapper(permissions);

    expect(wrapper.and(["read", "write"])).toBe(true);
    expect(wrapper.and(["read", "delete"])).toBe(false);
    expect(wrapper.and([])).toBe(true);
  });

  it("should correctly check if any permission is allowed", () => {
    const permissions = ["read", "write"];
    const wrapper = createPermissionsWrapper(permissions);

    expect(wrapper.or(["read", "delete"])).toBe(true);
    expect(wrapper.or(["delete", "update"])).toBe(false);
    expect(wrapper.or([])).toBe(false);
  });

  it("should return all permissions as a list", () => {
    const wrapper = createPermissionsWrapper(["read", "write"]);

    expect(wrapper.all()).toEqual(["read", "write"]);
  });

  it("should correctly indicate if permissions are ready", () => {
    const wrapperWithPermissions = createPermissionsWrapper(["read", "write"]);
    const wrapperWithoutPermissions = createPermissionsWrapper(null);

    expect(wrapperWithPermissions.isReady).toBe(true);
    expect(wrapperWithoutPermissions.isReady).toBe(false);
  });
});
