---
description: Review the .NET backend for Clean Architecture and code-quality violations without modifying files
agent: Backend Reviewer
---

Review the backend implementation of this repository.

This is a READ-ONLY review.

Do not create files.
Do not modify files.
Do not delete files.
Do not run migrations.
Do not make automatic fixes.

Before reviewing:

1. Read the repository-level Copilot instructions.
2. Read all applicable backend instruction files.
3. Inspect the backend project structure.
4. Identify the Domain, Application, Infrastructure, and API projects.
5. Inspect the relevant `.csproj` project references.
6. Review representative files from each layer.

Review the backend for the following areas.

## 1. Clean Architecture dependencies

Verify that dependencies flow inward.

Expected rules:

- Domain must not depend on Application, Infrastructure, or API.
- Application may depend on Domain only.
- Infrastructure may depend on Application and Domain.
- API may depend on Application and Infrastructure.
- Business logic must not depend directly on infrastructure concerns.

Report any violation with:

- File/project
- Violation
- Why it is a problem
- Recommended correction

## 2. Domain layer

Check whether:

- Entities contain appropriate domain behaviour.
- Domain entities are not simple anemic data containers where business behaviour belongs in the entity.
- Domain does not contain EF Core, ASP.NET Core, SQL, HTTP, or infrastructure dependencies.
- Entity invariants are protected where appropriate.
- Domain objects do not expose unnecessary public setters.

## 3. Application layer

Check whether:

- Use-case/business logic lives in Application or Domain.
- Application does not depend on Infrastructure.
- Repository abstractions are defined in an appropriate inward layer.
- DTOs are used appropriately.
- Requests and responses are clearly separated where useful.
- Services have clear responsibilities.
- Async operations use async/await correctly.
- CancellationToken is used where appropriate.
- Application services are not performing infrastructure-specific work.

## 4. Infrastructure layer

Check whether:

- EF Core implementation remains inside Infrastructure.
- DbContext is not exposed unnecessarily to Application or API.
- Repository implementations correctly implement Application abstractions.
- Entity configurations are separated appropriately.
- Dependency injection registrations are correct.
- Database concerns do not leak into Domain.

## 5. API layer

Check whether:

- Controllers remain thin.
- Controllers delegate business operations to Application services.
- Controllers do not access DbContext directly.
- Controllers do not implement business rules.
- HTTP status codes are appropriate.
- Request validation is handled consistently.
- Exceptions and error responses are handled consistently.
- API models do not unnecessarily expose persistence entities.

## 6. Dependency injection

Check:

- Application service registrations.
- Repository registrations.
- Correct service lifetimes.
- Missing registrations.
- Duplicate registrations.
- Dependencies that violate Clean Architecture.

## 7. Code quality

Look for:

- Duplicate logic
- Unnecessary classes
- Dead code
- Poor naming
- Large methods
- Large classes
- Excessive coupling
- Magic strings/numbers
- Missing null handling
- Incorrect async usage
- `.Result` or `.Wait()` on Tasks
- Unnecessary static state
- Exception swallowing
- Empty catch blocks

## 8. Security

Look for obvious backend security issues including:

- SQL injection risks
- Unsafe raw SQL
- Missing authorization on sensitive endpoints
- Sensitive information in logs
- Hard-coded secrets
- Over-posting / mass assignment risks
- Excessive exception details returned through the API
- Missing input validation

Do not perform a full penetration test.

## 9. Testing

Inspect the existing test projects if present.

Report:

- Important business logic without tests
- Missing service tests
- Missing repository/integration tests where appropriate
- Important API behaviour without tests

Do not create tests during this review.

## 10. Build validation

After the static review, run the backend build if terminal access is available.

Use:

`dotnet build`

Do not fix build errors automatically.

If the build fails, report the errors separately.

## Output format

Produce the review using these severity levels:

- CRITICAL
- HIGH
- MEDIUM
- LOW
- GOOD

Start with an executive summary.

Then provide a table:

| Severity | Area | File | Finding | Recommendation |
|----------|------|------|---------|----------------|

After the findings, provide:

### Architecture Assessment

State whether the backend currently follows Clean Architecture:

- PASS
- PASS WITH ISSUES
- FAIL

Explain the reasoning.

### Top 5 Recommended Improvements

Rank the five most valuable improvements.

### What Is Already Good

Highlight important practices that are already implemented correctly.

### Build Result

Report:

- Build succeeded, or
- Build failed with the relevant errors.

Do not modify the repository.

End by asking whether the user wants the identified issues fixed in a separate implementation task.

## Review discipline

Distinguish clearly between:

- Definite rule violation
- Likely defect
- Security risk
- Performance concern
- Design suggestion
- Optional improvement

Do not classify an architectural pattern as required unless it is explicitly required by repository instructions.

For example:
- Do not require Unit of Work merely because repositories exist.
- Do not require a foreign-key relationship unless the domain model clearly requires one.
- Do not assume authentication is mandatory for a sample/demo API unless deployment/security requirements say so.

When evidence is insufficient, say:
"Needs confirmation"
rather than presenting the finding as fact.