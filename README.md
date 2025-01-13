# React Permissionz

## Installation

```bash
npm install react-permissionz
```

## Usage

```tsx
import React from "react";
import { createPermissions } from "react-permissionz";

const { Permissions } = createPermissions({
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
});

// Page.tsx
function Page() {
  const permissions = Permissions.usePermissions();
  return (
    <div>
      {permissions.has(Permissions.consts.READ) ? (
        <button type="button">Read</button>
      ) : null}
      <Permissions checker={(p) => p.has(Permissions.consts.WRITE)}>
        <button type="button">Write</button>
      </Permissions>
      <Permissions.One allowed={Permissions.consts.DELETE}>
        <button type="button">Delete</button>
      </Permissions.One>
    </div>
  );
}

// App.tsx
function App() {
  const { data, isLoading, isError } = useMeQuery();
  return (
    <Permissions.Provider
      // null: not ready
      permissions={isLoading || isError ? null : data?.permissions ?? []}
    >
      <Page />
    </Permissions.Provider>
  );
}
```
