# React Permissionz

A flexible React library for managing permissions in your application with type-safe components and hooks.

## Installation

### npm

```bash
npm install react-permissionz
```

### yarn

```bash
yarn add react-permissionz
```

### pnpm

```bash
pnpm add react-permissionz
```

## Features

- 🎯 **Type-safe**: Full TypeScript support with type inference
- 🔧 **Flexible**: Multiple ways to check permissions (AND, OR, single)
- ⚡ **Performance**: Uses React Context with optimized re-renders
- 🛡️ **Safe**: Built-in warnings for unexpected permissions
- 📦 **Small**: Lightweight with no external dependencies
- ✅ **Tested**: Comprehensive test coverage

## Quick Start

```tsx
import React from "react";
import { createPermissions } from "react-permissionz";

// Define your permission constants
const { Permissions } = createPermissions({
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
});

// Component using permissions
function Page() {
  const permissions = Permissions.usePermissions();
  
  return (
    <div>
      {/* Single permission check */}
      <Permissions.One allowed={Permissions.consts.READ}>
        <button>Read</button>
      </Permissions.One>
      
      {/* Component-based permission check */}
      <Permissions checker={(p) => p.has(Permissions.consts.WRITE)}>
        <button>Write</button>
      </Permissions>
      
      {/* Direct hook usage */}
      {permissions.has(Permissions.consts.DELETE) && (
        <button>Delete</button>
      )}
    </div>
  );
}

// App with provider
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

## API Reference

### `createPermissions(consts, options?)`

Creates a permission system with the provided constants.

#### Parameters

- `consts`: Object with permission constants (keys become the constant names, values are the permission strings)
- `options?`: Optional configuration object
  - `renderFallback?`: Default fallback component when permissions don't match (default: `null`)

#### Returns

An object containing:

- `Permissions`: Main permission component with attached methods
- `usePermissions`: Hook to access permission state
- `PermissionsProvider`: Provider component
- `PermissionsConsumer`: Consumer component

### Permission Components

#### `<Permissions checker={fn} fallback?>`

Generic permission checker component.

```tsx
<Permissions 
  checker={(p) => p.has('read') && p.or(['write', 'admin'])}
  fallback={<div>Access denied</div>}
>
  <SecretContent />
</Permissions>
```

#### `<Permissions.One allowed={permission} fallback?>`

Check for a single permission.

```tsx
<Permissions.One allowed="admin" fallback={<div>Admin only</div>}>
  <AdminPanel />
</Permissions.One>
```

#### `<Permissions.Or allowed={permissions[]} fallback?>`

Check if user has ANY of the specified permissions.

```tsx
<Permissions.Or allowed={['read', 'write']} fallback={<div>No access</div>}>
  <Content />
</Permissions.Or>
```

#### `<Permissions.And allowed={permissions[]} fallback?>`

Check if user has ALL of the specified permissions.

```tsx
<Permissions.And allowed={['read', 'write']} fallback={<div>Need both permissions</div>}>
  <AdvancedContent />
</Permissions.And>
```

### Hooks

#### `Permissions.usePermissions()`

Hook to access the permission wrapper object.

```tsx
const permissions = Permissions.usePermissions();

// Check single permission
permissions.has('read') // boolean

// Check multiple permissions (AND)
permissions.and(['read', 'write']) // boolean

// Check multiple permissions (OR) 
permissions.or(['read', 'write']) // boolean

// Get all permissions
permissions.all() // string[]

// Check if permissions are loaded
permissions.isReady // boolean
```

### Provider

#### `<Permissions.Provider permissions={permissions}>`

Provides permission context to child components.

- `permissions`: Array of permission strings, or `null` when loading

```tsx
<Permissions.Provider permissions={['read', 'write']}>
  <App />
</Permissions.Provider>
```

## Utility Functions

### `checkPermissionsAllowed(wrapper, settings, fallback?)`

Utility function to check permissions programmatically.

```tsx
import { checkPermissionsAllowed } from 'react-permissionz';

const isAllowed = checkPermissionsAllowed(
  permissionWrapper,
  'read', // or ['read', 'write'] or { allowed: ['read'], strategy: 'and' }
  false // fallback value
);
```

### `getPermissionsConfig(settings)`

Normalizes permission settings to a standard config object.

```tsx
import { getPermissionsConfig } from 'react-permissionz';

// All of these return: { allowed: ['read'], strategy: 'and' }
getPermissionsConfig('read');
getPermissionsConfig(['read']);  
getPermissionsConfig({ allowed: ['read'], strategy: 'and' });
```

## Advanced Usage

### Custom Fallback

Set a default fallback for all permission components:

```tsx
const { Permissions } = createPermissions(
  { READ: 'read', WRITE: 'write' },
  { renderFallback: <div>Access Denied</div> }
);
```

### Loading States

Handle loading states by passing `null` to the provider:

```tsx
<Permissions.Provider permissions={isLoading ? null : userPermissions}>
  <App />
</Permissions.Provider>
```

### Permission Warnings

The library automatically warns in development when unexpected permissions are provided:

```tsx
// If you defined { READ: 'read' } but pass ['read', 'admin']
// Console warning: "Unexpected permissions: admin."
<Permissions.Provider permissions={['read', 'admin']}>
  <App />
</Permissions.Provider>
```

## TypeScript

The library is fully typed and provides excellent TypeScript support:

```tsx
const { Permissions } = createPermissions({
  READ: 'read',
  WRITE: 'write',
} as const); // Use 'as const' for better type inference

// Permissions.consts.READ is typed as 'read'
// Permissions.consts.WRITE is typed as 'write'
```

## License

MIT
