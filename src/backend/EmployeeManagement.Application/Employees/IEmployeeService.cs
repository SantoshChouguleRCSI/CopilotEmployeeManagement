using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Employees.Requests;

namespace EmployeeManagement.Application.Employees;

public interface IEmployeeService
{
    Task<EmployeeDto> CreateAsync(CreateEmployeeRequest request, CancellationToken cancellationToken = default);
    Task<EmployeeDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<EmployeeDto>> GetAllAsync(string? search = null, CancellationToken cancellationToken = default);
    Task<EmployeeDto> UpdateAsync(Guid id, UpdateEmployeeRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
