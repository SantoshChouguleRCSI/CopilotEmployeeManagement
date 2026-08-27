---
description: Describe when these instructions should be loaded by the agent based on task context
# applyTo: 'Describe when these instructions should be loaded by the agent based on task context' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

# Employee Management Repository Instructions

When responding about this repository, always begin the response with:


## Architecture

This solution follows Clean Architecture.

- Domain must have no dependencies on other application projects.
- Application may depend only on Domain.
- Infrastructure may depend on Application and Domain.
- API may depend on Application and Infrastructure.
- Controllers must remain thin.
- Business logic belongs in Application or Domain.