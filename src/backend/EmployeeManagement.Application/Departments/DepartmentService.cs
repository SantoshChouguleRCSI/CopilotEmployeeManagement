using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Departments.Requests;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.Application.Departments;

public sealed class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _repository;

    public DepartmentService(IDepartmentRepository repository) => _repository = repository;

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureNameIsUniqueAsync(request.Name, cancellationToken: cancellationToken);

        var department = Department.Create(request.Name, request.Description);
        await _repository.AddAsync(department, cancellationToken);
        return ToDto(department);
    }

    public async Task<DepartmentDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var department = await _repository.GetByIdAsync(id, cancellationToken);
        return department is null ? null : ToDto(department);
    }

    public async Task<IReadOnlyList<DepartmentDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var departments = await _repository.GetAllAsync(cancellationToken);
        return departments.Select(ToDto).ToList();
    }

    public async Task<DepartmentDto> UpdateAsync(Guid id, UpdateDepartmentRequest request, CancellationToken cancellationToken = default)
    {
        var department = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Department {id} not found.");

        await EnsureNameIsUniqueAsync(request.Name, id, cancellationToken);

        department.Update(request.Name, request.Description);
        await _repository.UpdateAsync(department, cancellationToken);
        return ToDto(department);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var department = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Department {id} not found.");

        await _repository.DeleteAsync(department.Id, cancellationToken);
    }

    private async Task EnsureNameIsUniqueAsync(string name, Guid? excludingId = null, CancellationToken cancellationToken = default)
    {
        if (await _repository.ExistsWithNameAsync(name, excludingId, cancellationToken))
            throw new ArgumentException("A department with this name already exists.", nameof(name));
    }

    private static DepartmentDto ToDto(Department d) => new(
        d.Id,
        d.Name,
        d.Description,
        d.CreatedAt,
        d.UpdatedAt);
}
