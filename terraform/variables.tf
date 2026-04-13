variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, qa, stg, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "qa", "stg", "prod"], var.environment)
    error_message = "Environment must be one of: dev, qa, stg, prod"
  }
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "centralus"

  validation {
    condition     = contains(["centralus", "eastus2"], var.location)
    error_message = "Location must be a valid US Azure region"
  }
}

variable "resource_group_name" {
  description = "Resource group for the PostgreSQL server"
  type        = string
}

variable "server_name" {
  description = "Name of the PostgreSQL Flexible Server"
  type        = string
}

variable "db_admin_user" {
  description = "Admin username for the PostgreSQL server"
  type        = string
  default     = "backstage"
}

variable "db_admin_password" {
  description = "Admin password for the PostgreSQL server (from Delinea)"
  type        = string
  sensitive   = true
}

variable "sku_name" {
  description = "SKU for the PostgreSQL server (Burstable B1ms for dev/test)"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "postgres_version" {
  description = "PostgreSQL major version"
  type        = string
  default     = "16"
}

variable "storage_mb" {
  description = "Storage in MB for the PostgreSQL server"
  type        = number
  default     = 32768
}

# --- Networking ---

variable "vnet_name" {
  description = "Name of the existing VNet where AKS runs"
  type        = string
}

variable "vnet_resource_group" {
  description = "Resource group of the existing VNet"
  type        = string
}

variable "postgres_subnet_prefix" {
  description = "Address prefix for the PostgreSQL delegated subnet (must not overlap with existing subnets)"
  type        = string
  default     = "10.1.4.0/24"
}

# --- Key Vault ---

variable "key_vault_name" {
  description = "Key Vault to store DB credentials"
  type        = string
}

variable "key_vault_resource_group" {
  description = "Resource group of the Key Vault"
  type        = string
}

# --- Required Tags ---

variable "owner" {
  description = "Owner or team responsible for the resource"
  type        = string
}

variable "supported_by" {
  description = "Team or service responsible for support"
  type        = string
}

variable "requestor" {
  description = "Person or team who requested the resource"
  type        = string
}

variable "support_level" {
  description = "Support level (tier-1, tier-2, tier-3)"
  type        = string
  default     = "tier-2"
}

variable "department" {
  description = "Department owning the resource"
  type        = string
}

variable "additional_tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
