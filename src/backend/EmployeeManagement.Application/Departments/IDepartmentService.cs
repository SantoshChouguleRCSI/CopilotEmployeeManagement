using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Departments.Requests;

namespace EmployeeManagement.Application.Departments;

public interface IDepartmentService
{
    Task<DepartmentDto> CreateAsync(CreateDepartmentRequest request, CancellationToken cancellationToken = default);
    Task<DepartmentDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<DepartmentDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<DepartmentDto> UpdateAsync(Guid id, UpdateDepartmentRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
