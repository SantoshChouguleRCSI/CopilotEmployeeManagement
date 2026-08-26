$ErrorActionPreference = "Stop"
Set-Location C:\Projects\CopilotEmployeeManagement

Write-Host "Creating Solution..."
dotnet new sln -n EmployeeManagement

Write-Host "Creating EmployeeManagement.Domain..."
dotnet new classlib -n EmployeeManagement.Domain -o src/backend/EmployeeManagement.Domain --framework net9.0

Write-Host "Creating EmployeeManagement.Application..."
dotnet new classlib -n EmployeeManagement.Application -o src/backend/EmployeeManagement.Application --framework net9.0

Write-Host "Creating EmployeeManagement.Infrastructure..."
dotnet new classlib -n EmployeeManagement.Infrastructure -o src/backend/EmployeeManagement.Infrastructure --framework net9.0

Write-Host "Creating EmployeeManagement.Api..."
dotnet new webapi -n EmployeeManagement.Api -o src/backend/EmployeeManagement.Api --framework net9.0

Write-Host "Creating EmployeeManagement.UnitTests..."
dotnet new xunit -n EmployeeManagement.UnitTests -o tests/EmployeeManagement.UnitTests --framework net9.0

Write-Host "Creating EmployeeManagement.IntegrationTests..."
dotnet new xunit -n EmployeeManagement.IntegrationTests -o tests/EmployeeManagement.IntegrationTests --framework net9.0

Write-Host "Adding projects to solution..."
dotnet sln add src/backend/EmployeeManagement.Domain/EmployeeManagement.Domain.csproj --solution-folder src/backend
dotnet sln add src/backend/EmployeeManagement.Application/EmployeeManagement.Application.csproj --solution-folder src/backend
dotnet sln add src/backend/EmployeeManagement.Infrastructure/EmployeeManagement.Infrastructure.csproj --solution-folder src/backend
dotnet sln add src/backend/EmployeeManagement.Api/EmployeeManagement.Api.csproj --solution-folder src/backend
dotnet sln add tests/EmployeeManagement.UnitTests/EmployeeManagement.UnitTests.csproj --solution-folder tests
dotnet sln add tests/EmployeeManagement.IntegrationTests/EmployeeManagement.IntegrationTests.csproj --solution-folder tests

Write-Host "Adding project references..."
dotnet add src/backend/EmployeeManagement.Application/EmployeeManagement.Application.csproj reference src/backend/EmployeeManagement.Domain/EmployeeManagement.Domain.csproj
dotnet add src/backend/EmployeeManagement.Infrastructure/EmployeeManagement.Infrastructure.csproj reference src/backend/EmployeeManagement.Domain/EmployeeManagement.Domain.csproj
dotnet add src/backend/EmployeeManagement.Infrastructure/EmployeeManagement.Infrastructure.csproj reference src/backend/EmployeeManagement.Application/EmployeeManagement.Application.csproj
dotnet add src/backend/EmployeeManagement.Api/EmployeeManagement.Api.csproj reference src/backend/EmployeeManagement.Application/EmployeeManagement.Application.csproj
dotnet add src/backend/EmployeeManagement.Api/EmployeeManagement.Api.csproj reference src/backend/EmployeeManagement.Infrastructure/EmployeeManagement.Infrastructure.csproj

Write-Host "Adding test project references..."
dotnet add tests/EmployeeManagement.UnitTests/EmployeeManagement.UnitTests.csproj reference src/backend/EmployeeManagement.Domain/EmployeeManagement.Domain.csproj
dotnet add tests/EmployeeManagement.UnitTests/EmployeeManagement.UnitTests.csproj reference src/backend/EmployeeManagement.Application/EmployeeManagement.Application.csproj
dotnet add tests/EmployeeManagement.IntegrationTests/EmployeeManagement.IntegrationTests.csproj reference src/backend/EmployeeManagement.Api/EmployeeManagement.Api.csproj
dotnet add tests/EmployeeManagement.IntegrationTests/EmployeeManagement.IntegrationTests.csproj reference src/backend/EmployeeManagement.Infrastructure/EmployeeManagement.Infrastructure.csproj

Write-Host "All commands completed successfully."
