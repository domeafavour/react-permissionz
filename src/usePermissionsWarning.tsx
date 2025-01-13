import { useEffect } from "react";

export function usePermissionsWarning<T extends string>(provided: T[], permissions: T[] | null) {
  useEffect(() => {
    if (permissions) {
      const unExpectedPermissions = permissions.filter((value) => !provided.includes(value));
      if (unExpectedPermissions.length) {
        console.warn(`Unexpected permissions: ${unExpectedPermissions.join(", ")}.`);
      }
    }
  }, [permissions, provided]);
}
