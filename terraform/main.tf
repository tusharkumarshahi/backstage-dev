# ---------- Tags ----------

locals {
  tags = merge({
    owner         = var.owner
    supported_by  = var.supported_by
    requestor     = var.requestor
    support_level = var.support_level
    department    = var.department
    environment   = var.environment
    application   = "backstage"
    managed_by    = "terraform"
  }, var.additional_tags)
}

# ---------- Data Sources ----------

data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

data "azurerm_virtual_network" "main" {
  name                = var.vnet_name
  resource_group_name = var.vnet_resource_group
}

data "azurerm_key_vault" "main" {
  name                = var.key_vault_name
  resource_group_name = var.key_vault_resource_group
}

# ---------- Networking (VNet Integration) ----------

resource "azurerm_subnet" "postgres" {
  name                 = "snet-backstage-postgres"
  resource_group_name  = data.azurerm_virtual_network.main.resource_group_name
  virtual_network_name = data.azurerm_virtual_network.main.name
  address_prefixes     = [var.postgres_subnet_prefix]

  delegation {
    name = "postgresql-fs"
    service_delegation {
      name    = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }
}

resource "azurerm_private_dns_zone" "postgres" {
  name                = "backstage.postgres.database.azure.com"
  resource_group_name = data.azurerm_resource_group.main.name
  tags                = local.tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "postgres" {
  name                  = "backstage-postgres-vnet-link"
  private_dns_zone_name = azurerm_private_dns_zone.postgres.name
  resource_group_name   = data.azurerm_resource_group.main.name
  virtual_network_id    = data.azurerm_virtual_network.main.id
}

# ---------- PostgreSQL Flexible Server ----------

resource "azurerm_postgresql_flexible_server" "main" {
  name                          = var.server_name
  resource_group_name           = data.azurerm_resource_group.main.name
  location                      = data.azurerm_resource_group.main.location
  version                       = var.postgres_version
  administrator_login           = var.db_admin_user
  administrator_password        = var.db_admin_password
  sku_name                      = var.sku_name
  storage_mb                    = var.storage_mb
  backup_retention_days         = 7
  geo_redundant_backup_enabled  = false
  zone                          = "1"

  delegated_subnet_id = azurerm_subnet.postgres.id
  private_dns_zone_id = azurerm_private_dns_zone.postgres.id

  tags = local.tags

  depends_on = [azurerm_private_dns_zone_virtual_network_link.postgres]
}

# ---------- Store Credentials in Key Vault ----------

resource "azurerm_key_vault_secret" "postgres_host" {
  name         = "backstage-postgres-host"
  value        = azurerm_postgresql_flexible_server.main.fqdn
  key_vault_id = data.azurerm_key_vault.main.id
  tags         = local.tags
}

resource "azurerm_key_vault_secret" "postgres_port" {
  name         = "backstage-postgres-port"
  value        = "5432"
  key_vault_id = data.azurerm_key_vault.main.id
  tags         = local.tags
}

resource "azurerm_key_vault_secret" "postgres_user" {
  name         = "backstage-postgres-user"
  value        = var.db_admin_user
  key_vault_id = data.azurerm_key_vault.main.id
  tags         = local.tags
}

resource "azurerm_key_vault_secret" "postgres_password" {
  name         = "backstage-postgres-password"
  value        = var.db_admin_password
  key_vault_id = data.azurerm_key_vault.main.id
  tags         = local.tags
}
