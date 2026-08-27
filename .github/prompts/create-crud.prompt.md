---
name: create-crud
description: Create a CRUD feature for an entity
agent: agent
---

Create a complete CRUD implementation for the requested entity.

Before making changes:

1. Inspect the existing repository structure.
2. Identify the Domain, Application, Infrastructure, and API projects.
3. Find an existing feature that can be used as a pattern.
4. Explain briefly which files need to be created or modified.

Then implement:

- Domain entity changes if required
- Application DTOs
- Application interfaces
- Application service/use-case logic
- Infrastructure persistence/repository changes
- API endpoints
- Dependency injection registrations
- Appropriate validation
- Error handling

Reuse existing conventions instead of introducing a new architecture.

Follow all repository and path-specific instruction files.

After implementation:

1. Build the backend.
2. Report compilation errors.
3. Fix errors caused by your changes.
4. Summarize the files created and modified.