# =============================================================================
# MAIN — Point d'entrée Terraform · Sanctuaire Santé
# Orchestre : Resource Group · ACR · Service Principal · Container Apps
# =============================================================================

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.48"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
    time = {
      source  = "hashicorp/time"
      version = "~> 0.11"
    }
  }

  # ── Remote state (décommenter pour la prod) ────────────────────────────────
  # backend "azurerm" {
  #   resource_group_name  = "rg-tfstate"
  #   storage_account_name = "stsssantetfstate"
  #   container_name       = "tfstate"
  #   key                  = "${var.environment}.terraform.tfstate"
  # }
}

provider "azurerm" {
  features {}
  # Credentials via variables d'environnement :
  # ARM_CLIENT_ID · ARM_CLIENT_SECRET · ARM_TENANT_ID · ARM_SUBSCRIPTION_ID
}

provider "azuread" {}

# =============================================================================
# RESOURCE GROUP
# =============================================================================
resource "azurerm_resource_group" "main" {
  name     = "rg-sanctuairesante-${var.environment}"
  location = var.location
  tags     = local.common_tags
}

# =============================================================================
# MODULE · Azure Container Registry
# =============================================================================
module "acr" {
  source = "./modules/acr"

  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  environment         = var.environment
  sku                 = var.acr_sku
  tags                = local.common_tags
}

# =============================================================================
# MODULE · Service Principal CI/CD
# =============================================================================
module "service_principal" {
  source = "./modules/service-principal"

  environment     = var.environment
  acr_registry_id = module.acr.acr_id
}

# =============================================================================
# MODULE · Container Apps (frontend + backend + PostgreSQL)
# =============================================================================
module "container_apps" {
  source = "./modules/container-apps"

  resource_group_name  = azurerm_resource_group.main.name
  location             = azurerm_resource_group.main.location
  environment          = var.environment
  acr_login_server     = module.acr.acr_login_server
  acr_admin_username   = module.acr.acr_admin_username
  acr_admin_password   = module.acr.acr_admin_password
  frontend_image_tag   = var.frontend_image_tag
  backend_image_tag    = var.backend_image_tag
  postgres_password    = var.postgres_password
  tags                 = local.common_tags
}