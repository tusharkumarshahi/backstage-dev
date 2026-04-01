# Azure Entra SSO Setup for Backstage

This guide explains how to integrate Microsoft Entra ID (Azure AD) SSO with this Backstage application.

## Scope and assumptions

- Local runtime: `docker compose` on `http://localhost:7007`
- AKS URL: not finalized yet, this guide uses `https://backstage.<your-domain>` as placeholder
- Auth model: single-tenant (organization users only)
- Guest login: kept temporarily as fallback
- Azure app registration: done by Azure admin team

---

## 0) What to request from Azure admin (prerequisites)

Send these requirements to your Azure admin team.

### App registration

1. Create a Microsoft Entra ID App Registration for Backstage.
2. Supported account type: **Single tenant** (organization users only).
3. Platform: **Web**.
4. Add redirect URIs:
   - Local: `http://localhost:7007/api/auth/microsoft/handler/frame`
   - AKS (when ready): `https://backstage.<your-domain>/api/auth/microsoft/handler/frame`
5. Front-channel logout URL: leave blank.
6. Implicit grant and hybrid flows: all unchecked.
7. Create a **client secret** (note the value, not the secret ID).

### API permissions (Delegated, Microsoft Graph)

The following delegated permissions must be added under **API permissions > Microsoft Graph**:

- `email`
- `offline_access`
- `openid`
- `profile`
- `User.Read`

Grant **admin consent** for these permissions so users don't need to individually consent on first login.

### Values to share securely with app team

- `Tenant ID` (Directory ID)
- `Client ID` (Application ID)
- `Client Secret` (value, not the secret ID)

### Optional (only if org/group sync is needed later)

- Additional Microsoft Graph permissions for users/groups
- Group claims in token

---

## 1) Code/config changes (already applied)

All changes below are already applied in the codebase. This section documents what was done for reference.

### 1.1 Backend provider module

File: `backstage/packages/backend/src/index.ts`

```ts
// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-microsoft-provider'));
```

### 1.2 Frontend sign-in page extension

**This is critical.** The new Backstage declarative frontend system does not automatically show auth providers on the sign-in page. You must create a custom `SignInPage` extension.

File: `backstage/packages/app/src/modules/signInPage/index.ts`

```ts
import { microsoftAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import { SignInPage } from '@backstage/core-components';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import React from 'react';

const signInPage = SignInPageBlueprint.make({
  params: {
    loader: async () => props =>
      React.createElement(SignInPage, {
        ...props,
        providers: [
          'guest',
          {
            id: 'microsoft-auth-provider',
            title: 'Microsoft',
            message: 'Sign in using Microsoft Entra ID',
            apiRef: microsoftAuthApiRef,
          },
        ],
      }),
  },
});

export const signInPageModule = createFrontendModule({
  pluginId: 'app',
  extensions: [signInPage],
});
```

Then wired into `backstage/packages/app/src/App.tsx`:

```ts
import { signInPageModule } from './modules/signInPage';

export default createApp({
  features: [
    // ... other plugins
    signInPageModule,
  ],
});
```

Without this, only the Guest login card appears on the sign-in page.

### 1.3 Auth config (development)

File: `backstage/app-config.yaml`

```yaml
auth:
  environment: development
  providers:
    guest: {}
    microsoft:
      development:
        clientId: ${AUTH_MICROSOFT_CLIENT_ID}
        clientSecret: ${AUTH_MICROSOFT_CLIENT_SECRET}
        tenantId: ${AUTH_MICROSOFT_TENANT_ID}
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityProfileEmail
```

### 1.4 Auth config (production)

File: `backstage/app-config.production.yaml`

```yaml
auth:
  environment: production
  providers:
    guest:
      dangerouslyAllowOutsideDevelopment: true
    microsoft:
      production:
        clientId: ${AUTH_MICROSOFT_CLIENT_ID}
        clientSecret: ${AUTH_MICROSOFT_CLIENT_SECRET}
        tenantId: ${AUTH_MICROSOFT_TENANT_ID}
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityProfileEmail
```

Keep guest for now as fallback. Remove it from production once SSO is stable.

### 1.5 Kubernetes secrets

File: `k8s/backstage-secret.yaml`

When Azure SSO credentials are available, add these base64-encoded values:

```yaml
data:
  AUTH_MICROSOFT_CLIENT_ID: "<base64>"
  AUTH_MICROSOFT_CLIENT_SECRET: "<base64>"
  AUTH_MICROSOFT_TENANT_ID: "<base64>"
```

---

## 2) Validation flow

### Local validation (Docker Compose)

```bash
cd backstage

# Build
yarn tsc
yarn build:backend
docker buildx build . -f packages/backend/Dockerfile --tag backstage-local:latest --load

# Run (with placeholder values if no real creds yet)
GITHUB_TOKEN=placeholder \
AUTH_MICROSOFT_CLIENT_ID=placeholder \
AUTH_MICROSOFT_CLIENT_SECRET=placeholder \
AUTH_MICROSOFT_TENANT_ID=placeholder \
docker compose up -d
```

Open `http://localhost:7007` and validate:

- Both **Guest** and **Microsoft** sign-in cards appear
- Guest fallback still works
- If real Azure creds are provided: Microsoft login redirects and returns to Backstage

```bash
docker compose logs -f backstage   # check for errors
docker compose down                # stop when done
```

### AKS validation

After deploying to AKS with real credentials:

1. Open the Backstage URL
2. Click "Sign in with Microsoft"
3. Authenticate with your organization account
4. Verify user identity in Settings/Profile

---

## 3) Network requirements

The Backstage backend must have outbound access to:

- `login.microsoftonline.com` — for OAuth authorization code exchange
- `graph.microsoft.com` — for fetching user profile information

If these are blocked, users will see `Authentication failed, failed to fetch user profile`.

---

## 4) Available resolvers

| Resolver | Matches on |
|---|---|
| `emailMatchingUserEntityProfileEmail` | Email → User entity `spec.profile.email` |
| `emailLocalPartMatchingUserEntityName` | Email local part → User entity `name` |
| `emailMatchingUserEntityAnnotation` | Email → `microsoft.com/email` annotation |
| `userIdMatchingUserEntityAnnotation` | User profile ID → `graph.microsoft.com/user-id` annotation |

We use `emailMatchingUserEntityProfileEmail` as default.

---

## 5) Common issues and fixes

- **Only Guest card shows on sign-in page**
  - The frontend `SignInPage` extension is missing. See section 1.2.
- **Redirect URI mismatch**
  - The callback URL in Entra app registration must exactly match `<baseUrl>/api/auth/microsoft/handler/frame`.
- **`client secret invalid`**
  - Use the secret **value** (not the secret ID). Check expiry date.
- **Login works but Backstage user missing**
  - The resolver can't find a matching `User` entity in the catalog. Ensure catalog has User entities with matching email addresses.
- **Works locally but fails on AKS**
  - Check that `app.baseUrl`, `backend.baseUrl`, and the Entra redirect URI all match.
  - Ensure the 3 Microsoft env vars are present in the pod.
- **`Authentication failed, failed to fetch user profile`**
  - Backstage backend can't reach `graph.microsoft.com`. Check network/firewall rules.

---

## 6) Suggested hardening (after initial success)

1. Remove guest provider from production config.
2. Add `domainHint: ${AUTH_MICROSOFT_TENANT_ID}` to reduce login friction for multi-tenant users.
3. Add group-based authorization using Microsoft Graph group claims.
4. Move to HTTPS with proper DNS and TLS certificates.
5. Document secret rotation procedure for the client secret.
