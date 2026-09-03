using EmployeeManagement.Application.Departments;
using EmployeeManagement.Application.Departments.Requests;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.UnitTests.Departments;

public class DepartmentServiceTests
{
    private sealed class FakeDepartmentRepository : IDepartmentRepository
    {
        private readonly List<Department> _departments = [];

        public Task<Department?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
            => Task.FromResult(_departments.SingleOrDefault(department => department.Id == id));

        public Task<IReadOnlyList<Department>> GetAllAsync(CancellationToken cancellationToken = default)
            => Task.FromResult<IReadOnlyList<Department>>(_departments.ToList());

        public Task<bool> ExistsWithNameAsync(string name, Guid? excludingId = null, CancellationToken cancellationToken = default)
            => Task.FromResult(_departments.Any(department =>
                department.Name.Equals(name.Trim(), StringComparison.OrdinalIgnoreCase) &&
                department.Id != excludingId));

        public Task AddAsync(Department department, CancellationToken cancellationToken = default)
        {
            _departments.Add(department);
            return Task.CompletedTask;
        }

        public Task UpdateAsync(Department department, CancellationToken cancellationToken = default)
            => Task.CompletedTask;

        public Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            _departments.RemoveAll(department => department.Id == id);
            return Task.CompletedTask;
        }
    }

    [Fact]
    public async Task DepartmentLifecycle_CreatesReadsUpdatesAndDeletesDepartment()
    {
        var service = new DepartmentService(new FakeDepartmentRepository());

        var created = await service.CreateAsync(new CreateDepartmentRequest("Engineering", "Builds products"));
        var retrieved = await service.GetByIdAsync(created.Id);
        var updated = await service.UpdateAsync(
            created.Id,
            new UpdateDepartmentRequest("Engineering", "Builds and maintains products"));
        await service.DeleteAsync(created.Id);
        var departments = await service.GetAllAsync();

        Assert.NotNull(retrieved);
        Assert.Equal("Engineering", retrieved.Name);
        Assert.Equal("Builds and maintains products", updated.Description);
        Assert.Empty(departments);
    }

    [Fact]
    public async Task CreateAsync_WithDuplicateNameIgnoringCaseAndWhitespace_ThrowsArgumentException()
    {
        var service = new DepartmentService(new FakeDepartmentRepository());

        await service.CreateAsync(new CreateDepartmentRequest("Engineering", "Builds products"));

        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => service.CreateAsync(new CreateDepartmentRequest(" engineering ", "Duplicate")));

        Assert.Equal("name", exception.ParamName);
    }

    [Fact]
    public async Task UpdateAsync_WithItsExistingName_AllowsTheUpdate()
    {
        var service = new DepartmentService(new FakeDepartmentRepository());
        var department = await service.CreateAsync(new CreateDepartmentRequest("Engineering", "Original"));

        var updated = await service.UpdateAsync(
            department.Id,
            new UpdateDepartmentRequest(" Engineering ", "Updated description"));

        Assert.Equal("Engineering", updated.Name);
        Assert.Equal("Updated description", updated.Description);
    }
}