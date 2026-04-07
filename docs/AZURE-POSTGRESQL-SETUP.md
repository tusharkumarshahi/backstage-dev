# Azure Database for PostgreSQL Flexible Server — Backstage Integration

## Overview

Backstage uses PostgreSQL as its backing database. Each plugin creates its own database on the server (e.g. `backstage_plugin_catalog`, `backstage_plugin_auth`, etc.). This document covers how to connect Backstage to Azure Database for PostgreSQL Flexible Server, including SSL configuration and future Helm integration.

## Azure Flexible Server Requirements

- **PostgreSQL version:** 16 (recommended)
- **SKU:** Burstable B1ms is sufficient for dev/test; General Purpose for production
- **SSL:** Enabled by default — Backstage must connect with SSL
- **Firewall:** Allow access from AKS subnet or enable "Allow public access from any Azure service"
- **Admin user:** A dedicated user for Backstage (e.g. `backstage`)

## Backstage Configuration

### app-config.production.yaml

The database connection is configured under `backend.database`:

```yaml
backend:
  database:
    client: pg
    connection:
      host: ${POSTGRES_HOST}
      port: ${POSTGRES_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
      ssl:
        require: true
        rejectUnauthorized: false
```

**SSL is mandatory** for Azure Flexible Server. Without the `ssl` block, Backstage will fail with:

```
no pg_hba.conf entry for host "x.x.x.x", user "backstage", database "postgres", no encryption
```

### Environment Variables

| Variable | Example Value | Description |
|---|---|---|
| `POSTGRES_HOST` | `myserver.postgres.database.azure.com` | Azure server FQDN |
| `POSTGRES_PORT` | `5432` | Default PostgreSQL port |
| `POSTGRES_USER` | `backstage` | Admin or dedicated user |
| `POSTGRES_PASSWORD` | (secret) | User password |

## Databases Created by Backstage

On first startup, Backstage automatically creates these databases:

| Database | Plugin |
|---|---|
| `backstage_plugin_app` | App (frontend assets) |
| `backstage_plugin_auth` | Authentication |
| `backstage_plugin_catalog` | Software Catalog |
| `backstage_plugin_kubernetes` | Kubernetes plugin |
| `backstage_plugin_notifications` | Notifications |
| `backstage_plugin_permission` | Permission framework |
| `backstage_plugin_proxy` | Proxy |
| `backstage_plugin_scaffolder` | Software Templates |
| `backstage_plugin_search` | Search |
| `backstage_plugin_signals` | Signals (WebSocket) |
| `backstage_plugin_techdocs` | TechDocs |

The Backstage user needs `CREATEDB` privilege to create these databases on first run.

## Kubernetes Deployment (Current — Plain Manifests)

Currently, database credentials are passed via a Kubernetes Secret:

```yaml
# k8s/postgres-secret.yaml (values must be base64-encoded)
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secrets
  namespace: backstage
type: Opaque
data:
  POSTGRES_USER: ""       # echo -n 'backstage' | base64
  POSTGRES_PASSWORD: ""   # echo -n 'your-password' | base64
  POSTGRES_HOST: ""       # echo -n 'myserver.postgres.database.azure.com' | base64
  POSTGRES_PORT: NTQzMg== # 5432
```

The Backstage deployment references this secret via `envFrom`:

```yaml
envFrom:
  - secretRef:
      name: postgres-secrets
```

## Future — Helm Chart Integration

When migrating to Helm, the database configuration should be passed through `values.yaml`. Below is the recommended approach.

### values.yaml

```yaml
postgresql:
  enabled: false  # disable built-in PostgreSQL subchart

backstage:
  database:
    host: myserver.postgres.database.azure.com
    port: 5432
    user: backstage
    ssl:
      require: true
      rejectUnauthorized: false

  extraEnvVarsSecrets:
    - backstage-db-secret  # K8s secret containing POSTGRES_PASSWORD
```

### How Helm should pick up the values

The Helm chart should template `app-config.production.yaml` using these values:

```yaml
# templates/configmap.yaml (partial)
backend:
  database:
    client: pg
    connection:
      host: {{ .Values.backstage.database.host }}
      port: {{ .Values.backstage.database.port }}
      user: {{ .Values.backstage.database.user }}
      password: ${POSTGRES_PASSWORD}
      {{- if .Values.backstage.database.ssl }}
      ssl:
        require: {{ .Values.backstage.database.ssl.require }}
        rejectUnauthorized: {{ .Values.backstage.database.ssl.rejectUnauthorized }}
      {{- end }}
```

The password remains an environment variable injected from a Kubernetes Secret, not stored in the ConfigMap. This follows the pattern:

1. **Non-sensitive values** (host, port, user, SSL settings) → `values.yaml` → ConfigMap
2. **Sensitive values** (password) → Kubernetes Secret → env var → `${POSTGRES_PASSWORD}` substitution

### Creating the password secret

```bash
kubectl create secret generic backstage-db-secret \
  --from-literal=POSTGRES_PASSWORD='your-password' \
  -n backstage
```

Or via Helm values with an external secret manager (e.g. Azure Key Vault + CSI driver):

```yaml
# values.yaml
externalSecrets:
  enabled: true
  secretStore: azure-key-vault
  data:
    - secretKey: POSTGRES_PASSWORD
      remoteRef:
        key: backstage-db-password
```

## Testing Locally

To test the Azure PostgreSQL connection locally without modifying `docker-compose.yml`:

```bash
docker run --rm -p 7007:7007 \
  -e POSTGRES_HOST=myserver.postgres.database.azure.com \
  -e POSTGRES_PORT=5432 \
  -e POSTGRES_USER=backstage \
  -e POSTGRES_PASSWORD='your-password' \
  -e GITHUB_TOKEN=placeholder \
  -e AUTH_MICROSOFT_CLIENT_ID=placeholder \
  -e AUTH_MICROSOFT_CLIENT_SECRET=placeholder \
  -e AUTH_MICROSOFT_TENANT_ID=placeholder \
  backstage-local:latest
```

Do **not** use `docker compose up` for this test — the compose file has hardcoded values pointing to the local postgres container.

## Verified On

- **Azure Database for PostgreSQL Flexible Server**
- **Backstage v1.x** (backend-defaults with `pg` client)
- **SSL:** Required (Azure default)
- **Date:** April 2, 2026
- **Result:** All 11 plugin databases created successfully
