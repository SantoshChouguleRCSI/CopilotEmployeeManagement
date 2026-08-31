using EmployeeManagement.Application.Employees;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.UnitTests.Employees;

public class EmployeeServiceTests
{
    private static Employee CreateEmployee(string firstName, string lastName, string email)
        => Employee.Create(firstName, lastName, email, "Engineering", "Developer", 50000m, new DateOnly(2020, 1, 1));

    private sealed class FakeEmployeeRepository : IEmployeeRepository
    {
        private readonly List<Employee> _employees;

        public FakeEmployeeRepository(IEnumerable<Employee> employees) => _employees = employees.ToList();

        public Task<Employee?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
            => Task.FromResult(_employees.SingleOrDefault(e => e.Id == id));

        public Task<IReadOnlyList<Employee>> GetAllAsync(string? search = null, CancellationToken cancellationToken = default)
        {
            IEnumerable<Employee> result = _employees;

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                result = result.Where(e =>
                    e.FirstName.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                    e.LastName.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                    e.Email.Contains(term, StringComparison.OrdinalIgnoreCase));
            }

            return Task.FromResult<IReadOnlyList<Employee>>(result.ToList());
        }

        public Task AddAsync(Employee employee, CancellationToken cancellationToken = default) => Task.CompletedTask;

        public Task UpdateAsync(Employee employee, CancellationToken cancellationToken = default) => Task.CompletedTask;

        public Task DeleteAsync(Guid id, CancellationToken cancellationToken = default) => Task.CompletedTask;
    }

    [Fact]
    public async Task GetAllAsync_WithoutSearch_ReturnsAllEmployees()
    {
        var employees = new[]
        {
            CreateEmployee("John", "Smith", "john.smith@example.com"),
            CreateEmployee("Jane", "Doe", "jane.doe@example.com"),
        };
        var service = new EmployeeService(new FakeEmployeeRepository(employees));

        var result = await service.GetAllAsync();

        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task GetAllAsync_WithSearchMatchingName_ReturnsMatchingEmployee()
    {
        var employees = new[]
        {
            CreateEmployee("John", "Smith", "john.smith@example.com"),
            CreateEmployee("Jane", "Doe", "jane.doe@example.com"),
        };
        var service = new EmployeeService(new FakeEmployeeRepository(employees));

        var result = await service.GetAllAsync("john");

        var employee = Assert.Single(result);
        Assert.Equal("John", employee.FirstName);
    }

    [Fact]
    public async Task GetAllAsync_WithSearchMatchingEmail_ReturnsMatchingEmployee()
    {
        var employees = new[]
        {
            CreateEmployee("John", "Smith", "john.smith@example.com"),
            CreateEmployee("Jane", "Doe", "jane.doe@example.com"),
        };
        var service = new EmployeeService(new FakeEmployeeRepository(employees));

        var result = await service.GetAllAsync("jane.doe");

        var employee = Assert.Single(result);
        Assert.Equal("Jane", employee.FirstName);
    }

    [Fact]
    public async Task GetAllAsync_SearchIsCaseInsensitive()
    {
        var employees = new[]
        {
            CreateEmployee("John", "Smith", "john.smith@example.com"),
        };
        var service = new EmployeeService(new FakeEmployeeRepository(employees));

        var result = await service.GetAllAsync("JOHN");

        Assert.Single(result);
    }

    [Fact]
    public async Task GetAllAsync_NoMatches_ReturnsEmptyList()
    {
        var employees = new[]
        {
            CreateEmployee("John", "Smith", "john.smith@example.com"),
        };
        var service = new EmployeeService(new FakeEmployeeRepository(employees));

        var result = await service.GetAllAsync("nonexistent");

        Assert.Empty(result);
    }
}
