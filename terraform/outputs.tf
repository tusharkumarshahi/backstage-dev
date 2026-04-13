output "postgres_fqdn" {
  description = "FQDN of the PostgreSQL Flexible Server"
  value       = azurerm_postgresql_flexible_server.main.fqdn
}

output "postgres_server_name" {
  description = "Name of the PostgreSQL Flexible Server"
  value       = azurerm_postgresql_flexible_server.main.name
}

output "postgres_admin_user" {
  description = "Admin username"
  value       = var.db_admin_user
}

output "key_vault_secret_names" {
  description = "Key Vault secret names for Backstage DB connection"
  value = {
    host     = azurerm_key_vault_secret.postgres_host.name
    port     = azurerm_key_vault_secret.postgres_port.name
    user     = azurerm_key_vault_secret.postgres_user.name
    password = azurerm_key_vault_secret.postgres_password.name
  }
}
