---
applyTo: "src/backend/**/*.cs"
---

# Backend Instructions

- Follow Clean Architecture.
- Keep controllers thin.
- Business logic belongs in Application or Domain.
- Use dependency injection.
- Do not access EF Core directly from controllers.
- Application must not depend on Infrastructure.