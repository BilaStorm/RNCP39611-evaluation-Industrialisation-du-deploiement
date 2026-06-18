# =============================================================================
# LOCALS
# =============================================================================
locals {
  common_tags = {
    project    = "sanctuaire-sante"
    environment = var.environment
    managed_by  = "terraform"
  }
}

# =============================================================================
# OUTPUTS — Valeurs à stocker dans GitHub Actions Secrets après terraform apply
# =============================================================================

output "resource_group_name" {
  description = "Nom du Resource Group"
  value       = azurerm_resource_group.main.name
}

output "acr_login_server" {
  description = "URL de l'ACR → GitHub Secret: ACR_LOGIN_SERVER"
  value       = module.acr.acr_login_server
}

output "frontend_url" {
  description = "URL publique du frontend Sanctuaire Santé"
  value       = module.container_apps.frontend_url
}

output "backend_url" {
  description = "URL interne du backend (dans l'environnement Container Apps)"
  value       = module.container_apps.backend_url
}

output "service_principal_client_id" {
  description = "SP Client ID → GitHub Secret: AZURE_CLIENT_ID"
  value       = module.service_principal.client_id
}

output "service_principal_client_secret" {
  description = "SP Client Secret → GitHub Secret: AZURE_CLIENT_SECRET"
  value       = module.service_principal.client_secret
  sensitive   = true
}

output "github_secrets_summary" {
  description = "Récapitulatif des secrets à configurer dans GitHub"
  value = <<-EOT
    ┌─────────────────────────────────────────────────────────────────┐
    │  GitHub Actions Secrets à configurer                            │
    ├─────────────────────────┬───────────────────────────────────────┤
    │  AZURE_CLIENT_ID        │  ${module.service_principal.client_id}
    │  AZURE_CLIENT_SECRET    │  (terraform output -raw service_principal_client_secret)
    │  AZURE_TENANT_ID        │  (az account show --query tenantId -o tsv)
    │  AZURE_SUBSCRIPTION_ID  │  (az account show --query id -o tsv)
    │  ACR_LOGIN_SERVER       │  ${module.acr.acr_login_server}
    └─────────────────────────┴───────────────────────────────────────┘
  EOT
}
