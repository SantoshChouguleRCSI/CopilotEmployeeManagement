using EmployeeManagement.Domain.Entities;
using EmployeeManagement.Infrastructure.Persistence;
using EmployeeManagement.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.UnitTests.Infrastructure;

public class EmployeeRepositorySearchTests
{
    private static EmployeeDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<EmployeeDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new EmployeeDbContext(options);
    }

    private static Employee CreateEmployee(string firstName, string lastName, string email)
        => Employee.Create(firstName, lastName, email, "Engineering", "Developer", 50000m, new DateOnly(2020, 1, 1));

    [Fact]
    public async Task GetAllAsync_WithEmptySearch_ReturnsAllEmployees()
    {
        await using var context = CreateContext();
        context.Employees.AddRange(
            CreateEmployee("John", "Smith", "john.smith@example.com"),
            CreateEmployee("Jane", "Doe", "jane.doe@example.com"));
        await context.SaveChangesAsync();
        var repository = new EmployeeRepository(context);

        var result = await repository.GetAllAsync(search: null);

        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task GetAllAsync_SearchByPartialName_IsCaseInsensitive()
    {
        await using var context = CreateContext();
        context.Employees.AddRange(
            CreateEmployee("John", "Smith", "john.smith@example.com"),
            CreateEmployee("Jane", "Doe", "jane.doe@example.com"));
        await context.SaveChangesAsync();
        var repository = new EmployeeRepository(context);

        var result = await repository.GetAllAsync(search: "JOHN");

        var employee = Assert.Single(result);
        Assert.Equal("John", employee.FirstName);
    }

    [Fact]
    public async Task GetAllAsync_SearchByPartialEmail_ReturnsMatchingEmployee()
    {
        await using var context = CreateContext();
        context.Employees.AddRange(
            CreateEmployee("John", "Smith", "john.smith@example.com"),
            CreateEmployee("Jane", "Doe", "jane.doe@example.com"));
        await context.SaveChangesAsync();
        var repository = new EmployeeRepository(context);

        var result = await repository.GetAllAsync(search: "jane.doe");

        var employee = Assert.Single(result);
        Assert.Equal("Jane", employee.FirstName);
    }

    [Fact]
    public async Task GetAllAsync_SearchWithNoMatches_ReturnsEmpty()
    {
        await using var context = CreateContext();
        context.Employees.Add(CreateEmployee("John", "Smith", "john.smith@example.com"));
        await context.SaveChangesAsync();
        var repository = new EmployeeRepository(context);

        var result = await repository.GetAllAsync(search: "nonexistent");

        Assert.Empty(result);
    }
}
