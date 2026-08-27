using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Employees.Requests;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.Application.Employees;

public sealed class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repository;

    public EmployeeService(IEmployeeRepository repository) => _repository = repository;

    public async Task<EmployeeDto> CreateAsync(CreateEmployeeRequest request, CancellationToken cancellationToken = default)
    {
        var employee = Employee.Create(
            request.FirstName,
            request.LastName,
            request.Email,
            request.Department,
            request.JobTitle,
            request.Salary,
            request.DateOfJoining);

        await _repository.AddAsync(employee, cancellationToken);
        return ToDto(employee);
    }

    public async Task<EmployeeDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var employee = await _repository.GetByIdAsync(id, cancellationToken);
        return employee is null ? null : ToDto(employee);
    }

    public async Task<IReadOnlyList<EmployeeDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var employees = await _repository.GetAllAsync(cancellationToken);
        return employees.Select(ToDto).ToList();
    }

    public async Task<EmployeeDto> UpdateAsync(Guid id, UpdateEmployeeRequest request, CancellationToken cancellationToken = default)
    {
        var employee = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Employee {id} not found.");

        employee.UpdateDetails(
            request.FirstName,
            request.LastName,
            request.Email,
            request.Department,
            request.JobTitle);

        employee.UpdateSalary(request.Salary);

        await _repository.UpdateAsync(employee, cancellationToken);
        return ToDto(employee);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var employee = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Employee {id} not found.");

        await _repository.DeleteAsync(employee.Id, cancellationToken);
    }

    private static EmployeeDto ToDto(Employee e) => new(
        e.Id,
        e.FirstName,
        e.LastName,
        e.Email,
        e.Department,
        e.JobTitle,
        e.Salary,
        e.DateOfJoining,
        e.IsActive,
        e.CreatedAt,
        e.UpdatedAt);
}
